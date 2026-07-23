import { beforeEach, describe, expect, it, vi } from 'vitest';
import express, { type Express } from 'express';
import request from 'supertest';

// Hoisted mocks for import-time interception
const { mockPrisma, loggerMock, mockAuthMiddleware } = vi.hoisted(() => {
  const mockPrisma = {
    marketSnapshot: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      count: vi.fn(),
    },
  };

  const loggerMock = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  const mockAuthMiddleware = (req: any, _res: any, next: any) => {
    req.user = { id: 'user-1', email: 'test@whitecaves.ae', role: 'owner' };
    next();
  };

  return { mockPrisma, loggerMock, mockAuthMiddleware };
});

vi.mock('../database.js', () => ({
  prisma: mockPrisma,
}));

vi.mock('../utils/logger.js', () => ({
  default: loggerMock,
}));

vi.mock('../middleware/errorHandler.js', () => ({
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

vi.mock('../middleware/auth.js', () => ({
  // Mock provided by test setup
}));

import marketRouter from '../routes/market.js';

function createApp(role = 'owner', userId = 'user-1'): Express {
  const app = express();
  app.use(express.json());

  // Auth middleware
  app.use((req: any, res: any, next: any) => {
    req.user = { id: userId, email: 'test@whitecaves.ae', role };
    next();
  });

  app.use('/api/market', marketRouter);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const mockMarketSnapshot = {
  id: 'snap-1',
  area: 'Dubai Marina',
  propertyType: 'apartment',
  avgPricePerSqft: 2600,
  avgSalePrice: 2600000,
  avgAnnualRent: 210000,
  grossYield: 8.08,
  transactionVol: 45,
  daysOnMarket: 32,
  absorptionRate: 3.2,
  newListings: 12,
  activeListings: 156,
  source: 'manual',
  notes: 'Q1 market analysis',
  snapshotDate: new Date('2026-03-01'),
  createdAt: new Date('2026-03-01'),
  updatedAt: new Date('2026-03-01'),
};

describe('Market Routes — /api/market', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /price-index', () => {
    it('returns all area benchmarks with computed yield', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);

      const res = await request(createApp()).get('/api/market/price-index');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('area');
      expect(res.body.data[0]).toHaveProperty('zone');
      expect(res.body.data[0]).toHaveProperty('avgPricePerSqft');
      expect(res.body.data[0]).toHaveProperty('grossYield');
    });

    it('filters by zone (premium)', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);

      const res = await request(createApp()).get('/api/market/price-index?zone=premium');

      expect(res.status).toBe(200);
      expect(res.body.data.every((d: any) => d.zone === 'premium')).toBe(true);
    });

    it('filters by zone (mid)', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);

      const res = await request(createApp()).get('/api/market/price-index?zone=mid');

      expect(res.status).toBe(200);
      expect(res.body.data.every((d: any) => d.zone === 'mid')).toBe(true);
    });

    it('filters by zone (affordable)', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);

      const res = await request(createApp()).get('/api/market/price-index?zone=affordable');

      expect(res.status).toBe(200);
      expect(res.body.data.every((d: any) => d.zone === 'affordable')).toBe(true);
    });

    it('rejects invalid zone with 400', async () => {
      const res = await request(createApp()).get('/api/market/price-index?zone=invalid-zone');

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Invalid zone/i);
    });

    it('returns 401 when not authenticated', async () => {
      const app = express();
      app.use(express.json());
      app.use('/api/market', marketRouter);
      app.use((err: any, _req: any, res: any, _next: any) => {
        res.status(err.statusCode || 500).json({ success: false, error: err.message });
      });

      const res = await request(app).get('/api/market/price-index');

      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/Authentication required/i);
    });

    it('enriches with latest market snapshot data', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([
        { ...mockMarketSnapshot, area: 'Dubai Marina', source: 'database' },
      ]);

      const res = await request(createApp()).get('/api/market/price-index');

      expect(res.status).toBe(200);
      const marina = res.body.data.find((d: any) => d.area === 'Dubai Marina');
      expect(marina).toBeDefined();
      expect(marina.avgPricePerSqft).toBe(2600);
      expect(marina.source).toBe('database');
    });
  });

  describe('GET /transactions', () => {
    it('returns monthly aggregated transaction data', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([
        {
          ...mockMarketSnapshot,
          snapshotDate: new Date('2026-03-15'),
          transactionVol: 45,
          avgSalePrice: 2600000,
        },
        {
          ...mockMarketSnapshot,
          snapshotDate: new Date('2026-02-15'),
          transactionVol: 38,
          avgSalePrice: 2550000,
        },
      ]);

      const res = await request(createApp()).get('/api/market/transactions');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0]).toHaveProperty('month');
      expect(res.body.data[0]).toHaveProperty('totalVolume');
      expect(res.body.data[0]).toHaveProperty('avgSalePrice');
    });

    it('filters by area', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([
        { ...mockMarketSnapshot, snapshotDate: new Date('2026-03-15'), area: 'Dubai Marina' },
      ]);

      const res = await request(createApp()).get('/api/market/transactions?area=Dubai Marina');

      expect(res.status).toBe(200);
      expect(mockPrisma.marketSnapshot.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ area: 'Dubai Marina' }),
        })
      );
    });

    it('defaults to 12 months lookback', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);

      const res = await request(createApp()).get('/api/market/transactions');

      expect(res.status).toBe(200);
      expect(res.body.period).toBe('12 months');
    });

    it('supports custom months parameter', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);

      const res = await request(createApp()).get('/api/market/transactions?months=6');

      expect(res.status).toBe(200);
      expect(res.body.period).toBe('6 months');
    });

    it('clamps months to max 36', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);

      const res = await request(createApp()).get('/api/market/transactions?months=100');

      expect(res.status).toBe(200);
      expect(res.body.period).toBe('36 months');
    });

    it('aggregates multiple records per month', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([
        {
          ...mockMarketSnapshot,
          snapshotDate: new Date('2026-03-01'),
          transactionVol: 20,
          avgSalePrice: 2500000,
        },
        {
          ...mockMarketSnapshot,
          snapshotDate: new Date('2026-03-15'),
          transactionVol: 25,
          avgSalePrice: 2600000,
        },
      ]);

      const res = await request(createApp()).get('/api/market/transactions');

      expect(res.status).toBe(200);
      const march = res.body.data.find((d: any) => d.month === '2026-03');
      expect(march.totalVolume).toBe(45);
    });
  });

  describe('GET /indicators', () => {
    it('returns market indicators from DB', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([mockMarketSnapshot]);

      const res = await request(createApp()).get('/api/market/indicators');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('avgDaysOnMarket');
      expect(res.body.data).toHaveProperty('absorptionRate');
      expect(res.body.data).toHaveProperty('newListings');
      expect(res.body.data).toHaveProperty('activeListings');
      expect(res.body.data.source).toBe('database');
    });

    it('filters by area', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([mockMarketSnapshot]);

      const res = await request(createApp()).get('/api/market/indicators?area=Dubai Marina');

      expect(res.status).toBe(200);
      expect(mockPrisma.marketSnapshot.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { area: 'Dubai Marina' },
        })
      );
    });

    it('returns benchmark indicators when no DB data exists', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);

      const res = await request(createApp()).get('/api/market/indicators');

      expect(res.status).toBe(200);
      expect(res.body.data.source).toBe('benchmark');
      expect(res.body.data.avgDaysOnMarket).toBe(45);
      expect(res.body.data.absorptionRate).toBe(3.2);
    });

    it('computes averages correctly', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([
        { ...mockMarketSnapshot, daysOnMarket: 30, absorptionRate: 3.0 },
        { ...mockMarketSnapshot, daysOnMarket: 40, absorptionRate: 3.5 },
      ]);

      const res = await request(createApp()).get('/api/market/indicators');

      expect(res.status).toBe(200);
      expect(res.body.data.avgDaysOnMarket).toBeCloseTo(35, 1);
      expect(res.body.data.absorptionRate).toBeCloseTo(3.25, 2);
    });
  });

  describe('GET /rera-index', () => {
    it('returns RERA rental index data', async () => {
      const res = await request(createApp()).get('/api/market/rera-index');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('area');
      expect(res.body.data[0]).toHaveProperty('propertyType');
      expect(res.body.data[0]).toHaveProperty('bedrooms');
      expect(res.body.data[0]).toHaveProperty('avgRentAed');
    });

    it('filters by area (case-insensitive)', async () => {
      const res = await request(createApp()).get('/api/market/rera-index?area=downtown');

      expect(res.status).toBe(200);
      expect(res.body.data.every((d: any) => d.area.toLowerCase().includes('downtown'))).toBe(true);
    });

    it('filters by propertyType', async () => {
      const res = await request(createApp()).get('/api/market/rera-index?propertyType=apartment');

      expect(res.status).toBe(200);
      expect(res.body.data.every((d: any) => d.propertyType.toLowerCase() === 'apartment')).toBe(
        true
      );
    });

    it('filters by bedrooms', async () => {
      const res = await request(createApp()).get('/api/market/rera-index?bedrooms=1br');

      expect(res.status).toBe(200);
      expect(res.body.data.every((d: any) => d.bedrooms.toLowerCase() === '1br')).toBe(true);
    });

    it('returns total count', async () => {
      const res = await request(createApp()).get('/api/market/rera-index');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('total');
      expect(res.body.total).toBe(res.body.data.length);
    });

    it('includes compliance note', async () => {
      const res = await request(createApp()).get('/api/market/rera-index');

      expect(res.status).toBe(200);
      expect(res.body.note).toMatch(/RERA portal/i);
    });
  });

  describe('GET /competitor-pricing', () => {
    it('returns competitor pricing data', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);

      const res = await request(createApp()).get('/api/market/competitor-pricing');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('portal');
      expect(['bayut', 'propertyfinder']).toContain(res.body.data[0].portal);
    });

    it('filters by area', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);

      const res = await request(createApp()).get('/api/market/competitor-pricing?area=Marina');

      expect(res.status).toBe(200);
      expect(res.body.data.every((d: any) => d.area.toLowerCase().includes('marina'))).toBe(true);
    });

    it('filters by portal (bayut)', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);

      const res = await request(createApp()).get('/api/market/competitor-pricing?portal=bayut');

      expect(res.status).toBe(200);
      expect(res.body.data.every((d: any) => d.portal === 'bayut')).toBe(true);
    });

    it('filters by portal (propertyfinder)', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);

      const res = await request(createApp()).get(
        '/api/market/competitor-pricing?portal=propertyfinder'
      );

      expect(res.status).toBe(200);
      expect(res.body.data.every((d: any) => d.portal === 'propertyfinder')).toBe(true);
    });

    it('rejects invalid portal with 400', async () => {
      const res = await request(createApp()).get('/api/market/competitor-pricing?portal=invalid');

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/Invalid portal/i);
    });

    it('includes disclaimer note', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);

      const res = await request(createApp()).get('/api/market/competitor-pricing');

      expect(res.status).toBe(200);
      expect(res.body.note).toMatch(/advisory/i);
    });
  });

  describe('POST /reports/monthly', () => {
    it('creates market snapshot with valid data', async () => {
      mockPrisma.marketSnapshot.create.mockResolvedValueOnce(mockMarketSnapshot);

      const res = await request(createApp()).post('/api/market/reports/monthly').send({
        area: 'Dubai Marina',
        propertyType: 'apartment',
        avgPricePerSqft: 2600,
        avgSalePrice: 2600000,
        avgAnnualRent: 210000,
        grossYield: 8.08,
        transactionVol: 45,
        daysOnMarket: 32,
        source: 'manual',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(mockPrisma.marketSnapshot.create).toHaveBeenCalled();
    });

    it('rejects missing required fields', async () => {
      const res = await request(createApp()).post('/api/market/reports/monthly').send({
        area: 'Dubai Marina',
        // Missing required fields
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/required/i);
    });

    it('allows only manager+ role', async () => {
      mockPrisma.marketSnapshot.create.mockResolvedValueOnce(mockMarketSnapshot);

      const res = await request(createApp('manager')).post('/api/market/reports/monthly').send({
        area: 'Dubai Marina',
        propertyType: 'apartment',
        avgPricePerSqft: 2600,
        avgSalePrice: 2600000,
        avgAnnualRent: 210000,
        grossYield: 8.08,
      });

      expect(res.status).toBe(201);
    });

    it('denies agent role from creating reports', async () => {
      const res = await request(createApp('agent')).post('/api/market/reports/monthly').send({
        area: 'Dubai Marina',
        propertyType: 'apartment',
        avgPricePerSqft: 2600,
        avgSalePrice: 2600000,
        avgAnnualRent: 210000,
        grossYield: 8.08,
      });

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/managers and admins/i);
    });

    it('logs report creation', async () => {
      mockPrisma.marketSnapshot.create.mockResolvedValueOnce(mockMarketSnapshot);

      await request(createApp()).post('/api/market/reports/monthly').send({
        area: 'Dubai Marina',
        propertyType: 'apartment',
        avgPricePerSqft: 2600,
        avgSalePrice: 2600000,
        avgAnnualRent: 210000,
        grossYield: 8.08,
      });

      expect(loggerMock.info).toHaveBeenCalledWith(
        expect.stringContaining('Monthly market report generated')
      );
    });

    it('defaults propertyType to "all"', async () => {
      mockPrisma.marketSnapshot.create.mockResolvedValueOnce({
        ...mockMarketSnapshot,
        propertyType: 'all',
      });

      await request(createApp()).post('/api/market/reports/monthly').send({
        area: 'Dubai Marina',
        avgPricePerSqft: 2600,
        avgSalePrice: 2600000,
        avgAnnualRent: 210000,
        grossYield: 8.08,
      });

      expect(mockPrisma.marketSnapshot.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ propertyType: 'all' }),
        })
      );
    });
  });

  describe('GET /snapshots', () => {
    it('returns paginated snapshot history', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([mockMarketSnapshot]);
      mockPrisma.marketSnapshot.count.mockResolvedValueOnce(1);

      const res = await request(createApp()).get('/api/market/snapshots');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toHaveProperty('page', 1);
      expect(res.body.pagination).toHaveProperty('pageSize');
      expect(res.body.pagination).toHaveProperty('total');
      expect(res.body.pagination).toHaveProperty('totalPages');
    });

    it('filters by area', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([mockMarketSnapshot]);
      mockPrisma.marketSnapshot.count.mockResolvedValueOnce(1);

      const res = await request(createApp()).get('/api/market/snapshots?area=Dubai Marina');

      expect(res.status).toBe(200);
      expect(mockPrisma.marketSnapshot.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { area: 'Dubai Marina' },
        })
      );
    });

    it('defaults to page 1, pageSize 20', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);
      mockPrisma.marketSnapshot.count.mockResolvedValueOnce(0);

      const res = await request(createApp()).get('/api/market/snapshots');

      expect(res.status).toBe(200);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.pageSize).toBe(20);
    });

    it('supports custom page size (max 100)', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);
      mockPrisma.marketSnapshot.count.mockResolvedValueOnce(0);

      const res = await request(createApp()).get('/api/market/snapshots?pageSize=50');

      expect(res.status).toBe(200);
      expect(res.body.pagination.pageSize).toBe(50);
    });

    it('clamps pageSize to max 100', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);
      mockPrisma.marketSnapshot.count.mockResolvedValueOnce(0);

      const res = await request(createApp()).get('/api/market/snapshots?pageSize=200');

      expect(res.status).toBe(200);
      expect(res.body.pagination.pageSize).toBe(100);
    });

    it('calculates totalPages correctly', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);
      mockPrisma.marketSnapshot.count.mockResolvedValueOnce(55);

      const res = await request(createApp()).get('/api/market/snapshots?pageSize=20');

      expect(res.status).toBe(200);
      expect(res.body.pagination.totalPages).toBe(3);
    });

    it('orders results by snapshotDate DESC', async () => {
      mockPrisma.marketSnapshot.findMany.mockResolvedValueOnce([]);
      mockPrisma.marketSnapshot.count.mockResolvedValueOnce(0);

      await request(createApp()).get('/api/market/snapshots');

      expect(mockPrisma.marketSnapshot.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { snapshotDate: 'desc' },
        })
      );
    });
  });
});
