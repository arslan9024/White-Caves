/**
 * Activities Routes — Unit Tests
 * Tests /api/activities endpoints: list, single, create, update, delete
 * All Prisma calls are mocked — no database needed.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  const makeActivity = (overrides = {}) => ({
    id: 'act-aabbccddee11223344556677',
    type: 'lead',
    action: 'created',
    description: 'Lead was created',
    metadata: null,
    createdAt: new Date('2026-01-15T10:00:00Z'),
    userId: 'user-1',
    leadId: 'lead-1',
    user: { id: 'user-1', name: 'Agent Smith', email: 'agent@whitecaves.ae' },
    lead: null,
    ...overrides,
  });

  return {
    mockPrisma: {
      activity: {
        findMany: fn().mockResolvedValue([makeActivity()]),
        findUnique: fn().mockResolvedValue(makeActivity()),
        count: fn().mockResolvedValue(1),
        create: fn().mockResolvedValue(makeActivity()),
        update: fn().mockResolvedValue(makeActivity({ description: 'Updated desc' })),
        delete: fn().mockResolvedValue({}),
      },
    },
    makeActivity,
  };
});

const { triggerLeadRescore } = vi.hoisted(() => ({
  triggerLeadRescore: vi.fn(),
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../services/ai/leadAutoRescore.js', () => ({ triggerLeadRescore }));
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
vi.mock('../middleware/rbac', () => ({
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
}));
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
    skip: 0,
  }),
}));

import activitiesRoutes from './activities';

// ── Test app factory ─────────────────────────────────────────────────
function createApp(role = 'owner', userId = 'user-1') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: userId, email: 'agent@whitecaves.ae', role };
    next();
  });
  app.use('/api/activities', activitiesRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const VALID_ID = 'aabbccddee11223344556677';

// ═════════════════════════════════════════════════════════════════════

describe('Activities Routes — /api/activities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    triggerLeadRescore.mockClear();
  });

  // ── GET / ────────────────────────────────────────────────────────
  describe('GET /api/activities', () => {
    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/activities');

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/manager or above/i);
    });

    it('returns 403 for landlord role', async () => {
      const res = await request(createApp('landlord')).get('/api/activities');

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/manager or above/i);
    });

    it('returns a paginated list of activities', async () => {
      const res = await request(createApp()).get('/api/activities');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toHaveProperty('total', 1);
    });

    it('passes type filter to prisma', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(0);

      const res = await request(createApp()).get('/api/activities?type=lead');
      expect(res.status).toBe(200);

      const findManyCall = mockPrisma.activity.findMany.mock.calls[0][0];
      expect(findManyCall.where.type).toBe('lead');
    });

    it('ignores type=all (no type filter)', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(0);

      const res = await request(createApp()).get('/api/activities?type=all');
      expect(res.status).toBe(200);

      const findManyCall = mockPrisma.activity.findMany.mock.calls[0][0];
      expect(findManyCall.where.type).toBeUndefined();
    });

    it('passes userId filter to prisma', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(0);

      await request(createApp()).get('/api/activities?userId=user-99');

      const findManyCall = mockPrisma.activity.findMany.mock.calls[0][0];
      expect(findManyCall.where.userId).toBe('user-99');
    });

    it('passes leadId filter to prisma', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(0);

      await request(createApp()).get('/api/activities?leadId=lead-123');

      const findManyCall = mockPrisma.activity.findMany.mock.calls[0][0];
      expect(findManyCall.where.leadId).toBe('lead-123');
    });

    it('passes search filter to prisma across fields', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(0);

      await request(createApp()).get('/api/activities?search=smith');

      const findManyCall = mockPrisma.activity.findMany.mock.calls[0][0];
      expect(Array.isArray(findManyCall.where.OR)).toBe(true);
      expect(findManyCall.where.OR).toHaveLength(6);
    });

    it('defaults sortBy to createdAt, sortOrder to desc', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(0);

      await request(createApp()).get('/api/activities');

      const findManyCall = mockPrisma.activity.findMany.mock.calls[0][0];
      expect(findManyCall.orderBy).toMatchObject({ createdAt: 'desc' });
    });

    it('ignores invalid sortBy field (falls back to createdAt)', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(0);

      await request(createApp()).get('/api/activities?sortBy=hacked_field&sortOrder=asc');

      const findManyCall = mockPrisma.activity.findMany.mock.calls[0][0];
      expect(findManyCall.orderBy).toMatchObject({ createdAt: 'asc' });
    });

    it('returns correct pagination meta', async () => {
      mockPrisma.activity.count.mockResolvedValueOnce(50);
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);

      const res = await request(createApp()).get('/api/activities?page=2&pageSize=10');
      expect(res.body.pagination.total).toBe(50);
    });
  });

  // ── GET /:id ─────────────────────────────────────────────────────
  describe('GET /api/activities/:id', () => {
    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get(`/api/activities/${VALID_ID}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/manager or above/i);
    });

    it('returns a single activity by valid id', async () => {
      const res = await request(createApp()).get(`/api/activities/${VALID_ID}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
    });

    it('returns 404 when activity not found', async () => {
      mockPrisma.activity.findUnique.mockResolvedValueOnce(null);

      const res = await request(createApp()).get(`/api/activities/${VALID_ID}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/not found/i);
    });

    it('returns 400 for invalid id format', async () => {
      const res = await request(createApp()).get('/api/activities/invalid-id');
      expect(res.status).toBe(400);
    });
  });

  // ── POST / ───────────────────────────────────────────────────────
  describe('POST /api/activities', () => {
    it('creates an activity successfully', async () => {
      const res = await request(createApp()).post('/api/activities').send({
        type: 'lead',
        action: 'created',
        description: 'New lead added',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('type');
    });

    it('returns 400 when type is missing', async () => {
      const res = await request(createApp())
        .post('/api/activities')
        .send({ action: 'created', description: 'desc' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/type/i);
    });

    it('returns 400 when action is missing', async () => {
      const res = await request(createApp())
        .post('/api/activities')
        .send({ type: 'lead', description: 'desc' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/action/i);
    });

    it('returns 400 when description is missing', async () => {
      const res = await request(createApp())
        .post('/api/activities')
        .send({ type: 'lead', action: 'created' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/description/i);
    });

    it('stores the userId from the authenticated user', async () => {
      await request(createApp('owner', 'user-abc'))
        .post('/api/activities')
        .send({ type: 'lead', action: 'created', description: 'test' });

      const createCall = mockPrisma.activity.create.mock.calls[0][0];
      expect(createCall.data.userId).toBe('user-abc');
    });

    it('accepts optional leadId', async () => {
      await request(createApp())
        .post('/api/activities')
        .send({ type: 'lead', action: 'created', description: 'test', leadId: 'lead-99' });

      const createCall = mockPrisma.activity.create.mock.calls[0][0];
      expect(createCall.data.leadId).toBe('lead-99');
    });

    it('triggers lead auto-rescore when leadId is present', async () => {
      mockPrisma.activity.create.mockResolvedValueOnce({
        id: 'act-aabbccddee11223344556677',
        type: 'lead',
        action: 'created',
        description: 'Lead was created',
        metadata: null,
        createdAt: new Date('2026-01-15T10:00:00Z'),
        userId: 'user-1',
        leadId: 'lead-99',
        user: { id: 'user-1', name: 'Agent Smith', email: 'agent@whitecaves.ae' },
        lead: null,
      });

      await request(createApp())
        .post('/api/activities')
        .send({ type: 'lead', action: 'created', description: 'test', leadId: 'lead-99' });

      expect(triggerLeadRescore).toHaveBeenCalledWith('lead-99', 'activity_created');
    });
  });

  // ── PATCH /:id ───────────────────────────────────────────────────
  describe('PATCH /api/activities/:id', () => {
    it('updates an activity description', async () => {
      const res = await request(createApp())
        .patch(`/api/activities/${VALID_ID}`)
        .send({ description: 'Updated description' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 404 when activity not found', async () => {
      mockPrisma.activity.findUnique.mockResolvedValueOnce(null);

      const res = await request(createApp())
        .patch(`/api/activities/${VALID_ID}`)
        .send({ description: 'Updated' });

      expect(res.status).toBe(404);
    });

    it('returns 400 for invalid id format', async () => {
      const res = await request(createApp())
        .patch('/api/activities/bad-id')
        .send({ description: 'Updated' });

      expect(res.status).toBe(400);
    });

    it('passes metadata update to prisma', async () => {
      const meta = { key: 'value' };
      await request(createApp()).patch(`/api/activities/${VALID_ID}`).send({ metadata: meta });

      const updateCall = mockPrisma.activity.update.mock.calls[0][0];
      expect(updateCall.data.metadata).toEqual(meta);
    });

    it('triggers lead auto-rescore on patch', async () => {
      await request(createApp())
        .patch(`/api/activities/${VALID_ID}`)
        .send({ description: 'Updated' });
      expect(triggerLeadRescore).toHaveBeenCalledWith(expect.anything(), 'activity_updated');
    });
  });

  // ── DELETE /:id ──────────────────────────────────────────────────
  describe('DELETE /api/activities/:id', () => {
    it('deletes activity for admin role', async () => {
      const res = await request(createApp('owner')).delete(`/api/activities/${VALID_ID}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/deleted/i);
    });

    it('returns 403 for non-admin role', async () => {
      const res = await request(createApp('agent')).delete(`/api/activities/${VALID_ID}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/manager/i);
    });

    it('returns 404 when activity not found', async () => {
      mockPrisma.activity.findUnique.mockResolvedValueOnce(null);

      const res = await request(createApp('owner')).delete(`/api/activities/${VALID_ID}`);

      expect(res.status).toBe(404);
    });

    it('returns 400 for invalid id format', async () => {
      const res = await request(createApp('owner')).delete('/api/activities/bad-id');

      expect(res.status).toBe(400);
    });

    it('triggers lead auto-rescore on delete', async () => {
      await request(createApp('owner')).delete(`/api/activities/${VALID_ID}`);
      expect(triggerLeadRescore).toHaveBeenCalledWith(expect.anything(), 'activity_deleted');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// W20-001 — Audit Export RBAC Security Tests
// Verifies the ROLE_PERMISSIONS contract: only manager+ roles can access audit
// exports. Uses vi.importActual to bypass the module mock above.
// ─────────────────────────────────────────────────────────────────────────────

describe('W20-001 — Audit Export RBAC — ROLE_PERMISSIONS contract', () => {
  let ROLE_PERMISSIONS: Record<string, string[]>;

  beforeAll(async () => {
    const actual = await vi.importActual<typeof import('../middleware/rbac')>('../middleware/rbac');
    ROLE_PERMISSIONS = actual.ROLE_PERMISSIONS;
  });

  it('buyer does not have view_audit_logs permission', () => {
    expect(ROLE_PERMISSIONS['buyer'] ?? []).not.toContain('view_audit_logs');
  });

  it('tenant does not have view_audit_logs permission', () => {
    expect(ROLE_PERMISSIONS['tenant'] ?? []).not.toContain('view_audit_logs');
  });

  it('seller does not have view_audit_logs permission', () => {
    expect(ROLE_PERMISSIONS['seller'] ?? []).not.toContain('view_audit_logs');
  });

  it('landlord does not have view_audit_logs permission', () => {
    expect(ROLE_PERMISSIONS['landlord'] ?? []).not.toContain('view_audit_logs');
  });

  it('agent does not have view_audit_logs permission', () => {
    expect(ROLE_PERMISSIONS['agent'] ?? []).not.toContain('view_audit_logs');
  });

  it('manager has view_audit_logs permission', () => {
    expect(ROLE_PERMISSIONS['manager']).toContain('view_audit_logs');
  });

  it('admin has view_audit_logs permission', () => {
    expect(ROLE_PERMISSIONS['admin']).toContain('view_audit_logs');
  });

  it('owner has view_audit_logs permission', () => {
    expect(ROLE_PERMISSIONS['owner']).toContain('view_audit_logs');
  });
});
