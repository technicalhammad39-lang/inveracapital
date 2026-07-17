import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import prisma from './prisma'; // assuming standard prisma export

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_invera_capital_enterprise_secret_key_2026';
const key = new TextEncoder().encode(JWT_SECRET);

export interface AuthSession {
  userId: string;
  role?: string;
  email: string;
  jti?: string;
}

// -----------------------------------------------------------------------------
// PASSWORD HASHING
// -----------------------------------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Enterprise standard
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// -----------------------------------------------------------------------------
// JWT SESSION TOKENS
// -----------------------------------------------------------------------------

export async function createSessionToken(payload: AuthSession, expiresIn: string = '7d'): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(payload.jti || crypto.randomUUID())
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as AuthSession;
  } catch (error) {
    return null;
  }
}

// -----------------------------------------------------------------------------
// SERVER ACTION UTILS
// -----------------------------------------------------------------------------

/**
 * Creates a secure HTTP-Only cookie for the authenticated user and stores the session in DB
 */
export async function initializeUserSession(userId: string, email: string, role?: string, ipAddress?: string, userAgent?: string) {
  const jti = crypto.randomUUID();
  const token = await createSessionToken({ userId, email, role, jti });
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  // Store in database
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      isCurrent: true,
    }
  });

  // Set HTTP-only secure cookie
  const cookieStore = await cookies();
  cookieStore.set('invera_auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // to allow redirects
    expires: expiresAt,
    path: '/',
  });

  return token;
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('invera_auth_token')?.value;

  if (token) {
    // Invalidate in DB
    try {
      await prisma.session.update({
        where: { token },
        data: { isCurrent: false }
      });
    } catch (e) {
      // Token might not exist or already be deleted
    }
  }

  cookieStore.delete('invera_auth_token');
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('invera_auth_token')?.value;

  if (!token) return null;

  const sessionData = await verifySessionToken(token);
  if (!sessionData) return null;

  // Optional: check if session is still active in DB
  const dbSession = await prisma.session.findUnique({
    where: { token },
    select: { isCurrent: true, expiresAt: true }
  });

  if (!dbSession || !dbSession.isCurrent || dbSession.expiresAt < new Date()) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionData.userId },
    include: { profile: true, role: true }
  });

  if (!user) {
    return null;
  }

  return user;
}
