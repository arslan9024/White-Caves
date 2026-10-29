/**
 * Agents & Executive Dashboard Thunks
 * Single Purpose: Agent rosters, performance telemetry, executive KPI overview, and trend charts.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch, extractApiError } from '../../../utils/authFetch';
import { getErrorMessage } from '../../../constants';
import { DEV_AGENTS, DEV_OVERVIEW } from '../../../data/devData';
import type { CRMItem } from './crmTypes';

export const fetchAgentsFromAPI = createAsyncThunk<CRMItem[], void, { rejectValue: string }>(
  'crmData/fetchAgents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/users?role=agent');
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to fetch agents'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch agents'));
    }
  }
);

/** Fetch dashboard overview from the backend API */
export const fetchDashboardOverview = createAsyncThunk<
  Record<string, unknown>,
  void,
  { rejectValue: string }
>('crmData/fetchDashboardOverview', async (_, { rejectWithValue }) => {
  try {
    const response = await authFetch('/api/dashboard/summary');
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to fetch dashboard'));
    const data = await response.json();
    return data.data || data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch dashboard overview'));
  }
});

/** Create a new lead via API */

export const fetchTrendsAPI = createAsyncThunk<
  Record<string, unknown>,
  { days?: number } | void,
  { rejectValue: string }
>('crmData/fetchTrends', async (params, { rejectWithValue }) => {
  try {
    const days = params && 'days' in params ? params.days : 30;
    const res = await authFetch(`/api/dashboard/trends?days=${days}`);
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch trends');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch trends'));
  }
});

/** Fetch property aging data — GET /api/dashboard/property-aging */

export const fetchAgentPerformanceAPI = createAsyncThunk<
  Record<string, unknown>,
  void,
  { rejectValue: string }
>('crmData/fetchAgentPerformance', async (_, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/dashboard/agent-performance');
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch agent performance');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch agent performance'));
  }
});

/** Fetch executive dashboard summary — GET /api/dashboard/executive */
export const fetchExecutiveDashboardAPI = createAsyncThunk<
  Record<string, unknown>,
  void,
  { rejectValue: string }
>('crmData/fetchExecutiveDashboard', async (_, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/dashboard/executive');
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch executive dashboard');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch executive dashboard'));
  }
});

/** Fetch 30-day KPIs — GET /api/dashboard/kpis */
export const fetchKPIsAPI = createAsyncThunk<
  Record<string, unknown>,
  void,
  { rejectValue: string }
>('crmData/fetchKPIs', async (_, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/dashboard/kpis');
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch KPIs');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch KPIs'));
  }
});

// ============================================================================
// CURRENCY THUNKS (Phase 2E — Multi-Currency Support)
// ============================================================================

/** Fetch exchange rates — GET /api/currency/rates */
