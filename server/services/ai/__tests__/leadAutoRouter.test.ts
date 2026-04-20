/**
 * Lead Auto-Router Tests — Phase 4A
 *
 * Tests for intelligent lead assignment based on agent performance.
 * Verifies: performance calculation, routing rules generation,
 * hot lead auto-routing, capacity limits.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mock prisma ────────────────────────────────────────────────────────
const mockFindMany = vi.fn();
const mockFindUnique = vi.fn();
const mockCount = vi.fn();
const mockAggregate = vi.fn();
const mockUpdate = vi.fn();
const mockCreate = vi.fn();

vi.mock('../../../database.js', () => ({
  prisma: {
    user: { findMany: (...args: unknown[]) => mockFindMany(...args) },
    lead: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      count: (...args: unknown[]) => mockCount(...args),
      aggregate: (...args: unknown[]) => mockAggregate(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
    activity: {
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

vi.mock('../leadScoringMiddleware.js', () => ({
  onTierChange: vi.fn().mockReturnValue(() => {}),
}));

import {
  getAgentPerformance,
  getRoutingRules,
  autoRouteHotLead,
  startAutoRouting,
} from '../leadAutoRouter';

// ─── Tests ──────────────────────────────────────────────────────────────

describe('leadAutoRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAgentPerformance', () => {
    it('returns empty array when no agents exist', async () => {
      mockFindMany.mockResolvedValueOnce([]); // users
      const result = await getAgentPerformance();
      expect(result).toEqual([]);
    });

    it('calculates conversion rate correctly', async () => {
      mockFindMany.mockResolvedValueOnce([
        { id: 'agent-1', name: 'Alice', email: 'alice@wc.ae', role: 'agent' },
      ]);

      // totalLeads, hotLeads, warmLeads, wonLeads, lostLeads, currentLoad
      mockCount
        .mockResolvedValueOnce(20) // total
        .mockResolvedValueOnce(5)  // hot
        .mockResolvedValueOnce(8)  // warm
        .mockResolvedValueOnce(6)  // won
        .mockResolvedValueOnce(4)  // lost
        .mockResolvedValueOnce(10); // current load

      mockAggregate.mockResolvedValueOnce({ _avg: { score: 72 } });

      const result = await getAgentPerformance();
      expect(result).toHaveLength(1);
      expect(result[0].agentId).toBe('agent-1');
      expect(result[0].conversionRate).toBe(0.6); // 6 won / (6 won + 4 lost)
      expect(result[0].averageScore).toBe(72);
      expect(result[0].currentLoad).toBe(10);
    });

    it('handles zero won/lost (conversion = 0)', async () => {
      mockFindMany.mockResolvedValueOnce([
        { id: 'agent-1', name: 'Bob', email: 'bob@wc.ae', role: 'agent' },
      ]);

      mockCount
        .mockResolvedValueOnce(3)  // total
        .mockResolvedValueOnce(0)  // hot
        .mockResolvedValueOnce(1)  // warm
        .mockResolvedValueOnce(0)  // won
        .mockResolvedValueOnce(0)  // lost
        .mockResolvedValueOnce(3); // load

      mockAggregate.mockResolvedValueOnce({ _avg: { score: null } });

      const result = await getAgentPerformance();
      expect(result[0].conversionRate).toBe(0);
      expect(result[0].averageScore).toBe(0);
    });

    it('sorts agents by conversion rate descending', async () => {
      mockFindMany.mockResolvedValueOnce([
        { id: 'a1', name: 'Low', email: 'low@wc.ae', role: 'agent' },
        { id: 'a2', name: 'High', email: 'high@wc.ae', role: 'agent' },
      ]);

      // Agent 1: 2 won / 8 lost = 0.2
      mockCount
        .mockResolvedValueOnce(10).mockResolvedValueOnce(0).mockResolvedValueOnce(2)
        .mockResolvedValueOnce(2).mockResolvedValueOnce(8).mockResolvedValueOnce(5);
      mockAggregate.mockResolvedValueOnce({ _avg: { score: 40 } });

      // Agent 2: 8 won / 2 lost = 0.8
      mockCount
        .mockResolvedValueOnce(10).mockResolvedValueOnce(5).mockResolvedValueOnce(3)
        .mockResolvedValueOnce(8).mockResolvedValueOnce(2).mockResolvedValueOnce(5);
      mockAggregate.mockResolvedValueOnce({ _avg: { score: 85 } });

      const result = await getAgentPerformance();
      expect(result[0].agentName).toBe('High');
      expect(result[1].agentName).toBe('Low');
    });

    it('assigns specializations based on performance', async () => {
      mockFindMany.mockResolvedValueOnce([
        { id: 'a1', name: 'TopAgent', email: 'top@wc.ae', role: 'agent' },
      ]);

      // High converter with many hot leads and lots of experience
      mockCount
        .mockResolvedValueOnce(50) // total ≥ 20 → experienced
        .mockResolvedValueOnce(10) // hot ≥ 5 → hot-lead-specialist
        .mockResolvedValueOnce(15)
        .mockResolvedValueOnce(20) // won
        .mockResolvedValueOnce(10) // lost → 20/30 = 0.67 ≥ 0.3 → high-converter
        .mockResolvedValueOnce(15);

      mockAggregate.mockResolvedValueOnce({ _avg: { score: 80 } });

      const result = await getAgentPerformance();
      expect(result[0].specializations).toContain('high-converter');
      expect(result[0].specializations).toContain('hot-lead-specialist');
      expect(result[0].specializations).toContain('experienced');
    });
  });

  describe('getRoutingRules', () => {
    it('returns rules array', async () => {
      mockFindMany.mockResolvedValueOnce([
        { id: 'a1', name: 'Agent', email: 'a@wc.ae', role: 'agent' },
      ]);

      // Performance counts for one agent
      mockCount
        .mockResolvedValueOnce(10).mockResolvedValueOnce(2).mockResolvedValueOnce(3)
        .mockResolvedValueOnce(4).mockResolvedValueOnce(1).mockResolvedValueOnce(8);
      mockAggregate.mockResolvedValueOnce({ _avg: { score: 65 } });

      const rules = await getRoutingRules();
      expect(Array.isArray(rules)).toBe(true);
      expect(rules.length).toBeGreaterThan(0);

      // Each rule should have required fields
      const rule = rules[0];
      expect(rule).toHaveProperty('id');
      expect(rule).toHaveProperty('propertyType');
      expect(rule).toHaveProperty('budget');
      expect(rule).toHaveProperty('agent');
      expect(rule).toHaveProperty('priority');
    });
  });

  describe('autoRouteHotLead', () => {
    it('returns null when lead not found', async () => {
      mockFindUnique.mockResolvedValueOnce(null);
      const result = await autoRouteHotLead('nonexistent');
      expect(result).toBeNull();
    });

    it('returns null when lead already assigned', async () => {
      mockFindUnique.mockResolvedValueOnce({
        id: 'lead-1',
        name: 'Test Lead',
        assignedToId: 'existing-agent',
        budget: 1000000,
        score: 85,
        scoreTier: 'hot',
        propertyId: null,
      });

      const result = await autoRouteHotLead('lead-1');
      expect(result).toBeNull();
    });

    it('returns null when no agents available', async () => {
      mockFindUnique.mockResolvedValueOnce({
        id: 'lead-1',
        name: 'Test Lead',
        assignedToId: null,
        budget: 1000000,
        score: 85,
        scoreTier: 'hot',
        propertyId: null,
      });

      mockFindMany.mockResolvedValueOnce([]); // no agents

      const result = await autoRouteHotLead('lead-1');
      expect(result).toBeNull();
    });

    it('assigns lead to best agent and returns decision', async () => {
      mockFindUnique.mockResolvedValueOnce({
        id: 'lead-1',
        name: 'Hot Lead',
        assignedToId: null,
        budget: 2000000,
        score: 90,
        scoreTier: 'hot',
        propertyId: null,
      });

      // getAgentPerformance call
      mockFindMany.mockResolvedValueOnce([
        { id: 'agent-1', name: 'Best Agent', email: 'best@wc.ae', role: 'agent' },
      ]);

      mockCount
        .mockResolvedValueOnce(15) // total
        .mockResolvedValueOnce(5)  // hot
        .mockResolvedValueOnce(5)  // warm
        .mockResolvedValueOnce(8)  // won
        .mockResolvedValueOnce(2)  // lost
        .mockResolvedValueOnce(10); // load < 30

      mockAggregate.mockResolvedValueOnce({ _avg: { score: 75 } });
      mockUpdate.mockResolvedValueOnce({});
      mockCreate.mockResolvedValueOnce({});

      const result = await autoRouteHotLead('lead-1');
      expect(result).not.toBeNull();
      expect(result?.leadId).toBe('lead-1');
      expect(result?.assignedAgentId).toBe('agent-1');
      expect(result?.assignedAgentName).toBe('Best Agent');
      expect(result?.confidence).toBeGreaterThan(0);
      expect(result?.reason).toContain('Best-performing');
    });
  });

  describe('startAutoRouting', () => {
    it('returns an unsubscribe function', () => {
      const unsubscribe = startAutoRouting();
      expect(typeof unsubscribe).toBe('function');
      unsubscribe();
    });
  });
});
