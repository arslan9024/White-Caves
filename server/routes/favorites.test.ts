/**
 * Favorites Routes — Unit Tests
 * Tests /api/favorites endpoints: list, add, remove, check
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
      favorite: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        count: fn().mockResolvedValue(0),
        create: fn().mockResolvedValue({
          id: 'fav-1', userId: 'user-1', propertyId: 'prop-1',
        }),
        delete: fn().mockResolvedValue({}),
      },
      property: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
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
vi.mock('../middleware/auth', () => ({ default: null }));
vi.mock('../utils/sanitize', () => ({
  sanitizeString: (s: string) => s,
}));
vi.mock('../utils/validate', () => ({
  validate: vi.fn(),
  rules: {
    requiredStringWithMax: () => ({}),
    optionalEmail: () => ({}),
    optionalStringWithMax: () => ({}),
    oneOf: () => ({}),
    optionalPositiveNumber: () => ({}),
    optionalMongoId: () => ({}),
    requiredMongoId: () => ({}),
    optionalArray: () => ({}),
  },
  validateIdParam: (id: string, label: string) => {
    if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
      const err = new Error(`${label} must be a valid 24-character hex string`);
      (err as any).statusCode = 400;
      throw err;
    }
  },
}));
vi.mock('../config/pagination', () => ({
  parsePagination: ({ page, limit }: { page?: string; limit?: string }) => ({
    page: Math.max(1, parseInt(page || '1') || 1),
    limit: Math.min(100, Math.max(1, parseInt(limit || '20') || 20)),
    skip: (Math.max(1, parseInt(page || '1') || 1) - 1) * Math.min(100, Math.max(1, parseInt(limit || '20') || 20)),
  }),
}));

import favoriteRoutes from './favorites';

// ── Test app factory ─────────────────────────────────────────────────
function createApp(role: string = 'owner', userId = 'user-1') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: userId, email: 'test@whitecaves.ae', role };
    next();
  });
  app.use('/api/favorites', favoriteRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const VALID_ID = 'aabbccddee11223344556677';

// ═════════════════════════════════════════════════════════════════════

describe('Favorites Routes — /api/favorites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── GET / ────────────────────────────────────────────────────────
  describe('GET /api/favorites', () => {
    it('returns 200 with favorites and populated properties', async () => {
      mockPrisma.favorite.findMany.mockResolvedValueOnce([
        { id: 'fav-1', userId: 'user-1', propertyId: 'prop-1' },
      ]);
      mockPrisma.favorite.count.mockResolvedValueOnce(1);
      mockPrisma.property.findMany.mockResolvedValueOnce([
        { id: 'prop-1', title: 'Luxury Villa', type: 'villa', status: 'available', price: 1000000 },
      ]);
      const res = await request(createApp('agent'))
        .get('/api/favorites');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].property).toBeDefined();
      expect(res.body.data[0].property.title).toBe('Luxury Villa');
      expect(res.body.pagination).toBeDefined();
    });

    it('returns empty array when no favorites', async () => {
      mockPrisma.favorite.findMany.mockResolvedValueOnce([]);
      mockPrisma.favorite.count.mockResolvedValueOnce(0);
      const res = await request(createApp('agent'))
        .get('/api/favorites');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });
  });

  // ── POST / ───────────────────────────────────────────────────────
  describe('POST /api/favorites', () => {
    it('returns 201 on add', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce({ id: VALID_ID });
      mockPrisma.favorite.findUnique.mockResolvedValueOnce(null);
      mockPrisma.favorite.create.mockResolvedValueOnce({
        id: 'fav-new', userId: 'user-1', propertyId: VALID_ID,
      });
      const res = await request(createApp('agent'))
        .post('/api/favorites')
        .send({ propertyId: VALID_ID });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('returns 404 if property not found', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('agent'))
        .post('/api/favorites')
        .send({ propertyId: VALID_ID });
      expect(res.status).toBe(404);
    });

    it('returns 400 if already favorited', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce({ id: VALID_ID });
      mockPrisma.favorite.findUnique.mockResolvedValueOnce({
        id: 'fav-existing', userId: 'user-1', propertyId: VALID_ID,
      });
      const res = await request(createApp('agent'))
        .post('/api/favorites')
        .send({ propertyId: VALID_ID });
      expect(res.status).toBe(400);
    });
  });

  // ── DELETE /:propertyId ──────────────────────────────────────────
  describe('DELETE /api/favorites/:propertyId', () => {
    it('returns 200 on remove', async () => {
      mockPrisma.favorite.findUnique.mockResolvedValueOnce({
        id: 'fav-1', userId: 'user-1', propertyId: VALID_ID,
      });
      const res = await request(createApp('agent'))
        .delete(`/api/favorites/${VALID_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 404 if not found', async () => {
      mockPrisma.favorite.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('agent'))
        .delete(`/api/favorites/${VALID_ID}`);
      expect(res.status).toBe(404);
    });
  });

  // ── GET /check/:propertyId ───────────────────────────────────────
  describe('GET /api/favorites/check/:propertyId', () => {
    it('returns isFavorited true', async () => {
      mockPrisma.favorite.findUnique.mockResolvedValueOnce({
        id: 'fav-1', userId: 'user-1', propertyId: VALID_ID,
      });
      const res = await request(createApp('agent'))
        .get(`/api/favorites/check/${VALID_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.data.isFavorited).toBe(true);
    });

    it('returns isFavorited false', async () => {
      mockPrisma.favorite.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('agent'))
        .get(`/api/favorites/check/${VALID_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.data.isFavorited).toBe(false);
    });
  });
});
