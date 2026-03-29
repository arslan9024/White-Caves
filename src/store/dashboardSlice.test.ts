/**
 * dashboardSlice.test.ts — Comprehensive tests for the Dashboard Redux slice
 * ────────────────────────────────────────────────────────────────────────────
 * Tests: All synchronous reducers, async thunk (fetchDashboardMetrics),
 *        notification management, favorites, recently viewed, selectors,
 *        and security-critical logout state reset.
 *
 * Coverage targets:
 *   ✓ Initial state shape
 *   ✓ setActiveTab, setFilter, clearFilter
 *   ✓ setMetrics
 *   ✓ addToFavorites, removeFromFavorites (dedup check)
 *   ✓ addToRecentlyViewed (dedup + max 10 cap)
 *   ✓ setNotifications, markNotificationRead, clearAllNotifications
 *   ✓ setLoading, setError, clearError
 *   ✓ fetchDashboardMetrics (pending/fulfilled/rejected)
 *   ✓ Selectors: selectFavorites, selectNotifications
 *   ✓ SECURITY: logout resets all dashboard data
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer, {
  setActiveTab,
  setFilter,
  clearFilter,
  setMetrics,
  addToFavorites,
  removeFromFavorites,
  addToRecentlyViewed,
  setNotifications,
  markNotificationRead,
  clearAllNotifications,
  setLoading,
  setError,
  clearError,
  fetchDashboardMetrics,
  selectFavorites,
  selectNotifications,
} from './dashboardSlice';
import type { FavoriteItem, RecentlyViewedItem } from './dashboardSlice';
import { logout } from './authSlice';

// ─── Mock authFetch ──────────────────────────────────────────────────────
const mockAuthFetch = vi.fn();

vi.mock('../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────
const getInitialState = () => dashboardReducer(undefined, { type: 'unknown' });

function createTestStore(preloadedState?: Record<string, unknown>) {
  return configureStore({
    reducer: { dashboard: dashboardReducer } as any,
    ...(preloadedState ? { preloadedState } : {}),
  });
}

function makeFavorite(overrides: Partial<FavoriteItem> = {}): FavoriteItem {
  return {
    id: 'fav-1',
    title: 'Luxury Villa',
    location: 'Business Bay',
    price: '2,500,000 AED',
    ...overrides,
  };
}

function makeRecentlyViewed(overrides: Partial<RecentlyViewedItem> = {}): RecentlyViewedItem {
  return {
    id: 'rv-1',
    title: 'Marina Penthouse',
    location: 'Dubai Marina',
    price: '5,000,000 AED',
    viewedAt: '2026-01-15T10:00:00.000Z',
    ...overrides,
  };
}

// ==========================================================================
// TESTS
// ==========================================================================

describe('dashboardSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================================================================
  // 1. INITIAL STATE
  // ========================================================================
  describe('initial state', () => {
    it('should return a valid initial state', () => {
      const state = getInitialState();
      expect(state.activeTabs).toEqual({});
      expect(state.filters).toEqual({});
      expect(state.metrics.buyer).toBeNull();
      expect(state.metrics.seller).toBeNull();
      expect(state.metrics.owner).toBeNull();
      expect(state.loading.metrics).toBe(false);
      expect(state.loading.properties).toBe(false);
      expect(state.loading.leads).toBe(false);
      expect(state.error).toBeNull();
      expect(state.favorites).toEqual([]);
      expect(state.recentlyViewed).toEqual([]);
      expect(state.notifications.unreadCount).toBe(0);
      expect(state.notifications.items).toEqual([]);
      expect(state.pipelineStages.leasing).toHaveLength(6);
      expect(state.pipelineStages.sales).toHaveLength(7);
    });
  });

  // ========================================================================
  // 2. TAB & FILTER REDUCERS
  // ========================================================================
  describe('tab and filter reducers', () => {
    it('setActiveTab should set a tab for a key', () => {
      const state = dashboardReducer(getInitialState(), setActiveTab({ key: 'main', tab: 'leads' }));
      expect(state.activeTabs.main).toBe('leads');
    });

    it('setActiveTab should update an existing key', () => {
      let state = dashboardReducer(getInitialState(), setActiveTab({ key: 'main', tab: 'leads' }));
      state = dashboardReducer(state, setActiveTab({ key: 'main', tab: 'properties' }));
      expect(state.activeTabs.main).toBe('properties');
    });

    it('setFilter should set a filter for a key', () => {
      const state = dashboardReducer(getInitialState(), setFilter({ key: 'leads', filter: { status: 'hot', source: 'web' } }));
      expect(state.filters.leads).toEqual({ status: 'hot', source: 'web' });
    });

    it('setFilter should merge with existing filter', () => {
      let state = dashboardReducer(getInitialState(), setFilter({ key: 'leads', filter: { status: 'hot' } }));
      state = dashboardReducer(state, setFilter({ key: 'leads', filter: { source: 'web' } }));
      expect(state.filters.leads).toEqual({ status: 'hot', source: 'web' });
    });

    it('clearFilter should remove a filter key', () => {
      let state = dashboardReducer(getInitialState(), setFilter({ key: 'leads', filter: { status: 'hot' } }));
      state = dashboardReducer(state, clearFilter({ key: 'leads' }));
      expect(state.filters.leads).toBeUndefined();
    });
  });

  // ========================================================================
  // 3. METRICS REDUCERS
  // ========================================================================
  describe('metrics reducers', () => {
    it('setMetrics should set metrics for a role', () => {
      const data = { totalDeals: 10, revenue: 500000 };
      const state = dashboardReducer(getInitialState(), setMetrics({ role: 'buyer', data }));
      expect(state.metrics.buyer).toEqual(data);
    });

    it('setMetrics should support dynamic role keys', () => {
      const data = { totalListings: 25 };
      const state = dashboardReducer(getInitialState(), setMetrics({ role: 'customRole', data }));
      expect(state.metrics.customRole).toEqual(data);
    });
  });

  // ========================================================================
  // 4. FAVORITES REDUCERS
  // ========================================================================
  describe('favorites reducers', () => {
    it('addToFavorites should add a property', () => {
      const state = dashboardReducer(getInitialState(), addToFavorites(makeFavorite()));
      expect(state.favorites).toHaveLength(1);
      expect(state.favorites[0].id).toBe('fav-1');
    });

    it('addToFavorites should not duplicate existing favorites', () => {
      let state = dashboardReducer(getInitialState(), addToFavorites(makeFavorite()));
      state = dashboardReducer(state, addToFavorites(makeFavorite()));
      expect(state.favorites).toHaveLength(1);
    });

    it('addToFavorites should allow different ids', () => {
      let state = dashboardReducer(getInitialState(), addToFavorites(makeFavorite()));
      state = dashboardReducer(state, addToFavorites(makeFavorite({ id: 'fav-2', title: 'Another Villa' })));
      expect(state.favorites).toHaveLength(2);
    });

    it('removeFromFavorites should remove by id', () => {
      let state = dashboardReducer(getInitialState(), addToFavorites(makeFavorite()));
      state = dashboardReducer(state, addToFavorites(makeFavorite({ id: 'fav-2' })));
      state = dashboardReducer(state, removeFromFavorites('fav-1'));
      expect(state.favorites).toHaveLength(1);
      expect(state.favorites[0].id).toBe('fav-2');
    });

    it('removeFromFavorites should handle non-existent id gracefully', () => {
      const state = dashboardReducer(getInitialState(), removeFromFavorites('nonexistent'));
      expect(state.favorites).toEqual([]);
    });
  });

  // ========================================================================
  // 5. RECENTLY VIEWED REDUCERS
  // ========================================================================
  describe('recently viewed reducers', () => {
    it('addToRecentlyViewed should add a property', () => {
      const state = dashboardReducer(getInitialState(), addToRecentlyViewed(makeRecentlyViewed()));
      expect(state.recentlyViewed).toHaveLength(1);
    });

    it('addToRecentlyViewed should move existing item to front (dedup)', () => {
      let state = dashboardReducer(getInitialState(), addToRecentlyViewed(makeRecentlyViewed({ id: 'rv-1' })));
      state = dashboardReducer(state, addToRecentlyViewed(makeRecentlyViewed({ id: 'rv-2' })));
      state = dashboardReducer(state, addToRecentlyViewed(makeRecentlyViewed({ id: 'rv-1', viewedAt: 'latest' })));
      expect(state.recentlyViewed).toHaveLength(2);
      expect(state.recentlyViewed[0].id).toBe('rv-1');
      expect(state.recentlyViewed[0].viewedAt).toBe('latest');
    });

    it('addToRecentlyViewed should cap at 10 items', () => {
      let state = getInitialState();
      for (let i = 0; i < 15; i++) {
        state = dashboardReducer(state, addToRecentlyViewed(makeRecentlyViewed({ id: `rv-${i}` })));
      }
      expect(state.recentlyViewed).toHaveLength(10);
      // Most recent should be first
      expect(state.recentlyViewed[0].id).toBe('rv-14');
    });
  });

  // ========================================================================
  // 6. NOTIFICATION REDUCERS
  // ========================================================================
  describe('notification reducers', () => {
    it('setNotifications should replace notification state', () => {
      const notifications = {
        unreadCount: 3,
        items: [
          { id: 'n1', message: 'New lead', read: false },
          { id: 'n2', message: 'Deal closed', read: false },
          { id: 'n3', message: 'Reminder', read: false },
        ],
      };
      const state = dashboardReducer(getInitialState(), setNotifications(notifications));
      expect(state.notifications.unreadCount).toBe(3);
      expect(state.notifications.items).toHaveLength(3);
    });

    it('markNotificationRead should mark notification and decrement count', () => {
      const initial = dashboardReducer(getInitialState(), setNotifications({
        unreadCount: 2,
        items: [
          { id: 'n1', message: 'Msg 1', read: false },
          { id: 'n2', message: 'Msg 2', read: false },
        ],
      }));
      const state = dashboardReducer(initial, markNotificationRead('n1'));
      expect(state.notifications.items[0].read).toBe(true);
      expect(state.notifications.unreadCount).toBe(1);
    });

    it('markNotificationRead should not go below 0', () => {
      const initial = dashboardReducer(getInitialState(), setNotifications({
        unreadCount: 0,
        items: [{ id: 'n1', message: 'Msg', read: false }],
      }));
      const state = dashboardReducer(initial, markNotificationRead('n1'));
      expect(state.notifications.unreadCount).toBe(0);
    });

    it('markNotificationRead should do nothing for non-existent notification', () => {
      const initial = dashboardReducer(getInitialState(), setNotifications({
        unreadCount: 1,
        items: [{ id: 'n1', message: 'Msg', read: false }],
      }));
      const state = dashboardReducer(initial, markNotificationRead('nonexistent'));
      expect(state.notifications.unreadCount).toBe(1);
    });

    it('clearAllNotifications should empty items and reset count', () => {
      const initial = dashboardReducer(getInitialState(), setNotifications({
        unreadCount: 5,
        items: [
          { id: 'n1', message: 'Msg 1', read: false },
          { id: 'n2', message: 'Msg 2', read: true },
        ],
      }));
      const state = dashboardReducer(initial, clearAllNotifications());
      expect(state.notifications.items).toEqual([]);
      expect(state.notifications.unreadCount).toBe(0);
    });
  });

  // ========================================================================
  // 7. LOADING & ERROR REDUCERS
  // ========================================================================
  describe('loading and error reducers', () => {
    it('setLoading should set loading for a key', () => {
      const state = dashboardReducer(getInitialState(), setLoading({ key: 'properties', loading: true }));
      expect(state.loading.properties).toBe(true);
    });

    it('setLoading should support dynamic keys', () => {
      const state = dashboardReducer(getInitialState(), setLoading({ key: 'customKey', loading: true }));
      expect(state.loading.customKey).toBe(true);
    });

    it('setError should set error message', () => {
      const state = dashboardReducer(getInitialState(), setError('Something went wrong'));
      expect(state.error).toBe('Something went wrong');
    });

    it('setError(null) should clear error', () => {
      let state = dashboardReducer(getInitialState(), setError('Error'));
      state = dashboardReducer(state, setError(null));
      expect(state.error).toBeNull();
    });

    it('clearError should clear error', () => {
      let state = dashboardReducer(getInitialState(), setError('Error'));
      state = dashboardReducer(state, clearError());
      expect(state.error).toBeNull();
    });
  });

  // ========================================================================
  // 8. ASYNC THUNK: fetchDashboardMetrics
  // ========================================================================
  describe('fetchDashboardMetrics async thunk', () => {
    function mockResponse(data: unknown, ok = true) {
      return {
        ok,
        json: () => Promise.resolve(data),
      } as unknown as Response;
    }

    it('should set loading on pending', () => {
      const state = dashboardReducer(getInitialState(), { type: fetchDashboardMetrics.pending.type });
      expect(state.loading.metrics).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set role metrics on fulfilled', () => {
      const state = dashboardReducer(getInitialState(), {
        type: fetchDashboardMetrics.fulfilled.type,
        payload: { role: 'buyer', data: { totalDeals: 15 } },
      });
      expect(state.loading.metrics).toBe(false);
      expect(state.metrics.buyer).toEqual({ totalDeals: 15 });
    });

    it('should set error on rejected', () => {
      const state = dashboardReducer(getInitialState(), {
        type: fetchDashboardMetrics.rejected.type,
        payload: 'Metrics fetch failed',
      });
      expect(state.loading.metrics).toBe(false);
      expect(state.error).toBe('Metrics fetch failed');
    });

    it('should use default error message when payload is undefined', () => {
      const state = dashboardReducer(getInitialState(), {
        type: fetchDashboardMetrics.rejected.type,
        payload: undefined,
      });
      expect(state.error).toBe('Unknown error');
    });

    it('should dispatch thunk and call/api/dashboard/{role}/metrics', async () => {
      const metricsData = { totalDeals: 20, revenue: 1000000 };
      mockAuthFetch.mockResolvedValueOnce(mockResponse(metricsData));

      const store = createTestStore();
      await store.dispatch(fetchDashboardMetrics('salesAgent'));

      expect(mockAuthFetch).toHaveBeenCalledWith('/api/dashboard/salesAgent/metrics');
      expect(store.getState().dashboard.metrics.salesAgent).toEqual(metricsData);
    });

    it('should handle API error in thunk gracefully', async () => {
      mockAuthFetch.mockResolvedValueOnce(mockResponse({}, false));

      const store = createTestStore();
      await store.dispatch(fetchDashboardMetrics('buyer'));

      expect(store.getState().dashboard.error).toBe('Failed to fetch metrics');
      expect(store.getState().dashboard.loading.metrics).toBe(false);
    });

    it('should handle network exception in thunk', async () => {
      mockAuthFetch.mockRejectedValueOnce(new Error('Network unreachable'));

      const store = createTestStore();
      await store.dispatch(fetchDashboardMetrics('buyer'));

      expect(store.getState().dashboard.error).toBe('Network unreachable');
    });
  });

  // ========================================================================
  // 9. SECURITY: LOGOUT RESETS STATE
  // ========================================================================
  describe('security: logout resets state', () => {
    it('should completely reset dashboard state on logout', () => {
      let state = getInitialState();
      // Build up complex state
      state = dashboardReducer(state, setActiveTab({ key: 'main', tab: 'leads' }));
      state = dashboardReducer(state, setFilter({ key: 'leads', filter: { status: 'hot' } }));
      state = dashboardReducer(state, setMetrics({ role: 'buyer', data: { total: 10 } }));
      state = dashboardReducer(state, addToFavorites(makeFavorite()));
      state = dashboardReducer(state, addToRecentlyViewed(makeRecentlyViewed()));
      state = dashboardReducer(state, setNotifications({ unreadCount: 3, items: [{ id: 'n1', message: 'Test', read: false }] }));
      state = dashboardReducer(state, setError('Some error'));

      // Verify data populated
      expect(state.activeTabs.main).toBe('leads');
      expect(state.favorites).toHaveLength(1);
      expect(state.error).not.toBeNull();

      // Logout should wipe everything
      state = dashboardReducer(state, logout());
      expect(state.activeTabs).toEqual({});
      expect(state.filters).toEqual({});
      expect(state.metrics.buyer).toBeNull();
      expect(state.favorites).toEqual([]);
      expect(state.recentlyViewed).toEqual([]);
      expect(state.notifications.items).toEqual([]);
      expect(state.notifications.unreadCount).toBe(0);
      expect(state.error).toBeNull();
    });
  });

  // ========================================================================
  // 10. SELECTORS
  // ========================================================================
  describe('selectors', () => {
    it('selectFavorites returns favorites array', () => {
      const fav = makeFavorite();
      const state = { dashboard: { ...getInitialState(), favorites: [fav] } } as any;
      expect(selectFavorites(state)).toEqual([fav]);
    });

    it('selectFavorites returns empty array when undefined', () => {
      expect(selectFavorites({ dashboard: undefined } as any)).toEqual([]);
    });

    it('selectNotifications returns notification state', () => {
      const notif = { unreadCount: 2, items: [{ id: 'n1', message: 'Test', read: false }] };
      const state = { dashboard: { ...getInitialState(), notifications: notif } } as any;
      expect(selectNotifications(state)).toEqual(notif);
    });
  });

  // ========================================================================
  // 11. PIPELINE STAGES (Read-only initial state)
  // ========================================================================
  describe('pipeline stages', () => {
    it('should have correct leasing pipeline stages', () => {
      const state = getInitialState();
      expect(state.pipelineStages.leasing).toEqual([
        'Lead', 'Qualified', 'Viewing', 'Negotiation', 'Documentation', 'Closing',
      ]);
    });

    it('should have correct sales pipeline stages', () => {
      const state = getInitialState();
      expect(state.pipelineStages.sales).toEqual([
        'Lead', 'Qualified', 'Viewing', 'Negotiation', 'Due Diligence', 'Documentation', 'Closing',
      ]);
    });
  });
});
