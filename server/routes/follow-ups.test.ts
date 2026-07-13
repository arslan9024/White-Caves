import { beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

const {
  mockStartSequence,
  mockPauseSequence,
  mockResumeSequence,
  mockCancelSequence,
  mockGetSequenceSummary,
  mockGetLeadSequences,
  mockGetFollowUpStats,
  mockCadenceRuleFindMany,
  mockCadenceRuleCreate,
  mockCadenceRuleUpdate,
} = vi.hoisted(() => ({
  mockStartSequence: vi.fn(),
  mockPauseSequence: vi.fn(),
  mockResumeSequence: vi.fn(),
  mockCancelSequence: vi.fn(),
  mockGetSequenceSummary: vi.fn(),
  mockGetLeadSequences: vi.fn(),
  mockGetFollowUpStats: vi.fn(),
  mockCadenceRuleFindMany: vi.fn(),
  mockCadenceRuleCreate: vi.fn(),
  mockCadenceRuleUpdate: vi.fn(),
}));

vi.mock('../middleware/rbac.js', () => ({
  requirePermission: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

vi.mock('../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  createLogger: vi.fn(() => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() })),
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../services/automation/followUpEngine.js', () => ({
  startSequence: mockStartSequence,
  pauseSequence: mockPauseSequence,
  resumeSequence: mockResumeSequence,
  cancelSequence: mockCancelSequence,
  getSequenceSummary: mockGetSequenceSummary,
  getLeadSequences: mockGetLeadSequences,
  getFollowUpStats: mockGetFollowUpStats,
}));

vi.mock('../services/automation/cadenceTemplates.js', () => ({
  CADENCE_MAP: {
    hot_lead: {
      cadenceType: 'hot_lead',
      name: 'Hot Lead',
      description: 'Fast sequence for hot leads',
      totalSteps: 3,
      maxDurationDays: 3,
      steps: [
        { stepNumber: 1, channel: 'whatsapp', delayMs: 0, description: 'Initial ping' },
        { stepNumber: 2, channel: 'call', delayMs: 3600000, description: 'Call back' },
      ],
    },
  },
}));

vi.mock('../database.js', () => ({
  prisma: {
    cadenceRule: {
      findMany: mockCadenceRuleFindMany,
      create: mockCadenceRuleCreate,
      update: mockCadenceRuleUpdate,
    },
  },
}));

import followUpsRoutes from './follow-ups.js';
import { errorHandler } from '../middleware/errorHandler.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use((req: any, _res, next) => {
    req.user = { id: 'user-1', role: 'manager' };
    next();
  });
  app.use('/api/follow-ups', followUpsRoutes);
  app.use(errorHandler);
  return app;
}

describe('follow-ups routes — /api/follow-ups', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockStartSequence.mockResolvedValue({
      sequenceId: 'seq-1',
      cadenceType: 'hot_lead',
      totalSteps: 3,
    });
    mockGetFollowUpStats.mockResolvedValue({ active: 2, paused: 1, completed: 5 });
    mockGetLeadSequences.mockResolvedValue([{ id: 'seq-1', status: 'active' }]);
    mockGetSequenceSummary.mockResolvedValue({ id: 'seq-1', status: 'active' });

    mockCadenceRuleFindMany.mockResolvedValue([{ id: 'rule-1', name: 'VIP Tier' }]);
    mockCadenceRuleCreate.mockResolvedValue({ id: 'rule-2', name: 'New Rule', isActive: true });
    mockCadenceRuleUpdate.mockResolvedValue({ id: 'rule-2', name: 'Updated Rule', isActive: true });
  });

  it('starts a sequence for a lead', async () => {
    const res = await request(createApp())
      .post('/api/follow-ups/lead-1/start')
      .send({ cadenceType: 'hot_lead' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.sequenceId).toBe('seq-1');
    expect(mockStartSequence).toHaveBeenCalledWith(
      'lead-1',
      expect.objectContaining({ cadenceType: 'hot_lead', createdById: 'user-1' })
    );
  });

  it('returns follow-up dashboard stats', async () => {
    const res = await request(createApp()).get('/api/follow-ups/stats');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(expect.objectContaining({ active: 2, paused: 1, completed: 5 }));
    expect(mockGetFollowUpStats).toHaveBeenCalledTimes(1);
  });

  it('returns cadence templates', async () => {
    const res = await request(createApp()).get('/api/follow-ups/cadences');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].cadenceType).toBe('hot_lead');
    expect(res.body.data[0].steps[0]).toEqual(
      expect.objectContaining({ stepNumber: 1, channel: 'whatsapp' })
    );
  });

  it('creates a cadence rule with normalized defaults', async () => {
    const res = await request(createApp())
      .post('/api/follow-ups/rules')
      .send({
        name: '  New Rule  ',
        channelSequence: [{ channel: 'whatsapp', delayHours: 0 }],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(mockCadenceRuleCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: 'New Rule',
          isActive: true,
          priority: 0,
          channelSequence: [
            expect.objectContaining({
              channel: 'whatsapp',
              delayMs: 0,
              templateName: 'rule_whatsapp_1',
            }),
          ],
          dailyCapPerLead: 3,
          cooldownHours: 24,
          createdById: 'user-1',
        }),
      })
    );
  });

  it('normalizes cadence rule channel step delayHours to delayMs', async () => {
    const res = await request(createApp())
      .post('/api/follow-ups/rules')
      .send({
        name: 'Email Follow Up',
        channelSequence: [
          {
            channel: 'email',
            delayHours: 24,
            templateName: 'email_day_1',
            description: 'Day 1 follow-up',
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(mockCadenceRuleCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          channelSequence: [
            expect.objectContaining({
              channel: 'email',
              delayMs: 24 * 60 * 60 * 1000,
              templateName: 'email_day_1',
              description: 'Day 1 follow-up',
            }),
          ],
        }),
      })
    );
  });

  it('returns 400 when cadence rule channelSequence has invalid channels only', async () => {
    const res = await request(createApp())
      .post('/api/follow-ups/rules')
      .send({
        name: 'Invalid Rule',
        channelSequence: [{ channel: 'push_notification', delayMinutes: 10 }],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(String(res.body.error)).toMatch(/channelSequence is required/i);
    expect(mockCadenceRuleCreate).not.toHaveBeenCalled();
  });

  it('returns 400 when creating cadence rule with missing name', async () => {
    const res = await request(createApp())
      .post('/api/follow-ups/rules')
      .send({
        channelSequence: [{ channel: 'email', delayHours: 24 }],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(String(res.body.error)).toMatch(/name is required/i);
    expect(mockCadenceRuleCreate).not.toHaveBeenCalled();
  });

  it('deactivates a cadence rule', async () => {
    const res = await request(createApp()).delete('/api/follow-ups/rules/rule-1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockCadenceRuleUpdate).toHaveBeenCalledWith({
      where: { id: 'rule-1' },
      data: { isActive: false },
    });
  });
});
