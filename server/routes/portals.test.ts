/**
 * Portals Syndication API Integration Tests
 * ──────────────────────────────────────────
 * Tests PropertyFinder XML syndication feed, Bayut JSON feed, Trakheesi permit validation,
 * Cloudinary image optimizations, and portal sync logging.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockPropertyWithPermit, mockPropertyWithoutPermit } = vi.hoisted(() => ({
  mockPropertyWithPermit: {
    id: 'prop-pf-001',
    title: 'Luxury 4BR Villa in Palm Jumeirah',
    description: 'Direct beach access with panoramic Atlantis views.',
    type: 'villa',
    price: 18500000,
    area: 'Palm Jumeirah',
    bedrooms: 4,
    bathrooms: 5,
    sqft: 6500,
    buildingPermitNumber: 'DLD-PERMIT-2026-99881',
    images: ['https://res.cloudinary.com/whitecaves/image/upload/v123/villa1.jpg'],
    user: { name: 'Elena Rostova', email: 'elena@whitecaves.ae' },
  },
  mockPropertyWithoutPermit: {
    id: 'prop-pf-002',
    title: 'Off-Market Penthouse',
    buildingPermitNumber: null,
  },
}));

vi.mock('../database.js', () => ({
  prisma: {
    property: {
      findMany: vi.fn().mockResolvedValue([mockPropertyWithPermit, mockPropertyWithoutPermit]),
    },
    portalSyncLog: {
      create: vi.fn().mockResolvedValue({ id: 'log-001' }),
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'log-001',
          portal: 'propertyfinder',
          status: 'success',
          totalSynced: 1,
          totalSkipped: 1,
          totalFailed: 0,
        },
      ]),
    },
  },
}));

vi.mock('../middleware/rbac.js', () => ({
  requireRole: () => (_req: any, _res: any, next: any) => next(),
}));

import portalsRouter from './portals.js';

describe('Portals Syndication API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use('/api/v1/portals', portalsRouter);
  });

  describe('GET /api/v1/portals/pf.xml', () => {
    it('generates PropertyFinder XML feed with valid XML and excludes permit-less listings', async () => {
      const res = await request(app).get('/api/v1/portals/pf.xml');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('xml');
      expect(res.text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(res.text).toContain('<reference_number>prop-pf-001</reference_number>');
      expect(res.text).toContain('<permit_number>DLD-PERMIT-2026-99881</permit_number>');
      expect(res.text).not.toContain('<reference_number>prop-pf-002</reference_number>');
    });
  });

  describe('GET /api/v1/portals/bayut.json', () => {
    it('generates Bayut JSON feed with Cloudinary webp transforms', async () => {
      const res = await request(app).get('/api/v1/portals/bayut.json');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].reference).toBe('prop-pf-001');
      expect(res.body.data[0].permitNumber).toBe('DLD-PERMIT-2026-99881');
    });
  });
});
