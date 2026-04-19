/**
 * CRM Data Redux Slice
 * Manages: leads, clients, agents, commissions, activities
 * Now with async thunks for backend API integration
 */

import { createSlice, createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { authFetch, extractApiError } from '../utils/authFetch';
import { getErrorMessage } from '../constants';
import { logout } from './authSlice';
import type { RootState } from './store';
// In production, async thunks fetch real data from the API.
// Dev mode: faker-generated data (50+ properties, 20+ agents, 100+ leads)
// with fallback to legacy DUMMY_* data for safety.
import {
  DEV_LEADS,
  DEV_CLIENTS,
  DEV_AGENTS,
  DEV_PROPERTIES,
  DEV_COMMISSIONS,
  DEV_ACTIVITIES,
  DEV_OVERVIEW,
} from '../data/devData';

interface CRMItem {
  id: string | number;
  [key: string]: unknown;
}

interface CRMCollection<T extends CRMItem> {
  items: T[];
  selected: T | null;
  loading: boolean;
  error: string | null;
}

interface CommissionCollection {
  items: CRMItem[];
  loading: boolean;
  error?: string | null;
}

interface ActivityCollection {
  items: CRMItem[];
  loading: boolean;
  error?: string | null;
}

interface InvoiceCollection {
  items: CRMItem[];
  loading: boolean;
  error?: string | null;
}

interface ExpenseCollection {
  items: CRMItem[];
  loading: boolean;
  error?: string | null;
}

interface CRMDataState {
  leads: CRMCollection<CRMItem>;
  clients: CRMCollection<CRMItem>;
  agents: CRMCollection<CRMItem>;
  properties: CRMCollection<CRMItem>;
  commissions: CommissionCollection;
  invoices: InvoiceCollection;
  expenses: ExpenseCollection;
  activities: ActivityCollection;
  overview: Record<string, unknown> | null;
  lastUpdated: string;
}

const initialState: CRMDataState = {
  leads: {
    items: import.meta.env.DEV ? DEV_LEADS : [],
    selected: null,
    loading: false,
    error: null
  },

  clients: {
    items: import.meta.env.DEV ? DEV_CLIENTS : [],
    selected: null,
    loading: false,
    error: null
  },

  agents: {
    items: import.meta.env.DEV ? DEV_AGENTS : [],
    selected: null,
    loading: false,
    error: null
  },

  properties: {
    items: import.meta.env.DEV ? DEV_PROPERTIES : [],
    selected: null,
    loading: false,
    error: null
  },

  commissions: {
    items: import.meta.env.DEV ? DEV_COMMISSIONS : [],
    loading: false,
    error: null
  },

  invoices: {
    items: [],
    loading: false,
    error: null
  },

  expenses: {
    items: [],
    loading: false,
    error: null
  },

  activities: {
    items: import.meta.env.DEV ? DEV_ACTIVITIES : [],
    loading: false,
    error: null
  },

  overview: import.meta.env.DEV ? DEV_OVERVIEW : null,

  lastUpdated: new Date().toISOString()
};

// ============================================================================
// ASYNC THUNKS â€” Backend API Integration
// ============================================================================

/** Fetch all leads from the backend API, falls back to dummy data on error */
export const fetchLeadsFromAPI = createAsyncThunk<
  CRMItem[],
  { page?: number; pageSize?: number; status?: string; source?: string },
  { rejectValue: string }
>(
  'crmData/fetchLeads',
  async (params = {}, { rejectWithValue }) => {
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
  }
);

/** Fetch all properties from the backend API */
export const fetchPropertiesFromAPI = createAsyncThunk<
  CRMItem[],
  { page?: number; status?: string; type?: string },
  { rejectValue: string }
>(
  'crmData/fetchProperties',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.set('page', String(params.page));
      if (params.status) query.set('status', params.status);
      if (params.type) query.set('type', params.type);
      const response = await authFetch(`/api/properties?${query.toString()}`);
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to fetch properties'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch properties'));
    }
  }
);

/** Fetch all agents from the backend API */
export const fetchAgentsFromAPI = createAsyncThunk<
  CRMItem[],
  void,
  { rejectValue: string }
>(
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
>(
  'crmData/fetchDashboardOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/dashboard/summary');
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to fetch dashboard'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch dashboard overview'));
    }
  }
);

/** Create a new lead via API */
export const createLeadAPI = createAsyncThunk<
  CRMItem,
  Record<string, unknown>,
  { rejectValue: string }
>(
  'crmData/createLead',
  async (leadData, { rejectWithValue }) => {
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
  }
);

/** Update a lead via API */
export const updateLeadAPI = createAsyncThunk<
  CRMItem,
  { id: string | number } & Record<string, unknown>,
  { rejectValue: string }
>(
  'crmData/updateLeadAPI',
  async ({ id, ...updates }, { rejectWithValue }) => {
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
  }
);

/** Delete a lead via API */
export const deleteLeadAPI = createAsyncThunk<
  string | number,
  string | number,
  { rejectValue: string }
>(
  'crmData/deleteLeadAPI',
  async (id, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to delete lead'));
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete lead'));
    }
  }
);

/** Create a new property via API */
export const createPropertyAPI = createAsyncThunk<
  CRMItem,
  Record<string, unknown>,
  { rejectValue: string }
>(
  'crmData/createProperty',
  async (propertyData, { rejectWithValue }) => {
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
  }
);

/** Update a property via API */
export const updatePropertyAPI = createAsyncThunk<
  CRMItem,
  { id: string | number } & Record<string, unknown>,
  { rejectValue: string }
>(
  'crmData/updateProperty',
  async ({ id, ...updates }, { rejectWithValue }) => {
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
  }
);

/** Delete a property via API */
export const deletePropertyAPI = createAsyncThunk<
  string | number,
  string | number,
  { rejectValue: string }
