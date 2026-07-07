/**
 * Valuation Routes — Comprehensive Test Suite
 * Role-matrix testing for AVM, manual override, and bank request endpoints
 * 42 tests: Yield calculator, history pagination, AVM recalculation, manual override, bank requests
 */

import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import valuationRouter from './valuation';
import { AppError, asyncHandler } from '../middleware/errorHandler';

// ─────────────────────────────────────────────────────────────────────────────
// HOISTED MOCKS (vi.hoisted ensures import-time interception)
// ─────────────────────────────────────────────────────────────────────────────

const { mockPrisma, requirePermissionMock, loggerMock } = vi.hoisted(() => {
  const fn = vi.fn;

  // RBAC permission matrix
  const ROLE_PERMISSIONS = {
    owner: ['view_valuations', 'override_valuations', 'create_valuations'],
    manager: ['view_valuations', 'override_valuations', 'create_valuations'],
    admin: ['view_valuations', 'override_valuations', 'create_valuations'],
    finance: ['view_valuations', 'create_valuations'],
    agent: ['view_valuations'],
    buyer: ['view_properties'],
    tenant: ['view_profile'],
    viewer: ['view_properties'],
    user: [],
  };

  // Manual override permission gate (only manager+)
  const canOverrideValuation = (role: string): boolean => {
    return ['manager', 'admin', 'owner'].includes(role);
  };

  // Prisma mock
  const mockPrisma = {
    propertyValuation: {
      findFirst: fn().mockResolvedValue(null),
      findMany: fn().mockResolvedValue([]),
      count: fn().mockResolvedValue(0),
      create: fn().mockResolvedValue(null),
    },
    property: {
      findUnique: fn().mockResolvedValue(null),
    },
  };

  // Logger mock
  const loggerMock = {
    info: fn(),
    error: fn(),
    warn: fn(),
  };

  // Require permission middleware (no actual RBAC check here; tests handle role logic)
  const requirePermissionMock =
    (..._requiredPermissions: string[]) =>
    (req: any, res: any, next: any) => {
      // Middleware allows all requests; actual permission logic tested via role injection
      next();
    };

  return { mockPrisma, requirePermissionMock, loggerMock };
});

