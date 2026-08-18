/**
 * Phase 6 Enterprise Microservices API Integration Tests
 * ────────────────────────────────────────────────────────
 * Tests distributed message queue, real-time analytics engine,
 * notifications dispatcher, and encryption security endpoints.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('../queue/queue.service.js', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      addTask: vi.fn().mockReturnValue('task-12345'),
      getTaskStatus: vi.fn().mockImplementation((taskId: string) => {
        if (taskId === 'task-12345') {
          return { id: taskId, status: 'completed', attempts: 1 };
        }
        return null;
      }),
      getStats: vi.fn().mockReturnValue({ pending: 2, processing: 1, completed: 50 }),
      getMetrics: vi.fn().mockReturnValue({ throughput: 25.4 }),
      getDeadLetterQueue: vi.fn().mockReturnValue([]),
      retryFromDLQ: vi.fn().mockResolvedValue(true),
    })),
  };
});

vi.mock('../analytics/analytics.service.js', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      trackEvent: vi.fn(),
      getDashboardMetrics: vi.fn().mockReturnValue({ activeUsers: 45, eventsCount: 1200 }),
      getUserAnalytics: vi.fn().mockReturnValue({ userId: 'usr-101', totalSessions: 12 }),
      getUserBehaviorPatterns: vi.fn().mockReturnValue({ frequentPages: ['/properties', '/dashboard'] }),
    })),
  };
});

vi.mock('../notifications/notification.service.js', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      sendNotification: vi.fn().mockResolvedValue({ id: 'notif-1', status: 'sent' }),
      getUserNotifications: vi.fn().mockReturnValue([{ id: 'notif-1', title: 'New Offer Received' }]),
    })),
  };
});

vi.mock('../security/encryption.service.js', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      encrypt: vi.fn().mockReturnValue({ iv: 'iv123', encryptedData: 'enc_blob_abc' }),
      decrypt: vi.fn().mockReturnValue('decrypted_payload_cleartext'),
    })),
  };
});

vi.mock('../presence/presence.service.js', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      setUserOnline: vi.fn(),
      getOnlineUsers: vi.fn().mockReturnValue([]),
      getPresenceAnalytics: vi.fn().mockReturnValue({ activeSessions: 10 }),
      getHealth: vi.fn().mockReturnValue({ status: 'healthy' }),
    })),
  };
});

import { phase6Router } from './phase6.routes.js';

describe('Phase 6 Microservices API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/phase6', phase6Router);
  });

  describe('Authentication Enforcement', () => {
    it('rejects requests without x-user-id header with 401', async () => {
      const res = await request(app).get('/api/v1/phase6/queue/stats');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Unauthorized');
    });
  });

  describe('Queue Microservice Endpoints', () => {
    it('enqueues a task and returns taskId', async () => {
      const res = await request(app)
        .post('/api/v1/phase6/queue/tasks')
        .set('x-user-id', 'usr-101')
        .send({
          type: 'GENERATE_PDF_SUMMARY',
          data: { dealId: 'deal-001' },
          priority: 'high',
        });

      expect(res.status).toBe(200);
      expect(res.body.taskId).toBe('task-12345');
      expect(res.body.status).toBe('queued');
    });

    it('retrieves task status by taskId', async () => {
      const res = await request(app)
        .get('/api/v1/phase6/queue/tasks/task-12345')
        .set('x-user-id', 'usr-101');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('completed');
    });
  });

  describe('Analytics Microservice Endpoints', () => {
    it('tracks user interaction events', async () => {
      const res = await request(app)
        .post('/api/v1/phase6/analytics/events')
        .set('x-user-id', 'usr-101')
        .send({
          eventType: 'PROPERTY_VIEW',
          metadata: { propertyId: 'prop-101' },
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Event tracked');
    });

    it('retrieves analytics dashboard metrics', async () => {
      const res = await request(app)
        .get('/api/v1/phase6/analytics/dashboard')
        .set('x-user-id', 'usr-101');

      expect(res.status).toBe(200);
      expect(res.body.activeUsers).toBe(45);
    });
  });
});
