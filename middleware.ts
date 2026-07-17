// @ts-nocheck
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_invera_capital_enterprise_secret_key_2026';
const key = new TextEncoder().encode(JWT_SECRET);

const rateLimitMap = new Map<string, { count: number, resetAt: number }>();
const RATE_LIMIT = 100; // max requests
const WINDOW_MS = 60 * 1000; // 1 minute

export async function middleware(request: NextRequest) {
  const ip = request.ip || '127.0.0.1';
  const now = Date.now();
  
  // Rate Limiting Logic
  const rateLimitState = rateLimitMap.get(ip);
  if (rateLimitState) {
    if (now > rateLimitState.resetAt) {
      rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    } else {
      if (rateLimitState.count > RATE_LIMIT) {
        return new NextResponse('Too Many Requests', { status: 429 });
      }
      rateLimitMap.set(ip, { count: rateLimitState.count + 1, resetAt: rateLimitState.resetAt });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }

  // Security Headers (XSS, Clickjacking, MIME sniffing protection)
  const response = NextResponse.next();
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Role-based Middleware
  const pathname = request.nextUrl.pathname;
  
  if (pathname.startsWith('/yesadmin786/')) {
    const adminToken = request.cookies.get('admin_token')?.value;
    if (!adminToken) {
      return NextResponse.redirect(new URL('/yesadmin786', request.url));
    }
    try {
      const { payload } = await jwtVerify(adminToken, key);
      // Validate Admin role
      if (payload.role !== 'SUPER_ADMIN' && payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/yesadmin786', request.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL('/yesadmin786', request.url));
    }
  }

  // User Dashboard Protection
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password') || pathname.startsWith('/reset-password') || pathname.startsWith('/verify');
  const isPublicRoute = isAuthRoute || pathname.startsWith('/yesadmin786');
  
  if (!isPublicRoute && !pathname.includes('.')) {
    const userToken = request.cookies.get('invera_auth_token')?.value;
    
    if (!userToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify JWT on Edge
      await jwtVerify(userToken, key);
    } catch (err) {
      // Invalid or expired token
      const redirectResp = NextResponse.redirect(new URL('/login', request.url));
      redirectResp.cookies.delete('invera_auth_token');
      return redirectResp;
    }
  }

  // Redirect away from Auth routes if already logged in
  if (isAuthRoute) {
    const userToken = request.cookies.get('invera_auth_token')?.value;
    if (userToken) {
      try {
        await jwtVerify(userToken, key);
        return NextResponse.redirect(new URL('/', request.url));
      } catch (err) {
        // Just let them continue to auth route, token is invalid
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
