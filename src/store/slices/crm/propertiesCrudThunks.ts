/**
 * Properties CRUD Thunks
 * Single Purpose: Inventory property entity fetching, creation, updating, deletion, and aging telemetry.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch, extractApiError } from '../../../utils/authFetch';
import { getErrorMessage } from '../../../constants';
import { DEV_PROPERTIES } from '../../../data/devData';
import type { CRMItem } from './crmTypes';

export const fetchPropertiesFromAPI = createAsyncThunk<
  CRMItem[],
  {
    page?: number;
    pageSize?: number;
    status?: string;
    type?: string;
    search?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    baths?: number;
    area?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  },
  { rejectValue: string }
>('crmData/fetchProperties', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    if (params.status) query.set('status', params.status);
    if (params.type) query.set('type', params.type);
    if (params.search) query.set('search', params.search);
    if (params.location) query.set('location', params.location);
    if (typeof params.minPrice === 'number') query.set('minPrice', String(params.minPrice));
    if (typeof params.maxPrice === 'number') query.set('maxPrice', String(params.maxPrice));
    if (typeof params.beds === 'number') query.set('beds', String(params.beds));
    if (typeof params.baths === 'number') query.set('baths', String(params.baths));
    if (params.area) query.set('area', params.area);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);
    const response = await authFetch(`/api/properties?${query.toString()}`);
    if (!response.ok)
      throw new Error(await extractApiError(response, 'Failed to fetch properties'));
    const data = await response.json();
    return data.data || data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch properties'));
  }
});

/** Fetch all agents from the backend API */

export const createPropertyAPI = createAsyncThunk<
  CRMItem,
  Record<string, unknown>,
  { rejectValue: string }
>('crmData/createProperty', async (propertyData, { rejectWithValue }) => {
  try {
    const response = await authFetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyData),
    });
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to create property'));
    const data = await response.json();
    return data.data || data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to create property'));
  }
});

/** Update a property via API */
export const updatePropertyAPI = createAsyncThunk<
  CRMItem,
  { id: string | number } & Record<string, unknown>,
  { rejectValue: string }
>('crmData/updateProperty', async ({ id, ...updates }, { rejectWithValue }) => {
  try {
    const response = await authFetch(`/api/properties/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to update property'));
    const data = await response.json();
    return data.data || data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update property'));
  }
});

/** Delete a property via API */
export const deletePropertyAPI = createAsyncThunk<
  string | number,
  string | number,
  { rejectValue: string }
>('crmData/deleteProperty', async (id, { rejectWithValue }) => {
  try {
    const response = await authFetch(`/api/properties/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(await extractApiError(response, 'Failed to delete property'));
    return id;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to delete property'));
  }
});

// ============================================================================
// COMMISSION ASYNC THUNKS — Finance API Integration
// ============================================================================

/** Fetch commissions from /api/finance/commissions with optional filtering */

export const fetchPropertyAgingAPI = createAsyncThunk<
  Record<string, unknown>,
  void,
  { rejectValue: string }
>('crmData/fetchPropertyAging', async (_, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/dashboard/property-aging');
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch property aging');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch property aging'));
  }
});

/** Fetch agent performance comparison — GET /api/dashboard/agent-performance */
