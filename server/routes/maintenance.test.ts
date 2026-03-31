/**
 * Maintenance Routes — Unit Tests
 * Tests /api/maintenance endpoints: list, stats, get, create, update, delete
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
      maintenance: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        count: fn().mockResolvedValue(0),
        create: fn().mockResolvedValue({
          id: 'maint-1', propertyId: 'prop-1', requesterId: 'user-1',
          title: 'Leaking faucet', description: null, category: 'plumbing',
          priority: 'medium', status: 'open', createdAt: new Date(),
          property: { id: 'prop-1', title: 'Marina Studio' },
        }),
        update: fn().mockResolvedValue({ id: 'maint-1', status: 'in_progress' }),
        delete: fn().mockResolvedValue({}),
      },
      property: {
        findUnique: fn().mockResolvedValue({ id: 'prop-1', title: 'Marina Studio', ownerId: 'owner-1' }),
      },
    },
  };
});

vi.mock('../database.js', () => ({ prisma: mockPrisma, connectDatabase: vi.fn() }));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  createLogger: vi.fn(() => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() })),
}));

import maintenanceRoutes from './maintenance';
import { errorHandler } from '../middleware/errorHandler';

function createApp(role = 'tenant', userId = 'user-1') {
  const app = express();
  app.use(express.json());
  app.use((req: any, _res, next) => { req.user = { id: userId, email: `${role}@wc.ae`, role }; next(); });
  app.use('/api/maintenance', maintenanceRoutes);
  app.use(errorHandler);
  return app;
}

describe('Maintenance Routes — /api/maintenance', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => { vi.clearAllMocks(); app = createApp(); });

  // ── LIST ──────────────────────────────────────────────────────────
  describe('GET /api/maintenance', () => {
    it('returns 200 with empty list', async () => {
      const res = await request(app).get('/api/maintenance');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('accepts status, priority, category query filters', async () => {
      await request(app).get('/api/maintenance?status=open&priority=high&category=plumbing');
      const args = mockPrisma.maintenance.findMany.mock.calls[0][0];
      expect(args.where.status).toBe('open');
      expect(args.where.priority).toBe('high');
      expect(args.where.category).toBe('plumbing');
    });

    it('respects pagination params', async () => {
      await request(app).get('/api/maintenance?page=3&pageSize=10');
      const args = mockPrisma.maintenance.findMany.mock.calls[0][0];
      expect(args.skip).toBe(20);
      expect(args.take).toBe(10);
    });
  });

  // ── STATS ─────────────────────────────────────────────────────────
  describe('GET /api/maintenance/stats', () => {
    it('returns 200 with stats object', async () => {
      const res = await request(app).get('/api/maintenance/stats');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });
  });

  // ── GET ONE ───────────────────────────────────────────────────────
  describe('GET /api/maintenance/:id', () => {
    it('returns 404 for non-existent request', async () => {
      const res = await request(app).get('/api/maintenance/bad-id');
      expect(res.status).toBe(404);
    });

    it('returns 200 when authorized', async () => {
      mockPrisma.maintenance.findUnique.mockResolvedValueOnce({
        id: 'maint-1', requesterId: 'user-1',
        property: { id: 'prop-1', ownerId: 'owner-1' },
      });
      const res = await request(app).get('/api/maintenance/maint-1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 403 for unauthorized user', async () => {
      mockPrisma.maintenance.findUnique.mockResolvedValueOnce({
        id: 'maint-1', requesterId: 'other-user',
        property: { id: 'prop-1', ownerId: 'other-owner' },
      });
      const res = await request(app).get('/api/maintenance/maint-1');
      expect(res.status).toBe(403);
    });
  });

  // ── CREATE ────────────────────────────────────────────────────────
  describe('POST /api/maintenance', () => {
    const validPayload = {
      propertyId: 'prop-1',
      title: 'Leaking faucet',
    };

    it('creates a request with valid data', async () => {
      const res = await request(app).post('/api/maintenance').send(validPayload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(mockPrisma.maintenance.create).toHaveBeenCalled();
    });

    it('accepts optional fields', async () => {
      const res = await request(app).post('/api/maintenance').send({
        ...validPayload, description: 'Kitchen faucet dripping', category: 'plumbing', priority: 'high',
      });
      expect(res.status).toBe(201);
    });

    it('rejects missing propertyId', async () => {
      const res = await request(app).post('/api/maintenance').send({ title: 'Test' });
      expect(res.status).toBe(400);
    });

    it('rejects missing title', async () => {
      const res = await request(app).post('/api/maintenance').send({ propertyId: 'prop-1' });
      expect(res.status).toBe(400);
    });

    it('rejects empty title', async () => {
      const res = await request(app).post('/api/maintenance').send({ propertyId: 'prop-1', title: '   ' });
      expect(res.status).toBe(400);
    });

    it('rejects invalid category', async () => {
      const res = await request(app).post('/api/maintenance').send({
        ...validPayload, category: 'invalid_category',
      });
      expect(res.status).toBe(400);
    });

    it('rejects invalid priority', async () => {
      const res = await request(app).post('/api/maintenance').send({
        ...validPayload, priority: 'ultra_critical',
      });
      expect(res.status).toBe(400);
    });

    it('returns 404 if property not found', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(null);
      const res = await request(app).post('/api/maintenance').send(validPayload);
      expect(res.status).toBe(404);
    });
  });

  // ── UPDATE ────────────────────────────────────────────────────────
  describe('PATCH /api/maintenance/:id', () => {
    it('updates status for authorized user', async () => {
      mockPrisma.maintenance.findUnique.mockResolvedValueOnce({
        id: 'maint-1', requesterId: 'user-1', property: { ownerId: 'owner-1' },
      });
      const res = await request(app).patch('/api/maintenance/maint-1').send({ status: 'in_progress' });
      expect(res.status).toBe(200);
    });

    it('auto-sets completedAt when status = completed', async () => {
      mockPrisma.maintenance.findUnique.mockResolvedValueOnce({
        id: 'maint-1', requesterId: 'user-1', property: { ownerId: 'owner-1' },
      });
      await request(app).patch('/api/maintenance/maint-1').send({ status: 'completed' });
      const updateArgs = mockPrisma.maintenance.update.mock.calls[0][0];
      expect(updateArgs.data.completedAt).toBeDefined();
    });

    it('returns 404 for non-existent request', async () => {
      const res = await request(app).patch('/api/maintenance/bad-id').send({ status: 'open' });
      expect(res.status).toBe(404);
    });

    it('rejects invalid status value', async () => {
      mockPrisma.maintenance.findUnique.mockResolvedValueOnce({
        id: 'maint-1', requesterId: 'user-1', property: { ownerId: 'owner-1' },
      });
      const res = await request(app).patch('/api/maintenance/maint-1').send({ status: 'invalid_status' });
      expect(res.status).toBe(400);
    });

    it('rejects invalid category', async () => {
      mockPrisma.maintenance.findUnique.mockResolvedValueOnce({
        id: 'maint-1', requesterId: 'user-1', property: { ownerId: 'owner-1' },
      });
      const res = await request(app).patch('/api/maintenance/maint-1').send({ category: 'bad' });
      expect(res.status).toBe(400);
    });

    it('rejects invalid priority', async () => {
      mockPrisma.maintenance.findUnique.mockResolvedValueOnce({
        id: 'maint-1', requesterId: 'user-1', property: { ownerId: 'owner-1' },
      });
      const res = await request(app).patch('/api/maintenance/maint-1').send({ priority: 'extreme' });
      expect(res.status).toBe(400);
    });

    it('rejects unauthorized user', async () => {
      mockPrisma.maintenance.findUnique.mockResolvedValueOnce({
        id: 'maint-1', requesterId: 'other-user', property: { ownerId: 'other-owner' },
      });
      const res = await request(app).patch('/api/maintenance/maint-1').send({ status: 'open' });
      expect(res.status).toBe(403);
    });
  });

  // ── DELETE ────────────────────────────────────────────────────────
  describe('DELETE /api/maintenance/:id', () => {
    it('deletes request for authorized user', async () => {
      mockPrisma.maintenance.findUnique.mockResolvedValueOnce({
        id: 'maint-1', requesterId: 'user-1', property: { ownerId: 'owner-1' },
      });
      const res = await request(app).delete('/api/maintenance/maint-1');
      expect(res.status).toBe(200);
      expect(mockPrisma.maintenance.delete).toHaveBeenCalled();
    });

    it('returns 404 for non-existent request', async () => {
      const res = await request(app).delete('/api/maintenance/bad-id');
      expect(res.status).toBe(404);
    });

    it('rejects unauthorized user', async () => {
      mockPrisma.maintenance.findUnique.mockResolvedValueOnce({
        id: 'maint-1', requesterId: 'other-user', property: { ownerId: 'other-owner' },
      });
      const res = await request(app).delete('/api/maintenance/maint-1');
      expect(res.status).toBe(403);
    });
  });

  // ── OWNER ROLE ────────────────────────────────────────────────────
  describe('Owner role access', () => {
    it('owner can view any maintenance request', async () => {
      const ownerApp = createApp('owner', 'owner-1');
      mockPrisma.maintenance.findUnique.mockResolvedValueOnce({
        id: 'maint-1', requesterId: 'other-user', property: { ownerId: 'owner-1' },
      });
      const res = await request(ownerApp).get('/api/maintenance/maint-1');
      expect(res.status).toBe(200);
    });
  });
});
