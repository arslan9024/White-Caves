/**
 * Leads Redux Slice
 * Manages lead state for CRM (Clara - Lead Manager)
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Lead, LeadsState, LeadStatus, LeadSource } from '../../types';
import apiClient from '../../services/apiClient';

const initialState: LeadsState = {
  items: [],
  currentLead: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    currentPage: 1,
    pageSize: 20,
    total: 0,
  },
};

// Async thunks
export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (
    { page = 1, pageSize = 20, filters = {} }: { page?: number; pageSize?: number; filters?: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get<any>('/api/leads', {
        params: { page, pageSize, ...filters },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leads');
    }
  }
);

export const fetchLeadById = createAsyncThunk(
  'leads/fetchLeadById',
  async (leadId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<{ data: Lead }>(`/api/leads/${leadId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lead');
    }
  }
);

export const createLead = createAsyncThunk(
  'leads/createLead',
  async (leadData: Partial<Lead>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{ data: Lead }>('/api/leads', leadData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create lead');
    }
  }
);

export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ id, data }: { id: string; data: Partial<Lead> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch<{ data: Lead }>(`/api/leads/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update lead');
    }
  }
);

export const updateLeadStatus = createAsyncThunk(
  'leads/updateLeadStatus',
  async ({ id, status }: { id: string; status: LeadStatus }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch<{ data: Lead }>(`/api/leads/${id}`, { status });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const logActivity = createAsyncThunk(
  'leads/logActivity',
  async (
    { leadId, type, description }: { leadId: string; type: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post(`/api/leads/${leadId}/activities`, {
        type,
        description,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to log activity');
    }
  }
);

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<any>) => {
      state.filters = action.payload;
      state.pagination.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch leads
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch lead by ID
    builder
      .addCase(fetchLeadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLead = action.payload;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create lead
    builder
      .addCase(createLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update lead
    builder
      .addCase(updateLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentLead?.id === action.payload.id) {
          state.currentLead = action.payload;
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update lead status
    builder
      .addCase(updateLeadStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLeadStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateLeadStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, setCurrentPage } = leadsSlice.actions;
export default leadsSlice.reducer;
