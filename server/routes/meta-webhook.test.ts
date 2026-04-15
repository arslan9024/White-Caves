/**
 * Meta-Webhook Routes — Unit Tests
 * Tests /api/webhooks/meta endpoints: verify, webhook POST, send, template, status, image
 * MetaAPIClient is mocked — no actual Meta/WhatsApp connection needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockMetaClient, mockCreateMetaAPIClient } = vi.hoisted(() => {
  const client = {
    verifyWebhook: vi.fn(),
    parseWebhookEvent: vi.fn(),
    sendMessage: vi.fn().mockResolvedValue('wamid_abc123'),
    sendTemplate: vi.fn().mockResolvedValue('wamid_tpl456'),
    sendImage: vi.fn().mockResolvedValue('wamid_img789'),
    getStats: vi.fn().mockReturnValue({
      apiVersion: 'v17.0',
      businessAccountId: 'biz_123',
      phoneNumberId: 'pn_456',
    }),
  };
  return {
    mockMetaClient: client,
    mockCreateMetaAPIClient: vi.fn().mockReturnValue(client),
  };
});

vi.mock('../services/whatsapp/metaAPI', () => ({
  createMetaAPIClient: mockCreateMetaAPIClient,
  MetaAPIClient: vi.fn(),
}));

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

import metaWebhookRoutes from './meta-webhook';

// ── Test app factory ─────────────────────────────────────────────────
function createApp() {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: 'user-1', email: 'test@whitecaves.ae', role: 'owner' };
    next();
  });
  app.use('/api/webhooks/meta', metaWebhookRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

// ── Tests ────────────────────────────────────────────────────────────
describe('Meta Webhook Routes', () => {
  let app: express.Express;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp();
  });

  // ----------------------------------------------------------------
  // GET /api/webhooks/meta/verify
  // ----------------------------------------------------------------
  describe('GET /verify', () => {
    it('returns challenge when verification succeeds', async () => {
      mockMetaClient.verifyWebhook.mockReturnValue('challenge_token_123');

      const res = await request(app)
        .get('/api/webhooks/meta/verify')
        .query({
          'hub.mode': 'subscribe',
          'hub.challenge': 'challenge_token_123',
          'hub.verify_token': 'my_verify_token',
        });

      expect(res.status).toBe(200);
      expect(res.text).toBe('challenge_token_123');
      expect(mockMetaClient.verifyWebhook).toHaveBeenCalledWith(
        'subscribe',
        'challenge_token_123',
        'my_verify_token',
      );
    });

    it('returns 403 when verification fails', async () => {
      mockMetaClient.verifyWebhook.mockReturnValue(null);

      const res = await request(app)
        .get('/api/webhooks/meta/verify')
        .query({
          'hub.mode': 'subscribe',
          'hub.challenge': 'challenge_token_123',
          'hub.verify_token': 'wrong_token',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Verification failed');
    });

    it('returns 500 on unexpected error', async () => {
      mockMetaClient.verifyWebhook.mockImplementation(() => {
        throw new Error('Unexpected crash');
      });

      const res = await request(app)
        .get('/api/webhooks/meta/verify')
        .query({ 'hub.mode': 'subscribe', 'hub.challenge': 'c', 'hub.verify_token': 't' });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Unexpected crash');
    });
  });

  // ----------------------------------------------------------------
  // POST /api/webhooks/meta  (incoming webhook)
  // ----------------------------------------------------------------
  describe('POST / (webhook)', () => {
    it('acknowledges receipt and processes WhatsApp messages', async () => {
      const webhookBody = {
        entry: [
          {
            changes: [
              {
                value: {
                  messaging_product: 'whatsapp',
                  metadata: { display_phone_number: '+971501234567', phone_number_id: 'pn_456' },
                  messages: [
                    {
                      from: '+971509876543',
                      id: 'wamid_incoming_1',
                      timestamp: '1700000000',
                      type: 'text',
                      text: { body: 'Hello from customer' },
                    },
                  ],
                },
              },
            ],
          },
        ],
      };

      mockMetaClient.parseWebhookEvent.mockReturnValue(webhookBody);

      const res = await request(app)
        .post('/api/webhooks/meta')
        .send(webhookBody);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(mockMetaClient.parseWebhookEvent).toHaveBeenCalledWith(webhookBody);
    });

    it('handles status updates without error', async () => {
      const webhookBody = {
        entry: [
          {
            changes: [
              {
                value: {
                  messaging_product: 'whatsapp',
                  metadata: { display_phone_number: '+971501234567', phone_number_id: 'pn_456' },
                  statuses: [
                    {
                      id: 'wamid_status_1',
                      status: 'delivered',
                      timestamp: '1700000001',
                      recipient_id: '+971509876543',
                    },
                  ],
                },
              },
            ],
          },
        ],
      };

      mockMetaClient.parseWebhookEvent.mockReturnValue(webhookBody);

      const res = await request(app)
        .post('/api/webhooks/meta')
        .send(webhookBody);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('ignores non-WhatsApp events silently', async () => {
      const webhookBody = {
        entry: [
          {
            changes: [
              {
                value: {
                  messaging_product: 'instagram',
                  metadata: { display_phone_number: '', phone_number_id: '' },
                },
              },
            ],
          },
        ],
      };

      mockMetaClient.parseWebhookEvent.mockReturnValue(webhookBody);

      const res = await request(app)
        .post('/api/webhooks/meta')
        .send(webhookBody);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ----------------------------------------------------------------
  // POST /api/webhooks/meta/send
  // ----------------------------------------------------------------
  describe('POST /send', () => {
    it('sends message with valid fields', async () => {
      const res = await request(app)
        .post('/api/webhooks/meta/send')
        .send({ to: '+971501234567', message: 'Hello', conversationId: 'conv-1' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.messageId).toBe('wamid_abc123');
      expect(res.body.data.channel).toBe('META_API');
      expect(mockMetaClient.sendMessage).toHaveBeenCalledWith('+971501234567', 'Hello');
    });

    it('returns 400 when to is missing', async () => {
      const res = await request(app)
        .post('/api/webhooks/meta/send')
        .send({ message: 'Hello' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Missing required fields');
    });

    it('returns 400 when message is missing', async () => {
      const res = await request(app)
        .post('/api/webhooks/meta/send')
        .send({ to: '+971501234567' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Missing required fields');
    });

    it('returns 500 when client throws', async () => {
      mockMetaClient.sendMessage.mockRejectedValueOnce(new Error('API timeout'));

      const res = await request(app)
        .post('/api/webhooks/meta/send')
        .send({ to: '+971501234567', message: 'Hello' });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('API timeout');
    });
  });

  // ----------------------------------------------------------------
  // POST /api/webhooks/meta/template
  // ----------------------------------------------------------------
  describe('POST /template', () => {
    it('sends template message with valid fields', async () => {
      const res = await request(app)
        .post('/api/webhooks/meta/template')
        .send({
          to: '+971501234567',
          template: 'welcome_message',
          parameters: ['John'],
          conversationId: 'conv-2',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.messageId).toBe('wamid_tpl456');
      expect(res.body.data.template).toBe('welcome_message');
      expect(mockMetaClient.sendTemplate).toHaveBeenCalledWith('+971501234567', 'welcome_message', ['John']);
    });

    it('returns 400 when to is missing', async () => {
      const res = await request(app)
        .post('/api/webhooks/meta/template')
        .send({ template: 'welcome_message' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Missing required fields');
    });

    it('returns 400 when template name is missing', async () => {
      const res = await request(app)
        .post('/api/webhooks/meta/template')
        .send({ to: '+971501234567' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Missing required fields');
    });

    it('returns 500 when client throws', async () => {
      mockMetaClient.sendTemplate.mockRejectedValueOnce(new Error('Template not found'));

      const res = await request(app)
        .post('/api/webhooks/meta/template')
        .send({ to: '+971501234567', template: 'invalid_tpl' });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Template not found');
    });
  });

  // ----------------------------------------------------------------
  // GET /api/webhooks/meta/status
  // ----------------------------------------------------------------
  describe('GET /status', () => {
    it('returns configuration status', async () => {
      const originalToken = process.env.META_ACCESS_TOKEN;
      const originalBiz = process.env.META_BUSINESS_ACCOUNT_ID;
      const originalPhone = process.env.META_PHONE_NUMBER_ID;

      process.env.META_ACCESS_TOKEN = 'tok_test';
      process.env.META_BUSINESS_ACCOUNT_ID = 'biz_test';
      process.env.META_PHONE_NUMBER_ID = 'pn_test';

      const res = await request(app).get('/api/webhooks/meta/status');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.configured).toBe(true);
      expect(res.body.data.apiVersion).toBe('v17.0');

      process.env.META_ACCESS_TOKEN = originalToken;
      process.env.META_BUSINESS_ACCOUNT_ID = originalBiz;
      process.env.META_PHONE_NUMBER_ID = originalPhone;
    });

    it('shows not configured when env vars missing', async () => {
      const originalToken = process.env.META_ACCESS_TOKEN;
      const originalBiz = process.env.META_BUSINESS_ACCOUNT_ID;
      const originalPhone = process.env.META_PHONE_NUMBER_ID;

      delete process.env.META_ACCESS_TOKEN;
      delete process.env.META_BUSINESS_ACCOUNT_ID;
      delete process.env.META_PHONE_NUMBER_ID;

      const res = await request(app).get('/api/webhooks/meta/status');

      expect(res.status).toBe(200);
      expect(res.body.data.configured).toBe(false);

      process.env.META_ACCESS_TOKEN = originalToken;
      process.env.META_BUSINESS_ACCOUNT_ID = originalBiz;
      process.env.META_PHONE_NUMBER_ID = originalPhone;
    });

    it('returns 500 when getStats throws', async () => {
      mockMetaClient.getStats.mockImplementationOnce(() => {
        throw new Error('Client error');
      });

      const res = await request(app).get('/api/webhooks/meta/status');

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Client error');
    });
  });

  // ----------------------------------------------------------------
  // POST /api/webhooks/meta/image
  // ----------------------------------------------------------------
  describe('POST /image', () => {
    it('sends image with valid fields', async () => {
      const res = await request(app)
        .post('/api/webhooks/meta/image')
        .send({
          to: '+971501234567',
          imageUrl: 'https://example.com/property-photo.jpg',
          conversationId: 'conv-3',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.messageId).toBe('wamid_img789');
      expect(res.body.data.channel).toBe('META_API');
      expect(mockMetaClient.sendImage).toHaveBeenCalledWith(
        '+971501234567',
        'https://example.com/property-photo.jpg',
      );
    });

    it('returns 400 when to is missing', async () => {
      const res = await request(app)
        .post('/api/webhooks/meta/image')
        .send({ imageUrl: 'https://example.com/photo.jpg' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Missing required fields');
    });

    it('returns 400 when imageUrl is missing', async () => {
      const res = await request(app)
        .post('/api/webhooks/meta/image')
        .send({ to: '+971501234567' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Missing required fields');
    });

    it('returns 500 when client throws', async () => {
      mockMetaClient.sendImage.mockRejectedValueOnce(new Error('Upload failed'));

      const res = await request(app)
        .post('/api/webhooks/meta/image')
        .send({ to: '+971501234567', imageUrl: 'https://example.com/photo.jpg' });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Upload failed');
    });
  });
});