>(
  'crmData/deleteProperty',
  async (id, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to delete property'));
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete property'));
    }
  }
);

// ============================================================================
// COMMISSION ASYNC THUNKS — Finance API Integration
// ============================================================================

/** Fetch commissions from /api/finance/commissions with optional filtering */
export const fetchCommissionsFromAPI = createAsyncThunk<
  CRMItem[],
  { page?: number; pageSize?: number; status?: string; type?: string; agentId?: string },
  { rejectValue: string }
>(
  'crmData/fetchCommissions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.set('page', String(params.page));
      if (params.pageSize) query.set('pageSize', String(params.pageSize));
      if (params.status) query.set('status', params.status);
      if (params.type) query.set('type', params.type);
      if (params.agentId) query.set('agentId', params.agentId);
      const response = await authFetch(`/api/finance/commissions?${query.toString()}`);
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to fetch commissions'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch commissions'));
    }
  }
);

/** Fetch financial summary from /api/finance/summary */
export const fetchFinanceSummary = createAsyncThunk<
  Record<string, unknown>,
  void,
  { rejectValue: string }
>(
  'crmData/fetchFinanceSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/finance/summary');
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to fetch finance summary'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch finance summary'));
    }
  }
);

/** Create a new commission via /api/finance/commissions */
export const createCommissionAPI = createAsyncThunk<
  CRMItem,
  { agentId: string; amount: number; percentage?: number; type?: string; notes?: string; leadId?: string; propertyId?: string },
  { rejectValue: string }
>(
  'crmData/createCommission',
  async (commissionData, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/finance/commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commissionData),
      });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to create commission'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to create commission'));
    }
  }
);

/** Update a commission via /api/finance/commissions/:id */
export const updateCommissionAPI = createAsyncThunk<
  CRMItem,
  { id: string; status?: string; amount?: number; notes?: string },
  { rejectValue: string }
>(
  'crmData/updateCommissionAPI',
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/finance/commissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to update commission'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update commission'));
    }
  }
);

/** Bulk-pay approved commissions via /api/finance/payments */
export const bulkPayCommissionsAPI = createAsyncThunk<
  { commissionIds: string[]; paidCount: number },
  string[],
  { rejectValue: string }
>(
  'crmData/bulkPayCommissions',
  async (commissionIds, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/finance/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commissionIds }),
      });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to process payments'));
      const data = await response.json();
      return { commissionIds, paidCount: data.data?.paidCount || 0 };
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to process commission payments'));
    }
  }
);

// ============================================================================
// INVOICE ASYNC THUNKS — Finance API Integration
// ============================================================================

/** Fetch invoices from /api/finance/invoices */
export const fetchInvoicesFromAPI = createAsyncThunk<
  CRMItem[],
  { page?: number; pageSize?: number; status?: string; client?: string },
  { rejectValue: string }
>(
  'crmData/fetchInvoices',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.set('page', String(params.page));
      if (params.pageSize) query.set('pageSize', String(params.pageSize));
      if (params.status) query.set('status', params.status);
      if (params.client) query.set('client', params.client);
      const response = await authFetch(`/api/finance/invoices?${query.toString()}`);
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to fetch invoices'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch invoices'));
    }
  }
);

/** Create a new invoice via /api/finance/invoices */
export const createInvoiceAPI = createAsyncThunk<
  CRMItem,
  { client: string; amount: number; dueDate: string; property?: string; notes?: string; vatAmount?: number; lineItems?: unknown[] },
  { rejectValue: string }
>(
  'crmData/createInvoice',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/finance/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to create invoice'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to create invoice'));
    }
  }
);

/** Update an invoice via /api/finance/invoices/:id */
export const updateInvoiceAPI = createAsyncThunk<
  CRMItem,
  { id: string; status?: string; amount?: number; notes?: string; client?: string; dueDate?: string },
  { rejectValue: string }
>(
  'crmData/updateInvoice',
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/finance/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to update invoice'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update invoice'));
    }
  }
);

/** Delete an invoice via /api/finance/invoices/:id */
export const deleteInvoiceAPI = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'crmData/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/finance/invoices/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to delete invoice'));
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete invoice'));
    }
  }
);

// ============================================================================
// EXPENSE ASYNC THUNKS — Finance API Integration
// ============================================================================

/** Fetch expenses from /api/finance/expenses */
export const fetchExpensesFromAPI = createAsyncThunk<
  CRMItem[],
  { page?: number; pageSize?: number; status?: string; category?: string },
  { rejectValue: string }
>(
  'crmData/fetchExpenses',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params.page) query.set('page', String(params.page));
      if (params.pageSize) query.set('pageSize', String(params.pageSize));
      if (params.status) query.set('status', params.status);
      if (params.category) query.set('category', params.category);
      const response = await authFetch(`/api/finance/expenses?${query.toString()}`);
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to fetch expenses'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch expenses'));
    }
  }
);

/** Create a new expense via /api/finance/expenses */
export const createExpenseAPI = createAsyncThunk<
  CRMItem,
  { category: string; description: string; amount: number; date?: string; notes?: string; receiptUrl?: string },
  { rejectValue: string }
>(
  'crmData/createExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/finance/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to create expense'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to create expense'));
    }
  }
);

/** Update an expense via /api/finance/expenses/:id */
export const updateExpenseAPI = createAsyncThunk<
  CRMItem,
  { id: string; status?: string; amount?: number; category?: string; description?: string; notes?: string },
  { rejectValue: string }
>(
  'crmData/updateExpense',
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/finance/expenses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to update expense'));
      const data = await response.json();
      return data.data || data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to update expense'));
    }
  }
);

