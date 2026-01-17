import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = '/api/inventory';

export const loadPropertyStatuses = createAsyncThunk(
  'propertyStatus/loadAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}/statuses`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to load property statuses');
    }
  }
);

export const updatePropertyStatus = createAsyncThunk(
  'propertyStatus/update',
  async ({ propertyId, field, value }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE}/${propertyId}/status-update`,
        { field, value }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update property status');
    }
  }
);

const initialState = {
  byId: {},
  allIds: [],
  loading: false,
  error: null,
  filters: {
    furnishing: 'all',
    occupancy: 'all',
    market: 'all',
    construction: 'all',
    legal: 'all',
  },
};

const propertyStatusSlice = createSlice({
  name: 'propertyStatus',
  initialState,
  reducers: {
    setStatusFilter: (state, action) => {
      const { field, value } = action.payload;
      state.filters[field] = value;
    },
    clearStatusFilters: (state) => {
      state.filters = {
        furnishing: 'all',
        occupancy: 'all',
        market: 'all',
        construction: 'all',
        legal: 'all',
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPropertyStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPropertyStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.byId = {};
        state.allIds = [];
        action.payload.forEach((status) => {
          state.byId[status._id] = status;
          state.allIds.push(status._id);
        });
      })
      .addCase(loadPropertyStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePropertyStatus.fulfilled, (state, action) => {
        const { _id, ...updates } = action.payload;
        if (state.byId[_id]) {
          state.byId[_id] = { ...state.byId[_id], ...updates };
        }
      });
  },
});

export const { setStatusFilter, clearStatusFilters, clearError } = propertyStatusSlice.actions;

export const selectPropertyStatusById = (state, id) => state.propertyStatus.byId[id];

export const selectAllPropertyStatuses = (state) =>
  state.propertyStatus.allIds.map((id) => state.propertyStatus.byId[id]);

export const selectFilteredPropertyStatuses = (state) => {
  const allStatuses = selectAllPropertyStatuses(state);
  const filters = state.propertyStatus.filters;

  return allStatuses.filter((status) => {
    if (filters.furnishing !== 'all' && status.furnishing !== filters.furnishing) return false;
    if (filters.occupancy !== 'all' && status.occupancyStatus !== filters.occupancy) return false;
    if (filters.market !== 'all' && status.marketAvailability !== filters.market) return false;
    if (filters.construction !== 'all' && status.constructionStage !== filters.construction) return false;
    if (filters.legal !== 'all' && status.legalStatus !== filters.legal) return false;
    return true;
  });
};

export const selectPropertyStatusLoading = (state) => state.propertyStatus.loading;
export const selectPropertyStatusError = (state) => state.propertyStatus.error;
export const selectStatusFilters = (state) => state.propertyStatus.filters;

export const selectPropertiesByStatus = (state, field, value) =>
  selectAllPropertyStatuses(state).filter((status) => status[field] === value);

export default propertyStatusSlice.reducer;
