/**
 * Contact Route — Unit Tests
 * Tests POST /api/contact — homepage contact form → CRM lead creation
 * All Prisma calls are mocked — no database needed.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      user: {
        findFirst: fn().mockResolvedValue({ id: 'owner-1' }),
      },
      lead: {
        create: fn().mockResolvedValue({
          id: 'lead-999',
          name: 'Ahmed Al-Rashid',
          email: 'ahmed@example.com',
          status: 'new',
          source: 'website',
          createdAt: new Date('2026-01-01T10:00:00Z'),
        }),
      },
    },
  };
});

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
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
vi.mock('../utils/sanitize.js', () => ({
  sanitizeString: (s: string, _max?: number) => s,
}));
vi.mock('../utils/logger', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import contactRoutes from './contact.js';

// ── Test app factory ─────────────────────────────────────────────────
function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/contact', contactRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

// ═════════════════════════════════════════════════════════════════════

describe('Contact Route — POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Successful submission ────────────────────────────────────────
  describe('successful lead creation', () => {
    it('creates a lead and returns 201', async () => {
      const res = await request(createApp()).post('/api/contact').send({
        name: 'Ahmed Al-Rashid',
        email: 'ahmed@example.com',
        phone: '+971501234567',
        message: 'Interested in a villa in Dubai Hills',
        inquiryType: 'buy',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('leadId', 'lead-999');
      expect(res.body.data).toHaveProperty('inquiryType', 'buy');
      expect(res.body.message).toMatch(/touch/i);
    });

    it('defaults inquiryType to general for unknown values', async () => {
      const res = await request(createApp())
        .post('/api/contact')
        .send({ name: 'Test User', email: 'test@example.com', inquiryType: 'unknown' });

      expect(res.status).toBe(201);
      expect(res.body.data.inquiryType).toBe('general');
    });

    it('works without optional phone and message', async () => {
      const res = await request(createApp())
        .post('/api/contact')
        .send({ name: 'Min User', email: 'min@example.com' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('works without optional owner (no user assigned)', async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce(null);

      const res = await request(createApp())
        .post('/api/contact')
        .send({ name: 'Test User', email: 'test@example.com' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('accepts rent inquiry type', async () => {
      const res = await request(createApp())
        .post('/api/contact')
        .send({ name: 'Renter User', email: 'renter@example.com', inquiryType: 'rent' });

      expect(res.status).toBe(201);
      expect(res.body.data.inquiryType).toBe('rent');
    });

    it('accepts invest inquiry type', async () => {
      const res = await request(createApp())
        .post('/api/contact')
        .send({ name: 'Investor', email: 'invest@example.com', inquiryType: 'invest' });

      expect(res.status).toBe(201);
      expect(res.body.data.inquiryType).toBe('invest');
    });

    it('calls prisma.lead.create with correct source and status', async () => {
      await request(createApp())
        .post('/api/contact')
        .send({ name: 'Ahmed', email: 'ahmed@example.com' });

      const createCall = mockPrisma.lead.create.mock.calls[0][0];
      expect(createCall.data.source).toBe('website');
      expect(createCall.data.status).toBe('new');
    });
  });

  // ── Validation errors ────────────────────────────────────────────
  describe('validation failures', () => {
    it('returns 422 when name is missing', async () => {
      const res = await request(createApp())
        .post('/api/contact')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/name/i);
    });

    it('returns 422 when name is too short (< 2 chars)', async () => {
      const res = await request(createApp())
        .post('/api/contact')
        .send({ name: 'A', email: 'test@example.com' });

      expect(res.status).toBe(422);
      expect(res.body.error).toMatch(/name/i);
    });

    it('returns 422 when email is missing', async () => {
      const res = await request(createApp()).post('/api/contact').send({ name: 'Ahmed' });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/email/i);
    });

    it('returns 422 for invalid email format', async () => {
      const res = await request(createApp())
        .post('/api/contact')
        .send({ name: 'Ahmed', email: 'not-an-email' });

      expect(res.status).toBe(422);
      expect(res.body.error).toMatch(/email/i);
    });

    it('returns 422 when name is empty string', async () => {
      const res = await request(createApp())
        .post('/api/contact')
        .send({ name: '', email: 'test@example.com' });

      expect(res.status).toBe(422);
    });
  });
});
