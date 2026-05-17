import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch } from '../../utils/authFetch';

const API_BASE = '/api/inventory';
const STATUS_FILTER_FIELDS = new Set([
  'furnishing',
  'occupancy',
  'market',
  'construction',
  'legal',
]);

const readJson = async (response, fallbackMessage) => {
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.error || payload?.message || fallbackMessage;
    throw new Error(message);
  }

  return payload;
};

export const loadPropertyStatuses = createAsyncThunk(
  'propertyStatus/loadAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch(`${API_BASE}/statuses`);
      return await readJson(response, 'Failed to load property statuses');
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to load property statuses');
    }
  }
);

export const updatePropertyStatus = createAsyncThunk(
  'propertyStatus/update',
  async ({ propertyId, field, value }, { rejectWithValue }) => {
    try {
      const response = await authFetch(`${API_BASE}/${propertyId}/status-update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value }),
      });
      return await readJson(response, 'Failed to update property status');
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to update property status');
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
      if (STATUS_FILTER_FIELDS.has(field)) {
        state.filters = {
          ...state.filters,
          [field]: value,
        };
      }
    },
    clearStatusFilters: state => {
      state.filters = {
        furnishing: 'all',
        occupancy: 'all',
        market: 'all',
        construction: 'all',
        legal: 'all',
      };
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadPropertyStatuses.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPropertyStatuses.fulfilled, (state, action) => {
        state.loading = false;
        const entities = Object.fromEntries(action.payload.map(status => [status._id, status]));
        state.byId = entities;
        state.allIds = action.payload.map(status => status._id);
      })
      .addCase(loadPropertyStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePropertyStatus.fulfilled, (state, action) => {
        const { _id, ...updates } = action.payload;
        if (state.allIds.includes(_id)) {
          state.byId = Object.fromEntries(
            Object.entries(state.byId).map(([entityId, entity]) =>
              entityId === _id ? [entityId, { ...entity, ...updates }] : [entityId, entity]
            )
          );
        }
      });
  },
});

export const { setStatusFilter, clearStatusFilters, clearError } = propertyStatusSlice.actions;

export const selectPropertyStatusById = (state, id) =>
  Object.values(state.propertyStatus.byId).find(status => status?._id === id);

export const selectAllPropertyStatuses = state => Object.values(state.propertyStatus.byId);

export const selectFilteredPropertyStatuses = state => {
  const allStatuses = selectAllPropertyStatuses(state);
  const filters = state.propertyStatus.filters;

  return allStatuses.filter(status => {
    if (filters.furnishing !== 'all' && status.furnishing !== filters.furnishing) return false;
    if (filters.occupancy !== 'all' && status.occupancyStatus !== filters.occupancy) return false;
    if (filters.market !== 'all' && status.marketAvailability !== filters.market) return false;
    if (filters.construction !== 'all' && status.constructionStage !== filters.construction)
      return false;
    if (filters.legal !== 'all' && status.legalStatus !== filters.legal) return false;
    return true;
  });
};

export const selectPropertyStatusLoading = state => state.propertyStatus.loading;
export const selectPropertyStatusError = state => state.propertyStatus.error;
export const selectStatusFilters = state => state.propertyStatus.filters;

export const selectPropertiesByStatus = (state, field, value) =>
  selectAllPropertyStatuses(state).filter(status => {
    if (field === 'furnishing') return status.furnishing === value;
    if (field === 'occupancyStatus') return status.occupancyStatus === value;
    if (field === 'marketAvailability') return status.marketAvailability === value;
    if (field === 'constructionStage') return status.constructionStage === value;
    if (field === 'legalStatus') return status.legalStatus === value;
    return false;
  });

export default propertyStatusSlice.reducer;
