/**
 * Department Redux Slice
 * State management for department data with real API integration
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  departmentService,
  DepartmentData,
  KPI,
  DateRange,
  Trend,
  DepartmentSummary,
} from '../../services/departmentService';

/**
 * Async Thunks
 */

/**
 * Fetch all available departments
 */
export const fetchAllDepartments = createAsyncThunk(
  'departments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      console.log('[Redux] Fetching all departments...');
      const departments = await departmentService.getAllDepartments();
      return departments;
    } catch (error: any) {
      console.error('[Redux] Error fetching departments:', error);
      return rejectWithValue(
        error.error || error.message || 'Failed to fetch departments'
      );
    }
  }
);

/**
 * Fetch department data (KPIs, trends, summary)
 */
export const fetchDepartmentData = createAsyncThunk(
  'departments/fetchData',
  async (code: string, { rejectWithValue }) => {
    try {
      console.log(`[Redux] Fetching data for department: ${code}`);
      const data = await departmentService.getDepartmentData(code);
      return { [code]: data };
    } catch (error: any) {
      console.error('[Redux] Error fetching department data:', error);
      return rejectWithValue(
        error.error || error.message || 'Failed to fetch department data'
      );
    }
  }
);

/**
 * Fetch KPIs for a department
 */
export const fetchDepartmentKPIs = createAsyncThunk(
  'departments/fetchKPIs',
  async (
    { code, dateRange }: { code: string; dateRange?: DateRange },
    { rejectWithValue }
  ) => {
    try {
      console.log(`[Redux] Fetching KPIs for department: ${code}`);
      const kpis = await departmentService.getDepartmentKPIs(code, dateRange);
      return { code, kpis };
    } catch (error: any) {
      console.error('[Redux] Error fetching KPIs:', error);
      return rejectWithValue(
        error.error || error.message || 'Failed to fetch KPIs'
      );
    }
  }
);

/**
 * Fetch trends for a department
 */
export const fetchDepartmentTrends = createAsyncThunk(
  'departments/fetchTrends',
  async (
    {
      code,
      timeframe = 'monthly',
    }: { code: string; timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly' },
    { rejectWithValue }
  ) => {
    try {
      console.log(`[Redux] Fetching trends for department: ${code}`);
      const trends = await departmentService.getDepartmentTrends(code, timeframe);
      return { code, trends };
    } catch (error: any) {
      console.error('[Redux] Error fetching trends:', error);
      return rejectWithValue(
        error.error || error.message || 'Failed to fetch trends'
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
      console.log(`[Redux] Fetching summary for department: ${code}`);
      const summary = await departmentService.getDepartmentSummary(code);
      return { code, summary };
    } catch (error: any) {
      console.error('[Redux] Error fetching summary:', error);
      return rejectWithValue(
        error.error || error.message || 'Failed to fetch summary'
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
    clearAllErrors: (state) => {
      state.error = {
        departments: null,
        data: null,
        kpis: null,
        trends: null,
        summary: null,
      };
    },

    // Clear all department data
    clearDepartmentData: (state) => {
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

  extraReducers: (builder) => {
    // Fetch all departments
    builder
      .addCase(fetchAllDepartments.pending, (state) => {
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
      .addCase(fetchDepartmentData.pending, (state) => {
        state.loading.data = true;
        state.error.data = null;
      })
      .addCase(fetchDepartmentData.fulfilled, (state, action) => {
        state.loading.data = false;
        state.departmentData = { ...state.departmentData, ...action.payload };
        const code = Object.keys(action.payload)[0];
        state.lastUpdated.data[code] = Date.now();
      })
      .addCase(fetchDepartmentData.rejected, (state, action) => {
        state.loading.data = false;
        state.error.data = action.payload as string;
      });

    // Fetch KPIs
    builder
      .addCase(fetchDepartmentKPIs.pending, (state) => {
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
      .addCase(fetchDepartmentTrends.pending, (state) => {
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
      .addCase(fetchDepartmentSummary.pending, (state) => {
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
export const selectDepartments = (state: any) => state.departments.departments;
export const selectDepartmentData = (state: any) => state.departments.departmentData;
export const selectDepartmentKPIs = (state: any) => state.departments.kpis;
export const selectDepartmentTrends = (state: any) => state.departments.trends;
export const selectDepartmentSummaries = (state: any) => state.departments.summaries;
export const selectDepartmentLoading = (state: any) => state.departments.loading;
export const selectDepartmentError = (state: any) => state.departments.error;
export const selectSelectedDepartment = (state: any) =>
  state.departments.selectedDepartment;

export default departmentSlice.reducer;
