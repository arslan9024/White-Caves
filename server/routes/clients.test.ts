/**
 * Clients Routes — Unit Tests
 * Tests /api/clients endpoints: list, stats, detail, CRUD, communications
 * All Prisma calls are mocked — no database needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  const mockTx = {
    client: { delete: fn().mockResolvedValue({}) },
    activity: { create: fn().mockResolvedValue({}) },
  };
  return {
    mockPrisma: {
      client: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        count: fn().mockResolvedValue(0),
        create: fn().mockResolvedValue({
          id: 'client-1', name: 'Test Client', email: 'test@example.com',
          type: 'buyer', status: 'active', company: null,
        }),
        update: fn().mockResolvedValue({
          id: 'client-1', name: 'Updated Client', status: 'active',
        }),
        groupBy: fn().mockResolvedValue([]),
      },
      activity: {
        create: fn().mockResolvedValue({ id: 'act-1' }),
        findMany: fn().mockResolvedValue([]),
        count: fn().mockResolvedValue(0),
      },
      $transaction: fn().mockImplementation(async (cb: any) => cb(mockTx)),
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

import clientRoutes from './clients';

// ── Test app factory ─────────────────────────────────────────────────
function createApp(role: string = 'owner', userId = 'user-1') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: userId, email: 'test@whitecaves.ae', role };
    next();
  });
  app.use('/api/clients', clientRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const VALID_ID = 'aabbccddee11223344556677';

// ═════════════════════════════════════════════════════════════════════

describe('Clients Routes — /api/clients', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── GET / ────────────────────────────────────────────────────────
  describe('GET /api/clients', () => {
    it('returns 200 with paginated clients for agent', async () => {
      mockPrisma.client.findMany.mockResolvedValueOnce([
        { id: 'client-1', name: 'Alice', type: 'buyer', status: 'active' },
      ]);
      mockPrisma.client.count.mockResolvedValueOnce(1);
      const res = await request(createApp('agent'))
        .get('/api/clients');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toBeDefined();
    });

    it('returns 403 for viewer role', async () => {
      const res = await request(createApp('viewer'))
        .get('/api/clients');
      expect(res.status).toBe(403);
    });

    it('supports search filter', async () => {
      mockPrisma.client.findMany.mockResolvedValueOnce([]);
      mockPrisma.client.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner'))
        .get('/api/clients?search=Alice');
      expect(res.status).toBe(200);
    });
  });

  // ── GET /stats ───────────────────────────────────────────────────
  describe('GET /api/clients/stats', () => {
    it('returns stats for manager', async () => {
      mockPrisma.client.count.mockResolvedValueOnce(30);
      mockPrisma.client.groupBy
        .mockResolvedValueOnce([{ type: 'buyer', _count: { _all: 20 } }])
        .mockResolvedValueOnce([{ status: 'active', _count: { _all: 25 } }]);
      const res = await request(createApp('manager'))
        .get('/api/clients/stats');
      expect(res.status).toBe(200);
      expect(res.body.data.total).toBe(30);
      expect(res.body.data.byType).toBeDefined();
      expect(res.body.data.byStatus).toBeDefined();
    });

    it('returns 403 for agent', async () => {
      const res = await request(createApp('agent'))
        .get('/api/clients/stats');
      expect(res.status).toBe(403);
    });
  });

  // ── GET /:id ─────────────────────────────────────────────────────
  describe('GET /api/clients/:id', () => {
    it('returns client detail', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce({
        id: VALID_ID, name: 'Alice Client', type: 'buyer', status: 'active',
      });
      const res = await request(createApp('agent'))
        .get(`/api/clients/${VALID_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Alice Client');
    });

    it('returns 404 if not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('agent'))
        .get(`/api/clients/${VALID_ID}`);
      expect(res.status).toBe(404);
    });
  });

  // ── POST / ───────────────────────────────────────────────────────
  describe('POST /api/clients', () => {
    it('returns 201 on creation', async () => {
      mockPrisma.client.create.mockResolvedValueOnce({
        id: 'client-new', name: 'New Client', type: 'buyer', status: 'active',
        company: null,
      });
      const res = await request(createApp('agent'))
        .post('/api/clients')
        .send({ name: 'New Client', type: 'buyer', status: 'active' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('returns 403 for viewer', async () => {
      const res = await request(createApp('viewer'))
        .post('/api/clients')
        .send({ name: 'New Client' });
      expect(res.status).toBe(403);
    });
  });

  // ── PATCH /:id ───────────────────────────────────────────────────
  describe('PATCH /api/clients/:id', () => {
    it('returns 200 on update', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce({
        id: VALID_ID, name: 'Old Client', status: 'active',
      });
      mockPrisma.client.update.mockResolvedValueOnce({
        id: VALID_ID, name: 'Updated Client', status: 'vip',
      });
      const res = await request(createApp('owner'))
        .patch(`/api/clients/${VALID_ID}`)
        .send({ name: 'Updated Client', status: 'vip' });
      expect(res.status).toBe(200);
    });

    it('returns 404 if not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner'))
        .patch(`/api/clients/${VALID_ID}`)
        .send({ name: 'Update' });
      expect(res.status).toBe(404);
    });
  });

  // ── DELETE /:id ──────────────────────────────────────────────────
  describe('DELETE /api/clients/:id', () => {
    it('returns 200 on deletion', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce({
        id: VALID_ID, name: 'To Delete',
      });
      const res = await request(createApp('owner'))
        .delete(`/api/clients/${VALID_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it('returns 404 if not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner'))
        .delete(`/api/clients/${VALID_ID}`);
      expect(res.status).toBe(404);
    });

    it('returns 403 for viewer', async () => {
      const res = await request(createApp('viewer'))
        .delete(`/api/clients/${VALID_ID}`);
      expect(res.status).toBe(403);
    });
  });

  // ── GET /:id/communications ──────────────────────────────────────
  describe('GET /api/clients/:id/communications', () => {
    it('returns paginated activities', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce({
        id: VALID_ID, name: 'Alice',
      });
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        { id: 'act-1', type: 'client', action: 'created', description: 'New client created: Alice' },
      ]);
      mockPrisma.activity.count.mockResolvedValueOnce(1);
      const res = await request(createApp('agent'))
        .get(`/api/clients/${VALID_ID}/communications`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toBeDefined();
    });

    it('returns 404 if client not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('agent'))
        .get(`/api/clients/${VALID_ID}/communications`);
      expect(res.status).toBe(404);
    });
  });
});
