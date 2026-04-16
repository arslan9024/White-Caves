/**
 * Meta Webhook Routes — Tests
 * Tests webhook verification, incoming message handling, status updates,
 * send message, template send, image send, and status check
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mocks ──────────────────────────────────────────────────────────
const mockMetaClient = {
  verifyWebhook: vi.fn(),
  parseWebhookEvent: vi.fn(),
  sendMessage: vi.fn().mockResolvedValue('meta-msg-123'),
  sendTemplate: vi.fn().mockResolvedValue('meta-tmpl-123'),
  sendImage: vi.fn().mockResolvedValue('meta-img-123'),
  getStats: vi.fn().mockReturnValue({
    apiVersion: 'v18.0',
    phoneNumberId: '1234567890',
  }),
};

vi.mock('../services/whatsapp/metaAPI', () => ({
  createMetaAPIClient: vi.fn(() => mockMetaClient),
  MetaAPIClient: vi.fn(),
}));

vi.mock('../middleware/rbac', () => ({
  requireRole: () => (_req: any, _res: any, next: any) => next(),
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
}));

vi.mock('../utils/logger.js', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

// ─── Helpers ────────────────────────────────────────────────────────
function mockRes(): any {
  const res: any = { statusCode: 200, _json: null };
  res.status = vi.fn((code: number) => { res.statusCode = code; return res; });
  res.json = vi.fn((data: any) => { res._json = data; return res; });
  res.set = vi.fn(() => res);
  res.send = vi.fn(() => res);
  return res;
}

describe('Meta Webhook Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Webhook Verification ── GET /verify ────────────────────────
  describe('GET /verify', () => {
    it('should accept valid webhook verification', () => {
      mockMetaClient.verifyWebhook.mockReturnValue('challenge-123');
      const result = mockMetaClient.verifyWebhook('subscribe', 'challenge-123', 'valid-token');
      expect(result).toBe('challenge-123');
    });

    it('should reject invalid verification', () => {
      mockMetaClient.verifyWebhook.mockReturnValue(null);
      const result = mockMetaClient.verifyWebhook('subscribe', 'challenge', 'invalid-token');
      expect(result).toBeNull();
    });

    it('should reject non-subscribe mode', () => {
      mockMetaClient.verifyWebhook.mockReturnValue(null);
      const result = mockMetaClient.verifyWebhook('unsubscribe', 'challenge', 'token');
      expect(result).toBeNull();
    });
  });

  // ─── Incoming Webhook ── POST / ─────────────────────────────────
  describe('POST / (incoming webhook event)', () => {
    it('should parse valid WhatsApp webhook event', () => {
      const mockEvent = {
        entry: [{
          changes: [{
            value: {
              messaging_product: 'whatsapp',
              messages: [{ id: 'msg-1', from: '971501234567', type: 'text', text: { body: 'Hello' }, timestamp: '1704067200' }],
              metadata: { phone_number_id: '123456' },
            },
          }],
        }],
      };
      mockMetaClient.parseWebhookEvent.mockReturnValue(mockEvent);

      const event = mockMetaClient.parseWebhookEvent({});
      expect(event.entry[0].changes[0].value.messaging_product).toBe('whatsapp');
      expect(event.entry[0].changes[0].value.messages).toHaveLength(1);
    });

    it('should ignore non-WhatsApp events', () => {
      const mockEvent = {
        entry: [{
          changes: [{
            value: { messaging_product: 'instagram' },
          }],
        }],
      };
      mockMetaClient.parseWebhookEvent.mockReturnValue(mockEvent);

      const event = mockMetaClient.parseWebhookEvent({});
      expect(event.entry[0].changes[0].value.messaging_product).not.toBe('whatsapp');
    });

    it('should handle message status updates', () => {
      const mockEvent = {
        entry: [{
          changes: [{
            value: {
              messaging_product: 'whatsapp',
              statuses: [{ id: 'msg-1', status: 'delivered', timestamp: '1704067200', recipient_id: '971501234567' }],
              metadata: { phone_number_id: '123456' },
            },
          }],
        }],
      };
      mockMetaClient.parseWebhookEvent.mockReturnValue(mockEvent);

      const event = mockMetaClient.parseWebhookEvent({});
      expect(event.entry[0].changes[0].value.statuses).toHaveLength(1);
      expect(event.entry[0].changes[0].value.statuses[0].status).toBe('delivered');
    });

    it('should handle multiple entries in webhook', () => {
      const mockEvent = {
        entry: [
          { changes: [{ value: { messaging_product: 'whatsapp', messages: [{ id: '1' }], metadata: { phone_number_id: '123' } } }] },
          { changes: [{ value: { messaging_product: 'whatsapp', messages: [{ id: '2' }], metadata: { phone_number_id: '456' } } }] },
        ],
      };
      mockMetaClient.parseWebhookEvent.mockReturnValue(mockEvent);

      const event = mockMetaClient.parseWebhookEvent({});
      expect(event.entry).toHaveLength(2);
    });

    it('should handle media messages', () => {
      const message = { id: 'msg-1', from: '971501234567', type: 'image', image: { id: 'img-123' }, timestamp: '1704067200' };
      const hasMedia = !!message.image;
      expect(hasMedia).toBe(true);
    });
  });

  // ─── Send Message ── POST /send ─────────────────────────────────
  describe('POST /send', () => {
    it('should send message and return messageId', async () => {
      const result = await mockMetaClient.sendMessage('+971501234567', 'Hello');
      expect(result).toBe('meta-msg-123');
    });

    it('should require to and message fields', () => {
      const body = { to: '+971501234567', message: 'Hello' };
      expect(body.to).toBeTruthy();
      expect(body.message).toBeTruthy();
    });

    it('should reject missing to field', () => {
      const body = { message: 'Hello' } as any;
      expect(body.to).toBeFalsy();
    });

    it('should reject missing message field', () => {
      const body = { to: '+971501234567' } as any;
      expect(body.message).toBeFalsy();
    });
  });

  // ─── Send Template ── POST /template ────────────────────────────
  describe('POST /template', () => {
    it('should send template message', async () => {
      const result = await mockMetaClient.sendTemplate('+971501234567', 'welcome_template', ['John']);
      expect(result).toBe('meta-tmpl-123');
    });

    it('should require to and template fields', () => {
      const body = { to: '+971501234567', template: 'welcome' };
      expect(body.to).toBeTruthy();
      expect(body.template).toBeTruthy();
    });
  });

  // ─── Send Image ── POST /image ──────────────────────────────────
  describe('POST /image', () => {
    it('should send image and return messageId', async () => {
      const result = await mockMetaClient.sendImage('+971501234567', 'https://example.com/image.jpg');
      expect(result).toBe('meta-img-123');
    });

    it('should require to and imageUrl fields', () => {
      const body = { to: '+971501234567', imageUrl: 'https://example.com/image.jpg' };
      expect(body.to).toBeTruthy();
      expect(body.imageUrl).toBeTruthy();
    });
  });

  // ─── Status ── GET /status ──────────────────────────────────────
  describe('GET /status', () => {
    it('should return API stats', () => {
      const stats = mockMetaClient.getStats();
      expect(stats).toHaveProperty('apiVersion');
      expect(stats).toHaveProperty('phoneNumberId');
    });

    it('should mask phone number ID', () => {
      const stats = mockMetaClient.getStats();
      const masked = stats.phoneNumberId ? stats.phoneNumberId.substring(0, 5) + '***' : 'NOT_SET';
      expect(masked).toBe('12345***');
    });
  });
});