/** Delete an expense via /api/finance/expenses/:id */
export const deleteExpenseAPI = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'crmData/deleteExpense',
  async (id, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/finance/expenses/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to delete expense'));
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to delete expense'));
    }
  }
);

// ════════════════════════════════════════════════════════════════════════
// CLIENT ASYNC THUNKS (Phase 1C)
// ════════════════════════════════════════════════════════════════════════

/** Fetch clients with filters via /api/clients */
export const fetchClientsFromAPI = createAsyncThunk<
  CRMItem[],
  { status?: string; category?: string; type?: string; search?: string; assignedTo?: string; page?: number; pageSize?: number },
  { rejectValue: string }
>(
  'crmData/fetchClients',
  async (params, { rejectWithValue }) => {
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
  }
);

/** Create a new client via POST /api/clients */
export const createClientAPI = createAsyncThunk<
  CRMItem,
  Record<string, unknown>,
  { rejectValue: string }
>(
  'crmData/createClient',
  async (data, { rejectWithValue }) => {
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
  }
);

/** Update a client via PATCH /api/clients/:id */
export const updateClientAPI = createAsyncThunk<
  CRMItem,
  { id: string; [key: string]: unknown },
  { rejectValue: string }
>(
  'crmData/updateClient',
  async ({ id, ...updates }, { rejectWithValue }) => {
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
  }
);

/** Delete a client via DELETE /api/clients/:id */
export const deleteClientAPI = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
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
>(
  'crmData/linkClientProperty',
  async ({ clientId, ...data }, { rejectWithValue }) => {
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
  }
);

/** Unlink a property from a client via DELETE /api/clients/:id/properties/:propertyId */
export const unlinkClientPropertyAPI = createAsyncThunk<
  { clientId: string; propertyId: string },
  { clientId: string; propertyId: string },
  { rejectValue: string }
>(
  'crmData/unlinkClientProperty',
  async ({ clientId, propertyId }, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/clients/${clientId}/properties/${propertyId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to unlink property'));
      return { clientId, propertyId };
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to unlink property'));
    }
  }
);

/** Fetch communication logs for a client via GET /api/clients/:id/communications */
export const fetchClientCommunicationsAPI = createAsyncThunk<
  CRMItem[],
  { clientId: string; type?: string; page?: number; pageSize?: number },
  { rejectValue: string }
>(
  'crmData/fetchClientCommunications',
  async ({ clientId, ...params }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      if (params.type) query.set('type', params.type);
      if (params.page) query.set('page', String(params.page));
      if (params.pageSize) query.set('pageSize', String(params.pageSize));
      const url = `/api/clients/${clientId}/communications${query.toString() ? `?${query}` : ''}`;
      const response = await authFetch(url);
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to fetch communications'));
      const json = await response.json();
      return json.data || [];
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch communications'));
    }
  }
);

/** Log a communication for a client via POST /api/clients/:id/communications */
export const createClientCommunicationAPI = createAsyncThunk<
  CRMItem,
  { clientId: string; type?: string; direction?: string; subject?: string; body?: string; duration?: number; outcome?: string },
  { rejectValue: string }
>(
  'crmData/createClientCommunication',
  async ({ clientId, ...data }, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/clients/${clientId}/communications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(await extractApiError(response, 'Failed to log communication'));
      const json = await response.json();
      return json.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to log communication'));
    }
  }
);

/** Convert a lead into a client via POST /api/clients/convert-lead/:leadId */
export const convertLeadToClientAPI = createAsyncThunk<
  CRMItem,
  { leadId: string; category?: string; type?: string },
  { rejectValue: string }
>(
  'crmData/convertLeadToClient',
  async ({ leadId, ...data }, { rejectWithValue }) => {
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
  }
);

