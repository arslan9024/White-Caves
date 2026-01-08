import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  activeTabs: {},
  filters: {},
  metrics: {
    buyer: null,
    seller: null,
    landlord: null,
    tenant: null,
    leasingAgent: null,
    salesAgent: null,
    owner: null,
  },
  loading: {
    metrics: false,
    properties: false,
    leads: false,
  },
  error: null,
  favorites: [],
  recentlyViewed: [],
  notifications: {
    unreadCount: 0,
    items: [],
  },
  pipelineStages: {
    leasing: ['Lead', 'Qualified', 'Viewing', 'Negotiation', 'Documentation', 'Closing'],
    sales: ['Lead', 'Qualified', 'Viewing', 'Negotiation', 'Due Diligence', 'Documentation', 'Closing'],
  },
};

export const fetchDashboardMetrics = createAsyncThunk(
  'dashboard/fetchMetrics',
  async (role, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/dashboard/${role}/metrics`);
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      return { role, data: await response.json() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      const { key, tab } = action.payload;
      state.activeTabs[key] = tab;
    },
    setFilter: (state, action) => {
      const { key, filter } = action.payload;
      state.filters[key] = { ...state.filters[key], ...filter };
    },
    clearFilter: (state, action) => {
      const { key } = action.payload;
      delete state.filters[key];
    },
    setMetrics: (state, action) => {
      const { role, data } = action.payload;
      state.metrics[role] = data;
    },
    addToFavorites: (state, action) => {
      const property = action.payload;
      if (!state.favorites.find(f => f.id === property.id)) {
        state.favorites.push(property);
      }
    },
    removeFromFavorites: (state, action) => {
      const propertyId = action.payload;
      state.favorites = state.favorites.filter(f => f.id !== propertyId);
    },
    addToRecentlyViewed: (state, action) => {
      const property = action.payload;
      state.recentlyViewed = [
        property,
        ...state.recentlyViewed.filter(p => p.id !== property.id)
      ].slice(0, 10);
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    markNotificationRead: (state, action) => {
      const id = action.payload;
      const notification = state.notifications.items.find(n => n.id === id);
      if (notification) {
        notification.read = true;
        state.notifications.unreadCount = Math.max(0, state.notifications.unreadCount - 1);
      }
    },
    clearAllNotifications: (state) => {
      state.notifications.items = [];
      state.notifications.unreadCount = 0;
    },
    setLoading: (state, action) => {
      const { key, loading } = action.payload;
      state.loading[key] = loading;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.loading.metrics = true;
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        const { role, data } = action.payload;
        state.metrics[role] = data;
        state.loading.metrics = false;
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.loading.metrics = false;
        state.error = action.payload;
      });
  },
});

export const {
  setActiveTab,
  setFilter,
  clearFilter,
  setMetrics,
  addToFavorites,
  removeFromFavorites,
  addToRecentlyViewed,
  setNotifications,
  markNotificationRead,
  clearAllNotifications,
  setLoading,
  setError,
  clearError,
} = dashboardSlice.actions;

export const selectActiveTab = (key) => (state) => state.dashboard?.activeTabs?.[key];
export const selectFilter = (key) => (state) => state.dashboard?.filters?.[key];
export const selectMetrics = (role) => (state) => state.dashboard?.metrics?.[role];
export const selectFavorites = (state) => state.dashboard?.favorites || [];
export const selectRecentlyViewed = (state) => state.dashboard?.recentlyViewed || [];
export const selectNotifications = (state) => state.dashboard?.notifications;
export const selectIsLoading = (key) => (state) => state.dashboard?.loading?.[key];

export default dashboardSlice.reducer;
