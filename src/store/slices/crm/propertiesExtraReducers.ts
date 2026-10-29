/**
 * Properties Extra Reducers
 * Single Purpose: Map properties async thunk lifecycles to CRM state.
 */

import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import type { CRMDataState } from './crmTypes';
import {
  fetchPropertiesFromAPI,
  createPropertyAPI,
  updatePropertyAPI,
  deletePropertyAPI,
} from './propertiesCrudThunks';

export function addPropertiesExtraReducers(builder: ActionReducerMapBuilder<CRMDataState>): void {
      // --- Fetch Properties ---
    builder
      .addCase(fetchPropertiesFromAPI.pending, state => {
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
        state.properties.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to fetch properties';
      });


      // --- Create Property ---
    builder
      .addCase(createPropertyAPI.pending, state => {
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
        state.properties.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to create property';
      });

    // --- Update Property ---
    builder
      .addCase(updatePropertyAPI.pending, state => {
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
        state.properties.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to update property';
      });

    // --- Delete Property ---
    builder
      .addCase(deletePropertyAPI.pending, state => {
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
        state.properties.error =
          (typeof action.payload === 'string' ? action.payload : null) ||
          'Failed to delete property';
      });

}
