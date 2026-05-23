import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { PLATFORM_FEATURES, FEATURE_CATEGORIES, getFeatureStats } from '../config/platformFeatures';
import type { PlatformFeature, FeatureStats } from '../config/platformFeatures';
import type { RootState } from './store';

/** Mutable version of PlatformFeature for Redux state */
interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  details: string[];
  [key: string]: unknown;
}

/** Convert readonly PlatformFeature to mutable Feature */
const toFeatures = (features: readonly PlatformFeature[]): Feature[] =>
  features.map(f => ({
    id: f.id,
    name: f.name,
    description: f.description,
    category: f.category,
    details: [...f.details],
    status: f.status,
    icon: f.icon,
    implementedDate: f.implementedDate,
    files: [...f.files],
  }));

interface FeaturesState {
  features: Feature[];
  categories: string[];
  selectedFeatureId: string | null;
  selectedCategory: string | null;
  searchQuery: string;
  viewMode: string;
  stats: FeatureStats;
}

const initialState: FeaturesState = {
  features: toFeatures(PLATFORM_FEATURES),
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

export const selectFilteredFeatures = createSelector(
  (state: RootState) => state.features.features,
  (state: RootState) => state.features.selectedCategory,
  (state: RootState) => state.features.searchQuery,
  (features, category, search): Feature[] => {
    let filtered = features;
    if (category) {
      filtered = filtered.filter((f: Feature) => f.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((f: Feature) =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.details.some((d: string) => d.toLowerCase().includes(q))
      );
    }
    return filtered;
  }
);

export const selectSelectedFeature = (state: RootState): Feature | null => {
  if (!state.features.selectedFeatureId) return null;
  return state.features.features.find((f: Feature) => f.id === state.features.selectedFeatureId) || null;
};

export const { selectFeature, selectCategory, setSearchQuery, setViewMode, clearSelection } = featuresSlice.actions;

export default featuresSlice.reducer;
