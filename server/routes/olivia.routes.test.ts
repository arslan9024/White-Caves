/**
 * Olivia Featured Properties API Integration Tests
 * ─────────────────────────────────────────────────
 * Tests Olivia AI daily property curation, cache expiration, manual refresh,
 * and featured history queries.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockFeaturedProperty } = vi.hoisted(() => ({
  mockFeaturedProperty: {
    dateActive: new Date().toISOString().split('T')[0],
    featuredProperties: [
      { id: 'prop-olivia-001', title: 'Signature Villa Palm Jumeirah', price: 28000000 },
      { id: 'prop-olivia-002', title: 'Downtown Penthouse Sky Collection', price: 15000000 },
    ],
    totalAvailable: 150,
    generatedAt: new Date().toISOString(),
    generatedBy: 'Olivia AI Curator',
    selectionMethod: 'ai_luxury_curation',
  },
}));

vi.mock('../services/oliviaService.js', () => ({
  default: {
    getTodaysFeatured: vi.fn().mockResolvedValue(mockFeaturedProperty),
    manualRefresh: vi.fn().mockResolvedValue({
      success: true,
      message: 'Featured properties refreshed successfully',
      count: 2,
    }),
  },
}));

vi.mock('../models/HomepageFeature.js', () => {
  const MockModel: any = {
    find: vi.fn().mockImplementation(() => ({
      sort: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue([
        {
          dateActive: '2026-08-17',
          featuredProperties: ['prop-1', 'prop-2'],
          totalAvailable: 148,
          generatedAt: new Date().toISOString(),
        },
      ]),
    })),
  };
  return { default: MockModel };
});

import oliviaRouter from './olivia.routes.js';

describe('Olivia AI Featured Properties API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/olivia', oliviaRouter);
  });

  describe('GET /api/olivia', () => {
    it('returns today featured properties from database or cache', async () => {
      // Clear cache first
      await request(app).post('/api/olivia/clear-cache');

      const res = await request(app).get('/api/olivia');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.featuredProperties.length).toBe(2);
      expect(res.body.generatedBy).toBe('Olivia AI Curator');
    });

    it('returns cached response on second immediate call', async () => {
      const res = await request(app).get('/api/olivia');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.source).toBe('cache');
    });
  });

  describe('POST /api/olivia/refresh', () => {
    it('triggers manual refresh of curated featured properties', async () => {
      const res = await request(app).post('/api/olivia/refresh');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
    });
  });

  describe('GET /api/olivia/history', () => {
    it('returns historical featured property sets', async () => {
      const res = await request(app).get('/api/olivia/history?days=7');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.history)).toBe(true);
      expect(res.body.history[0].propertyCount).toBe(2);
    });
  });

  describe('POST /api/olivia/clear-cache', () => {
    it('clears in-memory cache cleanly', async () => {
      const res = await request(app).post('/api/olivia/clear-cache');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Cache cleared');
    });
  });
});
