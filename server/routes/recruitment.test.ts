/**
 * Recruitment API Integration Tests
 * ───────────────────────────────────
 * Tests candidate screening metrics, RBAC access gates, and recruitment route handlers.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

import recruitmentRouter, {
  computeScreeningMetrics,
  requireRecruitmentAccess,
  requireManagerReviewAccess,
  __setRecruitmentTestDeps,
  __resetRecruitmentTestDeps,
} from './recruitment.js';

describe('Recruitment Module & Routes', () => {
  describe('computeScreeningMetrics helper', () => {
    it('returns zeroes when score array is empty', () => {
      const metrics = computeScreeningMetrics([]);

      expect(metrics.total_candidates).toBe(0);
      expect(metrics.average_score).toBe(0);
      expect(metrics.strong_matches).toBe(0);
    });

    it('computes average and distribution for candidate scores', () => {
      const mockScores = [
        { overall_score: 92, screening_status: 'strong_match', factor_breakdown: { skills: 95, experience: 90, education: 85, cultural_fit: 90, location_match: 100 } },
        { overall_score: 75, screening_status: 'moderate_match', factor_breakdown: { skills: 80, experience: 70, education: 75, cultural_fit: 80, location_match: 70 } },
        { overall_score: 45, screening_status: 'rejected', factor_breakdown: { skills: 50, experience: 40, education: 50, cultural_fit: 45, location_match: 40 } },
      ];

      const metrics = computeScreeningMetrics(mockScores, { includeLegacyAliases: true });

      expect(metrics.total_candidates).toBe(3);
      expect(metrics.strong_matches).toBe(1);
      expect(metrics.moderate_matches).toBe(1);
      expect(metrics.rejected_matches).toBe(1);
      expect(metrics.average_score).toBeGreaterThan(60);
      expect(metrics.good_matches).toBeDefined();
    });
  });

  describe('RBAC Middleware Gates', () => {
    it('allows access in non-enforced mode without header', () => {
      const middleware = requireRecruitmentAccess('read');
      const req: any = { headers: {} };
      const res: any = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const next = vi.fn();

      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Recruitment Router Integration', () => {
    let app: express.Application;

    beforeEach(() => {
      __resetRecruitmentTestDeps();
      app = express();
      app.use(express.json());
      app.use('/api/recruitment', recruitmentRouter);
    });

    it('exports Express router instance cleanly', () => {
      expect(recruitmentRouter).toBeDefined();
      expect(typeof recruitmentRouter).toBe('function');
    });
  });
});
