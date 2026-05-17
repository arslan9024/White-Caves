/**
 * Properties Routes — Unit Tests
 * Tests /api/properties endpoints: list, stats, CRUD, search/filter
 * All Prisma calls are mocked — no database needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  const mockTx = {
    commission: { updateMany: fn().mockResolvedValue({ count: 0 }) },
    lead: { updateMany: fn().mockResolvedValue({ count: 0 }) },
    property: { delete: fn().mockResolvedValue({}) },
    activity: { create: fn().mockResolvedValue({ id: 'act-1' }) },
  };
  return {
    mockPrisma: {
      property: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        count: fn().mockResolvedValue(0),
        create: fn().mockResolvedValue({
          id: 'prop-1',
          title: 'Marina Apt',
          type: 'apartment',
          status: 'available',
          price: 500000,
          location: 'Dubai Marina',
          area: 'Marina',
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1200,
          featured: false,
        }),
        update: fn().mockResolvedValue({
          id: 'prop-1',
          title: 'Updated Apt',
          status: 'available',
        }),
        groupBy: fn().mockResolvedValue([]),
        aggregate: fn().mockResolvedValue({
          _sum: { price: 5000000 },
          _avg: { price: 500000, sqft: 1200 },
          _min: { price: 200000 },
          _max: { price: 2000000 },
        }),
      },
      activity: {
        create: fn().mockResolvedValue({ id: 'act-1' }),
      },
      $transaction: fn().mockImplementation(async (cb: (tx: typeof mockTx) => unknown) =>
        cb(mockTx)
      ),
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
  asyncHandler: (fn: unknown) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(
      (fn as (req: Request, res: Response, next: NextFunction) => unknown)(req, res, next)
    ).catch(next),
}));
vi.mock('../middleware/auth', () => ({ default: null }));
vi.mock('../utils/sanitize', () => ({
  sanitizeString: (s: string) => s,
}));
vi.mock('../utils/validate', () => ({
  validate: vi.fn(),
  rules: {
    requiredStringWithMax: () => ({}),
    positiveNumber: () => ({}),
    oneOf: () => ({}),
    optionalArray: () => ({}),
    optionalStringWithMax: () => ({}),
  },
  validateIdParam: (id: string, label: string) => {
    if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
      const err = new Error(`${label} must be a valid 24-character hex string`);
      (err as Error & { statusCode?: number }).statusCode = 400;
      throw err;
    }
  },
}));
vi.mock('../config/pagination', () => ({
  parsePagination: ({ page, limit }: { page?: string; limit?: string }) => ({
    page: Math.max(1, parseInt(page || '1') || 1),
    limit: Math.min(100, Math.max(1, parseInt(limit || '20') || 20)),
    skip:
      (Math.max(1, parseInt(page || '1') || 1) - 1) *
      Math.min(100, Math.max(1, parseInt(limit || '20') || 20)),
  }),
}));

import propertyRoutes from './properties';

// ── Test app factory ─────────────────────────────────────────────────
function createApp(role: string = 'owner', userId = 'user-1') {
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
  app.use('/api/properties', propertyRoutes);
  app.use(
    (err: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
      res.status(err.statusCode || 500).json({ success: false, error: err.message });
    }
  );
  return app;
}

const VALID_ID = 'aabbccddee11223344556677';

// ═════════════════════════════════════════════════════════════════════

describe('Properties Routes — /api/properties', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── GET / ────────────────────────────────────────────────────────
  describe('GET /api/properties', () => {
    it('returns 200 with paginated properties', async () => {
      mockPrisma.property.findMany.mockResolvedValueOnce([
        { id: 'prop-1', title: 'Villa', status: 'available' },
      ]);
      mockPrisma.property.count.mockResolvedValueOnce(1);
      const res = await request(createApp('agent')).get('/api/properties');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toBeDefined();
    });

    it('supports search, status, type filters', async () => {
      mockPrisma.property.findMany.mockResolvedValueOnce([]);
      mockPrisma.property.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner')).get(
        '/api/properties?search=marina&status=available&type=apartment'
      );
      expect(res.status).toBe(200);
    });

    it('supports price range filters', async () => {
      mockPrisma.property.findMany.mockResolvedValueOnce([]);
      mockPrisma.property.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner')).get(
        '/api/properties?minPrice=100000&maxPrice=500000'
      );
      expect(res.status).toBe(200);
    });

    it('supports bedroom/bathroom filters', async () => {
      mockPrisma.property.findMany.mockResolvedValueOnce([]);
      mockPrisma.property.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner')).get('/api/properties?minBeds=2&minBaths=1');
      expect(res.status).toBe(200);
    });

    it('maps homepage alias params location/beds/baths into Prisma filters', async () => {
      mockPrisma.property.findMany.mockResolvedValueOnce([]);
      mockPrisma.property.count.mockResolvedValueOnce(0);

      const res = await request(createApp('owner')).get(
        '/api/properties?location=Dubai%20Marina&beds=3&baths=2'
      );

      expect(res.status).toBe(200);
      expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            location: expect.objectContaining({ contains: 'Dubai Marina', mode: 'insensitive' }),
            bedrooms: expect.objectContaining({ gte: 3 }),
            bathrooms: expect.objectContaining({ gte: 2 }),
          }),
        })
      );
    });

    it('ignores location alias when set to All Locations', async () => {
      mockPrisma.property.findMany.mockResolvedValueOnce([]);
      mockPrisma.property.count.mockResolvedValueOnce(0);

      const res = await request(createApp('owner')).get('/api/properties?location=All%20Locations');

      expect(res.status).toBe(200);
      expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.not.objectContaining({
            location: expect.anything(),
          }),
        })
      );
    });

    it('supports sort options', async () => {
      mockPrisma.property.findMany.mockResolvedValueOnce([]);
      mockPrisma.property.count.mockResolvedValueOnce(0);
      const res = await request(createApp('owner')).get(
        '/api/properties?sortBy=price&sortOrder=asc'
      );
      expect(res.status).toBe(200);
    });

    it('defaults to createdAt desc for invalid sort field', async () => {
      mockPrisma.property.findMany.mockResolvedValueOnce([]);
      mockPrisma.property.count.mockResolvedValueOnce(0);
      await request(createApp('owner')).get('/api/properties?sortBy=invalid');
      // Should have been called with createdAt orderBy
      expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: expect.objectContaining({ createdAt: 'desc' }),
        })
      );
    });
  });

  // ── GET /stats ───────────────────────────────────────────────────
  describe('GET /api/properties/stats', () => {
    it('returns property statistics for manager', async () => {
      mockPrisma.property.count.mockResolvedValueOnce(25);
      mockPrisma.property.groupBy
        .mockResolvedValueOnce([{ status: 'available', _count: { _all: 15 } }])
        .mockResolvedValueOnce([{ type: 'apartment', _count: { _all: 20 } }]);
      const res = await request(createApp('manager')).get('/api/properties/stats');
      expect(res.status).toBe(200);
      expect(res.body.data.total).toBe(25);
      expect(res.body.data.portfolioValue).toBeDefined();
    });

    it('returns 403 for agent role', async () => {
      const res = await request(createApp('agent')).get('/api/properties/stats');
      expect(res.status).toBe(403);
    });
  });

  // ── GET /:id ─────────────────────────────────────────────────────
  describe('GET /api/properties/:id', () => {
    it('returns property details', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        title: 'Marina Apt',
        status: 'available',
        user: { id: 'user-1', name: 'Agent', email: 'agent@test.com' },
      });
      const res = await request(createApp('agent')).get(`/api/properties/${VALID_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Marina Apt');
    });

    it('returns 404 if not found', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('agent')).get(`/api/properties/${VALID_ID}`);
      expect(res.status).toBe(404);
    });
  });

  // ── POST / ───────────────────────────────────────────────────────
  describe('POST /api/properties', () => {
    it('returns 201 on successful creation', async () => {
      mockPrisma.property.create.mockResolvedValueOnce({
        id: 'prop-new',
        title: 'New Villa',
        price: 1000000,
      });
      const res = await request(createApp('owner')).post('/api/properties').send({
        title: 'New Villa',
        price: 1000000,
        location: 'Palm Jumeirah',
        type: 'villa',
        status: 'available',
        municipalityNumber: 'MUN-1001',
        buildingPermitNumber: 'BPN-1001',
      });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('returns 403 for finance role', async () => {
      const res = await request(createApp('finance')).post('/api/properties').send({
        title: 'Villa',
        price: 1000000,
        location: 'Dubai',
        type: 'villa',
        status: 'available',
      });
      expect(res.status).toBe(403);
    });

    it('allows agent to create properties', async () => {
      mockPrisma.property.create.mockResolvedValueOnce({
        id: 'prop-agent',
        title: 'Agent Listing',
        price: 500000,
      });
      const res = await request(createApp('agent')).post('/api/properties').send({
        title: 'Agent Listing',
        price: 500000,
        location: 'JBR',
        type: 'apartment',
        status: 'available',
        municipalityNumber: 'MUN-1002',
        buildingPermitNumber: 'BPN-1002',
      });
      expect(res.status).toBe(201);
    });

    it('logs activity on creation', async () => {
      mockPrisma.property.create.mockResolvedValueOnce({
        id: 'prop-new',
        title: 'Test',
        price: 100000,
      });
      await request(createApp('owner')).post('/api/properties').send({
        title: 'Test',
        price: 100000,
        location: 'Dubai',
        type: 'apartment',
        status: 'available',
        municipalityNumber: 'MUN-1003',
        buildingPermitNumber: 'BPN-1003',
      });
      expect(mockPrisma.activity.create).toHaveBeenCalled();
    });
  });

  // ── PATCH /:id ───────────────────────────────────────────────────
  describe('PATCH /api/properties/:id', () => {
    it('returns 200 on successful update by admin', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        title: 'Old',
        status: 'available',
        userId: 'other-user',
      });
      mockPrisma.property.update.mockResolvedValueOnce({
        id: VALID_ID,
        title: 'Updated',
        status: 'available',
      });
      const res = await request(createApp('owner'))
        .patch(`/api/properties/${VALID_ID}`)
        .send({ title: 'Updated' });
      expect(res.status).toBe(200);
    });

    it('allows property owner to update their own property', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        title: 'My Villa',
        status: 'available',
        userId: 'user-1',
      });
      mockPrisma.property.update.mockResolvedValueOnce({
        id: VALID_ID,
        title: 'My Updated Villa',
        status: 'available',
      });
      const res = await request(createApp('agent', 'user-1'))
        .patch(`/api/properties/${VALID_ID}`)
        .send({ title: 'My Updated Villa' });
      expect(res.status).toBe(200);
    });

    it('returns 403 if not admin and not property owner', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        title: 'Other Villa',
        status: 'available',
        userId: 'other-user',
      });
      const res = await request(createApp('agent', 'user-1'))
        .patch(`/api/properties/${VALID_ID}`)
        .send({ title: 'Hijack' });
      expect(res.status).toBe(403);
    });

    it('returns 404 if property not found', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner'))
        .patch(`/api/properties/${VALID_ID}`)
        .send({ title: 'Update' });
      expect(res.status).toBe(404);
    });

    it('logs status change activity', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        title: 'My Villa',
        status: 'available',
        userId: 'user-1',
      });
      mockPrisma.property.update.mockResolvedValueOnce({
        id: VALID_ID,
        title: 'My Villa',
        status: 'sold',
      });
      await request(createApp('owner'))
        .patch(`/api/properties/${VALID_ID}`)
        .send({ status: 'sold' });
      expect(mockPrisma.activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ action: 'status_changed' }),
        })
      );
    });
  });

  // ── DELETE /:id ──────────────────────────────────────────────────
  describe('DELETE /api/properties/:id', () => {
    it('returns 200 on successful deletion', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        title: 'To Delete',
        userId: 'user-1',
      });
      const res = await request(createApp('owner')).delete(`/api/properties/${VALID_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 404 if property not found', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('owner')).delete(`/api/properties/${VALID_ID}`);
      expect(res.status).toBe(404);
    });

    it('returns 403 if not admin and not property owner', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        title: 'Other Villa',
        userId: 'other-user',
      });
      const res = await request(createApp('agent', 'user-1')).delete(`/api/properties/${VALID_ID}`);
      expect(res.status).toBe(403);
    });

    it('cleans up commissions and leads in transaction', async () => {
      mockPrisma.property.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        title: 'Clean Up',
        userId: 'user-1',
      });
      await request(createApp('owner')).delete(`/api/properties/${VALID_ID}`);
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });
  });
});
