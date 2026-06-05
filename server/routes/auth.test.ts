/**
 * Auth Routes — Unit Tests
 * Tests /api/auth endpoints: login, register, verify-2fa, profile, password, logout, firebase-sync
 * All Prisma calls are mocked — no database needed.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma, mockBcrypt, mockJwt } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      user: {
        findUnique: fn().mockResolvedValue(null),
        create: fn().mockResolvedValue({
          id: 'user-1',
          email: 'test@whitecaves.ae',
          name: 'Test User',
          role: 'agent',
          department: 'sales',
          passwordHash: '$2a$10$hashedvalue',
          phone: null,
          photoUrl: null,
          status: 'active',
        }),
        update: fn().mockResolvedValue({
          id: 'user-1',
          email: 'test@whitecaves.ae',
          name: 'Updated',
          role: 'agent',
          phone: null,
          department: 'sales',
          photoUrl: null,
        }),
      },
      activity: {
        create: fn().mockResolvedValue({ id: 'act-1' }),
        findMany: fn().mockResolvedValue([]),
        count: fn().mockResolvedValue(0),
        findFirst: fn().mockResolvedValue(null),
        deleteMany: fn().mockResolvedValue({ count: 0 }),
      },
    },
    mockBcrypt: {
      hash: fn().mockResolvedValue('$2a$10$newhashedpassword'),
      compare: fn().mockResolvedValue(true),
    },
    mockJwt: {
      sign: fn().mockReturnValue('mock-jwt-token'),
    },
  };
});

const { mockVerifyFirebaseIdToken } = vi.hoisted(() => ({
  mockVerifyFirebaseIdToken: vi.fn().mockResolvedValue({
    uid: 'firebase-123',
    email: 'test@whitecaves.ae',
    name: 'Firebase Test',
    picture: 'https://example.com/firebase.jpg',
  }),
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('bcryptjs', () => ({ default: mockBcrypt }));
vi.mock('jsonwebtoken', () => ({ default: mockJwt }));
vi.mock('../config/env', () => ({
  JWT_SECRET: 'test-secret',
  JWT_EXPIRES_SECONDS: 3600,
  BCRYPT_ROUNDS: 10,
}));
vi.mock('../utils/sanitize', () => ({
  sanitizeString: (s: string) => s,
}));
vi.mock('../config/firebaseAdmin.js', () => ({
  verifyFirebaseIdToken: mockVerifyFirebaseIdToken,
  FirebaseAdminInitError: class FirebaseAdminInitError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'FirebaseAdminInitError';
    }
  },
}));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../middleware/errorHandler', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  asyncHandler: (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));
vi.mock('../middleware/auth.js', () => ({
  default: (req: any, _res: any, next: any) => {
    // Auth middleware pass-through for tests — user is set by createApp
    next();
  },
}));

import authRoutes from './auth';

// ── Test app factory ─────────────────────────────────────────────────
function createApp(role: string = 'owner', userId = 'user-1') {
  const app = express();
  app.use(express.json());
  // Minimal inline cookie parser for tests (avoids importing cookie-parser in test env)
  app.use((req: any, _res: any, next: any) => {
    const cookieHeader = req.headers.cookie as string | undefined;
    const cookies: Record<string, string> = {};
    if (cookieHeader) {
      cookieHeader.split(';').forEach((part: string) => {
        const eqIdx = part.indexOf('=');
        if (eqIdx > 0) {
          cookies[part.slice(0, eqIdx).trim()] = decodeURIComponent(part.slice(eqIdx + 1).trim());
        }
      });
    }
    req.cookies = cookies;
    next();
  });
  app.use((req, _res, next) => {
    (req as any).user = { id: userId, email: 'test@whitecaves.ae', role };
    next();
  });
  app.use('/api/auth', authRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

// ═════════════════════════════════════════════════════════════════════

describe('Auth Routes — /api/auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── POST /login ──────────────────────────────────────────────────
  describe('POST /api/auth/login', () => {
    it('returns 400 if email is missing', async () => {
      const res = await request(createApp()).post('/api/auth/login').send({ password: 'Test1234' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/email.*password.*required/i);
    });

    it('returns 400 if password is missing', async () => {
      const res = await request(createApp())
        .post('/api/auth/login')
        .send({ email: 'test@whitecaves.ae' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/email.*password.*required/i);
    });

    it('returns 401 if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp())
        .post('/api/auth/login')
        .send({ email: 'unknown@test.com', password: 'Test1234' });
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid email or password/i);
    });

    it('returns 401 if password is wrong', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test',
        role: 'agent',
        passwordHash: '$2a$10$hashedvalue',
      });
      mockBcrypt.compare.mockResolvedValueOnce(false);
      const res = await request(createApp())
        .post('/api/auth/login')
        .send({ email: 'test@whitecaves.ae', password: 'WrongPass1' });
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid email or password/i);
    });

    it('returns 401 if account has no passwordHash', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test',
        role: 'agent',
        passwordHash: null,
      });
      const res = await request(createApp())
        .post('/api/auth/login')
        .send({ email: 'test@whitecaves.ae', password: 'Test1234' });
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/account not configured/i);
    });

    it('returns 200 with token on successful login', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test User',
        role: 'agent',
        department: 'sales',
        photoUrl: null,
        passwordHash: '$2a$10$validhash',
      });
      mockBcrypt.compare.mockResolvedValueOnce(true);
      const res = await request(createApp())
        .post('/api/auth/login')
        .send({ email: 'test@whitecaves.ae', password: 'Test1234' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBe('mock-jwt-token');
      expect(res.body.data.user.email).toBe('test@whitecaves.ae');
      expect(res.body.requiresTwoFactor).toBe(false);
    });

    it('returns a 2FA challenge when the account has two-factor enabled', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test User',
        role: 'owner',
        department: 'management',
        photoUrl: null,
        passwordHash: '$2a$10$validhash',
        twoFactorEnabled: true,
        twoFactorSecret: 'secret',
      });
      mockBcrypt.compare.mockResolvedValueOnce(true);
      const res = await request(createApp())
        .post('/api/auth/login')
        .send({ email: 'test@whitecaves.ae', password: 'Test1234' });
      expect(res.status).toBe(200);
      expect(res.body.requiresTwoFactor).toBe(true);
      expect(res.body.data.twoFactorToken).toBeDefined();
      expect(res.body.data.token).toBeUndefined();
    });

    it('auto-migrates legacy wc$ password hash on login', async () => {
      const legacyHash = 'wc$' + Buffer.from('Test1234').toString('base64');
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test',
        role: 'agent',
        department: null,
        photoUrl: null,
        passwordHash: legacyHash,
      });
      const res = await request(createApp())
        .post('/api/auth/login')
        .send({ email: 'test@whitecaves.ae', password: 'Test1234' });
      expect(res.status).toBe(200);
      // Should have updated the password hash
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: expect.objectContaining({ passwordHash: expect.any(String) }),
        })
      );
    });

    it('logs activity on successful login', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test User',
        role: 'agent',
        department: null,
        photoUrl: null,
        passwordHash: '$2a$10$validhash',
      });
      mockBcrypt.compare.mockResolvedValueOnce(true);
      await request(createApp())
        .post('/api/auth/login')
        .send({ email: 'test@whitecaves.ae', password: 'Test1234' });
      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'login' }),
        })
      );
    });

    it('enriches successful-login activity with ip + userAgent metadata', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test User',
        role: 'agent',
        department: null,
        photoUrl: null,
        passwordHash: '$2a$10$validhash',
      });
      mockBcrypt.compare.mockResolvedValueOnce(true);
      await request(createApp())
        .post('/api/auth/login')
        .set('User-Agent', 'vitest-suite/1.0')
        .set('X-Forwarded-For', '203.0.113.7, 10.0.0.1')
        .send({ email: 'test@whitecaves.ae', password: 'Test1234' });
      const successCall = mockPrisma.activity.create.mock.calls.find(
        (c: any[]) => c[0]?.data?.action === 'login'
      );
      expect(successCall).toBeDefined();
      expect(successCall[0].data.metadata).toEqual(
        expect.objectContaining({ ip: '203.0.113.7', userAgent: 'vitest-suite/1.0' })
      );
    });

    it('records a login_failed activity when the user is unknown', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      await request(createApp())
        .post('/api/auth/login')
        .set('User-Agent', 'vitest-suite/1.0')
        .send({ email: 'ghost@whitecaves.ae', password: 'Test1234' });
      // fire-and-forget: flush microtasks
      await new Promise(resolve => setImmediate(resolve));
      const failedCall = mockPrisma.activity.create.mock.calls.find(
        (c: any[]) => c[0]?.data?.action === 'login_failed'
      );
      expect(failedCall).toBeDefined();
      expect(failedCall[0].data.metadata).toEqual(
        expect.objectContaining({ reason: 'unknown_user', emailAttempt: 'ghost@whitecaves.ae' })
      );
    });

    it('records a login_failed activity when the password is wrong', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test',
        role: 'agent',
        passwordHash: '$2a$10$hashedvalue',
      });
      mockBcrypt.compare.mockResolvedValueOnce(false);
      await request(createApp())
        .post('/api/auth/login')
        .send({ email: 'test@whitecaves.ae', password: 'WrongPass1' });
      await new Promise(resolve => setImmediate(resolve));
      const failedCall = mockPrisma.activity.create.mock.calls.find(
        (c: any[]) => c[0]?.data?.action === 'login_failed'
      );
      expect(failedCall).toBeDefined();
      expect(failedCall[0].data.metadata.reason).toBe('invalid_password');
      expect(failedCall[0].data.userId).toBe('user-1');
    });

    it('records a login_failed activity when the account is inactive', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test',
        role: 'agent',
        status: 'suspended',
        passwordHash: '$2a$10$hashedvalue',
      });
      const res = await request(createApp())
        .post('/api/auth/login')
        .send({ email: 'test@whitecaves.ae', password: 'Test1234' });
      expect(res.status).toBe(403);
      await new Promise(resolve => setImmediate(resolve));
      const failedCall = mockPrisma.activity.create.mock.calls.find(
        (c: any[]) => c[0]?.data?.action === 'login_failed'
      );
      expect(failedCall).toBeDefined();
      expect(failedCall[0].data.metadata.reason).toBe('inactive');
    });

    it('returns 429 with Retry-After when account is locked out', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test',
        role: 'agent',
        status: 'active',
        passwordHash: '$2a$10$hashedvalue',
      });
      // IP check (first count) → below threshold; account check (second count) → trips lockout
      mockPrisma.activity.count.mockResolvedValueOnce(0).mockResolvedValueOnce(5);
      mockPrisma.activity.findFirst.mockResolvedValueOnce({
        createdAt: new Date(Date.now() - 60 * 1000),
      });
      const res = await request(createApp())
        .post('/api/auth/login')
        .send({ email: 'test@whitecaves.ae', password: 'Test1234' });
      expect(res.status).toBe(429);
      expect(res.body.error).toMatch(/temporarily locked/i);
      expect(res.headers['retry-after']).toBeDefined();
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it('records a login_failed activity with reason=locked_out when locked', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test',
        role: 'agent',
        status: 'active',
        passwordHash: '$2a$10$hashedvalue',
      });
      mockPrisma.activity.count.mockResolvedValueOnce(0).mockResolvedValueOnce(7);
      mockPrisma.activity.findFirst.mockResolvedValueOnce({
        createdAt: new Date(Date.now() - 30 * 1000),
      });
      await request(createApp())
        .post('/api/auth/login')
        .send({ email: 'test@whitecaves.ae', password: 'Test1234' });
      await new Promise(resolve => setImmediate(resolve));
      const failedCall = mockPrisma.activity.create.mock.calls.find(
        (c: any[]) => c[0]?.data?.action === 'login_failed'
      );
      expect(failedCall).toBeDefined();
      expect(failedCall[0].data.metadata.reason).toBe('locked_out');
    });

    it('does NOT lock out when failures are below the threshold', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test',
        role: 'agent',
        status: 'active',
        passwordHash: '$2a$10$hashedvalue',
      });
      mockPrisma.activity.count.mockResolvedValueOnce(0).mockResolvedValueOnce(3);
      mockBcrypt.compare.mockResolvedValueOnce(true);
      const res = await request(createApp())
        .post('/api/auth/login')
        .send({ email: 'test@whitecaves.ae', password: 'Test1234' });
      expect(res.status).toBe(200);
      expect(mockBcrypt.compare).toHaveBeenCalled();
    });

    it('returns 429 when the source IP exceeds the per-IP brute-force threshold', async () => {
      mockPrisma.activity.count.mockResolvedValueOnce(25);
      mockPrisma.activity.findFirst.mockResolvedValueOnce({
        createdAt: new Date(Date.now() - 2 * 60 * 1000),
      });
      const res = await request(createApp())
        .post('/api/auth/login')
        .send({ email: 'whoever@whitecaves.ae', password: 'Anything1' });
      expect(res.status).toBe(429);
      expect(res.body.error).toMatch(/this network/i);
      expect(res.headers['retry-after']).toBeDefined();
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it('records a login_failed activity with reason=ip_locked_out when IP is throttled', async () => {
      mockPrisma.activity.count.mockResolvedValueOnce(30);
      mockPrisma.activity.findFirst.mockResolvedValueOnce({
        createdAt: new Date(Date.now() - 60 * 1000),
      });
      await request(createApp())
        .post('/api/auth/login')
        .send({ email: 'whoever@whitecaves.ae', password: 'Anything1' });
      await new Promise(resolve => setImmediate(resolve));
      const failedCall = mockPrisma.activity.create.mock.calls.find(
        (c: any[]) => c[0]?.data?.action === 'login_failed'
      );
      expect(failedCall).toBeDefined();
      expect(failedCall[0].data.metadata.reason).toBe('ip_locked_out');
    });
  });

  // ── POST /register ───────────────────────────────────────────────
  describe('POST /api/auth/register', () => {
    it('returns 400 if email is missing', async () => {
      const res = await request(createApp())
        .post('/api/auth/register')
        .send({ password: 'StrongPass1' });
      expect(res.status).toBe(400);
    });

    it('returns 400 if password is too short', async () => {
      const res = await request(createApp())
        .post('/api/auth/register')
        .send({ email: 'new@whitecaves.ae', password: 'short' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/at least 8 characters/i);
    });

    it('returns 400 for invalid email format', async () => {
      const res = await request(createApp())
        .post('/api/auth/register')
        .send({ email: 'not-an-email', password: 'StrongPass1' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/valid email/i);
    });

    it('returns 400 if password has no number', async () => {
      const res = await request(createApp())
        .post('/api/auth/register')
        .send({ email: 'new@whitecaves.ae', password: 'NoNumbers' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/letter.*number/i);
    });

    it('returns 400 if password has no letter', async () => {
      const res = await request(createApp())
        .post('/api/auth/register')
        .send({ email: 'new@whitecaves.ae', password: '12345678' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/letter.*number/i);
    });

    it('returns 400 for weak/common password', async () => {
      // 'admin123' passes letter+number check but is in the weak list
      const res = await request(createApp())
        .post('/api/auth/register')
        .send({ email: 'new@whitecaves.ae', password: 'admin123' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/too common/i);
    });

    it('returns 409 if email already registered', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'existing',
        email: 'existing@whitecaves.ae',
      });
      const res = await request(createApp())
        .post('/api/auth/register')
        .send({ email: 'existing@whitecaves.ae', password: 'ValidPass1' });
      expect(res.status).toBe(409);
      expect(res.body.error).toMatch(/already registered/i);
    });

    it('returns 201 on successful client registration with requested role', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce({
        id: 'new-user',
        email: 'new@whitecaves.ae',
        name: 'New User',
        role: 'landlord',
        department: null,
      });
      const res = await request(createApp()).post('/api/auth/register').send({
        email: 'new@whitecaves.ae',
        password: 'ValidPass1',
        name: 'New User',
        category: 'client',
        role: 'landlord',
      });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBe('mock-jwt-token');
      expect(res.body.data.user.role).toBe('landlord');
    });

    it('returns 400 when client signup role is invalid', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp()).post('/api/auth/register').send({
        email: 'hack@test.com',
        password: 'ValidPass1',
        name: 'Hacker',
        category: 'client',
        role: 'owner',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/valid role/i);
    });

    it('registers staff accounts as pending agent', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce({
        id: 'staff-user',
        email: 'staff@whitecaves.ae',
        name: 'Staff User',
        role: 'agent',
        department: null,
        status: 'pending',
      });

      const res = await request(createApp()).post('/api/auth/register').send({
        email: 'staff@whitecaves.ae',
        password: 'ValidPass1',
        name: 'Staff User',
        category: 'staff',
        role: 'leasing-agent',
      });

      expect(res.status).toBe(201);
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ role: 'agent', status: 'pending' }),
        })
      );
    });

    it('logs activity on successful registration', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce({
        id: 'new-user',
        email: 'new@whitecaves.ae',
        name: 'New User',
        role: 'buyer',
        department: null,
      });
      await request(createApp()).post('/api/auth/register').send({
        email: 'new@whitecaves.ae',
        password: 'ValidPass1',
        category: 'client',
        role: 'buyer',
      });
      expect(mockPrisma.activity.create).toHaveBeenCalled();
    });
  });

  // ── POST /verify-2fa ─────────────────────────────────────────────
  describe('POST /api/auth/verify-2fa', () => {
    it('returns 400 if email or code is missing', async () => {
      const res = await request(createApp())
        .post('/api/auth/verify-2fa')
        .send({ email: 'test@whitecaves.ae' });
      expect(res.status).toBe(400);
    });

    it('verifies a code in development bypass mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      const originalBypass = process.env.DEV_2FA_BYPASS;
      process.env.NODE_ENV = 'development';
      process.env.DEV_2FA_BYPASS = 'true';

      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test User',
        role: 'owner',
        passwordHash: '$2a$10$validhash',
        twoFactorEnabled: true,
        twoFactorSecret: 'encrypted-secret',
      });

      const res = await request(createApp())
        .post('/api/auth/verify-2fa')
        .send({ email: 'test@whitecaves.ae', code: '000000' });

      process.env.NODE_ENV = originalEnv;
      process.env.DEV_2FA_BYPASS = originalBypass;

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBe('mock-jwt-token');
    });

    it('returns 400 if code is missing', async () => {
      const res = await request(createApp())
        .post('/api/auth/verify-2fa')
        .send({ email: 'test@whitecaves.ae' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/verification code.*required/i);
    });
  });

  // ── POST /2fa/setup ─────────────────────────────────────────────
  describe('POST /api/auth/2fa/setup', () => {
    it('returns a QR auth URI and stores the encrypted secret', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test User',
        role: 'owner',
        passwordHash: '$2a$10$validhash',
      });

      const res = await request(createApp('owner')).post('/api/auth/2fa/setup').send({});

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.otpAuthUrl).toMatch(/^otpauth:\/\//i);
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: expect.objectContaining({ twoFactorEnabled: false }),
        })
      );
    });
  });

  // ── POST /2fa/disable ───────────────────────────────────────────
  describe('POST /api/auth/2fa/disable', () => {
    it('disables 2FA after password confirmation', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test User',
        role: 'owner',
        passwordHash: '$2a$10$validhash',
        twoFactorEnabled: true,
        twoFactorSecret: 'encrypted-secret',
      });

      const res = await request(createApp('owner'))
        .post('/api/auth/2fa/disable')
        .send({ currentPassword: 'Test1234' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.disabled).toBe(true);
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: expect.objectContaining({ twoFactorEnabled: false, twoFactorSecret: null }),
        })
      );
    });
  });

  // ── GET /profile ─────────────────────────────────────────────────
  describe('GET /api/auth/profile', () => {
    it('returns user profile when authenticated', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test User',
        role: 'owner',
        phone: '+971501234567',
        department: 'management',
        photoUrl: null,
        status: 'active',
        createdAt: new Date(),
        _count: { leadsAssigned: 5, commissions: 3, properties: 10 },
      });
      const res = await request(createApp('owner')).get('/api/auth/profile');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('test@whitecaves.ae');
    });

    it('returns 404 if user not found in database', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner')).get('/api/auth/profile');
      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/user not found/i);
    });
  });

  // ── PATCH /profile ───────────────────────────────────────────────
  describe('PATCH /api/auth/profile', () => {
    it('updates user name', async () => {
      mockPrisma.user.update.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Updated Name',
        role: 'owner',
        phone: null,
        department: null,
        photoUrl: null,
      });
      const res = await request(createApp('owner'))
        .patch('/api/auth/profile')
        .send({ name: 'Updated Name' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 400 if name exceeds 100 characters', async () => {
      const res = await request(createApp('owner'))
        .patch('/api/auth/profile')
        .send({ name: 'A'.repeat(101) });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/100 characters/i);
    });

    it('returns 400 if phone exceeds 30 characters', async () => {
      const res = await request(createApp('owner'))
        .patch('/api/auth/profile')
        .send({ phone: '1'.repeat(31) });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/30 characters/i);
    });

    it('returns 400 for invalid photo URL', async () => {
      const res = await request(createApp('owner'))
        .patch('/api/auth/profile')
        .send({ photoUrl: 'not-a-url' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/valid HTTP/i);
    });

    it('accepts valid photo URL', async () => {
      mockPrisma.user.update.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test',
        role: 'owner',
        phone: null,
        department: null,
        photoUrl: 'https://example.com/photo.jpg',
      });
      const res = await request(createApp('owner'))
        .patch('/api/auth/profile')
        .send({ photoUrl: 'https://example.com/photo.jpg' });
      expect(res.status).toBe(200);
    });
  });

  // ── POST /firebase-sync ──────────────────────────────────────────
  describe('POST /api/auth/firebase-sync', () => {
    it('returns 400 if firebaseUid is missing', async () => {
      const res = await request(createApp())
        .post('/api/auth/firebase-sync')
        .send({ email: 'test@whitecaves.ae' });
      expect(res.status).toBe(400);
    });

    it('returns 400 when firebaseToken is missing', async () => {
      const res = await request(createApp())
        .post('/api/auth/firebase-sync')
        .send({ firebaseUid: 'firebase-123', email: 'test@whitecaves.ae' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/firebase token is required/i);
    });

    it('returns 200 and JWT when firebase token is valid', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test User',
        role: 'agent',
        department: 'sales',
        photoUrl: null,
        status: 'active',
        passwordHash: null,
      });
      mockPrisma.user.update.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Firebase Test',
        role: 'agent',
        department: 'sales',
        photoUrl: 'https://example.com/firebase.jpg',
      });

      const res = await request(createApp()).post('/api/auth/firebase-sync').send({
        firebaseUid: 'firebase-123',
        firebaseToken: 'valid-token',
        email: 'test@whitecaves.ae',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBe('mock-jwt-token');
      expect(mockVerifyFirebaseIdToken).toHaveBeenCalledWith('valid-token');
    });

    it('uses development fallback when Firebase Admin is unavailable', async () => {
      process.env.NODE_ENV = 'development';
      process.env.ALLOW_FIREBASE_SYNC_DEV_FALLBACK = 'true';

      const adminInitError = new Error('Firebase Admin SDK has not been initialized');
      adminInitError.name = 'FirebaseAdminInitError';
      mockVerifyFirebaseIdToken.mockRejectedValueOnce(adminInitError);

      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce({
        id: 'user-dev-1',
        email: 'devuser@whitecaves.ae',
        name: 'Dev User',
        role: 'agent',
        department: null,
        photoUrl: null,
        status: 'active',
      });

      const res = await request(createApp()).post('/api/auth/firebase-sync').send({
        firebaseUid: 'firebase-dev-123',
        firebaseToken: 'dev-token',
        email: 'devuser@whitecaves.ae',
        name: 'Dev User',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBe('mock-jwt-token');
      expect(res.body.data.user.email).toBe('devuser@whitecaves.ae');
    });

    it('uses development fallback when NODE_ENV is unset', async () => {
      delete process.env.NODE_ENV;
      process.env.ALLOW_FIREBASE_SYNC_DEV_FALLBACK = 'true';

      const adminInitError = new Error('Firebase Admin SDK has not been initialized');
      adminInitError.name = 'FirebaseAdminInitError';
      mockVerifyFirebaseIdToken.mockRejectedValueOnce(adminInitError);

      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce({
        id: 'user-dev-2',
        email: 'unsetenv@whitecaves.ae',
        name: 'Unset Env User',
        role: 'agent',
        department: null,
        photoUrl: null,
        status: 'active',
      });

      const res = await request(createApp()).post('/api/auth/firebase-sync').send({
        firebaseUid: 'firebase-dev-456',
        firebaseToken: 'dev-token',
        email: 'unsetenv@whitecaves.ae',
        name: 'Unset Env User',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBe('mock-jwt-token');
      expect(res.body.data.user.email).toBe('unsetenv@whitecaves.ae');
    });
  });

  // ── POST /logout ─────────────────────────────────────────────────
  describe('POST /api/auth/logout', () => {
    const csrfToken = 'csrf-token-logout';

    it('returns 403 when CSRF token is missing', async () => {
      const res = await request(createApp('owner')).post('/api/auth/logout');
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/csrf token is required/i);
    });

    it('returns 200 on successful logout', async () => {
      const res = await request(createApp('owner'))
        .post('/api/auth/logout')
        .set('Cookie', `csrf_token=${csrfToken}`)
        .set('X-CSRF-Token', csrfToken);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/logged out/i);
    });

    it('logs activity on logout', async () => {
      await request(createApp('owner'))
        .post('/api/auth/logout')
        .set('Cookie', `csrf_token=${csrfToken}`)
        .set('X-CSRF-Token', csrfToken);
      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'logout' }),
        })
      );
    });
  });

  // ── PUT /password ────────────────────────────────────────────────
  describe('PUT /api/auth/password', () => {
    it('returns 400 if new password is too short', async () => {
      const res = await request(createApp('owner'))
        .put('/api/auth/password')
        .send({ currentPassword: 'OldPass1', newPassword: 'short' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/at least 8 characters/i);
    });

    it('returns 400 for weak/common new password', async () => {
      const res = await request(createApp('owner'))
        .put('/api/auth/password')
        .send({ currentPassword: 'OldPass1', newPassword: 'password' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/too common/i);
    });

    it('returns 400 if new password has no number', async () => {
      const res = await request(createApp('owner'))
        .put('/api/auth/password')
        .send({ currentPassword: 'OldPass1', newPassword: 'NoNumbersHere' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/letter.*number/i);
    });

    it('returns 401 if current password is incorrect', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        passwordHash: '$2a$10$existing',
      });
      mockBcrypt.compare.mockResolvedValueOnce(false);
      const res = await request(createApp('owner'))
        .put('/api/auth/password')
        .send({ currentPassword: 'WrongOld1', newPassword: 'NewValid123' });
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/current password.*incorrect/i);
    });

    it('returns 400 if current password is required but missing', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        passwordHash: '$2a$10$existing',
      });
      const res = await request(createApp('owner'))
        .put('/api/auth/password')
        .send({ newPassword: 'NewValid123' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/current password.*required/i);
    });

    it('returns 200 on successful password change', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        passwordHash: '$2a$10$existing',
      });
      mockBcrypt.compare.mockResolvedValueOnce(true);
      const res = await request(createApp('owner'))
        .put('/api/auth/password')
        .send({ currentPassword: 'OldValid123', newPassword: 'NewValid456' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockPrisma.user.update).toHaveBeenCalled();
    });

    it('writes a password_changed audit row on success', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        passwordHash: '$2a$10$existing',
      });
      mockBcrypt.compare.mockResolvedValueOnce(true);
      await request(createApp('owner'))
        .put('/api/auth/password')
        .send({ currentPassword: 'OldValid123', newPassword: 'NewValid456' });
      const auditCall = mockPrisma.activity.create.mock.calls.find(
        (c: any[]) => c[0]?.data?.action === 'password_changed'
      );
      expect(auditCall).toBeTruthy();
      expect(auditCall[0].data.userId).toBe('user-1');
    });

    it('writes a password_change_failed audit row on invalid current password', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        passwordHash: '$2a$10$existing',
      });
      mockBcrypt.compare.mockResolvedValueOnce(false);
      await request(createApp('owner'))
        .put('/api/auth/password')
        .send({ currentPassword: 'WrongOld1', newPassword: 'NewValid456' });
      // Allow the fire-and-forget audit to flush
      await new Promise(r => setImmediate(r));
      const auditCall = mockPrisma.activity.create.mock.calls.find(
        (c: any[]) =>
          c[0]?.data?.action === 'password_change_failed' &&
          c[0]?.data?.metadata?.reason === 'invalid_current_password'
      );
      expect(auditCall).toBeTruthy();
    });
  });

  // ── GET /security/login-attempts ────────────────────────────────
  describe('GET /api/auth/security/login-attempts', () => {
    it('returns 403 for non-admin roles', async () => {
      const res = await request(createApp('agent')).get('/api/auth/security/login-attempts');
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/admin access required/i);
    });

    it('returns 200 with results for owner', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        {
          id: 'a1',
          action: 'login_failed',
          description: 'Failed login attempt for ghost@x.ae (unknown_user)',
          createdAt: new Date('2026-04-23T10:00:00Z'),
          userId: null,
          user: null,
          metadata: { reason: 'unknown_user', ip: '203.0.113.7', userAgent: 'ua' },
        },
      ]);
      const res = await request(createApp('owner')).get('/api/auth/security/login-attempts');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.meta).toEqual(
        expect.objectContaining({ count: 1, limit: 50, status: 'all' })
      );
    });

    it('clamps limit to the [1, 200] range and forwards to Prisma', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      await request(createApp('admin')).get('/api/auth/security/login-attempts?limit=999');
      const callArgs = mockPrisma.activity.findMany.mock.calls[0][0];
      expect(callArgs.take).toBe(200);
    });

    it('filters by status=failed via action whitelist', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      await request(createApp('admin')).get('/api/auth/security/login-attempts?status=failed');
      const callArgs = mockPrisma.activity.findMany.mock.calls[0][0];
      expect(callArgs.where.action).toEqual({ in: ['login_failed'] });
    });

    it('filters by status=password to surface password change activity', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      await request(createApp('admin')).get('/api/auth/security/login-attempts?status=password');
      const callArgs = mockPrisma.activity.findMany.mock.calls[0][0];
      expect(callArgs.where.action).toEqual({
        in: ['password_changed', 'password_change_failed'],
      });
    });

    it('applies an email substring filter via OR clause', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      await request(createApp('owner')).get('/api/auth/security/login-attempts?email=Ghost');
      const callArgs = mockPrisma.activity.findMany.mock.calls[0][0];
      expect(callArgs.where.OR).toBeDefined();
      expect(callArgs.where.OR[0].description.contains).toBe('ghost');
    });
  });

  // ── POST /security/unlock ───────────────────────────────────────
  describe('POST /api/auth/security/unlock', () => {
    it('returns 403 for non-admin roles', async () => {
      const res = await request(createApp('agent'))
        .post('/api/auth/security/unlock')
        .send({ userId: 'user-9' });
      expect(res.status).toBe(403);
    });

    it('returns 400 when neither userId nor email is provided', async () => {
      const res = await request(createApp('owner')).post('/api/auth/security/unlock').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/userId or email/i);
    });

    it('returns 404 when target user is not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('admin'))
        .post('/api/auth/security/unlock')
        .send({ email: 'ghost@whitecaves.ae' });
      expect(res.status).toBe(404);
    });

    it('clears recent login_failed rows and writes account_unlocked audit', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-9',
        email: 'locked@whitecaves.ae',
      });
      mockPrisma.activity.deleteMany.mockResolvedValueOnce({ count: 7 });
      const res = await request(createApp('owner'))
        .post('/api/auth/security/unlock')
        .send({ userId: 'user-9' });
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(
        expect.objectContaining({ userId: 'user-9', clearedFailures: 7 })
      );
      expect(mockPrisma.activity.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            action: 'login_failed',
            userId: 'user-9',
          }),
        })
      );
      const auditCall = mockPrisma.activity.create.mock.calls.find(
        (c: any[]) => c[0]?.data?.action === 'account_unlocked'
      );
      expect(auditCall).toBeDefined();
      expect(auditCall[0].data.metadata.clearedFailures).toBe(7);
    });
  });

  // ── POST /security/unlock-ip ───────────────────────────────
  describe('POST /api/auth/security/unlock-ip', () => {
    it('returns 403 for non-admin roles', async () => {
      const res = await request(createApp('agent'))
        .post('/api/auth/security/unlock-ip')
        .send({ ip: '9.9.9.9' });
      expect(res.status).toBe(403);
    });

    it('returns 400 when ip is missing', async () => {
      const res = await request(createApp('owner')).post('/api/auth/security/unlock-ip').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/ip address/i);
    });

    it('clears recent login_failed rows for the ip and writes ip_unlocked audit', async () => {
      mockPrisma.activity.deleteMany.mockResolvedValueOnce({ count: 4 });
      const res = await request(createApp('admin'))
        .post('/api/auth/security/unlock-ip')
        .send({ ip: '9.9.9.9' });
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual({ ip: '9.9.9.9', clearedFailures: 4 });
      expect(mockPrisma.activity.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            action: 'login_failed',
            metadata: { path: ['ip'], equals: '9.9.9.9' },
          }),
        })
      );
      const auditCall = mockPrisma.activity.create.mock.calls.find(
        (c: any[]) => c[0]?.data?.action === 'ip_unlocked'
      );
      expect(auditCall).toBeDefined();
      expect(auditCall[0].data.metadata.unlockedIp).toBe('9.9.9.9');
      expect(auditCall[0].data.metadata.clearedFailures).toBe(4);
    });
  });

  // ── GET /security/active-lockouts ───────────────────────────────
  describe('GET /api/auth/security/active-lockouts', () => {
    it('returns 403 for non-admin roles', async () => {
      const res = await request(createApp('agent')).get('/api/auth/security/active-lockouts');
      expect(res.status).toBe(403);
    });

    it('surfaces accounts and IPs whose failures meet the threshold', async () => {
      const now = Date.now();
      // 5 failures for user-A (≥5 threshold) + 20 failures for ip 9.9.9.9 (≥20 threshold)
      // + 2 failures for user-B (below threshold) + 1 failure for ip 8.8.8.8 (below threshold)
      const rows: any[] = [];
      for (let i = 0; i < 5; i++) {
        rows.push({
          userId: 'user-A',
          createdAt: new Date(now - (300 - i) * 1000),
          metadata: { ip: '9.9.9.9' },
          user: { email: 'a@x.ae' },
        });
      }
      for (let i = 0; i < 15; i++) {
        rows.push({
          userId: null,
          createdAt: new Date(now - (250 - i) * 1000),
          metadata: { ip: '9.9.9.9' },
          user: null,
        });
      }
      for (let i = 0; i < 2; i++) {
        rows.push({
          userId: 'user-B',
          createdAt: new Date(now - (100 - i) * 1000),
          metadata: { ip: '8.8.8.8' },
          user: { email: 'b@x.ae' },
        });
      }
      mockPrisma.activity.findMany.mockResolvedValueOnce(rows);

      const res = await request(createApp('owner')).get('/api/auth/security/active-lockouts');
      expect(res.status).toBe(200);
      expect(res.body.data.accountThreshold).toBeGreaterThanOrEqual(1);
      expect(res.body.data.ipThreshold).toBeGreaterThanOrEqual(1);

      const accountIds = res.body.data.accounts.map((a: any) => a.userId);
      expect(accountIds).toContain('user-A');
      expect(accountIds).not.toContain('user-B');

      const ips = res.body.data.ips.map((i: any) => i.ip);
      expect(ips).toContain('9.9.9.9');
      expect(ips).not.toContain('8.8.8.8');

      const ipRow = res.body.data.ips.find((i: any) => i.ip === '9.9.9.9');
      expect(ipRow.failures).toBe(20);
      expect(ipRow.retryAfterSeconds).toBeGreaterThan(0);
    });

    it('returns empty arrays when no lockouts are active', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      const res = await request(createApp('admin')).get('/api/auth/security/active-lockouts');
      expect(res.status).toBe(200);
      expect(res.body.data.accounts).toEqual([]);
      expect(res.body.data.ips).toEqual([]);
    });
  });

  // ── GET /security/stats ─────────────────────────────────────────
  describe('GET /api/auth/security/stats', () => {
    it('returns 403 for non-admin roles', async () => {
      const res = await request(createApp('agent')).get('/api/auth/security/stats');
      expect(res.status).toBe(403);
    });

    it('aggregates totals, unique IPs, and top offending IPs/emails', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        { action: 'login', description: 'ok', metadata: { ip: '1.1.1.1' }, user: null },
        { action: 'login', description: 'ok', metadata: { ip: '1.1.1.2' }, user: null },
        {
          action: 'login_failed',
          description: 'bad',
          metadata: { ip: '9.9.9.9', emailAttempt: 'ghost@x.ae' },
          user: null,
        },
        {
          action: 'login_failed',
          description: 'bad',
          metadata: { ip: '9.9.9.9', emailAttempt: 'ghost@x.ae' },
          user: null,
        },
        {
          action: 'login_failed',
          description: 'bad',
          metadata: { ip: '9.9.9.9', emailAttempt: 'ghost@x.ae' },
          user: null,
        },
        {
          action: 'login_failed',
          description: 'bad',
          metadata: { ip: '8.8.8.8' },
          user: { email: 'real@x.ae' },
        },
        { action: 'password_changed', description: 'pw', metadata: { ip: '1.1.1.1' }, user: null },
        { action: 'password_change_failed', description: 'pw bad', metadata: {}, user: null },
        { action: 'account_unlocked', description: 'ul', metadata: { ip: '7.7.7.7' }, user: null },
      ]);

      const res = await request(createApp('owner')).get('/api/auth/security/stats?sinceMinutes=60');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totals).toEqual({
        logins: 2,
        loginFailures: 4,
        passwordChanges: 1,
        passwordChangeFailures: 1,
        accountUnlocks: 1,
        ipUnlocks: 0,
      });
      expect(res.body.data.windowMinutes).toBe(60);
      expect(res.body.data.uniqueIpCount).toBe(5); // 1.1.1.1, 1.1.1.2, 9.9.9.9, 8.8.8.8, 7.7.7.7
      expect(res.body.data.topOffendingIps[0]).toEqual({ ip: '9.9.9.9', failures: 3 });
      expect(res.body.data.topTargetedEmails[0]).toEqual({ email: 'ghost@x.ae', failures: 3 });
    });

    it('clamps sinceMinutes to the [1, 30 days] range', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      const res = await request(createApp('admin')).get(
        '/api/auth/security/stats?sinceMinutes=999999'
      );
      expect(res.status).toBe(200);
      expect(res.body.data.windowMinutes).toBe(60 * 24 * 30);
    });
  });

  // ── POST /refresh ─────────────────────────────────────────────────
  describe('POST /api/auth/refresh', () => {
    const csrfToken = 'csrf-token-refresh';
    // vi.clearAllMocks() (outer beforeEach) clears .mock.calls but NOT the
    // onceImplementations queue. Stale once-values from earlier failing tests
    // can bleed into these tests. Reset findUnique fully before every refresh
    // test so we always start from a clean slate.
    beforeEach(() => {
      mockPrisma.user.findUnique.mockReset();
      mockPrisma.user.findUnique.mockResolvedValue(null);
      // compare also accumulates stale once-values from login test failures
      mockBcrypt.compare.mockReset();
      mockBcrypt.compare.mockResolvedValue(true);
    });
    it('returns 403 when CSRF token is missing', async () => {
      const res = await request(createApp()).post('/api/auth/refresh');
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/csrf token is required/i);
    });

    it('returns 401 when refresh token cookie is missing', async () => {
      const res = await request(createApp())
        .post('/api/auth/refresh')
        .set('Cookie', `csrf_token=${csrfToken}`)
        .set('X-CSRF-Token', csrfToken);
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/no refresh token provided/i);
    });

    it('returns 401 when cookie value has no colon separator', async () => {
      const res = await request(createApp())
        .post('/api/auth/refresh')
        .set('Cookie', [`csrf_token=${csrfToken}`, 'refresh_token=MALFORMEDTOKEN'])
        .set('X-CSRF-Token', csrfToken);
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/no refresh token provided/i);
    });

    it('returns 401 when the userId from the cookie is not found in DB', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp())
        .post('/api/auth/refresh')
        .set('Cookie', [`csrf_token=${csrfToken}`, 'refresh_token=ghost-user-id:somerawtoken'])
        .set('X-CSRF-Token', csrfToken);
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid or expired/i);
    });

    it('returns 401 and nulls refreshTokenHash when token hash does not match (reuse detected)', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test User',
        role: 'agent',
        status: 'active',
        refreshTokenHash: '$2a$10$realhashedvalue',
      });
      mockBcrypt.compare.mockResolvedValueOnce(false);

      const res = await request(createApp())
        .post('/api/auth/refresh')
        .set('Cookie', [`csrf_token=${csrfToken}`, 'refresh_token=user-1:stale-or-stolen-token'])
        .set('X-CSRF-Token', csrfToken);

      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/reuse detected/i);
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: { refreshTokenHash: null },
        })
      );
    });

    it('returns 401 when the user account is inactive', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Suspended User',
        role: 'agent',
        status: 'suspended',
        refreshTokenHash: '$2a$10$somevalue',
      });
      const res = await request(createApp())
        .post('/api/auth/refresh')
        .set('Cookie', [`csrf_token=${csrfToken}`, 'refresh_token=user-1:sometoken'])
        .set('X-CSRF-Token', csrfToken);
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid or expired/i);
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it('returns 200 with new access token and rotates the cookie on valid token', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1',
        email: 'test@whitecaves.ae',
        name: 'Test User',
        role: 'agent',
        status: 'active',
        refreshTokenHash: '$2a$10$currenthash',
      });
      mockBcrypt.compare.mockResolvedValueOnce(true);
      mockBcrypt.hash.mockResolvedValueOnce('$2a$10$rotatedhash');
      mockPrisma.user.update.mockResolvedValueOnce({ id: 'user-1' });

      const res = await request(createApp())
        .post('/api/auth/refresh')
        .set('Cookie', [`csrf_token=${csrfToken}`, 'refresh_token=user-1:validrawtoken'])
        .set('X-CSRF-Token', csrfToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBe('mock-jwt-token');
      expect(res.body.data.user.id).toBe('user-1');

      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: expect.objectContaining({ refreshTokenHash: '$2a$10$rotatedhash' }),
        })
      );

      const setCookie = res.headers['set-cookie'] as string[] | string | undefined;
      const cookieStr = Array.isArray(setCookie) ? setCookie.join('; ') : String(setCookie ?? '');
      expect(cookieStr).toContain('refresh_token=');
      expect(cookieStr.toLowerCase()).toContain('httponly');
    });
  });
});
