/**
 * Landlord Portal API Integration Tests
 * ──────────────────────────────────────
 * Tests landlord overview stats, owned property portfolios, lease mappings,
 * tenant contact resolution, maintenance requests, and financial breakdowns.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { errorHandler } from '../middleware/errorHandler.js';

const { mockOwnedProperty } = vi.hoisted(() => ({
  mockOwnedProperty: {
    id: 'prop-landlord-001',
    title: 'Downtown Dubai Luxury Apartment',
    location: 'Downtown Dubai, Burj Crown',
    type: 'apartment',
    status: 'available',
    price: 140000,
    currency: 'AED',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1250,
    images: [],
    createdAt: new Date().toISOString(),
    leases: [
      {
        id: 'lease-001',
        monthlyRent: 11500,
        currency: 'AED',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        tenant: { id: 'usr-t1', name: 'Tariq Mansoor', email: 'tariq@example.com', phone: '+971501112233' },
      },
    ],
  },
}));

vi.mock('../database.js', () => ({
  prisma: {
    property: {
      count: vi.fn().mockResolvedValue(5),
      findMany: vi.fn().mockResolvedValue([mockOwnedProperty]),
      create: vi.fn().mockImplementation(({ data }: { data: any }) =>
        Promise.resolve({ id: 'prop-new-001', ...data, createdAt: new Date().toISOString() })
      ),
    },
    lease: {
      count: vi.fn().mockResolvedValue(4),
      findMany: vi.fn().mockResolvedValue([
        { monthlyRent: 11500, currency: 'AED' },
        { monthlyRent: 15000, currency: 'AED' },
      ]),
    },
    maintenance: {
      count: vi.fn().mockResolvedValue(2),
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'maint-001',
          title: 'AC cooling issue',
          status: 'open',
          priority: 'high',
          property: { id: 'prop-landlord-001', title: 'Downtown Dubai Luxury Apartment' },
        },
      ]),
      update: vi.fn().mockImplementation(({ where, data }: { where: { id: string }; data: any }) =>
        Promise.resolve({ id: where.id, ...data })
      ),
    },
  },
}));

import landlordRouter from './landlord.js';

describe('Landlord Portal API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    // Attach mock landlord user
    app.use((req: any, _res: any, next: any) => {
      req.user = { id: 'landlord-101', role: 'landlord', email: 'landlord@whitecaves.ae' };
      next();
    });
    app.use('/api/landlord', landlordRouter);
    app.use(errorHandler);
  });

  describe('GET /api/landlord/stats', () => {
    it('returns portfolio KPI statistics and monthly income', async () => {
      const res = await request(app).get('/api/landlord/stats');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats.totalProperties).toBe(5);
      expect(res.body.stats.activeTenants).toBe(4);
      expect(res.body.stats.monthlyIncomeAED).toBe(26500);
    });
  });

  describe('GET /api/landlord/properties', () => {
    it('returns properties owned by the authenticated landlord with active lease data', async () => {
      const res = await request(app).get('/api/landlord/properties');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.properties)).toBe(true);
      expect(res.body.properties[0].tenantName).toBe('Tariq Mansoor');
      expect(res.body.properties[0].status).toBe('occupied');
    });
  });

  describe('POST /api/landlord/properties', () => {
    it('creates a new property in the landlord portfolio', async () => {
      const res = await request(app)
        .post('/api/landlord/properties')
        .send({
          title: 'Dubai Hills Estate Luxury Villa',
          description: 'Spacious 4BR family villa near park',
          price: 350000,
          type: 'villa',
          bedrooms: 4,
          bathrooms: 5,
          location: 'Dubai Hills Estate',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.property.title).toBe('Dubai Hills Estate Luxury Villa');
    });
  });

  describe('GET /api/landlord/maintenance', () => {
    it('lists maintenance requests for landlord properties', async () => {
      const res = await request(app).get('/api/landlord/maintenance');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.requests)).toBe(true);
      expect(res.body.requests[0].title).toBe('AC cooling issue');
    });
  });
});
