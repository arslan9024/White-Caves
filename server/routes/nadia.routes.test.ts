import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';

const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      nadiaConversation: {
        create: fn(),
        findUnique: fn(),
        findMany: fn(),
        count: fn(),
        update: fn(),
      },
      nadiaMessage: {
        create: fn(),
        update: fn(),
        findMany: fn(),
        count: fn(),
      },
      nadiaConversationQueue: {
        count: fn(),
      },
      getQueueStats: fn(),
    },
  };
});

const { viSendMessageMock } = vi.hoisted(() => ({
  viSendMessageMock: vi.fn(async () => 'wa-msg-1'),
}));

const { viRoleHasPermissionMock } = vi.hoisted(() => ({
  viRoleHasPermissionMock: vi.fn(() => true),
}));

const { viQueueConversationForAssignmentMock } = vi.hoisted(() => ({
  viQueueConversationForAssignmentMock: vi.fn(async () => ({ id: 'q-1' })),
}));

const { viGenerateWhatsAppAutoResponseMock } = vi.hoisted(() => ({
  viGenerateWhatsAppAutoResponseMock: vi.fn(() => ({
    classification: {
      intent: 'property_search',
      confidence: 0.8,
      sentiment: 'positive',
      entities: [],
      leadScore: 70,
      shouldEscalate: false,
      escalationReason: null,
      firstResponseState: 'auto_reply',
    },
    response: 'Here are some options',
    responseType: 'auto_reply',
  })),
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));

vi.mock('../middleware/errorHandler.js', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  asyncHandler: (fn: unknown) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(
      (fn as (req: Request, res: Response, next: NextFunction) => unknown)(req, res, next)
    ).catch(next),
}));

vi.mock('../middleware/rbac', () => ({
  requirePermission: () => (_req: unknown, _res: unknown, next: () => void) => next(),
  resolveBackendRole: (role: string) => role,
  roleHasPermission: viRoleHasPermissionMock,
}));

vi.mock('../services/nadia/messageProcessor.js', () => ({
  detectIntent: vi.fn(() => 'property_search'),
  calculateLeadScore: vi.fn(() => 72),
  detectSentiment: vi.fn(() => 'neutral'),
  extractEntities: vi.fn(() => []),
  generateBotResponse: vi.fn(() => 'Thanks for your message'),
}));

vi.mock('../services/nadia/queueManager.js', () => ({
  getQueuedConversations: vi.fn(async () => []),
  assignFromQueue: vi.fn(async () => ({ id: 'q-1', status: 'assigned' })),
  queueConversationForAssignment: viQueueConversationForAssignmentMock,
  getQueueStats: mockPrisma.getQueueStats,
}));

vi.mock('../services/nadia/whatsappAssistant.js', () => ({
  classifyWhatsAppIntent: vi.fn(() => ({
    intent: 'property_search',
    confidence: 0.8,
    sentiment: 'positive',
    entities: [],
    leadScore: 70,
    shouldEscalate: false,
    escalationReason: null,
  })),
  generateWhatsAppAutoResponse: viGenerateWhatsAppAutoResponseMock,
}));

vi.mock('../services/WhatsAppBotService.js', () => ({
  default: {
    sendMessage: viSendMessageMock,
  },
}));

import nadiaRoutes from './nadia.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as Request & { user?: { id: string; role: string; email: string } }).user = {
      id: 'u-1',
      role: 'manager',
      email: 'manager@whitecaves.ae',
    };
    next();
  });
  app.use('/api/nadia', nadiaRoutes);
  app.use(
    (err: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
      res.status(err.statusCode || 500).json({ success: false, error: err.message });
    }
  );
  return app;
}

