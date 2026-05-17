import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';

const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      lindaBroadcastCampaign: {
        findMany: fn(),
        findUnique: fn(),
        create: fn(),
        update: fn(),
      },
    },
  };
});

const mockLinda = {
  getStatus: vi.fn(() => 'READY'),
  initialize: vi.fn(async () => {}),
  isConnected: vi.fn(() => true),
  getStats: vi.fn(() => ({
    status: 'READY',
    isConnected: true,
    queuedMessages: 0,
    reconnectAttempts: 0,
    messagesSent: 0,
    messagesReceived: 0,
  })),
  getQRCode: vi.fn(() => null),
  disconnect: vi.fn(async () => {}),
  sendMessage: vi.fn(async () => 'msg-1'),
  broadcastMessage: vi.fn(async (phones: string[]) =>
    phones.map(p => ({ phone: p, messageId: `m-${p}` }))
  ),
  getMessageQueue: vi.fn(() => []),
  getConversations: vi.fn(async () => []),
  getConversationHistory: vi.fn(async () => []),
};

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../config/env.js', () => ({ LINDA_ENABLED: true }));
vi.mock('../middleware/rbac.js', () => ({
  requireRole: () => (_req: Request, _res: Response, next: NextFunction) => next(),
  requirePermission: () => (_req: Request, _res: Response, next: NextFunction) => next(),
}));
vi.mock('../services/socketServer.js', () => ({
  getSocketServer: () => ({ emitLindaMessage: vi.fn() }),
}));
vi.mock('../services/whatsapp/whatsappUtils.js', () => ({
  rateLimiter: {
    canSend: vi.fn(() => ({ allowed: true, retryAfterMs: 0 })),
  },
}));
vi.mock('../services/whatsapp/lindaClient.js', () => ({
  LindaStatus: {
    DISCONNECTED: 'DISCONNECTED',
    AUTHENTICATING: 'AUTHENTICATING',
    READY: 'READY',
    RECONNECTING: 'RECONNECTING',
    ERROR: 'ERROR',
  },
  getLindaClient: () => mockLinda,
}));

import lindaRoutes from './linda';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as Request & { user?: { id: string; role: string; email: string } }).user = {
      id: 'u-1',
      role: 'owner',
      email: 'owner@whitecaves.ae',
    };
    next();
  });
  app.use('/api/linda', lindaRoutes);
  app.use(
    (err: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
      res.status(err.statusCode || 500).json({ success: false, error: err.message });
    }
  );
  return app;
}

describe('Linda routes — campaign foundation', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockPrisma.lindaBroadcastCampaign.create.mockResolvedValue({
      id: 'camp-1',
      name: 'Weekend Campaign',
      targetList: ['971500000001'],
      messageTemplate: 'Hello {{name}}',
      templateVars: { name: 'Sara' },
      status: 'scheduled',
      scheduledAt: new Date(),
    });

    mockPrisma.lindaBroadcastCampaign.findUnique.mockResolvedValue({
      id: 'camp-1',
      name: 'Weekend Campaign',
      targetList: ['971500000001', '971500000002'],
      messageTemplate: 'Hello {{name}}',
      templateVars: { name: 'Sara' },
      status: 'scheduled',
      scheduledAt: new Date(),
    });

    mockPrisma.lindaBroadcastCampaign.update
      .mockResolvedValueOnce({ id: 'camp-1', status: 'running' })
      .mockResolvedValueOnce({ id: 'camp-1', status: 'completed', sentCount: 2, failedCount: 0 });

    mockPrisma.lindaBroadcastCampaign.findMany.mockResolvedValue([{ id: 'camp-1' }]);
  });

  it('creates a scheduled campaign', async () => {
    const res = await request(createApp())
      .post('/api/linda/campaigns')
      .send({
        name: 'Weekend Campaign',
        targetList: ['+971 50 000 0001'],
        messageTemplate: 'Hello {{name}}',
        templateVars: { name: 'Sara' },
        scheduledAt: new Date().toISOString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(mockPrisma.lindaBroadcastCampaign.create).toHaveBeenCalled();
  });

  it('dispatches a campaign by id', async () => {
    const res = await request(createApp()).post('/api/linda/campaigns/camp-1/dispatch').send({});

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockLinda.broadcastMessage).toHaveBeenCalled();
  });

  it('dispatches due scheduled campaigns', async () => {
    const res = await request(createApp()).post('/api/linda/campaigns/dispatch-due').send({});

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('dispatched');
  });

  it('returns 409 when dispatching campaign from non-dispatchable status', async () => {
    mockPrisma.lindaBroadcastCampaign.findUnique.mockResolvedValueOnce({
      id: 'camp-closed',
      name: 'Closed Campaign',
      targetList: ['971500000001'],
      messageTemplate: 'Hello',
      templateVars: null,
      status: 'completed',
      scheduledAt: null,
    });

    const res = await request(createApp())
      .post('/api/linda/campaigns/camp-closed/dispatch')
      .send({});

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/cannot be dispatched from status/i);
    expect(mockLinda.broadcastMessage).not.toHaveBeenCalled();
  });

  it('returns 404 when dispatching unknown campaign id', async () => {
    mockPrisma.lindaBroadcastCampaign.findUnique.mockResolvedValueOnce(null);

    const res = await request(createApp())
      .post('/api/linda/campaigns/missing-id/dispatch')
      .send({});

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Campaign not found/i);
  });
});
