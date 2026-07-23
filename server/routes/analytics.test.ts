/**
 * Analytics Routes Test Suite — Cycle 7
 *
 * 6 endpoints tested:
 *   GET /overview          → Market overview snapshot
 *   GET /trends            → Price trends by area/type
 *   GET /yields            → Rental yields
 *   GET /comparables/:id   → Comparable properties for listing
 *   GET /demand            → Demand heatmap
 *   GET /offer-spread      → Offer vs asking price analytics
 *
 * Test patterns:
 *   - Hoisted mock pattern for import-time interception
 *   - RBAC mock with view_analytics + view_leads permissions
 *   - Per-test mockResolvedValueOnce() for isolation
 *   - Query parameter parsing and filtering
 *   - Path parameter validation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { Express, Request, Response, NextFunction } from 'express';
import Router from 'express';

// ─────────────────────────────────────────────────────────────────────────
// HOISTED MOCKS — Import-time interception
// ─────────────────────────────────────────────────────────────────────────

const { mockMarketAnalyst, mockRbac, mockLogger, mockAsyncHandler, mockPrisma } = vi.hoisted(() => {
  const mockMarketAnalyst = {
    getMarketOverview: vi.fn(),
    getPriceTrends: vi.fn(),
    getRentalYields: vi.fn(),
    getComparables: vi.fn(),
    getDemandHeatmap: vi.fn(),
    getOfferSpread: vi.fn(),
  };

  const permissions = {
    owner: ['view_analytics', 'view_leads', 'manage_leads'],
    manager: ['view_analytics', 'view_leads'],
    agent: [],
  };

  const mockRbac = {
    requirePermission:
      (permission: string) => (req: Request, res: Response, next: NextFunction) => {
        // Explicit check: if no req.user, deny immediately
        if (!req.user) {
          return res.status(403).json({ error: 'Access denied: not authenticated' });
        }

        const userPerms = permissions[(req.user as any).role] || [];
        if (!userPerms.includes(permission)) {
          return res.status(403).json({ error: `Access denied: requires ${permission}` });
        }
        next();
      },
  };

  const mockLogger = {
    createLogger: vi.fn(() => ({
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    })),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  // asyncHandler wraps async route handlers
  const mockAsyncHandler = (handler: any) => handler;

  const mockPrisma = {
    followUpSequence: {
      findMany: vi.fn(),
    },
  };

  return { mockMarketAnalyst, mockRbac, mockLogger, mockAsyncHandler, mockPrisma };
});

vi.mock('../services/ai/marketAnalyst.js', () => ({
  getMarketOverview: mockMarketAnalyst.getMarketOverview,
  getPriceTrends: mockMarketAnalyst.getPriceTrends,
  getRentalYields: mockMarketAnalyst.getRentalYields,
  getComparables: mockMarketAnalyst.getComparables,
  getDemandHeatmap: mockMarketAnalyst.getDemandHeatmap,
  getOfferSpread: mockMarketAnalyst.getOfferSpread,
}));

vi.mock('../middleware/rbac.js', () => ({
  requirePermission: mockRbac.requirePermission,
}));

vi.mock('../utils/logger.js', () => ({
  createLogger: mockLogger.createLogger,
  logger: mockLogger,
}));

vi.mock('../database.js', () => ({
  prisma: mockPrisma,
}));

vi.mock('../middleware/errorHandler.js', () => ({
  asyncHandler: mockAsyncHandler,
}));

// ─────────────────────────────────────────────────────────────────────────
// TEST IMPORTS — After mocks are established
// ─────────────────────────────────────────────────────────────────────────

import analyticsRouter from './analytics.js';
import express from 'express';

// ─────────────────────────────────────────────────────────────────────────
// TEST FACTORY
// ─────────────────────────────────────────────────────────────────────────

function createApp(
  role: 'owner' | 'manager' | 'agent' = 'owner',
  userId: string = 'user-1'
): Express {
  const app = express();
  app.use(express.json());

  // Inject auth middleware
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (role !== 'agent') {
      // Only owner/manager get authenticated
      (req as any).user = { id: userId, role };
    }
    next();
  });

  app.use('/api/analytics', analyticsRouter);

  return app;
}

// ─────────────────────────────────────────────────────────────────────────
// TESTS
// ─────────────────────────────────────────────────────────────────────────

describe('Analytics Routes — /api/analytics', () => {
  // ════════════════════════════════════════════════════════════════════════
  // GET /overview
  // ════════════════════════════════════════════════════════════════════════

  describe('GET /overview', () => {
    beforeEach(() => {
      mockMarketAnalyst.getMarketOverview.mockResolvedValueOnce({
        totalProperties: 5200,
        activeListings: 1840,
        avgPrice: 1250000,
        avgYield: 4.2,
        topAreas: ['Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah'],
        marketTrend: 'stable',
        lastUpdated: '2026-07-08T10:00:00Z',
      });
    });

    it('returns market overview snapshot', async () => {
      const res = await request(createApp('owner')).get('/api/analytics/overview');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalProperties', 5200);
      expect(res.body.data).toHaveProperty('marketTrend', 'stable');
      expect(mockMarketAnalyst.getMarketOverview).toHaveBeenCalled();
    });

    it('denies overview to agents', async () => {
      const res = await request(createApp('agent')).get('/api/analytics/overview');

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error');
    });

    it('denies overview to unauthenticated users', async () => {
      const app = express();
      app.use(express.json());
      app.use('/api/analytics', analyticsRouter);

      const res = await request(app).get('/api/analytics/overview');

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error', 'Access denied: not authenticated');
    });
  });

  // ════════════════════════════════════════════════════════════════════════
  // GET /trends
  // ════════════════════════════════════════════════════════════════════════

  describe('GET /trends', () => {
    beforeEach(() => {
      mockMarketAnalyst.getPriceTrends.mockResolvedValueOnce({
        area: 'Downtown Dubai',
        type: 'residential',
        days: 90,
        dataPoints: [
          { date: '2026-04-08', pricePerSqft: 1200 },
          { date: '2026-05-08', pricePerSqft: 1210 },
          { date: '2026-06-08', pricePerSqft: 1215 },
          { date: '2026-07-08', pricePerSqft: 1220 },
        ],
        trend: 'upward',
        percentChange: 1.67,
      });
    });

    it('returns price trends with all filters', async () => {
      const res = await request(createApp('manager'))
        .get('/api/analytics/trends')
        .query({ area: 'Downtown Dubai', type: 'residential', days: '90' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.dataPoints.length).toBeGreaterThan(0);
      expect(res.body.meta).toEqual({
        area: 'Downtown Dubai',
        type: 'residential',
        days: 90,
      });
    });

    it('returns price trends with partial filters', async () => {
      const res = await request(createApp('owner'))
        .get('/api/analytics/trends')
        .query({ area: 'Dubai Marina' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.meta.area).toBe('Dubai Marina');
      expect(res.body.meta.type).toBe('all');
    });

    it('applies default days (90) when not provided', async () => {
      const res = await request(createApp('owner')).get('/api/analytics/trends');

      expect(res.status).toBe(200);
      expect(res.body.meta.days).toBe(90);
    });

    it('parses days parameter as integer', async () => {
      const res = await request(createApp('owner'))
        .get('/api/analytics/trends')
        .query({ days: '180' });

      expect(res.status).toBe(200);
      expect(res.body.meta.days).toBe(180);
      expect(typeof res.body.meta.days).toBe('number');
    });

    it('denies trends to agents', async () => {
      const res = await request(createApp('agent')).get('/api/analytics/trends');

      expect(res.status).toBe(403);
    });
  });

  // ════════════════════════════════════════════════════════════════════════
  // GET /yields
  // ════════════════════════════════════════════════════════════════════════

  describe('GET /yields', () => {
    beforeEach(() => {
      mockMarketAnalyst.getRentalYields.mockResolvedValueOnce({
        area: 'Dubai Marina',
        type: 'residential',
        yields: [
          { bedroom: '1BR', grossYield: 4.5, netYield: 3.8 },
          { bedroom: '2BR', grossYield: 4.2, netYield: 3.5 },
          { bedroom: '3BR', grossYield: 3.9, netYield: 3.1 },
        ],
        avgGrossYield: 4.2,
        avgNetYield: 3.47,
      });
    });

    it('returns rental yields with filters', async () => {
      const res = await request(createApp('owner'))
        .get('/api/analytics/yields')
        .query({ area: 'Dubai Marina', type: 'residential' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.yields).toBeDefined();
      expect(res.body.meta).toEqual({
        area: 'Dubai Marina',
        type: 'residential',
      });
    });

    it('returns yields with default area/type (all)', async () => {
      const res = await request(createApp('manager')).get('/api/analytics/yields');

      expect(res.status).toBe(200);
      expect(res.body.meta.area).toBe('all');
      expect(res.body.meta.type).toBe('all');
    });

    it('returns yields with partial filters', async () => {
      const res = await request(createApp('owner'))
        .get('/api/analytics/yields')
        .query({ area: 'Downtown Dubai' });

      expect(res.status).toBe(200);
      expect(res.body.meta.area).toBe('Downtown Dubai');
      expect(res.body.meta.type).toBe('all');
    });

    it('denies yields to agents', async () => {
      const res = await request(createApp('agent')).get('/api/analytics/yields');

      expect(res.status).toBe(403);
    });
  });

  // ════════════════════════════════════════════════════════════════════════
  // GET /comparables/:propertyId
  // ════════════════════════════════════════════════════════════════════════

  describe('GET /comparables/:propertyId', () => {
    beforeEach(() => {
      mockMarketAnalyst.getComparables.mockResolvedValueOnce({
        propertyId: 'prop-123',
        comparables: [
          {
            id: 'comp-1',
            title: '2BR Marina View',
            price: 1200000,
            pricePerSqft: 1250,
            bua: 960,
            daysListed: 45,
          },
          {
            id: 'comp-2',
            title: '2BR Sea Facing',
            price: 1180000,
            pricePerSqft: 1230,
            bua: 960,
            daysListed: 32,
          },
        ],
        avgPrice: 1190000,
        avgPricePerSqft: 1240,
      });
    });

    it('returns comparable properties with defaults', async () => {
      const res = await request(createApp('manager')).get('/api/analytics/comparables/prop-123');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.comparables).toBeDefined();
      expect(res.body.meta.propertyId).toBe('prop-123');
      expect(res.body.meta.limit).toBe(10);
    });

    it('applies limit parameter', async () => {
      const res = await request(createApp('owner'))
        .get('/api/analytics/comparables/prop-456')
        .query({ limit: '5' });

      expect(res.status).toBe(200);
      expect(res.body.meta.limit).toBe(5);
      expect(typeof res.body.meta.limit).toBe('number');
    });

    it('accepts priceRange filter', async () => {
      const res = await request(createApp('owner'))
        .get('/api/analytics/comparables/prop-789')
        .query({ priceRange: '0.1' });

      expect(res.status).toBe(200);
      expect(mockMarketAnalyst.getComparables).toHaveBeenCalledWith(
        'prop-789',
        expect.objectContaining({ priceRange: 0.1 })
      );
    });

    it('accepts sizeRange filter', async () => {
      const res = await request(createApp('manager'))
        .get('/api/analytics/comparables/prop-abc')
        .query({ sizeRange: '0.15' });

      expect(res.status).toBe(200);
      expect(mockMarketAnalyst.getComparables).toHaveBeenCalledWith(
        'prop-abc',
        expect.objectContaining({ sizeRange: 0.15 })
      );
    });

    it('requires view_leads permission', async () => {
      const res = await request(createApp('agent')).get('/api/analytics/comparables/prop-123');

      expect(res.status).toBe(403);
    });
  });

  // ════════════════════════════════════════════════════════════════════════
  // GET /demand
  // ════════════════════════════════════════════════════════════════════════

  describe('GET /demand', () => {
    beforeEach(() => {
      mockMarketAnalyst.getDemandHeatmap.mockResolvedValueOnce({
        days: 30,
        heatmapData: [
          {
            area: 'Downtown Dubai',
            leads: 156,
            inventory: 42,
            demandScore: 8.7,
          },
          {
            area: 'Dubai Marina',
            leads: 243,
            inventory: 67,
            demandScore: 8.9,
          },
          {
            area: 'Palm Jumeirah',
            leads: 89,
            inventory: 18,
            demandScore: 9.2,
          },
        ],
        lastUpdated: '2026-07-08T10:00:00Z',
      });
    });

    it('returns demand heatmap with default days (30)', async () => {
      const res = await request(createApp('owner')).get('/api/analytics/demand');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.heatmapData).toBeDefined();
      expect(res.body.meta.days).toBe(30);
    });

    it('accepts days parameter', async () => {
      const res = await request(createApp('manager'))
        .get('/api/analytics/demand')
        .query({ days: '60' });

      expect(res.status).toBe(200);
      expect(res.body.meta.days).toBe(60);
      expect(mockMarketAnalyst.getDemandHeatmap).toHaveBeenCalledWith({
        days: 60,
      });
    });

    it('denies demand to agents', async () => {
      const res = await request(createApp('agent')).get('/api/analytics/demand');

      expect(res.status).toBe(403);
    });
  });

  // ════════════════════════════════════════════════════════════════════════
  // GET /offer-spread
  // ════════════════════════════════════════════════════════════════════════

  describe('GET /offer-spread', () => {
    beforeEach(() => {
      mockMarketAnalyst.getOfferSpread.mockResolvedValueOnce({
        area: 'Downtown Dubai',
        days: 90,
        spreads: [
          {
            date: '2026-05-08',
            avgAskingPrice: 1250000,
            avgOfferPrice: 1210000,
            spreadPercent: -3.2,
            transactionCount: 12,
          },
          {
            date: '2026-06-08',
            avgAskingPrice: 1265000,
            avgOfferPrice: 1240000,
            spreadPercent: -1.98,
            transactionCount: 18,
          },
        ],
        overallSpreadPercent: -2.6,
      });
    });

    it('returns offer spread analytics with filters', async () => {
      const res = await request(createApp('owner'))
        .get('/api/analytics/offer-spread')
        .query({ area: 'Downtown Dubai', days: '90' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.spreads).toBeDefined();
      expect(res.body.meta).toEqual({
        area: 'Downtown Dubai',
        days: 90,
      });
    });

    it('applies defaults when no area provided', async () => {
      const res = await request(createApp('manager')).get('/api/analytics/offer-spread');

      expect(res.status).toBe(200);
      expect(res.body.meta.area).toBe('all');
      expect(res.body.meta.days).toBe(90);
    });

    it('accepts days parameter', async () => {
      const res = await request(createApp('owner'))
        .get('/api/analytics/offer-spread')
        .query({ days: '180' });

      expect(res.status).toBe(200);
      expect(res.body.meta.days).toBe(180);
    });

    it('denies offer-spread to agents', async () => {
      const res = await request(createApp('agent')).get('/api/analytics/offer-spread');

      expect(res.status).toBe(403);
    });
  });

  // ════════════════════════════════════════════════════════════════════════
  // GET /sequences
  // ════════════════════════════════════════════════════════════════════════

  describe('GET /sequences', () => {
    it('returns sequence effectiveness metrics for owner', async () => {
      // Mock sequences data in db
      mockPrisma.followUpSequence.findMany.mockResolvedValueOnce([
        {
          id: 'seq-1',
          lead: { status: 'won' },
          steps: [
            { status: 'sent', channel: 'email', result: 'opened' },
            { status: 'sent', channel: 'whatsapp', result: 'replied' },
          ],
        },
        {
          id: 'seq-2',
          lead: { status: 'contacted' },
          steps: [{ status: 'sent', channel: 'email', result: 'delivered' }],
        },
      ] as any);

      const res = await request(createApp('owner')).get('/api/analytics/sequences');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalSequences).toBe(2);
      expect(res.body.data.openRate).toBe(0.5); // 1 opened / 2 emails sent
      expect(res.body.data.replyRate).toBe(1 / 3); // 1 reply / 3 steps sent
      expect(res.body.data.dealClosedRate).toBe(0.5); // 1 won / 2 sequences
    });

    it('denies sequences report to agents', async () => {
      const res = await request(createApp('agent')).get('/api/analytics/sequences');

      expect(res.status).toBe(403);
    });
  });
});
