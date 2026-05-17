import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
const { mockVerifyWebhookSignature } = vi.hoisted(() => ({
  mockVerifyWebhookSignature: vi.fn(() => true),
}));

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
  verifyWebhookSignature: mockVerifyWebhookSignature,
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
  app.use(
    express.json({
      verify: (req, _res, buf) => {
        (req as Request & { rawBody?: string }).rawBody = buf.toString('utf8');
      },
    })
  );
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

const statusWebhookPayload = {
  object: 'whatsapp_business_account',
  entry: [
    {
      id: 'entry-2',
      changes: [
        {
          field: 'messages',
          value: {
            messaging_product: 'whatsapp',
            metadata: { phone_number_id: 'pnid-1' },
            statuses: [
              {
                id: 'wamid-status-1',
                status: 'delivered',
                timestamp: String(Math.floor(Date.now() / 1000)),
                recipient_id: '+971500000001',
              },
            ],
          },
        },
      ],
    },
  ],
};

const inboundWebhookPayloadNoId = {
  object: 'whatsapp_business_account',
  entry: [
    {
      id: 'entry-3',
      changes: [
        {
          field: 'messages',
          value: {
            messaging_product: 'whatsapp',
            metadata: { phone_number_id: 'pnid-1' },
            messages: [
              {
                from: '+971500000001',
                timestamp: '1715000000',
                type: 'text',
                text: { body: 'Need pricing details' },
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
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.clearAllMocks();
    mockVerifyWebhookSignature.mockReturnValue(true);
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

    delete process.env.META_APP_SECRET;
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

  it('uses deterministic fallback ID when message.id is missing to block duplicate processing', async () => {
    mockParseWebhookEvent.mockReturnValue(inboundWebhookPayloadNoId);

    mockPrisma.nadiaMessage.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 'existing-no-id', conversationId: 'conv-1' });

    const first = await request(createApp())
      .post('/api/webhooks/meta')
      .send(inboundWebhookPayloadNoId);
    const second = await request(createApp())
      .post('/api/webhooks/meta')
      .send(inboundWebhookPayloadNoId);

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(mockPrisma.lead.create).toHaveBeenCalledTimes(1);
  });

  it('rejects webhook requests with missing signature header when META_APP_SECRET is set', async () => {
    process.env.META_APP_SECRET = 'super-secret';

    const res = await request(createApp()).post('/api/webhooks/meta').send(inboundWebhookPayload);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Missing signature/i);
    expect(mockVerifyWebhookSignature).not.toHaveBeenCalled();
  });

  it('rejects webhook when signature verification fails', async () => {
    process.env.META_APP_SECRET = 'super-secret';
    mockVerifyWebhookSignature.mockReturnValueOnce(false);

    const res = await request(createApp())
      .post('/api/webhooks/meta')
      .set('x-hub-signature-256', 'sha256=bad')
      .send(inboundWebhookPayload);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Invalid signature/i);
  });

  it('uses raw request body for signature verification', async () => {
    process.env.META_APP_SECRET = 'super-secret';
    mockVerifyWebhookSignature.mockReturnValueOnce(true);

    const res = await request(createApp())
      .post('/api/webhooks/meta')
      .set('x-hub-signature-256', 'sha256=good')
      .send(inboundWebhookPayload);

    expect(res.status).toBe(200);
    expect(mockVerifyWebhookSignature).toHaveBeenCalledWith(
      expect.stringContaining('"object":"whatsapp_business_account"'),
      'sha256=good',
      'super-secret'
    );
  });

  it('ignores duplicate status updates when status already matches', async () => {
    mockParseWebhookEvent.mockReturnValueOnce(statusWebhookPayload);
    mockPrisma.nadiaMessage.findFirst.mockResolvedValueOnce({
      id: 'msg-status-1',
      waMessageId: 'wamid-status-1',
      status: 'delivered',
    });

    const res = await request(createApp()).post('/api/webhooks/meta').send(statusWebhookPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockPrisma.nadiaMessage.update).not.toHaveBeenCalled();
  });
});
