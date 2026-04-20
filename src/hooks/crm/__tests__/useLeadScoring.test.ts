/**
 * useLeadScoring — Unit tests
 * Pattern: Mock Redux state → real selectors execute against it
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLeadScoring } from '../useLeadScoring';

// ─── Mock leads with scores ────────────────────────────────────────────
const MOCK_LEADS = [
  { id: 'l1', name: 'Hot Lead 1', status: 'qualified', score: 92, scoreTier: 'hot', budget: 5000000, source: 'referral' },
  { id: 'l2', name: 'Hot Lead 2', status: 'negotiating', score: 85, scoreTier: 'hot', budget: 3000000, source: 'whatsapp' },
  { id: 'l3', name: 'Warm Lead 1', status: 'contacted', score: 72, scoreTier: 'warm', budget: 1500000, source: 'website' },
  { id: 'l4', name: 'Warm Lead 2', status: 'viewing', score: 65, scoreTier: 'warm', budget: 800000, source: 'phone' },
  { id: 'l5', name: 'Cold Lead 1', status: 'new', score: 45, scoreTier: 'cold', budget: 500000, source: 'direct' },
  { id: 'l6', name: 'Cold Lead 2', status: 'new', score: 35, scoreTier: 'cold', budget: null, source: 'marketing' },
  { id: 'l7', name: 'Inactive Lead', status: 'new', score: 15, scoreTier: 'inactive', budget: null, source: 'direct' },
  { id: 'l8', name: 'Unscored Lead', status: 'new', score: 0, scoreTier: 'inactive', budget: null, source: 'direct' },
];

let mockState: Record<string, unknown>;

const resetMockState = () => {
  mockState = {
    crmData: {
      leads: {
        items: [...MOCK_LEADS],
        selected: null,
        loading: false,
        error: null,
      },
      clients: { items: [], selected: null, loading: false, error: null },
      agents: { items: [], selected: null, loading: false, error: null },
      properties: { items: [], selected: null, loading: false, error: null },
      commissions: { items: [], loading: false, error: null },
      invoices: { items: [], loading: false, error: null },
      expenses: { items: [], loading: false, error: null },
      transactions: { items: [], loading: false, error: null },
      activities: { items: [], loading: false, error: null },
      overview: null,
      lastUpdated: new Date().toISOString(),
    },
  };
};

// ─── Mock dispatch & thunks ─────────────────────────────────────────────
const mockDispatch = vi.fn(() => Promise.resolve({ unwrap: () => Promise.resolve() }));

vi.mock('react-redux', () => ({
  useSelector: (selector: (state: unknown) => unknown) => selector(mockState),
  useDispatch: () => mockDispatch,
}));

vi.mock('../../../store/crmDataSlice', async () => {
  const actual = await vi.importActual('../../../store/crmDataSlice');
  return {
    ...actual,
    scoreLeadAPI: vi.fn((leadId) => ({ type: 'mock/scoreLead', payload: leadId })),
    overrideLeadScoreAPI: vi.fn((data) => ({ type: 'mock/overrideLeadScore', payload: data })),
    batchRescoreLeadsAPI: vi.fn(() => ({ type: 'mock/batchRescoreLeads' })),
  };
});

// ─── Tests ──────────────────────────────────────────────────────────────
describe('useLeadScoring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMockState();
  });

  // ────── Tier filtering ──────
  describe('tier filtering', () => {
    it('returns all leads', () => {
      const { result } = renderHook(() => useLeadScoring());
      expect(result.current.allLeads).toHaveLength(8);
    });

    it('returns hot tier leads (score >= 80)', () => {
      const { result } = renderHook(() => useLeadScoring());
      expect(result.current.hotLeads).toHaveLength(2);
      expect(result.current.hotLeads.map(l => l.id)).toEqual(['l1', 'l2']);
    });

    it('returns warm tier leads (score 60-79)', () => {
      const { result } = renderHook(() => useLeadScoring());
      expect(result.current.warmLeads).toHaveLength(2);
      expect(result.current.warmLeads.map(l => l.id)).toEqual(['l3', 'l4']);
    });

    it('returns cold tier leads (score 30-59)', () => {
      const { result } = renderHook(() => useLeadScoring());
      expect(result.current.coldLeads).toHaveLength(2);
    });

    it('returns inactive tier leads (score < 30)', () => {
      const { result } = renderHook(() => useLeadScoring());
      expect(result.current.inactiveLeads).toHaveLength(2); // l7 (15, tier=inactive) + l8 (0, tier=inactive)
    });

    it('exposes loading state', () => {
      (mockState as any).crmData.leads.loading = true;
      const { result } = renderHook(() => useLeadScoring());
      expect(result.current.loading).toBe(true);
    });

    it('exposes error state', () => {
      (mockState as any).crmData.leads.error = 'API error';
      const { result } = renderHook(() => useLeadScoring());
      expect(result.current.error).toBe('API error');
    });
  });

  // ────── Stats computation ──────
  describe('stats computation', () => {
    it('computes total count', () => {
      const { result } = renderHook(() => useLeadScoring());
      expect(result.current.stats.total).toBe(8);
    });

    it('computes tier counts', () => {
      const { result } = renderHook(() => useLeadScoring());
      expect(result.current.stats.hotCount).toBe(2);
      expect(result.current.stats.warmCount).toBe(2);
      expect(result.current.stats.coldCount).toBe(2);
      expect(result.current.stats.inactiveCount).toBe(2);
    });

    it('computes average score (excluding unscored)', () => {
      const { result } = renderHook(() => useLeadScoring());
      // Scored: 92 + 85 + 72 + 65 + 45 + 35 + 15 = 409 / 7 = 58.43 ≈ 58
      expect(result.current.stats.averageScore).toBe(58);
    });

    it('computes scored vs unscored counts', () => {
      const { result } = renderHook(() => useLeadScoring());
      expect(result.current.stats.scoredCount).toBe(7); // all except l8 (score=0)
      expect(result.current.stats.unscoredCount).toBe(1); // l8
    });

    it('handles empty leads gracefully', () => {
      (mockState as any).crmData.leads.items = [];
      const { result } = renderHook(() => useLeadScoring());
      expect(result.current.stats.total).toBe(0);
      expect(result.current.stats.averageScore).toBe(0);
    });
  });

  // ────── Action dispatch ──────
  describe('scoring actions', () => {
    it('dispatches scoreLead', () => {
      const { result } = renderHook(() => useLeadScoring());
      act(() => {
        result.current.scoreLead('l1');
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mock/scoreLead', payload: 'l1' }),
      );
    });

    it('dispatches overrideScore', () => {
      const { result } = renderHook(() => useLeadScoring());
      act(() => {
        result.current.overrideScore({ leadId: 'l5', score: 80, reason: 'CEO referral' });
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'mock/overrideLeadScore',
          payload: { leadId: 'l5', score: 80, reason: 'CEO referral' },
        }),
      );
    });

    it('dispatches batchRescore', () => {
      const { result } = renderHook(() => useLeadScoring());
      act(() => {
        result.current.batchRescore();
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mock/batchRescoreLeads' }),
      );
    });
  });

  // ────── Handler exposure ──────
  describe('handler exposure', () => {
    it('exposes all expected handlers', () => {
      const { result } = renderHook(() => useLeadScoring());
      expect(typeof result.current.scoreLead).toBe('function');
      expect(typeof result.current.overrideScore).toBe('function');
      expect(typeof result.current.batchRescore).toBe('function');
    });

    it('exposes all expected data properties', () => {
      const { result } = renderHook(() => useLeadScoring());
      expect(result.current).toHaveProperty('allLeads');
      expect(result.current).toHaveProperty('hotLeads');
      expect(result.current).toHaveProperty('warmLeads');
      expect(result.current).toHaveProperty('coldLeads');
      expect(result.current).toHaveProperty('inactiveLeads');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('stats');
    });
  });
});
