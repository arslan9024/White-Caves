/**
 * propertySearchSlice — Intent-Aware Property Search State (W18.1-P0-001)
 * =========================================================================
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ViewportBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface PropertyFilters {
  type: string;
  status: string;
  minPrice: number | null;
  maxPrice: number | null;
  beds: number | null;
  location: string;
  area: string;
  furnishing: 'all' | 'furnished' | 'unfurnished';
  handoverStage: 'all' | 'ready' | 'off-plan' | 'under-construction';
  permitStatus: 'all' | 'active' | 'pending';
  feeBand: 'all' | 'no-fee' | 'low-fee' | 'standard-fee';
}

export interface PropertySearchState {
  intentProfile: 'buy' | 'rent' | 'invest' | null;
  filters: PropertyFilters;
  viewportBounds: ViewportBounds | null;
  activePropertyId: string | null;
}

export const DEFAULT_PROPERTY_FILTERS: PropertyFilters = {
  type: '',
  status: '',
  minPrice: null,
  maxPrice: null,
  beds: null,
  location: '',
  area: '',
  furnishing: 'all',
  handoverStage: 'all',
  permitStatus: 'all',
  feeBand: 'all',
};

const initialState: PropertySearchState = {
  intentProfile: null,
  filters: DEFAULT_PROPERTY_FILTERS,
  viewportBounds: null,
  activePropertyId: null,
};

export const propertySearchSlice = createSlice({
  name: 'propertySearch',
  initialState,
  reducers: {
    setIntentProfile(
      state,
      action: PayloadAction<'buy' | 'rent' | 'invest' | null>,
    ) {
      state.intentProfile = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<PropertyFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setViewportBounds(state, action: PayloadAction<ViewportBounds | null>) {
      state.viewportBounds = action.payload;
    },
    setActivePropertyId(state, action: PayloadAction<string | null>) {
      state.activePropertyId = action.payload;
    },
    resetFilters(state) {
      state.filters = DEFAULT_PROPERTY_FILTERS;
    },
  },
});

export const {
  setIntentProfile,
  setFilters,
  setViewportBounds,
  setActivePropertyId,
  resetFilters,
} = propertySearchSlice.actions;

// Typed selectors — local state shape avoids circular import with store/store.tsx
type StateWithPropertySearch = { propertySearch: PropertySearchState };

export const selectIntentProfile = (s: StateWithPropertySearch) =>
  s.propertySearch.intentProfile;
export const selectPropertySearchFilters = (s: StateWithPropertySearch) =>
  s.propertySearch.filters;
export const selectViewportBounds = (s: StateWithPropertySearch) =>
  s.propertySearch.viewportBounds;
export const selectActivePropertyId = (s: StateWithPropertySearch) =>
  s.propertySearch.activePropertyId;

export default propertySearchSlice.reducer;
