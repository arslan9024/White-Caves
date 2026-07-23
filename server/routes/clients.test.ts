/**
 * Clients Routes — Unit Tests
 * Tests /api/clients endpoints: list, single, create, update, delete,
 * convert-lead, property links, communication logs
 * All Prisma calls are mocked — no database needed.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  const makeClient = (overrides = {}) => ({
    id: 'client-aabbccddee11223344556677',
    name: 'Ahmed Al-Rashid',
    email: 'ahmed@example.com',
    phone: '+971501234567',
    company: 'Global LLC',
    category: 'buyer',
    status: 'active',
    type: 'individual',
    nationality: 'UAE',
    totalValue: 2000000,
    dealsCount: 1,
    tags: [],
    notes: null,
    assignedToId: null,
    convertedFromLeadId: null,
    lastContact: null,
    createdAt: new Date('2026-01-01T10:00:00Z'),
    clientProperties: [],
    communications: [],
    _count: { communications: 0, clientProperties: 0 },
    ...overrides,
  });

  const makeLead = (overrides = {}) => ({
    id: 'lead-aabbccddee11223344556688',
    name: 'Lead Person',
    email: 'lead@example.com',
    phone: '+97150000000',
    company: null,
    tags: [],
    notes: null,
    budget: 1500000,
    propertyId: null,
    assignedToId: null,
    lastContact: null,
    ...overrides,
  });

  return {
    mockPrisma: {
      client: {
        findMany: fn().mockResolvedValue([makeClient()]),
        findUnique: fn().mockResolvedValue(makeClient()),
        findFirst: fn().mockResolvedValue(null),
        count: fn().mockResolvedValue(1),
        create: fn().mockResolvedValue(makeClient()),
        update: fn().mockResolvedValue(makeClient({ name: 'Updated Name' })),
        delete: fn().mockResolvedValue({}),
      },
      lead: {
        findUnique: fn().mockResolvedValue(makeLead()),
        update: fn().mockResolvedValue({}),
      },
      clientProperty: {
        findUnique: fn().mockResolvedValue(null),
        findMany: fn().mockResolvedValue([]),
        count: fn().mockResolvedValue(0),
        create: fn().mockResolvedValue({ id: 'cp-1', clientId: 'client-1', propertyId: 'prop-1' }),
        update: fn().mockResolvedValue({}),
        delete: fn().mockResolvedValue({}),
        deleteMany: fn().mockResolvedValue({ count: 0 }),
      },
      communication: {
        findMany: fn().mockResolvedValue([]),
        count: fn().mockResolvedValue(0),
        create: fn().mockResolvedValue({
          id: 'comm-1',
          clientId: 'client-1',
          type: 'call',
          direction: 'outbound',
          subject: null,
          body: null,
          duration: null,
          outcome: null,
          createdById: 'user-1',
        }),
        deleteMany: fn().mockResolvedValue({ count: 0 }),
      },
      property: {
        findUnique: fn().mockResolvedValue({ id: 'prop-1', title: 'Test Property' }),
      },
      $transaction: fn().mockImplementation((ops: unknown[]) => Promise.all(ops)),
    },
    makeClient,
    makeLead,
  };
});

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../middleware/errorHandler', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  asyncHandler: (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));
vi.mock('../middleware/rbac', () => ({
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
}));
vi.mock('../config/pagination', () => ({
  parsePagination: ({ page, limit }: { page?: string; limit?: string }) => ({
    page: Math.max(1, parseInt(page || '1') || 1),
    limit: Math.min(100, Math.max(1, parseInt(limit || '20') || 20)),
    skip: 0,
  }),
}));

import clientsRoutes from './clients.js';

// ── Test app factory ─────────────────────────────────────────────────
function createApp(role = 'owner', userId = 'user-1') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: userId, email: 'agent@whitecaves.ae', role };
    next();
  });
  app.use('/api/clients', clientsRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const VALID_CLIENT_ID = 'aabbccddee11223344556677';
const VALID_LEAD_ID = 'aabbccddee11223344556688';
const VALID_PROP_ID = 'aabbccddee11223344556699';

// ═════════════════════════════════════════════════════════════════════

describe('Clients Routes — /api/clients', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── GET / ────────────────────────────────────────────────────────
  describe('GET /api/clients', () => {
    it('returns a paginated client list', async () => {
      const res = await request(createApp()).get('/api/clients');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toHaveProperty('total');
    });

    it('passes status filter to prisma', async () => {
      mockPrisma.client.findMany.mockResolvedValueOnce([]);
      mockPrisma.client.count.mockResolvedValueOnce(0);

      await request(createApp()).get('/api/clients?status=active');
      const where = mockPrisma.client.findMany.mock.calls[0][0].where;
      expect(where.status).toBe('active');
    });

    it('ignores status=all', async () => {
      mockPrisma.client.findMany.mockResolvedValueOnce([]);
      mockPrisma.client.count.mockResolvedValueOnce(0);

      await request(createApp()).get('/api/clients?status=all');
      const where = mockPrisma.client.findMany.mock.calls[0][0].where;
      expect(where.status).toBeUndefined();
    });

    it('applies search OR filter', async () => {
      mockPrisma.client.findMany.mockResolvedValueOnce([]);
      mockPrisma.client.count.mockResolvedValueOnce(0);

      await request(createApp()).get('/api/clients?search=ahmed');
      const where = mockPrisma.client.findMany.mock.calls[0][0].where;
      expect(where.OR).toBeDefined();
      expect(where.OR).toHaveLength(4);
    });

    it('sanitizes invalid sortBy to createdAt', async () => {
      mockPrisma.client.findMany.mockResolvedValueOnce([]);
      mockPrisma.client.count.mockResolvedValueOnce(0);

      await request(createApp()).get('/api/clients?sortBy=__proto__');
      const orderBy = mockPrisma.client.findMany.mock.calls[0][0].orderBy;
      expect(orderBy).toHaveProperty('createdAt');
    });
  });

  // ── GET /:id ─────────────────────────────────────────────────────
  describe('GET /api/clients/:id', () => {
    it('returns a single client', async () => {
      const res = await request(createApp()).get(`/api/clients/${VALID_CLIENT_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
    });

    it('returns 404 when client not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp()).get(`/api/clients/${VALID_CLIENT_ID}`);
      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/not found/i);
    });
  });

  // ── POST / ───────────────────────────────────────────────────────
  describe('POST /api/clients', () => {
    it('creates a client successfully', async () => {
      const res = await request(createApp())
        .post('/api/clients')
        .send({ name: 'New Client', email: 'new@example.com', category: 'buyer' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
    });

    it('returns 400 when name is missing', async () => {
      const res = await request(createApp())
        .post('/api/clients')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/name/i);
    });

    it('returns 400 for invalid category', async () => {
      const res = await request(createApp())
        .post('/api/clients')
        .send({ name: 'Test', category: 'invalid_cat' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/category/i);
    });

    it('returns 400 for invalid status', async () => {
      const res = await request(createApp())
        .post('/api/clients')
        .send({ name: 'Test', status: 'banned' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/status/i);
    });

    it('returns 400 for invalid type', async () => {
      const res = await request(createApp())
        .post('/api/clients')
        .send({ name: 'Test', type: 'alien' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/type/i);
    });

    it('defaults category to buyer and status to active', async () => {
      await request(createApp()).post('/api/clients').send({ name: 'Plain User' });

      const createCall = mockPrisma.client.create.mock.calls[0][0];
      expect(createCall.data.category).toBe('buyer');
      expect(createCall.data.status).toBe('active');
    });
  });

  // ── PATCH /:id ───────────────────────────────────────────────────
  describe('PATCH /api/clients/:id', () => {
    it('updates a client', async () => {
      const res = await request(createApp())
        .patch(`/api/clients/${VALID_CLIENT_ID}`)
        .send({ name: 'Updated Name' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 404 when client not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp())
        .patch(`/api/clients/${VALID_CLIENT_ID}`)
        .send({ name: 'Updated' });

      expect(res.status).toBe(404);
    });

    it('returns 400 for invalid category in update', async () => {
      const res = await request(createApp())
        .patch(`/api/clients/${VALID_CLIENT_ID}`)
        .send({ category: 'not_valid' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/category/i);
    });
  });

  // ── DELETE /:id ──────────────────────────────────────────────────
  describe('DELETE /api/clients/:id', () => {
    it('deletes a client successfully', async () => {
      const res = await request(createApp()).delete(`/api/clients/${VALID_CLIENT_ID}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 404 when client not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp()).delete(`/api/clients/${VALID_CLIENT_ID}`);
      expect(res.status).toBe(404);
    });
  });

  // ── POST /convert-lead/:leadId ───────────────────────────────────
  describe('POST /api/clients/convert-lead/:leadId', () => {
    it('converts a lead to a client', async () => {
      const res = await request(createApp())
        .post(`/api/clients/convert-lead/${VALID_LEAD_ID}`)
        .send({ category: 'buyer', type: 'individual' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('returns 404 when lead not found', async () => {
      mockPrisma.lead.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp())
        .post(`/api/clients/convert-lead/${VALID_LEAD_ID}`)
        .send({});

      expect(res.status).toBe(404);
      expect(res.body.error).toMatch(/lead not found/i);
    });

    it('returns 409 when lead already converted', async () => {
      mockPrisma.client.findFirst.mockResolvedValueOnce({ id: 'existing-client' });
      const res = await request(createApp())
        .post(`/api/clients/convert-lead/${VALID_LEAD_ID}`)
        .send({});

      expect(res.status).toBe(409);
      expect(res.body.error).toMatch(/already been converted/i);
    });

    it('updates lead status to won after conversion', async () => {
      await request(createApp()).post(`/api/clients/convert-lead/${VALID_LEAD_ID}`).send({});

      const updateCall = mockPrisma.lead.update.mock.calls[0][0];
      expect(updateCall.data.status).toBe('won');
    });
  });

  // ── GET /:id/communications ──────────────────────────────────────
  describe('GET /api/clients/:id/communications', () => {
    it('returns communication logs for a client', async () => {
      const res = await request(createApp()).get(`/api/clients/${VALID_CLIENT_ID}/communications`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('returns 404 when client not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp()).get(`/api/clients/${VALID_CLIENT_ID}/communications`);

      expect(res.status).toBe(404);
    });
  });

  // ── POST /:id/communications ─────────────────────────────────────
  describe('POST /api/clients/:id/communications', () => {
    it('creates a communication log entry', async () => {
      const res = await request(createApp())
        .post(`/api/clients/${VALID_CLIENT_ID}/communications`)
        .send({ type: 'call', direction: 'outbound', subject: 'Follow up' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('returns 404 when client not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp())
        .post(`/api/clients/${VALID_CLIENT_ID}/communications`)
        .send({ type: 'call' });

      expect(res.status).toBe(404);
    });

    it('returns 400 for invalid communication type', async () => {
      const res = await request(createApp())
        .post(`/api/clients/${VALID_CLIENT_ID}/communications`)
        .send({ type: 'pigeon_mail' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/type/i);
    });

    it('returns 400 for invalid direction', async () => {
      const res = await request(createApp())
        .post(`/api/clients/${VALID_CLIENT_ID}/communications`)
        .send({ type: 'call', direction: 'sideways' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/direction/i);
    });

    it('defaults type to note and direction to outbound', async () => {
      await request(createApp()).post(`/api/clients/${VALID_CLIENT_ID}/communications`).send({});

      const createCall = mockPrisma.communication.create.mock.calls[0][0];
      expect(createCall.data.type).toBe('note');
      expect(createCall.data.direction).toBe('outbound');
    });
  });

  // ── POST /:id/properties ─────────────────────────────────────────
  describe('POST /api/clients/:id/properties', () => {
    it('links a property to a client', async () => {
      const res = await request(createApp())
        .post(`/api/clients/${VALID_CLIENT_ID}/properties`)
        .send({ propertyId: VALID_PROP_ID, relationship: 'interested' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('returns 404 when client not found', async () => {
      mockPrisma.client.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp())
        .post(`/api/clients/${VALID_CLIENT_ID}/properties`)
        .send({ propertyId: VALID_PROP_ID });

      expect(res.status).toBe(404);
    });

    it('returns 400 when propertyId is missing', async () => {
      const res = await request(createApp())
        .post(`/api/clients/${VALID_CLIENT_ID}/properties`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/propertyId/i);
    });

    it('returns 409 when property is already linked', async () => {
      mockPrisma.clientProperty.findUnique.mockResolvedValueOnce({ id: 'cp-existing' });
      const res = await request(createApp())
        .post(`/api/clients/${VALID_CLIENT_ID}/properties`)
        .send({ propertyId: VALID_PROP_ID });

      expect(res.status).toBe(409);
    });

    it('returns 400 for invalid relationship type', async () => {
      const res = await request(createApp())
        .post(`/api/clients/${VALID_CLIENT_ID}/properties`)
        .send({ propertyId: VALID_PROP_ID, relationship: 'frenemy' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/relationship/i);
    });
  });
});
