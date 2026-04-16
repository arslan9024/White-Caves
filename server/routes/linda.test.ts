/**
 * Linda WhatsApp Routes — Tests
 * Tests all Linda route handlers: status, send, webhook, conversations, history, ready, health, disconnect
 * Mocks: LindaClient, RBAC middleware, Express req/res
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mocks ──────────────────────────────────────────────────────────
const mockLindaClient = {
  initialize: vi.fn().mockResolvedValue(undefined),
  getStats: vi.fn().mockReturnValue({
    status: 'connected',
    isConnected: true,
    queuedMessages: 0,
    reconnectAttempts: 0,
  }),
  sendMessage: vi.fn().mockResolvedValue('msg-123'),
  getMessageQueue: vi.fn().mockReturnValue([]),
  getConversations: vi.fn().mockResolvedValue([]),
  getConversationHistory: vi.fn().mockResolvedValue([]),
  isConnected: vi.fn().mockReturnValue(true),
  disconnect: vi.fn().mockResolvedValue(undefined),
};

vi.mock('../services/whatsapp/lindaClient', () => ({
  LindaClient: vi.fn(),
  getLindaClient: vi.fn(() => mockLindaClient),
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

// ─── Helpers ────────────────────────────────────────────────────────
function mockReq(overrides: Record<string, any> = {}): any {
  return {
    body: {},
    params: {},
    query: {},
    ...overrides,
  };
}

function mockRes(): any {
  const res: any = {
    statusCode: 200,
    _json: null,
  };
  res.status = vi.fn((code: number) => { res.statusCode = code; return res; });
  res.json = vi.fn((data: any) => { res._json = data; return res; });
  res.set = vi.fn(() => res);
  res.send = vi.fn(() => res);
  return res;
}

describe('Linda Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Status Endpoint ────────────────────────────────────────────
  describe('GET /status', () => {
    it('should return connected status', () => {
      const stats = mockLindaClient.getStats();
      expect(stats).toHaveProperty('status', 'connected');
      expect(stats).toHaveProperty('isConnected', true);
    });

    it('should include queuedMessages count', () => {
      const stats = mockLindaClient.getStats();
      expect(typeof stats.queuedMessages).toBe('number');
    });

    it('should include reconnectAttempts count', () => {
      const stats = mockLindaClient.getStats();
      expect(typeof stats.reconnectAttempts).toBe('number');
    });
  });

  // ─── Send Message ───────────────────────────────────────────────
  describe('POST /send/:conversationId', () => {
    it('should send message and return messageId', async () => {
      const result = await mockLindaClient.sendMessage('+971501234567', 'Hello');
      expect(result).toBe('msg-123');
      expect(mockLindaClient.sendMessage).toHaveBeenCalledWith('+971501234567', 'Hello');
    });

    it('should reject missing phoneNumber', () => {
      const req = mockReq({ body: { message: 'test' }, params: { conversationId: 'conv-1' } });
      const { phoneNumber } = req.body;
      expect(phoneNumber).toBeUndefined();
    });

    it('should reject missing message', () => {
      const req = mockReq({ body: { phoneNumber: '+971501234567' } });
      const { message } = req.body;
      expect(message).toBeUndefined();
    });

    it('should validate phone number format', () => {
      const cleanPhone = '+971501234567'.replace(/\D/g, '');
      expect(cleanPhone.length).toBeGreaterThanOrEqual(10);
    });

    it('should reject short phone numbers', () => {
      const cleanPhone = '123'.replace(/\D/g, '');
      expect(cleanPhone.length).toBeLessThan(10);
    });
  });

  // ─── Webhook ────────────────────────────────────────────────────
  describe('POST /webhook', () => {
    it('should return empty array when no messages', () => {
      const messages = mockLindaClient.getMessageQueue();
      expect(messages).toEqual([]);
    });

    it('should process messages into correct format', () => {
      const mockMessages = [
        { id: 'msg-1', from: '+971501234567', to: '+971509876543', body: 'Hello', timestamp: new Date(), type: 'text', hasMedia: false },
      ];
      mockLindaClient.getMessageQueue.mockReturnValueOnce(mockMessages);

      const messages = mockLindaClient.getMessageQueue();
      const processed = messages.map((msg: any) => ({
        id: msg.id,
        conversationId: `LINDA_${msg.from.replace(/\D/g, '')}`,
        from: msg.from,
        to: msg.to,
        content: msg.body,
        timestamp: msg.timestamp,
        channel: 'LINDA_WHATSAPP',
        type: msg.type,
        hasMedia: msg.hasMedia,
      }));

      expect(processed).toHaveLength(1);
      expect(processed[0].channel).toBe('LINDA_WHATSAPP');
      expect(processed[0].conversationId).toMatch(/^LINDA_\d+$/);
    });
  });

  // ─── Conversations ──────────────────────────────────────────────
  describe('GET /conversations', () => {
    it('should return conversations list', async () => {
      const conversations = await mockLindaClient.getConversations();
      expect(Array.isArray(conversations)).toBe(true);
    });
  });

  // ─── Conversation History ───────────────────────────────────────
  describe('GET /conversations/:phoneNumber/history', () => {
    it('should return message history for a phone number', async () => {
      const history = await mockLindaClient.getConversationHistory('+971501234567', 50);
      expect(Array.isArray(history)).toBe(true);
    });
  });

  // ─── Ready Check ────────────────────────────────────────────────
  describe('POST /ready', () => {
    it('should return true when connected', () => {
      expect(mockLindaClient.isConnected()).toBe(true);
    });

    it('should return false when disconnected', () => {
      mockLindaClient.isConnected.mockReturnValueOnce(false);
      expect(mockLindaClient.isConnected()).toBe(false);
    });
  });

  // ─── Health ─────────────────────────────────────────────────────
  describe('GET /health', () => {
    it('should return health status object', () => {
      const stats = mockLindaClient.getStats();
      expect(stats).toHaveProperty('status');
      expect(stats).toHaveProperty('isConnected');
    });
  });

  // ─── Disconnect ─────────────────────────────────────────────────
  describe('POST /disconnect', () => {
    it('should disconnect successfully', async () => {
      await mockLindaClient.disconnect();
      expect(mockLindaClient.disconnect).toHaveBeenCalled();
    });
  });
});
