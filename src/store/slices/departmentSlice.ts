/**
 * Department Redux Slice
 * State management for department data with optimized API integration
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  DepartmentData,
  KPI,
  DateRange,
  Trend,
  DepartmentSummary,
} from '../../services/departmentService';
import { apiIntegration } from '../../services/apiIntegration';

/**
 * Async Thunks
 */

/**
 * Fetch all available departments (with caching and dedup)
 */
export const fetchAllDepartments = createAsyncThunk(
  'departments/fetchAll',
  async (forceRefresh: boolean = false, { rejectWithValue }) => {
    try {
      console.warn('[Redux] Fetching all departments (optimized)...');
      const departments = await apiIntegration.getDepartments(forceRefresh);
      return departments;
    } catch (error: unknown) {
      console.error('[Redux] Error fetching departments:', error);
      const e = error as { error?: string; message?: string };
      return rejectWithValue(e.error || e.message || 'Failed to fetch departments');
    }
  }
);

/**
 * Fetch department data (KPIs, trends, summary) with optimization
 */
export const fetchDepartmentData = createAsyncThunk(
  'departments/fetchData',
  async ({ code, forceRefresh }: { code: string; forceRefresh?: boolean }, { rejectWithValue }) => {
    try {
      console.warn(`[Redux] Fetching data for department: ${code} (optimized)...`);
      const data = await apiIntegration.getDepartmentData(code, forceRefresh);
      return { [code]: data };
    } catch (error: unknown) {
      console.error('[Redux] Error fetching department data:', error);
      const e = error as { error?: string; message?: string };
      return rejectWithValue(e.error || e.message || 'Failed to fetch department data');
    }
  }
);

/**
 * Fetch KPIs for a department (with pagination and caching)
 */
export const fetchDepartmentKPIs = createAsyncThunk(
  'departments/fetchKPIs',
  async (
    {
      code,
      dateRange: _dateRange,
      page = 1,
      pageSize = 20,
      forceRefresh: _forceRefresh,
    }: {
      code: string;
      dateRange?: DateRange;
      page?: number;
      pageSize?: number;
      forceRefresh?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      console.warn(`[Redux] Fetching KPIs for department: ${code} (optimized, page ${page})...`);
      const response = await apiIntegration.getDepartmentKPIs(code, {
        page,
        pageSize,
      });
      return { code, kpis: response.data, pagination: response.pagination };
    } catch (error: unknown) {
      console.error('[Redux] Error fetching KPIs:', error);
      const e = error as { error?: string; message?: string };
      return rejectWithValue(e.error || e.message || 'Failed to fetch KPIs');
    }
  }
);

/**
 * Fetch trends for a department (with pagination and caching)
 */
export const fetchDepartmentTrends = createAsyncThunk(
  'departments/fetchTrends',
  async (
    {
      code,
      timeframe = 'monthly',
      page = 1,
      pageSize = 50,
      forceRefresh: _forceRefresh,
    }: {
      code: string;
      timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly';
      page?: number;
      pageSize?: number;
      forceRefresh?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      console.warn(
        `[Redux] Fetching trends for department: ${code}, timeframe: ${timeframe} (optimized)...`
      );
      const response = await apiIntegration.getDepartmentTrends(code, timeframe, {
        page,
        pageSize,
      });
      return {
        code,
        trends: response.data,
        timeframe,
        pagination: response.pagination,
      };
    } catch (error: unknown) {
      console.error('[Redux] Error fetching trends:', error);
      return rejectWithValue(
        (error as { error?: string; message?: string }).error ||
          (error as { error?: string; message?: string }).message ||
          'Failed to fetch trends'
      );
    }
  }
);

/**
 * Fetch summary for a department
 */
export const fetchDepartmentSummary = createAsyncThunk(
  'departments/fetchSummary',
  async (code: string, { rejectWithValue }) => {
    try {
      console.warn(`[Redux] Fetching summary for department: ${code} (optimized)...`);
      const summary = await apiIntegration.getDepartmentData(code).then(data => data?.summary);
      return { code, summary };
    } catch (error: unknown) {
      console.error('[Redux] Error fetching summary:', error);
      return rejectWithValue(
        (error as { error?: string; message?: string }).error ||
          (error as { error?: string; message?: string }).message ||
          'Failed to fetch summary'
      );
    }
  }
);

/**
 * State Interface
 */
export interface DepartmentState {
  // List of available departments
  departments: Array<{ code: string; name: string }>;

  // Department data by code (includes KPIs, trends, summary)
  departmentData: Record<string, DepartmentData>;

  // KPIs by department code
  kpis: Record<string, KPI[]>;

  // Trends by department code
  trends: Record<string, Trend[]>;

  // Summaries by department code
  summaries: Record<string, DepartmentSummary>;

  // Loading states for different operations
  loading: {
    departments: boolean;
    data: boolean;
    kpis: boolean;
    trends: boolean;
    summary: boolean;
  };

  // Error states
  error: {
    departments: string | null;
    data: string | null;
    kpis: string | null;
    trends: string | null;
    summary: string | null;
  };

  // Last updated timestamps
  lastUpdated: {
    departments: number | null;
    data: Record<string, number>;
    kpis: Record<string, number>;
    trends: Record<string, number>;
  };

  // Currently selected department
  selectedDepartment: string | null;
}

/**
 * Initial State
 */
