/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Leads Routes — Unit Tests
 * Tests /api/leads endpoints: list, stats, analytics, CRUD, activities
 * All Prisma calls are mocked — no database needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  const mockTx = {
    commission: { updateMany: fn().mockResolvedValue({ count: 0 }) },
    activity: {
      deleteMany: fn().mockResolvedValue({ count: 0 }),
      create: fn().mockResolvedValue({ id: 'act-1' }),
    },
    lead: { delete: fn().mockResolvedValue({}) },
  };
  return {
    mockPrisma: {
      lead: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        count: fn().mockResolvedValue(0),
        create: fn().mockResolvedValue({
          id: 'lead-1',
          name: 'John Client',
          email: 'john@client.com',
          status: 'new',
          source: 'direct',
          score: 50,
          assignedTo: null,
        }),
        update: fn().mockResolvedValue({
          id: 'lead-1',
          name: 'Updated Lead',
          status: 'contacted',
          assignedTo: null,
        }),
        groupBy: fn().mockResolvedValue([]),
        aggregate: fn().mockResolvedValue({ _avg: { score: 65, budget: 500000 } }),
      },
      activity: {
        create: fn().mockResolvedValue({
          id: 'act-1',
          type: 'lead',
          action: 'created',
          user: { id: 'user-1', name: 'Agent' },
        }),
      },
      $transaction: fn().mockImplementation(async (cb: any) => cb(mockTx)),
    },
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
    skip:
      (Math.max(1, parseInt(page || '1') || 1) - 1) *
      Math.min(100, Math.max(1, parseInt(limit || '20') || 20)),
  }),
}));

import leadRoutes from './leads';

