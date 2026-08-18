/**
 * Status API Integration Tests
 * ─────────────────────────────
 * Tests owner contact status workflows, follow-up lists, and property inventory status filters.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockOwnerStatus, mockPropertyStatus } = vi.hoisted(() => {
  const ownerStatus: any = {
    ownerId: { _id: 'owner-001', name: 'Tariq Al-Mansoor', email: 'tariq@example.com' },
    contactStatus: 'follow-up-due',
    lastContactDate: new Date().toISOString(),
    nextFollowUpDate: new Date(Date.now() + 86400000).toISOString(),
  };
  ownerStatus.save = vi.fn().mockResolvedValue(ownerStatus);
  ownerStatus.recordContact = vi.fn().mockResolvedValue(ownerStatus);
  ownerStatus.markAsInterested = vi.fn().mockResolvedValue(ownerStatus);
  ownerStatus.markAsNotInterested = vi.fn().mockResolvedValue(ownerStatus);

  const propStatus: any = {
    propertyId: { _id: 'prop-001', pNumber: 'P-1001', area: 'Palm Jumeirah', project: 'Palm Views' },
    currentStatus: 'available',
    lastStatusUpdate: new Date().toISOString(),
  };

  return {
    mockOwnerStatus: ownerStatus,
    mockPropertyStatus: propStatus,
  };
});

const createPopulateChain = (result: any) => ({
  populate: vi.fn().mockImplementation(() => createPopulateChain(result)),
  sort: vi.fn().mockImplementation(() => createPopulateChain(result)),
  limit: vi.fn().mockImplementation(() => createPopulateChain(result)),
  then: (resolve: any) => resolve(result),
  exec: vi.fn().mockResolvedValue(result),
});

vi.mock('../models/OwnerContactStatus.js', () => {
  const MockModel: any = function (data: any) {
    return {
      ...mockOwnerStatus,
      ...data,
    };
  };

  MockModel.find = vi.fn().mockImplementation(() => createPopulateChain([mockOwnerStatus]));
  MockModel.findOne = vi.fn().mockImplementation(({ ownerId }: { ownerId: string }) => {
    if (ownerId === 'owner-001') {
      return Promise.resolve(mockOwnerStatus);
    }
    return Promise.resolve(null);
  });

  return { default: MockModel };
});

vi.mock('../models/PropertyStatus.js', () => {
  const MockModel: any = function (data: any) {
    return {
      ...mockPropertyStatus,
      ...data,
    };
  };

  MockModel.find = vi.fn().mockImplementation(() => createPopulateChain([mockPropertyStatus]));

  return { default: MockModel };
});

vi.mock('../models/ContactHistory.js', () => ({
  default: {
    create: vi.fn().mockResolvedValue({ id: 'ch-001' }),
  },
}));

import statusRouter from './status.js';

describe('Status API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/status', statusRouter);
  });

  describe('GET /api/status/owners/contact-statuses', () => {
    it('returns all owner contact statuses', async () => {
      const res = await request(app).get('/api/status/owners/contact-statuses');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].contactStatus).toBe('follow-up-due');
    });
  });

  describe('GET /api/status/owners/follow-up-list', () => {
    it('returns follow-up list with status filter', async () => {
      const res = await request(app).get('/api/status/owners/follow-up-list?status=follow-up-due&limit=10');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('PUT /api/status/owners/:ownerId/contact-status', () => {
    it('updates contact status for an owner', async () => {
      const res = await request(app)
        .put('/api/status/owners/owner-001/contact-status')
        .send({ contactStatus: 'contacted' });

      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/status/owners/:ownerId/record-contact', () => {
    it('records a contact attempt with outcome and notes', async () => {
      const res = await request(app)
        .post('/api/status/owners/owner-001/record-contact')
        .send({
          type: 'phone_call',
          outcome: 'interested',
          notes: 'Owner interested in listing 3-bed apartment in Downtown',
          nextFollowUp: new Date(Date.now() + 172800000).toISOString(),
        });

      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/status/owners/:ownerId/mark-interested', () => {
    it('marks owner as interested in leasing/selling', async () => {
      const res = await request(app).post('/api/status/owners/owner-001/mark-interested');

      expect(res.status).toBe(200);
    });
  });

  describe('POST /api/status/owners/:ownerId/mark-not-interested', () => {
    it('marks owner as not interested with reason', async () => {
      const res = await request(app)
        .post('/api/status/owners/owner-001/mark-not-interested')
        .send({ reason: 'Property currently occupied under multi-year contract' });

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/status/inventory/statuses', () => {
    it('returns property inventory status list', async () => {
      const res = await request(app).get('/api/status/inventory/statuses');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].currentStatus).toBe('available');
    });
  });
});
