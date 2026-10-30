/**
 * Leads Follow-Up & Funnel Thunks
 * Single Purpose: Follow-up sequences, cadence management, and funnel telemetry.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch, extractApiError } from '../../../utils/authFetch';
import { getErrorMessage } from '../../../constants';
import type { CRMItem } from './crmTypes';

export const startFollowUpAPI = createAsyncThunk<
  Record<string, unknown>,
  { leadId: string; cadenceType?: string },
  { rejectValue: string }
>('crmData/startFollowUp', async ({ leadId, cadenceType }, { rejectWithValue }) => {
  try {
    const res = await authFetch(`/api/follow-ups/${leadId}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cadenceType }),
    });
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to start follow-up');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to start follow-up'));
  }
});

/** Get all follow-up sequences for a lead — GET /api/follow-ups/:leadId */
export const fetchLeadFollowUpsAPI = createAsyncThunk<
  Record<string, unknown>[],
  string,
  { rejectValue: string }
>('crmData/fetchLeadFollowUps', async (leadId, { rejectWithValue }) => {
  try {
    const res = await authFetch(`/api/follow-ups/${leadId}`);
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch follow-ups');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch follow-ups'));
  }
});

/** Pause a follow-up sequence — POST /api/follow-ups/sequence/:id/pause */
export const pauseFollowUpAPI = createAsyncThunk<void, string, { rejectValue: string }>(
  'crmData/pauseFollowUp',
  async (sequenceId, { rejectWithValue }) => {
    try {
      const res = await authFetch(`/api/follow-ups/sequence/${sequenceId}/pause`, {
        method: 'POST',
      });
      const json = await res.json();
      if (!res.ok) return rejectWithValue(json.error || 'Failed to pause follow-up');
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to pause follow-up'));
    }
  }
);

/** Resume a follow-up sequence — POST /api/follow-ups/sequence/:id/resume */
export const resumeFollowUpAPI = createAsyncThunk<void, string, { rejectValue: string }>(
  'crmData/resumeFollowUp',
  async (sequenceId, { rejectWithValue }) => {
    try {
      const res = await authFetch(`/api/follow-ups/sequence/${sequenceId}/resume`, {
        method: 'POST',
      });
      const json = await res.json();
      if (!res.ok) return rejectWithValue(json.error || 'Failed to resume follow-up');
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to resume follow-up'));
    }
  }
);

/** Cancel a follow-up sequence — POST /api/follow-ups/sequence/:id/cancel */
export const cancelFollowUpAPI = createAsyncThunk<
  void,
  { sequenceId: string; reason?: string },
  { rejectValue: string }
>('crmData/cancelFollowUp', async ({ sequenceId, reason }, { rejectWithValue }) => {
  try {
    const res = await authFetch(`/api/follow-ups/sequence/${sequenceId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to cancel follow-up');
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to cancel follow-up'));
  }
});

/** Get follow-up statistics — GET /api/follow-ups/stats */
export const fetchFollowUpStatsAPI = createAsyncThunk<
  Record<string, unknown>,
  void,
  { rejectValue: string }
>('crmData/fetchFollowUpStats', async (_, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/follow-ups/stats');
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch follow-up stats');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch follow-up stats'));
  }
});

// ============================================================================
// DOCUMENT GENERATION THUNKS
// ============================================================================

/** Generate a document — POST /api/documents/generate */

export const fetchLeadFunnelAPI = createAsyncThunk<
  Record<string, unknown>,
  void,
  { rejectValue: string }
>('crmData/fetchLeadFunnel', async (_, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/dashboard/lead-funnel');
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch lead funnel');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch lead funnel'));
  }
});

/** Fetch time-series trends — GET /api/dashboard/trends?days=N */
