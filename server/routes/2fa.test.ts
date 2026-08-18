/**
 * 2FA (Two-Factor Authentication) API Integration Tests
 * ─────────────────────────────────────────────────────
 * Tests TOTP setup generation, confirmation with token, login verification, and disabling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { errorHandler } from '../middleware/errorHandler.js';

const { mockTwoFASetup } = vi.hoisted(() => ({
  mockTwoFASetup: {
    userId: 'user-001',
    secret: 'JBSWY3DPEHPK3PXP',
    backupCodes: JSON.stringify(['A1B2C3D4', 'E5F6G7H8']),
    confirmed: true,
  },
}));

vi.mock('../database.js', () => ({
  prisma: {
    twoFASetup: {
      upsert: vi.fn().mockResolvedValue({
        userId: 'user-001',
        secret: 'JBSWY3DPEHPK3PXP',
        backupCodes: JSON.stringify(['A1B2C3D4']),
        confirmed: false,
      }),
      findUnique: vi.fn().mockImplementation(({ where }: { where: { userId: string } }) => {
        if (where.userId === 'user-001') {
          return Promise.resolve(mockTwoFASetup);
        }
        return Promise.resolve(null);
      }),
      update: vi.fn().mockResolvedValue({
        ...mockTwoFASetup,
        confirmed: true,
      }),
      delete: vi.fn().mockResolvedValue(mockTwoFASetup),
    },
    user: {
      update: vi.fn().mockResolvedValue({ id: 'user-001', twoFactorEnabled: true }),
    },
  },
}));

vi.mock('speakeasy', () => ({
  default: {
    generateSecret: () => ({
      base32: 'JBSWY3DPEHPK3PXP',
      otpauth_url: 'otpauth://totp/White%20Caves?secret=JBSWY3DPEHPK3PXP',
    }),
    totp: {
      verify: ({ token }: { token: string }) => token === '123456',
    },
  },
}));

vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mockqr'),
  },
}));

vi.mock('../middleware/auth.js', () => ({
  default: (req: any, _res: any, next: any) => {
    req.user = { id: 'user-001', email: 'director@whitecaves.ae' };
    next();
  },
}));

import twoFARouter from './2fa.js';

describe('2FA API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/2fa', twoFARouter);
    app.use(errorHandler);
  });

  describe('POST /api/2fa/setup', () => {
    it('generates TOTP secret and QR code data URL', async () => {
      const res = await request(app).post('/api/2fa/setup');

      expect(res.status).toBe(200);
      expect(res.body.secret).toBe('JBSWY3DPEHPK3PXP');
      expect(res.body.qrCode).toBe('data:image/png;base64,mockqr');
      expect(Array.isArray(res.body.backupCodes)).toBe(true);
      expect(res.body.backupCodes.length).toBe(10);
    });
  });

  describe('POST /api/2fa/verify', () => {
    it('verifies 6-digit TOTP token and returns JWT session token', async () => {
      const res = await request(app)
        .post('/api/2fa/verify')
        .send({ userId: 'user-001', token: '123456' });

      expect(res.status).toBe(200);
      expect(res.body.sessionToken).toBeDefined();
      expect(res.body.message).toContain('successful');
    });

    it('verifies valid backup code and returns session token', async () => {
      const res = await request(app)
        .post('/api/2fa/verify')
        .send({ userId: 'user-001', backupCode: 'A1B2C3D4' });

      expect(res.status).toBe(200);
      expect(res.body.sessionToken).toBeDefined();
    });

    it('rejects invalid token and backup code with 401', async () => {
      const res = await request(app)
        .post('/api/2fa/verify')
        .send({ userId: 'user-001', token: '000000' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('returns 400 when userId is missing', async () => {
      const res = await request(app)
        .post('/api/2fa/verify')
        .send({ token: '123456' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/2fa/disable', () => {
    it('disables 2FA and deletes setup record', async () => {
      const res = await request(app).post('/api/2fa/disable');

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('disabled');
    });
  });
});
