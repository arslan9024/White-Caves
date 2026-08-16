import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type Request, type Response, type NextFunction } from 'express';
import request from 'supertest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    rentPayment: { findMany: vi.fn() },
    maintenance: { findMany: vi.fn() },
    lease: { findMany: vi.fn() },
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
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

import financialReportsRoutes from './financialReports.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as Request & { user?: { id: string; role: string } }).user = {
      id: 'finance-1',
      role: 'owner',
    };
    next();
  });
  app.use('/api/financial-reports', financialReportsRoutes);
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

describe('Financial Reports Routes — /api/financial-reports (Wave 44)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/financial-reports/monthly-pnl', () => {
    it('calculates monthly net operating income', async () => {
      mockPrisma.rentPayment.findMany.mockResolvedValueOnce([{ amountAED: 150000 }]);
      mockPrisma.maintenance.findMany.mockResolvedValueOnce([{ cost: 10000 }]);

      const res = await request(createApp()).get('/api/financial-reports/monthly-pnl');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.netOperatingIncomeAED).toBe(140000);
    });
  });

  describe('GET /api/financial-reports/landlord-income', () => {
    it('returns rental income summary per landlord', async () => {
      mockPrisma.lease.findMany.mockResolvedValueOnce([
        { landlordId: 'lnd-1', landlord: { name: 'Sheikh Hamdan', email: 'hamdan@example.com' }, monthlyRent: 16666.67 },
      ]);

      const res = await request(createApp()).get('/api/financial-reports/landlord-income');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].annualIncomeAED).toBeGreaterThan(190000);
    });
  });
});
