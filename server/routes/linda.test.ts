import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('../middleware/rbac', () => ({
  requirePermission: () => (_req, _res, next) => next(),
  requireRole: () => (_req, _res, next) => next(),
}));

const mockClient = {
  getStatus: vi.fn().mockReturnValue('connected'),
  getStats: vi.fn().mockReturnValue({
    isConnected: true, status: 'connected', reconnectAttempts: 0,
    queuedMessages: 0, totalSent: 10, totalReceived: 5,
  }),
  isReady: vi.fn().mockReturnValue(true),
  isConnected: vi.fn().mockReturnValue(true),
  sendMessage: vi.fn().mockResolvedValue({ success: true }),
  getConversations: vi.fn().mockResolvedValue([]),
  getConversationHistory: vi.fn().mockResolvedValue([]),
  disconnect: vi.fn().mockResolvedValue(undefined),
  initialize: vi.fn().mockResolvedValue(undefined),
  handleWebhook: vi.fn().mockResolvedValue({ success: true }),
  getMessageQueue: vi.fn().mockReturnValue([]),
};

vi.mock('../services/whatsapp/lindaClient', () => ({
  getLindaClient: () => mockClient,
  LindaClient: vi.fn(() => mockClient),
}));

vi.mock('../utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}));

import lindaRouter from './linda';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/linda', lindaRouter);
  return app;
}

describe('Linda Routes', () => {
  let app;
  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.isConnected.mockReturnValue(true);
    mockClient.getStats.mockReturnValue({
      isConnected: true, status: 'connected', reconnectAttempts: 0,
      queuedMessages: 0, totalSent: 10, totalReceived: 5,
    });
    mockClient.getMessageQueue.mockReturnValue([]);
    mockClient.initialize.mockResolvedValue(undefined);
    app = createApp();
  });

  describe('GET /linda/health', () => {
    it('returns health status', async () => {
      const res = await request(app).get('/linda/health');
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
    });
  });

  describe('GET /linda/stats', () => {
    it('returns stats', async () => {
      const res = await request(app).get('/linda/stats');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /linda/status', () => {
    it('returns status', async () => {
      const res = await request(app).get('/linda/status');
      expect(res.status).toBe(200);
    });
  });

  describe('POST /linda/ready', () => {
    it('returns success when connected', async () => {
      const res = await request(app).post('/linda/ready');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /linda/disconnect', () => {
    it('handles disconnect', async () => {
      const res = await request(app).post('/linda/disconnect');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /linda/conversations', () => {
    it('returns conversations list', async () => {
      const res = await request(app).get('/linda/conversations');
      expect(res.status).toBe(200);
    });
  });

  describe('POST /linda/webhook', () => {
    it('handles webhook event', async () => {
      const res = await request(app)
        .post('/linda/webhook')
        .send({ event: 'message', data: {} });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /linda/send/:conversationId', () => {
    it('returns 400 when phoneNumber missing', async () => {
      const res = await request(app)
        .post('/linda/send/conv-123')
        .send({ message: 'Hello' });
      expect(res.status).toBe(400);
    });
    it('sends message with valid body', async () => {
      const res = await request(app)
        .post('/linda/send/conv-123')
        .send({ phoneNumber: '962790000000', message: 'Hello' });
      expect([200, 201]).toContain(res.status);
    });
  });
});
