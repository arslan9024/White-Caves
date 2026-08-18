/**
 * Sitemap Routes API Integration Tests
 * ─────────────────────────────────────
 * Tests XML sitemap generation, content-type header, static page inclusion,
 * dynamic property URL generation, and job posting URLs.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('../database.js', () => ({
  prisma: {
    property: {
      findMany: vi.fn().mockResolvedValue([
        { id: 'prop-001', updatedAt: new Date('2026-08-01T12:00:00Z') },
        { id: 'prop-002', updatedAt: new Date('2026-08-02T12:00:00Z') },
      ]),
    },
    jobPosting: {
      findMany: vi.fn().mockResolvedValue([
        { id: 'job-001', updatedAt: new Date('2026-08-01T12:00:00Z') },
      ]),
    },
  },
}));

import sitemapRoutesRouter from './sitemapRoutes.js';

describe('Sitemap Routes API', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use('/', sitemapRoutesRouter);
  });

  describe('GET /sitemap.xml', () => {
    it('returns XML sitemap with valid xml structure and content-type', async () => {
      const res = await request(app).get('/sitemap.xml');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('xml');
      expect(res.text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(res.text).toContain('<urlset');
      expect(res.text).toContain('https://whitecaves.ae/properties/prop-001');
      expect(res.text).toContain('https://whitecaves.ae/careers/job-001');
      expect(res.text).toContain('https://whitecaves.ae/about');
    });
  });
});
