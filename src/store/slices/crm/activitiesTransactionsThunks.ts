/**
 * Activities & Transactions Thunks
 * Single Purpose: Deals/transactions pipeline and enterprise activity timeline tracking.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch, extractApiError } from '../../../utils/authFetch';
import { getErrorMessage } from '../../../constants';
import { DEV_ACTIVITIES } from '../../../data/devData';
import type { CRMItem } from './crmTypes';

export const fetchActivitiesFromAPI = createAsyncThunk<
  { data: CRMItem[]; pagination?: Record<string, unknown> },
  {
    type?: string;
    action?: string;
    userId?: string;
    leadId?: string;
    page?: number;
    pageSize?: number;
  },
  { rejectValue: string }
>('crmData/fetchActivities', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params.type) query.set('type', params.type);
    if (params.action) query.set('action', params.action);
    if (params.userId) query.set('userId', params.userId);
    if (params.leadId) query.set('leadId', params.leadId);
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    const url = `/api/activities${query.toString() ? `?${query}` : ''}`;
    const response = await authFetch(url);
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to fetch activities'));
    const json = await response.json();
    return { data: json.data, pagination: json.pagination };
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch activities'));
  }
});

/** Create an activity — POST /api/activities */
export const createActivityAPI = createAsyncThunk<
  CRMItem,
  {
    type: string;
    action: string;
    description: string;
    metadata?: Record<string, unknown>;
    leadId?: string;
  },
  { rejectValue: string }
>('crmData/createActivity', async (data, { rejectWithValue }) => {
  try {
    const response = await authFetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to create activity'));
    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to create activity'));
  }
});

/** Update an activity — PATCH /api/activities/:id */
export const updateActivityAPI = createAsyncThunk<
  CRMItem,
  { id: string; description?: string; metadata?: Record<string, unknown> },
  { rejectValue: string }
>('crmData/updateActivity', async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const response = await authFetch(`/api/activities/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to update activity'));
    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update activity'));
  }
});

/** Delete an activity — DELETE /api/activities/:id */
export const deleteActivityAPI = createAsyncThunk<string, string, { rejectValue: string }>(
  'crmData/deleteActivity',
  async (id, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/activities/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok)
        throw new Error(await extractApiError(response, 'Failed to delete activity'));
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete activity'));
    }
  }
);

// ============================================================================
// TRANSACTION THUNKS
// ============================================================================

/** Fetch transactions from API — GET /api/transactions */
export const fetchTransactionsFromAPI = createAsyncThunk<
  { data: CRMItem[]; pagination?: Record<string, unknown> },
  { status?: string; type?: string; page?: number; pageSize?: number },
  { rejectValue: string }
>('crmData/fetchTransactions', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.type) query.set('type', params.type);
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    const url = `/api/transactions${query.toString() ? `?${query}` : ''}`;
    const response = await authFetch(url);
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to fetch transactions'));
    const json = await response.json();
    return { data: json.data, pagination: json.pagination };
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch transactions'));
  }
});

/** Create a transaction — POST /api/transactions */
export const createTransactionAPI = createAsyncThunk<
  CRMItem,
  {
    type: string;
    amount: number;
    propertyId?: string;
    leadId?: string;
    agentId?: string;
    closingDate?: string;
    notes?: string;
  },
  { rejectValue: string }
>('crmData/createTransaction', async (data, { rejectWithValue }) => {
  try {
    const response = await authFetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to create transaction'));
    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to create transaction'));
  }
});

/** Update a transaction — PATCH /api/transactions/:id */
export const updateTransactionAPI = createAsyncThunk<
  CRMItem,
  {
    id: string;
    status?: string;
    amount?: number;
    type?: string;
    closingDate?: string;
    notes?: string;
    commission?: number;
    rera_status?: string;
    documents?: string[];
  },
  { rejectValue: string }
>('crmData/updateTransaction', async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const response = await authFetch(`/api/transactions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to update transaction'));
    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update transaction'));
  }
});

/** Delete a transaction — DELETE /api/transactions/:id */
export const deleteTransactionAPI = createAsyncThunk<string, string, { rejectValue: string }>(
  'crmData/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok)
        throw new Error(await extractApiError(response, 'Failed to delete transaction'));
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete transaction'));
    }
  }
);

/** Fetch transaction stats — GET /api/transactions/stats */
export const fetchTransactionStatsAPI = createAsyncThunk<
  Record<string, unknown>,
  void,
  { rejectValue: string }
>('crmData/fetchTransactionStats', async (_, { rejectWithValue }) => {
  try {
    const response = await authFetch('/api/transactions/stats');
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to fetch transaction stats'));
    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch transaction stats'));
  }
});

