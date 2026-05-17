/**
 * useActivitiesData — Unit tests
 * Pattern: Mock Redux state → real selectors execute against it
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActivitiesData } from '../useActivitiesData';

// ─── Mock activities ────────────────────────────────────────────────────
const today = new Date().toISOString();
const yesterday = new Date(Date.now() - 86400000).toISOString();

const MOCK_ACTIVITIES = [
  { id: 'a1', type: 'lead', action: 'created', description: 'New lead', createdAt: today, userId: 'u1', leadId: 'l1' },
  { id: 'a2', type: 'lead', action: 'status_changed', description: 'Lead → hot', createdAt: today, userId: 'u1', leadId: 'l2' },
  { id: 'a3', type: 'deal', action: 'created', description: 'New deal', createdAt: today, userId: 'u2', leadId: null },
  { id: 'a4', type: 'property', action: 'updated', description: 'Price changed', createdAt: yesterday, userId: 'u1', leadId: null },
  { id: 'a5', type: 'system', action: 'updated', description: 'DB migration', createdAt: yesterday, userId: null, leadId: null },
  { id: 'a6', type: 'deal', action: 'status_changed', description: 'Deal completed', createdAt: yesterday, userId: 'u2', leadId: 'l3' },
  { id: 'a7', type: 'lead', action: 'note_added', description: 'Follow-up call', createdAt: today, userId: 'u1', leadId: 'l1' },
];

let mockState: Record<string, unknown>;

const resetMockState = () => {
  mockState = {
    crmData: {
      activities: {
        items: [...MOCK_ACTIVITIES],
        loading: false,
        error: null,
      },
      leads: { items: [], selected: null, loading: false, error: null },
      clients: { items: [], selected: null, loading: false, error: null },
      agents: { items: [], selected: null, loading: false, error: null },
      properties: { items: [], selected: null, loading: false, error: null },
      commissions: { items: [], loading: false, error: null },
      invoices: { items: [], loading: false, error: null },
      expenses: { items: [], loading: false, error: null },
      transactions: { items: [], loading: false, error: null },
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
    fetchActivitiesFromAPI: vi.fn((params) => ({ type: 'mock/fetchActivities', payload: params })),
    createActivityAPI: vi.fn((data) => ({ type: 'mock/createActivity', payload: data })),
    updateActivityAPI: vi.fn((data) => ({ type: 'mock/updateActivity', payload: data })),
    deleteActivityAPI: vi.fn((id) => ({ type: 'mock/deleteActivity', payload: id })),
  };
});

// ─── Tests ──────────────────────────────────────────────────────────────
describe('useActivitiesData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMockState();
  });

  // ────── Data loading ──────
  describe('data loading', () => {
    it('returns all activities from Redux state', () => {
      const { result } = renderHook(() => useActivitiesData());
      expect(result.current.allActivities).toHaveLength(7);
    });

    it('auto-fetches on mount by default', () => {
      renderHook(() => useActivitiesData());
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mock/fetchActivities' }),
      );
    });

    it('skips auto-fetch when autoFetch = false', () => {
      renderHook(() => useActivitiesData({ autoFetch: false }));
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('exposes loading state', () => {
      (mockState as any).crmData.activities.loading = true;
      const { result } = renderHook(() => useActivitiesData());
      expect(result.current.loading).toBe(true);
    });

    it('exposes error state', () => {
      (mockState as any).crmData.activities.error = 'Network error';
      const { result } = renderHook(() => useActivitiesData());
      expect(result.current.error).toBe('Network error');
    });
  });

  // ────── Type filtering ──────
  describe('type filtering', () => {
    it('returns lead activities', () => {
      const { result } = renderHook(() => useActivitiesData());
      expect(result.current.leadActivities).toHaveLength(3);
    });

    it('returns deal activities', () => {
      const { result } = renderHook(() => useActivitiesData());
      expect(result.current.dealActivities).toHaveLength(2);
    });

    it('returns property activities', () => {
      const { result } = renderHook(() => useActivitiesData());
      expect(result.current.propertyActivities).toHaveLength(1);
    });

    it('returns system activities', () => {
      const { result } = renderHook(() => useActivitiesData());
      expect(result.current.systemActivities).toHaveLength(1);
    });

    it('filters activities by type option', () => {
      const { result } = renderHook(() => useActivitiesData({ type: 'deal' }));
      expect(result.current.activities).toHaveLength(2);
      result.current.activities.forEach((a) => expect(a.type).toBe('deal'));
    });

    it('filters by action option', () => {
      const { result } = renderHook(() => useActivitiesData({ action: 'created' }));
      expect(result.current.activities).toHaveLength(2); // a1 + a3
    });

    it('filters by userId option', () => {
      const { result } = renderHook(() => useActivitiesData({ userId: 'u2' }));
      expect(result.current.activities).toHaveLength(2); // a3 + a6
    });

    it('filters by leadId option', () => {
      const { result } = renderHook(() => useActivitiesData({ leadId: 'l1' }));
      expect(result.current.activities).toHaveLength(2); // a1 + a7
    });

    it('filters by combined type + action', () => {
      const { result } = renderHook(() =>
        useActivitiesData({ type: 'lead', action: 'created' }),
      );
      expect(result.current.activities).toHaveLength(1);
      expect(result.current.activities[0].id).toBe('a1');
    });
  });

  // ────── Stats computation ──────
  describe('stats computation', () => {
    it('computes total count', () => {
      const { result } = renderHook(() => useActivitiesData());
      expect(result.current.stats.total).toBe(7);
    });

    it('computes type counts', () => {
      const { result } = renderHook(() => useActivitiesData());
      expect(result.current.stats.leadCount).toBe(3);
      expect(result.current.stats.dealCount).toBe(2);
      expect(result.current.stats.propertyCount).toBe(1);
      expect(result.current.stats.systemCount).toBe(1);
    });

    it('computes todayCount based on createdAt date', () => {
      const { result } = renderHook(() => useActivitiesData());
      // a1, a2, a3, a7 have today timestamps
      expect(result.current.stats.todayCount).toBe(4);
    });

    it('handles empty activities gracefully', () => {
      (mockState as any).crmData.activities.items = [];
      const { result } = renderHook(() => useActivitiesData());
      expect(result.current.stats.total).toBe(0);
      expect(result.current.stats.todayCount).toBe(0);
    });
  });

  // ────── CRUD dispatch verification ──────
  describe('CRUD operations', () => {
    it('dispatches createActivity', () => {
      const { result } = renderHook(() => useActivitiesData({ autoFetch: false }));
      act(() => {
        result.current.createActivity({ type: 'lead', action: 'note_added', description: 'Test note' });
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'mock/createActivity',
          payload: { type: 'lead', action: 'note_added', description: 'Test note' },
        }),
      );
    });

    it('dispatches updateActivity', () => {
      const { result } = renderHook(() => useActivitiesData({ autoFetch: false }));
      act(() => {
        result.current.updateActivity({ id: 'a1', description: 'Updated description' });
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'mock/updateActivity',
          payload: { id: 'a1', description: 'Updated description' },
        }),
      );
    });

    it('dispatches deleteActivity', () => {
      const { result } = renderHook(() => useActivitiesData({ autoFetch: false }));
      act(() => {
        result.current.deleteActivity('a1');
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mock/deleteActivity', payload: 'a1' }),
      );
    });

    it('dispatches refresh with current filter params', () => {
      const { result } = renderHook(() =>
        useActivitiesData({ autoFetch: false, type: 'lead', userId: 'u1' }),
      );
      act(() => {
        result.current.refresh();
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'mock/fetchActivities',
          payload: { type: 'lead', userId: 'u1' },
        }),
      );
    });
  });

  // ────── Handler exposure ──────
  describe('handler exposure', () => {
    it('exposes all expected handlers', () => {
      const { result } = renderHook(() => useActivitiesData({ autoFetch: false }));
      expect(typeof result.current.createActivity).toBe('function');
      expect(typeof result.current.updateActivity).toBe('function');
      expect(typeof result.current.deleteActivity).toBe('function');
      expect(typeof result.current.refresh).toBe('function');
    });

    it('exposes all expected data properties', () => {
      const { result } = renderHook(() => useActivitiesData({ autoFetch: false }));
      expect(result.current).toHaveProperty('activities');
      expect(result.current).toHaveProperty('allActivities');
      expect(result.current).toHaveProperty('leadActivities');
      expect(result.current).toHaveProperty('dealActivities');
      expect(result.current).toHaveProperty('propertyActivities');
      expect(result.current).toHaveProperty('systemActivities');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('stats');
    });
  });
});
