/**
 * Sitemap API Integration Tests
 * ──────────────────────────────
 * Tests XML sitemap generation from sitemap.ts.
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
  },
}));

import sitemapRouter from './sitemap.js';

describe('Sitemap API', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use('/', sitemapRouter);
  });

  describe('GET /sitemap.xml', () => {
    it('returns XML sitemap with valid xml structure', async () => {
      const res = await request(app).get('/sitemap.xml');

      expect(res.status).toBe(200);
      expect(res.text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(res.text).toContain('<urlset');
      expect(res.text).toContain('/property/prop-001');
    });
  });
});
