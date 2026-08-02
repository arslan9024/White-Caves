/**
 * app/api/auth/route.ts — Auth API Route Handler (Next.js 15 App Router)
 *
 * Migrates the Express auth routes (/api/auth/login, /api/auth/me) to
 * Next.js API Route Handlers. Mirrors the Express JWT + bcrypt pattern
 * from server/routes/auth.ts — same DB, same token format, same env vars.
 *
 * POST /api/auth       — login → returns JWT
 * GET  /api/auth       — verify token → returns current user
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma, safeQuery } from '@/lib/prisma';

// ─── Env ──────────────────────────────────────────────────────────────────────

const JWT_SECRET         = process.env.JWT_SECRET ?? 'wc-dev-secret-change-in-production';
const JWT_EXPIRES_SECONDS = parseInt(process.env.JWT_EXPIRES_SECONDS ?? '86400', 10);

// ─── Lightweight JWT (Edge-safe, no jsonwebtoken package) ────────────────────
// Next.js recommends jose or the Web Crypto API for edge-compatible JWT.
// We use a simple HS256 implementation using Node.js crypto (server runtime).

import { createHmac, timingSafeEqual, randomBytes } from 'crypto';

function base64url(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function signJwt(payload: Record<string, unknown>, secret: string, expiresInSeconds: number): string {
  const header  = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body    = base64url(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + expiresInSeconds }));
  const sig     = base64url(createHmac('sha256', secret).update(`${header}.${body}`).digest());
  return `${header}.${body}.${sig}`;
}

function verifyJwt(token: string, secret: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const expectedSig = base64url(createHmac('sha256', secret).update(`${header}.${body}`).digest());
    const a = Buffer.from(sig);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return decoded;
  } catch {
    return null;
  }
}

// ─── Bcrypt (server runtime only) ────────────────────────────────────────────

async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  try {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

// ─── User shape ───────────────────────────────────────────────────────────────

interface DbUser {
  id: string;
  email: string;
  name?: string | null;
  password?: string | null;
  role?: string | null;
  isActive?: boolean | null;
}

// ─── POST /api/auth — Login ───────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON', code: 'INVALID_BODY' }, { status: 400 });
  }

  const { email, password } = body as Record<string, unknown>;

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: '`email` is required', code: 'VALIDATION_ERROR' }, { status: 422 });
  }
  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: '`password` is required', code: 'VALIDATION_ERROR' }, { status: 422 });
  }

  const user = await safeQuery<DbUser | null>(
    async (db) => {
      // @ts-expect-error — model inferred at runtime
      return db.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        select: { id: true, email: true, name: true, password: true, role: true, isActive: true },
      });
    },
    null
  );

  if (!user) {
    // Constant-time rejection to prevent user enumeration
    await new Promise(r => setTimeout(r, 120 + Math.floor(Math.random() * 80)));
    return NextResponse.json({ error: 'Invalid credentials', code: 'AUTH_FAILED' }, { status: 401 });
  }

  if (user.isActive === false) {
    return NextResponse.json({ error: 'Account disabled', code: 'ACCOUNT_DISABLED' }, { status: 403 });
  }

  const passwordValid = user.password
    ? await verifyPassword(password, user.password)
    : false;

  if (!passwordValid) {
    return NextResponse.json({ error: 'Invalid credentials', code: 'AUTH_FAILED' }, { status: 401 });
  }

  const token = signJwt(
    { sub: user.id, email: user.email, role: user.role ?? 'agent' },
    JWT_SECRET,
    JWT_EXPIRES_SECONDS
  );

  const response = NextResponse.json({
    data: {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
      expiresIn: JWT_EXPIRES_SECONDS,
    },
  }, { status: 200 });

  // Set httpOnly cookie for browser clients
  response.cookies.set('wc_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: JWT_EXPIRES_SECONDS,
    path: '/',
  });

  return response;
}

// ─── GET /api/auth — Verify Token / Me ───────────────────────────────────────

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cookieToken = request.cookies.get('wc_token')?.value;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : cookieToken;

  if (!token) {
    return NextResponse.json({ error: 'No token provided', code: 'UNAUTHORIZED' }, { status: 401 });
  }

  const payload = verifyJwt(token, JWT_SECRET);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired token', code: 'TOKEN_INVALID' }, { status: 401 });
  }

  const user = await safeQuery<DbUser | null>(
    async (db) => {
      // @ts-expect-error — model inferred at runtime
      return db.user.findUnique({
        where: { id: String(payload.sub) },
        select: { id: true, email: true, name: true, role: true, isActive: true },
      });
    },
    null
  );

  if (!user || user.isActive === false) {
    return NextResponse.json({ error: 'User not found', code: 'USER_NOT_FOUND' }, { status: 401 });
  }

  return NextResponse.json({
    data: { id: user.id, email: user.email, name: user.name, role: user.role },
  }, { status: 200 });
}

// ─── DELETE /api/auth — Logout ────────────────────────────────────────────────

export async function DELETE() {
  const response = NextResponse.json({ message: 'Logged out' }, { status: 200 });
  response.cookies.set('wc_token', '', { maxAge: 0, path: '/' });
  return response;
}

export const dynamic = 'force-dynamic';
