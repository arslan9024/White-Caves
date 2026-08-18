/**
 * AI Chat Assistant API Integration Tests
 * ────────────────────────────────────────
 * Tests AI real estate conversations, rate limiting, token cap checks,
 * intelligent fallback responses, and input validation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { errorHandler } from '../middleware/errorHandler.js';

vi.mock('../services/ai/ninaEngine.js', () => ({
  NinaEngine: {
    checkCap: vi.fn().mockResolvedValue(true),
    registerSSE: vi.fn(),
  },
}));

vi.mock('../utils/logger.js', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

import aiChatRouter from './aiChat.js';

describe('AI Chat Assistant API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/ai/chat', aiChatRouter);
    app.use(errorHandler);
  });

  describe('POST /api/ai/chat', () => {
    it('returns intelligent fallback reply for property inquiry when offline', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({
          messages: [{ role: 'user', content: 'What are the best areas to invest in Dubai?' }],
        });

      expect(res.status).toBe(200);
      expect(res.body.reply).toBeDefined();
      expect(res.body.reply).toContain('White Caves');
      expect(res.body.source).toBe('fallback');
    });

    it('returns intelligent fallback reply for mortgage inquiry', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({
          messages: [{ role: 'user', content: 'Can I get a mortgage in Dubai as a resident?' }],
        });

      expect(res.status).toBe(200);
      expect(res.body.reply).toContain('mortgage');
    });

    it('rejects empty messages array with 400', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({ messages: [] });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('messages array is required');
    });

    it('rejects invalid payload without messages with 400', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({});

      expect(res.status).toBe(400);
    });
  });
});
