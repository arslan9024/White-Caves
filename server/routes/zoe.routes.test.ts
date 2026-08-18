/**
 * Zoe AI Routes API Integration Tests
 * ────────────────────────────────────
 * Tests executive AI query processing, executive daily briefings, conversation history,
 * department directory, and firebase authentication protection.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockVerifyIdToken } = vi.hoisted(() => ({
  mockVerifyIdToken: vi.fn().mockResolvedValue({
    uid: 'exec-101',
    email: 'admin@whitecaves.com',
  }),
}));

vi.mock('firebase-admin', () => ({
  default: {
    auth: () => ({
      verifyIdToken: mockVerifyIdToken,
    }),
  },
}));

vi.mock('../services/zoeAIService.js', () => ({
  default: {
    processQuery: vi.fn().mockResolvedValue({
      response: 'Portfolio revenue is currently up 18.5% MoM.',
      intent: 'financial_query',
      data: { revenue: 18500000 },
    }),
    generateDailyBriefing: vi.fn().mockResolvedValue({
      summary: 'Daily Executive Summary: 4 new HNWI leads and 2 offers accepted.',
      highlights: ['Palm Jumeirah Villa Offer Accepted', 'Q3 Sales Pipeline Exceeded Target'],
    }),
  },
}));

vi.mock('../models/ZoeConversation.js', () => {
  const MockModel: any = {
    find: vi.fn().mockImplementation(() => ({
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([
        {
          _id: 'conv-001',
          query: 'What is our Q3 revenue?',
          response: 'Q3 revenue is AED 24.5M.',
          intent: 'financial_query',
          metadata: { confidence: 0.95 },
          createdAt: new Date().toISOString(),
        },
      ]),
    })),
    getSessionHistory: vi.fn().mockResolvedValue([]),
    getUserHistory: vi.fn().mockResolvedValue([]),
  };
  return { default: MockModel };
});

import zoeRouter from './zoe.routes.js';

describe('Zoe Executive AI API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/zoe', zoeRouter);
  });

  describe('Authentication Gate', () => {
    it('rejects unauthenticated requests with 401', async () => {
      const res = await request(app).get('/api/zoe/briefing');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('rejects non-executive token with 403', async () => {
      mockVerifyIdToken.mockResolvedValueOnce({
        uid: 'user-202',
        email: 'regular_agent@whitecaves.ae',
      });

      const res = await request(app)
        .get('/api/zoe/briefing')
        .set('Authorization', 'Bearer non-exec-token');

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Authorized Endpoints', () => {
    const authHeader = 'Bearer valid-executive-token';

    it('processes executive AI queries via POST /query', async () => {
      const res = await request(app)
        .post('/api/zoe/query')
        .set('Authorization', authHeader)
        .send({ query: 'What is our current portfolio revenue?' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.response).toContain('Portfolio revenue');
      expect(res.body.sessionId).toBeDefined();
    });

    it('rejects empty query with 400', async () => {
      const res = await request(app)
        .post('/api/zoe/query')
        .set('Authorization', authHeader)
        .send({ query: '' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('generates executive daily briefing via GET /briefing', async () => {
      const res = await request(app)
        .get('/api/zoe/briefing')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.type).toBe('daily_briefing');
      expect(res.body.summary).toContain('Daily Executive Summary');
    });

    it('fetches executive conversation history via GET /history', async () => {
      const res = await request(app)
        .get('/api/zoe/history')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.history)).toBe(true);
      expect(res.body.history[0].query).toBe('What is our Q3 revenue?');
    });

    it('fetches executive departments directory via GET /departments', async () => {
      const res = await request(app)
        .get('/api/zoe/departments')
        .set('Authorization', authHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.departments)).toBe(true);
      expect(res.body.departments.some((d: any) => d.id === 'EXEC')).toBe(true);
    });
  });
});
