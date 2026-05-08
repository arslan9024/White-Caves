/**
 * searchLeadsSlice — Redux state for homepage search → CRM lead capture
 * TASK-004: Create searchLeadsSlice.ts Redux slice
 * Phase 27 — Property Search ↔ CRM Lead Integration
 *
 * Flow:
 *   User submits HeroSearchBar → dispatch(createSearchLead(params))
 *   → POST /api/leads/from-search → Lead persisted in MongoDB
 *   → State updated → Gold toast shown
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { SearchLeadPayload, SearchLeadRecord, SearchLeadsState } from '../../types/searchLead';
import { authFetch } from '../../utils/authFetch';

// ─── Async Thunk ────────────────────────────────────────────────────────────

/**
 * TASK-006: Calls POST /api/leads/from-search
 * No auth required — public endpoint for anonymous visitors.
 */
export const createSearchLead = createAsyncThunk<
  SearchLeadRecord,
  SearchLeadPayload,
  { rejectValue: string }
>('searchLeads/create', async (payload, { rejectWithValue }) => {
  try {
    const response = await authFetch('/api/leads/from-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { message?: string };
      return rejectWithValue(data.message ?? `HTTP ${response.status}`);
    }

    const data = (await response.json()) as { success: boolean; data: SearchLeadRecord };
    return data.data;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error';
    return rejectWithValue(message);
  }
});

// ─── Initial State ───────────────────────────────────────────────────────────

const initialState: SearchLeadsState = {
  submittedCount: 0,
  submitting: false,
  lastLeadId: null,
  lastSubmittedAt: null,
  error: null,
};

// ─── Slice ───────────────────────────────────────────────────────────────────

const searchLeadsSlice = createSlice({
  name: 'searchLeads',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createSearchLead.pending, state => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createSearchLead.fulfilled, (state, action) => {
        state.submitting = false;
        state.submittedCount += 1;
        state.lastLeadId = action.payload.id;
        state.lastSubmittedAt = new Date().toISOString();
      })
      .addCase(createSearchLead.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

// ─── Selectors ───────────────────────────────────────────────────────────────

export const selectSearchLeadSubmitting = (state: RootState) => state.searchLeads.submitting;

export const selectSearchLeadCount = (state: RootState) => state.searchLeads.submittedCount;

export const selectLastSearchLeadId = (state: RootState) => state.searchLeads.lastLeadId;

// ─── Exports ─────────────────────────────────────────────────────────────────

export default searchLeadsSlice.reducer;
