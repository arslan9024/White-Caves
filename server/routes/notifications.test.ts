/**
 * Notifications Routes — Unit Tests
 * Tests /api/notifications endpoints: list, unread-count, read, delete, create
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
      notification: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        count: fn().mockResolvedValue(0),
        create: fn().mockResolvedValue({
          id: 'notif-1',
          userId: 'user-1',
          type: 'info',
          channel: 'in_app',
          title: 'Test',
          message: 'Hello',
          read: false,
        }),
        update: fn().mockResolvedValue({
          id: 'notif-1',
          read: true,
        }),
        updateMany: fn().mockResolvedValue({ count: 3 }),
        delete: fn().mockResolvedValue({}),
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
  sanitizeString: (s: string) => s,
}));
vi.mock('../utils/validate', () => ({
  validate: vi.fn(),
  rules: {
    requiredStringWithMax: () => ({}),
    optionalEmail: () => ({}),
    optionalStringWithMax: () => ({}),
    oneOf: () => ({}),
    optionalPositiveNumber: () => ({}),
    optionalMongoId: () => ({}),
    requiredMongoId: () => ({}),
    optionalArray: () => ({}),
  },
  validateIdParam: (id: string, label: string) => {
    if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
      const err = new Error(`${label} must be a valid 24-character hex string`);
      (err as any).statusCode = 400;
      throw err;
    }
  },
}));
vi.mock('../config/pagination', () => ({
  parsePagination: ({ page, limit }: { page?: string; limit?: string }) => ({
    page: Math.max(1, parseInt(page || '1') || 1),
    limit: Math.min(100, Math.max(1, parseInt(limit || '20') || 20)),
    skip:
      (Math.max(1, parseInt(page || '1') || 1) - 1) *
      Math.min(100, Math.max(1, parseInt(limit || '20') || 20)),
  }),
}));

import notificationRoutes from './notifications.js';

// ── Test app factory ─────────────────────────────────────────────────
function createApp(role: string = 'owner', userId = 'user-1') {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).user = { id: userId, email: 'test@whitecaves.ae', role };
    next();
  });
  app.use('/api/notifications', notificationRoutes);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.statusCode || 500).json({ success: false, error: err.message });
  });
  return app;
}

const VALID_ID = 'aabbccddee11223344556677';

// ═════════════════════════════════════════════════════════════════════

describe('Notifications Routes — /api/notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── GET / ────────────────────────────────────────────────────────
  describe('GET /api/notifications', () => {
    it('returns 200 with paginated notifications', async () => {
      mockPrisma.notification.findMany.mockResolvedValueOnce([
        { id: 'notif-1', title: 'Welcome', message: 'Hello', read: false },
      ]);
      mockPrisma.notification.count.mockResolvedValueOnce(1);
      const res = await request(createApp('agent')).get('/api/notifications');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.pagination).toBeDefined();
    });

    it('supports read filter', async () => {
      mockPrisma.notification.findMany.mockResolvedValueOnce([]);
      mockPrisma.notification.count.mockResolvedValueOnce(0);
      const res = await request(createApp('agent')).get('/api/notifications?read=false');
      expect(res.status).toBe(200);
      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ read: false }),
        })
      );
    });

    it('supports unread filter', async () => {
      mockPrisma.notification.findMany.mockResolvedValueOnce([]);
      mockPrisma.notification.count.mockResolvedValueOnce(0);
      const res = await request(createApp('agent')).get('/api/notifications?unread=true');
      expect(res.status).toBe(200);
      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ read: false }),
        })
      );
    });
  });

  // ── GET /unread-count ────────────────────────────────────────────
  describe('GET /api/notifications/unread-count', () => {
    it('returns count', async () => {
      mockPrisma.notification.count.mockResolvedValueOnce(5);
      const res = await request(createApp('agent')).get('/api/notifications/unread-count');
      expect(res.status).toBe(200);
      expect(res.body.data.unreadCount).toBe(5);
    });
  });

  // ── PATCH /read-all ──────────────────────────────────────────────
  describe('PATCH /api/notifications/read-all', () => {
    it('marks all as read', async () => {
      mockPrisma.notification.updateMany.mockResolvedValueOnce({ count: 3 });
      const res = await request(createApp('agent')).patch('/api/notifications/read-all');
      expect(res.status).toBe(200);
      expect(res.body.data.updated).toBe(3);
    });
  });

  // ── PATCH /:id/read ──────────────────────────────────────────────
  describe('PATCH /api/notifications/:id/read', () => {
    it('marks single as read', async () => {
      mockPrisma.notification.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        userId: 'user-1',
        read: false,
      });
      mockPrisma.notification.update.mockResolvedValueOnce({
        id: VALID_ID,
        read: true,
      });
      const res = await request(createApp('agent', 'user-1')).patch(
        `/api/notifications/${VALID_ID}/read`
      );
      expect(res.status).toBe(200);
      expect(res.body.data.read).toBe(true);
    });

    it('returns 404 if not found', async () => {
      mockPrisma.notification.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('agent')).patch(`/api/notifications/${VALID_ID}/read`);
      expect(res.status).toBe(404);
    });

    it('returns 403 if not owner of notification', async () => {
      mockPrisma.notification.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        userId: 'other-user',
        read: false,
      });
      const res = await request(createApp('agent', 'user-1')).patch(
        `/api/notifications/${VALID_ID}/read`
      );
      expect(res.status).toBe(403);
    });
  });

  // ── DELETE /:id ──────────────────────────────────────────────────
  describe('DELETE /api/notifications/:id', () => {
    it('deletes notification', async () => {
      mockPrisma.notification.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        userId: 'user-1',
      });
      const res = await request(createApp('agent', 'user-1')).delete(
        `/api/notifications/${VALID_ID}`
      );
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 404 if not found', async () => {
      mockPrisma.notification.findUnique.mockResolvedValueOnce(null);
      const res = await request(createApp('agent')).delete(`/api/notifications/${VALID_ID}`);
      expect(res.status).toBe(404);
    });

    it('returns 403 if not owner', async () => {
      mockPrisma.notification.findUnique.mockResolvedValueOnce({
        id: VALID_ID,
        userId: 'other-user',
      });
      const res = await request(createApp('agent', 'user-1')).delete(
        `/api/notifications/${VALID_ID}`
      );
      expect(res.status).toBe(403);
    });
  });

  // ── POST / ───────────────────────────────────────────────────────
  describe('POST /api/notifications', () => {
    it('creates notification for admin', async () => {
      mockPrisma.notification.create.mockResolvedValueOnce({
        id: 'notif-new',
        userId: 'user-2',
        type: 'info',
        channel: 'in_app',
        title: 'Alert',
        message: 'Important',
      });
      const res = await request(createApp('admin')).post('/api/notifications').send({
        userId: VALID_ID,
        type: 'info',
        channel: 'in_app',
        title: 'Alert',
        message: 'Important',
      });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('returns 403 for agent', async () => {
      const res = await request(createApp('agent')).post('/api/notifications').send({
        userId: VALID_ID,
        type: 'info',
        channel: 'in_app',
        title: 'Alert',
        message: 'Important',
      });
      expect(res.status).toBe(403);
    });
  });
});