describe('Nadia Routes — inbox wiring endpoints', () => {
  const conversation = {
    id: 'conv-1',
    status: 'active',
    customerPhone: '+971500000000',
    routedAt: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.NADIA_ESCALATION_CONFIDENCE_THRESHOLD;
    viSendMessageMock.mockResolvedValue('wa-msg-1');
    viRoleHasPermissionMock.mockReturnValue(true);
    viQueueConversationForAssignmentMock.mockResolvedValue({ id: 'q-1' });
    viGenerateWhatsAppAutoResponseMock.mockReturnValue({
      classification: {
        intent: 'property_search',
        confidence: 0.8,
        sentiment: 'positive',
        entities: [],
        leadScore: 70,
        shouldEscalate: false,
        escalationReason: null,
        firstResponseState: 'auto_reply',
      },
      response: 'Here are some options',
      responseType: 'auto_reply',
    });

    mockPrisma.nadiaConversation.findUnique.mockResolvedValue(conversation);
    mockPrisma.nadiaConversation.update.mockResolvedValue({
      ...conversation,
      status: 'assigned_to_agent',
      agentPhone: '+971511111111',
      messages: [],
      queue: null,
    });

    mockPrisma.nadiaMessage.create.mockResolvedValue({
      id: 'msg-1',
      conversationId: 'conv-1',
      direction: 'outbound',
      body: 'Hello',
      messageType: 'text',
      status: 'pending',
      timestamp: new Date(),
    });
    mockPrisma.nadiaMessage.update.mockResolvedValue({
      id: 'msg-1',
      conversationId: 'conv-1',
      direction: 'outbound',
      body: 'Hello',
      messageType: 'text',
      status: 'sent',
      timestamp: new Date(),
    });
    mockPrisma.nadiaMessage.findMany.mockResolvedValue([]);
    mockPrisma.nadiaMessage.count.mockResolvedValue(0);
    mockPrisma.nadiaConversation.findMany.mockResolvedValue([]);
    mockPrisma.nadiaConversation.count.mockResolvedValue(0);
    mockPrisma.nadiaConversationQueue.count.mockResolvedValue(0);
    mockPrisma.getQueueStats.mockResolvedValue({
      totalQueued: 2,
      hotCount: 1,
      warmCount: 1,
      coldCount: 0,
      averagePriority: 2.5,
      oldestWaitMinutes: 18,
      queueHealth: 'Good',
    });
  });

  it('assigns a conversation using explicit assign endpoint', async () => {
    const res = await request(createApp())
      .patch('/api/nadia/conversations/conv-1/assign')
      .send({ agentPhone: '+971511111111' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockPrisma.nadiaConversation.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'conv-1' },
        data: expect.objectContaining({
          status: 'assigned_to_agent',
          agentPhone: '+971511111111',
        }),
      })
    );
  });

  it('rejects assign endpoint when agentPhone is missing', async () => {
    const res = await request(createApp()).patch('/api/nadia/conversations/conv-1/assign').send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/agentPhone/i);
  });

  it('rejects generic patch assign status when role lacks assign permission', async () => {
    viRoleHasPermissionMock.mockReturnValue(false);

    const res = await request(createApp())
      .patch('/api/nadia/conversations/conv-1')
      .send({ status: 'assigned_to_agent', agentPhone: '+971511111111' });

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/assign_whatsapp_conversations/i);
  });

  it('rejects generic patch close status when role lacks close permission', async () => {
    viRoleHasPermissionMock.mockReturnValue(false);

    const res = await request(createApp())
      .patch('/api/nadia/conversations/conv-1')
      .send({ status: 'closed' });

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/close_whatsapp_conversations/i);
  });

  it('closes a conversation using explicit close endpoint', async () => {
    mockPrisma.nadiaConversation.update.mockResolvedValueOnce({
      ...conversation,
      status: 'closed',
      closedReason: 'resolved',
      closedAt: new Date(),
      messages: [],
      queue: null,
    });

    const res = await request(createApp())
      .patch('/api/nadia/conversations/conv-1/close')
      .send({ reason: 'resolved' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('closed');
  });

  it('sends an agent reply via explicit reply endpoint', async () => {
    const res = await request(createApp())
      .post('/api/nadia/conversations/conv-1/reply')
      .send({ content: 'Thanks, I can help with that.' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(mockPrisma.nadiaMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          conversationId: 'conv-1',
          direction: 'outbound',
          status: 'pending',
        }),
      })
    );
    expect(viSendMessageMock).toHaveBeenCalledWith(
      '+971500000000',
      'Thanks, I can help with that.'
    );
    expect(mockPrisma.nadiaMessage.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'msg-1' },
        data: expect.objectContaining({ status: 'sent', waMessageId: 'wa-msg-1' }),
      })
    );
  });

  it('rejects generic patch with invalid status', async () => {
    const res = await request(createApp())
      .patch('/api/nadia/conversations/conv-1')
      .send({ status: 'unknown_status' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid status/i);
  });

  it('returns 502 and marks outbound message failed when WhatsApp adapter send fails', async () => {
    viSendMessageMock.mockRejectedValueOnce(new Error('meta upstream unavailable'));

    const res = await request(createApp())
      .post('/api/nadia/conversations/conv-1/reply')
      .send({ content: 'Please confirm viewing time' });

    expect(res.status).toBe(502);
    expect(res.body.error).toMatch(/Failed to send WhatsApp reply/i);
    expect(mockPrisma.nadiaMessage.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'msg-1' },
        data: { status: 'failed' },
      })
    );
  });

  it('rejects message creation with invalid senderType', async () => {
    const res = await request(createApp())
      .post('/api/nadia/conversations/conv-1/messages')
      .send({ content: 'hello', senderType: 'bot' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/senderType/i);
  });

  it('returns queue stats for the Nadia dashboard', async () => {
    const res = await request(createApp()).get('/api/nadia/queue-stats');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(
      expect.objectContaining({
        totalQueued: 2,
        oldestInQueueMinutes: 18,
        byPriority: expect.objectContaining({
          URGENT: 1,
          HIGH: 1,
          NORMAL: 0,
          LOW: 0,
        }),
      })
    );
  });

  it('queues escalation with structured handoff context on assistant/respond', async () => {
    viGenerateWhatsAppAutoResponseMock.mockReturnValueOnce({
      classification: {
        intent: 'complaint',
        confidence: 0.52,
        sentiment: 'negative',
        entities: ['issue:delay'],
        leadScore: 41,
        shouldEscalate: true,
        escalationReason: 'low_intent_confidence',
        firstResponseState: 'escalate_to_agent',
      },
      response: 'Connecting you to our specialist.',
      responseType: 'escalate_to_agent',
    });

    const res = await request(createApp()).post('/api/nadia/assistant/respond').send({
      conversationId: 'conv-1',
      message: 'Please help me with this serious issue and delay',
      customerName: 'Amina',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(viQueueConversationForAssignmentMock).toHaveBeenCalledWith(
      'conv-1',
      'low_intent_confidence',
      expect.objectContaining({
        source: 'assistant/respond',
        messagePreview: 'Please help me with this serious issue and delay',
        classification: expect.objectContaining({
          intent: 'complaint',
          confidence: 0.52,
          sentiment: 'negative',
          firstResponseState: 'escalate_to_agent',
          escalationReason: 'low_intent_confidence',
        }),
      })
    );
  });

  it('uses configured escalation confidence threshold from env in assistant/respond', async () => {
    process.env.NADIA_ESCALATION_CONFIDENCE_THRESHOLD = '0.74';

    const res = await request(createApp()).post('/api/nadia/assistant/respond').send({
      conversationId: 'conv-1',
      message: 'Need details for Marina apartment',
      customerName: 'Amina',
    });

    expect(res.status).toBe(200);
    expect(viGenerateWhatsAppAutoResponseMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Need details for Marina apartment',
        customerName: 'Amina',
        escalationConfidenceThreshold: 0.74,
      })
    );
    expect(res.body.data.escalationPolicy).toEqual({ confidenceThreshold: 0.74 });
  });
});
