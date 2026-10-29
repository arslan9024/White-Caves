/**
 * Leads CRUD Thunks
 * Single Purpose: Basic Lead entity fetching, creation, updating, deletion, and client conversion.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch, extractApiError } from '../../../utils/authFetch';
import { getErrorMessage } from '../../../constants';
import { DEV_LEADS } from '../../../data/devData';
import type { CRMItem } from './crmTypes';

export const fetchLeadsFromAPI = createAsyncThunk<
  CRMItem[],
  { page?: number; pageSize?: number; status?: string; source?: string },
  { rejectValue: string }
>('crmData/fetchLeads', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    if (params.status) query.set('status', params.status);
    if (params.source) query.set('source', params.source);
    const response = await authFetch(`/api/leads?${query.toString()}`);
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to fetch leads'));
    const data = await response.json();
    return data.data || data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch leads'));
  }
});

/** Fetch all properties from the backend API */

export const createLeadAPI = createAsyncThunk<
  CRMItem,
  Record<string, unknown>,
  { rejectValue: string }
>('crmData/createLead', async (leadData, { rejectWithValue }) => {
  try {
    const response = await authFetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to create lead'));
    const data = await response.json();
    return data.data || data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to create lead'));
  }
});

/** Update a lead via API */
export const updateLeadAPI = createAsyncThunk<
  CRMItem,
  { id: string | number } & Record<string, unknown>,
  { rejectValue: string }
>('crmData/updateLeadAPI', async ({ id, ...updates }, { rejectWithValue }) => {
  try {
    const response = await authFetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to update lead'));
    const data = await response.json();
    return data.data || data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update lead'));
  }
});

/** Delete a lead via API */
export const deleteLeadAPI = createAsyncThunk<
  string | number,
  string | number,
  { rejectValue: string }
>('crmData/deleteLeadAPI', async (id, { rejectWithValue }) => {
  try {
    const response = await authFetch(`/api/leads/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to delete lead'));
    return id;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to delete lead'));
  }
});

/** Create a new property via API */

export const convertLeadToClientAPI = createAsyncThunk<
  CRMItem,
  { leadId: string; category?: string; type?: string },
  { rejectValue: string }
>('crmData/convertLeadToClient', async ({ leadId, ...data }, { rejectWithValue }) => {
  try {
    const response = await authFetch(`/api/clients/convert-lead/${leadId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to convert lead'));
    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to convert lead'));
  }
});

// ============================================================================
// LEAD SCORING THUNKS
// ============================================================================

/** Score/re-score a single lead — GET /api/leads/:id/score */
