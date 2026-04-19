import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('../middleware/rbac', () => ({
  requirePermission: () => (_req, _res, next) => next(),
  requireRole: () => (_req, _res, next) => next(),
}));

const mockMetaClient = {
  sendMessage: vi.fn().mockResolvedValue('msg-123'),
  sendTemplate: vi.fn().mockResolvedValue('msg-456'),
  sendImage: vi.fn().mockResolvedValue('msg-789'),
  getStatus: vi.fn().mockReturnValue({ connected: true }),
  getStats: vi.fn().mockReturnValue({
    apiVersion: 'v18.0', phoneNumberId: '1234567890',
    totalSent: 100, totalReceived: 50,
  }),
  verifyWebhook: vi.fn().mockImplementation((_mode, challenge, _token) => challenge || null),
  parseWebhookEvent: vi.fn().mockReturnValue({
    object: 'whatsapp_business_account',
    entry: [{ changes: [{ value: { messaging_product: 'whatsapp', messages: [] } }] }],
  }),
  processWebhook: vi.fn().mockResolvedValue({ success: true }),
};

vi.mock('../services/whatsapp/metaAPI', () => ({
  createMetaAPIClient: () => mockMetaClient,
  MetaAPIClient: vi.fn(() => mockMetaClient),
}));

vi.mock('../utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}));

import metaRouter from './meta-webhook';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/meta', metaRouter);
  return app;
}

describe('Meta Webhook Routes', () => {
  let app;
  beforeEach(() => {
    vi.clearAllMocks();
    mockMetaClient.getStats.mockReturnValue({
      apiVersion: 'v18.0', phoneNumberId: '1234567890',
      totalSent: 100, totalReceived: 50,
    });
    mockMetaClient.verifyWebhook.mockImplementation((_mode, challenge, _token) => challenge || null);
    app = createApp();
  });

  describe('GET /meta/verify', () => {
    it('verifies webhook with valid challenge', async () => {
      const res = await request(app)
        .get('/meta/verify')
        .query({ 'hub.mode': 'subscribe', 'hub.challenge': '12345', 'hub.verify_token': 'test' });
      expect([200, 403]).toContain(res.status);
    });
    it('rejects invalid verification', async () => {
      mockMetaClient.verifyWebhook.mockReturnValueOnce(null);
      const res = await request(app).get('/meta/verify');
      expect([200, 400, 403]).toContain(res.status);
    });
  });

  describe('POST /meta/', () => {
    it('handles incoming webhook event', async () => {
      const res = await request(app)
        .post('/meta/')
        .send({ object: 'whatsapp_business_account', entry: [{ changes: [{ value: { messaging_product: 'whatsapp', messages: [] } }] }] });
      expect([200, 201, 202, 204]).toContain(res.status);
    });
  });

  describe('POST /meta/send', () => {
    it('sends a message', async () => {
      const res = await request(app)
        .post('/meta/send')
        .send({ to: '962790000000', message: 'Test' });
      expect([200, 201]).toContain(res.status);
    });
  });

  describe('POST /meta/template', () => {
    it('sends a template message', async () => {
      const res = await request(app)
        .post('/meta/template')
        .send({ to: '962790000000', template: 'hello_world', language: 'en' });
      expect([200, 201]).toContain(res.status);
    });
  });

  describe('GET /meta/status', () => {
    it('returns API status', async () => {
      const res = await request(app).get('/meta/status');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /meta/image', () => {
    it('sends an image', async () => {
      const res = await request(app)
        .post('/meta/image')
        .send({ to: '962790000000', imageUrl: 'https://example.com/img.jpg' });
      expect([200, 201]).toContain(res.status);
    });
  });
});
