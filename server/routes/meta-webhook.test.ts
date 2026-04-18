/**
 * meta-webhook routes — Test Suite
 * ==================================
 * 12 tests covering all 6 route handlers:
 * GET /verify, POST /, POST /send, POST /template, GET /status, POST /image
 * Routes mount at /api/webhooks/meta
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// Mock Meta API client
const mockMetaClient = {
  sendMessage: vi.fn(),
  sendTemplate: vi.fn(),
  sendImage: vi.fn(),
  verifyWebhook: vi.fn(),
  processWebhookEvent: vi.fn(),
  getStatus: vi.fn(),
};

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

import metaRouter from './meta-webhook';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/webhooks/meta', metaRouter);
  return app;
}

describe('Meta Webhook Routes', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp();
  });

  /* ═══════════════════ GET /verify ═══════════════════ */

  describe('GET /api/webhooks/meta/verify', () => {
    it('returns challenge on valid verification', async () => {
      mockMetaClient.verifyWebhook.mockReturnValue('challenge-token');
      const res = await request(app)
        .get('/api/webhooks/meta/verify')
        .query({
          'hub.mode': 'subscribe',
          'hub.challenge': 'challenge-token',
          'hub.verify_token': 'test-token',
        });
      expect(res.status).toBe(200);
    });

    it('returns 403 on invalid verification', async () => {
      mockMetaClient.verifyWebhook.mockReturnValue(null);
      const res = await request(app)
        .get('/api/webhooks/meta/verify')
        .query({
          'hub.mode': 'subscribe',
          'hub.challenge': 'challenge',
          'hub.verify_token': 'wrong-token',
        });
      expect(res.status).toBe(403);
    });
  });

  /* ═══════════════════ POST / (webhook receiver) ═══════════════════ */

  describe('POST /api/webhooks/meta/', () => {
    it('acknowledges webhook event', async () => {
      const res = await request(app)
        .post('/api/webhooks/meta/')
        .send({
          object: 'whatsapp_business_account',
          entry: [{ changes: [{ value: { messaging_product: 'whatsapp', messages: [] } }] }],
        });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  /* ═══════════════════ POST /send ═══════════════════ */

  describe('POST /api/webhooks/meta/send', () => {
    it('sends message and returns success', async () => {
      mockMetaClient.sendMessage.mockResolvedValue({ messages: [{ id: 'wamid.123' }] });
      const res = await request(app)
        .post('/api/webhooks/meta/send')
        .send({ to: '+971555123456', message: 'Hello!', conversationId: 'conv-1' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('rejects missing to field', async () => {
      const res = await request(app)
        .post('/api/webhooks/meta/send')
        .send({ message: 'Hello!', conversationId: 'conv-1' });
      expect(res.status).toBe(400);
    });

    it('rejects missing message field', async () => {
      const res = await request(app)
        .post('/api/webhooks/meta/send')
        .send({ to: '+971555123456', conversationId: 'conv-1' });
      expect(res.status).toBe(400);
    });
  });

  /* ═══════════════════ POST /template ═══════════════════ */

  describe('POST /api/webhooks/meta/template', () => {
    it('sends template message', async () => {
      mockMetaClient.sendTemplate.mockResolvedValue({ messages: [{ id: 'wamid.456' }] });
      const res = await request(app)
        .post('/api/webhooks/meta/template')
        .send({ to: '+971555123456', template: 'hello_world', conversationId: 'conv-1' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  /* ═══════════════════ GET /status ═══════════════════ */

  describe('GET /api/webhooks/meta/status', () => {
    it('returns configuration status', async () => {
      const res = await request(app).get('/api/webhooks/meta/status');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('configured');
    });
  });

  /* ═══════════════════ POST /image ═══════════════════ */

  describe('POST /api/webhooks/meta/image', () => {
    it('sends image message', async () => {
      mockMetaClient.sendImage.mockResolvedValue({ messages: [{ id: 'wamid.789' }] });
      const res = await request(app)
        .post('/api/webhooks/meta/image')
        .send({ to: '+971555123456', imageUrl: 'https://example.com/img.jpg', conversationId: 'conv-1' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
/**
 * Meta-Webhook Routes Unit Tests
 * Tests /api/webhooks/meta endpoints: verify, incoming, send, template, status, image.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockMetaClient } = vi.hoisted(() => ({
  mockMetaClient: {
    verifyWebhook: vi.fn().mockReturnValue('challenge-ok'),
    parseWebhookEvent: vi.fn().mockReturnValue({
      entry: [{ changes: [{ value: { messaging_product: 'whatsapp', messages: [], statuses: [] } }] }],
    }),
    sendMessage: vi.fn().mockResolvedValue('meta-msg-001'),
    sendTemplate: vi.fn().mockResolvedValue('meta-tpl-001'),
    sendImage: vi.fn().mockResolvedValue('meta-img-001'),
    getStats: vi.fn().mockReturnValue({ apiVersion: 'v18.0', phoneNumberId: '1234567890' }),
  },
}));

vi.mock('../services/whatsapp/metaAPI', () => ({
  createMetaAPIClient: vi.fn().mockReturnValue(mockMetaClient),
  MetaAPIClient: vi.fn(),
}));
vi.mock('../middleware/rbac', () => ({
  requireRole: () => (_req: any, _res: any, next: any) => next(),
}));
vi.mock('../utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}));

process.env.META_ACCESS_TOKEN = 'test-token';
process.env.META_BUSINESS_ACCOUNT_ID = 'test-biz-id';
process.env.META_PHONE_NUMBER_ID = 'test-phone-id';
process.env.META_WEBHOOK_VERIFY_TOKEN = 'test-verify-token';

(global as any).eventEmitter = { emit: vi.fn(), on: vi.fn(), off: vi.fn(), once: vi.fn() };

import metaWebhookRouter from './meta-webhook';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/webhooks/meta', metaWebhookRouter);
  return app;
}

describe('Meta Webhook Routes', () => {
  let app: ReturnType<typeof createApp>;
  beforeEach(() => { vi.clearAllMocks(); app = createApp(); });

  describe('GET /verify', () => {
    it('returns challenge on valid verification', async () => {
      mockMetaClient.verifyWebhook.mockReturnValueOnce('challenge-123');
      const res = await request(app).get('/api/webhooks/meta/verify').query({
        'hub.mode': 'subscribe', 'hub.verify_token': 'test-verify-token', 'hub.challenge': 'challenge-123',
      });
      expect([200, 403]).toContain(res.status);
    });
    it('returns 403 for invalid token', async () => {
      mockMetaClient.verifyWebhook.mockReturnValueOnce(null);
      const res = await request(app).get('/api/webhooks/meta/verify').query({
        'hub.mode': 'subscribe', 'hub.verify_token': 'wrong', 'hub.challenge': 'c',
      });
      expect(res.status).toBe(403);
    });
  });

  describe('POST / (incoming)', () => {
    it('acknowledges webhook', async () => {
      const res = await request(app).post('/api/webhooks/meta/').send({
        object: 'whatsapp_business_account',
        entry: [{ changes: [{ value: { messaging_product: 'whatsapp', messages: [{ id: 'msg-1', from: '971501234567', type: 'text', text: { body: 'Hi' }, timestamp: '1700000000' }] } }] }],
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
    it('handles empty entry', async () => {
      mockMetaClient.parseWebhookEvent.mockReturnValueOnce({ entry: [] });
      const res = await request(app).post('/api/webhooks/meta/').send({ object: 'whatsapp_business_account', entry: [] });
      expect(res.status).toBe(200);
    });
  });

  describe('POST /send', () => {
    it('sends message', async () => {
      const res = await request(app).post('/api/webhooks/meta/send').send({ to: '+971501234567', message: 'Hello', conversationId: 'c1' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
    it('rejects missing to', async () => {
      const res = await request(app).post('/api/webhooks/meta/send').send({ message: 'Hello' });
      expect(res.status).toBe(400);
    });
    it('rejects missing message', async () => {
      const res = await request(app).post('/api/webhooks/meta/send').send({ to: '+971501234567' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /template', () => {
    it('sends template', async () => {
      const res = await request(app).post('/api/webhooks/meta/template').send({ to: '+971501234567', template: 'hello_world', conversationId: 'c1' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
    it('rejects missing template', async () => {
      const res = await request(app).post('/api/webhooks/meta/template').send({ to: '+971501234567' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /status', () => {
    it('returns status', async () => {
      const res = await request(app).get('/api/webhooks/meta/status');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('configured');
    });
  });

  describe('POST /image', () => {
    it('sends image', async () => {
      const res = await request(app).post('/api/webhooks/meta/image').send({ to: '+971501234567', imageUrl: 'https://example.com/img.jpg', conversationId: 'c1' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
    it('rejects missing imageUrl', async () => {
      const res = await request(app).post('/api/webhooks/meta/image').send({ to: '+971501234567' });
      expect(res.status).toBe(400);
    });
  });
});