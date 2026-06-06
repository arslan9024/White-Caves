/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * propertyVerification.test.ts — W18.1-P0-012
 * Tests: PATCH /api/properties/:id sets verifiedAt; GET returns verifiedAt
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const PROPERTY_ID = '64a1b2c3d4e5f6a7b8c9d0e1';

const { mockPrisma, mockCacheService } = vi.hoisted(() => ({
  mockPrisma: {
    property: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
      aggregate: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
  mockCacheService: { get: vi.fn(), set: vi.fn(), invalidate: vi.fn() },
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
  requirePermission: () => (_r: any, _s: any, n: any) => n(),
  requireMinRole: () => (_r: any, _s: any, n: any) => n(),
  scopeToOwn: () => (req: any, _s: any, n: any) => {
    req.ownershipFilter = {};
    n();
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
  id: PROPERTY_ID,
  title: 'Marina Heights',
  type: 'apartment',
  status: 'available',
  price: 2_500_000,
  featured: false,
  rentalPrice: null,
  commissionPercent: 5,
  bedrooms: 3,
  bathrooms: 2,
  sqft: 1800,
  location: 'Dubai Marina',
  area: 'Marina',
  images: [],
  amenities: [],
  furnished: false,
  verifiedAt: null,
  verifiedBy: null,
  verificationNotes: null,
  lastRefreshedAt: null,
  userId: 'user-manager-1',
  user: { id: 'user-manager-1', name: 'Manager', email: 'mgr@test.com' },
  _count: { leads: 0, commissions: 0 },
  ...overrides,
});

describe('PATCH /api/properties/:id — verification fields (W18.1-P0-012)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCacheService.invalidate.mockResolvedValue(undefined);
  });

  it('sets verifiedAt when PATCH body includes verifiedAt', async () => {
    const now = new Date().toISOString();
    const updated = makeProperty({ verifiedAt: new Date(now) });
    mockPrisma.property.findUnique.mockResolvedValue(makeProperty());
    mockPrisma.property.update.mockResolvedValue(updated);

    const res = await request(createApp())
      .patch(`/api/properties/${PROPERTY_ID}`)
      .send({ verifiedAt: now, verifiedBy: 'user-manager-1' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // Verify the prisma update was called with verifiedAt
    const updateCall = mockPrisma.property.update.mock.calls[0][0];
    expect(updateCall.data.verifiedAt).toBeInstanceOf(Date);
  });

  it('sets verifiedBy when PATCH body includes verifiedBy', async () => {
    mockPrisma.property.findUnique.mockResolvedValue(makeProperty());
    mockPrisma.property.update.mockResolvedValue(makeProperty({ verifiedBy: 'agent-xyz' }));

    const res = await request(createApp())
      .patch(`/api/properties/${PROPERTY_ID}`)
      .send({ verifiedBy: 'agent-xyz' });

    expect(res.status).toBe(200);
    const updateCall = mockPrisma.property.update.mock.calls[0][0];
    expect(updateCall.data.verifiedBy).toBe('agent-xyz');
  });

  it('sets lastRefreshedAt when PATCH body includes lastRefreshedAt', async () => {
    const now = new Date().toISOString();
    mockPrisma.property.findUnique.mockResolvedValue(makeProperty());
    mockPrisma.property.update.mockResolvedValue(makeProperty({ lastRefreshedAt: new Date(now) }));

    const res = await request(createApp())
      .patch(`/api/properties/${PROPERTY_ID}`)
      .send({ lastRefreshedAt: now });

    expect(res.status).toBe(200);
    const updateCall = mockPrisma.property.update.mock.calls[0][0];
    expect(updateCall.data.lastRefreshedAt).toBeInstanceOf(Date);
  });

  it('clears verifiedAt when null is sent', async () => {
    mockPrisma.property.findUnique.mockResolvedValue(makeProperty({ verifiedAt: new Date() }));
    mockPrisma.property.update.mockResolvedValue(makeProperty({ verifiedAt: null }));

    const res = await request(createApp())
      .patch(`/api/properties/${PROPERTY_ID}`)
      .send({ verifiedAt: null });

    expect(res.status).toBe(200);
    const updateCall = mockPrisma.property.update.mock.calls[0][0];
    expect(updateCall.data.verifiedAt).toBeNull();
  });
});

describe('GET /api/properties — includes verifiedAt (W18.1-P0-012)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCacheService.get.mockResolvedValue(null);
    mockCacheService.set.mockResolvedValue(undefined);
  });

  it('includes verifiedAt in list response', async () => {
    const verifiedAt = new Date('2025-04-01T00:00:00Z');
    mockPrisma.property.findMany.mockResolvedValue([makeProperty({ verifiedAt })]);
    mockPrisma.property.count.mockResolvedValue(1);

    const res = await request(createApp()).get('/api/properties');

    expect(res.status).toBe(200);
    expect(res.body.data[0]).toHaveProperty('verifiedAt');
  });
});
