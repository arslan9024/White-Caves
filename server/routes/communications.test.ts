/**
 * Communications Routes — Unit Tests
 * Tests /api/communications endpoints: send, messages, conversations, status
 * Covers: authorization, validation, IDOR, pagination, sanitization, channel resolution
 * All Prisma calls are mocked — no database needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      activity: {
        create: fn().mockResolvedValue({ id: 'act-1', createdAt: new Date('2026-01-01T12:00:00Z') }),
        findMany: fn().mockResolvedValue([]),
        count: fn().mockResolvedValue(0),
      },
      lead: {
        findFirst: fn().mockResolvedValue(null),
      },
    },
  };
});

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../middleware/errorHandler', () => ({
  AppError: class extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
    }
  },
  asyncHandler: (fn: any) => (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next),
}));
vi.mock('../middleware/auth', () => ({ default: null }));
vi.mock('../utils/sanitize', () => ({
  sanitizeString: (str: string) => str.trim(),
}));
vi.mock('../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
  }),
}));

import communicationsRoutes from './communications';

// ── Test app factory ─────────────────────────────────────────────────
function createApp(role: string = 'owner', userId = 'user-1') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: userId, email: 'test@whitecaves.ae', role };
    next();
  });
  app.use('/api/communications', communicationsRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const VALID_ID = 'aabbccddee11223344556677';
const VALID_LEAD = 'bbccddee11223344556688aa';

// ═════════════════════════════════════════════════════════════════════

describe('Communications Routes — /api/communications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── POST /messages/send ─────────────────────────────────────────
  describe('POST /api/communications/messages/send', () => {
    it('sends a message successfully', async () => {
      mockPrisma.activity.create.mockResolvedValueOnce({
        id: 'act-1',
        createdAt: new Date('2026-01-01T12:00:00Z'),
      });

      const res = await request(createApp())
        .post('/api/communications/messages/send')
        .send({ recipientId: VALID_ID, content: 'Hello!', channel: 'whatsapp' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('sent');
      expect(res.body.data.channel).toBe('whatsapp');
    });

    it('defaults channel to system when invalid channel provided', async () => {
      mockPrisma.activity.create.mockResolvedValueOnce({
        id: 'act-2',
        createdAt: new Date('2026-01-01T12:00:00Z'),
      });

      const res = await request(createApp())
        .post('/api/communications/messages/send')
        .send({ recipientId: VALID_ID, content: 'Test', channel: 'pigeon' });

      expect(res.status).toBe(200);
      expect(res.body.data.channel).toBe('system');
    });

    it('returns 400 when recipientId is missing', async () => {
      const res = await request(createApp())
        .post('/api/communications/messages/send')
        .send({ content: 'Hello!' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/recipient.*content/i);
    });

    it('returns 400 when content is missing', async () => {
      const res = await request(createApp())
        .post('/api/communications/messages/send')
        .send({ recipientId: VALID_ID });

      expect(res.status).toBe(400);
    });

    it('returns 400 when recipientId format is invalid', async () => {
      const res = await request(createApp())
        .post('/api/communications/messages/send')
        .send({ recipientId: 'bad-id', content: 'Test' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid recipient/i);
    });

    it('returns 400 when content exceeds 10,000 characters', async () => {
      const longContent = 'a'.repeat(10001);
      const res = await request(createApp())
        .post('/api/communications/messages/send')
        .send({ recipientId: VALID_ID, content: longContent });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/10,000/);
    });

    it('validates leadId format if provided', async () => {
      const res = await request(createApp())
        .post('/api/communications/messages/send')
        .send({ recipientId: VALID_ID, content: 'Test', leadId: 'bad-lead' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid lead/i);
    });

    it('returns 403 when user has no access to lead', async () => {
      mockPrisma.lead.findFirst.mockResolvedValueOnce(null); // no access

      const res = await request(createApp('agent', 'agent-1'))
        .post('/api/communications/messages/send')
        .send({ recipientId: VALID_ID, content: 'Test', leadId: VALID_LEAD });

      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/access/i);
    });

    it('allows message with leadId when agent has access', async () => {
      mockPrisma.lead.findFirst.mockResolvedValueOnce({ id: VALID_LEAD }); // has access
      mockPrisma.activity.create.mockResolvedValueOnce({
        id: 'act-3',
        createdAt: new Date('2026-01-01T12:00:00Z'),
      });

      const res = await request(createApp('agent', 'agent-1'))
        .post('/api/communications/messages/send')
        .send({ recipientId: VALID_ID, content: 'Hello lead', leadId: VALID_LEAD });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('accepts all valid channels: email, whatsapp, sms, call, system', async () => {
      const validChannels = ['email', 'whatsapp', 'sms', 'call', 'system'];
      for (const ch of validChannels) {
        mockPrisma.activity.create.mockResolvedValueOnce({
          id: `act-${ch}`,
          createdAt: new Date('2026-01-01T12:00:00Z'),
        });
        const res = await request(createApp())
          .post('/api/communications/messages/send')
          .send({ recipientId: VALID_ID, content: 'Test', channel: ch });
        expect(res.status).toBe(200);
        expect(res.body.data.channel).toBe(ch);
      }
    });
  });

  // ── GET /messages/:recipientId ──────────────────────────────────
  describe('GET /api/communications/messages/:recipientId', () => {
    it('returns message history for owner', async () => {
      // Owner role bypasses verifyLeadAccess (no findFirst call needed)
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        {
          id: 'msg-1', action: 'email', description: 'Sent email',
          createdAt: new Date('2026-01-01'), user: { id: 'u1', name: 'Admin' },
          metadata: {},
        },
      ]);
      mockPrisma.activity.count.mockResolvedValueOnce(1);

      const res = await request(createApp('owner'))
        .get(`/api/communications/messages/${VALID_ID}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].sender).toBe('Admin');
      expect(res.body.pagination).toBeDefined();
    });

    it('returns 400 for invalid recipientId format', async () => {
      const res = await request(createApp())
        .get('/api/communications/messages/bad-id');

      expect(res.status).toBe(400);
    });

    it('returns 403 when agent has no access to lead messages (IDOR)', async () => {
      mockPrisma.lead.findFirst.mockResolvedValueOnce(null); // no access

      const res = await request(createApp('agent', 'agent-1'))
        .get(`/api/communications/messages/${VALID_ID}`);

      expect(res.status).toBe(403);
    });

    it('supports pagination', async () => {
      // Owner bypasses verifyLeadAccess
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(100);

      const res = await request(createApp('owner'))
        .get(`/api/communications/messages/${VALID_ID}?page=3&pageSize=10`);

      expect(res.status).toBe(200);
      expect(res.body.pagination.page).toBe(3);
      expect(res.body.pagination.pageSize).toBe(10);
    });

    it('caps pageSize at 50', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([]);
      mockPrisma.activity.count.mockResolvedValueOnce(0);

      const res = await request(createApp('owner'))
        .get(`/api/communications/messages/${VALID_ID}?pageSize=100`);

      expect(res.status).toBe(200);
      expect(res.body.pagination.pageSize).toBe(50);
    });

    it('returns System as sender when user is null', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        {
          id: 'msg-2', action: 'note_added', description: 'System note',
          createdAt: new Date('2026-01-01'), user: null, metadata: {},
        },
      ]);
      mockPrisma.activity.count.mockResolvedValueOnce(1);

      const res = await request(createApp('owner'))
        .get(`/api/communications/messages/${VALID_ID}`);

      expect(res.body.data[0].sender).toBe('System');
    });
  });

  // ── GET /conversations ──────────────────────────────────────────
  describe('GET /api/communications/conversations', () => {
    it('returns unique conversations for owner', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        {
          leadId: 'lead-1', action: 'email', description: 'Last email',
          createdAt: new Date('2026-01-15'),
          lead: { id: 'lead-1', name: 'Lead One', email: 'l1@test.com', phone: '123', status: 'active' },
        },
        {
          leadId: 'lead-1', action: 'call', description: 'Earlier call', // duplicate lead
          createdAt: new Date('2026-01-14'),
          lead: { id: 'lead-1', name: 'Lead One', email: 'l1@test.com', phone: '123', status: 'active' },
        },
        {
          leadId: 'lead-2', action: 'note_added', description: 'Note',
          createdAt: new Date('2026-01-13'),
          lead: { id: 'lead-2', name: 'Lead Two', email: 'l2@test.com', phone: '456', status: 'new' },
        },
      ]);

      const res = await request(createApp('owner'))
        .get('/api/communications/conversations');

      expect(res.status).toBe(200);
      // Deduplication: lead-1 appears only once
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0].leadId).toBe('lead-1');
      expect(res.body.data[1].leadId).toBe('lead-2');
    });

    it('returns 401 when user is not authenticated', async () => {
      const app = express();
      app.use(express.json());
      app.use((req, _res, next) => {
        (req as any).user = null; // no user
        next();
      });
      app.use('/api/communications', communicationsRoutes);
      app.use((err: any, _req: any, res: any, _next: any) => {
        res.status(err.statusCode || 500).json({ success: false, error: err.message });
      });

      const res = await request(app)
        .get('/api/communications/conversations');

      expect(res.status).toBe(401);
    });

    it('filters out entries with null leadId', async () => {
      mockPrisma.activity.findMany.mockResolvedValueOnce([
        {
          leadId: null, action: 'email', description: 'No lead',
          createdAt: new Date('2026-01-12'), lead: null,
        },
        {
          leadId: 'lead-3', action: 'email', description: 'Has lead',
          createdAt: new Date('2026-01-11'),
          lead: { id: 'lead-3', name: 'Lead Three', email: 'l3@test.com', phone: '789', status: 'active' },
        },
      ]);

      const res = await request(createApp('owner'))
        .get('/api/communications/conversations');

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].leadId).toBe('lead-3');
    });
  });

  // ── GET /status ─────────────────────────────────────────────────
  describe('GET /api/communications/status', () => {
    it('returns integration channel statuses', async () => {
      const res = await request(createApp())
        .get('/api/communications/status');

      expect(res.status).toBe(200);
      expect(res.body.data.whatsapp.status).toBe('not_configured');
      expect(res.body.data.email.status).toBe('active');
      expect(res.body.data.email.connected).toBe(true);
      expect(res.body.data.sms.connected).toBe(false);
    });
  });
});
