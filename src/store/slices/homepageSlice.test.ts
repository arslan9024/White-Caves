/**
 * homepageSlice.test.ts — @Katherine (QA Lead)
 * Unit tests for homepageSlice: reducers, async thunk, and selectors.
 * Target: >80% branch coverage
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import homepageReducer, {
  fetchHomepageData,
  setMarketStats,
  clearError,
  selectFeaturedProperties,
  selectMarketStats,
  selectTopAgents,
  selectLocationTrends,
  selectIsHomepageLoading,
  selectHomepageError,
  selectHomepageLastFetched,
  type HomepageData,
  type MarketStats,
} from './homepageSlice';
import type { RootState } from '../store';

// ─── Test Helpers ─────────────────────────────────────────────────────────────

const makeStore = () =>
  configureStore({ reducer: { homepage: homepageReducer } });

type TestStore = ReturnType<typeof makeStore>;

const MOCK_STATS: MarketStats = {
  totalProperties: 600,
  availableProperties: 400,
  averagePrice: 5_000_000,
  portfolioValue: 3_000_000_000,
  activeAgents: 60,
};

const MOCK_HOMEPAGE_DATA: HomepageData = {
  featuredProperties: [
    {
      id: 'prop-1',
      title: 'Palm Jumeirah Villa',
      type: 'villa',
      status: 'available',
      price: 12_000_000,
      currency: 'AED',
      bedrooms: 5,
      bathrooms: 6,
      sqft: 8000,
      location: 'Palm Jumeirah',
      amenities: ['pool', 'gym'],
      images: ['https://example.com/1.jpg'],
      featured: true,
      agentName: 'Sarah Ahmed',
    },
  ],
  marketStats: MOCK_STATS,
  topAgents: [
    {
      id: 'agent-1',
      name: 'Sarah Ahmed',
      email: 'sarah@whitecaves.com',
      department: 'Luxury Sales',
      performanceScore: 98,
      dealsCount: 42,
      revenueGenerated: 250_000_000,
    },
  ],
  locationTrends: [
    {
      name: 'Palm Jumeirah',
      propertyCount: 130,
      avgPrice: 16_000_000,
      trendPercent: 14,
      trendDirection: 'up',
    },
  ],
};

// ─── Initial State ────────────────────────────────────────────────────────────

describe('homepageSlice — initial state', () => {
  it('has correct initial values', () => {
    const state = homepageReducer(undefined, { type: '@@init' });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.lastFetchedAt).toBeNull();
    expect(state.featuredProperties).toEqual([]);
    // Static fallback stats should be pre-populated
    expect(state.marketStats.totalProperties).toBe(500);
    expect(state.marketStats.activeAgents).toBe(50);
    // Static fallback location trends
    expect(state.locationTrends).toHaveLength(4);
    expect(state.locationTrends[0].name).toBe('Palm Jumeirah');
    expect(state.topAgents).toEqual([]);
  });
});

// ─── Reducers ─────────────────────────────────────────────────────────────────

describe('homepageSlice — setMarketStats', () => {
  it('replaces marketStats in state', () => {
    const state = homepageReducer(undefined, setMarketStats(MOCK_STATS));
    expect(state.marketStats).toEqual(MOCK_STATS);
    expect(state.marketStats.totalProperties).toBe(600);
  });

  it('does not touch other state fields', () => {
    const before = homepageReducer(undefined, { type: '@@init' });
    const after = homepageReducer(before, setMarketStats(MOCK_STATS));
    expect(after.featuredProperties).toEqual(before.featuredProperties);
    expect(after.topAgents).toEqual(before.topAgents);
    expect(after.locationTrends).toEqual(before.locationTrends);
  });
});

describe('homepageSlice — clearError', () => {
  it('sets error to null', () => {
    const stateWithError = homepageReducer(
      undefined,
      fetchHomepageData.rejected(new Error('Network error'), '', undefined, 'Network error')
    );
    expect(stateWithError.error).not.toBeNull();
    const cleared = homepageReducer(stateWithError, clearError());
    expect(cleared.error).toBeNull();
  });

  it('is a no-op when error is already null', () => {
    const state = homepageReducer(undefined, { type: '@@init' });
    const after = homepageReducer(state, clearError());
    expect(after.error).toBeNull();
  });
});

// ─── Async Thunk: fetchHomepageData ───────────────────────────────────────────

describe('fetchHomepageData.pending', () => {
  it('sets isLoading=true and clears error', () => {
    const stateWithError = homepageReducer(
      undefined,
      fetchHomepageData.rejected(new Error(), '', undefined, 'old error')
    );
    const pending = homepageReducer(stateWithError, fetchHomepageData.pending('req-1', undefined));
    expect(pending.isLoading).toBe(true);
    expect(pending.error).toBeNull();
  });
});

describe('fetchHomepageData.fulfilled', () => {
  it('stores live data and clears loading', () => {
    const state = homepageReducer(
      undefined,
      fetchHomepageData.fulfilled(MOCK_HOMEPAGE_DATA, 'req-1', undefined)
    );
    expect(state.isLoading).toBe(false);
    expect(state.featuredProperties).toHaveLength(1);
    expect(state.featuredProperties[0].title).toBe('Palm Jumeirah Villa');
    expect(state.marketStats).toEqual(MOCK_STATS);
    expect(state.topAgents).toHaveLength(1);
    expect(state.locationTrends).toHaveLength(1);
    expect(state.lastFetchedAt).toBeGreaterThan(0);
  });

  it('falls back to existing featuredProperties when API returns empty array', () => {
    const preloaded = homepageReducer(
      undefined,
      fetchHomepageData.fulfilled(MOCK_HOMEPAGE_DATA, 'req-1', undefined)
    );
    const emptyPayload: HomepageData = {
      ...MOCK_HOMEPAGE_DATA,
      featuredProperties: [],
    };
    const after = homepageReducer(
      preloaded,
      fetchHomepageData.fulfilled(emptyPayload, 'req-2', undefined)
    );
    // Should keep the previously loaded properties
    expect(after.featuredProperties).toHaveLength(1);
  });

  it('falls back to existing locationTrends when API returns empty array', () => {
    const emptyPayload: HomepageData = {
      ...MOCK_HOMEPAGE_DATA,
      locationTrends: [],
    };
    const state = homepageReducer(
      undefined,
      fetchHomepageData.fulfilled(emptyPayload, 'req-1', undefined)
    );
    // Should keep static fallback (4 items)
    expect(state.locationTrends).toHaveLength(4);
  });

  it('uses API marketStats even if it differs from fallback', () => {
    const customStats: MarketStats = {
      totalProperties: 999,
      availableProperties: 800,
      averagePrice: 10_000_000,
      portfolioValue: 9_999_000_000,
      activeAgents: 100,
    };
    const state = homepageReducer(
      undefined,
      fetchHomepageData.fulfilled(
        { ...MOCK_HOMEPAGE_DATA, marketStats: customStats },
        'req-1',
        undefined
      )
    );
    expect(state.marketStats.totalProperties).toBe(999);
  });
});

describe('fetchHomepageData.rejected', () => {
  it('sets error and clears loading', () => {
    const state = homepageReducer(
      undefined,
      fetchHomepageData.rejected(new Error(), '', undefined, 'API 503')
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('API 503');
  });

  it('uses default message when payload is undefined', () => {
    const state = homepageReducer(
      undefined,
      fetchHomepageData.rejected(new Error(), '', undefined, undefined)
    );
    expect(state.error).toBe('Failed to load homepage data');
  });

  it('preserves static fallback data on error (page never goes blank)', () => {
    const state = homepageReducer(
      undefined,
      fetchHomepageData.rejected(new Error(), '', undefined, 'timeout')
    );
    // Static fallback data should still be present
    expect(state.locationTrends).toHaveLength(4);
    expect(state.marketStats.totalProperties).toBe(500);
  });
});

// ─── Thunk Integration (with fetch mock) ─────────────────────────────────────

describe('fetchHomepageData thunk — fetch integration', () => {
  let store: TestStore;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    store = makeStore();
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('dispatches fulfilled on 200 response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: MOCK_HOMEPAGE_DATA }),
    } as Response);

    await store.dispatch(fetchHomepageData());
    const state = store.getState().homepage;
    expect(state.isLoading).toBe(false);
    expect(state.featuredProperties).toHaveLength(1);
    expect(state.error).toBeNull();
  });

  it('dispatches rejected on non-ok response with error field', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({ error: 'Service Unavailable' }),
    } as Response);

    await store.dispatch(fetchHomepageData());
    const state = store.getState().homepage;
    expect(state.error).toBe('Server error (503) — please try again later');
    expect(state.isLoading).toBe(false);
  });

  it('dispatches rejected on non-ok response with no error field', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    await store.dispatch(fetchHomepageData());
    const state = store.getState().homepage;
    expect(state.error).toBe('Server error (500) — please try again later');
  });

  it('dispatches rejected when json() throws on error response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 502,
      json: async () => { throw new Error('not JSON'); },
    } as unknown as Response);

    await store.dispatch(fetchHomepageData());
    const state = store.getState().homepage;
    expect(state.error).toBe('Server error (502) — please try again later');
  });

  it('dispatches rejected on network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch'));

    await store.dispatch(fetchHomepageData());
    const state = store.getState().homepage;
    expect(state.error).toBe('Failed to fetch');
  });

  it('dispatches rejected with generic message on non-Error throws', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce('string error');

    await store.dispatch(fetchHomepageData());
    const state = store.getState().homepage;
    expect(state.error).toBe('Network error');
  });

  it('sets isLoading true while pending', async () => {
    let resolveResponse!: (val: Response) => void;
    const pendingPromise = new Promise<Response>((res) => { resolveResponse = res; });
    vi.spyOn(globalThis, 'fetch').mockReturnValueOnce(pendingPromise);

    const dispatch = store.dispatch(fetchHomepageData());
    expect(store.getState().homepage.isLoading).toBe(true);

    // Resolve to avoid dangling promise
    resolveResponse({
      ok: true,
      json: async () => ({ success: true, data: MOCK_HOMEPAGE_DATA }),
    } as Response);
    await dispatch;
  });
});

// ─── Selectors ────────────────────────────────────────────────────────────────

describe('homepageSlice — selectors', () => {
  let store: TestStore;

  // Selectors are typed against RootState; cast the mini-store state for type-safety
  const rootState = () => store.getState() as unknown as RootState;

  beforeEach(() => {
    store = makeStore();
  });

  it('selectFeaturedProperties returns empty array initially', () => {
    expect(selectFeaturedProperties(rootState())).toEqual([]);
  });

  it('selectMarketStats returns static fallback initially', () => {
    const stats = selectMarketStats(rootState());
    expect(stats.totalProperties).toBe(500);
    expect(stats.activeAgents).toBe(50);
  });

  it('selectTopAgents returns empty array initially', () => {
    expect(selectTopAgents(rootState())).toEqual([]);
  });

  it('selectLocationTrends returns 4 static fallback entries initially', () => {
    expect(selectLocationTrends(rootState())).toHaveLength(4);
  });

  it('selectIsHomepageLoading returns false initially', () => {
    expect(selectIsHomepageLoading(rootState())).toBe(false);
  });

  it('selectHomepageError returns null initially', () => {
    expect(selectHomepageError(rootState())).toBeNull();
  });

  it('selectHomepageLastFetched returns null initially', () => {
    expect(selectHomepageLastFetched(rootState())).toBeNull();
  });

  it('selectors reflect fulfilled dispatch', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: MOCK_HOMEPAGE_DATA }),
    } as Response);

    await store.dispatch(fetchHomepageData());

    expect(selectFeaturedProperties(rootState())).toHaveLength(1);
    expect(selectTopAgents(rootState())).toHaveLength(1);
    expect(selectLocationTrends(rootState())).toHaveLength(1);
    expect(selectMarketStats(rootState()).totalProperties).toBe(600);
    expect(selectIsHomepageLoading(rootState())).toBe(false);
    expect(selectHomepageLastFetched(rootState())).not.toBeNull();
  });

  it('selectIsHomepageLoading is true during pending', async () => {
    let resolve!: (val: Response) => void;
    vi.spyOn(globalThis, 'fetch').mockReturnValueOnce(
      new Promise<Response>((r) => { resolve = r; })
    );

    const thunk = store.dispatch(fetchHomepageData());
    expect(selectIsHomepageLoading(rootState())).toBe(true);

    resolve({
      ok: true,
      json: async () => ({ success: true, data: MOCK_HOMEPAGE_DATA }),
    } as Response);
    await thunk;
  });
});
