/**
 * Clients & Communications Thunks
 * Single Purpose: Client profiles, client-property linkages, and client communication records.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch, extractApiError } from '../../../utils/authFetch';
import { getErrorMessage } from '../../../constants';
import { DEV_CLIENTS } from '../../../data/devData';
import type { CRMItem } from './crmTypes';

export const fetchClientsFromAPI = createAsyncThunk<
  CRMItem[],
  {
    status?: string;
    category?: string;
    type?: string;
    search?: string;
    assignedTo?: string;
    page?: number;
    pageSize?: number;
  },
  { rejectValue: string }
>('crmData/fetchClients', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.category) query.set('category', params.category);
    if (params.type) query.set('type', params.type);
    if (params.search) query.set('search', params.search);
    if (params.assignedTo) query.set('assignedTo', params.assignedTo);
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    const url = `/api/clients${query.toString() ? `?${query}` : ''}`;
    const response = await authFetch(url);
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to fetch clients'));
    const json = await response.json();
    return json.data || [];
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch clients'));
  }
});

/** Create a new client via POST /api/clients */
export const createClientAPI = createAsyncThunk<
  CRMItem,
  Record<string, unknown>,
  { rejectValue: string }
>('crmData/createClient', async (data, { rejectWithValue }) => {
  try {
    const response = await authFetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to create client'));
    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to create client'));
  }
});

/** Update a client via PATCH /api/clients/:id */
export const updateClientAPI = createAsyncThunk<
  CRMItem,
  { id: string; [key: string]: unknown },
  { rejectValue: string }
>('crmData/updateClient', async ({ id, ...updates }, { rejectWithValue }) => {
  try {
    const response = await authFetch(`/api/clients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to update client'));
    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update client'));
  }
});

/** Delete a client via DELETE /api/clients/:id */
export const deleteClientAPI = createAsyncThunk<string, string, { rejectValue: string }>(
  'crmData/deleteClient',
  async (id, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/clients/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to delete client'));
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete client'));
    }
  }
);

/** Link a property to a client via POST /api/clients/:id/properties */
export const linkClientPropertyAPI = createAsyncThunk<
  CRMItem,
  { clientId: string; propertyId: string; relationship?: string; notes?: string },
  { rejectValue: string }
>('crmData/linkClientProperty', async ({ clientId, ...data }, { rejectWithValue }) => {
  try {
    const response = await authFetch(`/api/clients/${clientId}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to link property'));
    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to link property'));
  }
});

/** Unlink a property from a client via DELETE /api/clients/:id/properties/:propertyId */
export const unlinkClientPropertyAPI = createAsyncThunk<
  { clientId: string; propertyId: string },
  { clientId: string; propertyId: string },
  { rejectValue: string }
>('crmData/unlinkClientProperty', async ({ clientId, propertyId }, { rejectWithValue }) => {
  try {
    const response = await authFetch(`/api/clients/${clientId}/properties/${propertyId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to unlink property'));
    return { clientId, propertyId };
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to unlink property'));
  }
});

/** Fetch communication logs for a client via GET /api/clients/:id/communications */
export const fetchClientCommunicationsAPI = createAsyncThunk<
  CRMItem[],
  { clientId: string; type?: string; page?: number; pageSize?: number },
  { rejectValue: string }
>('crmData/fetchClientCommunications', async ({ clientId, ...params }, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params.type) query.set('type', params.type);
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    const url = `/api/clients/${clientId}/communications${query.toString() ? `?${query}` : ''}`;
    const response = await authFetch(url);
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to fetch communications'));
    const json = await response.json();
    return json.data || [];
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch communications'));
  }
});

/** Log a communication for a client via POST /api/clients/:id/communications */
export const createClientCommunicationAPI = createAsyncThunk<
  CRMItem,
  {
    clientId: string;
    type?: string;
    direction?: string;
    subject?: string;
    body?: string;
    duration?: number;
    outcome?: string;
  },
  { rejectValue: string }
>('crmData/createClientCommunication', async ({ clientId, ...data }, { rejectWithValue }) => {
  try {
    const response = await authFetch(`/api/clients/${clientId}/communications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to log communication'));
    const json = await response.json();
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to log communication'));
  }
});

/** Convert a lead into a client via POST /api/clients/convert-lead/:leadId */
