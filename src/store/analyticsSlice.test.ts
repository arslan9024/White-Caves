/**
 * analyticsSlice.test.ts — Comprehensive tests for the Analytics Redux slice
 * ──────────────────────────────────────────────────────────────────────────
 * Tests: Web Vitals tracking, performance score calculation, traffic stats,
 *        event recording, async thunk (fetchAnalytics), and logout reset.
 *
 * Coverage targets:
 *   ✓ Initial state shape
 *   ✓ updateWebVital (LCP, FID, CLS, FCP, TTFB, INP + metric mapping)
 *   ✓ Performance score calculation (excellent, good, needs-improvement, poor)
 *   ✓ recordPageView (increments pageViews, ensures activeUsers ≥ 1)
 *   ✓ updateTraffic (partial merge)
 *   ✓ addEvent (prepend + 50-item cap)
 *   ✓ resetAnalytics (full reset)
 *   ✓ fetchAnalytics (pending/fulfilled/rejected)
 *   ✓ SECURITY: logout resets all analytics data
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import analyticsReducer, {
  updateWebVital,
  recordPageView,
  updateTraffic,
  addEvent,
  resetAnalytics,
  fetchAnalytics,
} from './analyticsSlice';
import { logout } from './authSlice';

// ─── Mock authFetch ──────────────────────────────────────────────────────
const mockAuthFetch = vi.fn();

vi.mock('../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────
const getInitialState = () => analyticsReducer(undefined, { type: 'unknown' });

function createTestStore() {
  return configureStore({
    reducer: { analytics: analyticsReducer },
  });
}

// ==========================================================================
// TESTS
// ==========================================================================

describe('analyticsSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================================================================
  // 1. INITIAL STATE
  // ========================================================================
  describe('initial state', () => {
    it('should return a valid initial state', () => {
      const state = getInitialState();
      expect(state.webVitals.lcp).toBeNull();
      expect(state.webVitals.fid).toBeNull();
      expect(state.webVitals.cls).toBeNull();
      expect(state.webVitals.fcp).toBeNull();
      expect(state.webVitals.ttfb).toBeNull();
      expect(state.webVitals.inp).toBeNull();
      expect(state.traffic).toEqual({
        pageViews: 0,
        uniqueVisitors: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
        activeUsers: 0,
      });
      expect(state.performance).toEqual({
        score: 0,
        status: 'unknown',
        lastUpdated: null,
      });
      expect(state.recentEvents).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  // ========================================================================
  // 2. updateWebVital REDUCER
  // ========================================================================
  describe('updateWebVital', () => {
    it('should update LCP metric', () => {
      const state = analyticsReducer(getInitialState(), updateWebVital({ name: 'LCP', value: 2000, rating: 'good' }));
      expect(state.webVitals.lcp).toMatchObject({ value: 2000, rating: 'good' });
      expect(state.webVitals.lcp?.timestamp).toBeDefined();
    });

    it('should update FID metric', () => {
      const state = analyticsReducer(getInitialState(), updateWebVital({ name: 'FID', value: 80, rating: 'good' }));
      expect(state.webVitals.fid).toMatchObject({ value: 80, rating: 'good' });
    });

    it('should update CLS metric', () => {
      const state = analyticsReducer(getInitialState(), updateWebVital({ name: 'CLS', value: 0.05, rating: 'good' }));
      expect(state.webVitals.cls).toMatchObject({ value: 0.05 });
    });

    it('should update FCP metric', () => {
      const state = analyticsReducer(getInitialState(), updateWebVital({ name: 'FCP', value: 1500, rating: 'good' }));
      expect(state.webVitals.fcp).toMatchObject({ value: 1500 });
    });

    it('should update TTFB metric', () => {
      const state = analyticsReducer(getInitialState(), updateWebVital({ name: 'TTFB', value: 500, rating: 'good' }));
      expect(state.webVitals.ttfb).toMatchObject({ value: 500 });
    });

    it('should update INP metric', () => {
      const state = analyticsReducer(getInitialState(), updateWebVital({ name: 'INP', value: 150, rating: 'good' }));
      expect(state.webVitals.inp).toMatchObject({ value: 150 });
    });

    it('should map lowercase metric names', () => {
      const state = analyticsReducer(getInitialState(), updateWebVital({ name: 'lcp', value: 3000, rating: 'needs-improvement' }));
      expect(state.webVitals.lcp).toMatchObject({ value: 3000 });
    });

    it('should update performance.lastUpdated timestamp', () => {
      const state = analyticsReducer(getInitialState(), updateWebVital({ name: 'LCP', value: 2000, rating: 'good' }));
      expect(state.performance.lastUpdated).not.toBeNull();
      expect(typeof state.performance.lastUpdated).toBe('number');
    });

    it('should recalculate performance score after update', () => {
      const state = analyticsReducer(getInitialState(), updateWebVital({ name: 'LCP', value: 2000, rating: 'good' }));
      expect(state.performance.score).toBeGreaterThan(0);
    });
  });

  // ========================================================================
  // 3. PERFORMANCE SCORE CALCULATION
  // ========================================================================
  describe('performance score calculation', () => {
    function setAllVitals(values: { lcp: number; fid: number; cls: number; fcp: number; ttfb: number; inp: number }) {
      let state = getInitialState();
      state = analyticsReducer(state, updateWebVital({ name: 'LCP', value: values.lcp, rating: '' }));
      state = analyticsReducer(state, updateWebVital({ name: 'FID', value: values.fid, rating: '' }));
      state = analyticsReducer(state, updateWebVital({ name: 'CLS', value: values.cls, rating: '' }));
      state = analyticsReducer(state, updateWebVital({ name: 'FCP', value: values.fcp, rating: '' }));
      state = analyticsReducer(state, updateWebVital({ name: 'TTFB', value: values.ttfb, rating: '' }));
      state = analyticsReducer(state, updateWebVital({ name: 'INP', value: values.inp, rating: '' }));
      return state;
    }

    it('should score 100 (excellent) for all-perfect vitals', () => {
      const state = setAllVitals({ lcp: 1000, fid: 50, cls: 0.05, fcp: 1000, ttfb: 400, inp: 100 });
      expect(state.performance.score).toBe(100);
      expect(state.performance.status).toBe('excellent');
    });

    it('should score 50 (needs-improvement) for all-moderate vitals', () => {
      const state = setAllVitals({ lcp: 3000, fid: 200, cls: 0.15, fcp: 2500, ttfb: 1000, inp: 300 });
      expect(state.performance.score).toBe(50);
      expect(state.performance.status).toBe('needs-improvement');
    });

    it('should score 0 (poor) for all-bad vitals', () => {
      const state = setAllVitals({ lcp: 5000, fid: 500, cls: 0.5, fcp: 5000, ttfb: 3000, inp: 700 });
      expect(state.performance.score).toBe(0);
      expect(state.performance.status).toBe('poor');
    });

    it('should score mixed results correctly', () => {
      // 3 perfect (100) + 3 moderate (50) = avg 75
      const state = setAllVitals({ lcp: 1000, fid: 50, cls: 0.05, fcp: 2500, ttfb: 1000, inp: 300 });
      expect(state.performance.score).toBe(75);
      expect(state.performance.status).toBe('good');
    });

    it('should return score 0 when no vitals are set', () => {
      const state = getInitialState();
      expect(state.performance.score).toBe(0);
    });

    it('should calculate score with partial vitals', () => {
      let state = getInitialState();
      state = analyticsReducer(state, updateWebVital({ name: 'LCP', value: 2000, rating: 'good' }));
      // Only 1 vital set: LCP=2000 → score=100 (only metric counted)
      expect(state.performance.score).toBe(100);
    });
  });

  // ========================================================================
  // 4. recordPageView REDUCER
  // ========================================================================
  describe('recordPageView', () => {
    it('should increment pageViews', () => {
      let state = getInitialState();
      state = analyticsReducer(state, recordPageView());
      expect(state.traffic.pageViews).toBe(1);
      state = analyticsReducer(state, recordPageView());
      expect(state.traffic.pageViews).toBe(2);
    });

    it('should ensure activeUsers is at least 1', () => {
      const state = analyticsReducer(getInitialState(), recordPageView());
      expect(state.traffic.activeUsers).toBeGreaterThanOrEqual(1);
    });
  });

  // ========================================================================
  // 5. updateTraffic REDUCER
  // ========================================================================
  describe('updateTraffic', () => {
    it('should merge partial traffic data', () => {
      const state = analyticsReducer(getInitialState(), updateTraffic({ uniqueVisitors: 100, bounceRate: 42.5 }));
      expect(state.traffic.uniqueVisitors).toBe(100);
      expect(state.traffic.bounceRate).toBe(42.5);
      // Other fields remain default
      expect(state.traffic.pageViews).toBe(0);
    });

    it('should overwrite existing traffic values', () => {
      let state = analyticsReducer(getInitialState(), updateTraffic({ pageViews: 500 }));
      state = analyticsReducer(state, updateTraffic({ pageViews: 600 }));
      expect(state.traffic.pageViews).toBe(600);
    });
  });

  // ========================================================================
  // 6. addEvent REDUCER
  // ========================================================================
  describe('addEvent', () => {
    it('should prepend event with timestamp', () => {
      const state = analyticsReducer(getInitialState(), addEvent({ type: 'page_view', page: '/home' }));
      expect(state.recentEvents).toHaveLength(1);
      expect(state.recentEvents[0].type).toBe('page_view');
      expect(state.recentEvents[0].timestamp).toBeDefined();
      expect(typeof state.recentEvents[0].timestamp).toBe('number');
    });

    it('should prepend new events at the beginning', () => {
      let state = analyticsReducer(getInitialState(), addEvent({ type: 'event_1' }));
      state = analyticsReducer(state, addEvent({ type: 'event_2' }));
      expect(state.recentEvents[0].type).toBe('event_2');
      expect(state.recentEvents[1].type).toBe('event_1');
    });

    it('should cap events at 50 items', () => {
      let state = getInitialState();
      for (let i = 0; i < 55; i++) {
        state = analyticsReducer(state, addEvent({ type: `event_${i}` }));
      }
      expect(state.recentEvents).toHaveLength(50);
      // Most recent should be first
      expect(state.recentEvents[0].type).toBe('event_54');
    });
  });

  // ========================================================================
  // 7. resetAnalytics REDUCER
  // ========================================================================
  describe('resetAnalytics', () => {
    it('should reset to initial state', () => {
      let state = analyticsReducer(getInitialState(), updateWebVital({ name: 'LCP', value: 2000, rating: 'good' }));
      state = analyticsReducer(state, updateTraffic({ pageViews: 500 }));
      state = analyticsReducer(state, addEvent({ type: 'test' }));

      // Verify data populated
      expect(state.webVitals.lcp).not.toBeNull();
      expect(state.traffic.pageViews).toBe(500);
      expect(state.recentEvents).toHaveLength(1);

      // Reset
      state = analyticsReducer(state, resetAnalytics());
      expect(state.webVitals.lcp).toBeNull();
      expect(state.traffic.pageViews).toBe(0);
      expect(state.recentEvents).toEqual([]);
      expect(state.performance.score).toBe(0);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  // ========================================================================
  // 8. ASYNC THUNK: fetchAnalytics
  // ========================================================================
  describe('fetchAnalytics async thunk', () => {
    function mockResponse(data: unknown, ok = true) {
      return {
        ok,
        json: () => Promise.resolve(data),
      } as unknown as Response;
    }

    it('should set loading on pending', () => {
      const state = analyticsReducer(getInitialState(), { type: fetchAnalytics.pending.type });
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should merge traffic data on fulfilled', () => {
      const state = analyticsReducer(getInitialState(), {
        type: fetchAnalytics.fulfilled.type,
        payload: { traffic: { pageViews: 200, uniqueVisitors: 50 } },
      });
      expect(state.loading).toBe(false);
      expect(state.traffic.pageViews).toBe(200);
      expect(state.traffic.uniqueVisitors).toBe(50);
    });

    it('should merge webVitals data on fulfilled', () => {
      const vitalData = { lcp: { value: 1500, rating: 'good', timestamp: Date.now() } };
      const state = analyticsReducer(getInitialState(), {
        type: fetchAnalytics.fulfilled.type,
        payload: { webVitals: vitalData },
      });
      expect(state.loading).toBe(false);
      expect(state.webVitals.lcp).toMatchObject({ value: 1500 });
    });

    it('should handle fulfilled with empty payload', () => {
      const state = analyticsReducer(getInitialState(), {
        type: fetchAnalytics.fulfilled.type,
        payload: {},
      });
      expect(state.loading).toBe(false);
      // Traffic stays default
      expect(state.traffic.pageViews).toBe(0);
    });

    it('should set error on rejected', () => {
      const state = analyticsReducer(getInitialState(), {
        type: fetchAnalytics.rejected.type,
        payload: 'Analytics fetch failed',
      });
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Analytics fetch failed');
    });

    it('should use default error message when payload is undefined', () => {
      const state = analyticsReducer(getInitialState(), {
        type: fetchAnalytics.rejected.type,
        payload: undefined,
      });
      expect(state.error).toBe('Unknown error');
    });

    it('should dispatch thunk and call API', async () => {
      const analyticsData = { data: { traffic: { pageViews: 300 } } };
      mockAuthFetch.mockResolvedValueOnce(mockResponse(analyticsData));

      const store = createTestStore();
      await store.dispatch(fetchAnalytics());

      expect(mockAuthFetch).toHaveBeenCalledWith('/api/dashboard/summary');
    });

    it('should handle API error in thunk', async () => {
      mockAuthFetch.mockResolvedValueOnce(mockResponse({}, false));

      const store = createTestStore();
      await store.dispatch(fetchAnalytics());

      expect(store.getState().analytics.error).toBe('Failed to fetch analytics');
    });

    it('should handle network exception in thunk', async () => {
      mockAuthFetch.mockRejectedValueOnce(new Error('Network down'));

      const store = createTestStore();
      await store.dispatch(fetchAnalytics());

      expect(store.getState().analytics.error).toBe('Network down');
    });
  });

  // ========================================================================
  // 9. SECURITY: LOGOUT RESETS STATE
  // ========================================================================
  describe('security: logout resets state', () => {
    it('should completely reset analytics state on logout', () => {
      let state = getInitialState();
      // Build up complex state
      state = analyticsReducer(state, updateWebVital({ name: 'LCP', value: 2000, rating: 'good' }));
      state = analyticsReducer(state, updateTraffic({ pageViews: 500, uniqueVisitors: 200 }));
      state = analyticsReducer(state, addEvent({ type: 'test_event' }));
      state = analyticsReducer(state, recordPageView());

      // Verify populated
      expect(state.webVitals.lcp).not.toBeNull();
      expect(state.traffic.pageViews).toBe(501); // 500 + 1 from recordPageView
      expect(state.recentEvents).toHaveLength(1);

      // Logout should wipe everything
      state = analyticsReducer(state, logout());
      expect(state.webVitals.lcp).toBeNull();
      expect(state.traffic.pageViews).toBe(0);
      expect(state.recentEvents).toEqual([]);
      expect(state.performance.score).toBe(0);
      expect(state.performance.status).toBe('unknown');
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  // ========================================================================
  // 10. EDGE CASES
  // ========================================================================
  describe('edge cases', () => {
    it('should handle unknown web vital name gracefully', () => {
      // 'UNKNOWN_METRIC' isn't in the vitals map - should use lowercase, but key doesn't exist in state
      const state = analyticsReducer(getInitialState(), updateWebVital({ name: 'UNKNOWN', value: 100, rating: 'good' }));
      // The unknown metric should not crash, and standard vitals stay null
      expect(state.webVitals.lcp).toBeNull();
    });

    it('should handle empty traffic update', () => {
      const state = analyticsReducer(getInitialState(), updateTraffic({}));
      expect(state.traffic.pageViews).toBe(0);
    });

    it('should handle rapid sequential events', () => {
      let state = getInitialState();
      for (let i = 0; i < 100; i++) {
        state = analyticsReducer(state, addEvent({ type: `rapid_${i}` }));
      }
      expect(state.recentEvents).toHaveLength(50);
    });
  });
});
