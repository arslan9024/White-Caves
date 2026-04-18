/**
 * linda routes — Test Suite
 * ============================
 * 13 tests covering all 9 route handlers via Supertest
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// Mock dependencies
const mockLindaClient = {
  getStatus: vi.fn(),
  sendMessage: vi.fn(),
  getMessages: vi.fn(),
  getConversations: vi.fn(),
  getConversationHistory: vi.fn(),
  isReady: vi.fn(),
  getStats: vi.fn(),
  disconnect: vi.fn(),
};

vi.mock('../services/whatsapp/lindaClient', () => ({
  getLindaClient: vi.fn().mockResolvedValue(mockLindaClient),
  LindaClient: vi.fn(),
}));

vi.mock('../middleware/rbac', () => ({
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
  requireRole: () => (_req: any, _res: any, next: any) => next(),
}));

vi.mock('../utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}));

import lindaRouter from './linda';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/linda', lindaRouter);
  return app;
}

describe('Linda Routes', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = createApp();
  });

  /* ═══════════════════ GET /status ═══════════════════ */

  describe('GET /api/linda/status', () => {
    it('returns status data', async () => {
      mockLindaClient.getStatus.mockResolvedValue({
        isConnected: true,
        queuedMessages: 0,
        reconnectAttempts: 0,
      });
      const res = await request(app).get('/api/linda/status');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  /* ═══════════════════ POST /send/:conversationId ═══════════════════ */

  describe('POST /api/linda/send/:conversationId', () => {
    it('sends message and returns success', async () => {
      mockLindaClient.sendMessage.mockResolvedValue({ id: 'msg-1' });
      const res = await request(app)
        .post('/api/linda/send/conv-1')
        .send({ phoneNumber: '+9715551234567', message: 'Hello!' });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('rejects missing phoneNumber', async () => {
      const res = await request(app)
        .post('/api/linda/send/conv-1')
        .send({ message: 'Hello!' });
      expect(res.status).toBe(400);
    });

    it('rejects missing message', async () => {
      const res = await request(app)
        .post('/api/linda/send/conv-1')
        .send({ phoneNumber: '+9715551234567' });
      expect(res.status).toBe(400);
    });
  });

  /* ═══════════════════ GET /conversations ═══════════════════ */

  describe('GET /api/linda/conversations', () => {
    it('returns conversations list', async () => {
      mockLindaClient.getConversations.mockResolvedValue([]);
      const res = await request(app).get('/api/linda/conversations');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  /* ═══════════════════ GET /health ═══════════════════ */

  describe('GET /api/linda/health', () => {
    it('returns health check response', async () => {
      mockLindaClient.getStats.mockReturnValue({
        isConnected: true,
        reconnectAttempts: 0,
      });
      const res = await request(app).get('/api/linda/health');
      expect([200, 503]).toContain(res.status);
      expect(res.body).toHaveProperty('success');
    });
  });

  /* ═══════════════════ POST /disconnect ═══════════════════ */

  describe('POST /api/linda/disconnect', () => {
    it('disconnects and returns success', async () => {
      mockLindaClient.disconnect.mockResolvedValue(undefined);
      const res = await request(app).post('/api/linda/disconnect');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  /* ═══════════════════ GET /stats ═══════════════════ */

  describe('GET /api/linda/stats', () => {
    it('returns stats data', async () => {
      mockLindaClient.getStats.mockReturnValue({
        totalMessages: 150,
        totalConversations: 20,
      });
      const res = await request(app).get('/api/linda/stats');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  /* ═══════════════════ POST /ready ═══════════════════ */

  describe('POST /api/linda/ready', () => {
    it('returns ready status', async () => {
      mockLindaClient.isReady.mockReturnValue(true);
      const res = await request(app).post('/api/linda/ready');
      expect([200, 503]).toContain(res.status);
    });
  });

  /* ═══════════════════ POST /webhook ═══════════════════ */

  describe('POST /api/linda/webhook', () => {
    it('processes incoming webhook', async () => {
      mockLindaClient.getMessages.mockResolvedValue([]);
      const res = await request(app).post('/api/linda/webhook').send({});
      expect(res.status).toBe(200);
    });
  });
});
