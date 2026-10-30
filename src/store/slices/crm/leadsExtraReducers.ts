/**
 * Leads Extra Reducers
 * Single Purpose: Map leads async thunk lifecycles (pending, fulfilled, rejected) to CRM state.
 */

import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import type { CRMDataState } from './crmTypes';
import {
  fetchLeadsFromAPI,
  createLeadAPI,
  updateLeadAPI,
  deleteLeadAPI,
  convertLeadToClientAPI,
} from './leadsCrudThunks';

export function addLeadsExtraReducers(builder: ActionReducerMapBuilder<CRMDataState>): void {
      // --- Fetch Leads ---
    builder
      .addCase(fetchLeadsFromAPI.pending, state => {
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
        state.leads.error =
          (typeof action.payload === 'string' ? action.payload : null) || 'Failed to fetch leads';
      });

      // --- Create Lead ---
    builder
      .addCase(createLeadAPI.pending, state => {
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
        state.leads.error =
          (typeof action.payload === 'string' ? action.payload : null) || 'Failed to create lead';
      });

    // --- Update Lead ---
    builder
      .addCase(updateLeadAPI.pending, state => {
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
        state.leads.error =
          (typeof action.payload === 'string' ? action.payload : null) || 'Failed to update lead';
      });

    // --- Delete Lead ---
    builder
      .addCase(deleteLeadAPI.pending, state => {
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
        state.leads.error =
          (typeof action.payload === 'string' ? action.payload : null) || 'Failed to delete lead';
      });


      // --- Convert Lead to Client ---
    builder.addCase(convertLeadToClientAPI.fulfilled, (state, action) => {
      if (action.payload) {
        state.clients.items.unshift(action.payload);
      }
      state.lastUpdated = new Date().toISOString();
    });

}
