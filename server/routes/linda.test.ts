/**
 * linda routes - Test Suite
 * 13 tests covering /api/linda/* endpoints
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

const { mockSendMessage, mockClient } = vi.hoisted(() => {
  const mockSendMessage = vi.fn().mockResolvedValue({ success: true, messageId: 'msg_1' });
  return {
    mockSendMessage,
    mockClient: {
      sendMessage: mockSendMessage,
      getStatus: vi.fn().mockResolvedValue({ connected: true, ready: true }),
      getConversations: vi.fn().mockResolvedValue([]),
      getHistory: vi.fn().mockResolvedValue([]),
      getConversationHistory: vi.fn().mockResolvedValue([]),
      getMessageQueue: vi.fn().mockReturnValue([]),
      isConnected: vi.fn().mockReturnValue(true),
      disconnect: vi.fn().mockResolvedValue(undefined),
      getStats: vi.fn().mockReturnValue({ messagesProcessed: 0, conversationsActive: 0, isConnected: true, status: 'connected', reconnectAttempts: 0 }),
      isReady: vi.fn().mockReturnValue(true),
      initialize: vi.fn().mockResolvedValue(undefined),
    },
  };
});

vi.mock('../services/whatsapp/lindaClient', () => ({
  getLindaClient: () => mockClient,
  LindaClient: vi.fn(),
}));

vi.mock('../middleware/rbac', () => ({
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
  requireRole: () => (_req: any, _res: any, next: any) => next(),
}));

vi.mock('../utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}));

vi.mock('../database.js', () => ({
  default: {
    lead: { findMany: vi.fn().mockResolvedValue([]) },
    conversation: { findMany: vi.fn().mockResolvedValue([]) },
  },
}));

import lindaRouter from './linda';

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/linda', lindaRouter);
  return app;
}

describe('Linda Routes', () => {
  let app: ReturnType<typeof buildApp>;

  beforeEach(() => {
    vi.clearAllMocks();
    app = buildApp();
  });

  it('GET /api/linda/status returns 200', async () => {
    const res = await request(app).get('/api/linda/status');
    expect(res.status).toBe(200);
  });

  it('GET /api/linda/status returns JSON', async () => {
    const res = await request(app).get('/api/linda/status');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  it('GET /api/linda/health returns 200', async () => {
    const res = await request(app).get('/api/linda/health');
    expect(res.status).toBe(200);
  });

  it('GET /api/linda/stats returns 200', async () => {
    const res = await request(app).get('/api/linda/stats');
    expect(res.status).toBe(200);
  });

  it('GET /api/linda/conversations returns 200', async () => {
    const res = await request(app).get('/api/linda/conversations');
    expect(res.status).toBe(200);
  });

  it('POST /api/linda/send/:conversationId sends message', async () => {
    const res = await request(app)
      .post('/api/linda/send/conv_1')
      .send({ phoneNumber: '971501234567', message: 'Hello' });
    expect([200, 201]).toContain(res.status);
  });

  it('POST /api/linda/send/:conversationId calls sendMessage', async () => {
    await request(app)
      .post('/api/linda/send/conv_1')
      .send({ phoneNumber: '971501234567', message: 'Test' });
    expect(mockSendMessage).toHaveBeenCalled();
  });

  it('POST /api/linda/webhook returns 200', async () => {
    const res = await request(app)
      .post('/api/linda/webhook')
      .send({ event: 'message', data: {} });
    expect(res.status).toBe(200);
  });

  it('POST /api/linda/ready returns 200', async () => {
    const res = await request(app).post('/api/linda/ready').send({});
    expect(res.status).toBe(200);
  });

  it('POST /api/linda/disconnect returns 200', async () => {
    const res = await request(app).post('/api/linda/disconnect').send({});
    expect(res.status).toBe(200);
  });

  it('GET /api/linda/conversations/:phone/history returns 200', async () => {
    const res = await request(app).get('/api/linda/conversations/971501234567/history');
    expect(res.status).toBe(200);
  });

  it('handles server errors gracefully on send', async () => {
    mockSendMessage.mockRejectedValueOnce(new Error('Network error'));
    const res = await request(app)
      .post('/api/linda/send/conv_1')
      .send({ phoneNumber: '971501234567', message: 'Test' });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('GET nonexistent route returns 404', async () => {
    const res = await request(app).get('/api/linda/nonexistent');
    expect(res.status).toBe(404);
  });
});
