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

import leasesRoutes from './leases.js';
import { errorHandler } from '../middleware/errorHandler.js';

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

  // ── EJARI TRACKING ──────────────────────────────────────────────
  describe('GET /api/leases/ejari/tracking', () => {
    it('returns ejari tracking summary and rows', async () => {
      mockPrisma.lease.findMany.mockResolvedValueOnce([
        {
          id: 'lease-1',
          leaseNumber: 'L-001',
          ejariNumber: 'EJ-001',
          ejariStatus: 'registered',
          ejariRegistrationDate: new Date('2026-01-10T00:00:00.000Z'),
          ejariExpiryDate: new Date(Date.now() + 10 * 86400000),
          property: {
            id: 'prop-1',
            title: 'Marina Studio',
            location: 'Dubai Marina',
            type: 'Apartment',
          },
          tenant: {
            id: 'tenant-1',
            name: 'John',
            email: 'john@test.ae',
            phone: '+971500000001',
          },
        },
        {
          id: 'lease-2',
          leaseNumber: 'L-002',
          ejariNumber: null,
          ejariStatus: 'pending',
          ejariRegistrationDate: null,
          ejariExpiryDate: null,
          property: {
            id: 'prop-2',
            title: 'Downtown Studio',
            location: 'Downtown Dubai',
            type: 'Studio',
          },
          tenant: {
            id: 'tenant-2',
            name: 'Sarah',
            email: 'sarah@test.ae',
            phone: '+971500000002',
          },
        },
      ]);

      const res = await request(app).get('/api/leases/ejari/tracking?role=landlord&days=30');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.summary.total).toBe(2);
      expect(res.body.summary.registered).toBe(1);
      expect(res.body.summary.pending).toBe(1);
      expect(res.body.summary.expiringSoon).toBe(1);
    });

    it('returns 400 for invalid ejari status filter', async () => {
      const res = await request(app).get('/api/leases/ejari/tracking?status=invalid_status');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
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
        ejariNumber: 'EJ-2026-00001', // required when activating — Wave 33 enforcement
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

  describe('POST /api/leases/collections/overdue-queue/:pdcId/notify', () => {
    it('logs reminder using canonical collections endpoint', async () => {
      mockPrisma.pDCSchedule.findUnique.mockResolvedValueOnce({
        id: 'pdc-2',
        leaseId: 'lease-2',
        chequeNumber: 'CHK-002',
        status: 'bounced',
        lease: {
          id: 'lease-2',
          leaseNumber: 'L-002',
          tenantId: 'tenant-2',
          landlordId: 'user-1',
        },
      });

      const res = await request(app)
        .post('/api/leases/collections/overdue-queue/pdc-2/notify')
        .send({ channel: 'email', note: 'Please settle bounced cheque' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.pdcId).toBe('pdc-2');
      expect(mockPrisma.activity.create).toHaveBeenCalled();
    });
  });

  // ── WAVE 33: EJARI ENFORCEMENT (REQ-TENANT-003, SRS §4.7) ──────────────
  describe('PATCH /api/leases/:id — Ejari Enforcement (W33-005)', () => {
    it('returns 422 when activating a lease without ejariNumber (no number in DB or body)', async () => {
      // Lease exists, landlordId matches user, but NO ejariNumber anywhere
      mockPrisma.lease.findUnique.mockResolvedValueOnce({
        id: 'lease-no-ejari',
        status: 'draft',
        tenantId: 'tenant-1',
        landlordId: 'user-1',
        ejariNumber: null, // not registered
      });

      const res = await request(app)
        .patch('/api/leases/lease-no-ejari')
        .send({ status: 'active' }); // no ejariNumber in body either

      expect(res.status).toBe(422);
      expect(res.body.error).toMatch(/ejariNumber is required/i);
    });

    it('returns 422 when activating with empty string ejariNumber', async () => {
      mockPrisma.lease.findUnique.mockResolvedValueOnce({
        id: 'lease-empty-ejari',
        status: 'draft',
        tenantId: 'tenant-1',
        landlordId: 'user-1',
        ejariNumber: '',
      });

      const res = await request(app)
        .patch('/api/leases/lease-empty-ejari')
        .send({ status: 'active', ejariNumber: '  ' }); // blank string

      expect(res.status).toBe(422);
      expect(res.body.error).toMatch(/ejariNumber is required/i);
    });

    it('allows activation when ejariNumber is present in the existing record', async () => {
      mockPrisma.lease.findUnique.mockResolvedValueOnce({
        id: 'lease-with-ejari',
        status: 'draft',
        tenantId: 'tenant-1',
        landlordId: 'user-1',
        ejariNumber: 'EJ-2026-00123', // valid number already stored
      });
      mockPrisma.lease.update.mockResolvedValueOnce({
        id: 'lease-with-ejari',
        status: 'active',
        ejariNumber: 'EJ-2026-00123',
      });

      const res = await request(app)
        .patch('/api/leases/lease-with-ejari')
        .send({ status: 'active' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('allows activation when ejariNumber is provided in the PATCH body', async () => {
      mockPrisma.lease.findUnique.mockResolvedValueOnce({
        id: 'lease-body-ejari',
        status: 'draft',
        tenantId: 'tenant-1',
        landlordId: 'user-1',
        ejariNumber: null, // not in DB yet
      });
      mockPrisma.lease.update.mockResolvedValueOnce({
        id: 'lease-body-ejari',
        status: 'active',
        ejariNumber: 'EJ-2026-00456',
      });

      const res = await request(app)
        .patch('/api/leases/lease-body-ejari')
        .send({ status: 'active', ejariNumber: 'EJ-2026-00456' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('allows non-active status changes without ejariNumber', async () => {
      mockPrisma.lease.findUnique.mockResolvedValueOnce({
        id: 'lease-terminate',
        status: 'active',
        tenantId: 'tenant-1',
        landlordId: 'user-1',
        ejariNumber: null,
      });
      mockPrisma.lease.update.mockResolvedValueOnce({
        id: 'lease-terminate',
        status: 'terminated',
      });

      const res = await request(app)
        .patch('/api/leases/lease-terminate')
        .send({ status: 'terminated' });

      expect(res.status).toBe(200);
    });
  });
});

