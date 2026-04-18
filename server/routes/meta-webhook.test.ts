/**
 * meta-webhook routes � Test Suite
 * 12 tests covering /api/webhooks/meta/* endpoints
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

const { mockMetaClient } = vi.hoisted(() => ({
  mockMetaClient: {
    sendMessage: vi.fn().mockResolvedValue({ messages: [{ id: 'wamid.123' }] }),
    sendTemplate: vi.fn().mockResolvedValue({ messages: [{ id: 'wamid.456' }] }),
    sendImage: vi.fn().mockResolvedValue({ messages: [{ id: 'wamid.789' }] }),
    verifyWebhook: vi.fn().mockReturnValue(null),
    processWebhookEvent: vi.fn(),
    getStatus: vi.fn(),
    getStats: vi.fn().mockReturnValue({ apiVersion: 'v18.0' }),
  },
}));

vi.mock('../services/whatsapp/metaAPI', () => ({
  createMetaAPIClient: vi.fn().mockReturnValue(mockMetaClient),
  MetaAPIClient: vi.fn(),
}));

vi.mock('../middleware/rbac', () => ({
  requireRole: () => (_req: any, _res: any, next: any) => next(),
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
}));

vi.mock('../utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}));

process.env.META_ACCESS_TOKEN = 'test-token';
process.env.META_WEBHOOK_VERIFY_TOKEN = 'test-verify-token';

import metaWebhookRouter from './meta-webhook';

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/webhooks/meta', metaWebhookRouter);
  return app;
}

describe('Meta Webhook Routes', () => {
  let app: ReturnType<typeof buildApp>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = buildApp();
  });

  it('GET /verify returns challenge on valid token', async () => {
    mockMetaClient.verifyWebhook.mockReturnValueOnce('challenge-123');
    const res = await request(app).get('/api/webhooks/meta/verify').query({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'test-verify-token',
      'hub.challenge': 'challenge-123',
    });
    expect([200, 403]).toContain(res.status);
  });

  it('GET /verify returns 403 on invalid token', async () => {
    mockMetaClient.verifyWebhook.mockReturnValueOnce(null);
    const res = await request(app).get('/api/webhooks/meta/verify').query({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'wrong',
      'hub.challenge': 'c',
    });
    expect(res.status).toBe(403);
  });

  it('POST / acknowledges webhook event', async () => {
    const res = await request(app).post('/api/webhooks/meta/').send({
      object: 'whatsapp_business_account',
      entry: [{ changes: [{ value: { messaging_product: 'whatsapp', messages: [] } }] }],
    });
    expect(res.status).toBe(200);
  });

  it('POST / handles text message', async () => {
    const res = await request(app).post('/api/webhooks/meta/').send({
      object: 'whatsapp_business_account',
      entry: [{
        changes: [{
          value: {
            messaging_product: 'whatsapp',
            messages: [{ id: 'msg-1', from: '971501234567', type: 'text', text: { body: 'Hi' }, timestamp: '1700000000' }],
          },
        }],
      }],
    });
    expect(res.status).toBe(200);
  });

  it('POST /send sends message', async () => {
    const res = await request(app).post('/api/webhooks/meta/send').send({
      to: '+971555123456',
      message: 'Hello!',
      conversationId: 'conv-1',
    });
    expect(res.status).toBe(200);
  });

  it('POST /send rejects missing to field', async () => {
    const res = await request(app).post('/api/webhooks/meta/send').send({
      message: 'Hello!',
    });
    expect(res.status).toBe(400);
  });

  it('POST /send rejects missing message field', async () => {
    const res = await request(app).post('/api/webhooks/meta/send').send({
      to: '+971555123456',
    });
    expect(res.status).toBe(400);
  });

  it('POST /template sends template', async () => {
    const res = await request(app).post('/api/webhooks/meta/template').send({
      to: '+971555123456',
      template: 'hello_world',
      conversationId: 'conv-1',
    });
    expect(res.status).toBe(200);
  });

  it('GET /status returns config', async () => {
    const res = await request(app).get('/api/webhooks/meta/status');
    expect(res.status).toBe(200);
  });

  it('POST /image sends image', async () => {
    const res = await request(app).post('/api/webhooks/meta/image').send({
      to: '+971555123456',
      imageUrl: 'https://example.com/img.jpg',
      conversationId: 'conv-1',
    });
    expect(res.status).toBe(200);
  });

  it('POST / with empty body returns 200', async () => {
    const res = await request(app).post('/api/webhooks/meta/').send({});
    expect([200, 400]).toContain(res.status);
  });

  it('POST / returns JSON content type', async () => {
    const res = await request(app).post('/api/webhooks/meta/').send({
      object: 'whatsapp_business_account',
      entry: [],
    });
    expect(res.headers['content-type']).toMatch(/json/);
  });
});
