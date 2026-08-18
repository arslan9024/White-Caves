/**
 * Strategic Plans API Integration Tests
 * ──────────────────────────────────────
 * Tests plan creation, validation, filtering, search, and statistical aggregations.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockPlanService, mockPlanAIService } = vi.hoisted(() => ({
  mockPlanService: {
    createPlan: vi.fn().mockImplementation((filename: string, content: string, metadata: any) =>
      Promise.resolve({
        id: 'PLAN-2026-001',
        filename,
        content,
        metadata,
        status: 'draft',
        createdAt: new Date().toISOString(),
      })
    ),
    listPlans: vi.fn().mockResolvedValue([
      {
        id: 'PLAN-2026-001',
        filename: 'q3-growth-strategy.md',
        status: 'approved',
        tags: ['strategy', 'dubai'],
      },
    ]),
    searchPlans: vi.fn().mockImplementation((query: string) =>
      Promise.resolve([
        {
          id: 'PLAN-2026-001',
          filename: 'q3-growth-strategy.md',
          matchScore: 0.95,
        },
      ])
    ),
    getPlanStats: vi.fn().mockResolvedValue({
      totalPlans: 42,
      draftPlans: 12,
      approvedPlans: 30,
    }),
  },
  mockPlanAIService: {
    getModelStatus: vi.fn().mockResolvedValue({ available: true, model: 'deepseek-v3' }),
  },
}));

vi.mock('../../src/server/services/PlanService.js', () => ({
  getPlanService: vi.fn().mockResolvedValue(mockPlanService),
}));

vi.mock('../../src/server/services/PlanAIService.js', () => ({
  getPlanAIService: vi.fn().mockReturnValue(mockPlanAIService),
}));

vi.mock('../../src/server/lib/logger.js', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

import plansRouter from './plans.js';

describe('Strategic Plans API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/plans', plansRouter);
  });

  describe('POST /api/plans/create', () => {
    it('creates a new plan with valid markdown filename', async () => {
      const res = await request(app)
        .post('/api/plans/create')
        .send({
          filename: 'q4_expansion.md',
          content: '# Q4 Dubai Marina Expansion Plan\n- Target 100 new listings',
          metadata: { author: 'Elena Rostova' },
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBe('PLAN-2026-001');
      expect(res.body.filename).toBe('q4_expansion.md');
    });

    it('rejects invalid filenames with 400', async () => {
      const res = await request(app)
        .post('/api/plans/create')
        .send({
          filename: '../../etc/passwd',
          content: 'malicious payload',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Invalid filename');
    });
  });

  describe('GET /api/plans/list', () => {
    it('returns filtered list of plans', async () => {
      const res = await request(app).get('/api/plans/list?status=approved');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.plans)).toBe(true);
      expect(res.body.count).toBe(1);
    });
  });

  describe('GET /api/plans/search/:query', () => {
    it('searches plans by query keyword', async () => {
      const res = await request(app).get('/api/plans/search/growth');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.results)).toBe(true);
      expect(res.body.count).toBe(1);
    });
  });

  describe('GET /api/plans/stats', () => {
    it('returns aggregated plan statistics', async () => {
      const res = await request(app).get('/api/plans/stats');

      expect(res.status).toBe(200);
      expect(res.body.totalPlans).toBe(42);
      expect(res.body.approvedPlans).toBe(30);
    });
  });
});
