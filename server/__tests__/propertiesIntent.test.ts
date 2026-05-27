/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * propertiesIntent.test.ts — W18.1-P0-001
 * Tests: GET /api/properties intent scoring
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockPrisma, mockCacheService } = vi.hoisted(() => ({
  mockPrisma: {
    property: {
      findMany:  vi.fn(),
      count:     vi.fn(),
      groupBy:   vi.fn(),
      aggregate: vi.fn(),
    },
  },
  mockCacheService: { get: vi.fn(), set: vi.fn(), invalidate: vi.fn() },
}));

vi.mock('../database.js',              () => ({ prisma: mockPrisma }));
vi.mock('../services/CacheService.js', () => ({ cacheService: mockCacheService }));
vi.mock('../middleware/errorHandler', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(msg: string, code: number) { super(msg); this.statusCode = code; }
  },
  asyncHandler: (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));
vi.mock('../middleware/rbac', () => ({
  requirePermission: () => (_r: any, _s: any, n: any) => n(),
  requireMinRole:    () => (_r: any, _s: any, n: any) => n(),
  scopeToOwn:        () => (req: any, _s: any, n: any) => { req.ownershipFilter = {}; n(); },
}));
vi.mock('../utils/sanitize', () => ({ sanitizeString: (s: string) => s }));
vi.mock('../utils/validate', () => ({
  validate: vi.fn(),
  rules: { oneOf: vi.fn(() => () => undefined) },
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

const makeProperty = (overrides: Record<string, unknown> = {}) => ({
  id: 'prop-1',
  title: 'Test',
  type: 'apartment',
  status: 'available',
  price: 1_200_000,
  featured: false,
  rentalPrice: null,
  commissionPercent: 5,
  bedrooms: 2,
  bathrooms: 2,
  sqft: 1200,
  location: 'Downtown Dubai',
  area: 'Downtown',
  images: [],
  amenities: [],
  user: null,
  _count: { leads: 0, commissions: 0 },
  ...overrides,
});

describe('GET /api/properties — intent scoring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCacheService.get.mockResolvedValue(null);
    mockCacheService.set.mockResolvedValue(undefined);
    mockPrisma.property.count.mockResolvedValue(3);
  });

  it('GET ?intent=buy → 200, available status scores 2', async () => {
    mockPrisma.property.findMany.mockResolvedValue([
      makeProperty({ status: 'available', type: 'apartment' }),
      makeProperty({ id: 'p2', status: 'sold', type: 'villa' }),
      makeProperty({ id: 'p3', status: 'rented', type: 'office' }),
    ]);
    const res = await request(createApp()).get('/api/properties?intent=buy');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.data[0].intentScore).toBe(2);
    expect(res.body.data[1].intentScore).toBe(1);
    expect(res.body.data[2].intentScore).toBe(0);
  });

  it('GET ?intent=rent → 200, score=2 for rentalPrice > 0', async () => {
    mockPrisma.property.findMany.mockResolvedValue([
      makeProperty({ rentalPrice: 90_000 }),
      makeProperty({ id: 'p2', rentalPrice: null }),
      makeProperty({ id: 'p3', rentalPrice: 0 }),
    ]);
    const res = await request(createApp()).get('/api/properties?intent=rent');
    expect(res.status).toBe(200);
    expect(res.body.data[0].intentScore).toBe(2);
    expect(res.body.data[1].intentScore).toBe(0);
    expect(res.body.data[2].intentScore).toBe(0);
  });

  it('GET ?intent=invest → 200, score=2 featured, score=1 commission>0', async () => {
    mockPrisma.property.findMany.mockResolvedValue([
      makeProperty({ featured: true,  commissionPercent: 5 }),
      makeProperty({ id: 'p2', featured: false, commissionPercent: 3 }),
      makeProperty({ id: 'p3', featured: false, commissionPercent: 0 }),
    ]);
    const res = await request(createApp()).get('/api/properties?intent=invest');
    expect(res.status).toBe(200);
    expect(res.body.data[0].intentScore).toBe(2);
    expect(res.body.data[1].intentScore).toBe(1);
    expect(res.body.data[2].intentScore).toBe(0);
  });

  it('GET ?intent=invalid → 200, all intentScores = 0 (graceful)', async () => {
    mockPrisma.property.findMany.mockResolvedValue([
      makeProperty({ status: 'available', rentalPrice: 80_000, featured: true }),
    ]);
    const res = await request(createApp()).get('/api/properties?intent=invalid');
    expect(res.status).toBe(200);
    expect(res.body.data[0].intentScore).toBe(0);
  });

  it('GET /api/properties (no intent) → 200, intentScore = 0 for all', async () => {
    mockPrisma.property.findMany.mockResolvedValue([
      makeProperty({ status: 'available', featured: true }),
    ]);
    const res = await request(createApp()).get('/api/properties');
    expect(res.status).toBe(200);
    expect(res.body.data[0].intentScore).toBe(0);
  });

  it('properties are never removed regardless of intent', async () => {
    const fiveProps = Array.from({ length: 5 }, (_, i) =>
      makeProperty({ id: `p${i}`, status: 'sold', rentalPrice: null, featured: false }),
    );
    mockPrisma.property.findMany.mockResolvedValue(fiveProps);
    mockPrisma.property.count.mockResolvedValue(5);
    for (const intentVal of ['buy', 'rent', 'invest', 'invalid']) {
      const res = await request(createApp()).get(`/api/properties?intent=${intentVal}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(5);
    }
  });

  it('response always has pagination metadata', async () => {
    mockPrisma.property.findMany.mockResolvedValue([makeProperty()]);
    const res = await request(createApp()).get('/api/properties?intent=buy');
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination).toHaveProperty('page');
    expect(res.body.pagination).toHaveProperty('total');
  });
});
