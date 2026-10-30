/**
 * Commissions & VAT Thunks
 * Single Purpose: Commission splits, agent payouts, finance summaries, and VAT tracking.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch, extractApiError } from '../../../utils/authFetch';
import { getErrorMessage } from '../../../constants';
import { DEV_COMMISSIONS } from '../../../data/devData';
import type { CRMItem } from './crmTypes';

export const fetchCommissionsFromAPI = createAsyncThunk<
  CRMItem[],
  { page?: number; pageSize?: number; status?: string; type?: string; agentId?: string },
  { rejectValue: string }
>('crmData/fetchCommissions', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    if (params.status) query.set('status', params.status);
    if (params.type) query.set('type', params.type);
    if (params.agentId) query.set('agentId', params.agentId);
    const response = await authFetch(`/api/finance/commissions?${query.toString()}`);
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to fetch commissions'));
    const data = await response.json();
    return data.data || data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch commissions'));
  }
});

/** Fetch financial summary from /api/finance/summary */
export const fetchFinanceSummary = createAsyncThunk<
  Record<string, unknown>,
  void,
  { rejectValue: string }
>('crmData/fetchFinanceSummary', async (_, { rejectWithValue }) => {
  try {
    const response = await authFetch('/api/finance/summary');
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to fetch finance summary'));
    const data = await response.json();
    return data.data || data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch finance summary'));
  }
});

/** Create a new commission via /api/finance/commissions */
export const createCommissionAPI = createAsyncThunk<
  CRMItem,
  {
    agentId?: string;
    agent_name?: string;
    amount: number;
    percentage?: number;
    type?: string;
    status?: string;
    notes?: string;
    property_title?: string;
    leadId?: string;
    propertyId?: string;
    created_at?: string;
  },
  { rejectValue: string }
>('crmData/createCommission', async (commissionData, { rejectWithValue }) => {
  try {
    const response = await authFetch('/api/finance/commissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commissionData),
    });
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to create commission'));
    const data = await response.json();
    return data.data || data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to create commission'));
  }
});

/** Update a commission via /api/finance/commissions/:id */
export const updateCommissionAPI = createAsyncThunk<
  CRMItem,
  { id: string; status?: string; amount?: number; notes?: string },
  { rejectValue: string }
>('crmData/updateCommissionAPI', async ({ id, ...updates }, { rejectWithValue }) => {
  try {
    const response = await authFetch(`/api/finance/commissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to update commission'));
    const data = await response.json();
    return data.data || data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update commission'));
  }
});

/** Bulk-pay approved commissions via /api/finance/payments */
export const bulkPayCommissionsAPI = createAsyncThunk<
  { commissionIds: string[]; paidCount: number },
  string[],
  { rejectValue: string }
>('crmData/bulkPayCommissions', async (commissionIds, { rejectWithValue }) => {
  try {
    const response = await authFetch('/api/finance/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commissionIds }),
    });
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to process payments'));
    const data = await response.json();
    return { commissionIds, paidCount: data.data?.paidCount || 0 };
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to process commission payments'));
  }
});

// ============================================================================
// INVOICE ASYNC THUNKS — Finance API Integration
// ============================================================================

/** Fetch invoices from /api/finance/invoices */

export const fetchVATSummaryAPI = createAsyncThunk<
  {
    period: string;
    residential: Record<string, number>;
    commercial: Record<string, number>;
    unclassified: Record<string, number>;
    totals: Record<string, number>;
  },
  { from?: string; to?: string } | void,
  { rejectValue: string }
>('crmData/fetchVATSummary', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params && 'from' in params && params.from) query.set('from', params.from);
    if (params && 'to' in params && params.to) query.set('to', params.to);
    const qs = query.toString() ? `?${query}` : '';
    const res = await authFetch(`/api/compliance/vat-summary${qs}`);
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch VAT summary');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch VAT summary'));
  }
});

/** Fetch compliance overview — GET /api/compliance/overview */
