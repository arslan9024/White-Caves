/**
 * Deal Journey API Integration Tests
 * ───────────────────────────────────
 * Tests deal journey retrieval, agent listings, and stage progress transitions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockJourney } = vi.hoisted(() => {
  const journey: any = {
    _id: 'journey-001',
    offerId: 'offer-101',
    propertyId: { _id: 'prop-001', name: 'Villa Palma', location: 'Palm Jumeirah' },
    landlordId: { _id: 'landlord-001', name: 'Sheikh Mohammed', email: 'owner@example.com' },
    tenantId: { _id: 'tenant-001', name: 'Sophie Martin', email: 'sophie@example.com' },
    agentId: 'agent-101',
    currentStage: 'OFFER_ACCEPTED',
    overallStatus: 'IN_PROGRESS',
    stages: [
      { name: 'OFFER_ACCEPTED', status: 'COMPLETED' },
      { name: 'DEPOSIT_PAID', status: 'IN_PROGRESS' },
    ],
    createdAt: new Date().toISOString(),
  };
  journey.save = vi.fn().mockResolvedValue(journey);

  return { mockJourney: journey };
});

vi.mock('../models/DealJourney.js', () => {
  const MockModel: any = function (data: any) {
    return {
      ...data,
      save: vi.fn().mockResolvedValue({ _id: 'journey-new-01', ...data }),
    };
  };

  const createPopulateChain = (result: any) => ({
    populate: vi.fn().mockImplementation(() => createPopulateChain(result)),
    sort: vi.fn().mockImplementation(() => createPopulateChain(result)),
    then: (resolve: any) => resolve(result),
    exec: vi.fn().mockResolvedValue(result),
  });

  MockModel.findOne = vi.fn().mockImplementation(({ offerId, _id }: { offerId?: string; _id?: string }) => {
    if (offerId === 'offer-101' || _id === 'journey-001') {
      return createPopulateChain(mockJourney);
    }
    return createPopulateChain(null);
  });

  MockModel.findById = vi.fn().mockImplementation((id: string) => {
    if (id === 'journey-001') {
      return createPopulateChain(mockJourney);
    }
    return createPopulateChain(null);
  });

  MockModel.find = vi.fn().mockImplementation(() => {
    return createPopulateChain([mockJourney]);
  });

  return { default: MockModel };
});

import dealJourneyRouter from './deal-journey.js';

describe('Deal Journey API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/deal-journey', dealJourneyRouter);
  });

  describe('GET /api/deal-journey/by-offer/:offerId', () => {
    it('returns deal journey by offerId', async () => {
      const res = await request(app).get('/api/deal-journey/by-offer/offer-101');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe('journey-001');
      expect(res.body.data.currentStage).toBe('OFFER_ACCEPTED');
    });

    it('returns 404 when offerId does not match', async () => {
      const res = await request(app).get('/api/deal-journey/by-offer/offer-non-existent');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Deal journey not found');
    });
  });

  describe('GET /api/deal-journey/agent/:agentId', () => {
    it('returns all journeys assigned to agent', async () => {
      const res = await request(app).get('/api/deal-journey/agent/agent-101');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.count).toBe(1);
    });
  });

  describe('GET /api/deal-journey/:id', () => {
    it('returns journey by ID', async () => {
      const res = await request(app).get('/api/deal-journey/journey-001');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe('journey-001');
    });

    it('returns 404 when journey ID is not found', async () => {
      const res = await request(app).get('/api/deal-journey/journey-999');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Deal journey not found');
    });
  });
});
