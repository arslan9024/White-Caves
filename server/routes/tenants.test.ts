/**
 * Tenants Routes — Unit Tests
 * Tests /api/tenants endpoints: list, stats, CRUD, leases
 * All Prisma calls are mocked — no database needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  const mockTx = {
    tenant: { delete: fn().mockResolvedValue({}) },
    activity: { create: fn().mockResolvedValue({ id: 'act-1' }) },
  };
  return {
    mockPrisma: {
      tenant: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        count: fn().mockResolvedValue(0),
        create: fn().mockResolvedValue({
          id: 'tenant-1', name: 'John Doe', email: 'john@test.com',
          phone: '+971501234567', status: 'active', monthlyRent: 5000,
        }),
        update: fn().mockResolvedValue({
          id: 'tenant-1', name: 'John Updated', status: 'active',
        }),
        groupBy: fn().mockResolvedValue([]),
        aggregate: fn().mockResolvedValue({ _sum: { monthlyRent: 100000 }, _avg: { monthlyRent: 5000 } }),
      },
      property: {
        findUnique: fn().mockResolvedValue(null),
      },
      activity: {
        create: fn().mockResolvedValue({ id: 'act-1' }),
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
  validateIdParam: (id: string, label: string) => {
    if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
      const err = new Error(`${label} must be a valid 24-character hex string`);
      (err as any).statusCode = 400;
      throw err;
    }
  },
}));

import tenantRoutes from './tenants';

// ── Test app factory ─────────────────────────────────────────────────
function createApp(role: string = 'owner') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: 'user-1', email: 'admin@whitecaves.ae', role };
    next();
  });
  app.use('/api/tenants', tenantRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const VALID_ID = 'aabbccddee11223344556677';

// ═════════════════════════════════════════════════════════════════════

describe('Tenants Routes — /api/tenants', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── GET / ────────────────────────────────────────────────────────
  describe('GET /api/tenants', () => {
    it('returns 200 with paginated tenants for owner', async () => {
      mockPrisma.tenant.findMany.mockResolvedValueOnce([
        { id: 'tenant-1', name: 'John', status: 'active' },
      ]);
      mockPrisma.tenant.count.mockResolvedValueOnce(1);
      const res = await request(createApp('owner'))
        .get('/api/tenants');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toBeDefined();
    });

    it('returns 403 for unauthorized role (agent)', async () => {
      const res = await request(createApp('agent'))
        .get('/api/tenants');
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/access denied/i);
    });

    it('supports search query', async () => {
      mockPrisma.tenant.findMany.mockResolvedValueOnce([]);
      mockPrisma.tenant.count.mockResolvedValueOnce(0);
      const res = await request(createApp('manager'))
        .get('/api/tenants?search=John');
      expect(res.status).toBe(200);
      expect(mockPrisma.tenant.findMany).toHaveBeenCalled();
    });

    it('supports status filter', async () => {
      mockPrisma.tenant.findMany.mockResolvedValueOnce([]);
      mockPrisma.tenant.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner'))
        .get('/api/tenants?status=active');
      expect(res.status).toBe(200);
    });

    it('supports pagination params', async () => {
      mockPrisma.tenant.findMany.mockResolvedValueOnce([]);
      mockPrisma.tenant.count.mockResolvedValueOnce(50);
      const res = await request(createApp('owner'))
        .get('/api/tenants?page=2&pageSize=10');
      expect(res.status).toBe(200);
      expect(res.body.pagination.page).toBe(2);
    });
  });

  // ── GET /stats ───────────────────────────────────────────────────
  describe('GET /api/tenants/stats', () => {
    it('returns tenant statistics for manager', async () => {
      mockPrisma.tenant.count.mockResolvedValueOnce(15);
      mockPrisma.tenant.groupBy.mockResolvedValueOnce([
        { status: 'active', _count: { _all: 10 } },
        { status: 'inactive', _count: { _all: 5 } },
      ]);
      mockPrisma.tenant.aggregate.mockResolvedValueOnce({
        _sum: { monthlyRent: 75000 }, _avg: { monthlyRent: 5000 },
      });
      const res = await request(createApp('manager'))
        .get('/api/tenants/stats');
      expect(res.status).toBe(200);
      expect(res.body.data.total).toBe(15);
      expect(res.body.data.totalMonthlyRent).toBe(75000);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .get('/api/tenants/stats');
      expect(res.status).toBe(403);
    });
  });

  // ── GET /:id ─────────────────────────────────────────────────────
  describe('GET /api/tenants/:id', () => {
    it('returns tenant details', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValueOnce({
        id: VALID_ID, name: 'John Doe', status: 'active',
      });
      const res = await request(createApp('owner'))
        .get(`/api/tenants/${VALID_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('John Doe');
    });

    it('returns 404 if tenant not found', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner'))
        .get(`/api/tenants/${VALID_ID}`);
      expect(res.status).toBe(404);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .get(`/api/tenants/${VALID_ID}`);
      expect(res.status).toBe(403);
    });
  });

  // ── POST / ───────────────────────────────────────────────────────
  describe('POST /api/tenants', () => {
    it('returns 201 on successful creation', async () => {
      mockPrisma.tenant.create.mockResolvedValueOnce({
        id: 'tenant-new', name: 'New Tenant', status: 'active',
      });
      const res = await request(createApp('owner'))
        .post('/api/tenants')
        .send({ name: 'New Tenant', email: 'new@test.com' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('returns 400 if name is missing', async () => {
      const res = await request(createApp('owner'))
        .post('/api/tenants')
        .send({ email: 'no-name@test.com' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/name.*required/i);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .post('/api/tenants')
        .send({ name: 'Test Tenant' });
      expect(res.status).toBe(403);
    });

    it('returns 400 if name exceeds 150 characters', async () => {
      const res = await request(createApp('owner'))
        .post('/api/tenants')
        .send({ name: 'A'.repeat(151) });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/150 characters/i);
    });

    it('logs activity on creation', async () => {
      mockPrisma.tenant.create.mockResolvedValueOnce({
        id: 'tenant-new', name: 'New Tenant', status: 'active',
      });
      await request(createApp('owner'))
        .post('/api/tenants')
        .send({ name: 'New Tenant' });
      expect(mockPrisma.activity.create).toHaveBeenCalled();
    });
  });

  // ── PATCH /:id ───────────────────────────────────────────────────
  describe('PATCH /api/tenants/:id', () => {
    it('returns 200 on successful update', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValueOnce({
        id: VALID_ID, name: 'Old Name', status: 'active',
      });
      mockPrisma.tenant.update.mockResolvedValueOnce({
        id: VALID_ID, name: 'New Name', status: 'active',
      });
      const res = await request(createApp('owner'))
        .patch(`/api/tenants/${VALID_ID}`)
        .send({ name: 'New Name' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 404 if not found', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner'))
        .patch(`/api/tenants/${VALID_ID}`)
        .send({ name: 'Update' });
      expect(res.status).toBe(404);
    });

    it('returns 403 for agent role', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValueOnce({
        id: VALID_ID, name: 'Test', status: 'active',
      });
      const res = await request(createApp('agent'))
        .patch(`/api/tenants/${VALID_ID}`)
        .send({ name: 'Update' });
      expect(res.status).toBe(403);
    });

    it('returns 400 for invalid status value', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValueOnce({
        id: VALID_ID, name: 'Test', status: 'active',
      });
      const res = await request(createApp('owner'))
        .patch(`/api/tenants/${VALID_ID}`)
        .send({ status: 'invalid_status' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid tenant status/i);
    });
  });

  // ── DELETE /:id ──────────────────────────────────────────────────
  describe('DELETE /api/tenants/:id', () => {
    it('returns 200 on successful deletion', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValueOnce({
        id: VALID_ID, name: 'Deleted Tenant',
      });
      const res = await request(createApp('owner'))
        .delete(`/api/tenants/${VALID_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 404 if not found', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner'))
        .delete(`/api/tenants/${VALID_ID}`);
      expect(res.status).toBe(404);
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent'))
        .delete(`/api/tenants/${VALID_ID}`);
      expect(res.status).toBe(403);
    });

    it('uses a transaction for deletion', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValueOnce({
        id: VALID_ID, name: 'Trans Tenant',
      });
      await request(createApp('owner'))
        .delete(`/api/tenants/${VALID_ID}`);
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });
  });

  // ── GET /:id/leases ──────────────────────────────────────────────
  describe('GET /api/tenants/:id/leases', () => {
    it('returns empty array when tenant has no property', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValueOnce({
        id: VALID_ID, name: 'No Property', propertyId: null,
      });
      const res = await request(createApp('owner'))
        .get(`/api/tenants/${VALID_ID}/leases`);
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it('returns lease data when tenant has a property', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValueOnce({
        id: VALID_ID, name: 'Leased', propertyId: 'prop-1',
        monthlyRent: 5000, deposit: 10000, moveInDate: new Date(), moveOutDate: null,
        status: 'active',
      });
      mockPrisma.property.findUnique.mockResolvedValueOnce({
        id: 'prop-1', title: 'Marina Apt', location: 'Dubai Marina',
        price: 60000, type: 'apartment',
      });
      const res = await request(createApp('owner'))
        .get(`/api/tenants/${VALID_ID}/leases`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].property.title).toBe('Marina Apt');
    });

    it('returns 404 if tenant not found', async () => {
      mockPrisma.tenant.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner'))
        .get(`/api/tenants/${VALID_ID}/leases`);
      expect(res.status).toBe(404);
    });
  });
});
