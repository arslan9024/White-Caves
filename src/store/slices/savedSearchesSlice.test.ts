/**
 * savedSearchesSlice.test.ts — Comprehensive Redux slice tests
 * ─────────────────────────────────────────────────────────────
 * Tests: initial state, clearError, clearMatchResult, all 5 async thunks
 *        (pending/fulfilled/rejected), selectors, logout reset.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import savedSearchesReducer, {
  fetchSavedSearches,
  createSavedSearch,
  updateSavedSearch,
  deleteSavedSearch,
  checkSearchMatches,
  clearError,
  clearMatchResult,
  selectSavedSearches,
  selectSavedSearchesLoading,
  selectSavedSearchesError,
  selectMatchResults,
  selectSavedSearchCount,
} from './savedSearchesSlice';
import { logout } from '../authSlice';

// ─── Mock API layer (hoisted) ────────────────────────────────────────

const { mockApi } = vi.hoisted(() => ({
  mockApi: {
    fetchSavedSearches: vi.fn(),
    createSavedSearch: vi.fn(),
    updateSavedSearch: vi.fn(),
    deleteSavedSearch: vi.fn(),
    checkSavedSearchMatches: vi.fn(),
  },
}));

vi.mock('../../services/savedSearchesApi', () => mockApi);

// ─── Helpers ─────────────────────────────────────────────────────────

const getInitialState = () => savedSearchesReducer(undefined, { type: 'unknown' });

function createTestStore(preloadedState?: Record<string, unknown>) {
  return configureStore({
    reducer: { savedSearches: savedSearchesReducer } as any,
    ...(preloadedState ? { preloadedState } : {}),
  });
}

const sampleSearch = {
  id: 'ss-1',
  name: 'Dubai Marina 2BR',
  filters: { location: 'Dubai Marina', bedrooms: 2, minPrice: 500000 },
  alertEnabled: true,
  matchCount: 12,
  lastChecked: '2026-03-01T00:00:00Z',
  userId: 'user-1',
  createdAt: '2026-02-15T00:00:00Z',
  updatedAt: '2026-03-01T00:00:00Z',
};

const sampleSearch2 = {
  ...sampleSearch,
  id: 'ss-2',
  name: 'Palm 3BR',
  filters: { location: 'Palm Jumeirah', bedrooms: 3 },
  matchCount: 5,
};

// ─── Tests ───────────────────────────────────────────────────────────

describe('savedSearchesSlice', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Initial state ─────────────────────────────────────────────────
  describe('initial state', () => {
    it('has correct default shape', () => {
      const state = getInitialState();
      expect(state).toEqual({
        items: [],
        loading: false,
        error: null,
        matchResults: {},
      });
    });
  });

  // ── Synchronous reducers ──────────────────────────────────────────
  describe('reducers', () => {
    it('clearError resets error to null', () => {
      const state = { items: [], loading: false, error: 'Some error', matchResults: {} };
      const next = savedSearchesReducer(state, clearError());
      expect(next.error).toBeNull();
    });

    it('clearMatchResult removes specific match result', () => {
      const state = {
        items: [],
        loading: false,
        error: null,
        matchResults: { 'ss-1': { matchCount: 10, previousCount: 5, newMatches: 5 } },
      };
      const next = savedSearchesReducer(state, clearMatchResult('ss-1'));
      expect(next.matchResults).toEqual({});
    });
  });

  // ── fetchSavedSearches ────────────────────────────────────────────
  describe('fetchSavedSearches thunk', () => {
    it('sets loading=true on pending', () => {
      const state = getInitialState();
      const next = savedSearchesReducer(state, { type: fetchSavedSearches.pending.type });
      expect(next.loading).toBe(true);
      expect(next.error).toBeNull();
    });

    it('stores items on fulfilled', () => {
      const state = { items: [], loading: true, error: null, matchResults: {} };
      const next = savedSearchesReducer(state, {
        type: fetchSavedSearches.fulfilled.type,
        payload: [sampleSearch, sampleSearch2],
      });
      expect(next.items).toHaveLength(2);
      expect(next.loading).toBe(false);
    });

    it('sets error on rejected', () => {
      const state = { items: [], loading: true, error: null, matchResults: {} };
      const next = savedSearchesReducer(state, {
        type: fetchSavedSearches.rejected.type,
        payload: 'Network error',
      });
      expect(next.error).toBe('Network error');
      expect(next.loading).toBe(false);
    });

    it('dispatches through store correctly', async () => {
      mockApi.fetchSavedSearches.mockResolvedValueOnce([sampleSearch]);
      const store = createTestStore();
      await store.dispatch(fetchSavedSearches());
      const state = store.getState().savedSearches;
      expect(state.items).toHaveLength(1);
      expect(state.items[0].name).toBe('Dubai Marina 2BR');
    });
  });

  // ── createSavedSearch ─────────────────────────────────────────────
  describe('createSavedSearch thunk', () => {
    it('prepends new search to items on fulfilled', () => {
      const state = {
        items: [sampleSearch2], loading: false, error: null, matchResults: {},
      };
      const next = savedSearchesReducer(state, {
        type: createSavedSearch.fulfilled.type,
        payload: sampleSearch,
      });
      expect(next.items).toHaveLength(2);
      expect(next.items[0].id).toBe('ss-1'); // prepended
    });

    it('sets error on rejected', () => {
      const state = getInitialState();
      const next = savedSearchesReducer(state, {
        type: createSavedSearch.rejected.type,
        payload: 'Validation error',
      });
      expect(next.error).toBe('Validation error');
    });

    it('dispatches through store correctly', async () => {
      mockApi.createSavedSearch.mockResolvedValueOnce(sampleSearch);
      const store = createTestStore();
      await store.dispatch(createSavedSearch({
        name: 'Dubai Marina 2BR',
        filters: { location: 'Dubai Marina', bedrooms: 2 },
        alertEnabled: true,
      }));
      expect(store.getState().savedSearches.items).toHaveLength(1);
    });
  });

  // ── updateSavedSearch ─────────────────────────────────────────────
  describe('updateSavedSearch thunk', () => {
    it('replaces item in state on fulfilled', () => {
      const updated = { ...sampleSearch, name: 'Updated Name' };
      const state = {
        items: [sampleSearch, sampleSearch2], loading: false, error: null, matchResults: {},
      };
      const next = savedSearchesReducer(state, {
        type: updateSavedSearch.fulfilled.type,
        payload: updated,
      });
      expect(next.items[0].name).toBe('Updated Name');
      expect(next.items).toHaveLength(2);
    });

    it('sets error on rejected', () => {
      const state = getInitialState();
      const next = savedSearchesReducer(state, {
        type: updateSavedSearch.rejected.type,
        payload: 'Update failed',
      });
      expect(next.error).toBe('Update failed');
    });
  });

  // ── deleteSavedSearch ─────────────────────────────────────────────
  describe('deleteSavedSearch thunk', () => {
    it('removes item from state on fulfilled', () => {
      const state = {
        items: [sampleSearch, sampleSearch2],
        loading: false,
        error: null,
        matchResults: { 'ss-1': { matchCount: 10, previousCount: 5, newMatches: 5 } },
      };
      const next = savedSearchesReducer(state, {
        type: deleteSavedSearch.fulfilled.type,
        payload: 'ss-1',
      });
      expect(next.items).toHaveLength(1);
      expect(next.items[0].id).toBe('ss-2');
      expect(next.matchResults['ss-1']).toBeUndefined();
    });

    it('sets error on rejected', () => {
      const state = getInitialState();
      const next = savedSearchesReducer(state, {
        type: deleteSavedSearch.rejected.type,
        payload: 'Delete failed',
      });
      expect(next.error).toBe('Delete failed');
    });

    it('dispatches through store correctly', async () => {
      mockApi.deleteSavedSearch.mockResolvedValueOnce(undefined);
      const store = createTestStore({
        savedSearches: {
          items: [sampleSearch],
          loading: false,
          error: null,
          matchResults: {},
        },
      });
      await store.dispatch(deleteSavedSearch('ss-1'));
      expect(store.getState().savedSearches.items).toHaveLength(0);
    });
  });

  // ── checkSearchMatches ────────────────────────────────────────────
  describe('checkSearchMatches thunk', () => {
    it('stores match result and updates item matchCount on fulfilled', () => {
      const state = {
        items: [sampleSearch],
        loading: false,
        error: null,
        matchResults: {},
      };
      const next = savedSearchesReducer(state, {
        type: checkSearchMatches.fulfilled.type,
        payload: { id: 'ss-1', result: { matchCount: 20, previousCount: 12, newMatches: 8 } },
      });
      expect(next.matchResults['ss-1']).toEqual({ matchCount: 20, previousCount: 12, newMatches: 8 });
      expect(next.items[0].matchCount).toBe(20);
    });

    it('sets error on rejected', () => {
      const state = getInitialState();
      const next = savedSearchesReducer(state, {
        type: checkSearchMatches.rejected.type,
        payload: 'Match check failed',
      });
      expect(next.error).toBe('Match check failed');
    });
  });

  // ── Logout resets state ───────────────────────────────────────────
  describe('logout reset', () => {
    it('resets to initial state on logout', () => {
      const state = {
        items: [sampleSearch, sampleSearch2],
        loading: true,
        error: 'some error',
        matchResults: { 'ss-1': { matchCount: 10, previousCount: 5, newMatches: 5 } },
      };
      const next = savedSearchesReducer(state, logout());
      expect(next).toEqual({
        items: [],
        loading: false,
        error: null,
        matchResults: {},
      });
    });
  });

  // ── Selectors ─────────────────────────────────────────────────────
  describe('selectors', () => {
    const stateWith = {
      savedSearches: {
        items: [sampleSearch, sampleSearch2],
        loading: true,
        error: 'err',
        matchResults: { 'ss-1': { matchCount: 10, previousCount: 5, newMatches: 5 } },
      },
    };

    it('selectSavedSearches returns items', () => {
      expect(selectSavedSearches(stateWith)).toEqual([sampleSearch, sampleSearch2]);
    });

    it('selectSavedSearches returns [] when slice is missing', () => {
      expect(selectSavedSearches({})).toEqual([]);
    });

    it('selectSavedSearchesLoading returns loading flag', () => {
      expect(selectSavedSearchesLoading(stateWith)).toBe(true);
    });

    it('selectSavedSearchesLoading returns false on missing state', () => {
      expect(selectSavedSearchesLoading({})).toBe(false);
    });

    it('selectSavedSearchesError returns error', () => {
      expect(selectSavedSearchesError(stateWith)).toBe('err');
    });

    it('selectSavedSearchesError returns null on missing state', () => {
      expect(selectSavedSearchesError({})).toBeNull();
    });

    it('selectMatchResults returns match results', () => {
      expect(selectMatchResults(stateWith)).toEqual({
        'ss-1': { matchCount: 10, previousCount: 5, newMatches: 5 },
      });
    });

    it('selectMatchResults returns {} on missing state', () => {
      expect(selectMatchResults({})).toEqual({});
    });

    it('selectSavedSearchCount returns count', () => {
      expect(selectSavedSearchCount(stateWith)).toBe(2);
    });

    it('selectSavedSearchCount returns 0 on missing state', () => {
      expect(selectSavedSearchCount({})).toBe(0);
    });
  });
});
