/**
 * Saved Searches Redux Slice
 * ──────────────────────────
 * Full CRUD state management for saved property searches.
 * Stores search criteria, alert preferences, and match counts.
 */

import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { logout } from '../authSlice';
import * as api from '../../services/savedSearchesApi';

// ─── State types ─────────────────────────────────────────────────────

interface SavedSearchesState {
  items: api.SavedSearch[];
  loading: boolean;
  error: string | null;
  /** Tracks check-match results per search ID */
  matchResults: Record<string, api.MatchCheckResult>;
}

const initialState: SavedSearchesState = {
  items: [],
  loading: false,
  error: null,
  matchResults: {},
};

// ─── Async Thunks ────────────────────────────────────────────────────

export const fetchSavedSearches = createAsyncThunk<
  api.SavedSearch[],
  void,
  { rejectValue: string }
>(
  'savedSearches/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await api.fetchSavedSearches();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to fetch saved searches';
      return rejectWithValue(msg);
    }
  },
);

export const createSavedSearch = createAsyncThunk<
  api.SavedSearch,
  { name: string; filters: api.SearchFilters; alertEnabled?: boolean },
  { rejectValue: string }
>(
  'savedSearches/create',
  async ({ name, filters, alertEnabled }, { rejectWithValue }) => {
    try {
      return await api.createSavedSearch(name, filters, alertEnabled);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to create saved search';
      return rejectWithValue(msg);
    }
  },
);

export const updateSavedSearch = createAsyncThunk<
  api.SavedSearch,
  { id: string; updates: Partial<Pick<api.SavedSearch, 'name' | 'filters' | 'alertEnabled'>> },
  { rejectValue: string }
>(
  'savedSearches/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      return await api.updateSavedSearch(id, updates);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to update saved search';
      return rejectWithValue(msg);
    }
  },
);

export const deleteSavedSearch = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'savedSearches/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteSavedSearch(id);
      return id;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to delete saved search';
      return rejectWithValue(msg);
    }
  },
);

export const checkSearchMatches = createAsyncThunk<
  { id: string; result: api.MatchCheckResult },
  string,
  { rejectValue: string }
>(
  'savedSearches/checkMatches',
  async (id, { rejectWithValue }) => {
    try {
      const result = await api.checkSavedSearchMatches(id);
      return { id, result };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to check matches';
      return rejectWithValue(msg);
    }
  },
);

// ─── Slice ───────────────────────────────────────────────────────────

const savedSearchesSlice = createSlice({
  name: 'savedSearches',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMatchResult: (state, action: PayloadAction<string>) => {
      delete state.matchResults[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch all ────────────────────────────────────────────────
      .addCase(fetchSavedSearches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedSearches.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchSavedSearches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      })

      // ── Create ───────────────────────────────────────────────────
      .addCase(createSavedSearch.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createSavedSearch.rejected, (state, action) => {
        state.error = action.payload || 'Unknown error';
      })

      // ── Update ───────────────────────────────────────────────────
      .addCase(updateSavedSearch.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateSavedSearch.rejected, (state, action) => {
        state.error = action.payload || 'Unknown error';
      })

      // ── Delete ───────────────────────────────────────────────────
      .addCase(deleteSavedSearch.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload);
        delete state.matchResults[action.payload];
      })
      .addCase(deleteSavedSearch.rejected, (state, action) => {
        state.error = action.payload || 'Unknown error';
      })

      // ── Check matches ────────────────────────────────────────────
      .addCase(checkSearchMatches.fulfilled, (state, action) => {
        const { id, result } = action.payload;
        state.matchResults[id] = result;
        // Update the item's matchCount
        const item = state.items.find((s) => s.id === id);
        if (item) item.matchCount = result.matchCount;
      })
      .addCase(checkSearchMatches.rejected, (state, action) => {
        state.error = action.payload || 'Unknown error';
      })

      // ── Logout resets ────────────────────────────────────────────
      .addCase(logout, () => initialState);
  },
});

export const { clearError, clearMatchResult } = savedSearchesSlice.actions;

// ─── Selectors ───────────────────────────────────────────────────────

interface RootWithSavedSearches {
  savedSearches?: SavedSearchesState;
}

export const selectSavedSearches = createSelector(
  (state: RootWithSavedSearches) => state.savedSearches?.items,
  (items): api.SavedSearch[] => items || [],
);

export const selectSavedSearchesLoading = (state: RootWithSavedSearches) =>
  state.savedSearches?.loading ?? false;

export const selectSavedSearchesError = (state: RootWithSavedSearches) =>
  state.savedSearches?.error ?? null;

export const selectMatchResults = (state: RootWithSavedSearches) =>
  state.savedSearches?.matchResults ?? {};

export const selectSavedSearchCount = createSelector(
  selectSavedSearches,
  (items) => items.length,
);

export default savedSearchesSlice.reducer;
