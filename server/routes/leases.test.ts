/**
 * Leases Routes — Unit Tests
 * Tests /api/leases endpoints: list, expiring, get, create, update, delete
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
      lease: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        count: fn().mockResolvedValue(0),
        create: fn().mockResolvedValue({
          id: 'lease-1',
          propertyId: 'prop-1',
          tenantId: 'tenant-1',
          landlordId: 'user-1',
          startDate: new Date('2026-03-01'),
          endDate: new Date('2027-03-01'),
          monthlyRent: 8000,
          depositAmount: 0,
          status: 'draft',
          createdAt: new Date(),
          property: { id: 'prop-1', title: 'Marina Studio', location: 'Dubai Marina' },
          tenant: { id: 'tenant-1', name: 'John', email: 'john@test.ae' },
        }),
        update: fn().mockResolvedValue({ id: 'lease-1', status: 'active' }),
        delete: fn().mockResolvedValue({}),
      },
      property: {
        findUnique: fn().mockResolvedValue({
          id: 'prop-1',
          title: 'Marina Studio',
          ownerId: 'user-1',
        }),
      },
      user: {
        findUnique: fn().mockResolvedValue({ id: 'tenant-1', name: 'John', email: 'john@test.ae' }),
      },
      pDCSchedule: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
      },
      activity: {
        create: fn().mockResolvedValue({ id: 'act-1', createdAt: new Date() }),
      },
    },
  };
});

vi.mock('../database.js', () => ({ prisma: mockPrisma, connectDatabase: vi.fn() }));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  createLogger: vi.fn(() => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() })),
}));

import leasesRoutes from './leases';
import { errorHandler } from '../middleware/errorHandler';

function createApp(role = 'landlord') {
  const app = express();
  app.use(express.json());
  app.use((req: any, _res, next) => {
    req.user = { id: 'user-1', email: 'landlord@wc.ae', role };
    next();
  });
  app.use('/api/leases', leasesRoutes);
  app.use(errorHandler);
  return app;
}

describe('Leases Routes — /api/leases', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp();
  });

  // ── LIST ──────────────────────────────────────────────────────────
  describe('GET /api/leases', () => {
    it('returns 200 with empty list', async () => {
      const res = await request(app).get('/api/leases');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('accepts status and role query filters', async () => {
      await request(app).get('/api/leases?status=active&role=tenant');
      const args = mockPrisma.lease.findMany.mock.calls[0][0];
      expect(args.where.status).toBe('active');
    });

    it('respects pagination params', async () => {
      await request(app).get('/api/leases?page=2&pageSize=5');
      const args = mockPrisma.lease.findMany.mock.calls[0][0];
      expect(args.skip).toBe(5);
      expect(args.take).toBe(5);
    });
  });

  // ── EXPIRING ──────────────────────────────────────────────────────
  describe('GET /api/leases/expiring', () => {
    it('returns 200 with expiring leases', async () => {
      const res = await request(app).get('/api/leases/expiring');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('accepts days param', async () => {
      await request(app).get('/api/leases/expiring?days=30');
      expect(mockPrisma.lease.findMany).toHaveBeenCalled();
    });
  });

  // ── GET ONE ───────────────────────────────────────────────────────
  describe('GET /api/leases/:id', () => {
    it('returns 404 for non-existent lease', async () => {
      const res = await request(app).get('/api/leases/bad-id');
      expect(res.status).toBe(404);
    });

    it('returns 200 when lease exists and user is authorized', async () => {
      mockPrisma.lease.findUnique.mockResolvedValueOnce({
        id: 'lease-1',
        tenantId: 'user-1',
        landlordId: 'user-1',
        property: { id: 'prop-1', ownerId: 'user-1' },
      });
      const res = await request(app).get('/api/leases/lease-1');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ── CREATE ────────────────────────────────────────────────────────
  describe('POST /api/leases', () => {
    const validPayload = {
      propertyId: 'prop-1',
      tenantId: 'tenant-1',
      startDate: '2026-03-01',
      endDate: '2027-03-01',
      monthlyRent: 8000,
    };

    it('creates a lease with valid data', async () => {
      const res = await request(app).post('/api/leases').send(validPayload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(mockPrisma.lease.create).toHaveBeenCalled();
    });

    it('rejects missing propertyId', async () => {
      const { propertyId, ...rest } = validPayload;
      const res = await request(app).post('/api/leases').send(rest);
      expect(res.status).toBe(400);
    });

    it('rejects missing tenantId', async () => {
      const { tenantId, ...rest } = validPayload;
      const res = await request(app).post('/api/leases').send(rest);
      expect(res.status).toBe(400);
    });

    it('rejects missing startDate', async () => {
      const { startDate, ...rest } = validPayload;
      const res = await request(app).post('/api/leases').send(rest);
      expect(res.status).toBe(400);
    });

    it('rejects endDate before startDate', async () => {
      const res = await request(app)
        .post('/api/leases')
        .send({
          ...validPayload,
          startDate: '2027-01-01',
          endDate: '2026-01-01',
        });
      expect(res.status).toBe(400);
    });

    it('rejects non-positive monthlyRent', async () => {
      const res = await request(app)
        .post('/api/leases')
        .send({ ...validPayload, monthlyRent: 0 });
      expect(res.status).toBe(400);
    });

    it('returns 404 if property not found', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(null);
      const res = await request(app).post('/api/leases').send(validPayload);
      expect(res.status).toBe(404);
    });

    it('returns 404 if tenant not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      const res = await request(app).post('/api/leases').send(validPayload);
      expect(res.status).toBe(404);
    });
  });

  // ── UPDATE ────────────────────────────────────────────────────────
  describe('PATCH /api/leases/:id', () => {
    it('updates status on authorized lease', async () => {
      mockPrisma.lease.findUnique.mockResolvedValueOnce({
        id: 'lease-1',
        landlordId: 'user-1',
        property: { ownerId: 'user-1' },
      });
      const res = await request(app).patch('/api/leases/lease-1').send({ status: 'active' });
      expect(res.status).toBe(200);
    });

    it('returns 404 for non-existent lease', async () => {
      const res = await request(app).patch('/api/leases/bad-id').send({ status: 'active' });
      expect(res.status).toBe(404);
    });

    it('rejects invalid status value', async () => {
      mockPrisma.lease.findUnique.mockResolvedValueOnce({
        id: 'lease-1',
        landlordId: 'user-1',
        property: { ownerId: 'user-1' },
      });
      const res = await request(app).patch('/api/leases/lease-1').send({ status: 'invalid' });
      expect(res.status).toBe(400);
    });

    it('rejects unauthorized user', async () => {
      mockPrisma.lease.findUnique.mockResolvedValueOnce({
        id: 'lease-1',
        landlordId: 'other-user',
        property: { ownerId: 'other-user' },
      });
      const res = await request(app).patch('/api/leases/lease-1').send({ status: 'active' });
      expect(res.status).toBe(403);
    });
  });

  // ── DELETE ────────────────────────────────────────────────────────
  describe('DELETE /api/leases/:id', () => {
    it('deletes draft lease owned by landlord', async () => {
      mockPrisma.lease.findUnique.mockResolvedValueOnce({
        id: 'lease-1',
        landlordId: 'user-1',
        status: 'draft',
        property: { ownerId: 'user-1' },
      });
      const res = await request(app).delete('/api/leases/lease-1');
      expect(res.status).toBe(200);
      expect(mockPrisma.lease.delete).toHaveBeenCalled();
    });

    it('rejects deleting non-draft lease', async () => {
      mockPrisma.lease.findUnique.mockResolvedValueOnce({
        id: 'lease-1',
        landlordId: 'user-1',
        status: 'active',
        property: { ownerId: 'user-1' },
      });
      const res = await request(app).delete('/api/leases/lease-1');
      expect(res.status).toBe(400);
    });

    it('returns 404 for non-existent lease', async () => {
      const res = await request(app).delete('/api/leases/bad-id');
      expect(res.status).toBe(404);
    });

    it('rejects unauthorized user', async () => {
      mockPrisma.lease.findUnique.mockResolvedValueOnce({
        id: 'lease-1',
        landlordId: 'other-user',
        status: 'draft',
        property: { ownerId: 'other-user' },
      });
      const res = await request(app).delete('/api/leases/lease-1');
      expect(res.status).toBe(403);
    });
  });

  // ── OVERDUE COLLECTION QUEUE ─────────────────────────────────────
  describe('GET /api/leases/collections/overdue-queue', () => {
    it('returns overdue and bounced queue items', async () => {
      mockPrisma.pDCSchedule.findMany.mockResolvedValueOnce([
        {
          id: 'pdc-1',
          leaseId: 'lease-1',
          chequeNumber: 'CHK-001',
          bankName: 'ADCB',
          amount: 8000,
          dueDate: new Date(Date.now() - 2 * 86400000),
          status: 'pending',
          notes: null,
          createdAt: new Date(),
          lease: {
            id: 'lease-1',
            leaseNumber: 'L-001',
            monthlyRent: 8000,
            currency: 'AED',
            property: { id: 'prop-1', title: 'Marina Studio', location: 'Dubai Marina' },
            tenant: {
              id: 'tenant-1',
              name: 'John',
              email: 'john@test.ae',
              phone: '+971500000001',
            },
            landlord: {
              id: 'user-1',
              name: 'Owner',
              email: 'owner@test.ae',
              phone: '+971500000002',
            },
          },
        },
      ]);

      const res = await request(app).get('/api/leases/collections/overdue-queue');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.summary.total).toBe(1);
    });
  });

  describe('POST /api/leases/overdue-collection-queue/:pdcId/notify', () => {
    it('logs collection reminder notification for valid PDC', async () => {
      mockPrisma.pDCSchedule.findUnique.mockResolvedValueOnce({
        id: 'pdc-1',
        leaseId: 'lease-1',
        chequeNumber: 'CHK-001',
        status: 'pending',
        lease: {
          id: 'lease-1',
          leaseNumber: 'L-001',
          tenantId: 'tenant-1',
          landlordId: 'user-1',
        },
      });

      const res = await request(app)
        .post('/api/leases/overdue-collection-queue/pdc-1/notify')
        .send({ channel: 'whatsapp', note: 'Payment overdue reminder' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.pdcId).toBe('pdc-1');
      expect(mockPrisma.activity.create).toHaveBeenCalled();
    });

    it('returns 404 when PDC does not exist', async () => {
      mockPrisma.pDCSchedule.findUnique.mockResolvedValueOnce(null);

      const res = await request(app)
        .post('/api/leases/overdue-collection-queue/missing/notify')
        .send({ channel: 'email' });

      expect(res.status).toBe(404);
    });
  });
});
