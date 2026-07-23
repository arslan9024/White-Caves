
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Tests: Task 1 — Advanced Search Facets
 * Covers: GET /api/properties/facets
 *         GET /api/properties with furnishing / handoverStage / permitStatus / feeBand filters
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks (must run before imports) ──────────────────────────────────
const { mockPrisma, mockCacheService } = vi.hoisted(() => ({
  mockPrisma: {
    property: {
      findMany:  vi.fn(),
      count:     vi.fn(),
      groupBy:   vi.fn(),
      aggregate: vi.fn(),
    },
  },
  mockCacheService: {
    get:        vi.fn(),
    set:        vi.fn(),
    invalidate: vi.fn(),
  },
}));

vi.mock('../database.js',                () => ({ prisma: mockPrisma }));
vi.mock('../services/CacheService.js',   () => ({ cacheService: mockCacheService }));
vi.mock('../middleware/errorHandler', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(msg: string, code: number) { super(msg); this.statusCode = code; }
  },
  asyncHandler: (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));
vi.mock('../middleware/rbac', () => ({
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
  requireMinRole:    () => (_req: any, _res: any, next: any) => next(),
  scopeToOwn:        () => (req: any, _res: any, next: any) => { req.ownershipFilter = {}; next(); },
}));
vi.mock('../utils/sanitize', () => ({ sanitizeString: (s: string) => s }));
vi.mock('../utils/validate',  () => ({
  validate:        vi.fn(),
  rules:           { oneOf: vi.fn(() => () => undefined) },
  validateIdParam: vi.fn(),
}));
vi.mock('../config/pagination', () => ({
  parsePagination: () => ({ page: 1, limit: 20, skip: 0 }),
}));

import propertiesRoutes from '../routes/properties.js';

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use((req: any, _res: any, next: any) => {
    req.user = { id: 'user-manager-1', role: 'manager' };
    next();
  });
  app.use('/api/properties', propertiesRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
};

// ── Facets endpoint ──────────────────────────────────────────────────────────
describe('GET /api/properties/facets', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default groupBy responses
    mockPrisma.property.groupBy.mockImplementation(({ by }: { by: string[] }) => {
      if (by[0] === 'furnished') {
        return Promise.resolve([
          { furnished: true,  _count: { _all: 15 } },
          { furnished: false, _count: { _all: 30 } },
        ]);
      }
      if (by[0] === 'inventoryStage') {
        return Promise.resolve([
          { inventoryStage: 'handed_over',    _count: { _all: 10 } },
          { inventoryStage: 'draft_collected', _count: { _all: 20 } },
          { inventoryStage: 'verified_active', _count: { _all: 5  } },
        ]);
      }
      return Promise.resolve([]);
    });
    mockPrisma.property.count.mockResolvedValue(10);
  });

  it('returns 200 with all four facet groups', async () => {
    const res = await request(createApp()).get('/api/properties/facets');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const { data } = res.body;
    expect(data).toHaveProperty('furnishing');
    expect(data).toHaveProperty('handoverStage');
    expect(data).toHaveProperty('permitStatus');
    expect(data).toHaveProperty('feeBand');
  });

  it('maps furnished boolean groups to furnishing labels', async () => {
    const res = await request(createApp()).get('/api/properties/facets');
    expect(res.body.data.furnishing.furnished).toBe(15);
    expect(res.body.data.furnishing.unfurnished).toBe(30);
  });

  it('maps inventoryStage back to handoverStage labels', async () => {
    const res = await request(createApp()).get('/api/properties/facets');
    const hs = res.body.data.handoverStage;
    expect(hs['ready']).toBe(10);
    expect(hs['off-plan']).toBe(20);
    expect(hs['under-construction']).toBe(5);
  });

  it('exposes permitStatus active/pending counts', async () => {
    const res = await request(createApp()).get('/api/properties/facets');
    const ps = res.body.data.permitStatus;
    expect(ps).toHaveProperty('active');
    expect(ps).toHaveProperty('pending');
    expect(typeof ps.active).toBe('number');
    expect(typeof ps.pending).toBe('number');
  });

  it('exposes feeBand no-fee / low-fee / standard-fee counts', async () => {
    const res = await request(createApp()).get('/api/properties/facets');
    const fb = res.body.data.feeBand;
    expect(fb).toHaveProperty('no-fee');
    expect(fb).toHaveProperty('low-fee');
    expect(fb).toHaveProperty('standard-fee');
  });

  it('calls groupBy twice (furnished + inventoryStage)', async () => {
    await request(createApp()).get('/api/properties/facets');
    expect(mockPrisma.property.groupBy).toHaveBeenCalledTimes(2);
  });
});

