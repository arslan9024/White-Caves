/**
 * Agents Routes — Unit Tests
 * Tests /api/agents endpoints: list, stats, detail, performance, commissions
 * Covers: RBAC, IDOR protection, performance scoring, pagination, batch queries
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
        groupBy: fn().mockResolvedValue([]),
      },
      lead: {
        groupBy: fn().mockResolvedValue([]),
        count: fn().mockResolvedValue(0),
      },
      commission: {
        groupBy: fn().mockResolvedValue([]),
        findMany: fn().mockResolvedValue([]),
        count: fn().mockResolvedValue(0),
        aggregate: fn().mockResolvedValue({
          _sum: { amount: 0 }, _count: { _all: 0 },
        }),
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
vi.mock('../utils/validate', () => ({
  validateIdParam: (id: string, label: string) => {
    if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
      const err = new Error(`${label} must be a valid 24-character hex string`);
      (err as any).statusCode = 400;
      throw err;
    }
  },
}));

import agentRoutes from './agents';

// ── Test app factory ─────────────────────────────────────────────────
function createApp(role: string = 'owner', userId = 'user-1') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: userId, email: 'test@whitecaves.ae', role };
    next();
  });
  app.use('/api/agents', agentRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const VALID_ID = 'aabbccddee11223344556677';

// ═════════════════════════════════════════════════════════════════════

describe('Agents Routes — /api/agents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── GET / ────────────────────────────────────────────────────────
  describe('GET /api/agents', () => {
    it('returns 200 with enriched agent list for owner', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([
        { id: 'agent-1', name: 'John Agent', email: 'john@wc.ae', role: 'agent', department: 'sales', status: 'active', _count: { leadsAssigned: 10, commissions: 3, properties: 5 } },
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      mockPrisma.lead.groupBy
        .mockResolvedValueOnce([{ assignedToId: 'agent-1', _count: 4 }])   // won
        .mockResolvedValueOnce([{ assignedToId: 'agent-1', _count: 10 }]); // total
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { agentId: 'agent-1', _sum: { amount: 50000 } },
      ]);
      const res = await request(createApp('owner'))
        .get('/api/agents');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).toHaveProperty('performance');
      expect(res.body.data[0]).toHaveProperty('conversion_rate');
      expect(res.body.data[0]).toHaveProperty('deals_closed');
      expect(res.body.data[0]).toHaveProperty('revenue_generated');
      expect(res.body.pagination).toBeDefined();
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .get('/api/agents');
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/access denied/i);
    });

    it('returns 403 for finance role (no manage_agents permission)', async () => {
      const res = await request(createApp('finance'))
        .get('/api/agents');
      expect(res.status).toBe(403);
    });

    it('supports search filter', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([]);
      mockPrisma.user.count.mockResolvedValueOnce(0);
      mockPrisma.lead.groupBy.mockResolvedValue([]);
      mockPrisma.commission.groupBy.mockResolvedValueOnce([]);
      const res = await request(createApp('owner'))
        .get('/api/agents?search=John');
      expect(res.status).toBe(200);
    });

    it('supports status and department filters', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([]);
      mockPrisma.user.count.mockResolvedValueOnce(0);
      mockPrisma.lead.groupBy.mockResolvedValue([]);
      mockPrisma.commission.groupBy.mockResolvedValueOnce([]);
      const res = await request(createApp('owner'))
        .get('/api/agents?status=active&department=sales');
      expect(res.status).toBe(200);
    });

    it('calculates performance score correctly', async () => {
      // Agent with 5 won out of 10 total leads = 50% conversion, $100k revenue
      mockPrisma.user.findMany.mockResolvedValueOnce([
        { id: 'a1', name: 'Star', email: 's@wc.ae', role: 'agent', _count: {} },
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      mockPrisma.lead.groupBy
        .mockResolvedValueOnce([{ assignedToId: 'a1', _count: 5 }])    // won
        .mockResolvedValueOnce([{ assignedToId: 'a1', _count: 10 }]);  // total
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { agentId: 'a1', _sum: { amount: 100000 } },
      ]);
      const res = await request(createApp('owner'))
        .get('/api/agents');
      expect(res.status).toBe(200);
      const agent = res.body.data[0];
      // Performance = (50 * 0.4) + (5 * 3) + 20 + 30 = 20 + 15 + 20 + 30 = 85
      expect(agent.performance).toBe(85);
      expect(agent.conversion_rate).toBe(50);
      expect(agent.deals_closed).toBe(5);
      expect(agent.revenue_generated).toBe(100000);
    });

    it('caps performance score at 100', async () => {
      // Agent with extreme stats
      mockPrisma.user.findMany.mockResolvedValueOnce([
        { id: 'a1', name: 'Superstar', email: 's@wc.ae', role: 'agent', _count: {} },
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      mockPrisma.lead.groupBy
        .mockResolvedValueOnce([{ assignedToId: 'a1', _count: 20 }])   // won
        .mockResolvedValueOnce([{ assignedToId: 'a1', _count: 20 }]);  // total = 100% conv
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { agentId: 'a1', _sum: { amount: 500000 } },
      ]);
      const res = await request(createApp('owner'))
        .get('/api/agents');
      // Performance = (100 * 0.4) + (20 * 3) + 20 + 30 = 40 + 60 + 20 + 30 = 150 → capped at 100
      expect(res.body.data[0].performance).toBe(100);
    });

    it('handles zero leads gracefully', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([
        { id: 'a1', name: 'Newbie', email: 'n@wc.ae', role: 'agent', _count: {} },
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      mockPrisma.lead.groupBy.mockResolvedValue([]);
      mockPrisma.commission.groupBy.mockResolvedValueOnce([]);
      const res = await request(createApp('owner'))
        .get('/api/agents');
      const agent = res.body.data[0];
      expect(agent.conversion_rate).toBe(0);
      expect(agent.deals_closed).toBe(0);
      // Performance = (0 * 0.4) + (0 * 3) + 0 + 30 = 30
      expect(agent.performance).toBe(30);
    });

    it('supports pagination', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([]);
      mockPrisma.user.count.mockResolvedValueOnce(100);
      mockPrisma.lead.groupBy.mockResolvedValue([]);
      mockPrisma.commission.groupBy.mockResolvedValueOnce([]);
      const res = await request(createApp('owner'))
        .get('/api/agents?page=3&pageSize=10');
      expect(res.status).toBe(200);
      expect(res.body.pagination.page).toBe(3);
      expect(res.body.pagination.pageSize).toBe(10);
    });
  });

  // ── GET /stats ───────────────────────────────────────────────────
  describe('GET /api/agents/stats', () => {
    it('returns agent statistics for owner', async () => {
      mockPrisma.user.count
        .mockResolvedValueOnce(10)   // total
        .mockResolvedValueOnce(8);   // active
      mockPrisma.user.groupBy.mockResolvedValueOnce([
        { department: 'sales', _count: { _all: 5 } },
        { department: 'leasing', _count: { _all: 3 } },
        { department: null, _count: { _all: 2 } },
      ]);
      const res = await request(createApp('owner'))
        .get('/api/agents/stats');
      expect(res.status).toBe(200);
      expect(res.body.data.total).toBe(10);
      expect(res.body.data.active).toBe(8);
      expect(res.body.data.byDepartment).toHaveProperty('sales', 5);
      expect(res.body.data.byDepartment).toHaveProperty('Unassigned', 2);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .get('/api/agents/stats');
      expect(res.status).toBe(403);
    });

    it('returns 403 for finance role', async () => {
      const res = await request(createApp('finance'))
        .get('/api/agents/stats');
      expect(res.status).toBe(403);
    });
  });

  // ── GET /:id ─────────────────────────────────────────────────────
  describe('GET /api/agents/:id', () => {
    it('returns agent details for manager', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: VALID_ID, name: 'John Agent', email: 'john@wc.ae', role: 'agent',
        department: 'sales', status: 'active', leadsAssigned: [], commissions: [], properties: [],
      });
      const res = await request(createApp('manager'))
        .get(`/api/agents/${VALID_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('John Agent');
    });

    it('allows agent to view their own profile', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: VALID_ID, name: 'Self', email: 'self@wc.ae', role: 'agent',
        leadsAssigned: [], commissions: [], properties: [],
      });
      const res = await request(createApp('agent', VALID_ID))
        .get(`/api/agents/${VALID_ID}`);
      expect(res.status).toBe(200);
    });

    it('returns 403 when agent tries to view another agent profile (IDOR)', async () => {
      const res = await request(createApp('agent', 'different-user-id'))
        .get(`/api/agents/${VALID_ID}`);
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/only view your own/i);
    });

    it('returns 404 if agent not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner'))
        .get(`/api/agents/${VALID_ID}`);
      expect(res.status).toBe(404);
    });
  });

  // ── GET /:id/performance ─────────────────────────────────────────
  describe('GET /api/agents/:id/performance', () => {
    it('returns performance data for manager', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: VALID_ID, name: 'John', email: 'j@wc.ae', department: 'sales',
      });
      mockPrisma.lead.count
        .mockResolvedValueOnce(20)   // total
        .mockResolvedValueOnce(8)    // won
        .mockResolvedValueOnce(3);   // lost
      mockPrisma.commission.aggregate
        .mockResolvedValueOnce({ _sum: { amount: 100000 }, _count: { _all: 10 } })
        .mockResolvedValueOnce({ _sum: { amount: 70000 } });
      const res = await request(createApp('manager'))
        .get(`/api/agents/${VALID_ID}/performance`);
      expect(res.status).toBe(200);
      expect(res.body.data.leads.total).toBe(20);
      expect(res.body.data.leads.won).toBe(8);
      expect(res.body.data.leads.conversionRate).toBe(40);
      expect(res.body.data.commissions.totalValue).toBe(100000);
      expect(res.body.data.commissions.paidValue).toBe(70000);
      expect(res.body.data.performanceScore).toBeDefined();
    });

    it('allows agent to view own performance', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: VALID_ID, name: 'Self', email: 's@wc.ae', department: 'sales',
      });
      mockPrisma.lead.count.mockResolvedValue(0);
      mockPrisma.commission.aggregate.mockResolvedValue({
        _sum: { amount: 0 }, _count: { _all: 0 },
      });
      const res = await request(createApp('agent', VALID_ID))
        .get(`/api/agents/${VALID_ID}/performance`);
      expect(res.status).toBe(200);
    });

    it('returns 403 when agent tries to view another agent performance (IDOR)', async () => {
      const res = await request(createApp('agent', 'other-id'))
        .get(`/api/agents/${VALID_ID}/performance`);
      expect(res.status).toBe(403);
    });

    it('returns 404 if agent not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner'))
        .get(`/api/agents/${VALID_ID}/performance`);
      expect(res.status).toBe(404);
    });
  });

  // ── GET /:id/commissions ─────────────────────────────────────────
  describe('GET /api/agents/:id/commissions', () => {
    it('returns commission list for manager', async () => {
      mockPrisma.commission.findMany.mockResolvedValueOnce([
        { id: 'c1', amount: 5000, status: 'paid', lead: null, property: null },
      ]);
      mockPrisma.commission.count.mockResolvedValueOnce(1);
      const res = await request(createApp('manager'))
        .get(`/api/agents/${VALID_ID}/commissions`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toBeDefined();
    });

    it('allows agent to view own commissions', async () => {
      mockPrisma.commission.findMany.mockResolvedValueOnce([]);
      mockPrisma.commission.count.mockResolvedValueOnce(0);
      const res = await request(createApp('agent', VALID_ID))
        .get(`/api/agents/${VALID_ID}/commissions`);
      expect(res.status).toBe(200);
    });

    it('returns 403 when agent tries to view another agent commissions (IDOR)', async () => {
      const res = await request(createApp('agent', 'other-id'))
        .get(`/api/agents/${VALID_ID}/commissions`);
      expect(res.status).toBe(403);
    });

    it('supports status filter', async () => {
      mockPrisma.commission.findMany.mockResolvedValueOnce([]);
      mockPrisma.commission.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner'))
        .get(`/api/agents/${VALID_ID}/commissions?status=paid`);
      expect(res.status).toBe(200);
    });

    it('supports pagination', async () => {
      mockPrisma.commission.findMany.mockResolvedValueOnce([]);
      mockPrisma.commission.count.mockResolvedValueOnce(50);
      const res = await request(createApp('owner'))
        .get(`/api/agents/${VALID_ID}/commissions?page=2&pageSize=10`);
      expect(res.status).toBe(200);
      expect(res.body.pagination.page).toBe(2);
    });
  });
});
