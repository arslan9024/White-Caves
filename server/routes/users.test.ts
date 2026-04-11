/**
 * Users Routes — Unit Tests
 * Tests /api/users endpoints: list, stats, detail, role, status, deactivate
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
      user: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        count: fn().mockResolvedValue(0),
        update: fn().mockResolvedValue({
          id: 'user-2', email: 'agent@whitecaves.ae', name: 'Agent User',
          role: 'agent', status: 'active', department: null,
        }),
        groupBy: fn().mockResolvedValue([]),
      },
      activity: {
        create: fn().mockResolvedValue({ id: 'act-1' }),
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

import userRoutes from './users';

// ── Test app factory ─────────────────────────────────────────────────
function createApp(role: string = 'owner', userId = 'user-1') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: userId, email: 'test@whitecaves.ae', role };
    next();
  });
  app.use('/api/users', userRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const VALID_ID = 'aabbccddee11223344556677';

// ═════════════════════════════════════════════════════════════════════

describe('Users Routes — /api/users', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── GET / ────────────────────────────────────────────────────────
  describe('GET /api/users', () => {
    it('returns 200 for manager', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([
        { id: 'user-2', email: 'agent@test.com', name: 'Agent', role: 'agent', status: 'active' },
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      const res = await request(createApp('manager'))
        .get('/api/users');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toBeDefined();
    });

    it('returns 403 for agent', async () => {
      const res = await request(createApp('agent'))
        .get('/api/users');
      expect(res.status).toBe(403);
    });

    it('supports search filter', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([]);
      mockPrisma.user.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner'))
        .get('/api/users?search=John');
      expect(res.status).toBe(200);
    });
  });

  // ── GET /stats ───────────────────────────────────────────────────
  describe('GET /api/users/stats', () => {
    it('returns stats for owner', async () => {
      mockPrisma.user.count.mockResolvedValueOnce(10);
      mockPrisma.user.groupBy
        .mockResolvedValueOnce([{ role: 'agent', _count: { _all: 5 } }])
        .mockResolvedValueOnce([{ status: 'active', _count: { _all: 8 } }]);
      const res = await request(createApp('owner'))
        .get('/api/users/stats');
      expect(res.status).toBe(200);
      expect(res.body.data.total).toBe(10);
      expect(res.body.data.byRole).toBeDefined();
      expect(res.body.data.byStatus).toBeDefined();
    });

    it('returns 403 for agent', async () => {
      const res = await request(createApp('agent'))
        .get('/api/users/stats');
      expect(res.status).toBe(403);
    });
  });

  // ── GET /:id ─────────────────────────────────────────────────────
  describe('GET /api/users/:id', () => {
    it('returns user detail', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: VALID_ID, email: 'agent@test.com', name: 'Agent User',
        role: 'agent', status: 'active', department: null,
      });
      const res = await request(createApp('manager'))
        .get(`/api/users/${VALID_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Agent User');
    });

    it('returns 404 if not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('manager'))
        .get(`/api/users/${VALID_ID}`);
      expect(res.status).toBe(404);
    });

    it('returns 403 for agent', async () => {
      const res = await request(createApp('agent'))
        .get(`/api/users/${VALID_ID}`);
      expect(res.status).toBe(403);
    });
  });

  // ── PATCH /:id/role ──────────────────────────────────────────────
  describe('PATCH /api/users/:id/role', () => {
    it('changes role for owner', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: VALID_ID, email: 'agent@test.com', name: 'Agent User',
        role: 'agent', status: 'active',
      });
      mockPrisma.user.update.mockResolvedValueOnce({
        id: VALID_ID, email: 'agent@test.com', name: 'Agent User',
        role: 'manager', status: 'active', department: null,
      });
      const res = await request(createApp('owner'))
        .patch(`/api/users/${VALID_ID}/role`)
        .send({ role: 'manager' });
      expect(res.status).toBe(200);
      expect(res.body.data.role).toBe('manager');
    });

    it('returns 403 for manager', async () => {
      const res = await request(createApp('manager'))
        .patch(`/api/users/${VALID_ID}/role`)
        .send({ role: 'admin' });
      expect(res.status).toBe(403);
    });

    it('returns 404 if not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner'))
        .patch(`/api/users/${VALID_ID}/role`)
        .send({ role: 'manager' });
      expect(res.status).toBe(404);
    });
  });

  // ── PATCH /:id/status ────────────────────────────────────────────
  describe('PATCH /api/users/:id/status', () => {
    it('changes status for manager', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: VALID_ID, email: 'agent@test.com', name: 'Agent User',
        role: 'agent', status: 'active',
      });
      mockPrisma.user.update.mockResolvedValueOnce({
        id: VALID_ID, email: 'agent@test.com', name: 'Agent User',
        role: 'agent', status: 'inactive', department: null,
      });
      const res = await request(createApp('manager'))
        .patch(`/api/users/${VALID_ID}/status`)
        .send({ status: 'inactive' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('inactive');
    });

    it('returns 404 if not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('manager'))
        .patch(`/api/users/${VALID_ID}/status`)
        .send({ status: 'inactive' });
      expect(res.status).toBe(404);
    });

    it('returns 403 for agent', async () => {
      const res = await request(createApp('agent'))
        .patch(`/api/users/${VALID_ID}/status`)
        .send({ status: 'inactive' });
      expect(res.status).toBe(403);
    });
  });

  // ── DELETE /:id ──────────────────────────────────────────────────
  describe('DELETE /api/users/:id', () => {
    it('deactivates user for owner', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: VALID_ID, email: 'agent@test.com', name: 'Agent User',
        role: 'agent', status: 'active',
      });
      mockPrisma.user.update.mockResolvedValueOnce({
        id: VALID_ID, email: 'agent@test.com', name: 'Agent User',
        role: 'agent', status: 'inactive', department: null,
      });
      const res = await request(createApp('owner'))
        .delete(`/api/users/${VALID_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 403 for manager', async () => {
      const res = await request(createApp('manager'))
        .delete(`/api/users/${VALID_ID}`);
      expect(res.status).toBe(403);
    });

    it('returns 400 for self-deactivation', async () => {
      const res = await request(createApp('owner', VALID_ID))
        .delete(`/api/users/${VALID_ID}`);
      expect(res.status).toBe(400);
    });

    it('returns 404 if not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner'))
        .delete(`/api/users/${VALID_ID}`);
      expect(res.status).toBe(404);
    });
  });
});
