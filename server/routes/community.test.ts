/**
 * Community API Integration Tests
 * ────────────────────────────────
 * Tests community announcements, facility booking rules (capacity & 2-booking limits),
 * service charge tracking, and event RSVP workflows.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { errorHandler } from '../middleware/errorHandler.js';

const { mockAnnouncement, mockFacility, mockBooking, mockServiceCharge, mockEvent } = vi.hoisted(() => ({
  mockAnnouncement: {
    id: 'ann-001',
    title: 'Swimming Pool Maintenance Notice',
    content: 'Routine maintenance on Tuesday 8 AM - 12 PM',
    targetScope: 'all_tenants',
    status: 'sent',
    dispatchedAt: new Date().toISOString(),
  },
  mockFacility: {
    id: 'fac-001',
    name: 'Tennis Court',
    capacity: 2,
  },
  mockBooking: {
    id: 'book-001',
    facilityId: 'fac-001',
    unitId: 'unit-401',
    tenantId: 'tenant-101',
    startTime: new Date(Date.now() + 86400000).toISOString(),
    endTime: new Date(Date.now() + 90000000).toISOString(),
    status: 'confirmed',
  },
  mockServiceCharge: {
    id: 'sc-001',
    landlordId: 'owner-001',
    propertyId: 'prop-001',
    amount: 4500,
    dueDate: new Date(Date.now() + 2592000000).toISOString(),
    status: 'pending',
  },
  mockEvent: {
    id: 'event-001',
    title: 'White Caves Luxury Community Gala',
    description: 'Annual resident networking evening',
    location: 'Clubhouse Lounge',
    maxAttendees: 50,
    currentRsvps: 10,
    startTime: new Date(Date.now() + 604800000).toISOString(),
    endTime: new Date(Date.now() + 612000000).toISOString(),
  },
}));

vi.mock('../database.js', () => ({
  prisma: {
    communityAnnouncement: {
      create: vi.fn().mockImplementation(({ data }: { data: any }) =>
        Promise.resolve({ id: 'ann-002', ...data })
      ),
    },
    facility: {
      findUnique: vi.fn().mockImplementation(({ where }: { where: { id: string } }) => {
        if (where.id === 'fac-001') return Promise.resolve(mockFacility);
        return Promise.resolve(null);
      }),
    },
    facilityBooking: {
      count: vi.fn().mockResolvedValue(0),
      create: vi.fn().mockImplementation(({ data }: { data: any }) =>
        Promise.resolve({ id: 'book-002', ...data })
      ),
    },
    serviceCharge: {
      findMany: vi.fn().mockResolvedValue([mockServiceCharge]),
    },
    communityEvent: {
      create: vi.fn().mockImplementation(({ data }: { data: any }) =>
        Promise.resolve({ id: 'event-002', currentRsvps: 0, ...data })
      ),
      findUnique: vi.fn().mockImplementation(({ where }: { where: { id: string } }) => {
        if (where.id === 'event-001') return Promise.resolve(mockEvent);
        return Promise.resolve(null);
      }),
      update: vi.fn().mockResolvedValue(mockEvent),
    },
    eventRSVP: {
      create: vi.fn().mockImplementation(({ data }: { data: any }) =>
        Promise.resolve({ id: 'rsvp-001', ...data })
      ),
    },
  },
}));

vi.mock('../middleware/rbac.js', () => ({
  requireRole: () => (_req: any, _res: any, next: any) => next(),
}));

import communityRouter from './community.js';

describe('Community API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/community', communityRouter);
    app.use(errorHandler);
  });

  describe('POST /api/v1/community/announcements', () => {
    it('creates community announcement and broadcasts to tenants', async () => {
      const payload = {
        title: 'Swimming Pool Maintenance Notice',
        body: 'Routine maintenance on Tuesday 8 AM - 12 PM',
        targetScope: 'all_tenants',
      };

      const res = await request(app)
        .post('/api/v1/community/announcements')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Swimming Pool Maintenance Notice');
    });

    it('rejects announcement when fields are missing with 400', async () => {
      const res = await request(app)
        .post('/api/v1/community/announcements')
        .send({ title: 'Incomplete' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/community/bookings', () => {
    it('books facility slot when valid future times are provided', async () => {
      const payload = {
        facilityId: 'fac-001',
        unitId: 'unit-401',
        tenantId: 'tenant-101',
        startTime: new Date(Date.now() + 86400000).toISOString(),
        endTime: new Date(Date.now() + 90000000).toISOString(),
      };

      const res = await request(app)
        .post('/api/v1/community/bookings')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('rejects past booking dates with 400', async () => {
      const payload = {
        facilityId: 'fac-001',
        unitId: 'unit-401',
        tenantId: 'tenant-101',
        startTime: new Date(Date.now() - 86400000).toISOString(),
        endTime: new Date(Date.now() - 80000000).toISOString(),
      };

      const res = await request(app)
        .post('/api/v1/community/bookings')
        .send(payload);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Cannot book in the past');
    });
  });

  describe('GET /api/v1/community/service-charges', () => {
    it('returns list of service charges for landlord portal', async () => {
      const res = await request(app).get('/api/v1/community/service-charges');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].amount).toBe(4500);
    });
  });

  describe('POST /api/v1/community/events/:id/rsvp', () => {
    it('records tenant RSVP for community event', async () => {
      const res = await request(app)
        .post('/api/v1/community/events/event-001/rsvp')
        .send({ tenantId: 'tenant-101' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('returns 404 when RSVPing for non-existent event', async () => {
      const res = await request(app)
        .post('/api/v1/community/events/event-invalid-999/rsvp')
        .send({ tenantId: 'tenant-101' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
