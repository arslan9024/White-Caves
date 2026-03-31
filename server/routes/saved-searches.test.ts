/**
 * Saved Searches Routes — Unit Tests
 * Tests /api/saved-searches endpoints: list, create, update, delete, check
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
      savedSearch: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        count: fn().mockResolvedValue(0),
        create: fn().mockResolvedValue({
          id: 'search-1',
          name: '3BR apartments in JBR',
          filters: { type: 'apartment', bedrooms: 3, location: 'JBR' },
          alertEnabled: false,
          matchCount: 5,
          lastChecked: null,
          userId: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        update: fn().mockResolvedValue({
          id: 'search-1',
          name: 'Updated Search',
          filters: { type: 'villa', bedrooms: 4 },
          alertEnabled: true,
          matchCount: 3,
        }),
        delete: fn().mockResolvedValue({}),
      },
      property: {
        count: fn().mockResolvedValue(5),
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

import savedSearchesRoutes from './saved-searches';
import { errorHandler } from '../middleware/errorHandler';

// ── Test app setup ───────────────────────────────────────────────────
function createApp(role = 'buyer') {
  const app = express();
  app.use(express.json());
  app.use((req: any, _res, next) => {
    req.user = { id: 'user-1', email: 'buyer@whitecaves.ae', role };
    next();
  });
  app.use('/api/saved-searches', savedSearchesRoutes);
  app.use(errorHandler);
  return app;
}

// ── Tests ────────────────────────────────────────────────────────────
describe('Saved Searches Routes — /api/saved-searches', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp();
  });

  // ── GET /api/saved-searches ────────────────────────────────────────
  describe('GET /api/saved-searches', () => {
    it('returns 200 with empty list', async () => {
      const res = await request(app).get('/api/saved-searches');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('returns saved searches for the user', async () => {
      mockPrisma.savedSearch.findMany.mockResolvedValue([
        {
          id: 'search-1',
          name: '3BR in JBR',
          filters: { bedrooms: 3, location: 'JBR' },
          alertEnabled: true,
          matchCount: 12,
        },
      ]);

      const res = await request(app).get('/api/saved-searches');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe('3BR in JBR');
    });
  });

  // ── POST /api/saved-searches ───────────────────────────────────────
  describe('POST /api/saved-searches', () => {
    it('returns 201 on creation', async () => {
      const res = await request(app)
        .post('/api/saved-searches')
        .send({
          name: '3BR apartments in JBR',
          filters: { type: 'apartment', bedrooms: 3, location: 'JBR' },
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('3BR apartments in JBR');
    });

    it('returns 400 when name is missing', async () => {
      const res = await request(app)
        .post('/api/saved-searches')
        .send({ filters: { type: 'apartment' } });

      expect(res.status).toBe(400);
    });

    it('returns 400 when filters is missing', async () => {
      const res = await request(app)
        .post('/api/saved-searches')
        .send({ name: 'My Search' });

      expect(res.status).toBe(400);
    });

    it('returns 400 when max searches reached (20)', async () => {
      mockPrisma.savedSearch.count.mockResolvedValueOnce(20);

      const res = await request(app)
        .post('/api/saved-searches')
        .send({ name: 'Too Many', filters: { type: 'villa' } });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Maximum 20');
    });

    it('counts property matches during creation', async () => {
      mockPrisma.property.count.mockResolvedValueOnce(42);

      await request(app)
        .post('/api/saved-searches')
        .send({ name: 'Search', filters: { type: 'apartment' } });

      expect(mockPrisma.property.count).toHaveBeenCalled();
      expect(mockPrisma.savedSearch.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ matchCount: 42 }),
        }),
      );
    });
  });

  // ── PATCH /api/saved-searches/:id ──────────────────────────────────
  describe('PATCH /api/saved-searches/:id', () => {
    it('returns 200 on update', async () => {
      mockPrisma.savedSearch.findUnique.mockResolvedValueOnce({
        id: 'search-1', userId: 'user-1', name: 'Old',
      });

      const res = await request(app)
        .patch('/api/saved-searches/search-1')
        .send({ name: 'Updated Search' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 404 when search not found', async () => {
      mockPrisma.savedSearch.findUnique.mockResolvedValueOnce(null);

      const res = await request(app)
        .patch('/api/saved-searches/nonexistent')
        .send({ name: 'X' });

      expect(res.status).toBe(404);
    });

    it('returns 403 when user does not own the search', async () => {
      mockPrisma.savedSearch.findUnique.mockResolvedValueOnce({
        id: 'search-1', userId: 'other-user', name: 'Not Mine',
      });

      const res = await request(app)
        .patch('/api/saved-searches/search-1')
        .send({ name: 'Hacked' });

      expect(res.status).toBe(403);
    });
  });

  // ── DELETE /api/saved-searches/:id ─────────────────────────────────
  describe('DELETE /api/saved-searches/:id', () => {
    it('returns 200 on deletion', async () => {
      mockPrisma.savedSearch.findUnique.mockResolvedValueOnce({
        id: 'search-1', userId: 'user-1',
      });

      const res = await request(app).delete('/api/saved-searches/search-1');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Saved search deleted');
    });

    it('returns 404 when not found', async () => {
      mockPrisma.savedSearch.findUnique.mockResolvedValueOnce(null);

      const res = await request(app).delete('/api/saved-searches/nonexistent');
      expect(res.status).toBe(404);
    });

    it('returns 403 when user does not own the search', async () => {
      mockPrisma.savedSearch.findUnique.mockResolvedValueOnce({
        id: 'search-1', userId: 'other-user',
      });

      const res = await request(app).delete('/api/saved-searches/search-1');
      expect(res.status).toBe(403);
    });
  });

  // ── POST /api/saved-searches/:id/check ─────────────────────────────
  describe('POST /api/saved-searches/:id/check', () => {
    it('returns match count and new matches', async () => {
      mockPrisma.savedSearch.findUnique.mockResolvedValueOnce({
        id: 'search-1',
        userId: 'user-1',
        filters: { type: 'apartment', bedrooms: 3 },
        matchCount: 5,
      });
      mockPrisma.property.count.mockResolvedValueOnce(8); // 3 new matches

      const res = await request(app).post('/api/saved-searches/search-1/check');

      expect(res.status).toBe(200);
      expect(res.body.data).toMatchObject({
        matchCount: 8,
        previousCount: 5,
        newMatches: 3,
      });
    });

    it('returns 0 new matches when count decreased', async () => {
      mockPrisma.savedSearch.findUnique.mockResolvedValueOnce({
        id: 'search-1',
        userId: 'user-1',
        filters: { type: 'villa' },
        matchCount: 10,
      });
      mockPrisma.property.count.mockResolvedValueOnce(7); // Properties removed

      const res = await request(app).post('/api/saved-searches/search-1/check');

      expect(res.status).toBe(200);
      expect(res.body.data.newMatches).toBe(0); // Math.max(0, 7-10) = 0
    });

    it('returns 404 when search not found', async () => {
      mockPrisma.savedSearch.findUnique.mockResolvedValueOnce(null);

      const res = await request(app).post('/api/saved-searches/nonexistent/check');
      expect(res.status).toBe(404);
    });
  });
});
