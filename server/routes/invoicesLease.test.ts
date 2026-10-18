// @vitest-environment node
/**
 * Lease Invoices API Integration Tests
 * ─────────────────────────────────────
 * Tests invoice generation, filtering, permissions, and payment status updates.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { errorHandler } from '../middleware/errorHandler.js';
import { DocumentService } from '../services/DocumentService.js';
import { PDFDocument } from 'pdf-lib';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

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
    dueDate: new Date(Date.now() + 604800000),
    notes: 'TYPE:deposit | Security deposit for Villa 401',
    createdById: 'user-landlord-01',
    createdAt: new Date(),
    currency: 'AED',
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

  describe('GET /api/invoices/lease/:id/pdf', () => {
    function pdfApp(userId?: string, role = 'tenant', invalidId?: string[]) {
      const pdfApp = express();
      pdfApp.use('/api/invoices/lease', (req, _res, next) => {
        if (userId) req.user = { id: userId, role };
        next();
      });
      if (invalidId) {
        pdfApp.use('/api/invoices/lease/:id/pdf', (req, _res, next) => {
          req.params.id = invalidId;
          // Preserve the injected Express 5 parameter shape for the handler.
          const handler = invoicesLeaseRouter.stack.find(layer => layer.route?.path === '/:id/pdf');
          handler?.handle(req, _res, next);
        });
      } else {
        pdfApp.use('/api/invoices/lease', invoicesLeaseRouter);
      }
      pdfApp.use(errorHandler);
      return pdfApp;
    }

    it('returns a real PDF using persisted invoice amounts, client and status', async () => {
      const generate = vi.spyOn(DocumentService.prototype, 'generateLeaseInvoicePdf');
      try {
        const res = await request(app).get('/api/invoices/lease/inv-001/pdf')
          .buffer(true)
          .parse((response, callback) => {
            const chunks: Buffer[] = [];
            response.on('data', (chunk: Buffer) => chunks.push(chunk));
            response.on('end', () => callback(null, Buffer.concat(chunks)));
            response.on('error', callback);
          });
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toContain('application/pdf');
        expect(generate).toHaveBeenCalledWith(expect.objectContaining({
          client: 'Elena Rostova', amount: 15000, vatAmount: 750, totalAmount: 15750, status: 'pending',
        }));
        const pdf = await PDFDocument.load(new Uint8Array(res.body));
        expect(pdf.getPageCount()).toBe(1);
      } finally {
        generate.mockRestore();
      }
    });

    it('requires authentication', async () => {
      const res = await request(pdfApp()).get('/api/invoices/lease/inv-001/pdf');
      expect(res.status).toBe(401);
    });

    it('embeds and shapes mixed Arabic, English and numeric client names without altering amounts', async () => {
      const originalClient = mockInvoice.client;
      mockInvoice.client = 'أحمد محمد Trading 123';
      try {
        const res = await request(app).get('/api/invoices/lease/inv-001/pdf')
          .buffer(true)
          .parse((response, callback) => {
            const chunks: Buffer[] = [];
            response.on('data', (chunk: Buffer) => chunks.push(chunk));
            response.on('end', () => callback(null, Buffer.concat(chunks)));
            response.on('error', callback);
          });
        expect(res.status).toBe(200);
        expect(res.body.subarray(0, 5).toString()).toBe('%PDF-');
        expect(res.body.includes(Buffer.from('/FontFile2'))).toBe(true);
        expect(res.body.includes(Buffer.from('/ToUnicode'))).toBe(true);
        const task = getDocument({ data: new Uint8Array(res.body), useSystemFonts: false });
        try {
          const pdf = await task.promise;
          const content = await (await pdf.getPage(1)).getTextContent();
          const text = content.items.map(item => 'str' in item ? item.str : '').join('\n');
          expect(text).toContain('Client: أحمد محمد Trading 123');
          expect(text).toContain('Net Amount: AED 15000.00');
          expect(text).toContain('VAT Amount: AED 750.00');
          expect(text).toContain('Total Amount: AED 15750.00');
          expect(text).not.toContain('?');
          expect(text).not.toContain('\uFFFD');
        } finally {
          await task.destroy();
        }
      } finally {
        mockInvoice.client = originalClient;
      }
    });

    it('returns a user-safe 400 instead of silently replacing unsupported characters', async () => {
      const originalClient = mockInvoice.client;
      mockInvoice.client = 'Client 漢字';
      try {
        const res = await request(app).get('/api/invoices/lease/inv-001/pdf');
        expect(res.status).toBe(400);
        expect(res.body.error).toContain('characters not supported');
      } finally {
        mockInvoice.client = originalClient;
      }
    });

    it('rejects an unrelated authenticated user', async () => {
      const res = await request(pdfApp('unrelated')).get('/api/invoices/lease/inv-001/pdf');
      expect(res.status).toBe(403);
    });

    it('allows the linked tenant to download the invoice', async () => {
      const res = await request(pdfApp('user-tenant-01')).get('/api/invoices/lease/inv-001/pdf');
      expect(res.status).toBe(200);
    });

    it('rejects array parameters instead of coercing them to an invoice id', async () => {
      const res = await request(pdfApp('user-tenant-01', 'tenant', ['inv-001']))
        .get('/api/invoices/lease/inv-001/pdf');
      expect(res.status).toBe(400);
    });

    it('returns 404 for an unknown invoice', async () => {
      const res = await request(app).get('/api/invoices/lease/missing/pdf');
      expect(res.status).toBe(404);
    });
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
