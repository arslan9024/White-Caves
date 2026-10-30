/**
 * Operations Extra Reducers
 * Single Purpose: Map agents, clients, transactions, and activities thunk lifecycles to CRM state.
 */

import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import type { CRMDataState } from './crmTypes';
import { fetchAgentsFromAPI, fetchDashboardOverview } from './agentsOverviewThunks';
import {
  fetchClientsFromAPI,
  createClientAPI,
  updateClientAPI,
  deleteClientAPI,
} from './clientsThunks';
import {
  fetchTransactionsFromAPI,
  createTransactionAPI,
  updateTransactionAPI,
  deleteTransactionAPI,
  fetchActivitiesFromAPI,
  createActivityAPI,
  updateActivityAPI,
  deleteActivityAPI,
} from './activitiesTransactionsThunks';

export function addOperationsExtraReducers(builder: ActionReducerMapBuilder<CRMDataState>): void {
      // --- Fetch Agents ---
    builder
      .addCase(fetchAgentsFromAPI.pending, state => {
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
        state.agents.error =
          (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch agents';
      });

    // --- Fetch Dashboard Overview ---
    builder
      .addCase(fetchDashboardOverview.pending, state => {
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
          error:
            (typeof action.payload === 'string' ? action.payload : null) ||
            'Failed to load dashboard overview',
        };
      });


      // --- Fetch Invoices ---
    // --- Fetch Clients ---
    builder
      .addCase(fetchClientsFromAPI.pending, state => {
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
        state.clients.error =
          (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch clients';
      });

    // --- Create Client ---
    builder
      .addCase(createClientAPI.pending, state => {
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
        state.clients.error =
          (typeof action.payload === 'string' ? action.payload : null) || 'Failed to create client';
      });

    // --- Update Client ---
    builder
      .addCase(updateClientAPI.pending, state => {
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
        state.clients.error =
          (typeof action.payload === 'string' ? action.payload : null) || 'Failed to update client';
      });

    // --- Delete Client ---
    builder
      .addCase(deleteClientAPI.pending, state => {
        state.clients.loading = true;
      })
      .addCase(deleteClientAPI.fulfilled, (state, action) => {
        state.clients.loading = false;
        state.clients.items = state.clients.items.filter(c => c.id !== action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteClientAPI.rejected, (state, action) => {
        state.clients.loading = false;
        state.clients.error =
          (typeof action.payload === 'string' ? action.payload : null) || 'Failed to delete client';
      });


      // --- Fetch Transactions ---
    builder
      .addCase(fetchTransactionsFromAPI.pending, state => {
        state.transactions.loading = true;
        state.transactions.error = null;
      })
      .addCase(fetchTransactionsFromAPI.fulfilled, (state, action) => {
        state.transactions.loading = false;
        state.transactions.items = action.payload.data;
        state.transactions.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchTransactionsFromAPI.rejected, (state, action) => {
        state.transactions.loading = false;
        state.transactions.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to fetch transactions';
      });

    // --- Create Transaction ---
    builder
      .addCase(createTransactionAPI.pending, state => {
        state.transactions.loading = true;
      })
      .addCase(createTransactionAPI.fulfilled, (state, action) => {
        state.transactions.loading = false;
        state.transactions.items.unshift(action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createTransactionAPI.rejected, (state, action) => {
        state.transactions.loading = false;
        state.transactions.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to create transaction';
      });

    // --- Update Transaction ---
    builder
      .addCase(updateTransactionAPI.pending, state => {
        state.transactions.loading = true;
      })
      .addCase(updateTransactionAPI.fulfilled, (state, action) => {
        state.transactions.loading = false;
        const idx = state.transactions.items.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) state.transactions.items[idx] = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateTransactionAPI.rejected, (state, action) => {
        state.transactions.loading = false;
        state.transactions.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to update transaction';
      });

    // --- Delete Transaction ---
    builder
      .addCase(deleteTransactionAPI.pending, state => {
        state.transactions.loading = true;
      })
      .addCase(deleteTransactionAPI.fulfilled, (state, action) => {
        state.transactions.loading = false;
        state.transactions.items = state.transactions.items.filter(t => t.id !== action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteTransactionAPI.rejected, (state, action) => {
        state.transactions.loading = false;
        state.transactions.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to delete transaction';
      });

    // --- Fetch Activities ---
    builder
      .addCase(fetchActivitiesFromAPI.pending, state => {
        state.activities.loading = true;
        state.activities.error = null;
      })
      .addCase(fetchActivitiesFromAPI.fulfilled, (state, action) => {
        state.activities.loading = false;
        state.activities.items = action.payload.data;
        state.activities.error = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchActivitiesFromAPI.rejected, (state, action) => {
        state.activities.loading = false;
        state.activities.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to fetch activities';
      });

    // --- Create Activity ---
    builder
      .addCase(createActivityAPI.pending, state => {
        state.activities.loading = true;
      })
      .addCase(createActivityAPI.fulfilled, (state, action) => {
        state.activities.loading = false;
        state.activities.items.unshift(action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createActivityAPI.rejected, (state, action) => {
        state.activities.loading = false;
        state.activities.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to create activity';
      });

    // --- Update Activity ---
    builder
      .addCase(updateActivityAPI.pending, state => {
        state.activities.loading = true;
      })
      .addCase(updateActivityAPI.fulfilled, (state, action) => {
        state.activities.loading = false;
        const idx = state.activities.items.findIndex(a => a.id === action.payload.id);
        if (idx !== -1) state.activities.items[idx] = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateActivityAPI.rejected, (state, action) => {
        state.activities.loading = false;
        state.activities.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to update activity';
      });

    // --- Delete Activity ---
    builder
      .addCase(deleteActivityAPI.pending, state => {
        state.activities.loading = true;
      })
      .addCase(deleteActivityAPI.fulfilled, (state, action) => {
        state.activities.loading = false;
        state.activities.items = state.activities.items.filter(a => a.id !== action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteActivityAPI.rejected, (state, action) => {
        state.activities.loading = false;
        state.activities.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to delete activity';
      });

}