// ── furnishing filter ────────────────────────────────────────────────────────
describe('GET /api/properties — furnishing filter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCacheService.get.mockResolvedValue(null);
    mockCacheService.set.mockResolvedValue(undefined);
    mockPrisma.property.findMany.mockResolvedValue([]);
    mockPrisma.property.count.mockResolvedValue(0);
  });

  it('applies furnished:true when furnishing=furnished', async () => {
    await request(createApp()).get('/api/properties?furnishing=furnished');
    expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ furnished: true }),
      }),
    );
  });

  it('applies furnished:false when furnishing=unfurnished', async () => {
    await request(createApp()).get('/api/properties?furnishing=unfurnished');
    expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ furnished: false }),
      }),
    );
  });

  it('does NOT apply furnished filter when furnishing=all', async () => {
    await request(createApp()).get('/api/properties?furnishing=all');
    const call = mockPrisma.property.findMany.mock.calls[0]?.[0];
    expect(call.where).not.toHaveProperty('furnished');
  });

  it('does NOT apply furnished filter for unrecognised value (e.g. semi-furnished)', async () => {
    await request(createApp()).get('/api/properties?furnishing=semi-furnished');
    const call = mockPrisma.property.findMany.mock.calls[0]?.[0];
    expect(call.where).not.toHaveProperty('furnished');
  });
});

// ── handoverStage filter ─────────────────────────────────────────────────────
describe('GET /api/properties — handoverStage filter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCacheService.get.mockResolvedValue(null);
    mockCacheService.set.mockResolvedValue(undefined);
    mockPrisma.property.findMany.mockResolvedValue([]);
    mockPrisma.property.count.mockResolvedValue(0);
  });

  it.each([
    ['ready',              'handed_over'],
    ['off-plan',           'draft_collected'],
    ['under-construction', 'verified_active'],
  ])('maps handoverStage=%s → inventoryStage=%s', async (param, expected) => {
    await request(createApp()).get(`/api/properties?handoverStage=${param}`);
    expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ inventoryStage: expected }),
      }),
    );
  });

  it('does not filter when handoverStage=all', async () => {
    await request(createApp()).get('/api/properties?handoverStage=all');
    const call = mockPrisma.property.findMany.mock.calls[0]?.[0];
    expect(call.where).not.toHaveProperty('inventoryStage');
  });
});

// ── permitStatus filter ──────────────────────────────────────────────────────
describe('GET /api/properties — permitStatus filter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCacheService.get.mockResolvedValue(null);
    mockCacheService.set.mockResolvedValue(undefined);
    mockPrisma.property.findMany.mockResolvedValue([]);
    mockPrisma.property.count.mockResolvedValue(0);
  });

  it('filters buildingPermitNumber != null when permitStatus=active', async () => {
    await request(createApp()).get('/api/properties?permitStatus=active');
    expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          buildingPermitNumber: { not: null },
        }),
      }),
    );
  });

  it('filters buildingPermitNumber == null when permitStatus=pending', async () => {
    await request(createApp()).get('/api/properties?permitStatus=pending');
    expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ buildingPermitNumber: null }),
      }),
    );
  });

  it('does not filter for permitStatus=expired (no schema field)', async () => {
    await request(createApp()).get('/api/properties?permitStatus=expired');
    const call = mockPrisma.property.findMany.mock.calls[0]?.[0];
    expect(call.where).not.toHaveProperty('buildingPermitNumber');
  });
});

// ── feeBand filter ───────────────────────────────────────────────────────────
describe('GET /api/properties — feeBand filter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCacheService.get.mockResolvedValue(null);
    mockCacheService.set.mockResolvedValue(undefined);
    mockPrisma.property.findMany.mockResolvedValue([]);
    mockPrisma.property.count.mockResolvedValue(0);
  });

  it('applies commissionPercent lte:0 for no-fee', async () => {
    await request(createApp()).get('/api/properties?feeBand=no-fee');
    expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ commissionPercent: { lte: 0 } }),
      }),
    );
  });

  it('applies commissionPercent gt:0,lte:2 for low-fee', async () => {
    await request(createApp()).get('/api/properties?feeBand=low-fee');
    expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ commissionPercent: { gt: 0, lte: 2 } }),
      }),
    );
  });

  it('applies commissionPercent gt:2 for standard-fee', async () => {
    await request(createApp()).get('/api/properties?feeBand=standard-fee');
    expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ commissionPercent: { gt: 2 } }),
      }),
    );
  });

  it('does not filter when feeBand=all', async () => {
    await request(createApp()).get('/api/properties?feeBand=all');
    const call = mockPrisma.property.findMany.mock.calls[0]?.[0];
    expect(call.where).not.toHaveProperty('commissionPercent');
  });
});


