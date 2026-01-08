import { createSlice } from '@reduxjs/toolkit';
import { PLATFORM_FEATURES, FEATURE_CATEGORIES, getFeatureStats } from '../config/platformFeatures';

const initialState = {
  features: PLATFORM_FEATURES,
  categories: Object.values(FEATURE_CATEGORIES),
  selectedFeatureId: null,
  selectedCategory: null,
  searchQuery: '',
  viewMode: 'grid',
  stats: getFeatureStats(),
};

const featuresSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {
    selectFeature: (state, action) => {
      state.selectedFeatureId = action.payload;
    },
    selectCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.selectedFeatureId = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    clearSelection: (state) => {
      state.selectedFeatureId = null;
      state.selectedCategory = null;
      state.searchQuery = '';
    },
  },
});

export const selectFilteredFeatures = (state) => {
  let features = state.features.features;
  
  if (state.features.selectedCategory) {
    features = features.filter(f => f.category === state.features.selectedCategory);
  }
  
  if (state.features.searchQuery) {
    const query = state.features.searchQuery.toLowerCase();
    features = features.filter(f => 
      f.name.toLowerCase().includes(query) ||
      f.description.toLowerCase().includes(query) ||
      f.details.some(d => d.toLowerCase().includes(query))
    );
  }
  
  return features;
};

export const selectSelectedFeature = (state) => {
  if (!state.features.selectedFeatureId) return null;
  return state.features.features.find(f => f.id === state.features.selectedFeatureId);
};

export const { selectFeature, selectCategory, setSearchQuery, setViewMode, clearSelection } = featuresSlice.actions;
export default featuresSlice.reducer;
