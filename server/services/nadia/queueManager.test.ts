/**
 * Queue Manager Unit Tests
 * Tests: calculateQueuePriority (pure function — no DB mocking needed)
 * Database-dependent functions tested separately via integration tests
 */

import { describe, it, expect } from 'vitest';
import { calculateQueuePriority } from './queueManager';

// ============================================================================
// calculateQueuePriority
// Base priority = 5 (warm)
// Lead score: >=80 → -3, >=60 → -1, <=30 → +4
// Intent: make_offer → -3, schedule_tour → -2, financing → -1, complaint → +5
// Engagement: >=10 msgs → -2, >=5 msgs → -1
// Clamped to 1–10
// ============================================================================

describe('calculateQueuePriority', () => {
  // --------------------------------------------------------------------------
  // Baseline
  // --------------------------------------------------------------------------
  it('returns base priority 5 for neutral inputs', () => {
    const priority = calculateQueuePriority(50, 'general_inquiry', 2);
    expect(priority).toBe(5);
  });

  // --------------------------------------------------------------------------
  // Lead score effects
  // --------------------------------------------------------------------------
  describe('lead score', () => {
    it('hot lead (score >= 80) reduces priority by 3', () => {
      // base 5 - 3 = 2
      expect(calculateQueuePriority(80, 'general_inquiry', 0)).toBe(2);
      expect(calculateQueuePriority(95, 'general_inquiry', 0)).toBe(2);
    });

    it('warm lead (score >= 60) reduces priority by 1', () => {
      // base 5 - 1 = 4
      expect(calculateQueuePriority(60, 'general_inquiry', 0)).toBe(4);
      expect(calculateQueuePriority(75, 'general_inquiry', 0)).toBe(4);
    });

    it('cold lead (score <= 30) increases priority by 4', () => {
      // base 5 + 4 = 9
      expect(calculateQueuePriority(30, 'general_inquiry', 0)).toBe(9);
      expect(calculateQueuePriority(10, 'general_inquiry', 0)).toBe(9);
    });

    it('mid-range score (31-59) has no effect', () => {
      expect(calculateQueuePriority(40, 'general_inquiry', 0)).toBe(5);
      expect(calculateQueuePriority(59, 'general_inquiry', 0)).toBe(5);
    });
  });

  // --------------------------------------------------------------------------
  // Intent effects
  // --------------------------------------------------------------------------
  describe('intent', () => {
    it('make_offer intent is highest priority (-3)', () => {
      // base 5 - 3 = 2
      expect(calculateQueuePriority(50, 'make_offer', 0)).toBe(2);
    });

    it('schedule_tour intent reduces by 2', () => {
      // base 5 - 2 = 3
      expect(calculateQueuePriority(50, 'schedule_tour', 0)).toBe(3);
    });

    it('financing intent reduces by 1', () => {
      // base 5 - 1 = 4
      expect(calculateQueuePriority(50, 'financing', 0)).toBe(4);
    });

    it('complaint intent increases by 5', () => {
      // base 5 + 5 = 10
      expect(calculateQueuePriority(50, 'complaint', 0)).toBe(10);
    });

    it('unknown intent has no effect', () => {
      expect(calculateQueuePriority(50, 'random_intent', 0)).toBe(5);
    });
  });

  // --------------------------------------------------------------------------
  // Engagement (message count) effects
  // --------------------------------------------------------------------------
  describe('engagement', () => {
    it('high engagement (>= 10 msgs) reduces by 2', () => {
      // base 5 - 2 = 3
      expect(calculateQueuePriority(50, 'general_inquiry', 10)).toBe(3);
      expect(calculateQueuePriority(50, 'general_inquiry', 20)).toBe(3);
    });

    it('moderate engagement (>= 5 msgs) reduces by 1', () => {
      // base 5 - 1 = 4
      expect(calculateQueuePriority(50, 'general_inquiry', 5)).toBe(4);
      expect(calculateQueuePriority(50, 'general_inquiry', 9)).toBe(4);
    });

    it('low engagement (< 5 msgs) has no effect', () => {
      expect(calculateQueuePriority(50, 'general_inquiry', 0)).toBe(5);
      expect(calculateQueuePriority(50, 'general_inquiry', 4)).toBe(5);
    });
  });

  // --------------------------------------------------------------------------
  // Combined scenarios
  // --------------------------------------------------------------------------
  describe('combined factors', () => {
    it('hottest lead: high score + make_offer + high engagement → 1 (clamped)', () => {
      // base 5 - 3 (score 90) - 3 (make_offer) - 2 (15 msgs) = -3 → clamped to 1
      expect(calculateQueuePriority(90, 'make_offer', 15)).toBe(1);
    });

    it('coldest lead: low score + complaint + no engagement → 10 (clamped)', () => {
      // base 5 + 4 (score 20) + 5 (complaint) + 0 = 14 → clamped to 10
      expect(calculateQueuePriority(20, 'complaint', 0)).toBe(10);
    });

    it('warm lead scheduling tour with engagement', () => {
      // base 5 - 1 (score 65) - 2 (schedule_tour) - 1 (7 msgs) = 1
      expect(calculateQueuePriority(65, 'schedule_tour', 7)).toBe(1);
    });

    it('cold lead but high engagement', () => {
      // base 5 + 4 (score 25) - 2 (12 msgs) = 7
      expect(calculateQueuePriority(25, 'general_inquiry', 12)).toBe(7);
    });
  });

  // --------------------------------------------------------------------------
  // Clamping
  // --------------------------------------------------------------------------
  describe('clamping', () => {
    it('never goes below 1', () => {
      // Even with all bonuses stacked
      expect(calculateQueuePriority(100, 'make_offer', 100)).toBe(1);
    });

    it('never exceeds 10', () => {
      // Even with all penalties stacked
      expect(calculateQueuePriority(0, 'complaint', 0)).toBe(10);
    });
  });
});
