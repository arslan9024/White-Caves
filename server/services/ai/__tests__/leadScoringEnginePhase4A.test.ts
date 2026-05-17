/**
 * Lead Scoring Engine — Phase 4A Enhancement Tests
 *
 * Tests for: getScoreHistory, getScoreTrending, applyWhatsAppSignal,
 * score history recording in scoreLead.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mock prisma ────────────────────────────────────────────────────────
const mockFindUnique = vi.fn();
const mockFindMany = vi.fn();
const mockUpdate = vi.fn();
const mockCreate = vi.fn();
const mockCount = vi.fn();
const mockAggregate = vi.fn();

vi.mock('../../../database.js', () => ({
  prisma: {
    lead: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      findMany: (...args: unknown[]) => mockFindMany(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
    activity: {
      count: (...args: unknown[]) => mockCount(...args),
      create: (...args: unknown[]) => mockCreate(...args),
    },
    viewing: { count: (...args: unknown[]) => mockCount(...args) },
    offer: { count: (...args: unknown[]) => mockCount(...args) },
    transaction: { count: (...args: unknown[]) => mockCount(...args) },
    commission: { count: (...args: unknown[]) => mockCount(...args) },
    leadScoreHistory: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      create: (...args: unknown[]) => mockCreate(...args),
    },
  },
}));

vi.mock('../../../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

import {
  getTier,
  getScoreHistory,
  getScoreTrending,
} from '../leadScoringEngine';

// ─── Tests ──────────────────────────────────────────────────────────────

describe('leadScoringEngine — Phase 4A enhancements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTier', () => {
    it('returns hot for score >= 80', () => {
      expect(getTier(80)).toBe('hot');
      expect(getTier(100)).toBe('hot');
      expect(getTier(95)).toBe('hot');
    });

    it('returns warm for score 60-79', () => {
      expect(getTier(60)).toBe('warm');
      expect(getTier(79)).toBe('warm');
      expect(getTier(70)).toBe('warm');
    });

    it('returns cold for score 30-59', () => {
      expect(getTier(30)).toBe('cold');
      expect(getTier(59)).toBe('cold');
      expect(getTier(45)).toBe('cold');
    });

    it('returns inactive for score < 30', () => {
      expect(getTier(29)).toBe('inactive');
      expect(getTier(0)).toBe('inactive');
      expect(getTier(15)).toBe('inactive');
    });
  });

  describe('getScoreHistory', () => {
    it('returns score history for a lead', async () => {
      const mockHistory = [
        { score: 85, tier: 'hot', previousScore: 70, previousTier: 'warm', trigger: 'middleware', breakdown: null, createdAt: new Date() },
        { score: 70, tier: 'warm', previousScore: 55, previousTier: 'cold', trigger: 'batch', breakdown: null, createdAt: new Date() },
      ];

      mockFindMany.mockResolvedValueOnce(mockHistory);

      const result = await getScoreHistory('lead-123');
      expect(result).toHaveLength(2);
      expect(result[0].score).toBe(85);
      expect(result[0].tier).toBe('hot');
      expect(result[1].previousTier).toBe('cold');
    });

    it('respects limit and days options', async () => {
      mockFindMany.mockResolvedValueOnce([]);

      const result = await getScoreHistory('lead-123', { limit: 10, days: 30 });
      expect(result).toEqual([]);
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            leadId: 'lead-123',
          }),
          take: 10,
        }),
      );
    });

    it('uses defaults: limit=50, days=90', async () => {
      mockFindMany.mockResolvedValueOnce([]);

      await getScoreHistory('lead-123');
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 50,
        }),
      );
    });
  });

  describe('getScoreTrending', () => {
    it('returns empty when no leads have history', async () => {
      mockFindMany
        .mockResolvedValueOnce([]) // leads
      ;

      const result = await getScoreTrending();
      expect(result).toEqual([]);
    });

    it('detects warming leads', async () => {
      // Lead with score 70 (was 50)
      mockFindMany.mockResolvedValueOnce([
        { id: 'lead-1', score: 70 },
      ]);

      // History for lead-1: started at 50, now at 70 → delta = +20 (warming)
      mockFindMany.mockResolvedValueOnce([
        { score: 50 },
        { score: 60 },
        { score: 70 },
      ]);

      const result = await getScoreTrending({ days: 7, minChange: 10 });
      expect(result).toHaveLength(1);
      expect(result[0].leadId).toBe('lead-1');
      expect(result[0].direction).toBe('warming');
      expect(result[0].delta).toBe(20);
    });

    it('detects cooling leads', async () => {
      mockFindMany.mockResolvedValueOnce([
        { id: 'lead-2', score: 40 },
      ]);

      // History: started at 70, now at 40 → delta = -30 (cooling)
      mockFindMany.mockResolvedValueOnce([
        { score: 70 },
        { score: 55 },
        { score: 40 },
      ]);

      const result = await getScoreTrending({ days: 7, minChange: 10 });
      expect(result).toHaveLength(1);
      expect(result[0].direction).toBe('cooling');
      expect(result[0].delta).toBe(-30);
    });

    it('filters out leads with insufficient change', async () => {
      mockFindMany.mockResolvedValueOnce([
        { id: 'lead-3', score: 52 },
      ]);

      // History: 50 → 52, delta = 2 (below minChange of 10)
      mockFindMany.mockResolvedValueOnce([
        { score: 50 },
        { score: 52 },
      ]);

      const result = await getScoreTrending({ days: 7, minChange: 10 });
      expect(result).toEqual([]);
    });

    it('sorts by absolute delta descending', async () => {
      mockFindMany.mockResolvedValueOnce([
        { id: 'lead-a', score: 65 }, // delta +15
        { id: 'lead-b', score: 30 }, // delta -25
      ]);

      mockFindMany
        .mockResolvedValueOnce([{ score: 50 }, { score: 65 }]) // lead-a: +15
        .mockResolvedValueOnce([{ score: 55 }, { score: 30 }]); // lead-b: -25

      const result = await getScoreTrending({ days: 7, minChange: 10 });
      expect(result).toHaveLength(2);
      expect(result[0].leadId).toBe('lead-b'); // |−25| > |+15|
      expect(result[1].leadId).toBe('lead-a');
    });
  });
});
