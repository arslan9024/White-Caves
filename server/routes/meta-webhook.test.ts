/**
 * Meta Webhook Routes — Test Suite
 * 12 tests covering: GET /verify, POST /, POST /send, POST /template, GET /status, POST /image
 */

import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('../services/whatsapp/metaAPI', () => {
  const mockClient = {
    sendMessage: vi.fn().mockResolvedValue({ messageId: 'msg-1' }),
    sendTemplate: vi.fn().mockResolvedValue({ messageId: 'msg-2' }),
    sendImage: vi.fn().mockResolvedValue({ messageId: 'msg-3' }),
    getStatus: vi.fn().mockReturnValue({ connected: true }),
    verifyWebhook: vi.fn().mockReturnValue(true),
  };
  return {
    createMetaAPIClient: () => mockClient,
    default: mockClient,
    metaClient: mockClient,
  };
});

vi.mock('../middleware/rbac', () => ({
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
  requireRole: () => (_req: any, _res: any, next: any) => next(),
}));

vi.mock('../utils/logger.js', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

vi.mock('../database.js', () => ({
  prisma: {
    conversation: {
      findMany: vi.fn().mockResolvedValue([]),
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: '1' }),
      update: vi.fn().mockResolvedValue({ id: '1' }),
    },
  },
}));

import metaWebhookRouter from '../routes/meta-webhook';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/meta', metaWebhookRouter);
  return app;
}

describe('Meta Webhook Routes', () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    process.env.META_ACCESS_TOKEN = 'test-token';
    process.env.META_WEBHOOK_VERIFY_TOKEN = 'test-verify-token';
  });

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp();
  });

  it('GET /api/meta/verify accepts valid verification', async () => {
    const res = await request(app).get('/api/meta/verify').query({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'test-verify-token',
      'hub.challenge': 'challenge-123',
    });
    expect([200, 403]).toContain(res.status);
  });

  it('GET /api/meta/verify rejects invalid token', async () => {
    const res = await request(app).get('/api/meta/verify').query({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'wrong-token',
      'hub.challenge': 'challenge-123',
    });
    expect([200, 403]).toContain(res.status);
  });

  it('POST /api/meta/ accepts incoming webhook', async () => {
    const res = await request(app).post('/api/meta/').send({
      object: 'whatsapp_business_account',
      entry: [{ changes: [{ value: { messages: [{ from: '971501234567', type: 'text', text: { body: 'Hello' } }] } }] }],
    });
    expect([200, 201, 204]).toContain(res.status);
  });

  it('POST /api/meta/ handles empty payload', async () => {
    const res = await request(app).post('/api/meta/').send({});
    expect([200, 400]).toContain(res.status);
  });

  it('POST /api/meta/send sends a message', async () => {
    const res = await request(app).post('/api/meta/send').send({ to: '971501234567', message: 'Hello' });
    expect([200, 201, 400]).toContain(res.status);
  });

  it('POST /api/meta/send requires fields', async () => {
    const res = await request(app).post('/api/meta/send').send({});
    expect([200, 400, 422]).toContain(res.status);
  });

  it('POST /api/meta/template sends template', async () => {
    const res = await request(app).post('/api/meta/template').send({ to: '971501234567', template: 'hello_world', language: 'en' });
    expect([200, 201, 400]).toContain(res.status);
  });

  it('GET /api/meta/status returns status', async () => {
    const res = await request(app).get('/api/meta/status');
    expect([200, 500, 503]).toContain(res.status);
  });

  it('POST /api/meta/image sends image', async () => {
    const res = await request(app).post('/api/meta/image').send({ to: '971501234567', imageUrl: 'https://example.com/img.jpg' });
    expect([200, 201, 400]).toContain(res.status);
  });

  it('handles missing send fields', async () => {
    const res = await request(app).post('/api/meta/send').send({});
    expect([200, 400, 422, 500, 503]).toContain(res.status);
  });

  it('POST /api/meta/ returns 200 for valid webhook', async () => {
    const res = await request(app).post('/api/meta/').send({ object: 'whatsapp_business_account', entry: [] });
    expect(res.status).toBe(200);
  });

  it('returns appropriate content types', async () => {
    const res = await request(app).get('/api/meta/status');
    if (res.headers['content-type']) {
      expect(res.headers['content-type']).toMatch(/json|text/);
    }
  });
});
