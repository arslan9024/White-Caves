import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PLATFORM_FEATURES, FEATURE_CATEGORIES, getFeatureStats } from '../config/platformFeatures';

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  details: string[];
  [key: string]: any;
}

interface FeaturesState {
  features: Feature[];
  categories: string[];
  selectedFeatureId: string | null;
  selectedCategory: string | null;
  searchQuery: string;
  viewMode: string;
  stats: any;
}

const initialState: FeaturesState = {
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
    selectFeature: (state, action: PayloadAction<string>) => {
      state.selectedFeatureId = action.payload;
    },
    selectCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
      state.selectedFeatureId = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setViewMode: (state, action: PayloadAction<string>) => {
      state.viewMode = action.payload;
    },
    clearSelection: (state) => {
      state.selectedFeatureId = null;
      state.selectedCategory = null;
      state.searchQuery = '';
    },
  },
});

export const selectFilteredFeatures = (state: any): Feature[] => {
  let features = state.features.features;
  
  if (state.features.selectedCategory) {
    features = features.filter((f: Feature) => f.category === state.features.selectedCategory);
  }
  
  if (state.features.searchQuery) {
    const query = state.features.searchQuery.toLowerCase();
    features = features.filter((f: Feature) => 
      f.name.toLowerCase().includes(query) ||
      f.description.toLowerCase().includes(query) ||
      f.details.some((d: string) => d.toLowerCase().includes(query))
    );
  }
  
  return features;
};

export const selectSelectedFeature = (state: any): Feature | null => {
  if (!state.features.selectedFeatureId) return null;
  return state.features.features.find((f: Feature) => f.id === state.features.selectedFeatureId) || null;
};

export const { selectFeature, selectCategory, setSearchQuery, setViewMode, clearSelection } = featuresSlice.actions;

export default featuresSlice.reducer;
