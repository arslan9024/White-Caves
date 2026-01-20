/**
 * Custom Hooks for Real API Integration
 * Provides easy access to API data and loading states throughout the app
 */

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useCallback } from 'react';
import {
  fetchAllDepartments,
  fetchDepartmentData,
  fetchDepartmentKPIs,
  fetchDepartmentTrends,
  fetchDepartmentSummary,
  selectDepartments,
  selectDepartmentData,
  selectDepartmentKPIs,
  selectDepartmentTrends,
  selectDepartmentSummaries,
  selectDepartmentLoading,
  selectDepartmentError,
  setSelectedDepartment,
  clearError,
} from '../store/slices/departmentSlice';
import { DateRange } from '../services/departmentService';

/**
 * Hook to fetch and manage all departments
 * Automatically fetches departments on first mount if not already loaded
 */
export const useDepartments = () => {
  const dispatch = useDispatch();
  const departments = useSelector(selectDepartments);
  const loading = useSelector((state: any) => selectDepartmentLoading(state).departments);
  const error = useSelector((state: any) => selectDepartmentError(state).departments);

  useEffect(() => {
    // Only fetch if we don't have departments yet
    if (departments.length === 0 && !loading) {
      console.log('[Hook] Fetching departments...');
      dispatch(fetchAllDepartments() as any);
    }
  }, [dispatch, departments.length, loading]);

  // Clear error callback
  const clearDepartmentError = useCallback(() => {
    dispatch(clearError('departments'));
  }, [dispatch]);

  return {
    departments,
    loading,
    error,
    clearError: clearDepartmentError,
  };
};

/**
 * Hook to fetch and manage department data (includes KPIs, trends, summary)
 * Automatically fetches data when department code changes
 */
export const useDepartmentData = (code: string | null) => {
  const dispatch = useDispatch();
  const departmentData = useSelector(selectDepartmentData);
  const data = code ? departmentData[code] : null;
  const loading = useSelector((state: any) => selectDepartmentLoading(state).data);
  const error = useSelector((state: any) => selectDepartmentError(state).data);

  useEffect(() => {
    // Fetch data when code changes and data not already loaded
    if (code && !data) {
      console.log(`[Hook] Fetching data for department: ${code}`);
      dispatch(fetchDepartmentData(code) as any);
    }
  }, [code, dispatch, data]);

  // Clear error callback
  const clearDataError = useCallback(() => {
    dispatch(clearError('data'));
  }, [dispatch]);

  return {
    data,
    loading,
    error,
    clearError: clearDataError,
    isLoaded: !!data,
  };
};

/**
 * Hook to fetch and manage department KPIs
 * Can optionally filter by date range
 */
export const useDepartmentKPIs = (
  code: string | null,
  dateRange?: DateRange
) => {
  const dispatch = useDispatch();
  const kpisMap = useSelector(selectDepartmentKPIs);
  const kpis = code ? kpisMap[code] || [] : [];
  const loading = useSelector((state: any) => selectDepartmentLoading(state).kpis);
  const error = useSelector((state: any) => selectDepartmentError(state).kpis);

  useEffect(() => {
    // Fetch KPIs when code changes
    if (code) {
      console.log(
        `[Hook] Fetching KPIs for department: ${code}`,
        dateRange ? ` (${dateRange.from} to ${dateRange.to})` : ''
      );
      dispatch(fetchDepartmentKPIs({ code, dateRange }) as any);
    }
  }, [code, dateRange, dispatch]);

  // Clear error callback
  const clearKPIError = useCallback(() => {
    dispatch(clearError('kpis'));
  }, [dispatch]);

  return {
    kpis,
    loading,
    error,
    clearError: clearKPIError,
    isEmpty: kpis.length === 0,
  };
};

/**
 * Hook to fetch and manage department trends
 * Supports different timeframes: daily, weekly, monthly, yearly
 */
export const useDepartmentTrends = (
  code: string | null,
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'
) => {
  const dispatch = useDispatch();
  const trendsMap = useSelector(selectDepartmentTrends);
  const trends = code ? trendsMap[code] || [] : [];
  const loading = useSelector((state: any) => selectDepartmentLoading(state).trends);
  const error = useSelector((state: any) => selectDepartmentError(state).trends);

  useEffect(() => {
    // Fetch trends when code or timeframe changes
    if (code) {
      console.log(
        `[Hook] Fetching trends for department: ${code}, timeframe: ${timeframe}`
      );
      dispatch(fetchDepartmentTrends({ code, timeframe }) as any);
    }
  }, [code, timeframe, dispatch]);

  // Clear error callback
  const clearTrendError = useCallback(() => {
    dispatch(clearError('trends'));
  }, [dispatch]);

  return {
    trends,
    loading,
    error,
    clearError: clearTrendError,
    isEmpty: trends.length === 0,
  };
};

