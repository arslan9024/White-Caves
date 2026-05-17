import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authFetch } from '../../utils/authFetch';

// Async thunks for API calls
export const fetchLandlordStats = createAsyncThunk(
  'landlord/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/landlord/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLandlordProperties = createAsyncThunk(
  'landlord/fetchProperties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/landlord/properties');
      if (!response.ok) throw new Error('Failed to fetch properties');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLandlordMaintenance = createAsyncThunk(
  'landlord/fetchMaintenance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/landlord/maintenance');
      if (!response.ok) throw new Error('Failed to fetch maintenance');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLandlordFinances = createAsyncThunk(
  'landlord/fetchFinances',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/landlord/finances');
      if (!response.ok) throw new Error('Failed to fetch finances');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProperty = createAsyncThunk(
  'landlord/addProperty',
  async (propertyData, { rejectWithValue }) => {
    try {
      const response = await authFetch('/api/landlord/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      });
      if (!response.ok) throw new Error('Failed to add property');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMaintenance = createAsyncThunk(
  'landlord/updateMaintenance',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/landlord/maintenance/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update maintenance');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  stats: null,
  properties: [],
  maintenance: [],
  finances: null,
  loading: false,
  error: null,
  lastFetch: null,
  activeTab: 'overview',
  selectedProperty: null,
};

const landlordSlice = createSlice({
  name: 'landlord',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    selectProperty: (state, action) => {
      state.selectedProperty = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    // Optimistic updates
    optimisticAddProperty: (state, action) => {
      state.properties.push(action.payload);
    },
    optimisticUpdateMaintenance: (state, action) => {
      const request = state.maintenance.find(r => r.id === action.payload.id);
      if (request) {
        request.status = action.payload.status;
      }
    },
  },
  extraReducers: builder => {
    // Fetch Stats
    builder
      .addCase(fetchLandlordStats.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandlordStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.lastFetch = Date.now();
      })
      .addCase(fetchLandlordStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Properties
    builder
      .addCase(fetchLandlordProperties.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandlordProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties;
        state.lastFetch = Date.now();
      })
      .addCase(fetchLandlordProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Maintenance
    builder
      .addCase(fetchLandlordMaintenance.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandlordMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        state.maintenance = action.payload.requests;
        state.lastFetch = Date.now();
      })
      .addCase(fetchLandlordMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Finances
    builder
      .addCase(fetchLandlordFinances.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandlordFinances.fulfilled, (state, action) => {
        state.loading = false;
        state.finances = action.payload.finances;
        state.lastFetch = Date.now();
      })
      .addCase(fetchLandlordFinances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add Property
    builder
      .addCase(addProperty.fulfilled, (state, action) => {
        state.properties.push(action.payload);
        state.error = null;
      })
      .addCase(addProperty.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Update Maintenance
    builder
      .addCase(updateMaintenance.fulfilled, (state, action) => {
        const index = state.maintenance.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          // eslint-disable-next-line security/detect-object-injection
          state.maintenance[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMaintenance.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setActiveTab,
  selectProperty,
  clearError,
  optimisticAddProperty,
  optimisticUpdateMaintenance,
} = landlordSlice.actions;

export default landlordSlice.reducer;
