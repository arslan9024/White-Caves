/**
 * Properties Market & Valuation Analytics Thunks
 * Single Purpose: Market overview, price trends, rental yields, comparables, and demand heatmap.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch, extractApiError } from '../../../utils/authFetch';
import { getErrorMessage } from '../../../constants';
import type { CRMItem } from './crmTypes';

export const fetchMarketOverviewAPI = createAsyncThunk<
  Record<string, unknown>,
  void,
  { rejectValue: string }
>('crmData/fetchMarketOverview', async (_, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/analytics/overview');
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch market overview');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch market overview'));
  }
});

/** Price per sqft trends — GET /api/analytics/trends */
export const fetchPriceTrendsAPI = createAsyncThunk<
  Array<Record<string, unknown>>,
  { area?: string; type?: string; days?: number } | void,
  { rejectValue: string }
>('crmData/fetchPriceTrends', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params) {
      if (params.area) query.set('area', params.area);
      if (params.type) query.set('type', params.type);
      if (params.days) query.set('days', String(params.days));
    }
    const url = `/api/analytics/trends${query.toString() ? '?' + query.toString() : ''}`;
    const res = await authFetch(url);
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch price trends');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch price trends'));
  }
});

/** Rental yields — GET /api/analytics/yields */
export const fetchRentalYieldsAPI = createAsyncThunk<
  Array<Record<string, unknown>>,
  { area?: string; type?: string } | void,
  { rejectValue: string }
>('crmData/fetchRentalYields', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params) {
      if (params.area) query.set('area', params.area);
      if (params.type) query.set('type', params.type);
    }
    const url = `/api/analytics/yields${query.toString() ? '?' + query.toString() : ''}`;
    const res = await authFetch(url);
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch rental yields');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch rental yields'));
  }
});

/** Comparable properties — GET /api/analytics/comparables/:propertyId */
export const fetchComparablesAPI = createAsyncThunk<
  Array<Record<string, unknown>>,
  { propertyId: string; limit?: number },
  { rejectValue: string }
>('crmData/fetchComparables', async ({ propertyId, limit }, { rejectWithValue }) => {
  try {
    const query = limit ? `?limit=${limit}` : '';
    const res = await authFetch(`/api/analytics/comparables/${propertyId}${query}`);
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch comparables');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch comparables'));
  }
});

/** Demand heatmap — GET /api/analytics/demand */
export const fetchDemandHeatmapAPI = createAsyncThunk<
  Array<Record<string, unknown>>,
  { days?: number } | void,
  { rejectValue: string }
>('crmData/fetchDemandHeatmap', async (params, { rejectWithValue }) => {
  try {
    const query = params?.days ? `?days=${params.days}` : '';
    const res = await authFetch(`/api/analytics/demand${query}`);
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch demand heatmap');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch demand heatmap'));
  }
});

/** Offer spread analytics — GET /api/analytics/offer-spread */
export const fetchOfferSpreadAPI = createAsyncThunk<
  Array<Record<string, unknown>>,
  { area?: string; days?: number } | void,
  { rejectValue: string }
>('crmData/fetchOfferSpread', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params) {
      if (params.area) query.set('area', params.area);
      if (params.days) query.set('days', String(params.days));
    }
    const url = `/api/analytics/offer-spread${query.toString() ? '?' + query.toString() : ''}`;
    const res = await authFetch(url);
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch offer spread');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch offer spread'));
  }
});

// ============================================================================
// WHATSAPP ASSISTANT THUNKS (Phase 4D)
// ============================================================================

/** Classify WhatsApp intent — POST /api/nadia/assistant/classify */
