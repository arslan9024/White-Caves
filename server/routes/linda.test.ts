/**
 * Linda Routes — Unit Tests
 * Tests /api/linda endpoints: status, send, webhook, conversations, ready, health, disconnect, stats
 * LindaClient is mocked — no WhatsApp connection needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockLindaClient, mockGetLindaClient } = vi.hoisted(() => {
  const client = {
    initialize: vi.fn().mockResolvedValue(undefined),
    getStats: vi.fn().mockReturnValue({
      status: 'READY',
      isConnected: true,
      queuedMessages: 0,
      reconnectAttempts: 0,
    }),
    sendMessage: vi.fn().mockResolvedValue('msg_123'),
    getMessageQueue: vi.fn().mockReturnValue([]),
    getConversations: vi.fn().mockResolvedValue([]),
    getConversationHistory: vi.fn().mockResolvedValue([]),
    isConnected: vi.fn().mockReturnValue(true),
    disconnect: vi.fn().mockResolvedValue(undefined),
  };
  return {
    mockLindaClient: client,
    mockGetLindaClient: vi.fn().mockReturnValue(client),
  };
});

vi.mock('../services/whatsapp/lindaClient', () => ({
  getLindaClient: mockGetLindaClient,
  LindaClient: vi.fn(),
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

import lindaRoutes from './linda';

// ── Test app factory ─────────────────────────────────────────────────
function createApp() {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: 'user-1', email: 'test@whitecaves.ae', role: 'owner' };
    next();
  });
  app.use('/api/linda', lindaRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

// ── Tests ────────────────────────────────────────────────────────────
describe('Linda Routes', () => {
  let app: express.Express;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp();
  });

  // ----------------------------------------------------------------
  // GET /api/linda/status
  // ----------------------------------------------------------------
  describe('GET /status', () => {
    it('returns connection status', async () => {
      const res = await request(app).get('/api/linda/status');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('status');
      expect(res.body.data).toHaveProperty('isConnected');
      expect(res.body.data).toHaveProperty('queuedMessages');
    });
  });

  // ----------------------------------------------------------------
  // POST /api/linda/send/:conversationId
  // ----------------------------------------------------------------
  describe('POST /send/:conversationId', () => {
    it('sends message with valid phone and message', async () => {
      const res = await request(app)
        .post('/api/linda/send/conv-1')
        .send({ phoneNumber: '+971501234567', message: 'Hello from test' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.conversationId).toBe('conv-1');
      expect(res.body.data.channel).toBe('LINDA_WHATSAPP');
      expect(mockLindaClient.sendMessage).toHaveBeenCalledWith('+971501234567', 'Hello from test');
    });

    it('returns 400 when phoneNumber is missing', async () => {
      const res = await request(app)
        .post('/api/linda/send/conv-1')
        .send({ message: 'Hello' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Missing required fields');
    });

    it('returns 400 when message is missing', async () => {
      const res = await request(app)
        .post('/api/linda/send/conv-1')
        .send({ phoneNumber: '+971501234567' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Missing required fields');
    });

    it('returns 400 for phone number too short', async () => {
      const res = await request(app)
        .post('/api/linda/send/conv-1')
        .send({ phoneNumber: '123', message: 'Hello' });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Invalid phone number');
    });
  });

  // ----------------------------------------------------------------
  // POST /api/linda/webhook
  // ----------------------------------------------------------------
  describe('POST /webhook', () => {
    it('returns empty queue', async () => {
      mockLindaClient.getMessageQueue.mockReturnValue([]);

      const res = await request(app).post('/api/linda/webhook');

      expect(res.status).toBe(200);
      expect(res.body.data.messages).toEqual([]);
      expect(res.body.data.count).toBe(0);
    });

    it('returns queued messages', async () => {
      mockLindaClient.getMessageQueue.mockReturnValue([
        {
          id: 'msg-1',
          from: '+971501234567',
          to: '+971509876543',
          body: 'Hello',
          timestamp: new Date(),
          isFromMe: false,
          hasMedia: false,
          type: 'text',
        },
      ]);

      const res = await request(app).post('/api/linda/webhook');

      expect(res.status).toBe(200);
      expect(res.body.data.messages).toHaveLength(1);
      expect(res.body.data.count).toBe(1);
      expect(res.body.data.messages[0].channel).toBe('LINDA_WHATSAPP');
    });
  });

  // ----------------------------------------------------------------
  // GET /api/linda/conversations
  // ----------------------------------------------------------------
  describe('GET /conversations', () => {
    it('returns conversation list', async () => {
      mockLindaClient.getConversations.mockResolvedValue([
        { id: 'chat-1', name: 'John' },
      ]);

      const res = await request(app).get('/api/linda/conversations');

      expect(res.status).toBe(200);
      expect(res.body.data.conversations).toHaveLength(1);
      expect(res.body.data.count).toBe(1);
    });
  });

  // ----------------------------------------------------------------
  // GET /api/linda/conversations/:phoneNumber/history
  // ----------------------------------------------------------------
  describe('GET /conversations/:phoneNumber/history', () => {
    it('returns conversation history', async () => {
      mockLindaClient.getConversationHistory.mockResolvedValue([]);

      const res = await request(app).get('/api/linda/conversations/971501234567/history');

      expect(res.status).toBe(200);
      expect(res.body.data.phoneNumber).toBe('971501234567');
      expect(res.body.data.messages).toEqual([]);
    });

    it('respects limit query param', async () => {
      await request(app).get('/api/linda/conversations/971501234567/history?limit=10');

      expect(mockLindaClient.getConversationHistory).toHaveBeenCalledWith('971501234567', 10);
    });
  });

  // ----------------------------------------------------------------
  // POST /api/linda/ready
  // ----------------------------------------------------------------
  describe('POST /ready', () => {
    it('returns ready when connected', async () => {
      mockLindaClient.isConnected.mockReturnValue(true);

      const res = await request(app).post('/api/linda/ready');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('ready');
    });

    it('returns 503 when not connected', async () => {
      mockLindaClient.isConnected.mockReturnValue(false);

      const res = await request(app).post('/api/linda/ready');

      expect(res.status).toBe(503);
      expect(res.body.success).toBe(false);
    });
  });

  // ----------------------------------------------------------------
  // GET /api/linda/health
  // ----------------------------------------------------------------
  describe('GET /health', () => {
    it('returns 200 when healthy', async () => {
      mockLindaClient.getStats.mockReturnValue({
        status: 'READY',
        isConnected: true,
        queuedMessages: 0,
        reconnectAttempts: 0,
      });

      const res = await request(app).get('/api/linda/health');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ----------------------------------------------------------------
  // POST /api/linda/disconnect
  // ----------------------------------------------------------------
  describe('POST /disconnect', () => {
    it('disconnects and returns success', async () => {
      const res = await request(app).post('/api/linda/disconnect');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('disconnected');
    });
  });

  // ----------------------------------------------------------------
  // GET /api/linda/stats
  // ----------------------------------------------------------------
  describe('GET /stats', () => {
    it('returns detailed statistics', async () => {
      const res = await request(app).get('/api/linda/stats');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });
  });
});
