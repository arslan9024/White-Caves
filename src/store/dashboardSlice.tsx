import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  message: string;
  read: boolean;
  [key: string]: any;
}

interface NotificationState {
  unreadCount: number;
  items: Notification[];
}

interface LoadingState {
  metrics: boolean;
  properties: boolean;
  leads: boolean;
  [key: string]: boolean;
}

interface Metrics {
  buyer: any | null;
  seller: any | null;
  landlord: any | null;
  tenant: any | null;
  leasingAgent: any | null;
  salesAgent: any | null;
  owner: any | null;
  [key: string]: any;
}

interface DashboardState {
  activeTabs: { [key: string]: string };
  filters: { [key: string]: any };
  metrics: Metrics;
  loading: LoadingState;
  error: string | null;
  favorites: any[];
  recentlyViewed: any[];
  notifications: NotificationState;
  pipelineStages: {
    leasing: string[];
    sales: string[];
  };
}

const initialState: DashboardState = {
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

interface FetchMetricsPayload {
  role: string;
  data: any;
}

export const fetchDashboardMetrics = createAsyncThunk<
  FetchMetricsPayload,
  string,
  { rejectValue: string }
>(
  'dashboard/fetchMetrics',
  async (role, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/dashboard/${role}/metrics`);
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      return { role, data: await response.json() };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch metrics');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<{ key: string; tab: string }>) => {
      const { key, tab } = action.payload;
      state.activeTabs[key] = tab;
    },
    setFilter: (state, action: PayloadAction<{ key: string; filter: any }>) => {
      const { key, filter } = action.payload;
      state.filters[key] = { ...state.filters[key], ...filter };
    },
    clearFilter: (state, action: PayloadAction<{ key: string }>) => {
      const { key } = action.payload;
      delete state.filters[key];
    },
    setMetrics: (state, action: PayloadAction<{ role: string; data: any }>) => {
      const { role, data } = action.payload;
      state.metrics[role] = data;
    },
    addToFavorites: (state, action: PayloadAction<any>) => {
      const property = action.payload;
      if (!state.favorites.find((f: any) => f.id === property.id)) {
        state.favorites.push(property);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string | number>) => {
      const propertyId = action.payload;
      state.favorites = state.favorites.filter((f: any) => f.id !== propertyId);
    },
    addToRecentlyViewed: (state, action: PayloadAction<any>) => {
      const property = action.payload;
      state.recentlyViewed = [
        property,
        ...state.recentlyViewed.filter((p: any) => p.id !== property.id)
      ].slice(0, 10);
    },
    setNotifications: (state, action: PayloadAction<NotificationState>) => {
      state.notifications = action.payload;
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
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
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      const { key, loading } = action.payload;
      state.loading[key] = loading;
    },
    setError: (state, action: PayloadAction<string | null>) => {
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
        state.error = action.payload || 'Unknown error';
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

export const selectActiveTab = (key: string) => (state: any) => state.dashboard?.activeTabs?.[key];
export const selectFilter = (key: string) => (state: any) => state.dashboard?.filters?.[key];
export const selectMetrics = (role: string) => (state: any) => state.dashboard?.metrics?.[role];
export const selectFavorites = (state: any) => state.dashboard?.favorites || [];
export const selectRecentlyViewed = (state: any) => state.dashboard?.recentlyViewed || [];
export const selectNotifications = (state: any) => state.dashboard?.notifications;
export const selectIsLoading = (key: string) => (state: any) => state.dashboard?.loading?.[key];

export default dashboardSlice.reducer;
