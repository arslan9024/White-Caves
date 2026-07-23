/**
 * Commissions API Routes Test Suite
 *
 * Comprehensive role-matrix test coverage for commission endpoints:
 *   GET  /api/commissions         – List commissions (permission: view_commissions)
 *   GET  /api/commissions/summary – Aggregate summary stats (permission: view_commissions)
 *
 * Test Coverage:
 * - Role-matrix (allow/deny paths for 6+ roles)
 * - Pagination edge cases (min, max, clamping)
 * - Filters (status, agentId)
 * - Error handling (invalid inputs)
 * - Response shape validation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

// ─── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma, requirePermissionMock } = vi.hoisted(() => {
  const fn = vi.fn;

  const ROLE_PERMISSIONS: Record<string, string[]> = {
    owner: ['view_commissions', 'approve_commissions'],
    manager: ['view_commissions', 'approve_commissions'],
    admin: ['view_commissions', 'approve_commissions'],
    finance: ['view_commissions', 'approve_commissions'],
    agent: ['view_commissions'],
    buyer: ['view_properties'],
    tenant: ['view_profile'],
    viewer: ['view_properties'],
    user: [],
  };

  const requirePermission =
    (...requiredPermissions: string[]) =>
    (req: any, res: any, next: any) => {
      const userRole = req.user?.role || 'user';
      const resolved = userRole === 'managing_director' ? 'owner' : userRole;
      const perms = ROLE_PERMISSIONS[resolved] || [];
      const hasAny = requiredPermissions.some(p => perms.includes(p));

      if (!hasAny) {
        return res.status(403).json({ error: 'Access denied', success: false });
      }
      next();
    };

  return {
    mockPrisma: {
      commission: {
        findMany: fn().mockResolvedValue([]),
        count: fn().mockResolvedValue(0),
        aggregate: fn().mockResolvedValue({
          _count: { _all: 0 },
          _sum: { amount: 0 },
          _avg: { percentage: 0 },
        }),
        groupBy: fn().mockResolvedValue([]),
      },
      user: {
        findUnique: fn().mockResolvedValue(null),
      },
    },
    requirePermissionMock: requirePermission,
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

vi.mock('../middleware/rbac.js', () => ({
  requirePermission: requirePermissionMock,
}));

import commissionsRouter from './commissions.js';

// ─── Test app factory ──────────────────────────────────────────────────
function createApp(role: string = 'owner', userId = 'user-1') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: userId, email: 'test@whitecaves.ae', role };
    next();
  });
  app.use('/api/commissions', commissionsRouter);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

// ─── Test Constants ───────────────────────────────────────────────────
const VALID_ID = 'commission-abc123';
const VALID_AGENT_ID = 'agent-xyz';

// ─── Test Fixtures ────────────────────────────────────────────────────
const mockCommissionRow = {
  id: VALID_ID,
  agentId: VALID_AGENT_ID,
  propertyId: 'prop-1',
  leadId: 'lead-1',
  amount: 15000,
  percentage: 2.5,
  status: 'pending',
  notes: 'Commission for sale',
  createdAt: new Date('2026-01-15'),
  paidAt: null,
  agent: { id: VALID_AGENT_ID, name: 'John Agent' },
  property: { id: 'prop-1', title: 'Downtown Luxury Apt', type: 'apartment', price: 600000 },
  lead: { id: 'lead-1', name: 'Alice Buyer' },
};

const mockCommissionRow2 = {
  id: 'commission-def456',
  agentId: 'agent-zyx',
  propertyId: 'prop-2',
  leadId: 'lead-2',
  amount: 22500,
  percentage: 2.5,
  status: 'paid',
  notes: 'Paid commission',
  createdAt: new Date('2026-02-01'),
  paidAt: new Date('2026-02-10'),
  agent: { id: 'agent-zyx', name: 'Jane Agent' },
  property: { id: 'prop-2', title: 'Marina Penthouse', type: 'penthouse', price: 900000 },
  lead: { id: 'lead-2', name: 'Bob Investor' },
};

// ─────────────────────────────────────────────────────────────────────────
// TEST SUITE
// ─────────────────────────────────────────────────────────────────────────

describe('Commissions Routes — /api/commissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ────── GET /api/commissions ────────────────────────────────────────────

  describe('GET /api/commissions', () => {
    it('returns 200 with paginated commissions for owner role', async () => {
      mockPrisma.commission.findMany.mockResolvedValueOnce([mockCommissionRow]);
      mockPrisma.commission.count.mockResolvedValueOnce(1);

      const res = await request(createApp('owner')).get('/api/commissions');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.total).toBe(1);
    });

    it('returns 200 with paginated commissions for manager role', async () => {
      mockPrisma.commission.findMany.mockResolvedValueOnce([mockCommissionRow]);
      mockPrisma.commission.count.mockResolvedValueOnce(1);

      const res = await request(createApp('manager')).get('/api/commissions');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.pagination.page).toBe(1);
    });

    it('returns 200 with paginated commissions for admin role', async () => {
      mockPrisma.commission.findMany.mockResolvedValueOnce([mockCommissionRow]);
      mockPrisma.commission.count.mockResolvedValueOnce(1);

      const res = await request(createApp('admin')).get('/api/commissions');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 200 with paginated commissions for finance role', async () => {
      mockPrisma.commission.findMany.mockResolvedValueOnce([mockCommissionRow]);
      mockPrisma.commission.count.mockResolvedValueOnce(1);

      const res = await request(createApp('finance')).get('/api/commissions');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 200 with paginated commissions for agent role', async () => {
      mockPrisma.commission.findMany.mockResolvedValueOnce([mockCommissionRow]);
      mockPrisma.commission.count.mockResolvedValueOnce(1);

      const res = await request(createApp('agent')).get('/api/commissions');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 403 for buyer role (denied by permission)', async () => {
      const res = await request(createApp('buyer')).get('/api/commissions');

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/access denied/i);
    });

    it('returns 403 for tenant role (denied by permission)', async () => {
      const res = await request(createApp('tenant')).get('/api/commissions');

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/access denied/i);
    });

    it('returns 403 for viewer role (denied by permission)', async () => {
      const res = await request(createApp('viewer')).get('/api/commissions');

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/access denied/i);
    });

    it('returns 403 for user role (denied by permission)', async () => {
      const res = await request(createApp('user')).get('/api/commissions');

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/access denied/i);
    });

    it('supports status filter (e.g., ?status=paid)', async () => {
      mockPrisma.commission.findMany.mockResolvedValueOnce([mockCommissionRow2]);
      mockPrisma.commission.count.mockResolvedValueOnce(1);

      const res = await request(createApp('owner')).get('/api/commissions?status=paid');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.pagination.total).toBe(1);
    });

    it('supports agentId filter (e.g., ?agentId=agent-xyz)', async () => {
      mockPrisma.commission.findMany.mockResolvedValueOnce([mockCommissionRow]);
      mockPrisma.commission.count.mockResolvedValueOnce(1);

      const res = await request(createApp('manager')).get(
        `/api/commissions?agentId=${VALID_AGENT_ID}`
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('clamps page to minimum 1', async () => {
      mockPrisma.commission.findMany.mockResolvedValueOnce([]);
      mockPrisma.commission.count.mockResolvedValueOnce(0);

      const res = await request(createApp('owner')).get('/api/commissions?page=0');

      expect(res.status).toBe(200);
      expect(res.body.pagination.page).toBe(1);
    });

    it('clamps pageSize to maximum 100', async () => {
      mockPrisma.commission.findMany.mockResolvedValueOnce([]);
      mockPrisma.commission.count.mockResolvedValueOnce(0);

      const res = await request(createApp('owner')).get('/api/commissions?pageSize=250');

      expect(res.status).toBe(200);
      expect(res.body.pagination.pageSize).toBeLessThanOrEqual(100);
    });

    it('defaults pageSize to 50 when not provided', async () => {
      mockPrisma.commission.findMany.mockResolvedValueOnce([]);
      mockPrisma.commission.count.mockResolvedValueOnce(0);

      const res = await request(createApp('owner')).get('/api/commissions');

      expect(res.status).toBe(200);
      expect(res.body.pagination.pageSize).toBe(50);
    });

    it('returns empty data array when no commissions found', async () => {
      mockPrisma.commission.findMany.mockResolvedValueOnce([]);
      mockPrisma.commission.count.mockResolvedValueOnce(0);

      const res = await request(createApp('finance')).get('/api/commissions');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination.total).toBe(0);
    });

    it('maps Prisma commission fields to API response shape', async () => {
      mockPrisma.commission.findMany.mockResolvedValueOnce([mockCommissionRow]);
      mockPrisma.commission.count.mockResolvedValueOnce(1);

      const res = await request(createApp('owner')).get('/api/commissions');

      expect(res.status).toBe(200);
      const commission = res.body.data[0];
      expect(commission._id).toBe(VALID_ID);
      expect(commission.agentName).toBe('John Agent');
      expect(commission.propertyTitle).toBe('Downtown Luxury Apt');
      expect(commission.propertyType).toBe('apartment');
      expect(commission.transactionValue).toBe(600000);
      expect(commission.clientName).toBe('Alice Buyer');
      expect(commission.commissionAmount).toBe(15000);
      expect(commission.commissionRate).toBe(2.5);
      expect(commission.status).toBe('pending');
    });

    it('handles missing agent reference gracefully', async () => {
      const rowWithoutAgent = { ...mockCommissionRow, agent: null };
      mockPrisma.commission.findMany.mockResolvedValueOnce([rowWithoutAgent]);
      mockPrisma.commission.count.mockResolvedValueOnce(1);

      const res = await request(createApp('owner')).get('/api/commissions');

      expect(res.status).toBe(200);
      expect(res.body.data[0].agentName).toBe('Unknown');
    });

    it('handles missing property reference gracefully', async () => {
      const rowWithoutProperty = { ...mockCommissionRow, property: null };
      mockPrisma.commission.findMany.mockResolvedValueOnce([rowWithoutProperty]);
      mockPrisma.commission.count.mockResolvedValueOnce(1);

      const res = await request(createApp('owner')).get('/api/commissions');

      expect(res.status).toBe(200);
      expect(res.body.data[0].propertyTitle).toBe('—');
      expect(res.body.data[0].transactionValue).toBe(0);
    });

    it('handles missing lead reference gracefully', async () => {
      const rowWithoutLead = { ...mockCommissionRow, lead: null };
      mockPrisma.commission.findMany.mockResolvedValueOnce([rowWithoutLead]);
      mockPrisma.commission.count.mockResolvedValueOnce(1);

      const res = await request(createApp('owner')).get('/api/commissions');

      expect(res.status).toBe(200);
      expect(res.body.data[0].clientName).toBe('—');
    });

    it('handles paidAt null gracefully', async () => {
      const rowPending = { ...mockCommissionRow, paidAt: null };
      mockPrisma.commission.findMany.mockResolvedValueOnce([rowPending]);
      mockPrisma.commission.count.mockResolvedValueOnce(1);

      const res = await request(createApp('owner')).get('/api/commissions');

      expect(res.status).toBe(200);
      expect(res.body.data[0].paidAt).toBeUndefined();
    });

    it('returns 200 for managing_director role (alias → owner permissions)', async () => {
      mockPrisma.commission.findMany.mockResolvedValueOnce([mockCommissionRow]);
      mockPrisma.commission.count.mockResolvedValueOnce(1);

      const res = await request(createApp('managing_director')).get('/api/commissions');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ────── GET /api/commissions/summary ────────────────────────────────────

  describe('GET /api/commissions/summary', () => {
    it('returns 200 with summary stats for owner role', async () => {
      mockPrisma.commission.aggregate.mockResolvedValueOnce({
        _count: { _all: 25 },
        _sum: { amount: 487500 },
        _avg: { percentage: 2.5 },
      });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { status: 'pending', _sum: { amount: 45000 } },
        { status: 'approved', _sum: { amount: 165000 } },
        { status: 'paid', _sum: { amount: 277500 } },
      ]);
      mockPrisma.commission.aggregate.mockResolvedValueOnce({ _avg: { percentage: 2.5 } });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { agentId: VALID_AGENT_ID, _sum: { amount: 157500 } },
      ]);
      mockPrisma.user.findUnique.mockResolvedValueOnce({ name: 'John Agent' });

      const res = await request(createApp('owner')).get('/api/commissions/summary');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.totalCommissions).toBe(25);
      expect(res.body.data.totalAmount).toBe(487500);
    });

    it('returns 200 with summary stats for manager role', async () => {
      mockPrisma.commission.aggregate.mockResolvedValueOnce({
        _count: { _all: 25 },
        _sum: { amount: 487500 },
        _avg: { percentage: 2.5 },
      });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { status: 'pending', _sum: { amount: 45000 } },
        { status: 'approved', _sum: { amount: 165000 } },
        { status: 'paid', _sum: { amount: 277500 } },
      ]);
      mockPrisma.commission.aggregate.mockResolvedValueOnce({ _avg: { percentage: 2.5 } });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { agentId: VALID_AGENT_ID, _sum: { amount: 157500 } },
      ]);
      mockPrisma.user.findUnique.mockResolvedValueOnce({ name: 'John Agent' });

      const res = await request(createApp('manager')).get('/api/commissions/summary');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.pendingAmount).toBe(45000);
    });

    it('returns 200 with summary stats for admin role', async () => {
      mockPrisma.commission.aggregate.mockResolvedValueOnce({
        _count: { _all: 25 },
        _sum: { amount: 487500 },
        _avg: { percentage: 2.5 },
      });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { status: 'pending', _sum: { amount: 45000 } },
        { status: 'approved', _sum: { amount: 165000 } },
        { status: 'paid', _sum: { amount: 277500 } },
      ]);
      mockPrisma.commission.aggregate.mockResolvedValueOnce({ _avg: { percentage: 2.5 } });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { agentId: VALID_AGENT_ID, _sum: { amount: 157500 } },
      ]);
      mockPrisma.user.findUnique.mockResolvedValueOnce({ name: 'John Agent' });

      const res = await request(createApp('admin')).get('/api/commissions/summary');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 200 with summary stats for finance role', async () => {
      mockPrisma.commission.aggregate.mockResolvedValueOnce({
        _count: { _all: 25 },
        _sum: { amount: 487500 },
        _avg: { percentage: 2.5 },
      });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { status: 'pending', _sum: { amount: 45000 } },
        { status: 'approved', _sum: { amount: 165000 } },
        { status: 'paid', _sum: { amount: 277500 } },
      ]);
      mockPrisma.commission.aggregate.mockResolvedValueOnce({ _avg: { percentage: 2.5 } });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { agentId: VALID_AGENT_ID, _sum: { amount: 157500 } },
      ]);
      mockPrisma.user.findUnique.mockResolvedValueOnce({ name: 'John Agent' });

      const res = await request(createApp('finance')).get('/api/commissions/summary');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.approvedAmount).toBe(165000);
      expect(res.body.data.paidAmount).toBe(277500);
    });

    it('returns 200 with summary stats for agent role', async () => {
      mockPrisma.commission.aggregate.mockResolvedValueOnce({
        _count: { _all: 25 },
        _sum: { amount: 487500 },
        _avg: { percentage: 2.5 },
      });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { status: 'pending', _sum: { amount: 45000 } },
        { status: 'approved', _sum: { amount: 165000 } },
        { status: 'paid', _sum: { amount: 277500 } },
      ]);
      mockPrisma.commission.aggregate.mockResolvedValueOnce({ _avg: { percentage: 2.5 } });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { agentId: VALID_AGENT_ID, _sum: { amount: 157500 } },
      ]);
      mockPrisma.user.findUnique.mockResolvedValueOnce({ name: 'John Agent' });

      const res = await request(createApp('agent')).get('/api/commissions/summary');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 403 for buyer role (denied by permission)', async () => {
      const res = await request(createApp('buyer')).get('/api/commissions/summary');

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/access denied/i);
    });

    it('returns 403 for tenant role (denied by permission)', async () => {
      const res = await request(createApp('tenant')).get('/api/commissions/summary');

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/access denied/i);
    });

    it('returns 403 for viewer role (denied by permission)', async () => {
      const res = await request(createApp('viewer')).get('/api/commissions/summary');

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/access denied/i);
    });

    it('returns 403 for user role (denied by permission)', async () => {
      const res = await request(createApp('user')).get('/api/commissions/summary');

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/access denied/i);
    });

    it('includes breakdown by status (pending, approved, paid)', async () => {
      mockPrisma.commission.aggregate.mockResolvedValueOnce({
        _count: { _all: 25 },
        _sum: { amount: 487500 },
        _avg: { percentage: 2.5 },
      });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { status: 'pending', _sum: { amount: 45000 } },
        { status: 'approved', _sum: { amount: 165000 } },
        { status: 'paid', _sum: { amount: 277500 } },
      ]);
      mockPrisma.commission.aggregate.mockResolvedValueOnce({ _avg: { percentage: 2.5 } });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { agentId: VALID_AGENT_ID, _sum: { amount: 157500 } },
      ]);
      mockPrisma.user.findUnique.mockResolvedValueOnce({ name: 'John Agent' });

      const res = await request(createApp('owner')).get('/api/commissions/summary');

      expect(res.status).toBe(200);
      expect(res.body.data.pendingAmount).toBe(45000);
      expect(res.body.data.approvedAmount).toBe(165000);
      expect(res.body.data.paidAmount).toBe(277500);
    });

    it('includes average commission rate', async () => {
      mockPrisma.commission.aggregate.mockResolvedValueOnce({
        _count: { _all: 25 },
        _sum: { amount: 487500 },
        _avg: { percentage: 2.5 },
      });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { status: 'pending', _sum: { amount: 45000 } },
        { status: 'approved', _sum: { amount: 165000 } },
        { status: 'paid', _sum: { amount: 277500 } },
      ]);
      mockPrisma.commission.aggregate.mockResolvedValueOnce({ _avg: { percentage: 2.5 } });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { agentId: VALID_AGENT_ID, _sum: { amount: 157500 } },
      ]);
      mockPrisma.user.findUnique.mockResolvedValueOnce({ name: 'John Agent' });

      const res = await request(createApp('manager')).get('/api/commissions/summary');

      expect(res.status).toBe(200);
      expect(res.body.data.averageCommissionRate).toBe(2.5);
    });

    it('includes top agent information', async () => {
      mockPrisma.commission.aggregate.mockResolvedValueOnce({
        _count: { _all: 25 },
        _sum: { amount: 487500 },
        _avg: { percentage: 2.5 },
      });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { status: 'pending', _sum: { amount: 45000 } },
        { status: 'approved', _sum: { amount: 165000 } },
        { status: 'paid', _sum: { amount: 277500 } },
      ]);
      mockPrisma.commission.aggregate.mockResolvedValueOnce({ _avg: { percentage: 2.5 } });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { agentId: VALID_AGENT_ID, _sum: { amount: 157500 } },
      ]);
      mockPrisma.user.findUnique.mockResolvedValueOnce({ name: 'John Agent' });

      const res = await request(createApp('finance')).get('/api/commissions/summary');

      expect(res.status).toBe(200);
      expect(res.body.data.topAgent).toBeDefined();
      expect(res.body.data.topAgent.name).toBe('John Agent');
      expect(res.body.data.topAgent.totalCommission).toBe(157500);
    });

    it('handles case when no commissions exist', async () => {
      mockPrisma.commission.aggregate.mockResolvedValueOnce({
        _count: { _all: 0 },
        _sum: { amount: null },
        _avg: { percentage: null },
      });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([]);
      mockPrisma.commission.aggregate.mockResolvedValueOnce({ _avg: { percentage: null } });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([]);

      const res = await request(createApp('owner')).get('/api/commissions/summary');

      expect(res.status).toBe(200);
      expect(res.body.data.totalCommissions).toBe(0);
      expect(res.body.data.totalAmount).toBe(0);
    });

    it('returns 200 for managing_director role (alias → owner permissions)', async () => {
      mockPrisma.commission.aggregate.mockResolvedValueOnce({
        _count: { _all: 25 },
        _sum: { amount: 487500 },
        _avg: { percentage: 2.5 },
      });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { status: 'pending', _sum: { amount: 45000 } },
        { status: 'approved', _sum: { amount: 165000 } },
        { status: 'paid', _sum: { amount: 277500 } },
      ]);
      mockPrisma.commission.aggregate.mockResolvedValueOnce({ _avg: { percentage: 2.5 } });
      mockPrisma.commission.groupBy.mockResolvedValueOnce([
        { agentId: VALID_AGENT_ID, _sum: { amount: 157500 } },
      ]);
      mockPrisma.user.findUnique.mockResolvedValueOnce({ name: 'John Agent' });

      const res = await request(createApp('managing_director')).get('/api/commissions/summary');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
