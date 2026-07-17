import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { initializeUserSession } from '@/lib/auth';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback` : 'http://localhost:3000/api/auth/google/callback';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=Google login failed: ${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=No authorization code provided', request.url));
  }

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Google Token Error:', tokenData);
      return NextResponse.redirect(new URL('/login?error=Failed to authenticate with Google', request.url));
    }

    // 2. Fetch user profile with the access token
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const googleUser = await userResponse.json();

    if (!googleUser.email) {
      return NextResponse.redirect(new URL('/login?error=Google account does not have an email address', request.url));
    }

    // 3. Find or Create User in DB
    const email = googleUser.email.toLowerCase();
    let user = await prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });

    if (!user) {
      // Create new user via Google
      user = await prisma.$transaction(async (tx) => {
        // Generate a random username based on email/name
        const baseUsername = googleUser.name ? googleUser.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
        let username = baseUsername;
        
        // Ensure username is unique
        let counter = 1;
        while (await tx.user.findUnique({ where: { username } })) {
          username = `${baseUsername}${counter}`;
          counter++;
        }

        const newUser = await tx.user.create({
          data: {
            email,
            username,
            provider: 'GOOGLE',
            providerId: googleUser.id,
            emailVerified: new Date(), // Google emails are verified
            profile: {
              create: {
                firstName: googleUser.given_name || 'Google',
                lastName: googleUser.family_name || 'User',
                avatarUrl: googleUser.picture || null,
              }
            },
            wallet: {
              create: { balance: 0 }
            },
            kyc: {
              create: { status: 'PENDING', level: 1 }
            }
          },
          include: { role: true }
        });

        // Auto-generate referral link
        await tx.referralLink.create({
          data: {
            userId: newUser.id,
            code: username,
          }
        });

        return newUser;
      });
    } else {
      // User exists, but let's ensure provider is updated if it wasn't
      if (user.provider !== 'GOOGLE') {
        await prisma.user.update({
          where: { id: user.id },
          data: { provider: 'GOOGLE', providerId: googleUser.id }
        });
      }
    }

    // 4. Initialize Secure Session Cookie
    await initializeUserSession(user.id, user.email, user.role?.name);

    // 5. Redirect to Dashboard (Root route)
    const redirectUrl = new URL('/', request.url);
    const response = NextResponse.redirect(redirectUrl);
    
    // We already set the cookie in `initializeUserSession` which uses `next/headers` cookies().
    // Let's verify it works with redirect. `cookies().set` in a server action/route handler works seamlessly in Next.js 14+.

    return response;

  } catch (error) {
    console.error('Google OAuth Callback Error:', error);
    return NextResponse.redirect(new URL('/login?error=An unexpected error occurred during Google Sign-In', request.url));
  }
}
