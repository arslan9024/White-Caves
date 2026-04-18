/**
 * Auth Routes — Unit Tests
 * Tests /api/auth endpoints: login, register, verify-2fa, profile, password, logout, firebase-sync
 * All Prisma calls are mocked — no database needed.
 */

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
          id: 'user-1', email: 'test@whitecaves.ae', name: 'Test User',
          role: 'agent', department: 'sales', passwordHash: '$2a$10$hashedvalue',
          phone: null, photoUrl: null, status: 'active',
        }),
        update: fn().mockResolvedValue({
          id: 'user-1', email: 'test@whitecaves.ae', name: 'Updated',
          role: 'agent', phone: null, department: 'sales', photoUrl: null,
        }),
      },
      activity: {
        create: fn().mockResolvedValue({ id: 'act-1' }),
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
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
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
      const res = await request(createApp())
        .post('/api/auth/login')
        .send({ password: 'Test1234' });
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
        id: 'user-1', email: 'test@whitecaves.ae', name: 'Test',
        role: 'agent', passwordHash: '$2a$10$hashedvalue',
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
        id: 'user-1', email: 'test@whitecaves.ae', name: 'Test',
        role: 'agent', passwordHash: null,
      });
      const res = await request(createApp())
        .post('/api/auth/login')
        .send({ email: 'test@whitecaves.ae', password: 'Test1234' });
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/account not configured/i);
    });

    it('returns 200 with token on successful login', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1', email: 'test@whitecaves.ae', name: 'Test User',
        role: 'agent', department: 'sales', photoUrl: null,
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

    it('auto-migrates legacy wc$ password hash on login', async () => {
      const legacyHash = 'wc$' + Buffer.from('Test1234').toString('base64');
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1', email: 'test@whitecaves.ae', name: 'Test',
        role: 'agent', department: null, photoUrl: null,
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
        id: 'user-1', email: 'test@whitecaves.ae', name: 'Test User',
        role: 'agent', department: null, photoUrl: null,
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
        id: 'existing', email: 'existing@whitecaves.ae',
      });
      const res = await request(createApp())
        .post('/api/auth/register')
        .send({ email: 'existing@whitecaves.ae', password: 'ValidPass1' });
      expect(res.status).toBe(409);
      expect(res.body.error).toMatch(/already registered/i);
    });

    it('returns 201 on successful registration', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce({
        id: 'new-user', email: 'new@whitecaves.ae', name: 'New User',
        role: 'agent', department: null,
      });
      const res = await request(createApp())
        .post('/api/auth/register')
        .send({ email: 'new@whitecaves.ae', password: 'ValidPass1', name: 'New User' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBe('mock-jwt-token');
      expect(res.body.data.user.role).toBe('agent');
    });

    it('always assigns agent role regardless of input', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce({
        id: 'new-user', email: 'hack@test.com', name: 'Hacker',
        role: 'agent', department: null,
      });
      await request(createApp())
        .post('/api/auth/register')
        .send({ email: 'hack@test.com', password: 'ValidPass1', name: 'Hacker', role: 'owner' });
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ role: 'agent' }),
        })
      );
    });

    it('logs activity on successful registration', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce({
        id: 'new-user', email: 'new@whitecaves.ae', name: 'New User',
        role: 'agent', department: null,
      });
      await request(createApp())
        .post('/api/auth/register')
        .send({ email: 'new@whitecaves.ae', password: 'ValidPass1' });
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

    it('returns 501 when not in development mode', async () => {
      // NODE_ENV is 'test', not 'development', so 2FA should fail
      const res = await request(createApp())
        .post('/api/auth/verify-2fa')
        .send({ email: 'test@whitecaves.ae', code: '000000' });
      expect(res.status).toBe(501);
      expect(res.body.error).toMatch(/not yet configured/i);
    });

    it('returns 400 if code is missing', async () => {
      const res = await request(createApp())
        .post('/api/auth/verify-2fa')
        .send({ email: 'test@whitecaves.ae' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/verification code.*required/i);
    });
  });

  // ── GET /profile ─────────────────────────────────────────────────
  describe('GET /api/auth/profile', () => {
    it('returns user profile when authenticated', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1', email: 'test@whitecaves.ae', name: 'Test User',
        role: 'owner', phone: '+971501234567', department: 'management',
        photoUrl: null, status: 'active', createdAt: new Date(),
        _count: { leadsAssigned: 5, commissions: 3, properties: 10 },
      });
      const res = await request(createApp('owner'))
        .get('/api/auth/profile');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('test@whitecaves.ae');
    });

    it('returns 404 if user not found in database', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner'))
        .get('/api/auth/profile');
      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/user not found/i);
    });
  });

  // ── PATCH /profile ───────────────────────────────────────────────
  describe('PATCH /api/auth/profile', () => {
    it('updates user name', async () => {
      mockPrisma.user.update.mockResolvedValueOnce({
        id: 'user-1', email: 'test@whitecaves.ae', name: 'Updated Name',
        role: 'owner', phone: null, department: null, photoUrl: null,
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
        id: 'user-1', email: 'test@whitecaves.ae', name: 'Test',
        role: 'owner', phone: null, department: null,
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

    it('returns 503 because firebase-admin is not configured', async () => {
      const res = await request(createApp())
        .post('/api/auth/firebase-sync')
        .send({ firebaseUid: 'firebase-123', email: 'test@whitecaves.ae' });
      expect(res.status).toBe(503);
      expect(res.body.error).toMatch(/firebase.*disabled/i);
    });
  });

  // ── POST /logout ─────────────────────────────────────────────────
  describe('POST /api/auth/logout', () => {
    it('returns 200 on successful logout', async () => {
      const res = await request(createApp('owner'))
        .post('/api/auth/logout');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/logged out/i);
    });

    it('logs activity on logout', async () => {
      await request(createApp('owner'))
        .post('/api/auth/logout');
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
        id: 'user-1', email: 'test@whitecaves.ae', passwordHash: '$2a$10$existing',
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
        id: 'user-1', email: 'test@whitecaves.ae', passwordHash: '$2a$10$existing',
      });
      const res = await request(createApp('owner'))
        .put('/api/auth/password')
        .send({ newPassword: 'NewValid123' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/current password.*required/i);
    });

    it('returns 200 on successful password change', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-1', email: 'test@whitecaves.ae', passwordHash: '$2a$10$existing',
      });
      mockBcrypt.compare.mockResolvedValueOnce(true);
      const res = await request(createApp('owner'))
        .put('/api/auth/password')
        .send({ currentPassword: 'OldValid123', newPassword: 'NewValid456' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockPrisma.user.update).toHaveBeenCalled();
    });
  });
});
