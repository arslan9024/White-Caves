import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      activity: {
        create: fn().mockResolvedValue({ id: 'act-1', createdAt: new Date() }),
        findMany: fn().mockResolvedValue([]),
      },
    },
  };
});

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  createLogger: vi.fn(() => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() })),
}));
vi.mock('../middleware/rbac.js', () => ({
  requirePermission: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

import syndicationRoutes from './syndication.js';
import { errorHandler } from '../middleware/errorHandler.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use((req: any, _res, next) => {
    req.user = { id: 'user-1', role: 'manager' };
    next();
  });
  app.use('/api/syndication', syndicationRoutes);
  app.use(errorHandler);
  return app;
}

describe('Syndication routes — /api/syndication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.SYNDICATION_ENABLED;
  });

  it('GET /status returns enabled=false by default', async () => {
    const res = await request(createApp()).get('/api/syndication/status');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.enabled).toBe(false);
  });

  it('POST /sync-queue returns 503 when feature flag is disabled', async () => {
    const res = await request(createApp())
      .post('/api/syndication/sync-queue')
      .send({ propertyIds: ['prop-1'], provider: 'bayut' });

    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
  });

  it('POST /sync-queue returns 400 when propertyIds are missing', async () => {
    process.env.SYNDICATION_ENABLED = 'true';

    const res = await request(createApp())
      .post('/api/syndication/sync-queue')
      .send({ provider: 'property_finder' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /sync-queue queues activities when feature is enabled', async () => {
    process.env.SYNDICATION_ENABLED = 'true';

    const res = await request(createApp())
      .post('/api/syndication/sync-queue')
      .send({ propertyIds: ['prop-1', 'prop-2'], provider: 'all' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.queued).toBe(2);
    expect(mockPrisma.activity.create).toHaveBeenCalledTimes(2);
  });

  it('GET /sync-queue returns queue list', async () => {
    mockPrisma.activity.findMany.mockResolvedValueOnce([
      {
        id: 'act-1',
        createdAt: new Date(),
        userId: 'user-1',
        description: 'Queued property prop-1 for syndication (all)',
        metadata: { propertyId: 'prop-1', provider: 'all', status: 'queued' },
      },
    ]);

    const res = await request(createApp()).get('/api/syndication/sync-queue');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.data).toHaveLength(1);
  });
});
