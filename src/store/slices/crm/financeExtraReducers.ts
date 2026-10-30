/**
 * Finance Extra Reducers
 * Single Purpose: Map commissions, invoices, and expenses thunk lifecycles to CRM state.
 */

import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import type { CRMDataState } from './crmTypes';
import {
  fetchCommissionsFromAPI,
  createCommissionAPI,
  updateCommissionAPI,
  bulkPayCommissionsAPI,
} from './commissionsThunks';
import {
  fetchInvoicesFromAPI,
  createInvoiceAPI,
  updateInvoiceAPI,
  deleteInvoiceAPI,
  fetchExpensesFromAPI,
  createExpenseAPI,
  updateExpenseAPI,
  deleteExpenseAPI,
} from './invoicesExpensesThunks';

export function addFinanceExtraReducers(builder: ActionReducerMapBuilder<CRMDataState>): void {
      // --- Fetch Commissions ---
    builder
      .addCase(fetchCommissionsFromAPI.pending, state => {
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
        state.commissions.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to fetch commissions';
      });

    // --- Create Commission ---
    builder
      .addCase(createCommissionAPI.pending, state => {
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
        state.commissions.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to create commission';
      });

    // --- Update Commission ---
    builder
      .addCase(updateCommissionAPI.pending, state => {
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
        state.commissions.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to update commission';
      });

    // --- Bulk Pay Commissions ---
    builder
      .addCase(bulkPayCommissionsAPI.pending, state => {
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
        state.commissions.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to process payments';
      });


      // --- Fetch Invoices ---
    builder
      .addCase(fetchInvoicesFromAPI.pending, state => {
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
        state.invoices.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to fetch invoices';
      });

    // --- Create Invoice ---
    builder
      .addCase(createInvoiceAPI.pending, state => {
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
        state.invoices.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to create invoice';
      });

    // --- Update Invoice ---
    builder
      .addCase(updateInvoiceAPI.pending, state => {
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
        state.invoices.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to update invoice';
      });

    // --- Delete Invoice ---
    builder
      .addCase(deleteInvoiceAPI.pending, state => {
        state.invoices.loading = true;
      })
      .addCase(deleteInvoiceAPI.fulfilled, (state, action) => {
        state.invoices.loading = false;
        state.invoices.items = state.invoices.items.filter(i => i.id !== action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteInvoiceAPI.rejected, (state, action) => {
        state.invoices.loading = false;
        state.invoices.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to delete invoice';
      });

    // --- Fetch Expenses ---
    builder
      .addCase(fetchExpensesFromAPI.pending, state => {
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
        state.expenses.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to fetch expenses';
      });

    // --- Create Expense ---
    builder
      .addCase(createExpenseAPI.pending, state => {
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
        state.expenses.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to create expense';
      });

    // --- Update Expense ---
    builder
      .addCase(updateExpenseAPI.pending, state => {
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
        state.expenses.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to update expense';
      });

    // --- Delete Expense ---
    builder
      .addCase(deleteExpenseAPI.pending, state => {
        state.expenses.loading = true;
      })
      .addCase(deleteExpenseAPI.fulfilled, (state, action) => {
        state.expenses.loading = false;
        state.expenses.items = state.expenses.items.filter(e => e.id !== action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteExpenseAPI.rejected, (state, action) => {
        state.expenses.loading = false;
        state.expenses.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to delete expense';
      });

}