const crmDataSlice = createSlice({
  name: 'crmData',
  initialState,

  reducers: {
    // ============== LEADS ==============
    setLeads: (state, action: PayloadAction<CRMItem[]>) => {
      state.leads.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    addLead: (state, action: PayloadAction<CRMItem>) => {
      state.leads.items.push({
        ...action.payload,
        id: action.payload.id || `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
      });
      state.lastUpdated = new Date().toISOString();
    },

    updateLead: (state, action: PayloadAction<CRMItem>) => {
      const leadIndex = state.leads.items.findIndex(
        l => l.id === action.payload.id
      );
      if (leadIndex > -1) {
        state.leads.items[leadIndex] = {
          ...state.leads.items[leadIndex],
          ...action.payload
        };
      }
      state.lastUpdated = new Date().toISOString();
    },

    deleteLead: (state, action: PayloadAction<string | number>) => {
      state.leads.items = state.leads.items.filter(
        l => l.id !== action.payload
      );
      if (state.leads.selected?.id === action.payload) {
        state.leads.selected = null;
      }
      state.lastUpdated = new Date().toISOString();
    },

    selectLead: (state, action: PayloadAction<CRMItem>) => {
      state.leads.selected = action.payload;
    },

    setLeadsLoading: (state, action: PayloadAction<boolean>) => {
      state.leads.loading = action.payload;
    },

    setLeadsError: (state, action: PayloadAction<string | null>) => {
      state.leads.error = action.payload;
    },

    // ============== CLIENTS ==============
    setClients: (state, action: PayloadAction<CRMItem[]>) => {
      state.clients.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    addClient: (state, action: PayloadAction<CRMItem>) => {
      state.clients.items.push({
        ...action.payload,
        id: action.payload.id || `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
      });
      state.lastUpdated = new Date().toISOString();
    },

    updateClient: (state, action: PayloadAction<CRMItem>) => {
      const clientIndex = state.clients.items.findIndex(
        c => c.id === action.payload.id
      );
      if (clientIndex > -1) {
        state.clients.items[clientIndex] = {
          ...state.clients.items[clientIndex],
          ...action.payload
        };
      }
      state.lastUpdated = new Date().toISOString();
    },

    deleteClient: (state, action: PayloadAction<string | number>) => {
      state.clients.items = state.clients.items.filter(
        c => c.id !== action.payload
      );
      if (state.clients.selected?.id === action.payload) {
        state.clients.selected = null;
      }
      state.lastUpdated = new Date().toISOString();
    },

    selectClient: (state, action: PayloadAction<CRMItem>) => {
      state.clients.selected = action.payload;
    },

    setClientsLoading: (state, action: PayloadAction<boolean>) => {
      state.clients.loading = action.payload;
    },

    setClientsError: (state, action: PayloadAction<string | null>) => {
      state.clients.error = action.payload;
    },

    // ============== AGENTS ==============
    setAgents: (state, action: PayloadAction<CRMItem[]>) => {
      state.agents.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    selectAgent: (state, action: PayloadAction<CRMItem>) => {
      state.agents.selected = action.payload;
    },

    updateAgent: (state, action: PayloadAction<CRMItem>) => {
      const agentIndex = state.agents.items.findIndex(
        a => a.id === action.payload.id
      );
      if (agentIndex > -1) {
        state.agents.items[agentIndex] = {
          ...state.agents.items[agentIndex],
          ...action.payload
        };
      }
      state.lastUpdated = new Date().toISOString();
    },

    setAgentsLoading: (state, action: PayloadAction<boolean>) => {
      state.agents.loading = action.payload;
    },

    setAgentsError: (state, action: PayloadAction<string | null>) => {
      state.agents.error = action.payload;
    },

    // ============== PROPERTIES ==============
    setProperties: (state, action: PayloadAction<CRMItem[]>) => {
      state.properties.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    addProperty: (state, action: PayloadAction<CRMItem>) => {
      state.properties.items.unshift({
        ...action.payload,
        id: action.payload.id || Date.now(),
      });
      state.lastUpdated = new Date().toISOString();
    },

    updateProperty: (state, action: PayloadAction<CRMItem>) => {
      const propIndex = state.properties.items.findIndex(
        p => p.id === action.payload.id
      );
      if (propIndex > -1) {
        state.properties.items[propIndex] = {
          ...state.properties.items[propIndex],
          ...action.payload,
        };
      }
      state.lastUpdated = new Date().toISOString();
    },

    deleteProperty: (state, action: PayloadAction<string | number>) => {
      state.properties.items = state.properties.items.filter(
        p => p.id !== action.payload
      );
      if (state.properties.selected?.id === action.payload) {
        state.properties.selected = null;
      }
      state.lastUpdated = new Date().toISOString();
    },

    selectProperty: (state, action: PayloadAction<CRMItem | null>) => {
      state.properties.selected = action.payload;
    },

    setPropertiesLoading: (state, action: PayloadAction<boolean>) => {
      state.properties.loading = action.payload;
    },

    setPropertiesError: (state, action: PayloadAction<string | null>) => {
      state.properties.error = action.payload;
    },

    // ============== COMMISSIONS ==============
    setCommissions: (state, action: PayloadAction<CRMItem[]>) => {
      state.commissions.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    updateCommission: (state, action: PayloadAction<CRMItem>) => {
      const commIndex = state.commissions.items.findIndex(
        c => c.id === action.payload.id
      );
      if (commIndex > -1) {
        state.commissions.items[commIndex] = {
          ...state.commissions.items[commIndex],
          ...action.payload
        };
      }
      state.lastUpdated = new Date().toISOString();
    },

    setCommissionsLoading: (state, action: PayloadAction<boolean>) => {
      state.commissions.loading = action.payload;
    },

    // ============== INVOICES ==============
    setInvoices: (state, action: PayloadAction<CRMItem[]>) => {
      state.invoices.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    setInvoicesLoading: (state, action: PayloadAction<boolean>) => {
      state.invoices.loading = action.payload;
    },

    // ============== EXPENSES ==============
    setExpenses: (state, action: PayloadAction<CRMItem[]>) => {
      state.expenses.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    setExpensesLoading: (state, action: PayloadAction<boolean>) => {
      state.expenses.loading = action.payload;
    },

    // ============== ACTIVITIES ==============
    setActivities: (state, action: PayloadAction<CRMItem[]>) => {
      state.activities.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },

    addActivity: (state, action: PayloadAction<CRMItem>) => {
      state.activities.items.unshift({
        ...action.payload,
        id: action.payload.id || `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        timestamp: new Date().toISOString()
      });
      state.lastUpdated = new Date().toISOString();
    },

    // ============== OVERVIEW ==============
    setOverviewData: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.overview = action.payload;
      state.lastUpdated = new Date().toISOString();
    }
  },

  // ============== EXTRA REDUCERS â€” Async Thunk Handlers ==============
  extraReducers: (builder) => {
    // --- Fetch Leads ---
    builder
      .addCase(fetchLeadsFromAPI.pending, (state) => {
        state.leads.loading = true;
        state.leads.error = null;
      })
      .addCase(fetchLeadsFromAPI.fulfilled, (state, action) => {
        state.leads.loading = false;
        if (Array.isArray(action.payload)) {
          state.leads.items = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchLeadsFromAPI.rejected, (state, action) => {
        state.leads.loading = false;
        state.leads.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch leads';
      });

    // --- Fetch Properties ---
    builder
      .addCase(fetchPropertiesFromAPI.pending, (state) => {
        state.properties.loading = true;
        state.properties.error = null;
      })
      .addCase(fetchPropertiesFromAPI.fulfilled, (state, action) => {
        state.properties.loading = false;
        if (Array.isArray(action.payload)) {
          state.properties.items = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPropertiesFromAPI.rejected, (state, action) => {
        state.properties.loading = false;
        state.properties.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch properties';
      });

    // --- Fetch Agents ---
    builder
      .addCase(fetchAgentsFromAPI.pending, (state) => {
        state.agents.loading = true;
        state.agents.error = null;
      })
      .addCase(fetchAgentsFromAPI.fulfilled, (state, action) => {
        state.agents.loading = false;
        if (Array.isArray(action.payload)) {
          state.agents.items = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAgentsFromAPI.rejected, (state, action) => {
        state.agents.loading = false;
        state.agents.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch agents';
      });

    // --- Fetch Dashboard Overview ---
    builder
      .addCase(fetchDashboardOverview.pending, (state) => {
        state.overview = { ...state.overview, loading: true, error: null };
      })
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
        if (action.payload) {
          state.overview = { ...state.overview, ...action.payload, loading: false, error: null };
        } else {
          state.overview = { ...state.overview, loading: false };
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardOverview.rejected, (state, action) => {
        state.overview = {
          ...state.overview,
          loading: false,
          error: (typeof action.payload === 'string' ? action.payload : null) || 'Failed to load dashboard overview',
        };
      });

    // --- Create Lead ---
    builder
      .addCase(createLeadAPI.pending, (state) => {
        state.leads.loading = true;
        state.leads.error = null;
      })
      .addCase(createLeadAPI.fulfilled, (state, action) => {
        state.leads.loading = false;
        if (action.payload) {
          state.leads.items.unshift(action.payload);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createLeadAPI.rejected, (state, action) => {
        state.leads.loading = false;
        state.leads.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to create lead';
      });

    // --- Update Lead ---
    builder
      .addCase(updateLeadAPI.pending, (state) => {
        state.leads.loading = true;
        state.leads.error = null;
      })
      .addCase(updateLeadAPI.fulfilled, (state, action) => {
        state.leads.loading = false;
        if (action.payload) {
          const idx = state.leads.items.findIndex(l => l.id === action.payload.id);
          if (idx > -1) {
            state.leads.items[idx] = { ...state.leads.items[idx], ...action.payload };
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateLeadAPI.rejected, (state, action) => {
        state.leads.loading = false;
        state.leads.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to update lead';
      });

    // --- Delete Lead ---
    builder
      .addCase(deleteLeadAPI.pending, (state) => {
        state.leads.loading = true;
        state.leads.error = null;
      })
      .addCase(deleteLeadAPI.fulfilled, (state, action) => {
        state.leads.loading = false;
        state.leads.items = state.leads.items.filter(l => l.id !== action.payload);
        if (state.leads.selected?.id === action.payload) {
          state.leads.selected = null;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteLeadAPI.rejected, (state, action) => {
        state.leads.loading = false;
        state.leads.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to delete lead';
      });

    // --- Create Property ---
    builder
      .addCase(createPropertyAPI.pending, (state) => {
        state.properties.loading = true;
        state.properties.error = null;
      })
      .addCase(createPropertyAPI.fulfilled, (state, action) => {
        state.properties.loading = false;
        if (action.payload) {
          state.properties.items.unshift(action.payload);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createPropertyAPI.rejected, (state, action) => {
        state.properties.loading = false;
        state.properties.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to create property';
      });

    // --- Update Property ---
    builder
      .addCase(updatePropertyAPI.pending, (state) => {
        state.properties.loading = true;
        state.properties.error = null;
      })
      .addCase(updatePropertyAPI.fulfilled, (state, action) => {
        state.properties.loading = false;
        if (action.payload) {
          const idx = state.properties.items.findIndex(p => p.id === action.payload.id);
          if (idx > -1) {
            state.properties.items[idx] = { ...state.properties.items[idx], ...action.payload };
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updatePropertyAPI.rejected, (state, action) => {
        state.properties.loading = false;
        state.properties.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to update property';
      });

    // --- Delete Property ---
    builder
      .addCase(deletePropertyAPI.pending, (state) => {
        state.properties.loading = true;
      })
      .addCase(deletePropertyAPI.fulfilled, (state, action) => {
        state.properties.loading = false;
        state.properties.items = state.properties.items.filter(p => p.id !== action.payload);
        if (state.properties.selected?.id === action.payload) {
          state.properties.selected = null;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deletePropertyAPI.rejected, (state, action) => {
        state.properties.loading = false;
        state.properties.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to delete property';
      });

    // --- Fetch Commissions ---
    builder
      .addCase(fetchCommissionsFromAPI.pending, (state) => {
        state.commissions.loading = true;
        state.commissions.error = null;
      })
      .addCase(fetchCommissionsFromAPI.fulfilled, (state, action) => {
        state.commissions.loading = false;
        if (Array.isArray(action.payload)) {
          state.commissions.items = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCommissionsFromAPI.rejected, (state, action) => {
        state.commissions.loading = false;
        state.commissions.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch commissions';
      });

    // --- Create Commission ---
    builder
      .addCase(createCommissionAPI.pending, (state) => {
        state.commissions.loading = true;
        state.commissions.error = null;
      })
      .addCase(createCommissionAPI.fulfilled, (state, action) => {
        state.commissions.loading = false;
        if (action.payload) {
          state.commissions.items.unshift(action.payload);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createCommissionAPI.rejected, (state, action) => {
        state.commissions.loading = false;
        state.commissions.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to create commission';
      });

    // --- Update Commission ---
    builder
      .addCase(updateCommissionAPI.pending, (state) => {
        state.commissions.loading = true;
        state.commissions.error = null;
      })
      .addCase(updateCommissionAPI.fulfilled, (state, action) => {
        state.commissions.loading = false;
        if (action.payload) {
          const idx = state.commissions.items.findIndex(c => c.id === action.payload.id);
          if (idx > -1) {
            state.commissions.items[idx] = { ...state.commissions.items[idx], ...action.payload };
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateCommissionAPI.rejected, (state, action) => {
        state.commissions.loading = false;
        state.commissions.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to update commission';
      });

    // --- Bulk Pay Commissions ---
    builder
      .addCase(bulkPayCommissionsAPI.pending, (state) => {
        state.commissions.loading = true;
        state.commissions.error = null;
      })
      .addCase(bulkPayCommissionsAPI.fulfilled, (state, action) => {
        state.commissions.loading = false;
        // Mark paid commissions in state
        const paidIds = new Set(action.payload.commissionIds);
        state.commissions.items = state.commissions.items.map(c =>
          paidIds.has(String(c.id)) ? { ...c, status: 'paid', paidAt: new Date().toISOString() } : c
        );
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(bulkPayCommissionsAPI.rejected, (state, action) => {
        state.commissions.loading = false;
        state.commissions.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to process payments';
      });

    // --- Fetch Invoices ---
    // --- Fetch Clients ---
    builder
      .addCase(fetchClientsFromAPI.pending, (state) => {
        state.clients.loading = true;
        state.clients.error = null;
      })
      .addCase(fetchClientsFromAPI.fulfilled, (state, action) => {
        state.clients.loading = false;
        if (Array.isArray(action.payload)) {
          state.clients.items = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchClientsFromAPI.rejected, (state, action) => {
        state.clients.loading = false;
        state.clients.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch clients';
      });

    // --- Create Client ---
    builder
      .addCase(createClientAPI.pending, (state) => {
        state.clients.loading = true;
        state.clients.error = null;
      })
      .addCase(createClientAPI.fulfilled, (state, action) => {
        state.clients.loading = false;
        if (action.payload) {
          state.clients.items.unshift(action.payload);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createClientAPI.rejected, (state, action) => {
        state.clients.loading = false;
        state.clients.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to create client';
      });

    // --- Update Client ---
    builder
      .addCase(updateClientAPI.pending, (state) => {
        state.clients.loading = true;
        state.clients.error = null;
      })
      .addCase(updateClientAPI.fulfilled, (state, action) => {
        state.clients.loading = false;
        if (action.payload) {
          const idx = state.clients.items.findIndex(c => c.id === action.payload.id);
          if (idx > -1) {
            state.clients.items[idx] = { ...state.clients.items[idx], ...action.payload };
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateClientAPI.rejected, (state, action) => {
        state.clients.loading = false;
        state.clients.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to update client';
      });

    // --- Delete Client ---
    builder
      .addCase(deleteClientAPI.pending, (state) => {
        state.clients.loading = true;
      })
      .addCase(deleteClientAPI.fulfilled, (state, action) => {
        state.clients.loading = false;
        state.clients.items = state.clients.items.filter(c => c.id !== action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteClientAPI.rejected, (state, action) => {
        state.clients.loading = false;
        state.clients.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to delete client';
      });

    // --- Convert Lead to Client ---
    builder
      .addCase(convertLeadToClientAPI.fulfilled, (state, action) => {
        if (action.payload) {
          state.clients.items.unshift(action.payload);
        }
        state.lastUpdated = new Date().toISOString();
      });

    // --- Fetch Invoices ---
    builder
      .addCase(fetchInvoicesFromAPI.pending, (state) => {
        state.invoices.loading = true;
        state.invoices.error = null;
      })
      .addCase(fetchInvoicesFromAPI.fulfilled, (state, action) => {
        state.invoices.loading = false;
        if (Array.isArray(action.payload)) {
          state.invoices.items = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchInvoicesFromAPI.rejected, (state, action) => {
        state.invoices.loading = false;
        state.invoices.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch invoices';
      });

    // --- Create Invoice ---
    builder
      .addCase(createInvoiceAPI.pending, (state) => {
        state.invoices.loading = true;
        state.invoices.error = null;
      })
      .addCase(createInvoiceAPI.fulfilled, (state, action) => {
        state.invoices.loading = false;
        if (action.payload) {
          state.invoices.items.unshift(action.payload);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createInvoiceAPI.rejected, (state, action) => {
        state.invoices.loading = false;
        state.invoices.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to create invoice';
      });

    // --- Update Invoice ---
    builder
      .addCase(updateInvoiceAPI.pending, (state) => {
        state.invoices.loading = true;
        state.invoices.error = null;
      })
      .addCase(updateInvoiceAPI.fulfilled, (state, action) => {
        state.invoices.loading = false;
        if (action.payload) {
          const idx = state.invoices.items.findIndex(i => i.id === action.payload.id);
          if (idx > -1) {
            state.invoices.items[idx] = { ...state.invoices.items[idx], ...action.payload };
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateInvoiceAPI.rejected, (state, action) => {
        state.invoices.loading = false;
        state.invoices.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to update invoice';
      });

    // --- Delete Invoice ---
    builder
      .addCase(deleteInvoiceAPI.pending, (state) => {
        state.invoices.loading = true;
      })
      .addCase(deleteInvoiceAPI.fulfilled, (state, action) => {
        state.invoices.loading = false;
        state.invoices.items = state.invoices.items.filter(i => i.id !== action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteInvoiceAPI.rejected, (state, action) => {
        state.invoices.loading = false;
        state.invoices.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to delete invoice';
      });

    // --- Fetch Expenses ---
    builder
      .addCase(fetchExpensesFromAPI.pending, (state) => {
        state.expenses.loading = true;
        state.expenses.error = null;
      })
      .addCase(fetchExpensesFromAPI.fulfilled, (state, action) => {
        state.expenses.loading = false;
        if (Array.isArray(action.payload)) {
          state.expenses.items = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchExpensesFromAPI.rejected, (state, action) => {
        state.expenses.loading = false;
        state.expenses.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch expenses';
      });

    // --- Create Expense ---
    builder
      .addCase(createExpenseAPI.pending, (state) => {
        state.expenses.loading = true;
        state.expenses.error = null;
      })
      .addCase(createExpenseAPI.fulfilled, (state, action) => {
        state.expenses.loading = false;
        if (action.payload) {
          state.expenses.items.unshift(action.payload);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createExpenseAPI.rejected, (state, action) => {
        state.expenses.loading = false;
        state.expenses.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to create expense';
      });

    // --- Update Expense ---
    builder
      .addCase(updateExpenseAPI.pending, (state) => {
        state.expenses.loading = true;
        state.expenses.error = null;
      })
      .addCase(updateExpenseAPI.fulfilled, (state, action) => {
        state.expenses.loading = false;
        if (action.payload) {
          const idx = state.expenses.items.findIndex(e => e.id === action.payload.id);
          if (idx > -1) {
            state.expenses.items[idx] = { ...state.expenses.items[idx], ...action.payload };
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateExpenseAPI.rejected, (state, action) => {
        state.expenses.loading = false;
        state.expenses.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to update expense';
      });

    // --- Delete Expense ---
    builder
      .addCase(deleteExpenseAPI.pending, (state) => {
        state.expenses.loading = true;
      })
      .addCase(deleteExpenseAPI.fulfilled, (state, action) => {
        state.expenses.loading = false;
        state.expenses.items = state.expenses.items.filter(e => e.id !== action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteExpenseAPI.rejected, (state, action) => {
        state.expenses.loading = false;
        state.expenses.error = (typeof action.payload === 'string' ? action.payload : null) || 'Failed to delete expense';
      });

    // --- SECURITY: Reset all CRM data on logout to prevent data leaks ---
    builder.addCase(logout, () => initialState);
  }
});

// ============== ACTIONS ==============
export const {
  setLeads,
  addLead,
  updateLead,
  deleteLead,
  selectLead,
  setLeadsLoading,
  setLeadsError,
  setClients,
  addClient,
  updateClient,
  deleteClient,
  selectClient,
  setClientsLoading,
  setClientsError,
  setAgents,
  selectAgent,
  updateAgent,
  setAgentsLoading,
  setAgentsError,
  setProperties,
  addProperty,
  updateProperty,
  deleteProperty,
  selectProperty,
  setPropertiesLoading,
  setPropertiesError,
  setCommissions,
  updateCommission,
  setCommissionsLoading,
  setInvoices,
  setInvoicesLoading,
  setExpenses,
  setExpensesLoading,
  setActivities,
  addActivity,
  setOverviewData
} = crmDataSlice.actions;

// ============== SELECTORS (memoized with createSelector) ==============

// ── Base selectors (stable references — no new objects) ──
const selectLeadsSlice = (state: RootState) => state.crmData?.leads;
const selectClientsSlice = (state: RootState) => state.crmData?.clients;
const selectAgentsSlice = (state: RootState) => state.crmData?.agents;
const selectPropertiesSlice = (state: RootState) => state.crmData?.properties;
const selectCommissionsSlice = (state: RootState) => state.crmData?.commissions;
const selectInvoicesSlice = (state: RootState) => state.crmData?.invoices;
const selectExpensesSlice = (state: RootState) => state.crmData?.expenses;
const selectActivitiesSlice = (state: RootState) => state.crmData?.activities;

// ── Leads ──
export const selectAllLeads = createSelector(
  selectLeadsSlice,
  (leads) => leads?.items || []
);
export const selectHotLeads = createSelector(
  selectAllLeads,
  (items) => items.filter((l: CRMItem) => l.status === 'hot')
);
export const selectWarmLeads = createSelector(
  selectAllLeads,
  (items) => items.filter((l: CRMItem) => l.status === 'warm')
);
export const selectColdLeads = createSelector(
  selectAllLeads,
  (items) => items.filter((l: CRMItem) => l.status === 'cold')
);
export const selectSelectedLead = (state: RootState) => state.crmData?.leads?.selected;
export const selectLeadsLoading = (state: RootState) => state.crmData?.leads?.loading;
export const selectLeadsError = (state: RootState) => state.crmData?.leads?.error;

// ── Clients ──
export const selectAllClients = createSelector(
  selectClientsSlice,
  (clients) => clients?.items || []
);
export const selectSelectedClient = (state: RootState) => state.crmData?.clients?.selected;
export const selectClientsLoading = (state: RootState) => state.crmData?.clients?.loading;
export const selectClientsError = (state: RootState) => state.crmData?.clients?.error;

// Client category selectors
export const selectBuyerClients = createSelector(
  selectAllClients,
  (items) => items.filter((c: CRMItem) => c.category === 'buyer')
);
export const selectSellerClients = createSelector(
  selectAllClients,
  (items) => items.filter((c: CRMItem) => c.category === 'seller')
);
export const selectLandlordClients = createSelector(
  selectAllClients,
  (items) => items.filter((c: CRMItem) => c.category === 'landlord')
);
export const selectTenantClients = createSelector(
  selectAllClients,
  (items) => items.filter((c: CRMItem) => c.category === 'tenant')
);
export const selectInvestorClients = createSelector(
  selectAllClients,
  (items) => items.filter((c: CRMItem) => c.category === 'investor')
);
export const selectActiveClients = createSelector(
  selectAllClients,
  (items) => items.filter((c: CRMItem) => c.status === 'active')
);
export const selectClientsByAgent = (state: RootState, agentId: string | number) =>
  state.crmData?.clients?.items?.filter((c: CRMItem) => c.assignedToId === agentId) || [];

// ── Agents ──
export const selectAllAgents = createSelector(
  selectAgentsSlice,
  (agents) => agents?.items || []
);
export const selectSelectedAgent = (state: RootState) => state.crmData?.agents?.selected;
export const selectAgentsLoading = (state: RootState) => state.crmData?.agents?.loading;
export const selectAgentsError = (state: RootState) => state.crmData?.agents?.error;

export const selectOnlineAgents = createSelector(
  selectAllAgents,
  (items) => items.filter((a: CRMItem) => a.status === 'online')
);

export const selectAgentById = (state: RootState, agentId: string | number) =>
  state.crmData?.agents?.items?.find((a: CRMItem) => a.id === agentId);

// ── Properties ──
export const selectAllProperties = createSelector(
  selectPropertiesSlice,
  (properties) => properties?.items || []
);
export const selectSelectedProperty = (state: RootState) => state.crmData?.properties?.selected;
export const selectPropertiesLoading = (state: RootState) => state.crmData?.properties?.loading;
export const selectPropertiesError = (state: RootState) => state.crmData?.properties?.error;

export const selectAvailableProperties = createSelector(
  selectAllProperties,
  (items) => items.filter((p: CRMItem) => p.status === 'available')
);

export const selectPropertyById = (state: RootState, propertyId: string | number) =>
  state.crmData?.properties?.items?.find((p: CRMItem) => p.id === propertyId);

// ── Commissions ──
export const selectAllCommissions = createSelector(
  selectCommissionsSlice,
  (commissions) => commissions?.items || []
);
export const selectPendingCommissions = createSelector(
  selectAllCommissions,
  (items) => items.filter((c: CRMItem) => c.status === 'pending')
);
export const selectApprovedCommissions = createSelector(
  selectAllCommissions,
  (items) => items.filter((c: CRMItem) => c.status === 'approved')
);
export const selectPaidCommissions = createSelector(
  selectAllCommissions,
  (items) => items.filter((c: CRMItem) => c.status === 'paid')
);
export const selectCommissionsLoading = (state: RootState) => state.crmData?.commissions?.loading;
export const selectCommissionsError = (state: RootState) => state.crmData?.commissions?.error;

export const selectCommissionsByAgent = (state: RootState, agentId: string | number) =>
  state.crmData?.commissions?.items?.filter((c: CRMItem) => c.agentId === agentId || c.agent_id === agentId) || [];

// ── Invoices ──
export const selectAllInvoices = createSelector(
  selectInvoicesSlice,
  (invoices) => invoices?.items || []
);
export const selectPendingInvoices = createSelector(
  selectAllInvoices,
  (items) => items.filter((i: CRMItem) => i.status === 'pending')
);
export const selectPaidInvoices = createSelector(
  selectAllInvoices,
  (items) => items.filter((i: CRMItem) => i.status === 'paid')
);
export const selectOverdueInvoices = createSelector(
  selectAllInvoices,
  (items) => items.filter((i: CRMItem) => i.status === 'overdue')
);
export const selectDraftInvoices = createSelector(
  selectAllInvoices,
  (items) => items.filter((i: CRMItem) => i.status === 'draft')
);
export const selectInvoicesLoading = (state: RootState) => state.crmData?.invoices?.loading;
export const selectInvoicesError = (state: RootState) => state.crmData?.invoices?.error;

// ── Expenses ──
export const selectAllExpenses = createSelector(
  selectExpensesSlice,
  (expenses) => expenses?.items || []
);
export const selectPendingExpenses = createSelector(
  selectAllExpenses,
  (items) => items.filter((e: CRMItem) => e.status === 'pending')
);
export const selectApprovedExpenses = createSelector(
  selectAllExpenses,
  (items) => items.filter((e: CRMItem) => e.status === 'approved')
);
export const selectRejectedExpenses = createSelector(
  selectAllExpenses,
  (items) => items.filter((e: CRMItem) => e.status === 'rejected')
);
export const selectExpensesLoading = (state: RootState) => state.crmData?.expenses?.loading;
export const selectExpensesError = (state: RootState) => state.crmData?.expenses?.error;

// ── Activities ──
export const selectAllActivities = createSelector(
  selectActivitiesSlice,
  (activities) => activities?.items || []
);
export const selectRecentActivities = createSelector(
  (state: RootState) => state.crmData?.activities?.items,
  (_state: RootState, count: number = 10) => count,
  (items, count) => items ? items.slice(0, count) : []
);

// ── Overview ──
const EMPTY_OVERVIEW: Record<string, unknown> = Object.freeze({});
const EMPTY_METRICS: Record<string, unknown> = Object.freeze({});
export const selectOverviewData = (state: RootState) => state.crmData?.overview ?? EMPTY_OVERVIEW;
export const selectOverviewMetrics = (state: RootState) =>
  state.crmData?.overview?.metrics ?? EMPTY_METRICS;

// ── Summary stats (memoized — uses spread copy to avoid mutating state) ──
export const selectTopAgents = createSelector(
  selectAllAgents,
  (_state: RootState, count: number = 5) => count,
  (items, count) => [...items].sort((a: CRMItem, b: CRMItem) => {
    const bSales = typeof b.sales === 'number' ? b.sales : 0;
    const aSales = typeof a.sales === 'number' ? a.sales : 0;
    return bSales - aSales;
  }).slice(0, count)
);

export const makeSelectLeadsByAgent = (agentId: string | number) =>
  createSelector(
    (state: RootState) => state.crmData?.leads?.items,
    (items) => items?.filter((l: CRMItem) => l.agent_id === agentId) ?? []
  );

export const makeSelectClientsByAgent = (agentId: string | number) =>
  createSelector(
    (state: RootState) => state.crmData?.clients?.items,
    (items) => items?.filter((c: CRMItem) => c.agent_id === agentId) ?? []
  );

// Last updated
export const selectLastUpdated = (state: RootState) => state.crmData?.lastUpdated;

export default crmDataSlice.reducer;
