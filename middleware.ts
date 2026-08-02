/**
 * middleware.ts — Edge Auth Middleware (Next.js 15 App Router)
 *
 * Protects administrative and CRM routes (/crm/*).
 * Verifies JWT token from `wc_token` cookie or `Authorization` header.
 */

import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/api/auth', '/api/health', '/', '/properties'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /crm routes
  if (pathname.startsWith('/crm')) {
    const token =
      request.cookies.get('wc_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      const loginUrl = new URL('/', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/crm/:path*'],
};
