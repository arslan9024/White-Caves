import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import aiChatRouter from './aiChat.js';
import { NinaEngine } from '../services/ai/ninaEngine.js';

vi.mock('../services/ai/ninaEngine.js', () => ({
  NinaEngine: {
    checkCap: vi.fn(async () => true),
    streamResponse: vi.fn(async (sessionId, assistantId, message, entityContext, onToken) => {
      onToken('Hello ');
      onToken('world');
    }),
  },
}));

const app = express();
app.use('/api/v1/ai-chat', aiChatRouter);

describe('W24-007 AI Chat SSE Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('streams response and completes without timeout', async () => {
    const response = await request(app).get('/api/v1/ai-chat/stream/session-123?message=Hi');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/event-stream');

    // Check if tokens were emitted
    const text = response.text;
    expect(text).toContain('connected');
    expect(text).toContain('Hello ');
    expect(text).toContain('world');
    expect(text).toContain('done');
  });

  it('returns error if message is missing', async () => {
    const response = await request(app).get('/api/v1/ai-chat/stream/session-123');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Message is required');
  });

  it('returns 429 if checkCap returns false', async () => {
    vi.spyOn(NinaEngine, 'checkCap').mockResolvedValueOnce(false);
    const response = await request(app).get('/api/v1/ai-chat/stream/session-123?message=Hi');

    expect(response.status).toBe(429);
    expect(response.body.error).toContain('Daily token cap exceeded');
    expect(response.body.resetTime).toBeDefined();
  });
});
