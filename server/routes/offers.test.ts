/**
 * Offers Routes — Unit Tests
 * Tests /api/offers endpoints: list, received, create, update, delete
 * All Prisma calls are mocked — no database needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      offer: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        create: fn().mockResolvedValue({
          id: 'off-1', buyerId: 'user-1', propertyId: 'prop-1', amount: 1200000,
          status: 'pending', terms: null, createdAt: new Date(),
          property: { id: 'prop-1', title: 'Palm Villa', location: 'Palm Jumeirah', price: 1500000 },
        }),
        update: fn().mockResolvedValue({ id: 'off-1', status: 'withdrawn' }),
        delete: fn().mockResolvedValue({}),
      },
      property: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue({ id: 'prop-1', title: 'Palm Villa', ownerId: 'owner-1' }),
      },
    },
  };
});

vi.mock('../database.js', () => ({ prisma: mockPrisma, connectDatabase: vi.fn() }));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  createLogger: vi.fn(() => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() })),
}));

import offersRoutes from './offers';
import { errorHandler } from '../middleware/errorHandler';

function createApp(role = 'buyer') {
  const app = express();
  app.use(express.json());
  app.use((req: any, _res, next) => { req.user = { id: 'user-1', email: 'buyer@wc.ae', role }; next(); });
  app.use('/api/offers', offersRoutes);
  app.use(errorHandler);
  return app;
}

describe('Offers Routes — /api/offers', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => { vi.clearAllMocks(); app = createApp(); });

  describe('GET /api/offers', () => {
    it('returns 200 with empty offers list', async () => {
      const res = await request(app).get('/api/offers');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('filters by status', async () => {
      await request(app).get('/api/offers?status=pending');
      const callArgs = mockPrisma.offer.findMany.mock.calls[0][0];
      expect(callArgs.where.status).toBe('pending');
    });
  });

  describe('GET /api/offers/received', () => {
    it('returns 200 with received offers', async () => {
      const res = await request(app).get('/api/offers/received');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/offers', () => {
    it('creates an offer with valid data', async () => {
      const res = await request(app)
        .post('/api/offers')
        .send({ propertyId: 'prop-1', amount: 1200000 });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(mockPrisma.offer.create).toHaveBeenCalled();
    });

    it('rejects missing propertyId', async () => {
      const res = await request(app).post('/api/offers').send({ amount: 1200000 });
      expect(res.status).toBe(400);
    });

    it('rejects missing amount', async () => {
      const res = await request(app).post('/api/offers').send({ propertyId: 'prop-1' });
      expect(res.status).toBe(400);
    });

    it('rejects non-positive amount', async () => {
      const res = await request(app).post('/api/offers').send({ propertyId: 'prop-1', amount: -100 });
      expect(res.status).toBe(400);
    });

    it('rejects non-existent property', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(null);
      const res = await request(app).post('/api/offers').send({ propertyId: 'bad', amount: 100 });
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/offers/:id', () => {
    it('lets buyer withdraw their offer', async () => {
      mockPrisma.offer.findUnique.mockResolvedValueOnce({
        id: 'off-1', buyerId: 'user-1', property: { ownerId: 'owner-1' },
      });
      const res = await request(app).patch('/api/offers/off-1').send({ status: 'withdrawn' });
      expect(res.status).toBe(200);
    });

    it('rejects non-existent offer', async () => {
      const res = await request(app).patch('/api/offers/bad').send({ status: 'withdrawn' });
      expect(res.status).toBe(404);
    });

    it('rejects unauthorized user', async () => {
      mockPrisma.offer.findUnique.mockResolvedValueOnce({
        id: 'off-1', buyerId: 'other-user', property: { ownerId: 'owner-1' },
      });
      const res = await request(app).patch('/api/offers/off-1').send({ status: 'withdrawn' });
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/offers/:id', () => {
    it('deletes offer owned by buyer', async () => {
      mockPrisma.offer.findUnique.mockResolvedValueOnce({ id: 'off-1', buyerId: 'user-1' });
      const res = await request(app).delete('/api/offers/off-1');
      expect(res.status).toBe(200);
      expect(mockPrisma.offer.delete).toHaveBeenCalled();
    });

    it('rejects delete by non-owner', async () => {
      mockPrisma.offer.findUnique.mockResolvedValueOnce({ id: 'off-1', buyerId: 'other-user' });
      const res = await request(app).delete('/api/offers/off-1');
      expect(res.status).toBe(403);
    });
  });
});
