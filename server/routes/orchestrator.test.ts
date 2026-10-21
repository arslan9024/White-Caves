import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import request from 'supertest';

const { mockGetRecentEvents } = vi.hoisted(() => ({
  mockGetRecentEvents: vi.fn(),
}));

vi.mock('../middleware/rbac.js', () => ({
  requireRole: () => (_req: Request, _res: Response, next: NextFunction) => next(),
}));

vi.mock('../services/orchestrator/AssistantOrchestrator.js', () => ({
  assistantOrchestrator: { getRecentEvents: (...args: unknown[]) => mockGetRecentEvents(...args) },
  getOrchestratorStatus: vi.fn(),
}));

import orchestratorRouter from './orchestrator.js';

describe('orchestrator routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use('/api/orchestrator', orchestratorRouter);
    mockGetRecentEvents.mockReturnValue([
      {
        id: 'event-1',
        event: 'linda:message_received',
        payload: { from: '+971500000000', message: 'private message body' },
        timestamp: '2026-10-21T10:00:00.000Z',
      },
    ]);
  });

  it('returns event metadata without personal or business-sensitive payloads', async () => {
    const response = await request(app).get('/api/orchestrator/events?limit=5');

    expect(response.status).toBe(200);
    expect(response.body.data.events).toEqual([
      {
        id: 'event-1',
        event: 'linda:message_received',
        timestamp: '2026-10-21T10:00:00.000Z',
      },
    ]);
    expect(JSON.stringify(response.body)).not.toContain('private message body');
    expect(JSON.stringify(response.body)).not.toContain('+971500000000');
    expect(mockGetRecentEvents).toHaveBeenCalledWith(5);
  });
});
