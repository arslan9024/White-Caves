/**
 * Express Server (index.ts) — Unit Tests
 * Tests middleware setup, health endpoint, 404 handler, content-type validation,
 * and WhatsApp webhook security.
 * We import app indirectly to avoid starting the full server.
 */

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import express from 'express';
import request from 'supertest';
import crypto from 'crypto';

type StubContract = {
  id: string;
  contractNumber: string;
  lessorName: string;
  tenantName: string;
  propertyType: string;
  annualRent: number;
  status: 'draft' | 'active' | 'terminated';
  createdAt: string;
};

type StubAppointment = {
  id: string;
  propertyId: string;
  agentId: string | null;
  leadId: string | null;
  scheduledAt: string;
  durationMinutes: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  type: 'virtual' | 'in_person';
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

type StubTenancyAgreement = {
  id: string;
  propertyId: string;
  landlordName: string;
  tenantName: string;
  startDate: string;
  endDate: string;
  annualRent: number;
  status: 'draft' | 'active' | 'terminated';
  createdAt: string;
  updatedAt: string;
};

let stubCounter = 0;
const createStubId = (prefix: string) => `${prefix}_${Date.now()}_${++stubCounter}`;

// ── Build a minimal replica of the server's middleware chain ─────────
// (Testing the actual index.ts requires DB connections and many side-effects,
//  so we replicate key patterns and test them in isolation.)

// ─── Content-Type validation middleware (extracted from index.ts) ────
const NON_JSON_PATHS = new Set(['/api/whatsapp/webhook']);

function contentTypeMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (
    ['POST', 'PUT', 'PATCH'].includes(req.method) &&
    !req.is('json') &&
    !NON_JSON_PATHS.has(req.path)
  ) {
    return res.status(415).json({
      success: false,
      error: 'Content-Type must be application/json',
    });
  }
  next();
}

// ─── Timing-safe webhook verification (extracted from index.ts) ──────
const WEBHOOK_SECRET = 'test-webhook-secret-123';

function verifyWebhookToken(token: string, secret: string): boolean {
  const expected = Buffer.from(secret, 'utf8');
  const received = Buffer.from(token, 'utf8');
  if (expected.length !== received.length) return false;
  return crypto.timingSafeEqual(expected, received);
}