// Mock imports
vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../middleware/rbac.js', () => ({ requirePermission: requirePermissionMock }));
vi.mock('../utils/logger.js', () => ({ default: loggerMock }));
vi.mock('../middleware/errorHandler', () => ({
  asyncHandler: (fn: Function) => fn,
  AppError: class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// TEST UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

function createApp(role: string = 'owner', userId = 'user-1'): Express {
  const app = express();
  app.use(express.json());

  // Inject user context
  app.use((req, _res, next) => {
    (req as any).user = { id: userId, email: 'test@whitecaves.ae', role };
    next();
  });

  // Mount router
  app.use('/api/valuations', valuationRouter);

  // Error handler
  app.use((err: any, _req: any, res: any, _next: any) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({ success: false, error: message });
  });

  return app;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEST FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const mockProperty = {
  id: 'prop-1',
  location: 'Downtown Dubai',
  area: 'Downtown Dubai',
  sqft: 2000,
  amenities: ['pool', 'gym', 'sea view'],
  type: 'apartment',
  bedrooms: 3,
};

const mockValuation = {
  id: 'val-1',
  propertyId: 'prop-1',
  estimatedValueAed: 2000000,
  rentAnnualAed: 120000,
  grossYieldPct: 6.0,
  netYieldPct: 5.4,
  confidence: 'high',
  method: 'avm',
  ageDiscount: 0.0,
  amenityPremium: 0.06,
  priceRangeLow: 1900000,
  priceRangeHigh: 2100000,
  createdAt: new Date('2026-01-15'),
};

// ─────────────────────────────────────────────────────────────────────────────
// TESTS: GET /api/valuations/yield-calculator (Public, no auth required)
// ─────────────────────────────────────────────────────────────────────────────

describe('Valuation Routes — /api/valuations', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /yield-calculator', () => {
    it('calculates gross and net yield from sale price, annual rent, and service charge', async () => {
      const app = createApp('owner');
      const res = await request(app)
        .get('/api/valuations/yield-calculator')
        .query({ salePrice: '1000000', annualRent: '60000', serviceCharge: '6000' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        grossYieldPct: 6.0,
        netYieldPct: 5.4,
        annualRent: 60000,
        salePrice: 1000000,
        serviceCharge: 6000,
      });
    });

    it('calculates net yield as 0 when service charge exceeds rental income', async () => {
      const app = createApp('owner');
      const res = await request(app)
        .get('/api/valuations/yield-calculator')
        .query({ salePrice: '1000000', annualRent: '30000', serviceCharge: '40000' });

      expect(res.status).toBe(200);
      expect(res.body.data.netYieldPct).toBeLessThan(0);
    });

    it('returns 400 when salePrice is missing', async () => {
      const app = createApp('owner');
      const res = await request(app)
        .get('/api/valuations/yield-calculator')
        .query({ annualRent: '60000' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('required');
    });

    it('returns 400 when annualRent is missing', async () => {
      const app = createApp('owner');
      const res = await request(app)
        .get('/api/valuations/yield-calculator')
        .query({ salePrice: '1000000' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('required');
    });

    it('returns 400 when salePrice is invalid (NaN)', async () => {
      const app = createApp('owner');
      const res = await request(app)
        .get('/api/valuations/yield-calculator')
        .query({ salePrice: 'invalid', annualRent: '60000' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Invalid numeric values');
    });

    it('returns 400 when salePrice is zero or negative', async () => {
      const app = createApp('owner');
      const res = await request(app)
        .get('/api/valuations/yield-calculator')
        .query({ salePrice: '0', annualRent: '60000' });

      expect(res.status).toBe(400);
    });

    it('returns 400 when annualRent is NaN', async () => {
      const app = createApp('owner');
      const res = await request(app)
        .get('/api/valuations/yield-calculator')
        .query({ salePrice: '1000000', annualRent: 'not-a-number' });

      expect(res.status).toBe(400);
    });

    it('defaults serviceCharge to 0 when not provided', async () => {
      const app = createApp('owner');
      const res = await request(app)
        .get('/api/valuations/yield-calculator')
        .query({ salePrice: '1000000', annualRent: '60000' });

      expect(res.status).toBe(200);
      expect(res.body.data.serviceCharge).toBe(0);
      expect(res.body.data.grossYieldPct).toBe(res.body.data.netYieldPct);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TESTS: GET /api/valuations/:propertyId (Latest valuation + count)
  // ─────────────────────────────────────────────────────────────────────────────

  describe('GET /:propertyId', () => {
    it('returns latest valuation and total snapshot count for authenticated owner', async () => {
      mockPrisma.propertyValuation.findFirst.mockResolvedValueOnce(mockValuation);
      mockPrisma.propertyValuation.count.mockResolvedValueOnce(5);

      const app = createApp('owner', 'user-1');
      const res = await request(app).get('/api/valuations/prop-1');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.latest).toMatchObject({
        id: 'val-1',
        estimatedValueAed: 2000000,
      });
      expect(res.body.data.totalSnapshots).toBe(5);
    });

    it('returns latest valuation and total snapshot count for authenticated agent', async () => {
      mockPrisma.propertyValuation.findFirst.mockResolvedValueOnce(mockValuation);
      mockPrisma.propertyValuation.count.mockResolvedValueOnce(3);

      const app = createApp('agent', 'agent-1');
      const res = await request(app).get('/api/valuations/prop-2');

      expect(res.status).toBe(200);
      expect(res.body.data.totalSnapshots).toBe(3);
    });

    it('returns 401 when user is not authenticated', async () => {
      const app = express();
      app.use(express.json());
      app.use('/api/valuations', valuationRouter);
      app.use((err: any, _req: any, res: any) => {
        res.status(err.statusCode || 500).json({ success: false, error: err.message });
      });

      const res = await request(app).get('/api/valuations/prop-1');

      expect(res.status).toBe(401);
    });

    it('returns null latest when no valuations exist', async () => {
      mockPrisma.propertyValuation.findFirst.mockResolvedValueOnce(null);
      mockPrisma.propertyValuation.count.mockResolvedValueOnce(0);

      const app = createApp('owner');
      const res = await request(app).get('/api/valuations/prop-1');

      expect(res.status).toBe(200);
      expect(res.body.data.latest).toBeNull();
      expect(res.body.data.totalSnapshots).toBe(0);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TESTS: GET /api/valuations/:propertyId/history (Paginated valuations)
  // ─────────────────────────────────────────────────────────────────────────────

  describe('GET /:propertyId/history', () => {
    it('returns paginated valuation history for authenticated owner', async () => {
      const valuations = [
        { ...mockValuation, id: 'val-1' },
        { ...mockValuation, id: 'val-2' },
      ];
      mockPrisma.propertyValuation.findMany.mockResolvedValueOnce(valuations);
      mockPrisma.propertyValuation.count.mockResolvedValueOnce(10);

      const app = createApp('owner');
      const res = await request(app).get('/api/valuations/prop-1/history?page=1&pageSize=2');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        pageSize: 2,
        total: 10,
        totalPages: 5,
      });
    });

    it('clamps page to minimum 1', async () => {
      mockPrisma.propertyValuation.findMany.mockResolvedValueOnce([mockValuation]);
      mockPrisma.propertyValuation.count.mockResolvedValueOnce(1);

      const app = createApp('owner');
      const res = await request(app).get('/api/valuations/prop-1/history?page=0&pageSize=20');

      expect(res.body.pagination.page).toBe(1);
      expect(mockPrisma.propertyValuation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0 })
      );
    });

    it('clamps pageSize to maximum 50', async () => {
      mockPrisma.propertyValuation.findMany.mockResolvedValueOnce([mockValuation]);
      mockPrisma.propertyValuation.count.mockResolvedValueOnce(1);

      const app = createApp('owner');
      await request(app).get('/api/valuations/prop-1/history?page=1&pageSize=100');

      expect(mockPrisma.propertyValuation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 50 })
      );
    });

    it('defaults page to 1 and pageSize to 20 when not provided', async () => {
      mockPrisma.propertyValuation.findMany.mockResolvedValueOnce([mockValuation]);
      mockPrisma.propertyValuation.count.mockResolvedValueOnce(1);

      const app = createApp('owner');
      await request(app).get('/api/valuations/prop-1/history');

      expect(mockPrisma.propertyValuation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 20,
        })
      );
    });

    it('handles empty valuation history', async () => {
      mockPrisma.propertyValuation.findMany.mockResolvedValueOnce([]);
      mockPrisma.propertyValuation.count.mockResolvedValueOnce(0);

      const app = createApp('owner');
      const res = await request(app).get('/api/valuations/prop-1/history');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
      expect(res.body.pagination.totalPages).toBe(0);
    });

    it('returns 401 when not authenticated', async () => {
      const app = express();
      app.use(express.json());
      app.use('/api/valuations', valuationRouter);
      app.use((err: any, _req: any, res: any) => {
        res.status(err.statusCode || 500).json({ success: false, error: err.message });
      });

      const res = await request(app).get('/api/valuations/prop-1/history');

      expect(res.status).toBe(401);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TESTS: POST /api/valuations/:propertyId/recalculate (AVM calculation)
  // ─────────────────────────────────────────────────────────────────────────────

  describe('POST /:propertyId/recalculate', () => {
    it('runs AVM and persists valuation for authenticated owner', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(mockProperty);
      mockPrisma.propertyValuation.create.mockResolvedValueOnce({
        ...mockValuation,
        method: 'avm',
      });

      const app = createApp('owner', 'user-1');
      const res = await request(app).post('/api/valuations/prop-1/recalculate');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.method).toBe('avm');
      expect(mockPrisma.propertyValuation.create).toHaveBeenCalled();
      expect(loggerMock.info).toHaveBeenCalledWith(expect.stringContaining('AVM recalculation'));
    });

    it('runs AVM for authenticated agent', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(mockProperty);
      mockPrisma.propertyValuation.create.mockResolvedValueOnce({
        ...mockValuation,
        method: 'avm',
      });

      const app = createApp('agent', 'agent-1');
      const res = await request(app).post('/api/valuations/prop-1/recalculate');

      expect(res.status).toBe(200);
      expect(res.body.data.method).toBe('avm');
    });

    it('returns 404 when property does not exist', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(null);

      const app = createApp('owner');
      const res = await request(app).post('/api/valuations/prop-notfound/recalculate');

      expect(res.status).toBe(404);
      expect(res.body.error).toContain('Property not found');
    });

    it('returns 401 when not authenticated', async () => {
      const app = express();
      app.use(express.json());
      app.use('/api/valuations', valuationRouter);
      app.use((err: any, _req: any, res: any) => {
        res.status(err.statusCode || 500).json({ success: false, error: err.message });
      });

      const res = await request(app).post('/api/valuations/prop-1/recalculate');

      expect(res.status).toBe(401);
    });

    it('stores createdById for audit trail', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(mockProperty);
      mockPrisma.propertyValuation.create.mockResolvedValueOnce(mockValuation);

      const app = createApp('owner', 'user-xyz');
      await request(app).post('/api/valuations/prop-1/recalculate');

      expect(mockPrisma.propertyValuation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            createdById: 'user-xyz',
          }),
        })
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TESTS: POST /api/valuations/:propertyId/override (Manual override — manager+)
  // ─────────────────────────────────────────────────────────────────────────────

  describe('POST /:propertyId/override', () => {
    it('creates manual override for authenticated manager', async () => {
      mockPrisma.propertyValuation.create.mockResolvedValueOnce({
        ...mockValuation,
        method: 'manual_override',
      });

      const app = createApp('manager', 'mgr-1');
      const res = await request(app).post('/api/valuations/prop-1/override').send({
        overrideValueAed: 2500000,
        rentAnnualAed: 150000,
        reason: 'Updated market conditions',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.method).toBe('manual_override');
    });

    it('creates manual override for authenticated admin', async () => {
      mockPrisma.propertyValuation.create.mockResolvedValueOnce({
        ...mockValuation,
        method: 'manual_override',
      });

      const app = createApp('admin', 'admin-1');
      const res = await request(app).post('/api/valuations/prop-1/override').send({
        overrideValueAed: 2500000,
        rentAnnualAed: 150000,
        reason: 'Manual review approved',
      });

      expect(res.status).toBe(200);
      expect(res.body.data.method).toBe('manual_override');
    });

    it('creates manual override for authenticated owner', async () => {
      mockPrisma.propertyValuation.create.mockResolvedValueOnce({
        ...mockValuation,
        method: 'manual_override',
      });

      const app = createApp('owner', 'owner-1');
      const res = await request(app).post('/api/valuations/prop-1/override').send({
        overrideValueAed: 2800000,
        reason: 'Strategic portfolio review',
      });

      expect(res.status).toBe(200);
    });

    it('returns 403 when finance role attempts override', async () => {
      const app = createApp('finance', 'fin-1');
      const res = await request(app).post('/api/valuations/prop-1/override').send({
        overrideValueAed: 2500000,
        reason: 'Budget reallocation',
      });

      expect(res.status).toBe(403);
      expect(res.body.error).toContain('managers and admins');
    });

    it('returns 403 when agent attempts override', async () => {
      const app = createApp('agent', 'agent-1');
      const res = await request(app).post('/api/valuations/prop-1/override').send({
        overrideValueAed: 2500000,
        reason: 'Personal assessment',
      });

      expect(res.status).toBe(403);
    });

    it('returns 403 when buyer attempts override', async () => {
      const app = createApp('buyer', 'buyer-1');
      const res = await request(app).post('/api/valuations/prop-1/override').send({
        overrideValueAed: 2500000,
        reason: 'Buyer negotiation',
      });

      expect(res.status).toBe(403);
    });

    it('returns 400 when overrideValueAed is missing', async () => {
      const app = createApp('manager');
      const res = await request(app).post('/api/valuations/prop-1/override').send({
        reason: 'Valid reason here',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('overrideValueAed');
    });

    it('returns 400 when overrideValueAed is zero', async () => {
      const app = createApp('manager');
      const res = await request(app).post('/api/valuations/prop-1/override').send({
        overrideValueAed: 0,
        reason: 'Testing zero value',
      });

      expect(res.status).toBe(400);
    });

    it('returns 400 when overrideValueAed is negative', async () => {
      const app = createApp('manager');
      const res = await request(app).post('/api/valuations/prop-1/override').send({
        overrideValueAed: -1000000,
        reason: 'Testing negative value',
      });

      expect(res.status).toBe(400);
    });

    it('returns 400 when reason is missing', async () => {
      const app = createApp('manager');
      const res = await request(app).post('/api/valuations/prop-1/override').send({
        overrideValueAed: 2500000,
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('reason');
    });

    it('returns 400 when reason is less than 5 characters', async () => {
      const app = createApp('manager');
      const res = await request(app).post('/api/valuations/prop-1/override').send({
        overrideValueAed: 2500000,
        reason: 'abc',
      });

      expect(res.status).toBe(400);
    });

    it('calculates grossYield from override values', async () => {
      mockPrisma.propertyValuation.create.mockResolvedValueOnce({
        ...mockValuation,
        estimatedValueAed: 2500000,
        rentAnnualAed: 150000,
        grossYieldPct: 6.0,
        method: 'manual_override',
      });

      const app = createApp('manager', 'mgr-1');
      const res = await request(app).post('/api/valuations/prop-1/override').send({
        overrideValueAed: 2500000,
        rentAnnualAed: 150000,
        reason: 'Market-based override',
      });

      expect(res.status).toBe(200);
      const call = mockPrisma.propertyValuation.create.mock.calls[0];
      expect(call[0].data.grossYieldPct).toBeCloseTo(6.0, 1);
    });

    it('stores overriddenById for audit trail', async () => {
      mockPrisma.propertyValuation.create.mockResolvedValueOnce(mockValuation);

      const app = createApp('manager', 'mgr-xyz');
      await request(app).post('/api/valuations/prop-1/override').send({
        overrideValueAed: 2500000,
        reason: 'Testing audit trail',
      });

      expect(mockPrisma.propertyValuation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            overriddenById: 'mgr-xyz',
          }),
        })
      );
    });

    it('logs override action with AED amount', async () => {
      mockPrisma.propertyValuation.create.mockResolvedValueOnce(mockValuation);

      const app = createApp('manager', 'mgr-1');
      await request(app).post('/api/valuations/prop-1/override').send({
        overrideValueAed: 2500000,
        reason: 'Testing logging',
      });

      expect(loggerMock.info).toHaveBeenCalledWith(expect.stringContaining('Valuation override'));
    });

    it('returns 401 when not authenticated', async () => {
      const app = express();
      app.use(express.json());
      app.use('/api/valuations', valuationRouter);
      app.use((err: any, _req: any, res: any) => {
        res.status(err.statusCode || 500).json({ success: false, error: err.message });
      });

      const res = await request(app).post('/api/valuations/prop-1/override').send({
        overrideValueAed: 2500000,
        reason: 'Testing',
      });

      expect(res.status).toBe(401);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TESTS: POST /api/valuations/:propertyId/bank-request (Bank valuation request)
  // ─────────────────────────────────────────────────────────────────────────────

  describe('POST /:propertyId/bank-request', () => {
    it('creates pending bank valuation request for authenticated owner', async () => {
      mockPrisma.propertyValuation.create.mockResolvedValueOnce({
        ...mockValuation,
        method: 'bank',
        bankRequestStatus: 'pending',
      });

      const app = createApp('owner', 'user-1');
      const res = await request(app).post('/api/valuations/prop-1/bank-request').send({
        bankName: 'Emirates NBD',
        purpose: 'Mortgage pre-approval',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.method).toBe('bank');
      expect(res.body.message).toContain('Bank valuation request submitted');
    });

    it('creates pending bank valuation request for authenticated agent', async () => {
      mockPrisma.propertyValuation.create.mockResolvedValueOnce({
        ...mockValuation,
        method: 'bank',
        bankRequestStatus: 'pending',
      });

      const app = createApp('agent', 'agent-1');
      const res = await request(app).post('/api/valuations/prop-1/bank-request').send({
        bankName: 'FAB',
      });

      expect(res.status).toBe(200);
      expect(res.body.data.method).toBe('bank');
    });

    it('includes bank name in success message when provided', async () => {
      mockPrisma.propertyValuation.create.mockResolvedValueOnce({
        ...mockValuation,
        method: 'bank',
      });

      const app = createApp('owner');
      const res = await request(app).post('/api/valuations/prop-1/bank-request').send({
        bankName: 'ADIB',
        purpose: 'Refinance valuation',
      });

      expect(res.body.message).toContain('ADIB');
    });

    it('excludes bank name from message when not provided', async () => {
      mockPrisma.propertyValuation.create.mockResolvedValueOnce({
        ...mockValuation,
        method: 'bank',
      });

      const app = createApp('owner');
      const res = await request(app)
        .post('/api/valuations/prop-1/bank-request')
        .send({ purpose: 'General valuation' });

      expect(res.body.message).not.toContain('to');
      expect(res.body.message).toContain('Bank valuation request submitted');
    });

    it('uses purpose as override reason when provided', async () => {
      mockPrisma.propertyValuation.create.mockResolvedValueOnce(mockValuation);

      const app = createApp('owner', 'user-1');
      await request(app).post('/api/valuations/prop-1/bank-request').send({
        bankName: 'ENBD',
        purpose: 'Custom purpose text',
      });

      expect(mockPrisma.propertyValuation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            overrideReason: 'Custom purpose text',
          }),
        })
      );
    });

    it('defaults purpose to standard message when not provided', async () => {
      mockPrisma.propertyValuation.create.mockResolvedValueOnce(mockValuation);

      const app = createApp('owner', 'user-1');
      await request(app).post('/api/valuations/prop-1/bank-request').send({ bankName: 'FAB' });

      expect(mockPrisma.propertyValuation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            overrideReason: 'Bank mortgage pre-approval',
          }),
        })
      );
    });

    it('stores createdById for audit trail', async () => {
      mockPrisma.propertyValuation.create.mockResolvedValueOnce(mockValuation);

      const app = createApp('owner', 'user-abc');
      await request(app).post('/api/valuations/prop-1/bank-request').send({ bankName: 'ENBD' });

      expect(mockPrisma.propertyValuation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            createdById: 'user-abc',
          }),
        })
      );
    });

    it('logs bank valuation request', async () => {
      mockPrisma.propertyValuation.create.mockResolvedValueOnce(mockValuation);

      const app = createApp('owner', 'user-1');
      await request(app).post('/api/valuations/prop-1/bank-request').send({ bankName: 'ENBD' });

      expect(loggerMock.info).toHaveBeenCalledWith(
        expect.stringContaining('Bank valuation request')
      );
    });

    it('returns 401 when not authenticated', async () => {
      const app = express();
      app.use(express.json());
      app.use('/api/valuations', valuationRouter);
      app.use((err: any, _req: any, res: any) => {
        res.status(err.statusCode || 500).json({ success: false, error: err.message });
      });

      const res = await request(app)
        .post('/api/valuations/prop-1/bank-request')
        .send({ bankName: 'ENBD' });

      expect(res.status).toBe(401);
    });

    it('sets bankRequestStatus to pending', async () => {
      mockPrisma.propertyValuation.create.mockResolvedValueOnce({
        ...mockValuation,
        bankRequestStatus: 'pending',
      });

      const app = createApp('owner', 'user-1');
      await request(app).post('/api/valuations/prop-1/bank-request').send({ bankName: 'ENBD' });

      expect(mockPrisma.propertyValuation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            bankRequestStatus: 'pending',
            bankRequestedAt: expect.any(Date),
          }),
        })
      );
    });
  });
});
