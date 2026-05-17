/**
 * Viewings Routes — Unit Tests
 * Tests /api/viewings endpoints: list, upcoming, create, update, delete
 * All Prisma calls are mocked — no database needed.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      viewing: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        count: fn().mockResolvedValue(0),
        create: fn().mockResolvedValue({
          id: 'v-1', userId: 'user-1', propertyId: 'prop-1', scheduledAt: new Date('2026-06-15T10:00:00Z'),
          type: 'in_person', status: 'scheduled', duration: 30, notes: null,
          property: { id: 'prop-1', title: 'Marina Apt', location: 'Dubai Marina', price: 1500000 },
        }),
        update: fn().mockResolvedValue({ id: 'v-1', status: 'confirmed' }),
        delete: fn().mockResolvedValue({}),
      },
      property: {
        findUnique: fn().mockResolvedValue({ id: 'prop-1', title: 'Marina Apt' }),
      },
    },
  };
});

vi.mock('../database.js', () => ({ prisma: mockPrisma, connectDatabase: vi.fn() }));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  createLogger: vi.fn(() => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() })),
}));
// Neutralize fire-and-forget email notifications so they do not consume
// queued prisma mock values (mockResolvedValueOnce) across tests.
vi.mock('../services/emailService.js', () => ({
  sendEmailTracked: vi.fn().mockResolvedValue({ success: true }),
  EMAIL_TEMPLATES: {
    viewingConfirmation: () => ({ subject: '', html: '', text: '' }),
  },
}));

import viewingsRoutes from './viewings';
import { errorHandler } from '../middleware/errorHandler';

function createApp(role = 'buyer') {
  const app = express();
  app.use(express.json());
  app.use((req: any, _res, next) => { req.user = { id: 'user-1', email: 'test@wc.ae', role }; next(); });
  app.use('/api/viewings', viewingsRoutes);
  app.use(errorHandler);
  return app;
}

describe('Viewings Routes — /api/viewings', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Fully reset queued mock implementations to prevent cross-test pollution.
    // (clearAllMocks does NOT clear queued mockResolvedValueOnce values.)
    mockPrisma.viewing.findUnique.mockReset().mockResolvedValue(null);
    mockPrisma.viewing.findMany.mockReset().mockResolvedValue([]);
    mockPrisma.viewing.count.mockReset().mockResolvedValue(0);
    mockPrisma.viewing.create.mockReset().mockResolvedValue({
      id: 'v-1', userId: 'user-1', propertyId: 'prop-1',
      scheduledAt: new Date('2026-06-15T10:00:00Z'),
      type: 'in_person', status: 'scheduled', duration: 30, notes: null,
      property: { id: 'prop-1', title: 'Marina Apt', location: 'Dubai Marina', price: 1500000 },
    });
    mockPrisma.viewing.update.mockReset().mockResolvedValue({ id: 'v-1', status: 'confirmed' });
    mockPrisma.viewing.delete.mockReset().mockResolvedValue({});
    mockPrisma.property.findUnique.mockReset().mockResolvedValue({ id: 'prop-1', title: 'Marina Apt' });
    app = createApp();
  });

  // Flush fire-and-forget async work (e.g. sendViewingNotification which
  // performs an additional prisma.viewing.findUnique after the response).
  // Without this, pending promises can consume the *next* test's queued
  // mockResolvedValueOnce values and cause intermittent 404/403 mismatches.
  afterEach(async () => {
    await new Promise((resolve) => setImmediate(resolve));
    await new Promise((resolve) => setImmediate(resolve));
  });

  describe('GET /api/viewings', () => {
    it('returns 200 with empty list', async () => {
      const res = await request(app).get('/api/viewings');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination).toBeDefined();
    });

    it('supports pagination query params', async () => {
      await request(app).get('/api/viewings?page=2&pageSize=10');
      expect(mockPrisma.viewing.findMany).toHaveBeenCalled();
      expect(mockPrisma.viewing.count).toHaveBeenCalled();
    });

    it('filters by status', async () => {
      await request(app).get('/api/viewings?status=confirmed');
      const callArgs = mockPrisma.viewing.findMany.mock.calls[0][0];
      expect(callArgs.where.status).toBe('confirmed');
    });
  });

  describe('GET /api/viewings/upcoming', () => {
    it('returns 200 with upcoming viewings', async () => {
      const res = await request(app).get('/api/viewings/upcoming');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/viewings', () => {
    it('creates a viewing with valid data', async () => {
      const res = await request(app)
        .post('/api/viewings')
        .send({ propertyId: 'prop-1', scheduledAt: '2026-06-15T10:00:00Z' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(mockPrisma.viewing.create).toHaveBeenCalled();
    });

    it('rejects missing propertyId', async () => {
      const res = await request(app)
        .post('/api/viewings')
        .send({ scheduledAt: '2026-06-15T10:00:00Z' });
      expect(res.status).toBe(400);
    });

    it('rejects missing scheduledAt', async () => {
      const res = await request(app)
        .post('/api/viewings')
        .send({ propertyId: 'prop-1' });
      expect(res.status).toBe(400);
    });

    it('rejects non-existent property', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(null);
      const res = await request(app)
        .post('/api/viewings')
        .send({ propertyId: 'bad-id', scheduledAt: '2026-06-15T10:00:00Z' });
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/viewings/:id', () => {
    it('updates a viewing owned by user', async () => {
      mockPrisma.viewing.findUnique.mockResolvedValueOnce({ id: 'v-1', userId: 'user-1' });
      const res = await request(app)
        .patch('/api/viewings/v-1')
        .send({ status: 'confirmed' });
      expect(res.status).toBe(200);
      expect(mockPrisma.viewing.update).toHaveBeenCalled();
    });

    it('rejects update for non-existent viewing', async () => {
      mockPrisma.viewing.findUnique.mockResolvedValueOnce(null);
      const res = await request(app).patch('/api/viewings/bad-id').send({ status: 'confirmed' });
      expect(res.status).toBe(404);
    });

    it('rejects update by non-owner', async () => {
      mockPrisma.viewing.findUnique.mockResolvedValueOnce({ id: 'v-1', userId: 'other-user' });
      const res = await request(app).patch('/api/viewings/v-1').send({ status: 'confirmed' });
      expect(res.status).toBe(403);
    });

    it('validates rating range 1-5', async () => {
      mockPrisma.viewing.findUnique.mockResolvedValueOnce({ id: 'v-1', userId: 'user-1' });
      const res = await request(app).patch('/api/viewings/v-1').send({ rating: 6 });
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/viewings/:id', () => {
    it('deletes a viewing owned by user', async () => {
      mockPrisma.viewing.findUnique.mockResolvedValueOnce({ id: 'v-1', userId: 'user-1' });
      const res = await request(app).delete('/api/viewings/v-1');
      expect(res.status).toBe(200);
      expect(mockPrisma.viewing.delete).toHaveBeenCalled();
    });

    it('rejects delete by non-owner', async () => {
      mockPrisma.viewing.findUnique.mockResolvedValueOnce({ id: 'v-1', userId: 'other-user' });
      const res = await request(app).delete('/api/viewings/v-1');
      expect(res.status).toBe(403);
    });
  });
});
