/**
 * Aurora Code & AI Analysis API Integration Tests
 * ────────────────────────────────────────────────
 * Tests AI Ensemble provider introspection, full codebase AST analysis,
 * summary metrics, and component completion scores.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('../services/aiEnsembleService.js', () => ({
  default: {
    getProviderStatus: vi.fn().mockReturnValue({
      deepseek: { status: 'healthy', latencyMs: 120 },
      gemini: { status: 'healthy', latencyMs: 95 },
    }),
    getAvailableProviders: vi.fn().mockReturnValue(['deepseek', 'gemini']),
  },
}));

vi.mock('../services/codeAnalysisService.js', () => ({
  default: {
    performFullAnalysis: vi.fn().mockResolvedValue({
      totalFiles: 450,
      totalLines: 85000,
      componentsCount: 180,
    }),
    getSummary: vi.fn().mockResolvedValue({
      completionPercentage: 94.2,
      openIssuesCount: 0,
      passingTestSuites: 185,
    }),
  },
}));

vi.mock('../models/SRSDocument.js', () => ({
  default: {},
}));

vi.mock('../models/ComponentAnalysis.js', () => {
  const MockModel: any = {
    findOne: vi.fn().mockImplementation(() => ({
      sort: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({ analysisRunId: 'run_123' }),
    })),
    find: vi.fn().mockImplementation(() => ({
      sort: vi.fn().mockResolvedValue([
        {
          componentName: 'VirtualTourViewer',
          componentPath: 'src/components/virtual/VirtualTourViewer.tsx',
          completion: { score: 98, status: 'complete', hasPlaceholders: false, hasMockData: false },
          eventHandlers: { total: 4, placeholders: 0 },
        },
      ]),
    })),
    getCompletionSummary: vi.fn().mockResolvedValue({
      totalComponents: 1,
      averageScore: 98,
    }),
  };
  return { default: MockModel };
});

import auroraRouter from './aurora.js';

describe('Aurora Code & AI Analysis API Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/aurora', auroraRouter);
  });

  describe('GET /api/aurora/providers', () => {
    it('returns AI ensemble provider health and available models', async () => {
      const res = await request(app).get('/api/aurora/providers');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.availableCount).toBe(2);
      expect(res.body.available).toContain('deepseek');
    });
  });

  describe('GET /api/aurora/analyze', () => {
    it('performs full AST code analysis', async () => {
      const res = await request(app).get('/api/aurora/analyze?refresh=true');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.analysis.totalFiles).toBe(450);
    });
  });

  describe('GET /api/aurora/analyze/summary', () => {
    it('returns codebase completion metrics summary', async () => {
      const res = await request(app).get('/api/aurora/analyze/summary');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.summary.completionPercentage).toBe(94.2);
    });
  });

  describe('GET /api/aurora/components/completion', () => {
    it('returns latest component completion analysis breakdown', async () => {
      const res = await request(app).get('/api/aurora/components/completion');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.totalComponents).toBe(1);
      expect(res.body.components[0].name).toBe('VirtualTourViewer');
    });
  });
});
