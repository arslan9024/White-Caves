import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserKPI {
  userId: string;
  leadsToday: number;
  leadsThisWeek: number;
  closedDealsThisMonth: number;
  totalRevenue: number;
  conversionRate: number;
  averageDealSize: number;
  followUpsPending: number;
  timestamp: Date;
}

export interface AnalyticsState {
  realtimeKPIs: Record<string, UserKPI>;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  lastUpdate: Date | null;
  activeUsers: number;
  error: string | null;
}

const initialState: AnalyticsState = {
  realtimeKPIs: {},
  connectionStatus: 'disconnected',
  lastUpdate: null,
  activeUsers: 0,
  error: null,
};

export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setRealtimeKPIs: (state, action: PayloadAction<Record<string, UserKPI>>) => {
      state.realtimeKPIs = action.payload;
      state.lastUpdate = new Date();
      state.connectionStatus = 'connected';
    },
    updateUserKPI: (state, action: PayloadAction<{ userId: string; kpi: Partial<UserKPI> }>) => {
      const { userId, kpi } = action.payload;
      if (!state.realtimeKPIs[userId]) {
        state.realtimeKPIs[userId] = {
          userId,
          leadsToday: 0,
          leadsThisWeek: 0,
          closedDealsThisMonth: 0,
          totalRevenue: 0,
          conversionRate: 0,
          averageDealSize: 0,
          followUpsPending: 0,
          timestamp: new Date(),
        };
      }
      state.realtimeKPIs[userId] = { ...state.realtimeKPIs[userId], ...kpi };
      state.lastUpdate = new Date();
    },
    setConnectionStatus: (
      state,
      action: PayloadAction<'connected' | 'disconnected' | 'reconnecting'>
    ) => {
      state.connectionStatus = action.payload;
      if (action.payload === 'connected') {
        state.error = null;
      }
    },
    setActiveUsers: (state, action: PayloadAction<number>) => {
      state.activeUsers = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearKPIs: state => {
      state.realtimeKPIs = {};
      state.lastUpdate = null;
    },
  },
});

export const {
  setRealtimeKPIs,
  updateUserKPI,
  setConnectionStatus,
  setActiveUsers,
  setError,
  clearKPIs,
} = analyticsSlice.actions;

// Selectors
export const selectRealtimeKPIs = (state: { analytics: AnalyticsState }): Record<string, UserKPI> =>
  state.analytics.realtimeKPIs;

export const selectConnectionStatus = (state: {
  analytics: AnalyticsState;
}): 'connected' | 'disconnected' | 'reconnecting' => state.analytics.connectionStatus;

export const selectLastUpdate = (state: { analytics: AnalyticsState }): Date | null =>
  state.analytics.lastUpdate;

export const selectActiveUsers = (state: { analytics: AnalyticsState }): number =>
  state.analytics.activeUsers;

export const selectAnalyticsError = (state: { analytics: AnalyticsState }): string | null =>
  state.analytics.error;

export const selectUserKPI =
  (userId: string) =>
  (state: { analytics: AnalyticsState }): UserKPI | undefined =>
    state.analytics.realtimeKPIs[userId];

export default analyticsSlice.reducer;
