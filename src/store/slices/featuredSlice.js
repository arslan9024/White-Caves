import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  featuredProperties: [],
  lastUpdated: null,
  isLoading: false,
  error: null,
  selectionCriteria: {
    inquiriesWeight: 3,
    viewsWeight: 0.5,
    qualityWeight: 2,
    isNewBonus: 10,
    maxFeatured: 10
  },
  dailyLoopEnabled: true,
  loopInterval: 24 * 60 * 60 * 1000
};

const featuredSlice = createSlice({
  name: 'featured',
  initialState,
  reducers: {
    setFeaturedProperties: (state, action) => {
      state.featuredProperties = action.payload;
      state.lastUpdated = new Date().toISOString();
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateSelectionCriteria: (state, action) => {
      state.selectionCriteria = { ...state.selectionCriteria, ...action.payload };
    },
    toggleDailyLoop: (state) => {
      state.dailyLoopEnabled = !state.dailyLoopEnabled;
    },
    clearFeatured: (state) => {
      state.featuredProperties = [];
      state.lastUpdated = null;
    }
  }
});

export const {
  setFeaturedProperties,
  setLoading,
  setError,
  updateSelectionCriteria,
  toggleDailyLoop,
  clearFeatured
} = featuredSlice.actions;

export const selectFeaturedProperties = (state) => state.featured?.featuredProperties || [];
export const selectLastUpdated = (state) => state.featured?.lastUpdated;
export const selectIsLoading = (state) => state.featured?.isLoading;
export const selectSelectionCriteria = (state) => state.featured?.selectionCriteria;
export const selectDailyLoopEnabled = (state) => state.featured?.dailyLoopEnabled;

export const selectFeaturedCount = createSelector(
  [selectFeaturedProperties],
  (properties) => properties.length
);

export const selectFeaturedByType = createSelector(
  [selectFeaturedProperties, (_, type) => type],
  (properties, type) => properties.filter(p => p.type === type)
);

export const scoreProperty = (property, criteria) => {
  const inquiries = property.inquiries || 0;
  const views = property.views || 0;
  const quality = property.qualityScore || 5;
  const isNew = property.isNew ? 1 : 0;
  
  return (
    (inquiries * criteria.inquiriesWeight) +
    (views * criteria.viewsWeight) +
    (quality * criteria.qualityWeight) +
    (isNew * criteria.isNewBonus)
  );
};

export const selectTopProperties = (allProperties, criteria, maxCount = 10) => {
  if (!allProperties || allProperties.length === 0) return [];
  
  const available = allProperties.filter(p => 
    p.status === 'available' || p.status === 'active' || !p.status
  );
  
  const scored = available.map(property => ({
    ...property,
    featuredScore: scoreProperty(property, criteria)
  }));
  
  scored.sort((a, b) => b.featuredScore - a.featuredScore);
  
  return scored.slice(0, maxCount);
};

export const runDailySelection = () => async (dispatch, getState) => {
  dispatch(setLoading(true));
  
  try {
    const state = getState();
    const criteria = selectSelectionCriteria(state);
    const allProperties = state.inventory?.properties || [];
    
    const topProperties = selectTopProperties(allProperties, criteria, criteria.maxFeatured);
    
    dispatch(setFeaturedProperties(topProperties));
    
    console.log(`[Olivia] Daily selection complete: ${topProperties.length} properties featured`);
  } catch (error) {
    console.error('[Olivia] Daily selection failed:', error);
    dispatch(setError(error.message));
  }
};

export default featuredSlice.reducer;
