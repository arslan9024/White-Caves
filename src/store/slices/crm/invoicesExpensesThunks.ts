/**
 * Invoices, Expenses & Currency Thunks
 * Single Purpose: Invoice lifecycle, expense claims, FX currency conversion, and rates.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch, extractApiError } from '../../../utils/authFetch';
import { getErrorMessage } from '../../../constants';
import type { CRMItem } from './crmTypes';

export const fetchInvoicesFromAPI = createAsyncThunk<
  CRMItem[],
  { page?: number; pageSize?: number; status?: string; client?: string },
  { rejectValue: string }
>('crmData/fetchInvoices', async (params = {}, { rejectWithValue }) => {
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
});

/** Create a new invoice via /api/finance/invoices */
export const createInvoiceAPI = createAsyncThunk<
  CRMItem,
  {
    client: string;
    amount: number;
    dueDate: string;
    property?: string;
    notes?: string;
    vatAmount?: number;
    lineItems?: unknown[];
  },
  { rejectValue: string }
>('crmData/createInvoice', async (invoiceData, { rejectWithValue }) => {
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
});

/** Update an invoice via /api/finance/invoices/:id */
export const updateInvoiceAPI = createAsyncThunk<
  CRMItem,
  {
    id: string;
    status?: string;
    amount?: number;
    notes?: string;
    client?: string;
    dueDate?: string;
  },
  { rejectValue: string }
>('crmData/updateInvoice', async ({ id, ...updates }, { rejectWithValue }) => {
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
});

/** Delete an invoice via /api/finance/invoices/:id */
export const deleteInvoiceAPI = createAsyncThunk<string, string, { rejectValue: string }>(
  'crmData/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/finance/invoices/${id}`, { method: 'DELETE' });
      if (!response.ok)
        throw new Error(await extractApiError(response, 'Failed to delete invoice'));
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
>('crmData/fetchExpenses', async (params = {}, { rejectWithValue }) => {
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
});

/** Create a new expense via /api/finance/expenses */
export const createExpenseAPI = createAsyncThunk<
  CRMItem,
  {
    category: string;
    description: string;
    amount: number;
    date?: string;
    notes?: string;
    receiptUrl?: string;
  },
  { rejectValue: string }
>('crmData/createExpense', async (expenseData, { rejectWithValue }) => {
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
});

/** Update an expense via /api/finance/expenses/:id */
export const updateExpenseAPI = createAsyncThunk<
  CRMItem,
  {
    id: string;
    status?: string;
    amount?: number;
    category?: string;
    description?: string;
    notes?: string;
  },
  { rejectValue: string }
>('crmData/updateExpense', async ({ id, ...updates }, { rejectWithValue }) => {
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
});

/** Delete an expense via /api/finance/expenses/:id */
export const deleteExpenseAPI = createAsyncThunk<string, string, { rejectValue: string }>(
  'crmData/deleteExpense',
  async (id, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/finance/expenses/${id}`, { method: 'DELETE' });
      if (!response.ok)
        throw new Error(await extractApiError(response, 'Failed to delete expense'));
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

export const fetchExchangeRatesAPI = createAsyncThunk<
  { base: string; rates: Record<string, number>; updatedAt: string; source: string },
  void,
  { rejectValue: string }
>('crmData/fetchExchangeRates', async (_, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/currency/rates');
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch exchange rates');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch exchange rates'));
  }
});

/** Fetch supported currencies — GET /api/currency/supported */
export const fetchSupportedCurrenciesAPI = createAsyncThunk<
  Array<{ code: string; name: string; symbol: string; flag: string }>,
  void,
  { rejectValue: string }
>('crmData/fetchSupportedCurrencies', async (_, { rejectWithValue }) => {
  try {
    const res = await authFetch('/api/currency/supported');
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Failed to fetch currencies');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Failed to fetch currencies'));
  }
});

/** Convert currency — GET /api/currency/convert */
export const convertCurrencyAPI = createAsyncThunk<
  {
    original: { amount: number; currency: string };
    converted: { amount: number; currency: string };
  },
  { amount: number; from: string; to: string },
  { rejectValue: string }
>('crmData/convertCurrency', async ({ amount, from, to }, { rejectWithValue }) => {
  try {
    const res = await authFetch(`/api/currency/convert?amount=${amount}&from=${from}&to=${to}`);
    const json = await res.json();
    if (!res.ok) return rejectWithValue(json.error || 'Conversion failed');
    return json.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Conversion failed'));
  }
});

// ============================================================================
// EMAIL THUNKS (Phase 3B — Email Automation)
// ============================================================================

/** Send a custom email — POST /api/email/send */
