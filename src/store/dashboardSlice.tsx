import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { logout } from './authSlice';
import { authFetch } from '../utils/authFetch';
import * as favoritesApi from '../services/favoritesApi';

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
  favoriteIds: string[];
  favoritesLoading: boolean;
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
  favoriteIds: [],
  favoritesLoading: false,
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

// ─── Favorites Async Thunks (API-backed) ─────────────────────────────────────

/** Fetch all favorite IDs (lightweight — for heart toggle state) */
export const fetchFavoriteIdsThunk = createAsyncThunk<
  string[],
  void,
  { rejectValue: string }
>(
  'dashboard/fetchFavoriteIds',
  async (_, { rejectWithValue }) => {
    try {
      return await favoritesApi.fetchFavoriteIds();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch favorites';
      return rejectWithValue(message);
    }
  }
);

/** Fetch full favorites with property data (for FavoriteListings page) */
export const fetchFavoritesThunk = createAsyncThunk<
  favoritesApi.PaginatedFavorites,
  { page?: number; pageSize?: number } | void,
  { rejectValue: string }
>(
  'dashboard/fetchFavorites',
  async (params, { rejectWithValue }) => {
    try {
      const page = (params && 'page' in params) ? params.page : 1;
      const pageSize = (params && 'pageSize' in params) ? params.pageSize : 20;
      return await favoritesApi.fetchFavorites(page, pageSize);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch favorites';
      return rejectWithValue(message);
    }
  }
);

/** Add a property to favorites via API */
export const addFavoriteThunk = createAsyncThunk<
  { propertyId: string; item: FavoriteItem },
  FavoriteItem,
  { rejectValue: string }
>(
  'dashboard/addFavorite',
  async (item, { rejectWithValue }) => {
    try {
      await favoritesApi.addFavorite(item.id);
      return { propertyId: item.id, item };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to add favorite';
      return rejectWithValue(message);
    }
  }
);

/** Remove a property from favorites via API */
export const removeFavoriteThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'dashboard/removeFavorite',
  async (propertyId, { rejectWithValue }) => {
    try {
      await favoritesApi.removeFavorite(propertyId);
      return propertyId;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to remove favorite';
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
      // ── Favorites thunks ─────────────────────────────────────────────
      .addCase(fetchFavoriteIdsThunk.pending, (state) => {
        state.favoritesLoading = true;
      })
      .addCase(fetchFavoriteIdsThunk.fulfilled, (state, action) => {
        state.favoriteIds = action.payload;
        state.favoritesLoading = false;
      })
      .addCase(fetchFavoriteIdsThunk.rejected, (state) => {
        state.favoritesLoading = false;
      })
      .addCase(fetchFavoritesThunk.pending, (state) => {
        state.favoritesLoading = true;
      })
      .addCase(fetchFavoritesThunk.fulfilled, (state, action) => {
        state.favorites = action.payload.data.map((rec) => ({
          id: rec.propertyId,
          title: rec.property?.title ?? '',
          location: rec.property?.location ?? '',
          price: String(rec.property?.price ?? ''),
          image: rec.property?.images?.[0],
        }));
        state.favoriteIds = action.payload.data.map((rec) => rec.propertyId);
        state.favoritesLoading = false;
      })
      .addCase(fetchFavoritesThunk.rejected, (state) => {
        state.favoritesLoading = false;
      })
      .addCase(addFavoriteThunk.fulfilled, (state, action) => {
        const { propertyId, item } = action.payload;
        if (!state.favorites.find((f) => f.id === propertyId)) {
          state.favorites.push(item);
        }
        if (!state.favoriteIds.includes(propertyId)) {
          state.favoriteIds.push(propertyId);
        }
      })
      .addCase(removeFavoriteThunk.fulfilled, (state, action) => {
        const propertyId = action.payload;
        state.favorites = state.favorites.filter((f) => f.id !== propertyId);
        state.favoriteIds = state.favoriteIds.filter((id) => id !== propertyId);
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
export const selectFavoriteIds = createSelector(
  (state: { dashboard?: DashboardState }) => state.dashboard?.favoriteIds,
  (ids): string[] => ids || []
);
export const selectFavoritesLoading = (state: { dashboard?: DashboardState }) =>
  state.dashboard?.favoritesLoading ?? false;
export const selectNotifications = (state: { dashboard?: DashboardState }) => state.dashboard?.notifications;

// NOTE: Unused selectors removed in Round 124 dead-code cleanup.
// Re-add if needed: selectActiveTab, selectFilter, selectMetrics, selectRecentlyViewed, selectIsLoading

export default dashboardSlice.reducer;
