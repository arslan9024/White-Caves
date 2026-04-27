/**
 * homepageSlice — @Barbara (Database Architect)
 * Redux state for the public Homepage:
 *   - Featured properties (live from /api/homepage/data)
 *   - Market stats summary
 *   - Top sales agents
 *   - Location trend data (Palm Jumeirah, Downtown, etc.)
 *
 * Design-Driven Workflow: This slice is the "ghost" that powers @Una and @Lea's
 * UI components. It runs silently in the background the moment the homepage mounts.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface HomepageProperty {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  location: string;
  area?: string;
  amenities: string[];
  images: string[];
  featured: boolean;
  agentName?: string;
}

export interface MarketStats {
  totalProperties: number;
  availableProperties: number;
  averagePrice: number;
  portfolioValue: number;
  activeAgents: number;
}

export interface TopAgent {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  department: string;
  performanceScore?: number;
  dealsCount: number;
  revenueGenerated: number;
}

export interface LocationTrend {
  name: string;
  propertyCount: number;
  avgPrice: number;
  trendPercent: number;
  trendDirection: 'up' | 'down' | 'flat';
}

export interface HomepageData {
  featuredProperties: HomepageProperty[];
  marketStats: MarketStats;
  topAgents: TopAgent[];
  locationTrends: LocationTrend[];
}

interface HomepageState extends HomepageData {
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const STATIC_FALLBACK_STATS: MarketStats = {
  totalProperties: 500,
  availableProperties: 320,
  averagePrice: 4_500_000,
  portfolioValue: 2_250_000_000,
  activeAgents: 50,
};

const STATIC_FALLBACK_LOCATIONS: LocationTrend[] = [
  { name: 'Palm Jumeirah',  propertyCount: 120, avgPrice: 15_000_000, trendPercent: 12, trendDirection: 'up' },
  { name: 'Downtown Dubai', propertyCount: 200, avgPrice:  8_000_000, trendPercent:  8, trendDirection: 'up' },
  { name: 'Emirates Hills', propertyCount:  45, avgPrice: 35_000_000, trendPercent: 15, trendDirection: 'up' },
  { name: 'Dubai Marina',   propertyCount: 180, avgPrice:  5_000_000, trendPercent: 10, trendDirection: 'up' },
];

const initialState: HomepageState = {
  featuredProperties: [],
  marketStats: STATIC_FALLBACK_STATS,
  topAgents: [],
  locationTrends: STATIC_FALLBACK_LOCATIONS,
  isLoading: false,
  error: null,
  lastFetchedAt: null,
};

// ─── Async Thunk ──────────────────────────────────────────────────────────────

/**
 * fetchHomepageData — single round-trip to /api/homepage/data
 * Returns: featuredProperties, marketStats, topAgents, locationTrends
 * @Mira's aggregate endpoint — no auth required (public route)
 */
export const fetchHomepageData = createAsyncThunk<
  HomepageData,
  void,
  { rejectValue: string }
>(
  'homepage/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/homepage/data', {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(
          (errorData as { error?: string }).error ?? `HTTP ${response.status}`
        );
      }

      const json = await response.json() as { success: boolean; data: HomepageData };
      return json.data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      return rejectWithValue(message);
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const homepageSlice = createSlice({
  name: 'homepage',
  initialState,
  reducers: {
    /** Manually override market stats (used by MarketStatsBanner refresh) */
    setMarketStats(state, action: PayloadAction<MarketStats>) {
      state.marketStats = action.payload;
    },
    /** Clear error after display */
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomepageData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomepageData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastFetchedAt = Date.now();
        // Merge live data, fall back to static defaults if API returns empty arrays
        state.featuredProperties = action.payload.featuredProperties?.length
          ? action.payload.featuredProperties
          : state.featuredProperties;
        state.marketStats = action.payload.marketStats ?? state.marketStats;
        state.topAgents = action.payload.topAgents ?? state.topAgents;
        state.locationTrends = action.payload.locationTrends?.length
          ? action.payload.locationTrends
          : state.locationTrends;
      })
      .addCase(fetchHomepageData.rejected, (state, action) => {
        state.isLoading = false;
        // Keep static fallback data on error — page never goes blank
        state.error = action.payload ?? 'Failed to load homepage data';
      });
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const { setMarketStats, clearError } = homepageSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectFeaturedProperties    = (state: RootState) => state.homepage.featuredProperties;
export const selectMarketStats           = (state: RootState) => state.homepage.marketStats;
export const selectTopAgents             = (state: RootState) => state.homepage.topAgents;
export const selectLocationTrends        = (state: RootState) => state.homepage.locationTrends;
export const selectIsHomepageLoading     = (state: RootState) => state.homepage.isLoading;
export const selectHomepageError         = (state: RootState) => state.homepage.error;
export const selectHomepageLastFetched   = (state: RootState) => state.homepage.lastFetchedAt;

export default homepageSlice.reducer;
