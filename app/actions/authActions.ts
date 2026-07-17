'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { verifyPassword, hashPassword, initializeUserSession, clearUserSession, getCurrentUser } from '@/lib/auth';

export async function logoutUser() {
  await clearUserSession();
}

export async function fetchCurrentUser() {
  const user = await getCurrentUser();
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    firstName: user.profile?.firstName || '',
    lastName: user.profile?.lastName || '',
    avatarUrl: user.profile?.avatarUrl || null,
  };
}

const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(8),
});

export async function loginUser(data: z.infer<typeof loginSchema>) {
  try {
    const { identifier, password } = loginSchema.parse(data);

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier.toLowerCase() }
        ]
      },
      include: { role: true }
    });

    if (!user) {
      return { error: 'Invalid email/username or password.' };
    }

    if (user.status !== 'ACTIVE') {
      return { error: 'This account has been suspended or banned.' };
    }

    if (!user.passwordHash) {
      return { error: 'Please login using your linked social provider.' };
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return { error: 'Invalid email/username or password.' };
    }

    // Set secure HTTP-only cookies & save session to DB
    await initializeUserSession(user.id, user.email, user.role?.name);

    return { success: true };
  } catch (error) {
    console.error('Login Error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}

// -----------------------------------------------------------------------------
// REGISTER USER
// -----------------------------------------------------------------------------

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().min(2),
  password: z.string().min(8),
  referralCode: z.string().optional(),
});

export async function registerUser(data: any) {
  try {
    const parsedData = registerSchema.parse(data);

    // Check existing email
    const existingEmail = await prisma.user.findUnique({
      where: { email: parsedData.email.toLowerCase() }
    });

    if (existingEmail) {
      return { error: 'Email is already registered.' };
    }

    // Hash password
    const passwordHash = await hashPassword(parsedData.password);

    // Handle Referral logic
    let referredByLinkId = null;
    if (parsedData.referralCode) {
      const referralLink = await prisma.referralLink.findUnique({
        where: { code: parsedData.referralCode }
      });
      if (referralLink) {
        referredByLinkId = referralLink.id;
      }
    }

    // Generate base username
    const baseUsername = parsedData.firstName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || parsedData.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    
    // Create user in transaction
    const newUser = await prisma.$transaction(async (tx) => {
      let username = baseUsername;
      let counter = 1;
      
      // Ensure unique username
      while (await tx.user.findUnique({ where: { username } })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      const user = await tx.user.create({
        data: {
          email: parsedData.email.toLowerCase(),
          username,
          passwordHash,
          provider: 'LOCAL',
          referredByLinkId,
          profile: {
            create: {
              firstName: parsedData.firstName,
              lastName: parsedData.lastName,
              phone: parsedData.phone,
              country: parsedData.country,
            }
          },
          wallet: {
            create: { balance: 0 } // Initialize wallet
          },
          kyc: {
            create: { status: 'PENDING', level: 1 } // Initialize KYC tracking
          }
        }
      });
      
      // Auto-generate referral link for the new user
      const uidSuffix = user.id.split('-')[0].toUpperCase();
      const rawFirstName = parsedData.firstName.replace(/[^a-zA-Z0-9]/g, '');
      const fallbackName = rawFirstName || 'User';
      const refCode = `${fallbackName}_INV${uidSuffix}`;

      await tx.referralLink.create({
        data: {
          userId: user.id,
          code: refCode,
        }
      });

      return user;
    });

    // TODO: Send Welcome & Verification Email via automation hooks

    // Log user in automatically
    await initializeUserSession(newUser.id, newUser.email, undefined);

    return { success: true };
  } catch (error) {
    console.error('Registration Error:', error);
    return { error: 'Failed to create account. Please try again later.' };
  }
}

// -----------------------------------------------------------------------------
// REQUEST PASSWORD RESET
// -----------------------------------------------------------------------------

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Return success anyway to prevent email enumeration
      return { success: true };
    }

    if (user.provider === 'GOOGLE') {
      return { error: 'This account uses Google Sign-In. Password reset is not available.' };
    }

    // Delete existing reset tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { identifier: user.email, type: 'PASSWORD_RESET' }
    });

    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        type: 'PASSWORD_RESET',
        expiresAt
      }
    });

    // TODO: Actually send the email here using lib/email
    // const { sendEmail } = await import('@/lib/email');
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Reset Your Password - Invera Capital',
    //   templateName: 'PASSWORD_RESET',
    //   templateData: { resetLink: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}` }
    // });

    return { success: true };
  } catch (error) {
    console.error('Password Reset Error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}

// -----------------------------------------------------------------------------
// EXECUTE PASSWORD RESET
// -----------------------------------------------------------------------------

export async function executePasswordReset({ token, newPassword }: any) {
  try {
    const vToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!vToken || vToken.type !== 'PASSWORD_RESET') {
      return { error: 'Invalid or expired reset token.' };
    }

    if (vToken.expiresAt < new Date()) {
      return { error: 'Reset token has expired.' };
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.$transaction(async (tx) => {
      // Update password
      await tx.user.update({
        where: { email: vToken.identifier },
        data: { passwordHash }
      });

      // Invalidate all existing active sessions
      const user = await tx.user.findUnique({ where: { email: vToken.identifier } });
      if (user) {
        await tx.session.updateMany({
          where: { userId: user.id },
          data: { isCurrent: false, expiresAt: new Date() }
        });
      }

      // Delete the used token
      await tx.verificationToken.delete({
        where: { id: vToken.id }
      });
    });

    return { success: true };
  } catch (error) {
    console.error('Password Reset Execute Error:', error);
    return { error: 'Something went wrong while resetting your password.' };
  }
}

// -----------------------------------------------------------------------------
// VERIFY EMAIL ADDRESS
// -----------------------------------------------------------------------------

export async function verifyEmailAddress(token: string) {
  try {
    const vToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!vToken || vToken.type !== 'EMAIL_VERIFY') {
      return { error: 'Invalid or expired verification token.' };
    }

    if (vToken.expiresAt < new Date()) {
      return { error: 'Verification token has expired. Please request a new one.' };
    }

    await prisma.$transaction(async (tx) => {
      // Mark email as verified
      await tx.user.update({
        where: { email: vToken.identifier },
        data: { emailVerified: new Date() }
      });

      // Delete the used token
      await tx.verificationToken.delete({
        where: { id: vToken.id }
      });
    });

    return { success: true };
  } catch (error) {
    console.error('Email Verify Error:', error);
    return { error: 'Something went wrong while verifying your email.' };
  }
}

// -----------------------------------------------------------------------------
// GOOGLE OAUTH
// -----------------------------------------------------------------------------

export async function getGoogleAuthUrl() {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '63566941878-u6p6q9ukp43r9qed8b8hmvekv96muj9e.apps.googleusercontent.com';
  const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback` : 'http://localhost:3000/api/auth/google/callback';

  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: REDIRECT_URI,
    client_id: GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const qs = new URLSearchParams(options);
  return { url: `${rootUrl}?${qs.toString()}` };
}