const initialState: DepartmentState = {
  departments: [],
  departmentData: {},
  kpis: {},
  trends: {},
  summaries: {},
  loading: {
    departments: false,
    data: false,
    kpis: false,
    trends: false,
    summary: false,
  },
  error: {
    departments: null,
    data: null,
    kpis: null,
    trends: null,
    summary: null,
  },
  lastUpdated: {
    departments: null,
    data: {},
    kpis: {},
    trends: {},
  },
  selectedDepartment: null,
};

/**
 * Department Slice
 */
const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    // Clear specific error
    clearError: (state, action: PayloadAction<keyof DepartmentState['error']>) => {
      state.error[action.payload] = null;
    },

    // Clear all errors
    clearAllErrors: state => {
      state.error = {
        departments: null,
        data: null,
        kpis: null,
        trends: null,
        summary: null,
      };
    },

    // Clear all department data
    clearDepartmentData: state => {
      state.departmentData = {};
      state.kpis = {};
      state.trends = {};
      state.summaries = {};
    },

    // Set selected department
    setSelectedDepartment: (state, action: PayloadAction<string | null>) => {
      state.selectedDepartment = action.payload;
    },

    // Manually set department data (for testing or custom updates)
    setDepartmentData: (state, action: PayloadAction<DepartmentData>) => {
      state.departmentData[action.payload.code] = action.payload;
    },
  },

  extraReducers: builder => {
    // Fetch all departments
    builder
      .addCase(fetchAllDepartments.pending, state => {
        state.loading.departments = true;
        state.error.departments = null;
      })
      .addCase(fetchAllDepartments.fulfilled, (state, action) => {
        state.loading.departments = false;
        state.departments = action.payload;
        state.lastUpdated.departments = Date.now();
      })
      .addCase(fetchAllDepartments.rejected, (state, action) => {
        state.loading.departments = false;
        state.error.departments = action.payload as string;
      });

    // Fetch department data
    builder
      .addCase(fetchDepartmentData.pending, state => {
        state.loading.data = true;
        state.error.data = null;
      })
      .addCase(fetchDepartmentData.fulfilled, (state, action) => {
        state.loading.data = false;
        state.departmentData = { ...state.departmentData, ...action.payload };
        const code = Object.keys(action.payload)[0];
        // eslint-disable-next-line security/detect-object-injection
        state.lastUpdated.data[code] = Date.now();
      })
      .addCase(fetchDepartmentData.rejected, (state, action) => {
        state.loading.data = false;
        state.error.data = action.payload as string;
      });

    // Fetch KPIs
    builder
      .addCase(fetchDepartmentKPIs.pending, state => {
        state.loading.kpis = true;
        state.error.kpis = null;
      })
      .addCase(fetchDepartmentKPIs.fulfilled, (state, action) => {
        state.loading.kpis = false;
        state.kpis[action.payload.code] = action.payload.kpis;
        state.lastUpdated.kpis[action.payload.code] = Date.now();
      })
      .addCase(fetchDepartmentKPIs.rejected, (state, action) => {
        state.loading.kpis = false;
        state.error.kpis = action.payload as string;
      });

    // Fetch trends
    builder
      .addCase(fetchDepartmentTrends.pending, state => {
        state.loading.trends = true;
        state.error.trends = null;
      })
      .addCase(fetchDepartmentTrends.fulfilled, (state, action) => {
        state.loading.trends = false;
        state.trends[action.payload.code] = action.payload.trends;
        state.lastUpdated.trends[action.payload.code] = Date.now();
      })
      .addCase(fetchDepartmentTrends.rejected, (state, action) => {
        state.loading.trends = false;
        state.error.trends = action.payload as string;
      });

    // Fetch summary
    builder
      .addCase(fetchDepartmentSummary.pending, state => {
        state.loading.summary = true;
        state.error.summary = null;
      })
      .addCase(fetchDepartmentSummary.fulfilled, (state, action) => {
        state.loading.summary = false;
        state.summaries[action.payload.code] = action.payload.summary;
      })
      .addCase(fetchDepartmentSummary.rejected, (state, action) => {
        state.loading.summary = false;
        state.error.summary = action.payload as string;
      });
  },
});

/**
 * Actions
 */
export const {
  clearError,
  clearAllErrors,
  clearDepartmentData,
  setSelectedDepartment,
  setDepartmentData,
} = departmentSlice.actions;

/**
 * Selectors
 */
export const selectDepartments = (state: { departments: { departments: unknown[] } }) =>
  state.departments.departments;
export const selectDepartmentData = (state: {
  departments: { departmentData: Record<string, unknown> };
}) => state.departments.departmentData;
export const selectDepartmentKPIs = (state: { departments: { kpis: Record<string, unknown[]> } }) =>
  state.departments.kpis;
export const selectDepartmentTrends = (state: {
  departments: { trends: Record<string, unknown[]> };
}) => state.departments.trends;
export const selectDepartmentSummaries = (state: {
  departments: { summaries: Record<string, unknown> };
}) => state.departments.summaries;
export const selectDepartmentLoading = (state: { departments: { loading: boolean } }) =>
  state.departments.loading;
export const selectDepartmentError = (state: { departments: { error: string | null } }) =>
  state.departments.error;
export const selectSelectedDepartment = (state: {
  departments: { selectedDepartment: string | null };
}) => state.departments.selectedDepartment;

export default departmentSlice.reducer;
