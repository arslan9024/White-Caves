/**
 * Dashboard Redux Slice
 * Manages executive dashboard state (Zoe - Executive)
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardKPIs } from '../../types';
import apiClient from '../../services/apiClient';

interface DashboardState {
  kpis: DashboardKPIs | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  autoRefreshInterval: number; // ms
}

const initialState: DashboardState = {
  kpis: null,
  loading: false,
  error: null,
  lastUpdated: null,
  autoRefreshInterval: 30000, // 30 seconds
};

export const fetchDashboardKPIs = createAsyncThunk(
  'dashboard/fetchKPIs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{ data: DashboardKPIs }>('/api/dashboard/kpis');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch KPIs');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setAutoRefreshInterval: (state, action) => {
      state.autoRefreshInterval = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardKPIs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardKPIs.fulfilled, (state, action) => {
        state.loading = false;
        state.kpis = action.payload;
        state.lastUpdated = new Date();
      })
      .addCase(fetchDashboardKPIs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAutoRefreshInterval } = dashboardSlice.actions;
export default dashboardSlice.reducer;
