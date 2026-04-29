import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTenancyDeals = createAsyncThunk(
  'deals/fetchTenancy',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`/api/deals/tenancy?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch tenancy deals');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSalesDeals = createAsyncThunk(
  'deals/fetchSales',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`/api/deals/sales?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch sales deals');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDealByNumber = createAsyncThunk(
  'deals/fetchByNumber',
  async ({ dealNumber, dealType }, { rejectWithValue }) => {
    try {
      const endpoint = dealType === 'tenancy' ? 'tenancy' : 'sales';
      const response = await fetch(`/api/deals/${endpoint}/${dealNumber}`);
      if (!response.ok) throw new Error('Deal not found');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDealStatus = createAsyncThunk(
  'deals/updateStatus',
  async ({ dealNumber, dealType, status, notes, actor }, { rejectWithValue }) => {
    try {
      const endpoint = dealType === 'tenancy' ? 'tenancy' : 'sales';
      const response = await fetch(`/api/deals/${endpoint}/${dealNumber}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes, actor })
      });
      if (!response.ok) throw new Error('Failed to update status');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const seedDemoData = createAsyncThunk(
  'deals/seedDemo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/deals/demo/seed', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to seed demo data');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDealStats = createAsyncThunk(
  'deals/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/deals/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  tenancyDeals: [],
  salesDeals: [],
  selectedDeal: null,
  stats: null,
  demoSeeded: false,
  loading: false,
  error: null,
  pagination: {
    tenancy: { page: 1, limit: 20, total: 0 },
    sales: { page: 1, limit: 20, total: 0 }
  }
};

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    setSelectedDeal: (state, action) => {
      state.selectedDeal = action.payload;
    },
    clearSelectedDeal: (state) => {
      state.selectedDeal = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenancyDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenancyDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.tenancyDeals = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination.tenancy = action.payload.pagination;
        }
      })
      .addCase(fetchTenancyDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSalesDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.salesDeals = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination.sales = action.payload.pagination;
        }
      })
      .addCase(fetchSalesDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDealByNumber.fulfilled, (state, action) => {
        state.selectedDeal = action.payload.data;
      })
      .addCase(updateDealStatus.fulfilled, (state, action) => {
        const updatedDeal = action.payload.data;
        if (updatedDeal) {
          const tenancyIndex = state.tenancyDeals.findIndex(d => d.dealNumber === updatedDeal.dealNumber);
          if (tenancyIndex !== -1) {
            state.tenancyDeals[tenancyIndex] = updatedDeal;
          }
          const salesIndex = state.salesDeals.findIndex(d => d.dealNumber === updatedDeal.dealNumber);
          if (salesIndex !== -1) {
            state.salesDeals[salesIndex] = updatedDeal;
          }
          if (state.selectedDeal?.dealNumber === updatedDeal.dealNumber) {
            state.selectedDeal = updatedDeal;
          }
        }
      })
      .addCase(seedDemoData.fulfilled, (state) => {
        state.demoSeeded = true;
      })
      .addCase(fetchDealStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      });
  }
});

export const { setSelectedDeal, clearSelectedDeal, clearError } = dealsSlice.actions;
export default dealsSlice.reducer;
