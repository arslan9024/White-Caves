import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { logout } from './authSlice';
import { authFetch } from '../utils/authFetch';

export interface FavoriteItem {
  id: string;
  title: string;
  location: string;
  price: string;
  image?: string;
}

export interface RecentlyViewedItem {
  id: string;
  title: string;
  location: string;
  price: string;
  image?: string;
  viewedAt: string;
}

interface Notification {
  id: string;
  message: string;
  read: boolean;
  type?: string;
  timestamp?: string;
  title?: string;
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
  buyer: Record<string, unknown> | null;
  seller: Record<string, unknown> | null;
  landlord: Record<string, unknown> | null;
  tenant: Record<string, unknown> | null;
  leasingAgent: Record<string, unknown> | null;
  salesAgent: Record<string, unknown> | null;
  owner: Record<string, unknown> | null;
  [key: string]: Record<string, unknown> | null | undefined;
}

interface DashboardState {
  activeTabs: { [key: string]: string };
  filters: { [key: string]: unknown };
  metrics: Metrics;
  loading: LoadingState;
  error: string | null;
  favorites: FavoriteItem[];
  recentlyViewed: RecentlyViewedItem[];
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
  data: Record<string, unknown>;
}

export const fetchDashboardMetrics = createAsyncThunk<
  FetchMetricsPayload,
  string,
  { rejectValue: string }
>(
  'dashboard/fetchMetrics',
  async (role, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/api/dashboard/${role}/metrics`);
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      return { role, data: await response.json() };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch metrics';
      return rejectWithValue(message);
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
    setFilter: (state, action: PayloadAction<{ key: string; filter: Record<string, unknown> }>) => {
      const { key, filter } = action.payload;
      state.filters[key] = { ...((state.filters[key] as Record<string, unknown>) || {}), ...filter };
    },
    clearFilter: (state, action: PayloadAction<{ key: string }>) => {
      const { key } = action.payload;
      delete state.filters[key];
    },
    setMetrics: (state, action: PayloadAction<{ role: string; data: Record<string, unknown> }>) => {
      const { role, data } = action.payload;
      state.metrics[role] = data;
    },
    addToFavorites: (state, action: PayloadAction<FavoriteItem>) => {
      const property = action.payload;
      if (!state.favorites.find((f) => f.id === property.id)) {
        state.favorites.push(property);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      const propertyId = action.payload;
      state.favorites = state.favorites.filter((f) => f.id !== propertyId);
    },
    addToRecentlyViewed: (state, action: PayloadAction<RecentlyViewedItem>) => {
      const property = action.payload;
      state.recentlyViewed = [
        property,
        ...state.recentlyViewed.filter((p) => p.id !== property.id)
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
      })
      .addCase(logout, () => initialState);
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

export const selectFavorites = createSelector(
  (state: { dashboard?: DashboardState }) => state.dashboard?.favorites,
  (favorites): FavoriteItem[] => favorites || []
);
export const selectNotifications = (state: { dashboard?: DashboardState }) => state.dashboard?.notifications;

// NOTE: Unused selectors removed in Round 124 dead-code cleanup.
// Re-add if needed: selectActiveTab, selectFilter, selectMetrics, selectRecentlyViewed, selectIsLoading

export default dashboardSlice.reducer;
