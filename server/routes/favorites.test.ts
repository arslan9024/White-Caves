/**
 * Favorites Routes — Unit Tests
 * Tests /api/favorites endpoints: list, add, remove, check, ids
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
        upsert: fn().mockResolvedValue({
          id: 'fav-1',
          userId: 'user-1',
          propertyId: 'prop-1',
          createdAt: new Date(),
          property: { id: 'prop-1', title: 'Marina View', price: 1200000, location: 'Dubai Marina', type: 'apartment', status: 'available', images: [] },
        }),
        delete: fn().mockResolvedValue({}),
      },
      property: {
        findUnique: fn().mockResolvedValue({ id: 'prop-1', title: 'Marina View' }),
      },
    },
  };
});

vi.mock('../database.js', () => ({
  prisma: mockPrisma,
  connectDatabase: vi.fn(),
}));

vi.mock('../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
  createLogger: vi.fn(() => ({
    info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
  })),
}));

import favoritesRoutes from './favorites';
import { errorHandler } from '../middleware/errorHandler';

// ── Test app setup ───────────────────────────────────────────────────
function createApp(role = 'buyer') {
  const app = express();
  app.use(express.json());
  app.use((req: any, _res, next) => {
    req.user = { id: 'user-1', email: 'buyer@whitecaves.ae', role };
    next();
  });
  app.use('/api/favorites', favoritesRoutes);
  app.use(errorHandler);
  return app;
}

// ── Tests ────────────────────────────────────────────────────────────
describe('Favorites Routes — /api/favorites', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp();
  });

  // ── GET /api/favorites ─────────────────────────────────────────────
  describe('GET /api/favorites', () => {
    it('returns 200 with empty favorites list', async () => {
      mockPrisma.favorite.findMany.mockResolvedValue([]);
      mockPrisma.favorite.count.mockResolvedValue(0);

      const res = await request(app).get('/api/favorites');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination).toMatchObject({ page: 1, total: 0 });
    });

    it('returns paginated favorites with property data', async () => {
      const mockFavorites = [
        {
          id: 'fav-1',
          userId: 'user-1',
          propertyId: 'prop-1',
          createdAt: new Date(),
          property: {
            id: 'prop-1', title: 'Marina View', price: 1200000,
            location: 'Dubai Marina', type: 'apartment', status: 'available',
            bedrooms: 2, bathrooms: 2, sqft: 1200, images: ['img1.jpg'],
            featured: false, agentName: 'Agent',
          },
        },
      ];
      mockPrisma.favorite.findMany.mockResolvedValue(mockFavorites);
      mockPrisma.favorite.count.mockResolvedValue(1);

      const res = await request(app).get('/api/favorites?page=1&pageSize=10');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].property.title).toBe('Marina View');
      expect(res.body.pagination).toMatchObject({ page: 1, pageSize: 10, total: 1, totalPages: 1 });
    });

    it('caps pageSize at 50', async () => {
      mockPrisma.favorite.findMany.mockResolvedValue([]);
      mockPrisma.favorite.count.mockResolvedValue(0);

      await request(app).get('/api/favorites?pageSize=100');
      expect(mockPrisma.favorite.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 50 }),
      );
    });
  });

  // ── GET /api/favorites/ids ─────────────────────────────────────────
  describe('GET /api/favorites/ids', () => {
    it('returns array of property IDs', async () => {
      mockPrisma.favorite.findMany.mockResolvedValue([
        { propertyId: 'prop-1' },
        { propertyId: 'prop-2' },
        { propertyId: 'prop-3' },
      ]);

      const res = await request(app).get('/api/favorites/ids');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(['prop-1', 'prop-2', 'prop-3']);
    });

    it('returns empty array when no favorites', async () => {
      mockPrisma.favorite.findMany.mockResolvedValue([]);

      const res = await request(app).get('/api/favorites/ids');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  // ── GET /api/favorites/check/:propertyId ───────────────────────────
  describe('GET /api/favorites/check/:propertyId', () => {
    it('returns { isFavorited: true } when favorite exists', async () => {
      mockPrisma.favorite.findUnique.mockResolvedValue({
        id: 'fav-1', userId: 'user-1', propertyId: 'prop-1',
      });

      const res = await request(app).get('/api/favorites/check/prop-1');
      expect(res.status).toBe(200);
      expect(res.body.data.isFavorited).toBe(true);
    });

    it('returns { isFavorited: false } when not favorited', async () => {
      mockPrisma.favorite.findUnique.mockResolvedValue(null);

      const res = await request(app).get('/api/favorites/check/prop-99');
      expect(res.status).toBe(200);
      expect(res.body.data.isFavorited).toBe(false);
    });
  });

  // ── POST /api/favorites ────────────────────────────────────────────
  describe('POST /api/favorites', () => {
    it('returns 201 when adding a favorite', async () => {
      const res = await request(app)
        .post('/api/favorites')
        .send({ propertyId: 'prop-1' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.propertyId).toBe('prop-1');
    });

    it('returns 400 when propertyId is missing', async () => {
      const res = await request(app)
        .post('/api/favorites')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns 404 when property does not exist', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(null);

      const res = await request(app)
        .post('/api/favorites')
        .send({ propertyId: 'nonexistent' });

      expect(res.status).toBe(404);
    });

    it('handles duplicate favorite gracefully (upsert)', async () => {
      // Upsert won't throw on duplicate — returns existing record
      const res = await request(app)
        .post('/api/favorites')
        .send({ propertyId: 'prop-1' });

      expect(res.status).toBe(201);
      expect(mockPrisma.favorite.upsert).toHaveBeenCalled();
    });
  });

  // ── DELETE /api/favorites/:propertyId ──────────────────────────────
  describe('DELETE /api/favorites/:propertyId', () => {
    it('returns 200 when removing a favorite', async () => {
      mockPrisma.favorite.findUnique.mockResolvedValueOnce({
        id: 'fav-1', userId: 'user-1', propertyId: 'prop-1',
      });

      const res = await request(app).delete('/api/favorites/prop-1');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Favorite removed');
    });

    it('returns 404 when favorite does not exist', async () => {
      mockPrisma.favorite.findUnique.mockResolvedValueOnce(null);

      const res = await request(app).delete('/api/favorites/prop-99');
      expect(res.status).toBe(404);
    });
  });
});