/**
 * Hook to fetch and manage department summary
 */
export const useDepartmentSummary = (code: string | null) => {
  const dispatch = useDispatch();
  const summariesMap = useSelector(selectDepartmentSummaries);
  const summary = code ? summariesMap[code] : null;
  const loading = useSelector((state: any) => selectDepartmentLoading(state).summary);
  const error = useSelector((state: any) => selectDepartmentError(state).summary);

  useEffect(() => {
    // Fetch summary when code changes
    if (code) {
      console.log(`[Hook] Fetching summary for department: ${code}`);
      dispatch(fetchDepartmentSummary(code) as any);
    }
  }, [code, dispatch]);

  // Clear error callback
  const clearSummaryError = useCallback(() => {
    dispatch(clearError('summary'));
  }, [dispatch]);

  return {
    summary,
    loading,
    error,
    clearError: clearSummaryError,
  };
};

/**
 * Hook to manage department selection
 * Selects a department and fetches its data
 */
export const useSelectDepartment = (initialCode?: string) => {
  const dispatch = useDispatch();
  const selectedDepartment = useSelector(
    (state: any) => state.departments.selectedDepartment
  );

  const selectDepartment = useCallback(
    (code: string | null) => {
      console.log('[Hook] Selecting department:', code);
      dispatch(setSelectedDepartment(code));
    },
    [dispatch]
  );

  // Set initial department if provided
  useEffect(() => {
    if (initialCode && !selectedDepartment) {
      selectDepartment(initialCode);
    }
  }, [initialCode, selectedDepartment, selectDepartment]);

  return {
    selectedDepartment,
    selectDepartment,
  };
};

/**
 * Composite Hook: Get all data for a department in one place
 * Fetches departments, selects one, and gets all its data
 */
export const useDepartment = (code: string | null) => {
  const departments = useDepartments();
  const departmentData = useDepartmentData(code);
  const kpis = useDepartmentKPIs(code);
  const trends = useDepartmentTrends(code);
  const summary = useDepartmentSummary(code);

  // Overall loading state
  const isLoading =
    departments.loading ||
    departmentData.loading ||
    kpis.loading ||
    trends.loading ||
    summary.loading;

  // Overall error state
  const hasError =
    departments.error || departmentData.error || kpis.error || trends.error || summary.error;

  return {
    // Lists
    departments: departments.departments,
    
    // Data
    data: departmentData.data,
    kpis: kpis.kpis,
    trends: trends.trends,
    summary: summary.summary,

    // Loading & errors
    isLoading,
    hasError,
    errors: {
      departments: departments.error,
      data: departmentData.error,
      kpis: kpis.error,
      trends: trends.error,
      summary: summary.error,
    },

    // Clear functions
    clearErrors: () => {
      departments.clearError();
      departmentData.clearError();
      kpis.clearError();
      trends.clearError();
      summary.clearError();
    },
  };
};

/**
 * Hook for managing API data refresh
 * Allows manual refresh of specific data
 */
export const useRefreshDepartmentData = () => {
  const dispatch = useDispatch();

  const refreshDepartments = useCallback(() => {
    console.log('[Hook] Manually refreshing departments...');
    dispatch(fetchAllDepartments() as any);
  }, [dispatch]);

  const refreshDepartmentData = useCallback((code: string) => {
    console.log(`[Hook] Manually refreshing data for department: ${code}`);
    dispatch(fetchDepartmentData(code) as any);
  }, [dispatch]);

  const refreshKPIs = useCallback((code: string, dateRange?: DateRange) => {
    console.log(
      `[Hook] Manually refreshing KPIs for department: ${code}`,
      dateRange
    );
    dispatch(fetchDepartmentKPIs({ code, dateRange }) as any);
  }, [dispatch]);

  const refreshTrends = useCallback(
    (code: string, timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
      console.log(
        `[Hook] Manually refreshing trends for department: ${code}`,
        timeframe
      );
      dispatch(fetchDepartmentTrends({ code, timeframe }) as any);
    },
    [dispatch]
  );

  const refreshAll = useCallback((code: string) => {
    console.log(`[Hook] Manually refreshing all data for department: ${code}`);
    dispatch(fetchDepartmentData(code) as any);
    dispatch(fetchDepartmentKPIs({ code }) as any);
    dispatch(fetchDepartmentTrends({ code }) as any);
    dispatch(fetchDepartmentSummary(code) as any);
  }, [dispatch]);

  return {
    refreshDepartments,
    refreshDepartmentData,
    refreshKPIs,
    refreshTrends,
    refreshAll,
  };
};
