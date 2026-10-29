/**
 * Calendar Scheduling & Ejari Compliance Thunks
 * Single Purpose: Viewing slot bookings, agent calendar sync, ICS downloads, and Ejari contract exports.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch, extractApiError } from '../../../utils/authFetch';
import { getErrorMessage } from '../../../constants';
import type { CRMItem } from './crmTypes';

export const fetchAvailableSlotsAPI = createAsyncThunk<
  {
    agentId: string;
    agentName: string;
    date: string;
    totalSlots: number;
    availableSlots: number;
    slots: Array<{ start: string; end: string; available: boolean; reason?: string }>;
  },
  { agentId: string; date: string; duration?: number },
  { rejectValue: string }
>('crmData/fetchAvailableSlots', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams({ agentId: params.agentId, date: params.date });
    if (params.duration) query.set('duration', String(params.duration));
    const res = await authFetch(`/api/viewings/slots?${query}`);
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch slots');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch available slots'));
  }
});

/** Fetch agent availability schedule — GET /api/agent-availability/:agentId */
export const fetchAgentAvailabilityAPI = createAsyncThunk<
  {
    agentId: string;
    agentName: string;
    schedule: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      isActive: boolean;
      slotDuration: number;
      breakStart?: string;
      breakEnd?: string;
    }>;
  },
  string,
  { rejectValue: string }
>('crmData/fetchAgentAvailability', async (agentId, { rejectWithValue }) => {
  try {
    const res = await authFetch(`/api/agent-availability/${agentId}`);
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch agent availability');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch agent availability'));
  }
});

/** Set agent availability for a specific day — PUT /api/agent-availability */
export const setAgentAvailabilityAPI = createAsyncThunk<
  { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean },
  {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive?: boolean;
    slotDuration?: number;
    breakStart?: string;
    breakEnd?: string;
  },
  { rejectValue: string }
>('crmData/setAgentAvailability', async (data, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/agent-availability', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to update availability');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update agent availability'));
  }
});

/** Download .ics calendar file for a viewing — GET /api/viewings/:id/ics */
export const downloadViewingICSAPI = createAsyncThunk<
  string,
  { viewingId: string; token?: string },
  { rejectValue: string }
>('crmData/downloadViewingICS', async ({ viewingId, token }, { rejectWithValue }) => {
  try {
    const query = token ? `?token=${token}` : '';
    const res = await authFetch(`/api/viewings/${viewingId}/ics${query}`);
    if (!res.ok) {
      const json = await res.json();
      return rejectWithValue(json.error || 'Failed to download calendar file');
    }
    const text = await res.text();
    // Trigger browser download
    const blob = new Blob([text], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viewing-${viewingId}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    return text;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to download calendar file'));
  }
});

// ============================================================================
// COMPLIANCE THUNKS (Phase 3D - RERA/Ejari/VAT)
// ============================================================================

/** Fetch BRN expiry report — GET /api/compliance/brn-expiry */
export const fetchBRNExpiryAPI = createAsyncThunk<
  {
    agents: Array<{
      id: string;
      name: string | null;
      email: string;
      brnNumber: string | null;
      brnExpiry: string | null;
      daysUntilExpiry: number | null;
      status: string;
    }>;
    summary: Record<string, number>;
  },
  void,
  { rejectValue: string }
>('crmData/fetchBRNExpiry', async (_, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/compliance/brn-expiry');
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch BRN report');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch BRN expiry report'));
  }
});

/** Fetch VAT summary — GET /api/compliance/vat-summary */

export const fetchComplianceOverviewAPI = createAsyncThunk<
  {
    brnCompliance: Record<string, number>;
    ejariCompliance: Record<string, number>;
    documentCompliance: Record<string, number>;
    overallScore: number;
  },
  void,
  { rejectValue: string }
>('crmData/fetchComplianceOverview', async (_, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/compliance/overview');
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch compliance overview');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch compliance overview'));
  }
});

/** Download Ejari CSV export — GET /api/compliance/ejari-export */
export const downloadEjariExportAPI = createAsyncThunk<
  string,
  { status?: string; from?: string; to?: string } | void,
  { rejectValue: string }
>('crmData/downloadEjariExport', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params && 'status' in params && params.status) query.set('status', params.status);
    if (params && 'from' in params && params.from) query.set('from', params.from);
    if (params && 'to' in params && params.to) query.set('to', params.to);
    const qs = query.toString() ? `?${query}` : '';
    const res = await authFetch(`/api/compliance/ejari-export${qs}`);
    if (!res.ok) {
      const json = await res.json();
      return rejectWithValue(json.error || 'Failed to download Ejari export');
    }
    const csv = await res.text();
    // Trigger browser download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ejari-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    return csv;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to download Ejari export'));
  }
});

/** Update Ejari status — PATCH /api/compliance/ejari/:leaseId */
export const updateEjariStatusAPI = createAsyncThunk<
  Record<string, unknown>,
  {
    leaseId: string;
    ejariNumber?: string;
    ejariStatus?: string;
    ejariRegistrationDate?: string;
    ejariExpiryDate?: string;
  },
  { rejectValue: string }
>('crmData/updateEjariStatus', async ({ leaseId, ...data }, { rejectWithValue }) => {
  try {
    const res = await authFetch(`/api/compliance/ejari/${leaseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to update Ejari status');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to update Ejari status'));
  }
});

// ============================================================================
// ACTIVITY THUNKS
// ============================================================================

/** Fetch activities from API — GET /api/activities */
