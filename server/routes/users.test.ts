/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Users Routes — Unit Tests
 * Tests /api/users endpoints: list, pending, me, get by ID, PATCH role/status
 * Covers: RBAC (role-based access), field validation, data scoping.
 * All Prisma calls are mocked — no database needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ─────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      user: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        count: fn().mockResolvedValue(0),
        update: fn().mockResolvedValue({}),
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
    skip:
      (Math.max(1, parseInt(page || '1') || 1) - 1) *
      Math.min(100, Math.max(1, parseInt(limit || '20') || 20)),
  }),
}));

import usersRoutes from './users';

// ── Test app factory ──────────────────────────────────────────────────
function createApp(role: string = 'owner', userId = 'user-owner-id') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: userId, email: 'owner@whitecaves.ae', role };
    next();
  });
  app.use('/api/users', usersRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const VALID_ID = 'aabbccddee11223344556677';
const OTHER_VALID_ID = '112233445566778899aabbcc';

// ══════════════════════════════════════════════════════════════════════

describe('Users Routes — /api/users', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── GET / ────────────────────────────────────────────────────────
  describe('GET /api/users', () => {
    it('returns 200 with paginated user list for owner', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([
        {
          id: VALID_ID,
          email: 'a@wc.ae',
          name: 'Alice',
          role: 'agent',
          status: 'active',
          createdAt: new Date(),
          _count: {},
        },
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      const res = await request(createApp('owner')).get('/api/users');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toBeDefined();
    });

    it('returns 200 for admin role (requireMinRole("admin") passes)', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([]);
      mockPrisma.user.count.mockResolvedValueOnce(0);
      const res = await request(createApp('admin')).get('/api/users');
      expect(res.status).toBe(200);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/users');
      expect(res.status).toBe(403);
    });

    it('returns 403 for viewer role', async () => {
      const res = await request(createApp('viewer')).get('/api/users');
      expect(res.status).toBe(403);
    });

    it('returns 403 for buyer role', async () => {
      const res = await request(createApp('buyer')).get('/api/users');
      expect(res.status).toBe(403);
    });

    it('supports role filter', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([]);
      mockPrisma.user.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner')).get('/api/users?role=agent');
      expect(res.status).toBe(200);
      const call = mockPrisma.user.findMany.mock.calls[0][0];
      expect(call.where.role).toBe('agent');
    });

    it('supports status filter', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([]);
      mockPrisma.user.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner')).get('/api/users?status=pending');
      expect(res.status).toBe(200);
      const call = mockPrisma.user.findMany.mock.calls[0][0];
      expect(call.where.status).toBe('pending');
    });

    it('ignores invalid status filter', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([]);
      mockPrisma.user.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner')).get('/api/users?status=badstatus');
      expect(res.status).toBe(200);
      const call = mockPrisma.user.findMany.mock.calls[0][0];
      expect(call.where.status).toBeUndefined();
    });

    it('supports search filter', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([]);
      mockPrisma.user.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner')).get('/api/users?search=John');
      expect(res.status).toBe(200);
      const call = mockPrisma.user.findMany.mock.calls[0][0];
      expect(call.where.OR).toBeDefined();
    });
  });

  // ── GET /me ──────────────────────────────────────────────────────
  describe('GET /api/users/me', () => {
    it('returns 200 with current user data', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-owner-id',
        email: 'owner@whitecaves.ae',
        name: 'Owner',
        role: 'owner',
        status: 'active',
      });
      const res = await request(createApp('owner')).get('/api/users/me');
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('owner@whitecaves.ae');
    });

    it('returns 200 for agent role (any authenticated user can call /me)', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-owner-id',
        email: 'agent@wc.ae',
        name: 'Agent',
        role: 'agent',
        status: 'active',
      });
      const res = await request(createApp('agent')).get('/api/users/me');
      expect(res.status).toBe(200);
    });

    it('returns 404 when DB finds no user', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner')).get('/api/users/me');
      expect(res.status).toBe(404);
    });
  });

  // ── GET /pending ─────────────────────────────────────────────────
  describe('GET /api/users/pending', () => {
    it('returns 200 with pending users for admin', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([
        {
          id: VALID_ID,
          email: 'new@wc.ae',
          role: 'agent',
          status: 'pending',
          createdAt: new Date(),
        },
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      const res = await request(createApp('admin')).get('/api/users/pending');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/users/pending');
      expect(res.status).toBe(403);
    });

    it('queries with status=pending', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([]);
      mockPrisma.user.count.mockResolvedValueOnce(0);
      await request(createApp('owner')).get('/api/users/pending');
      const call = mockPrisma.user.findMany.mock.calls[0][0];
      expect(call.where.status).toBe('pending');
    });
  });

  // ── GET /:id ─────────────────────────────────────────────────────
  describe('GET /api/users/:id', () => {
    it('returns 200 with user detail for admin', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        email: 'u@wc.ae',
        name: 'User',
        role: 'agent',
        status: 'active',
        _count: { leadsAssigned: 5, commissions: 2, properties: 1 },
      });
      const res = await request(createApp('admin')).get(`/api/users/${VALID_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('u@wc.ae');
    });

    it('returns 404 if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('admin')).get(`/api/users/${VALID_ID}`);
      expect(res.status).toBe(404);
    });

    it('returns 400 for invalid ID format', async () => {
      const res = await request(createApp('admin')).get('/api/users/not-valid');
      expect(res.status).toBe(400);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get(`/api/users/${VALID_ID}`);
      expect(res.status).toBe(403);
    });
  });

  // ── PATCH /:id ───────────────────────────────────────────────────
  describe('PATCH /api/users/:id', () => {
    const existingUser = {
      id: OTHER_VALID_ID,
      email: 'target@wc.ae',
      name: 'Target',
      role: 'agent',
      status: 'active',
    };
    const updatedUser = { ...existingUser, role: 'manager', updatedAt: new Date() };

    it('allows owner to update role', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(existingUser);
      mockPrisma.user.update.mockResolvedValueOnce(updatedUser);
      const res = await request(createApp('owner', OTHER_VALID_ID.replace(OTHER_VALID_ID[0], 'a')))
        .patch(`/api/users/${OTHER_VALID_ID}`)
        .send({ role: 'manager' });
      // note: owner is different user, so safe to change target's role
      expect(res.status).toBe(200);
      expect(mockPrisma.user.update).toHaveBeenCalled();
    });

    it('returns 403 for admin role (cannot change roles — owner-only)', async () => {
      const res = await request(createApp('admin'))
        .patch(`/api/users/${OTHER_VALID_ID}`)
        .send({ role: 'manager' });
      expect(res.status).toBe(403);
    });

    it('returns 403 for manager role', async () => {
      const res = await request(createApp('manager'))
        .patch(`/api/users/${OTHER_VALID_ID}`)
        .send({ status: 'active' });
      expect(res.status).toBe(403);
    });

    it('returns 400 for invalid role', async () => {
      // Route throws before calling findUnique — no mock needed
      const res = await request(createApp('owner'))
        .patch(`/api/users/${OTHER_VALID_ID}`)
        .send({ role: 'superuser_hacker' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid role/i);
    });

    it('returns 400 for invalid status', async () => {
      // Route throws before calling findUnique — no mock needed
      const res = await request(createApp('owner'))
        .patch(`/api/users/${OTHER_VALID_ID}`)
        .send({ status: 'broken' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid status/i);
    });

    it('returns 400 when no valid fields provided', async () => {
      // Route throws before calling findUnique — no mock needed
      const res = await request(createApp('owner')).patch(`/api/users/${OTHER_VALID_ID}`).send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/no valid fields/i);
    });

    it('returns 404 when target user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner'))
        .patch(`/api/users/${OTHER_VALID_ID}`)
        .send({ status: 'active' });
      expect(res.status).toBe(404);
    });

    it('prevents owner from downgrading their own role', async () => {
      const ownId = VALID_ID;
      const res = await request(createApp('owner', ownId))
        .patch(`/api/users/${ownId}`)
        .send({ role: 'agent' });
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/cannot downgrade your own owner role/i);
    });

    it('allows owner to update their own name/phone (non-role fields)', async () => {
      const ownId = VALID_ID;
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        ...existingUser,
        id: ownId,
        role: 'owner',
      });
      mockPrisma.user.update.mockResolvedValueOnce({
        ...existingUser,
        id: ownId,
        name: 'Updated Name',
      });
      const res = await request(createApp('owner', ownId))
        .patch(`/api/users/${ownId}`)
        .send({ name: 'Updated Name' });
      expect(res.status).toBe(200);
    });
  });

  // ── PATCH /:id/status ────────────────────────────────────────────
  describe('PATCH /api/users/:id/status', () => {
    const existingUser = {
      id: OTHER_VALID_ID,
      email: 'u@wc.ae',
      name: 'U',
      role: 'agent',
      status: 'pending',
    };

    it('allows admin to activate a pending user', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(existingUser);
      mockPrisma.user.update.mockResolvedValueOnce({
        ...existingUser,
        status: 'active',
        updatedAt: new Date(),
      });
      const res = await request(createApp('admin'))
        .patch(`/api/users/${OTHER_VALID_ID}/status`)
        .send({ status: 'active' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('active');
    });

    it('allows owner to suspend a user', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(existingUser);
      mockPrisma.user.update.mockResolvedValueOnce({
        ...existingUser,
        status: 'suspended',
        updatedAt: new Date(),
      });
      const res = await request(createApp('owner'))
        .patch(`/api/users/${OTHER_VALID_ID}/status`)
        .send({ status: 'suspended' });
      expect(res.status).toBe(200);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .patch(`/api/users/${OTHER_VALID_ID}/status`)
        .send({ status: 'active' });
      expect(res.status).toBe(403);
    });

    it('returns 400 for invalid status value', async () => {
      const res = await request(createApp('admin'))
        .patch(`/api/users/${OTHER_VALID_ID}/status`)
        .send({ status: 'whatever' });
      expect(res.status).toBe(400);
    });

    it('returns 404 when target user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('admin'))
        .patch(`/api/users/${OTHER_VALID_ID}/status`)
        .send({ status: 'active' });
      expect(res.status).toBe(404);
    });

    it('records an audit activity on status change', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(existingUser);
      mockPrisma.user.update.mockResolvedValueOnce({
        ...existingUser,
        status: 'active',
        updatedAt: new Date(),
      });
      await request(createApp('admin'))
        .patch(`/api/users/${OTHER_VALID_ID}/status`)
        .send({ status: 'active' });
      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'updated', type: 'system' }),
        })
      );
    });
  });
});
