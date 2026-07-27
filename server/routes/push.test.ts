import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma, mockAuthMiddleware } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      userPushToken: {
        findFirst: fn().mockResolvedValue(null),
        create: fn().mockResolvedValue({
          id: 'token-1',
          userId: 'user-123',
          token: 'fcm-token-abc',
          deviceInfo: 'Mozilla/5.0',
        }),
        deleteMany: fn().mockResolvedValue({ count: 1 }),
        findMany: fn().mockResolvedValue([]),
      },
    },
    mockAuthMiddleware: vi.fn((req, res, next) => {
      req.user = { id: 'user-123', email: 'agent@whitecaves.ae', role: 'agent' };
      next();
    }),
  };
});

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../middleware/auth.js', () => ({ default: mockAuthMiddleware }));

import { pushRoutes } from './push.js';

describe('Push Notifications API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/push', pushRoutes);
    vi.clearAllMocks();
  });

  describe('POST /api/push/subscribe', () => {
    it('should register a new FCM push token', async () => {
      mockPrisma.userPushToken.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/push/subscribe')
        .send({ token: 'fcm-token-abc' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        message: 'Subscribed successfully',
      });
      expect(mockPrisma.userPushToken.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          token: 'fcm-token-abc',
          deviceInfo: 'Unknown Device',
        },
      });
    });

    it('should not recreate if the token already exists', async () => {
      mockPrisma.userPushToken.findFirst.mockResolvedValue({
        id: 'token-1',
        userId: 'user-123',
        token: 'fcm-token-abc',
      });

      const response = await request(app)
        .post('/api/push/subscribe')
        .send({ token: 'fcm-token-abc' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(mockPrisma.userPushToken.create).not.toHaveBeenCalled();
    });

    it('should return 400 if token is missing', async () => {
      const response = await request(app)
        .post('/api/push/subscribe')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Token is required');
    });
  });

  describe('DELETE /api/push/token', () => {
    it('should remove the FCM push token', async () => {
      const response = await request(app)
        .delete('/api/push/token')
        .send({ token: 'fcm-token-abc' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Unsubscribed successfully',
      });
      expect(mockPrisma.userPushToken.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          token: 'fcm-token-abc',
        },
      });
    });

    it('should return 400 if token is missing', async () => {
      const response = await request(app)
        .delete('/api/push/token')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/push/status', () => {
    it('should return push subscription status', async () => {
      mockPrisma.userPushToken.findMany.mockResolvedValue([
        { id: 'token-1', deviceInfo: 'iOS Safari', createdAt: new Date() },
      ]);

      const response = await request(app).get('/api/push/status');

      expect(response.status).toBe(200);
      expect(response.body.isSubscribed).toBe(true);
      expect(response.body.deviceCount).toBe(1);
      expect(mockPrisma.userPushToken.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        select: { id: true, deviceInfo: true, createdAt: true },
      });
    });
  });
});
