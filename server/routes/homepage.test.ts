/* eslint-disable @typescript-eslint/no-unsafe-function-type */

/**
 * homepage.test.ts — @Katherine (QA Lead)
 * Unit tests for GET /api/homepage/data
 * Tests: success path, Cache-Control header, static fallback on DB error.
 * All Prisma calls are mocked — no database needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ─────────────────────────────────────────────────────────────

const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  const MOCK_PROPERTY = {
    id: 'prop-1',
    title: 'Palm Jumeirah Villa',
    description: 'Stunning villa',
    type: 'villa',
    status: 'available',
    price: 12_000_000,
    currency: 'AED',
    bedrooms: 5,
    bathrooms: 6,
    sqft: 8000,
    location: 'Palm Jumeirah',
    area: 'Palm Jumeirah',
    amenities: ['pool', 'gym'],
    images: ['https://example.com/1.jpg'],
    featured: true,
    agentName: 'Sarah Ahmed',
  };

  const MOCK_AGENT = {
    id: 'agent-1',
    name: 'Sarah Ahmed',
    email: 'sarah@whitecaves.com',
    photoUrl: 'https://example.com/sarah.jpg',
    department: 'Luxury Sales',
    _count: { commissions: 42 },
  };

  return {
    mockPrisma: {
      property: {
        findMany: fn().mockResolvedValue([MOCK_PROPERTY]),
        aggregate: fn().mockResolvedValue({
          _avg: { price: 8_000_000 },
          _sum: { price: 4_000_000_000 },
          _count: { id: 500 },
        }),
        count: fn().mockResolvedValue(320),
      },
      user: {
        count: fn().mockResolvedValue(50),
        findMany: fn().mockResolvedValue([MOCK_AGENT]),
      },
      commission: {
        aggregate: fn().mockResolvedValue({
          _sum: { amount: 250_000_000 },
        }),
      },
    },
  };
});

vi.mock('../database.js', () => ({
  prisma: mockPrisma,
  connectDatabase: vi.fn(),
}));

vi.mock('../middleware/errorHandler.js', () => ({
  asyncHandler: (fn: Function) => fn,
  errorHandler: (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).json({ error: err.message });
  },
}));

vi.mock('../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
  createLogger: vi.fn(() => ({
    info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
  })),
}));

import homepageRoutes from './homepage';

// ── Test App ──────────────────────────────────────────────────────────────────

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/homepage', homepageRoutes);
  return app;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GET /api/homepage/data — success path', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset property.count to return different values for different calls:
    // 1st call: total count, 2nd call: available count, 3-6: location counts
    mockPrisma.property.count
      .mockResolvedValueOnce(500)   // totalProperties
      .mockResolvedValueOnce(320)   // availableCount
      .mockResolvedValueOnce(120)   // Palm Jumeirah
      .mockResolvedValueOnce(200)   // Downtown Dubai
      .mockResolvedValueOnce(45)    // Emirates Hills
      .mockResolvedValueOnce(180);  // Dubai Marina
    app = createApp();
  });

  it('returns 200 with success:true', async () => {
    const res = await request(app).get('/api/homepage/data');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns correct response structure', async () => {
    const res = await request(app).get('/api/homepage/data');
    const { data } = res.body;
    expect(data).toHaveProperty('featuredProperties');
    expect(data).toHaveProperty('marketStats');
    expect(data).toHaveProperty('topAgents');
    expect(data).toHaveProperty('locationTrends');
  });

  it('sets Cache-Control header with max-age=60', async () => {
    const res = await request(app).get('/api/homepage/data');
    const cc = res.headers['cache-control'] as string;
    expect(cc).toContain('max-age=60');
    expect(cc).toContain('public');
    expect(cc).toContain('stale-while-revalidate=300');
  });

  it('includes meta with fetchedAt and duration', async () => {
    const res = await request(app).get('/api/homepage/data');
    expect(res.body.meta).toHaveProperty('fetchedAt');
    expect(res.body.meta).toHaveProperty('duration');
    expect(typeof res.body.meta.duration).toBe('number');
  });

  it('returns featuredProperties array', async () => {
    const res = await request(app).get('/api/homepage/data');
    expect(Array.isArray(res.body.data.featuredProperties)).toBe(true);
    expect(res.body.data.featuredProperties[0].title).toBe('Palm Jumeirah Villa');
  });

  it('returns marketStats with correct shape', async () => {
    const res = await request(app).get('/api/homepage/data');
    const stats = res.body.data.marketStats;
    expect(stats).toHaveProperty('totalProperties');
    expect(stats).toHaveProperty('availableProperties');
    expect(stats).toHaveProperty('averagePrice');
    expect(stats).toHaveProperty('portfolioValue');
    expect(stats).toHaveProperty('activeAgents');
    expect(stats.averagePrice).toBe(8_000_000);
    expect(stats.portfolioValue).toBe(4_000_000_000);
  });

  it('returns topAgents array with deal count and revenue', async () => {
    const res = await request(app).get('/api/homepage/data');
    const agents = res.body.data.topAgents;
    expect(Array.isArray(agents)).toBe(true);
    expect(agents[0]).toMatchObject({
      id: 'agent-1',
      name: 'Sarah Ahmed',
      dealsCount: 42,
      revenueGenerated: 250_000_000,
    });
  });

  it('returns locationTrends for all 4 tracked areas', async () => {
    const res = await request(app).get('/api/homepage/data');
    const trends = res.body.data.locationTrends;
    expect(trends).toHaveLength(4);
    const names = trends.map((t: { name: string }) => t.name);
    expect(names).toContain('Palm Jumeirah');
    expect(names).toContain('Downtown Dubai');
    expect(names).toContain('Emirates Hills');
    expect(names).toContain('Dubai Marina');
  });

  it('sets trendDirection to "up" for positive trend percents', async () => {
    const res = await request(app).get('/api/homepage/data');
    const palmTrend = res.body.data.locationTrends.find(
      (t: { name: string }) => t.name === 'Palm Jumeirah'
    );
    expect(palmTrend.trendDirection).toBe('up');
    expect(palmTrend.trendPercent).toBe(12);
  });

  it('handles agent with null photoUrl gracefully', async () => {
    mockPrisma.user.findMany.mockResolvedValueOnce([
      { id: 'agent-2', name: 'No Photo', email: 'x@y.com', photoUrl: null, department: 'Sales', _count: { commissions: 0 } },
    ]);
    const res = await request(app).get('/api/homepage/data');
    const agents = res.body.data.topAgents;
    expect(agents[0].photoUrl).toBeNull();
  });

  it('rounds averagePrice to integer', async () => {
    mockPrisma.property.aggregate.mockResolvedValueOnce({
      _avg: { price: 8_333_333.33 },
      _sum: { price: 4_000_000_000 },
      _count: { id: 500 },
    });
    const res = await request(app).get('/api/homepage/data');
    const { averagePrice } = res.body.data.marketStats;
    expect(Number.isInteger(averagePrice)).toBe(true);
  });
});

describe('GET /api/homepage/data — fallback on DB error', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Make the first Prisma call throw to trigger the catch block
    mockPrisma.property.findMany.mockRejectedValueOnce(new Error('DB connection timeout'));
    app = createApp();
  });

  it('returns 200 even on DB error (static fallback)', async () => {
    const res = await request(app).get('/api/homepage/data');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns fallback marketStats on DB error', async () => {
    const res = await request(app).get('/api/homepage/data');
    const stats = res.body.data.marketStats;
    expect(stats.totalProperties).toBe(500);
    expect(stats.availableProperties).toBe(320);
    expect(stats.averagePrice).toBe(4_500_000);
    expect(stats.activeAgents).toBe(50);
  });

  it('returns empty featuredProperties on DB error', async () => {
    const res = await request(app).get('/api/homepage/data');
    expect(res.body.data.featuredProperties).toEqual([]);
  });

  it('returns fallback locationTrends with 4 entries on DB error', async () => {
    const res = await request(app).get('/api/homepage/data');
    expect(res.body.data.locationTrends).toHaveLength(4);
  });

  it('includes fallback:true in meta on DB error', async () => {
    const res = await request(app).get('/api/homepage/data');
    expect(res.body.meta.fallback).toBe(true);
    expect(res.body.meta.duration).toBe(0);
  });

  it('returns empty topAgents on DB error', async () => {
    const res = await request(app).get('/api/homepage/data');
    expect(res.body.data.topAgents).toEqual([]);
  });
});

describe('GET /api/homepage/data — edge cases', () => {
  it('handles zero average price (null _avg.price) gracefully', async () => {
    vi.clearAllMocks();
    mockPrisma.property.count
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0);
    mockPrisma.property.findMany.mockResolvedValueOnce([]);
    mockPrisma.property.aggregate.mockResolvedValueOnce({
      _avg: { price: null },
      _sum: { price: null },
      _count: { id: 0 },
    });
    mockPrisma.user.count.mockResolvedValueOnce(0);
    mockPrisma.user.findMany.mockResolvedValueOnce([]);

    const app = createApp();
    const res = await request(app).get('/api/homepage/data');
    expect(res.status).toBe(200);
    expect(res.body.data.marketStats.averagePrice).toBe(0);
    expect(res.body.data.marketStats.portfolioValue).toBe(0);
  });

  it('handles empty agents list (no commission queries)', async () => {
    vi.clearAllMocks();
    mockPrisma.property.count
      .mockResolvedValueOnce(100)
      .mockResolvedValueOnce(80)
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(20)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(15);
    mockPrisma.property.findMany.mockResolvedValueOnce([]);
    mockPrisma.property.aggregate.mockResolvedValueOnce({
      _avg: { price: 5_000_000 },
      _sum: { price: 500_000_000 },
      _count: { id: 100 },
    });
    mockPrisma.user.count.mockResolvedValueOnce(10);
    mockPrisma.user.findMany.mockResolvedValueOnce([]);

    const app = createApp();
    const res = await request(app).get('/api/homepage/data');
    expect(res.status).toBe(200);
    expect(res.body.data.topAgents).toEqual([]);
  });
});
