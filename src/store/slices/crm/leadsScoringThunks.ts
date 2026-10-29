/**
 * Leads Scoring & Routing Thunks
 * Single Purpose: AI scoring, override, trending, and smart agent auto-routing.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch, extractApiError } from '../../../utils/authFetch';
import { getErrorMessage } from '../../../constants';
import type { CRMItem } from './crmTypes';

export const scoreLeadAPI = createAsyncThunk<CRMItem, string, { rejectValue: string }>(
  'crmData/scoreLead',
  async (leadId, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/leads/${leadId}/score`);
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to score lead'));
      const json = await response.json();
      return json.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to score lead'));
    }
  }
);

/** Override lead score manually — POST /api/leads/:id/score/override */
export const overrideLeadScoreAPI = createAsyncThunk<
  CRMItem,
  { leadId: string; score: number; reason: string },
  { rejectValue: string }
>('crmData/overrideLeadScore', async ({ leadId, score, reason }, { rejectWithValue }) => {
  try {
    const response = await authFetch(`/api/leads/${leadId}/score/override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, reason }),
    });
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to override score'));
    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to override score'));
  }
});

/** Trigger batch re-scoring — POST /api/leads/batch-rescore */
export const batchRescoreLeadsAPI = createAsyncThunk<
  Record<string, unknown>,
  void,
  { rejectValue: string }
>('crmData/batchRescoreLeads', async (_, { rejectWithValue }) => {
  try {
    const response = await authFetch('/api/leads/batch-rescore', { method: 'POST' });
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to batch re-score'));
    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to batch re-score'));
  }
});

/** Fetch scored leads — GET /api/leads/scored */
export const fetchScoredLeadsAPI = createAsyncThunk<
  Record<string, unknown>,
  { tier?: string; page?: number; pageSize?: number } | void,
  { rejectValue: string }
>('crmData/fetchScoredLeads', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params && typeof params === 'object') {
      if (params.tier) query.set('tier', params.tier);
      if (params.page) query.set('page', String(params.page));
      if (params.pageSize) query.set('pageSize', String(params.pageSize));
    }
    const qs = query.toString();
    const response = await authFetch(`/api/leads/scored${qs ? `?${qs}` : ''}`);
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to fetch scored leads'));
    const json = await response.json();
    return json;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch scored leads'));
  }
});

/** Fetch routing rules — GET /api/leads/routing-rules */
export const fetchRoutingRulesAPI = createAsyncThunk<
  Record<string, unknown>,
  void,
  { rejectValue: string }
>('crmData/fetchRoutingRules', async (_, { rejectWithValue }) => {
  try {
    const response = await authFetch('/api/leads/routing-rules');
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to fetch routing rules'));
    const json = await response.json();
    return json;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch routing rules'));
  }
});

/** Fetch score history — GET /api/leads/:id/score/history */
export const fetchScoreHistoryAPI = createAsyncThunk<
  Record<string, unknown>,
  { leadId: string; limit?: number; days?: number },
  { rejectValue: string }
>('crmData/fetchScoreHistory', async ({ leadId, limit, days }, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (limit) query.set('limit', String(limit));
    if (days) query.set('days', String(days));
    const qs = query.toString();
    const response = await authFetch(`/api/leads/${leadId}/score/history${qs ? `?${qs}` : ''}`);
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to fetch score history'));
    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch score history'));
  }
});

/** Fetch trending leads — GET /api/leads/trending */
export const fetchLeadTrendingAPI = createAsyncThunk<
  Record<string, unknown>,
  { days?: number; minChange?: number } | void,
  { rejectValue: string }
>('crmData/fetchLeadTrending', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params && typeof params === 'object') {
      if (params.days) query.set('days', String(params.days));
      if (params.minChange) query.set('minChange', String(params.minChange));
    }
    const qs = query.toString();
    const response = await authFetch(`/api/leads/trending${qs ? `?${qs}` : ''}`);
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to fetch lead trending'));
    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch lead trending'));
  }
});

/** Apply WhatsApp signals to lead score — POST /api/leads/:id/score/whatsapp */
export const applyWhatsAppScoreAPI = createAsyncThunk<
  Record<string, unknown>,
  { leadId: string; signals: Record<string, number> },
  { rejectValue: string }
>('crmData/applyWhatsAppScore', async ({ leadId, signals }, { rejectWithValue }) => {
  try {
    const response = await authFetch(`/api/leads/${leadId}/score/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signals),
    });
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to apply WhatsApp score'));
    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to apply WhatsApp score'));
  }
});

/** Auto-route a lead — POST /api/leads/:id/auto-route */
export const autoRouteLeadAPI = createAsyncThunk<
  Record<string, unknown>,
  string,
  { rejectValue: string }
>('crmData/autoRouteLead', async (leadId, { rejectWithValue }) => {
  try {
    const response = await authFetch(`/api/leads/${leadId}/auto-route`, { method: 'POST' });
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to auto-route lead'));
    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to auto-route lead'));
  }
});

/** Fetch agent performance for lead routing — GET /api/leads/agent-performance */
export const fetchLeadRoutingAgentsAPI = createAsyncThunk<
  Record<string, unknown>[],
  void,
  { rejectValue: string }
>('crmData/fetchLeadRoutingAgents', async (_, { rejectWithValue }) => {
  try {
    const response = await authFetch('/api/leads/agent-performance');
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to fetch agent performance'));
    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch agent performance'));
  }
});

// ============================================================================
// FOLLOW-UP SEQUENCE THUNKS
// ============================================================================

/** Start a follow-up sequence for a lead — POST /api/follow-ups/:leadId/start */
