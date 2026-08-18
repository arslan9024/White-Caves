/**
 * Dashboard API Integration Tests
 * ─────────────────────────────────
 * Tests owner summary KPIs, performance metrics, recent leads and properties,
 * activity feeds, and PDF report downloads.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('../services/dashboardService.js', () => ({
  default: {
    getDashboardData: vi.fn().mockResolvedValue({
      totalRevenue: 24500000,
      activeListings: 84,
      occupancyRate: 92.5,
    }),
    getSummary: vi.fn().mockResolvedValue({
      totalProperties: 120,
      totalLeads: 450,
      closedDeals: 35,
    }),
    getRecentProperties: vi.fn().mockResolvedValue([
      { id: 'prop-1', title: 'Palm Jumeirah Villa', price: 18500000 },
    ]),
    getRecentLeads: vi.fn().mockResolvedValue([
      { id: 'lead-1', name: 'Rashid Khan', score: 85 },
    ]),
    getPerformanceMetrics: vi.fn().mockResolvedValue({
      conversionRate: 14.2,
      averageDealSize: 3200000,
    }),
    getMarketAnalytics: vi.fn().mockResolvedValue({
      marketGrowth: 8.5,
      trendingAreas: ['Downtown Dubai', 'Dubai Creek Harbour'],
    }),
    getRecentActivities: vi.fn().mockResolvedValue([
      { id: 'act-1', description: 'Offer accepted for Palm Jumeirah Villa' },
    ]),
  },
}));

import dashboardRouter from './dashboard.routes.js';

describe('Dashboard API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/dashboard', dashboardRouter);
  });

  describe('GET /api/dashboard/owner/summary', () => {
    it('returns owner dashboard summary metrics', async () => {
      const res = await request(app).get('/api/dashboard/owner/summary');

      expect(res.status).toBe(200);
      expect(res.body.totalRevenue).toBe(24500000);
      expect(res.body.occupancyRate).toBe(92.5);
    });
  });

  describe('GET /api/dashboard/summary', () => {
    it('returns general executive summary', async () => {
      const res = await request(app).get('/api/dashboard/summary');

      expect(res.status).toBe(200);
      expect(res.body.totalProperties).toBe(120);
    });
  });

  describe('GET /api/dashboard/properties/recent', () => {
    it('returns recent properties list', async () => {
      const res = await request(app).get('/api/dashboard/properties/recent?limit=5');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].title).toBe('Palm Jumeirah Villa');
    });
  });

  describe('GET /api/dashboard/metrics', () => {
    it('returns conversion and performance KPIs', async () => {
      const res = await request(app).get('/api/dashboard/metrics');

      expect(res.status).toBe(200);
      expect(res.body.conversionRate).toBe(14.2);
    });
  });

  describe('GET /api/dashboard/report/download', () => {
    it('downloads PDF executive report attachment', async () => {
      const res = await request(app).get('/api/dashboard/report/download');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/pdf');
      expect(res.headers['content-disposition']).toContain('attachment');
    });
  });
});
