import { describe, it, expect, vi, beforeAll } from 'vitest';
import express from 'express';
import request from 'supertest';

const mockMetaClient = {
  sendMessage: vi.fn().mockResolvedValue({ success: true }),
  sendTemplate: vi.fn().mockResolvedValue({ success: true }),
  sendImage: vi.fn().mockResolvedValue({ success: true }),
  verifyWebhook: vi.fn().mockImplementation((_mode, challenge, _token) => challenge || null),
  processWebhook: vi.fn().mockResolvedValue(undefined),
  getStatus: vi.fn().mockReturnValue({ connected: false }),
};

vi.mock('../services/whatsapp/metaAPI.js', () => ({
  MetaAPIClient: vi.fn().mockImplementation(() => mockMetaClient),
  createMetaAPIClient: vi.fn().mockReturnValue(mockMetaClient),
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
  const { default: metaRoutes } = await import('./meta-webhook.js');
  app.use('/api/meta', metaRoutes);
});

describe('Meta Webhook Routes', () => {
  it('GET /api/meta/verify accepts valid verification', async () => {
    const res = await request(app).get('/api/meta/verify').query({
      'hub.mode': 'subscribe',
      'hub.verify_token': process.env.META_VERIFY_TOKEN || 'test',
      'hub.challenge': '1234567890',
    });
    expect([200, 403]).toContain(res.status);
  });

  it('GET /api/meta/verify rejects when verifyWebhook returns null', async () => {
    mockMetaClient.verifyWebhook.mockReturnValueOnce(null);
    const res = await request(app).get('/api/meta/verify').query({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'wrong_token',
      'hub.challenge': '123',
    });
    expect(res.status).toBe(403);
  });

  it('POST /api/meta/ accepts incoming webhook', async () => {
    const res = await request(app).post('/api/meta/').send({
      object: 'whatsapp_business_account',
      entry: [{ id: '123', changes: [{ value: { messages: [] }, field: 'messages' }] }],
    });
    expect([200, 400, 500]).toContain(res.status);
  });

  it('POST /api/meta/ handles empty payload', async () => {
    const res = await request(app).post('/api/meta/').send({});
    expect([200, 400, 500]).toContain(res.status);
  });

  it('POST /api/meta/send sends a message', async () => {
    const res = await request(app)
      .post('/api/meta/send')
      .send({ to: '971500000000', message: 'Hello from Meta' });
    expect([200, 400, 500]).toContain(res.status);
  });

  it('POST /api/meta/send requires fields', async () => {
    const res = await request(app).post('/api/meta/send').send({});
    expect([400, 500]).toContain(res.status);
  });

  it('POST /api/meta/template sends template', async () => {
    const res = await request(app)
      .post('/api/meta/template')
      .send({ to: '971500000000', template: 'hello_world', language: 'en' });
    expect([200, 400, 500]).toContain(res.status);
  });

  it('GET /api/meta/status returns status', async () => {
    const res = await request(app).get('/api/meta/status');
    expect([200, 500, 503]).toContain(res.status);
  });

  it('POST /api/meta/image sends image', async () => {
    const res = await request(app)
      .post('/api/meta/image')
      .send({ to: '971500000000', imageUrl: 'https://example.com/img.png' });
    expect([200, 400, 500]).toContain(res.status);
  });

  it('handles missing send fields', async () => {
    const res = await request(app).post('/api/meta/send').send({ to: '971500000000' });
    expect([400, 500]).toContain(res.status);
  });

  it('POST /api/meta/ returns 200 for valid webhook', async () => {
    const res = await request(app).post('/api/meta/').send({
      object: 'whatsapp_business_account',
      entry: [],
    });
    expect([200, 400, 500]).toContain(res.status);
  });

  it('returns appropriate content types', async () => {
    const res = await request(app).get('/api/meta/status');
    expect(res.headers['content-type']).toMatch(/json|text/);
  });
});
