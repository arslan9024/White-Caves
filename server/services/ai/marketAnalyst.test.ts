/**
 * Market Analyst Service Tests — Phase 4C
 *
 * Tests the core analytics computations (price trends, yields, comparables, demand, overview, offer spread).
 * All Prisma calls are mocked.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFindMany = vi.fn();
const mockFindUnique = vi.fn();

vi.mock('../../database.js', () => ({
  prisma: {
    property: {
      findMany: (...args: unknown[]) => mockFindMany('property', ...args),
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
    },
    lease: { findMany: (...args: unknown[]) => mockFindMany('lease', ...args) },
    transaction: { findMany: (...args: unknown[]) => mockFindMany('transaction', ...args) },
    lead: { findMany: (...args: unknown[]) => mockFindMany('lead', ...args) },
    viewing: { findMany: (...args: unknown[]) => mockFindMany('viewing', ...args) },
    offer: { findMany: (...args: unknown[]) => mockFindMany('offer', ...args) },
  },
}));

vi.mock('../../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import * as marketAnalyst from './marketAnalyst.js';

function setupMock(model: string, data: unknown) {
  mockFindMany.mockImplementation((calledModel: string) => {
    if (calledModel === model) return Promise.resolve(data);
    return Promise.resolve([]);
  });
  mockFindUnique.mockResolvedValue(null);
}

function setupMocks(mappings: Record<string, unknown>) {
  mockFindMany.mockImplementation((calledModel: string) => {
    return Promise.resolve(mappings[calledModel] || []);
  });
  mockFindUnique.mockResolvedValue(null);
}

// ─── Tests ──────────────────────────────────────────────────────────────

describe('MarketAnalyst', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindMany.mockReset();
    mockFindUnique.mockReset();
  });

  it('computes price per sqft trends by area/type', async () => {
    setupMock('property', [
      { price: 2000000, sqft: 1000, area: 'Marina', type: 'apartment', createdAt: new Date() },
      { price: 2500000, sqft: 1200, area: 'Marina', type: 'apartment', createdAt: new Date() },
      { price: 3500000, sqft: 1800, area: 'JBR', type: 'apartment', createdAt: new Date() },
    ]);
    const trends = await marketAnalyst.getPriceTrends();
    expect(trends).toHaveLength(2);
    expect(trends[0].area).toBe('Marina');
    expect(trends[0].propertyType).toBe('apartment');
    expect(trends[0].avgPricePerSqft).toBeGreaterThan(0);
  });

  it('computes rental yields by area/type', async () => {
    setupMock('lease', [
      { monthlyRent: 10000, status: 'active', property: { price: 2000000, area: 'Marina', type: 'apartment' } },
      { monthlyRent: 12000, status: 'active', property: { price: 2500000, area: 'Marina', type: 'apartment' } },
      { monthlyRent: 8000, status: 'renewed', property: { price: 1800000, area: 'JBR', type: 'apartment' } },
    ]);
    const yields = await marketAnalyst.getRentalYields();
    expect(yields).toHaveLength(2);
    expect(yields[0].area).toBe('Marina');
    expect(yields[0].avgYield).toBeGreaterThan(0);
  });

  it('finds comparable properties', async () => {
    // Ensure mockFindUnique returns the correct property for id 'p1'
    setupMock('property', [
      { id: 'p2', price: 2100000, sqft: 950, area: 'Marina', type: 'apartment', bedrooms: 2, location: 'Marina Walk', bathrooms: 2, status: 'available', title: 'Marina Apt 2' },
      { id: 'p3', price: 2500000, sqft: 1200, area: 'Marina', type: 'apartment', bedrooms: 3, location: 'Marina Walk', bathrooms: 3, status: 'available', title: 'Marina Apt 3' },
    ]);
    mockFindUnique.mockImplementation((args: any) => {
      if (args && args.where && args.where.id === 'p1') {
        return Promise.resolve({
          id: 'p1', price: 2000000, sqft: 1000, area: 'Marina', type: 'apartment', bedrooms: 2, location: 'Marina Walk', bathrooms: 2, status: 'available', title: 'Marina Apt',
        });
      }
      return Promise.resolve(null);
    });
    const comps = await marketAnalyst.getComparables('p1');
    expect(comps).toHaveLength(2);
    expect(comps[0].similarity).toBeGreaterThan(0);
  });

  it('computes demand heatmap', async () => {
    setupMocks({
      property: [
        { area: 'Marina', price: 2000000, status: 'available' },
        { area: 'JBR', price: 1800000, status: 'available' },
      ],
      lead: [
        { budget: 2500000, score: 80, property: { area: 'Marina' }, status: 'new', createdAt: new Date() },
        { budget: 1800000, score: 60, property: { area: 'JBR' }, status: 'qualified', createdAt: new Date() },
      ],
      viewing: [
        { property: { area: 'Marina' }, scheduledAt: new Date() },
        { property: { area: 'JBR' }, scheduledAt: new Date() },
      ],
    });
    const heatmap = await marketAnalyst.getDemandHeatmap();
    expect(heatmap).toHaveLength(2);
    expect(heatmap[0].area).toBeDefined();
    expect(heatmap[0].demandIndex).toBeGreaterThan(0);
  });

  it('computes market overview', async () => {
    setupMocks({
      property: [
        { price: 2000000, sqft: 1000, area: 'Marina', status: 'available', createdAt: new Date(Date.now() - 10 * 86400000) },
        { price: 2500000, sqft: 1200, area: 'Marina', status: 'available', createdAt: new Date(Date.now() - 20 * 86400000) },
        { price: 1800000, sqft: 900, area: 'JBR', status: 'sold', createdAt: new Date(Date.now() - 30 * 86400000) },
      ],
      transaction: [
        { amount: 2000000, status: 'completed', createdAt: new Date() },
        { amount: 2500000, status: 'completed', createdAt: new Date() },
      ],
      lease: [
        { monthlyRent: 10000, status: 'active', property: { price: 2000000 } },
        { monthlyRent: 12000, status: 'active', property: { price: 2500000 } },
      ],
    });
    const overview = await marketAnalyst.getMarketOverview();
    expect(overview.totalProperties).toBeGreaterThan(0);
    expect(overview.avgPrice).toBeGreaterThan(0);
    expect(overview.topAreas.length).toBeGreaterThan(0);
  });

  it('computes offer spread analytics', async () => {
    setupMock('offer', [
      { amount: 1900000, status: 'accepted', counterAmount: 1950000, createdAt: new Date(), property: { price: 2000000, area: 'Marina' } },
      { amount: 1850000, status: 'pending', counterAmount: null, createdAt: new Date(), property: { price: 2000000, area: 'Marina' } },
    ]);
    const spreads = await marketAnalyst.getOfferSpread();
    expect(spreads).toHaveLength(1);
    expect(spreads[0].area).toBe('Marina');
    expect(spreads[0].avgSpread).toBeGreaterThan(0);
  });
});
