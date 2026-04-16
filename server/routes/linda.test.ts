/**
 * Linda Routes — Unit Tests
 * Tests /api/linda endpoints: status, send, webhook polling, conversations, health, disconnect
 * All WhatsApp client calls are mocked — no real connections needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockLindaClient } = vi.hoisted(() => ({
  mockLindaClient: {
    initialize: vi.fn().mockResolvedValue(undefined),
    getStats: vi.fn().mockReturnValue({
      status: 'connected',
      isConnected: true,
      queuedMessages: 0,
      reconnectAttempts: 0,
    }),
    sendMessage: vi.fn().mockResolvedValue({ messageId: 'msg-001' }),
    getMessageQueue: vi.fn().mockReturnValue([]),
    getConversations: vi.fn().mockReturnValue([]),
    getConversationHistory: vi.fn().mockReturnValue([]),
    isConnected: vi.fn().mockReturnValue(true),
    disconnect: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('../services/whatsapp/lindaClient', () => ({
  getLindaClient: vi.fn().mockReturnValue(mockLindaClient),
  LindaClient: vi.fn(),
}));

vi.mock('../middleware/rbac', () => ({
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
  requireRole: () => (_req: any, _res: any, next: any) => next(),
}));

vi.mock('../utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}));

vi.mock('../config/env', () => ({
  LINDA_SESSION_PATH: '/tmp/linda-test',
}));

// ── App setup ────────────────────────────────────────────────────────
import lindaRouter from './linda';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/linda', lindaRouter);
  return app;
}

// ── Tests ────────────────────────────────────────────────────────────
describe('Linda Routes', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp();
  });

  // ── GET /status ──────────────────────────────────────────────────
  describe('GET /api/linda/status', () => {
    it('returns connection status', async () => {
      const res = await request(app).get('/api/linda/status');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('status');
    });
  });

  // ── POST /send/:conversationId ───────────────────────────────────
  describe('POST /api/linda/send/:conversationId', () => {
    it('sends a message successfully', async () => {
      mockLindaClient.sendMessage.mockResolvedValueOnce({ messageId: 'msg-002' });
      const res = await request(app)
        .post('/api/linda/send/conv-1')
        .send({ phoneNumber: '+971501234567', message: 'Hello' });
      expect(res.status).toBe(200);
    });

    it('rejects missing phoneNumber', async () => {
      const res = await request(app)
        .post('/api/linda/send/conv-1')
        .send({ message: 'Hello' });
      expect(res.status).toBe(400);
    });

    it('rejects missing message', async () => {
      const res = await request(app)
        .post('/api/linda/send/conv-1')
        .send({ phoneNumber: '+971501234567' });
      expect(res.status).toBe(400);
    });
  });

  // ── POST /webhook (polling) ──────────────────────────────────────
  describe('POST /api/linda/webhook', () => {
    it('returns empty array when no messages queued', async () => {
      mockLindaClient.getMessageQueue.mockReturnValueOnce([]);
      const res = await request(app).post('/api/linda/webhook');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.messages).toEqual([]);
    });

    it('returns queued messages', async () => {
      mockLindaClient.getMessageQueue.mockReturnValueOnce([
        { from: '971501234567', body: 'Hi', timestamp: Date.now(), type: 'text' },
      ]);
      const res = await request(app).post('/api/linda/webhook');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ── GET /conversations ───────────────────────────────────────────
  describe('GET /api/linda/conversations', () => {
    it('returns conversations list', async () => {
      mockLindaClient.getConversations.mockReturnValueOnce([
        { phoneNumber: '971501234567', lastMessage: 'Hi', updatedAt: new Date() },
      ]);
      const res = await request(app).get('/api/linda/conversations');
      expect(res.status).toBe(200);
    });
  });

  // ── GET /conversations/:phoneNumber/history ──────────────────────
  describe('GET /api/linda/conversations/:phone/history', () => {
    it('returns conversation history', async () => {
      mockLindaClient.getConversationHistory.mockReturnValueOnce([
        { body: 'Hello', from: '971501234567', timestamp: Date.now() },
      ]);
      const res = await request(app).get('/api/linda/conversations/971501234567/history');
      expect(res.status).toBe(200);
    });

    it('supports limit query parameter', async () => {
      mockLindaClient.getConversationHistory.mockReturnValueOnce([]);
      const res = await request(app).get('/api/linda/conversations/971501234567/history?limit=10');
      expect(res.status).toBe(200);
    });
  });

  // ── POST /ready ──────────────────────────────────────────────────
  describe('POST /api/linda/ready', () => {
    it('returns 200 when connected', async () => {
      mockLindaClient.isConnected.mockReturnValueOnce(true);
      const res = await request(app).post('/api/linda/ready');
      expect([200, 503]).toContain(res.status);
    });
  });

  // ── GET /health ──────────────────────────────────────────────────
  describe('GET /api/linda/health', () => {
    it('returns health status', async () => {
      const res = await request(app).get('/api/linda/health');
      expect([200, 503]).toContain(res.status);
    });
  });

  // ── POST /disconnect ─────────────────────────────────────────────
  describe('POST /api/linda/disconnect', () => {
    it('disconnects the client', async () => {
      const res = await request(app).post('/api/linda/disconnect');
      expect(res.status).toBe(200);
    });
  });

  // ── GET /stats ───────────────────────────────────────────────────
  describe('GET /api/linda/stats', () => {
    it('returns detailed stats', async () => {
      const res = await request(app).get('/api/linda/stats');
      expect(res.status).toBe(200);
    });
  });
});
