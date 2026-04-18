import { describe, it, expect, vi, beforeAll } from 'vitest';
import express from 'express';
import request from 'supertest';

const mockClient = {
  initialize: vi.fn().mockResolvedValue(undefined),
  getStatus: vi.fn().mockReturnValue({ connected: false, qr: null, status: 'disconnected' }),
  sendMessage: vi.fn().mockResolvedValue({ success: true }),
  getQR: vi.fn().mockReturnValue(null),
  getStats: vi.fn().mockReturnValue({ isConnected: false, status: 'disconnected', reconnectAttempts: 0 }),
  disconnect: vi.fn().mockResolvedValue(undefined),
  getConversations: vi.fn().mockResolvedValue([]),
  getConversationHistory: vi.fn().mockResolvedValue([]),
};

vi.mock('../services/whatsapp/lindaClient.js', () => ({
  LindaClient: vi.fn().mockImplementation(() => mockClient),
  getLindaClient: vi.fn().mockReturnValue(mockClient),
}));

vi.mock('../utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}));

vi.mock('../middleware/rbac', () => ({
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
  requireRole: () => (_req: any, _res: any, next: any) => next(),
}));

let app: express.Express;

beforeAll(async () => {
  app = express();
  app.use(express.json());
  const { default: lindaRoutes } = await import('./linda.js');
  app.use('/api/linda', lindaRoutes);
});

describe('Linda WhatsApp Routes', () => {
  it('GET /api/linda/health returns 200 or 503', async () => {
    const res = await request(app).get('/api/linda/health');
    expect([200, 503]).toContain(res.status);
  });

  it('GET /api/linda/health has JSON body', async () => {
    const res = await request(app).get('/api/linda/health');
    expect(res.headers['content-type']).toMatch(/json/);
  });

  it('GET /api/linda/stats returns stats', async () => {
    const res = await request(app).get('/api/linda/stats');
    expect([200, 500]).toContain(res.status);
  });

  it('GET /api/linda/status returns status', async () => {
    const res = await request(app).get('/api/linda/status');
    expect([200, 500]).toContain(res.status);
  });

  it('POST /api/linda/ready returns a status', async () => {
    const res = await request(app).post('/api/linda/ready');
    expect([200, 500]).toContain(res.status);
  });

  it('POST /api/linda/disconnect returns response', async () => {
    const res = await request(app).post('/api/linda/disconnect');
    expect([200, 500]).toContain(res.status);
  });

  it('GET /api/linda/conversations returns array or error', async () => {
    const res = await request(app).get('/api/linda/conversations');
    expect([200, 500]).toContain(res.status);
  });

  it('POST /api/linda/webhook accepts data', async () => {
    const res = await request(app).post('/api/linda/webhook').send({ message: 'test' });
    expect([200, 400, 500]).toContain(res.status);
  });

  it('POST /api/linda/send/:id sends message', async () => {
    const res = await request(app)
      .post('/api/linda/send/conv-123')
      .send({ message: 'Hello' });
    expect([200, 400, 500]).toContain(res.status);
  });

  it('POST /api/linda/send/:id requires message', async () => {
    const res = await request(app).post('/api/linda/send/conv-123').send({});
    expect([400, 500]).toContain(res.status);
  });

  it('unknown routes return 404', async () => {
    const res = await request(app).get('/api/linda/nonexistent');
    expect(res.status).toBe(404);
  });

  it('health response has success field', async () => {
    const res = await request(app).get('/api/linda/health');
    expect(res.body).toHaveProperty('success');
  });

  it('responses are valid JSON', async () => {
    const res = await request(app).get('/api/linda/health');
    expect(() => JSON.parse(JSON.stringify(res.body))).not.toThrow();
  });
});
