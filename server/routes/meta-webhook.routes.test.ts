import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type Request, type Response, type NextFunction } from 'express';
import request from 'supertest';

const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      nadiaMessage: {
        findFirst: fn(),
        create: fn(),
        update: fn(),
      },
      nadiaConversation: {
        findFirst: fn(),
        create: fn(),
        update: fn(),
      },
      lead: {
        findFirst: fn(),
        create: fn(),
      },
      activity: {
        create: fn(),
      },
    },
  };
});

const mockParseWebhookEvent = vi.fn();
const mockVerifyWebhook = vi.fn();
const mockSendMessage = vi.fn();
const mockSendTemplate = vi.fn();
const mockGetStats = vi.fn();

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../middleware/rbac.js', () => ({
  requireRole: () => (_req: Request, _res: Response, next: NextFunction) => next(),
}));
vi.mock('../services/nadia/messageProcessor.js', () => ({
  detectIntent: vi.fn(() => 'property_search'),
  calculateLeadScore: vi.fn(() => 72),
}));
vi.mock('../services/socketServer.js', () => ({
  getSocketServer: () => ({
    emitMetaMessage: vi.fn(),
    emitMetaStatus: vi.fn(),
  }),
}));
vi.mock('../services/whatsapp/whatsappUtils.js', () => ({
  verifyWebhookSignature: vi.fn(() => true),
  normalizePhone: vi.fn((phone: string) => phone),
  rateLimiter: {
    canSend: vi.fn(() => ({ allowed: true, retryAfterMs: 0 })),
  },
}));
vi.mock('../services/whatsapp/metaAPI.js', () => ({
  createMetaAPIClient: vi.fn(() => ({
    parseWebhookEvent: mockParseWebhookEvent,
    verifyWebhook: mockVerifyWebhook,
    sendMessage: mockSendMessage,
    sendTemplate: mockSendTemplate,
    getStats: mockGetStats,
  })),
}));

import metaWebhookRoutes from './meta-webhook';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/webhooks/meta', metaWebhookRoutes);
  app.use(
    (err: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
      res.status(err.statusCode || 500).json({ success: false, error: err.message });
    }
  );
  return app;
}

const inboundWebhookPayload = {
  object: 'whatsapp_business_account',
  entry: [
    {
      id: 'entry-1',
      changes: [
        {
          field: 'messages',
          value: {
            messaging_product: 'whatsapp',
            metadata: { phone_number_id: 'pnid-1' },
            messages: [
              {
                id: 'wamid.1',
                from: '+971500000001',
                timestamp: String(Math.floor(Date.now() / 1000)),
                type: 'text',
                text: { body: 'Looking for a 2BR in Marina' },
              },
            ],
          },
        },
      ],
    },
  ],
};

describe('Meta webhook routes — inbound lead auto-create', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParseWebhookEvent.mockReturnValue(inboundWebhookPayload);

    mockPrisma.nadiaMessage.findFirst.mockResolvedValue(null);
    mockPrisma.nadiaConversation.findFirst.mockResolvedValue(null);
    mockPrisma.nadiaConversation.create.mockResolvedValue({
      id: 'conv-1',
      customerPhone: '+971500000001',
      status: 'active',
    });
    mockPrisma.nadiaMessage.create.mockResolvedValue({
      id: 'msg-1',
      conversationId: 'conv-1',
    });
    mockPrisma.nadiaConversation.update.mockResolvedValue({ id: 'conv-1' });

    mockPrisma.lead.findFirst.mockResolvedValue(null);
    mockPrisma.lead.create.mockResolvedValue({ id: 'lead-1' });
    mockPrisma.activity.create.mockResolvedValue({ id: 'act-1' });
  });

  it('auto-creates a CRM lead from inbound WhatsApp when no lead exists', async () => {
    const res = await request(createApp()).post('/api/webhooks/meta').send(inboundWebhookPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockPrisma.lead.findFirst).toHaveBeenCalled();
    expect(mockPrisma.lead.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          source: 'whatsapp',
          status: 'new',
        }),
      })
    );
    expect(mockPrisma.activity.create).toHaveBeenCalled();
  });

  it('does not create duplicate lead when a lead with phone already exists', async () => {
    mockPrisma.lead.findFirst.mockResolvedValueOnce({
      id: 'lead-existing',
      status: 'new',
      source: 'whatsapp',
    });

    const res = await request(createApp()).post('/api/webhooks/meta').send(inboundWebhookPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockPrisma.lead.create).not.toHaveBeenCalled();
  });

  it('ignores duplicate webhook message IDs before lead creation', async () => {
    mockPrisma.nadiaMessage.findFirst.mockResolvedValueOnce({
      id: 'existing-msg',
      conversationId: 'conv-1',
    });

    const res = await request(createApp()).post('/api/webhooks/meta').send(inboundWebhookPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockPrisma.lead.findFirst).not.toHaveBeenCalled();
    expect(mockPrisma.lead.create).not.toHaveBeenCalled();
  });
});