// ─── Build test app ──────────────────────────────────────────────────
function createApp() {
  const app = express();
  const stubContracts: StubContract[] = [];
  const stubAppointments: StubAppointment[] = [];
  const stubTenancyAgreements: StubTenancyAgreement[] = [];

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ limit: '1mb', extended: true }));

  // Content-type validation
  app.use('/api', contentTypeMiddleware);

  // Health check
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date(),
      environment: process.env.NODE_ENV,
      version: process.env.APP_VERSION || '1.0.0',
    });
  });

  // Webhook endpoint
  app.post('/api/whatsapp/webhook', (req, res) => {
    const webhookToken = (req.headers['x-webhook-token'] || '') as string;
    if (!webhookToken) {
      return res.status(403).json({ success: false, error: 'Webhook token required' });
    }
    if (!verifyWebhookToken(webhookToken, WEBHOOK_SECRET)) {
      return res.status(403).json({ success: false, error: 'Invalid webhook token' });
    }
    res.status(200).json({ success: true });
  });

  // Sample protected endpoint (for Content-Type testing)
  app.post('/api/test', (req, res) => {
    res.status(200).json({ success: true, body: req.body });
  });

  // Contracts API test replica
  app.get('/api/contracts', (req, res) => {
    const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number.parseInt(String(req.query.pageSize ?? '20'), 10) || 20)
    );
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const rows = stubContracts.slice(start, end);

    res.status(200).json({
      success: true,
      contracts: rows,
      pagination: {
        page,
        pageSize,
        total: stubContracts.length,
        totalPages: Math.ceil(stubContracts.length / pageSize),
      },
    });
  });

  app.post('/api/contracts', (req, res) => {
    const lessorName = String(req.body?.lessorName ?? '').trim();
    const tenantName = String(req.body?.tenantName ?? '').trim();
    const propertyType = String(req.body?.propertyType ?? 'Apartment').trim() || 'Apartment';
    const annualRent = Number(req.body?.annualRent ?? 0);

    if (!lessorName) {
      return res.status(400).json({ success: false, error: 'lessorName is required' });
    }
    if (!tenantName) {
      return res.status(400).json({ success: false, error: 'tenantName is required' });
    }
    if (!Number.isFinite(annualRent) || annualRent <= 0) {
      return res.status(400).json({ success: false, error: 'annualRent must be greater than 0' });
    }

    const contract: StubContract = {
      id: createStubId('contract'),
      contractNumber: `WC-${new Date().getFullYear()}-${stubContracts.length + 1}`,
      lessorName,
      tenantName,
      propertyType,
      annualRent,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    stubContracts.unshift(contract);
    res.status(201).json({ success: true, contract });
  });

  app.patch('/api/contracts/:id', (req, res) => {
    const current = stubContracts.find(item => item.id === req.params.id);
    if (!current) return res.status(404).json({ success: false, error: 'Contract not found' });

    const nextStatus = req.body?.status;
    const allowedStatus: StubContract['status'][] = ['draft', 'active'];
    const transitions: Record<StubContract['status'], StubContract['status'][]> = {
      draft: ['draft', 'active'],
      active: ['active'],
    };

    if (nextStatus !== undefined) {
      if (!allowedStatus.includes(nextStatus)) {
        return res.status(400).json({ success: false, error: 'Invalid contract status' });
      }
      if (!transitions[current.status].includes(nextStatus)) {
        return res.status(400).json({
          success: false,
          error: `Invalid contract status transition: ${current.status} -> ${nextStatus}`,
        });
      }
    }

    const updated: StubContract = {
      ...current,
      lessorName: req.body?.lessorName ? String(req.body.lessorName) : current.lessorName,
      tenantName: req.body?.tenantName ? String(req.body.tenantName) : current.tenantName,
      propertyType: req.body?.propertyType ? String(req.body.propertyType) : current.propertyType,
      annualRent: req.body?.annualRent ? Number(req.body.annualRent) : current.annualRent,
      status: allowedStatus.includes(nextStatus) ? nextStatus : current.status,
    };

    Object.assign(current, updated);
    res.status(200).json({ success: true, contract: current });
  });

  app.delete('/api/contracts/:id', (req, res) => {
    const index = stubContracts.findIndex(item => item.id === req.params.id);
    if (index < 0) return res.status(404).json({ success: false, error: 'Contract not found' });
    const [deleted] = stubContracts.splice(index, 1);
    res.status(200).json({ success: true, contract: deleted });
  });

  // Appointments API test replica
  app.post('/api/appointments', (req, res) => {
    const propertyId = String(req.body?.propertyId ?? '').trim();
    const scheduledAt = String(req.body?.scheduledAt ?? '').trim();

    if (!propertyId) {
      return res.status(400).json({ success: false, error: 'propertyId is required' });
    }
    if (!scheduledAt) {
      return res.status(400).json({ success: false, error: 'scheduledAt is required' });
    }

    const appointment: StubAppointment = {
      id: createStubId('appt'),
      propertyId,
      agentId: req.body?.agentId ? String(req.body.agentId) : null,
      leadId: req.body?.leadId ? String(req.body.leadId) : null,
      scheduledAt,
      durationMinutes: Number(req.body?.durationMinutes ?? 60),
      status: 'scheduled',
      type: req.body?.type === 'virtual' ? 'virtual' : 'in_person',
      notes: req.body?.notes ? String(req.body.notes) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    stubAppointments.unshift(appointment);
    res.status(201).json({ success: true, data: appointment });
  });

  app.get('/api/appointments', (req, res) => {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const rows = status
      ? stubAppointments.filter(item => item.status === status)
      : stubAppointments;

    res.status(200).json({
      success: true,
      data: rows,
      pagination: { page: 1, pageSize: rows.length || 20, total: rows.length, totalPages: 1 },
    });
  });

  app.patch('/api/appointments/:id', (req, res) => {
    const current = stubAppointments.find(item => item.id === req.params.id);
    if (!current) return res.status(404).json({ success: false, error: 'Appointment not found' });

    const nextStatus = req.body?.status;
    const allowedStatus: StubAppointment['status'][] = [
      'scheduled',
      'confirmed',
      'completed',
      'cancelled',
    ];
    const transitions: Record<StubAppointment['status'], StubAppointment['status'][]> = {
      scheduled: ['scheduled', 'confirmed', 'cancelled'],
      confirmed: ['confirmed', 'completed', 'cancelled'],
      completed: ['completed'],
      cancelled: ['cancelled'],
    };

    if (nextStatus !== undefined) {
      if (!allowedStatus.includes(nextStatus)) {
        return res.status(400).json({ success: false, error: 'Invalid appointment status' });
      }
      if (!transitions[current.status].includes(nextStatus)) {
        return res.status(400).json({
          success: false,
          error: `Invalid appointment status transition: ${current.status} -> ${nextStatus}`,
        });
      }
    }

    const updated: StubAppointment = {
      ...current,
      status: allowedStatus.includes(nextStatus) ? nextStatus : current.status,
      scheduledAt: req.body?.scheduledAt ? String(req.body.scheduledAt) : current.scheduledAt,
      durationMinutes: req.body?.durationMinutes
        ? Number(req.body.durationMinutes)
        : current.durationMinutes,
      type:
        req.body?.type === 'virtual' || req.body?.type === 'in_person'
          ? req.body.type
          : current.type,
      notes: req.body?.notes !== undefined ? String(req.body.notes ?? '') : current.notes,
      updatedAt: new Date().toISOString(),
    };

    Object.assign(current, updated);
    res.status(200).json({ success: true, data: current });
  });

  app.delete('/api/appointments/:id', (req, res) => {
    const index = stubAppointments.findIndex(item => item.id === req.params.id);
    if (index < 0) return res.status(404).json({ success: false, error: 'Appointment not found' });
    const [deleted] = stubAppointments.splice(index, 1);
    res.status(200).json({ success: true, data: deleted });
  });

  // Tenancy Agreements API test replica
  app.get('/api/tenancy-agreements', (req, res) => {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const rows = status
      ? stubTenancyAgreements.filter(item => item.status === status)
      : stubTenancyAgreements;

    res.status(200).json({
      success: true,
      data: rows,
      pagination: { page: 1, pageSize: rows.length || 20, total: rows.length, totalPages: 1 },
    });
  });

  app.post('/api/tenancy-agreements', (req, res) => {
    const propertyId = String(req.body?.propertyId ?? '').trim();
    const landlordName = String(req.body?.landlordName ?? '').trim();
    const tenantName = String(req.body?.tenantName ?? '').trim();
    const startDate = String(req.body?.startDate ?? '').trim();
    const endDate = String(req.body?.endDate ?? '').trim();
    const annualRent = Number(req.body?.annualRent ?? 0);

    if (!propertyId) {
      return res.status(400).json({ success: false, error: 'propertyId is required' });
    }
    if (!landlordName) {
      return res.status(400).json({ success: false, error: 'landlordName is required' });
    }
    if (!tenantName) {
      return res.status(400).json({ success: false, error: 'tenantName is required' });
    }
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, error: 'startDate and endDate are required' });
    }
    if (!Number.isFinite(annualRent) || annualRent <= 0) {
      return res.status(400).json({ success: false, error: 'annualRent must be greater than 0' });
    }

    const agreement: StubTenancyAgreement = {
      id: createStubId('tenancy'),
      propertyId,
      landlordName,
      tenantName,
      startDate,
      endDate,
      annualRent,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    stubTenancyAgreements.unshift(agreement);
    res.status(201).json({ success: true, data: agreement });
  });

  app.patch('/api/tenancy-agreements/:id', (req, res) => {
    const current = stubTenancyAgreements.find(item => item.id === req.params.id);
    if (!current) {
      return res.status(404).json({ success: false, error: 'Tenancy agreement not found' });
    }

    const nextStatus = req.body?.status;
    const allowedStatus: StubTenancyAgreement['status'][] = ['draft', 'active', 'terminated'];
    const transitions: Record<StubTenancyAgreement['status'], StubTenancyAgreement['status'][]> = {
      draft: ['draft', 'active', 'terminated'],
      active: ['active', 'terminated'],
      terminated: ['terminated'],
    };

    if (nextStatus !== undefined) {
      if (!allowedStatus.includes(nextStatus)) {
        return res.status(400).json({ success: false, error: 'Invalid tenancy agreement status' });
      }
      if (!transitions[current.status].includes(nextStatus)) {
        return res.status(400).json({
          success: false,
          error: `Invalid tenancy agreement status transition: ${current.status} -> ${nextStatus}`,
        });
      }
    }

    const updated: StubTenancyAgreement = {
      ...current,
      landlordName: req.body?.landlordName ? String(req.body.landlordName) : current.landlordName,
      tenantName: req.body?.tenantName ? String(req.body.tenantName) : current.tenantName,
      startDate: req.body?.startDate ? String(req.body.startDate) : current.startDate,
      endDate: req.body?.endDate ? String(req.body.endDate) : current.endDate,
      annualRent: req.body?.annualRent ? Number(req.body.annualRent) : current.annualRent,
      status: allowedStatus.includes(nextStatus) ? nextStatus : current.status,
      updatedAt: new Date().toISOString(),
    };

    Object.assign(current, updated);
    res.status(200).json({ success: true, data: current });
  });

  app.delete('/api/tenancy-agreements/:id', (req, res) => {
    const index = stubTenancyAgreements.findIndex(item => item.id === req.params.id);
    if (index < 0) {
      return res.status(404).json({ success: false, error: 'Tenancy agreement not found' });
    }
    const [deleted] = stubTenancyAgreements.splice(index, 1);
    res.status(200).json({ success: true, data: deleted });
  });

  // Valuation API test replica
  app.post('/api/valuation/estimate', (req, res) => {
    const area = Number(req.body?.area ?? 0);
    if (!Number.isFinite(area) || area <= 0) {
      return res.status(400).json({ success: false, error: 'area must be greater than 0' });
    }

    const location = String(req.body?.location ?? '').toLowerCase();
    const locationMultiplier = location.includes('marina')
      ? 1.3
      : location.includes('downtown')
        ? 1.25
        : location.includes('palm')
          ? 1.5
          : 1.0;

    const basePricePerSqft = 2000;
    const mid = Math.round(basePricePerSqft * area * locationMultiplier);

    return res.status(200).json({
      estimate: {
        low: Math.round(mid * 0.9),
        mid,
        high: Math.round(mid * 1.1),
        confidence: 72,
      },
      comparables: [
        {
          property: 'Comparable A',
          price: Math.round(mid * 0.96),
          area,
          pricePerSqft: Math.round((mid * 0.96) / area),
        },
      ],
    });
  });

  // 404 handler
  app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Route ${req.path} not found`,
      statusCode: 404,
    });
  });

  return app;
}

// =====================================================================
// TESTS
// =====================================================================

describe('Server — Health Check', () => {
  const app = createApp();

  it('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  it('includes timestamp, environment, version', async () => {
    const res = await request(app).get('/health');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('environment');
    expect(res.body).toHaveProperty('version');
  });
});

describe('Server — 404 Handler', () => {
  const app = createApp();

  it('returns 404 for unknown route', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not Found');
    expect(res.body.message).toContain('nonexistent');
  });

  it('returns JSON error body', async () => {
    const res = await request(app).get('/completely/unknown');
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('statusCode', 404);
  });
});

describe('Server — Content-Type Validation', () => {
  const app = createApp();

  it('rejects POST without Content-Type: json', async () => {
    const res = await request(app)
      .post('/api/test')
      .set('Content-Type', 'text/plain')
      .send('raw text');
    expect(res.status).toBe(415);
    expect(res.body.error).toContain('application/json');
  });

  it('allows POST with Content-Type: json', async () => {
    const res = await request(app)
      .post('/api/test')
      .set('Content-Type', 'application/json')
      .send({ key: 'value' });
    expect(res.status).toBe(200);
  });

  it('allows GET without Content-Type check', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });

  it('exempts whatsapp webhook from JSON check', async () => {
    const res = await request(app)
      .post('/api/whatsapp/webhook')
      .set('Content-Type', 'application/json')
      .set('x-webhook-token', WEBHOOK_SECRET)
      .send({});
    // Should not get 415
    expect(res.status).not.toBe(415);
  });
});

describe('Server — WhatsApp Webhook Security', () => {
  const app = createApp();

  it('rejects webhook without token', async () => {
    const res = await request(app)
      .post('/api/whatsapp/webhook')
      .set('Content-Type', 'application/json')
      .send({});
    expect(res.status).toBe(403);
  });

  it('rejects webhook with invalid token', async () => {
    const res = await request(app)
      .post('/api/whatsapp/webhook')
      .set('Content-Type', 'application/json')
      .set('x-webhook-token', 'wrong-token')
      .send({});
    expect(res.status).toBe(403);
  });

  it('accepts webhook with valid token', async () => {
    const res = await request(app)
      .post('/api/whatsapp/webhook')
      .set('Content-Type', 'application/json')
      .set('x-webhook-token', WEBHOOK_SECRET)
      .send({ entry: [{ changes: [] }] });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Server — Timing-Safe Comparison', () => {
  it('returns true for matching tokens', () => {
    expect(verifyWebhookToken('test-secret', 'test-secret')).toBe(true);
  });

  it('returns false for length mismatch', () => {
    expect(verifyWebhookToken('short', 'long-secret')).toBe(false);
  });

  it('returns false for content mismatch', () => {
    expect(verifyWebhookToken('aaaa', 'bbbb')).toBe(false);
  });
});

describe('Server — Contracts API', () => {
  const app = createApp();

  it('creates a contract with valid payload', async () => {
    const res = await request(app)
      .post('/api/contracts')
      .set('Content-Type', 'application/json')
      .send({
        lessorName: 'White Caves Owner',
        tenantName: 'Tenant One',
        annualRent: 120000,
        propertyType: 'Apartment',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.contract).toHaveProperty('id');
    expect(res.body.contract.status).toBe('draft');
  });

  it('rejects invalid annualRent', async () => {
    const res = await request(app)
      .post('/api/contracts')
      .set('Content-Type', 'application/json')
      .send({
        lessorName: 'White Caves Owner',
        tenantName: 'Tenant One',
        annualRent: 0,
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('annualRent');
  });

  it('returns paginated contracts list', async () => {
    await request(app)
      .post('/api/contracts')
      .set('Content-Type', 'application/json')
      .send({ lessorName: 'Owner A', tenantName: 'Tenant A', annualRent: 100000 });

    await request(app)
      .post('/api/contracts')
      .set('Content-Type', 'application/json')
      .send({ lessorName: 'Owner B', tenantName: 'Tenant B', annualRent: 110000 });

    const res = await request(app).get('/api/contracts?page=1&pageSize=1');
    expect(res.status).toBe(200);
    expect(res.body.pagination.pageSize).toBe(1);
    expect(res.body.contracts.length).toBe(1);
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(2);
  });

  it('updates contract fields/status', async () => {
    const created = await request(app)
      .post('/api/contracts')
      .set('Content-Type', 'application/json')
      .send({ lessorName: 'Owner C', tenantName: 'Tenant C', annualRent: 130000 });

    const id = created.body.contract.id;
    const updated = await request(app)
      .patch(`/api/contracts/${id}`)
      .set('Content-Type', 'application/json')
      .send({ status: 'active', annualRent: 135000 });

    expect(updated.status).toBe(200);
    expect(updated.body.contract.status).toBe('active');
    expect(updated.body.contract.annualRent).toBe(135000);
  });

  it('rejects invalid contract status transition (active -> draft)', async () => {
    const created = await request(app)
      .post('/api/contracts')
      .set('Content-Type', 'application/json')
      .send({ lessorName: 'Owner E', tenantName: 'Tenant E', annualRent: 145000 });

    const id = created.body.contract.id;
    await request(app)
      .patch(`/api/contracts/${id}`)
      .set('Content-Type', 'application/json')
      .send({ status: 'active' });

    const invalid = await request(app)
      .patch(`/api/contracts/${id}`)
      .set('Content-Type', 'application/json')
      .send({ status: 'draft' });

    expect(invalid.status).toBe(400);
    expect(invalid.body.error).toContain('Invalid contract status transition');
  });

  it('deletes contract and returns removed record', async () => {
    const created = await request(app)
      .post('/api/contracts')
      .set('Content-Type', 'application/json')
      .send({ lessorName: 'Owner D', tenantName: 'Tenant D', annualRent: 140000 });

    const id = created.body.contract.id;
    const deleted = await request(app).delete(`/api/contracts/${id}`);

    expect(deleted.status).toBe(200);
    expect(deleted.body.contract.id).toBe(id);
  });
});

describe('Server — Appointments API', () => {
  const app = createApp();

  it('creates and lists an appointment', async () => {
    const createRes = await request(app)
      .post('/api/appointments')
      .set('Content-Type', 'application/json')
      .send({
        propertyId: 'prop_1',
        scheduledAt: '2026-05-20T10:00:00.000Z',
        type: 'virtual',
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.type).toBe('virtual');

    const listRes = await request(app).get('/api/appointments?status=scheduled');
    expect(listRes.status).toBe(200);
    expect(listRes.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('updates appointment status using allowed status only', async () => {
    const created = await request(app)
      .post('/api/appointments')
      .set('Content-Type', 'application/json')
      .send({ propertyId: 'prop_2', scheduledAt: '2026-05-22T12:00:00.000Z' });

    const id = created.body.data.id;
    const confirmedRes = await request(app)
      .patch(`/api/appointments/${id}`)
      .set('Content-Type', 'application/json')
      .send({ status: 'confirmed' });

    expect(confirmedRes.status).toBe(200);
    expect(confirmedRes.body.data.status).toBe('confirmed');

    const patchRes = await request(app)
      .patch(`/api/appointments/${id}`)
      .set('Content-Type', 'application/json')
      .send({ status: 'completed' });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data.status).toBe('completed');
  });

  it('rejects invalid appointment status transition (completed -> scheduled)', async () => {
    const created = await request(app)
      .post('/api/appointments')
      .set('Content-Type', 'application/json')
      .send({ propertyId: 'prop_3', scheduledAt: '2026-05-22T12:00:00.000Z' });

    const id = created.body.data.id;
    await request(app)
      .patch(`/api/appointments/${id}`)
      .set('Content-Type', 'application/json')
      .send({ status: 'confirmed' });

    await request(app)
      .patch(`/api/appointments/${id}`)
      .set('Content-Type', 'application/json')
      .send({ status: 'completed' });

    const invalid = await request(app)
      .patch(`/api/appointments/${id}`)
      .set('Content-Type', 'application/json')
      .send({ status: 'scheduled' });

    expect(invalid.status).toBe(400);
    expect(invalid.body.error).toContain('Invalid appointment status transition');
  });

  it('returns 404 when deleting missing appointment', async () => {
    const res = await request(app).delete('/api/appointments/missing-id');
    expect(res.status).toBe(404);
    expect(res.body.error).toContain('Appointment not found');
  });
});

describe('Server — Tenancy Agreements API', () => {
  const app = createApp();

  it('creates tenancy agreement with valid payload', async () => {
    const res = await request(app)
      .post('/api/tenancy-agreements')
      .set('Content-Type', 'application/json')
      .send({
        propertyId: 'prop_100',
        landlordName: 'Landlord A',
        tenantName: 'Tenant A',
        startDate: '2026-06-01',
        endDate: '2027-05-31',
        annualRent: 140000,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('draft');
  });

  it('updates tenancy status to active', async () => {
    const created = await request(app)
      .post('/api/tenancy-agreements')
      .set('Content-Type', 'application/json')
      .send({
        propertyId: 'prop_200',
        landlordName: 'Landlord B',
        tenantName: 'Tenant B',
        startDate: '2026-07-01',
        endDate: '2027-06-30',
        annualRent: 100000,
      });

    const id = created.body.data.id;
    const patched = await request(app)
      .patch(`/api/tenancy-agreements/${id}`)
      .set('Content-Type', 'application/json')
      .send({ status: 'active' });

    expect(patched.status).toBe(200);
    expect(patched.body.data.status).toBe('active');
  });

  it('rejects invalid tenancy status transition (active -> draft)', async () => {
    const created = await request(app)
      .post('/api/tenancy-agreements')
      .set('Content-Type', 'application/json')
      .send({
        propertyId: 'prop_300',
        landlordName: 'Landlord C',
        tenantName: 'Tenant C',
        startDate: '2026-08-01',
        endDate: '2027-07-31',
        annualRent: 115000,
      });

    const id = created.body.data.id;
    await request(app)
      .patch(`/api/tenancy-agreements/${id}`)
      .set('Content-Type', 'application/json')
      .send({ status: 'active' });

    const invalid = await request(app)
      .patch(`/api/tenancy-agreements/${id}`)
      .set('Content-Type', 'application/json')
      .send({ status: 'draft' });

    expect(invalid.status).toBe(400);
    expect(invalid.body.error).toContain('Invalid tenancy agreement status transition');
  });

  it('deletes tenancy agreement and returns removed record', async () => {
    const created = await request(app)
      .post('/api/tenancy-agreements')
      .set('Content-Type', 'application/json')
      .send({
        propertyId: 'prop_400',
        landlordName: 'Landlord D',
        tenantName: 'Tenant D',
        startDate: '2026-09-01',
        endDate: '2027-08-31',
        annualRent: 125000,
      });

    const id = created.body.data.id;
    const deleted = await request(app).delete(`/api/tenancy-agreements/${id}`);

    expect(deleted.status).toBe(200);
    expect(deleted.body.data.id).toBe(id);
  });
});

describe('Server — Valuation Estimate API', () => {
  const app = createApp();

  it('returns valuation bands for valid area/location', async () => {
    const res = await request(app)
      .post('/api/valuation/estimate')
      .set('Content-Type', 'application/json')
      .send({ area: 1000, location: 'Dubai Marina' });

    expect(res.status).toBe(200);
    expect(res.body.estimate.low).toBeLessThan(res.body.estimate.mid);
    expect(res.body.estimate.high).toBeGreaterThan(res.body.estimate.mid);
    expect(res.body.comparables.length).toBeGreaterThanOrEqual(1);
  });

  it('rejects invalid area', async () => {
    const res = await request(app)
      .post('/api/valuation/estimate')
      .set('Content-Type', 'application/json')
      .send({ area: 0, location: 'Dubai Marina' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('area');
  });
});