// ── Test app factory ─────────────────────────────────────────────────
function createApp(role: string = 'owner', userId = 'user-1') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: userId, email: 'test@whitecaves.ae', role };
    next();
  });
  app.use('/api/leads', leadRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const VALID_ID = 'aabbccddee11223344556677';

// ═════════════════════════════════════════════════════════════════════

describe('Leads Routes — /api/leads', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    triggerLeadRescore.mockClear();
  });

  // ── GET / ────────────────────────────────────────────────────────
  describe('GET /api/leads', () => {
    it('returns 200 with paginated leads', async () => {
      mockPrisma.lead.findMany.mockResolvedValueOnce([
        { id: 'lead-1', name: 'John', status: 'new' },
      ]);
      mockPrisma.lead.count.mockResolvedValueOnce(1);
      const res = await request(createApp('agent')).get('/api/leads');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toBeDefined();
    });

    it('supports search filter', async () => {
      mockPrisma.lead.findMany.mockResolvedValueOnce([]);
      mockPrisma.lead.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner')).get('/api/leads?search=John');
      expect(res.status).toBe(200);
    });

    it('supports status and source filters', async () => {
      mockPrisma.lead.findMany.mockResolvedValueOnce([]);
      mockPrisma.lead.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner')).get(
        '/api/leads?status=qualified&source=referral'
      );
      expect(res.status).toBe(200);
    });

    it('supports score range filters', async () => {
      mockPrisma.lead.findMany.mockResolvedValueOnce([]);
      mockPrisma.lead.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner')).get('/api/leads?minScore=50&maxScore=100');
      expect(res.status).toBe(200);
    });

    it('supports assignedTo filter', async () => {
      mockPrisma.lead.findMany.mockResolvedValueOnce([]);
      mockPrisma.lead.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner')).get('/api/leads?assignedTo=agent-1');
      expect(res.status).toBe(200);
    });

    it('supports sort options', async () => {
      mockPrisma.lead.findMany.mockResolvedValueOnce([]);
      mockPrisma.lead.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner')).get('/api/leads?sortBy=score&sortOrder=desc');
      expect(res.status).toBe(200);
    });

    it('returns 422 for invalid status filter', async () => {
      const res = await request(createApp('owner')).get('/api/leads?status=invalid_status');
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });

    it('returns 422 for invalid source filter', async () => {
      const res = await request(createApp('owner')).get('/api/leads?source=unknown_source');
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });

    it('scopes agent to their own leads via ownershipFilter', async () => {
      // Regression: agents previously saw ALL leads. Now scopeToOwn('assignedToId')
      // restricts the DB query to only leads where assignedToId === req.user.id.
      mockPrisma.lead.findMany.mockResolvedValueOnce([]);
      mockPrisma.lead.count.mockResolvedValueOnce(0);
      const res = await request(createApp('agent', 'agent-xyz')).get('/api/leads');
      expect(res.status).toBe(200);
      const callArgs = mockPrisma.lead.findMany.mock.calls[0][0];
      expect(callArgs.where.assignedToId).toBe('agent-xyz');
    });

    it('does NOT restrict owner query (supervisor sees all leads)', async () => {
      mockPrisma.lead.findMany.mockResolvedValueOnce([]);
      mockPrisma.lead.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner', 'owner-id')).get('/api/leads');
      expect(res.status).toBe(200);
      const callArgs = mockPrisma.lead.findMany.mock.calls[0][0];
      expect(callArgs.where.assignedToId).toBeUndefined();
    });
  });

  // ── GET /stats ───────────────────────────────────────────────────
  describe('GET /api/leads/stats', () => {
    it('returns lead statistics for manager', async () => {
      mockPrisma.lead.count.mockResolvedValueOnce(42);
      mockPrisma.lead.groupBy
        .mockResolvedValueOnce([{ status: 'new', _count: { _all: 20 } }])
        .mockResolvedValueOnce([{ source: 'direct', _count: { _all: 15 } }]);
      mockPrisma.lead.aggregate.mockResolvedValueOnce({
        _avg: { score: 65, budget: 500000 },
      });
      const res = await request(createApp('manager')).get('/api/leads/stats');
      expect(res.status).toBe(200);
      expect(res.body.data.total).toBe(42);
      expect(res.body.data.averageScore).toBeDefined();
    });

    it('returns 200 for managing_director role (role alias → owner)', async () => {
      // Regression: inline check used raw role strings and failed for managing_director.
      // Now uses requireMinRole('manager') which resolves aliases first.
      mockPrisma.lead.count.mockResolvedValueOnce(5);
      mockPrisma.lead.groupBy.mockResolvedValue([]);
      mockPrisma.lead.aggregate.mockResolvedValueOnce({ _avg: { score: 0, budget: 0 } });
      const res = await request(createApp('managing_director')).get('/api/leads/stats');
      expect(res.status).toBe(200);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/leads/stats');
      expect(res.status).toBe(403);
    });
  });

  // ── GET /analytics/conversion ────────────────────────────────────
  describe('GET /api/leads/analytics/conversion', () => {
    it('returns conversion analytics for manager', async () => {
      mockPrisma.lead.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(20) // won
        .mockResolvedValueOnce(10); // lost
      const res = await request(createApp('manager')).get('/api/leads/analytics/conversion');
      expect(res.status).toBe(200);
      expect(res.body.data.total).toBe(100);
      expect(res.body.data.conversionRate).toBe(20);
      expect(res.body.data.lossRate).toBe(10);
    });

    it('returns 200 for managing_director role (role alias → owner)', async () => {
      // Regression: same bug as /stats — inline check bypassed resolveBackendRole.
      mockPrisma.lead.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      const res = await request(createApp('managing_director')).get(
        '/api/leads/analytics/conversion'
      );
      expect(res.status).toBe(200);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/leads/analytics/conversion');
      expect(res.status).toBe(403);
    });

    it('handles zero total leads gracefully', async () => {
      mockPrisma.lead.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      const res = await request(createApp('owner')).get('/api/leads/analytics/conversion');
      expect(res.status).toBe(200);
      expect(res.body.data.conversionRate).toBe(0);
      expect(res.body.data.lossRate).toBe(0);
    });
  });

  // ── GET /:id ─────────────────────────────────────────────────────
  describe('GET /api/leads/:id', () => {
    it('returns lead details', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        name: 'John Client',
        status: 'qualified',
        assignedTo: null,
        createdBy: null,
        property: null,
        activities: [],
        commissions: [],
      });
      const res = await request(createApp('agent')).get(`/api/leads/${VALID_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('John Client');
    });

    it('returns 404 if not found', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('agent')).get(`/api/leads/${VALID_ID}`);
      expect(res.status).toBe(404);
    });
  });

  // ── POST / ───────────────────────────────────────────────────────
  describe('POST /api/leads', () => {
    it('returns 201 on successful creation', async () => {
      mockPrisma.lead.create.mockResolvedValueOnce({
        id: 'lead-new',
        name: 'New Lead',
        status: 'new',
        source: 'direct',
        assignedTo: null,
      });
      const res = await request(createApp('agent'))
        .post('/api/leads')
        .send({ name: 'New Lead', status: 'new', source: 'direct' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('logs activity on creation', async () => {
      mockPrisma.lead.create.mockResolvedValueOnce({
        id: 'lead-new',
        name: 'Activity Lead',
        status: 'new',
        company: 'Big Corp',
        assignedTo: null,
      });
      await request(createApp('agent'))
        .post('/api/leads')
        .send({ name: 'Activity Lead', company: 'Big Corp' });
      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: 'lead',
            action: 'created',
          }),
        })
      );
    });

    it('triggers auto-rescore on lead creation', async () => {
      mockPrisma.lead.create.mockResolvedValueOnce({
        id: 'lead-rescore-1',
        name: 'Rescore Lead',
        status: 'new',
        source: 'direct',
        assignedTo: null,
      });
      await request(createApp('agent'))
        .post('/api/leads')
        .send({ name: 'Rescore Lead', status: 'new', source: 'direct' });
      expect(triggerLeadRescore).toHaveBeenCalledWith('lead-rescore-1', 'lead_created');
    });
  });

  // ── POST /from-search ───────────────────────────────────────────
  describe('POST /api/leads/from-search', () => {
    it('returns 201 and persists a homepage search lead', async () => {
      mockPrisma.lead.create.mockResolvedValueOnce({
        id: 'lead-search-1',
        name: '[Homepage] BUY search - Downtown Dubai - Apartment - 2BR',
        source: 'homepage_search',
        status: 'new',
        score: 10,
        tags: ['homepage_search', 'buy', 'downtown_dubai', 'apartment'],
        createdAt: '2026-05-18T00:00:00.000Z',
      });

      const res = await request(createApp('agent')).post('/api/leads/from-search').send({
        mode: 'buy',
        location: 'Downtown Dubai',
        propertyType: 'Apartment',
        beds: 2,
        minPrice: 1000000,
        maxPrice: 3000000,
        sessionId: 'sess_123',
        searchedAt: '2026-05-18T00:00:00.000Z',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.source).toBe('homepage_search');
      expect(res.body.data.status).toBe('new');
      expect(mockPrisma.lead.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            source: 'homepage_search',
            status: 'new',
            stage: 'awareness',
          }),
        })
      );
    });

    it('returns 400 for invalid mode', async () => {
      const res = await request(createApp('agent'))
        .post('/api/leads/from-search')
        .send({ mode: 'lease' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/mode/i);
    });
  });

  // ── PATCH /:id ───────────────────────────────────────────────────
  describe('PATCH /api/leads/:id', () => {
    it('returns 200 on successful update by admin', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        name: 'Old Lead',
        status: 'new',
        createdById: 'other',
      });
      mockPrisma.lead.update.mockResolvedValueOnce({
        id: VALID_ID,
        name: 'Updated Lead',
        status: 'contacted',
        assignedTo: null,
      });
      const res = await request(createApp('owner'))
        .patch(`/api/leads/${VALID_ID}`)
        .send({ name: 'Updated Lead', status: 'contacted' });
      expect(res.status).toBe(200);
    });

    it('allows lead creator to update their own lead', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        name: 'My Lead',
        status: 'new',
        createdById: 'user-1',
      });
      mockPrisma.lead.update.mockResolvedValueOnce({
        id: VALID_ID,
        name: 'My Updated Lead',
        status: 'contacted',
        assignedTo: null,
      });
      const res = await request(createApp('agent', 'user-1'))
        .patch(`/api/leads/${VALID_ID}`)
        .send({ name: 'My Updated Lead' });
      expect(res.status).toBe(200);
    });

    it('returns 403 if not admin and not creator', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        name: 'Other Lead',
        status: 'new',
        createdById: 'other-user',
      });
      const res = await request(createApp('agent', 'user-1'))
        .patch(`/api/leads/${VALID_ID}`)
        .send({ name: 'Hijack' });
      expect(res.status).toBe(403);
    });

    it('returns 404 if not found', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner'))
        .patch(`/api/leads/${VALID_ID}`)
        .send({ name: 'Update' });
      expect(res.status).toBe(404);
    });

    it('logs status_changed activity on status update', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        name: 'Status Lead',
        status: 'new',
        createdById: 'user-1',
      });
      mockPrisma.lead.update.mockResolvedValueOnce({
        id: VALID_ID,
        name: 'Status Lead',
        status: 'qualified',
        assignedTo: null,
      });
      await request(createApp('owner'))
        .patch(`/api/leads/${VALID_ID}`)
        .send({ status: 'qualified' });
      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'status_changed' }),
        })
      );
    });

    it('triggers auto-rescore with lifecycle context on status change', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        name: 'Lifecycle Lead',
        status: 'new',
        createdById: 'user-1',
      });
      mockPrisma.lead.update.mockResolvedValueOnce({
        id: VALID_ID,
        name: 'Lifecycle Lead',
        status: 'qualified',
        assignedTo: null,
      });
      await request(createApp('owner'))
        .patch(`/api/leads/${VALID_ID}`)
        .send({ status: 'qualified' });
      expect(triggerLeadRescore).toHaveBeenCalledWith(VALID_ID, 'lead_status_changed');
    });
  });

  // ── DELETE /:id ──────────────────────────────────────────────────
  describe('DELETE /api/leads/:id', () => {
    it('returns 200 on successful deletion by admin', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        name: 'To Delete',
        createdById: 'other',
      });
      const res = await request(createApp('owner')).delete(`/api/leads/${VALID_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('allows lead creator to delete their own lead', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        name: 'My Lead',
        createdById: 'user-1',
      });
      const res = await request(createApp('admin', 'user-1')).delete(`/api/leads/${VALID_ID}`);
      expect(res.status).toBe(200);
    });

    it('returns 403 for agent role (blocked by RBAC)', async () => {
      const res = await request(createApp('agent', 'user-1')).delete(`/api/leads/${VALID_ID}`);
      expect(res.status).toBe(403);
    });

    it('returns 404 if not found', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner')).delete(`/api/leads/${VALID_ID}`);
      expect(res.status).toBe(404);
    });

    it('cleans up commissions and activities in transaction', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        name: 'Cleanup',
        createdById: 'user-1',
      });
      await request(createApp('owner')).delete(`/api/leads/${VALID_ID}`);
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });
  });

  // ── POST /:id/activities ─────────────────────────────────────────
  describe('POST /api/leads/:id/activities', () => {
    it('returns 201 on successful activity creation by manager', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        name: 'Active Lead',
        assignedToId: null,
        createdById: 'other',
      });
      mockPrisma.lead.update = vi.fn().mockResolvedValueOnce({});
      const res = await request(createApp('manager'))
        .post(`/api/leads/${VALID_ID}/activities`)
        .send({ type: 'lead', action: 'call', description: 'Called the client' });
      expect(res.status).toBe(201);
    });

    it('returns 404 if lead not found', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner'))
        .post(`/api/leads/${VALID_ID}/activities`)
        .send({ type: 'lead', action: 'call' });
      expect(res.status).toBe(404);
    });

    it('returns 403 if agent is not assigned and not creator', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        name: 'Other Lead',
        assignedToId: 'other-agent',
        createdById: 'other-user',
      });
      const res = await request(createApp('agent', 'user-1'))
        .post(`/api/leads/${VALID_ID}/activities`)
        .send({ type: 'lead', action: 'call' });
      expect(res.status).toBe(403);
    });

    it('allows assigned agent to add activity', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        name: 'My Lead',
        assignedToId: 'user-1',
        createdById: 'other',
      });
      mockPrisma.lead.update = vi.fn().mockResolvedValueOnce({});
      const res = await request(createApp('agent', 'user-1'))
        .post(`/api/leads/${VALID_ID}/activities`)
        .send({ type: 'lead', action: 'email', description: 'Sent details' });
      expect(res.status).toBe(201);
    });

    it('triggers auto-rescore when lead activity is logged', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        name: 'Scoring Lead',
        assignedToId: 'user-1',
        createdById: 'other',
      });
      mockPrisma.lead.update = vi.fn().mockResolvedValueOnce({});
      await request(createApp('agent', 'user-1'))
        .post(`/api/leads/${VALID_ID}/activities`)
        .send({ type: 'lead', action: 'call', description: 'Called lead' });
      expect(triggerLeadRescore).toHaveBeenCalledWith(VALID_ID, 'lead_activity_logged');
    });
  });
});
