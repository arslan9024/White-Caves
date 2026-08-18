/**
 * Lease Invoices API Integration Tests
 * ─────────────────────────────────────
 * Tests invoice generation, filtering, permissions, and payment status updates.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { errorHandler } from '../middleware/errorHandler.js';

const { mockInvoice, mockLease } = vi.hoisted(() => ({
  mockInvoice: {
    id: 'inv-001',
    invoiceNumber: 'INV-LEASE-2026-08-01-1001',
    client: 'Elena Rostova',
    property: 'lease-001',
    amount: 15000,
    vatAmount: 750,
    totalAmount: 15750,
    status: 'pending',
    dueDate: new Date(Date.now() + 604800000).toISOString(),
    notes: 'TYPE:deposit | Security deposit for Villa 401',
    createdById: 'user-landlord-01',
    createdAt: new Date().toISOString(),
  },
  mockLease: {
    id: 'lease-001',
    leaseNumber: 'LN-2026-001',
    tenantId: 'user-tenant-01',
    landlordId: 'user-landlord-01',
  },
}));

vi.mock('../database.js', () => ({
  prisma: {
    invoice: {
      findMany: vi.fn().mockResolvedValue([mockInvoice]),
      count: vi.fn().mockResolvedValue(1),
      findUnique: vi.fn().mockImplementation(({ where }: { where: { id: string } }) => {
        if (where.id === 'inv-001') {
          return Promise.resolve(mockInvoice);
        }
        return Promise.resolve(null);
      }),
      create: vi.fn().mockImplementation(({ data }: { data: any }) =>
        Promise.resolve({
          id: 'inv-002',
          ...data,
          status: 'pending',
          createdAt: new Date().toISOString(),
        })
      ),
      update: vi.fn().mockImplementation(({ where, data }: { where: { id: string }; data: any }) =>
        Promise.resolve({
          ...mockInvoice,
          ...data,
          id: where.id,
        })
      ),
    },
    lease: {
      findUnique: vi.fn().mockImplementation(({ where }: { where: { id: string } }) => {
        if (where.id === 'lease-001') {
          return Promise.resolve(mockLease);
        }
        return Promise.resolve(null);
      }),
    },
  },
}));

import invoicesLeaseRouter from './invoicesLease.js';

describe('Lease Invoices API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    // Attach mock auth user middleware
    app.use((req: any, _res: any, next: any) => {
      req.user = { id: 'user-landlord-01', role: 'owner', email: 'owner@whitecaves.ae' };
      next();
    });
    app.use('/api/invoices/lease', invoicesLeaseRouter);
    app.use(errorHandler);
  });

  describe('GET /api/invoices/lease', () => {
    it('returns a paginated list of lease invoices', async () => {
      const res = await request(app).get('/api/invoices/lease?leaseId=lease-001');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].id).toBe('inv-001');
      expect(res.body.pagination.total).toBe(1);
    });
  });

  describe('GET /api/invoices/lease/:id', () => {
    it('returns invoice details for valid ID', async () => {
      const res = await request(app).get('/api/invoices/lease/inv-001');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('inv-001');
      expect(res.body.data.totalAmount).toBe(15750);
    });

    it('returns 404 when invoice is not found', async () => {
      const res = await request(app).get('/api/invoices/lease/inv-non-existent');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/invoices/lease', () => {
    it('creates a lease invoice with 5% VAT calculation and returns 201', async () => {
      const payload = {
        leaseId: 'lease-001',
        invoiceType: 'deposit',
        clientName: 'Elena Rostova',
        amount: 20000,
        vatAmount: 1000,
        dueDate: new Date(Date.now() + 604800000).toISOString(),
        notes: 'Security deposit',
      };

      const res = await request(app)
        .post('/api/invoices/lease')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.amount).toBe(20000);
      expect(res.body.data.totalAmount).toBe(21000);
    });

    it('rejects invoice creation when required fields are missing with 400', async () => {
      const res = await request(app)
        .post('/api/invoices/lease')
        .send({ notes: 'No lease id' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/invoices/lease/:id', () => {
    it('updates status of invoice to paid', async () => {
      const res = await request(app)
        .patch('/api/invoices/lease/inv-001')
        .send({ status: 'paid' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('paid');
    });
  });
});
