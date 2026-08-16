import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type Request, type Response, type NextFunction } from 'express';
import request from 'supertest';

const { mockPrisma, mockRentScheduleService } = vi.hoisted(() => ({
  mockPrisma: {
    lease: {
      findUnique: vi.fn(),
    },
    rentPayment: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    activity: {
      create: vi.fn().mockResolvedValue({ id: 'act-1' }),
    },
  },
  mockRentScheduleService: {
    generateRentSchedule: vi.fn().mockResolvedValue({
      leaseId: '507f1f77bcf86cd799439011',
      rentPaymentsCount: 12,
      pdcChequesCount: 12,
      totalAnnualRentAED: 120000,
    }),
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../services/rentScheduleService.js', () => mockRentScheduleService);
vi.mock('../middleware/errorHandler', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  asyncHandler: (fn: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));
vi.mock('../middleware/auth', () => ({ default: null }));

import rentPaymentsRoutes from './rentPayments.js';

function createApp(role = 'owner', userId = 'user-1') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as Request & { user?: { id: string; email: string; role: string } }).user = {
      id: userId,
      email: 'test@whitecaves.ae',
      role,
    };
    next();
  });
  app.use('/api/leases/:leaseId/payments', rentPaymentsRoutes);
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const VALID_LEASE_ID = '507f1f77bcf86cd799439011';
const VALID_PAYMENT_ID = '507f1f77bcf86cd799439022';

describe('Rent Payments Routes — /api/leases/:leaseId/payments (Wave 35)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/leases/:leaseId/payments', () => {
    it('returns 200 with rent payment schedule for lease', async () => {
      mockPrisma.lease.findUnique.mockResolvedValueOnce({
        id: VALID_LEASE_ID,
        landlordId: 'user-1',
        tenantId: 'tenant-1',
      });
      mockPrisma.rentPayment.findMany.mockResolvedValueOnce([
        { id: VALID_PAYMENT_ID, installment: 1, amountAED: 10000, status: 'pending' },
      ]);

      const res = await request(createApp('tenant'))
        .get(`/api/leases/${VALID_LEASE_ID}/payments`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });

    it('returns 404 if lease not found', async () => {
      mockPrisma.lease.findUnique.mockResolvedValueOnce(null);

      const res = await request(createApp('tenant'))
        .get(`/api/leases/${VALID_LEASE_ID}/payments`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/leases/:leaseId/payments/generate-schedule', () => {
    it('triggers rent schedule generator for active lease', async () => {
      mockPrisma.lease.findUnique.mockResolvedValueOnce({
        id: VALID_LEASE_ID,
        startDate: new Date('2026-03-01'),
        endDate: new Date('2027-03-01'),
        monthlyRent: 10000,
        tenantId: 'tenant-1',
      });

      const res = await request(createApp('owner'))
        .post(`/api/leases/${VALID_LEASE_ID}/payments/generate-schedule`)
        .send({ numberOfCheques: 4 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockRentScheduleService.generateRentSchedule).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/leases/:leaseId/payments/:paymentId', () => {
    it('updates payment status to paid and generates receipt', async () => {
      mockPrisma.rentPayment.findUnique.mockResolvedValueOnce({
        id: VALID_PAYMENT_ID,
        leaseId: VALID_LEASE_ID,
        installment: 1,
        amountAED: 10000,
        status: 'pending',
        receiptNumber: null,
      });
      mockPrisma.rentPayment.update.mockResolvedValueOnce({
        id: VALID_PAYMENT_ID,
        status: 'paid',
        receiptNumber: 'REC-12345',
      });

      const res = await request(createApp('owner'))
        .patch(`/api/leases/${VALID_LEASE_ID}/payments/${VALID_PAYMENT_ID}`)
        .send({ status: 'paid', paymentMethod: 'pdc' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockPrisma.activity.create).toHaveBeenCalled();
    });
  });
});
