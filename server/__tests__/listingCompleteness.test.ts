/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Tests: Task 4 — Listing Completeness Scoring
 * Covers: GET /api/properties/:id/completeness
 *         GET /api/properties/completeness-summary
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────────────
const { mockPrisma, mockCacheService } = vi.hoisted(() => ({
  mockPrisma: {
    property: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
  },
  mockCacheService: {
    get: vi.fn(),
    set: vi.fn(),
    invalidate: vi.fn(),
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../services/CacheService.js', () => ({ cacheService: mockCacheService }));
vi.mock('../middleware/errorHandler', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(msg: string, code: number) {
      super(msg);
      this.statusCode = code;
    }
  },
  asyncHandler: (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));
vi.mock('../middleware/rbac', () => ({
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
  requireMinRole: () => (_req: any, _res: any, next: any) => next(),
  scopeToOwn: () => (req: any, _res: any, next: any) => {
    req.ownershipFilter = {};
    next();
  },
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

import propertiesRoutes from '../routes/properties';

const createApp = (role = 'manager') => {
  const app = express();
  app.use(express.json());
  app.use((req: any, _res: any, next: any) => {
    req.user = { id: 'user-mgr-1', role };
    next();
  });
  app.use('/api/properties', propertiesRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
};

// ── Fixtures ─────────────────────────────────────────────────────────────────

/** All 15 criteria passing → score = 100 */
const fullyCompleteProperty = {
  id: 'prop-full-1',
  title: 'Luxury Marina Penthouse',
  description:
    'This stunning penthouse offers panoramic views of Dubai Marina with world-class amenities.',
  price: 5_500_000,
  type: 'penthouse',
  status: 'available',
  location: '8 Boulevard Walk, Dubai Marina',
  area: 'Dubai Marina',
  bedrooms: 4,
  bathrooms: 5,
  sqft: 4_200,
  images: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg'],
  amenities: ['Pool', 'Gym', 'Concierge', 'Parking'],
  buildingPermitNumber: 'BP-2024-001234',
  municipalityNumber: 'MUN-2024-5678',
  userId: 'user-agent-1',
};

/** Only 5 criteria passing → score ≈ 33 */
const minimalProperty = {
  id: 'prop-min-1',
  title: 'Apt',
  description: null,
  price: 0,
  type: 'apartment',
  status: 'available',
  location: 'Dubai',
  area: null,
  bedrooms: 0,
  bathrooms: 0,
  sqft: 0,
  images: [],
  amenities: [],
  buildingPermitNumber: null,
  municipalityNumber: null,
  userId: 'user-1',
};

// ── GET /:id/completeness ────────────────────────────────────────────────────
describe('GET /api/properties/:id/completeness', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 404 when property does not exist', async () => {
    mockPrisma.property.findUnique.mockResolvedValue(null);
    const res = await request(createApp()).get('/api/properties/nonexistent/completeness');
    expect(res.status).toBe(404);
  });

  it('returns 200 with score, passed, failed, totalCriteria', async () => {
    mockPrisma.property.findUnique.mockResolvedValue(fullyCompleteProperty);
    const res = await request(createApp()).get(
      `/api/properties/${fullyCompleteProperty.id}/completeness`
    );
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const { data } = res.body;
    expect(data).toHaveProperty('score');
    expect(data).toHaveProperty('passed');
    expect(data).toHaveProperty('failed');
    expect(data).toHaveProperty('totalCriteria', 15);
  });

  it('returns score of 100 for a fully complete listing', async () => {
    mockPrisma.property.findUnique.mockResolvedValue(fullyCompleteProperty);
    const res = await request(createApp()).get(
      `/api/properties/${fullyCompleteProperty.id}/completeness`
    );
    expect(res.body.data.score).toBe(100);
    expect(res.body.data.failed).toHaveLength(0);
    expect(res.body.data.passed).toHaveLength(15);
  });

  it('returns score < 50 for a minimal (mostly empty) listing', async () => {
    mockPrisma.property.findUnique.mockResolvedValue(minimalProperty);
    const res = await request(createApp()).get(
      `/api/properties/${minimalProperty.id}/completeness`
    );
    expect(res.body.data.score).toBeLessThan(50);
    expect(res.body.data.failed.length).toBeGreaterThan(0);
  });

  it('includes hint text in failed criteria objects', async () => {
    mockPrisma.property.findUnique.mockResolvedValue(minimalProperty);
    const res = await request(createApp()).get(
      `/api/properties/${minimalProperty.id}/completeness`
    );
    const firstFailed = res.body.data.failed[0];
    expect(firstFailed).toHaveProperty('key');
    expect(firstFailed).toHaveProperty('label');
    expect(firstFailed).toHaveProperty('hint');
  });

  it('identifies description as failed when it is null', async () => {
    mockPrisma.property.findUnique.mockResolvedValue(minimalProperty);
    const res = await request(createApp()).get(
      `/api/properties/${minimalProperty.id}/completeness`
    );
    const failedKeys = res.body.data.failed.map((f: any) => f.key);
    expect(failedKeys).toContain('description');
  });

  it('identifies images as failed when there are fewer than 3 photos', async () => {
    mockPrisma.property.findUnique.mockResolvedValue({
      ...fullyCompleteProperty,
      id: 'prop-few-imgs',
      images: ['img1.jpg'],
    });
    const res = await request(createApp()).get('/api/properties/prop-few-imgs/completeness');
    const failedKeys = res.body.data.failed.map((f: any) => f.key);
    expect(failedKeys).toContain('images');
  });

  it('includes the propertyId and title in the response', async () => {
    mockPrisma.property.findUnique.mockResolvedValue(fullyCompleteProperty);
    const res = await request(createApp()).get(
      `/api/properties/${fullyCompleteProperty.id}/completeness`
    );
    expect(res.body.data.propertyId).toBe(fullyCompleteProperty.id);
    expect(res.body.data.title).toBe(fullyCompleteProperty.title);
  });
});

// ── GET /completeness-summary ────────────────────────────────────────────────
describe('GET /api/properties/completeness-summary', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 200 with total, averageScore, bands, worst10', async () => {
    mockPrisma.property.findMany.mockResolvedValue([fullyCompleteProperty]);
    const res = await request(createApp()).get('/api/properties/completeness-summary');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('total');
    expect(res.body.data).toHaveProperty('averageScore');
    expect(res.body.data).toHaveProperty('bands');
    expect(res.body.data).toHaveProperty('worst10');
  });

  it('returns averageScore of 100 when all properties are fully complete', async () => {
    mockPrisma.property.findMany.mockResolvedValue([fullyCompleteProperty]);
    const res = await request(createApp()).get('/api/properties/completeness-summary');
    expect(res.body.data.averageScore).toBe(100);
  });

  it('the fully complete property lands in the excellent band', async () => {
    mockPrisma.property.findMany.mockResolvedValue([fullyCompleteProperty]);
    const res = await request(createApp()).get('/api/properties/completeness-summary');
    expect(res.body.data.bands['76-100 (excellent)']).toBe(1);
  });

  it('band counts sum to the total property count', async () => {
    mockPrisma.property.findMany.mockResolvedValue([fullyCompleteProperty, minimalProperty]);
    const res = await request(createApp()).get('/api/properties/completeness-summary');
    const { bands, total } = res.body.data;
    const bandSum = Object.values(bands as Record<string, number>).reduce((s, v) => s + v, 0);
    expect(bandSum).toBe(total);
  });

  it('worst10 contains at most 10 entries', async () => {
    const many = Array.from({ length: 20 }, (_, i) => ({ ...minimalProperty, id: `prop-${i}` }));
    mockPrisma.property.findMany.mockResolvedValue(many);
    const res = await request(createApp()).get('/api/properties/completeness-summary');
    expect(res.body.data.worst10.length).toBeLessThanOrEqual(10);
  });

  it('worst10 is ordered ascending by score', async () => {
    mockPrisma.property.findMany.mockResolvedValue([fullyCompleteProperty, minimalProperty]);
    const res = await request(createApp()).get('/api/properties/completeness-summary');
    const worst = res.body.data.worst10 as Array<{ score: number }>;
    for (let i = 1; i < worst.length; i++) {
      expect(worst[i].score).toBeGreaterThanOrEqual(worst[i - 1].score);
    }
  });

  it('returns averageScore=0 and total=0 when no properties exist', async () => {
    mockPrisma.property.findMany.mockResolvedValue([]);
    const res = await request(createApp()).get('/api/properties/completeness-summary');
    expect(res.body.data.total).toBe(0);
    expect(res.body.data.averageScore).toBe(0);
  });
});
