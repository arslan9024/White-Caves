/**
 * Enhanced Real API Hooks
 * Optimized hooks with caching, dedup, and performance monitoring support
 */

import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
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
import { apiIntegration } from '../services/apiIntegration';
import { DateRange } from '../services/departmentService';
import { PaginationParams } from '../services/apiOptimizer';

/**
 * Enhanced hook to fetch and manage all departments
 * Uses optimized API integration with caching and deduplication
 */
export const useDepartmentsOptimized = (forceRefresh = false) => {
  const dispatch = useDispatch();
  const departments = useSelector(selectDepartments);
  const loading = useSelector((state: any) => selectDepartmentLoading(state).departments);
  const error = useSelector((state: any) => selectDepartmentError(state).departments);

  useEffect(() => {
    // Only fetch if we don't have departments or force refresh
    if ((departments.length === 0 || forceRefresh) && !loading) {
      console.log('[Hook] Fetching departments (optimized)...');
      dispatch(fetchAllDepartments(forceRefresh) as any);
    }
  }, [dispatch, departments.length, loading, forceRefresh]);

  const clearDepartmentError = useCallback(() => {
    dispatch(clearError('departments') as any);
  }, [dispatch]);

  const refresh = useCallback(() => {
    dispatch(fetchAllDepartments(true) as any);
  }, [dispatch]);

  return {
    departments,
    loading,
    error,
    clearError: clearDepartmentError,
    refresh,
  };
};

/**
 * Enhanced hook to fetch and manage department data
 * Uses optimized API integration with caching
 */
export const useDepartmentDataOptimized = (
  code: string | null,
  forceRefresh = false
) => {
  const dispatch = useDispatch();
  const departmentData = useSelector(selectDepartmentData);
  const data = code ? departmentData[code] : null;
  const loading = useSelector((state: any) => selectDepartmentLoading(state).data);
  const error = useSelector((state: any) => selectDepartmentError(state).data);

  useEffect(() => {
    // Fetch data when code changes or force refresh
    if (code && (!data || forceRefresh)) {
      console.log(`[Hook] Fetching data for department: ${code} (optimized)...`);
      dispatch(
        fetchDepartmentData({ code, forceRefresh }) as any
      );
    }
  }, [code, dispatch, data, forceRefresh]);

  const clearDataError = useCallback(() => {
    dispatch(clearError('data') as any);
  }, [dispatch]);

  const refresh = useCallback(() => {
    if (code) {
      dispatch(fetchDepartmentData({ code, forceRefresh: true }) as any);
    }
  }, [code, dispatch]);

  return {
    data,
    loading,
    error,
    clearError: clearDataError,
    refresh,
    isLoaded: !!data,
  };
};

/**
 * Enhanced hook to fetch and manage department KPIs with pagination
 */
export const useDepartmentKPIsOptimized = (
  code: string | null,
  pagination?: PaginationParams,
  forceRefresh = false
) => {
  const dispatch = useDispatch();
  const kpisMap = useSelector(selectDepartmentKPIs);
  const kpis = code ? kpisMap[code] || [] : [];
  const loading = useSelector((state: any) => selectDepartmentLoading(state).kpis);
  const error = useSelector((state: any) => selectDepartmentError(state).kpis);

  useEffect(() => {
    // Fetch KPIs when code changes
    if (code && (!kpis.length || forceRefresh)) {
      console.log(`[Hook] Fetching KPIs for department: ${code} (optimized, pagination: ${pagination?.page || 1})...`);
      dispatch(
        fetchDepartmentKPIs({
          code,
          dateRange: undefined,
          page: pagination?.page || 1,
          pageSize: pagination?.pageSize || 20,
          forceRefresh,
        }) as any
      );
    }
  }, [code, pagination?.page, pagination?.pageSize, dispatch, kpis.length, forceRefresh]);

  const clearKPIError = useCallback(() => {
    dispatch(clearError('kpis') as any);
  }, [dispatch]);

  const refresh = useCallback(() => {
    if (code) {
      dispatch(
        fetchDepartmentKPIs({
          code,
          page: pagination?.page || 1,
          pageSize: pagination?.pageSize || 20,
          forceRefresh: true,
        }) as any
      );
    }
  }, [code, pagination, dispatch]);

  return {
    kpis,
    loading,
    error,
    clearError: clearKPIError,
    refresh,
    isEmpty: kpis.length === 0,
  };
};

/**
 * Enhanced hook to fetch and manage department trends with pagination
 */
export const useDepartmentTrendsOptimized = (
  code: string | null,
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly',
  pagination?: PaginationParams,
  forceRefresh = false
) => {
  const dispatch = useDispatch();
  const trendsMap = useSelector(selectDepartmentTrends);
  const trends = code ? trendsMap[code] || [] : [];
  const loading = useSelector((state: any) => selectDepartmentLoading(state).trends);
  const error = useSelector((state: any) => selectDepartmentError(state).trends);

  useEffect(() => {
    // Fetch trends when code or timeframe changes
    if (code && (!trends.length || forceRefresh)) {
      console.log(
        `[Hook] Fetching trends for department: ${code}, timeframe: ${timeframe} (optimized)...`
      );
      dispatch(
        fetchDepartmentTrends({
          code,
          timeframe,
          page: pagination?.page || 1,
          pageSize: pagination?.pageSize || 50,
          forceRefresh,
        }) as any
      );
    }
  }, [code, timeframe, pagination?.page, pagination?.pageSize, dispatch, trends.length, forceRefresh]);

  const clearTrendError = useCallback(() => {
    dispatch(clearError('trends') as any);
  }, [dispatch]);

  const refresh = useCallback(() => {
    if (code) {
      dispatch(
        fetchDepartmentTrends({
          code,
          timeframe,
          page: pagination?.page || 1,
          pageSize: pagination?.pageSize || 50,
          forceRefresh: true,
        }) as any
      );
    }
  }, [code, timeframe, pagination, dispatch]);

  return {
    trends,
    loading,
    error,
    clearError: clearTrendError,
    refresh,
    isEmpty: trends.length === 0,
  };
};

/**
 * Hook to manage department summary
 */
export const useDepartmentSummaryOptimized = (
  code: string | null,
  forceRefresh = false
) => {
  const dispatch = useDispatch();
  const summariesMap = useSelector(selectDepartmentSummaries);
  const summary = code ? summariesMap[code] : null;
  const loading = useSelector((state: any) => selectDepartmentLoading(state).summary);
  const error = useSelector((state: any) => selectDepartmentError(state).summary);

  useEffect(() => {
    // Fetch summary when code changes
    if (code && (!summary || forceRefresh)) {
      console.log(`[Hook] Fetching summary for department: ${code} (optimized)...`);
      dispatch(fetchDepartmentSummary(code) as any);
    }
  }, [code, dispatch, summary, forceRefresh]);

  const clearSummaryError = useCallback(() => {
    dispatch(clearError('summary') as any);
  }, [dispatch]);

  const refresh = useCallback(() => {
    if (code) {
      dispatch(fetchDepartmentSummary(code) as any);
    }
  }, [code, dispatch]);

  return {
    summary,
    loading,
    error,
    clearError: clearSummaryError,
    refresh,
  };
};

/**
 * Hook to get performance statistics
 */
export const usePerformanceStats = () => {
  const [stats, setStats] = useState(apiIntegration.getPerformanceStats());

  useEffect(() => {
    // Update stats every 5 seconds
    const interval = setInterval(() => {
      setStats(apiIntegration.getPerformanceStats());
    }, 5000);

    // Initial fetch
    setStats(apiIntegration.getPerformanceStats());

    return () => clearInterval(interval);
  }, []);

  return stats;
};

/**
 * Hook to manage cache
 */
export const useCacheManagement = () => {
  const clearCache = useCallback((pattern?: string) => {
    apiIntegration.clearCache(pattern);
  }, []);

  const getCacheInfo = useCallback(() => {
    return apiIntegration.getCacheInfo();
  }, []);

  const getCacheStats = useCallback(() => {
    return apiIntegration.getCacheInfo();
  }, []);

  return {
    clearCache,
    getCacheInfo,
    getCacheStats,
  };
};

/**
 * Hook to batch fetch departments
 */
export const useBatchFetchDepartments = (codes: string[], forceRefresh = false) => {
  const [data, setData] = useState<Map<string, any> | null>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await apiIntegration.batchFetchDepartments(codes, forceRefresh);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (codes.length > 0) {
      fetchData();
    }
  }, [codes, forceRefresh]);

  return {
    data,
    loading: isLoading,
    error,
  };
};

// Export original hooks for backward compatibility
export {
  useDepartments,
  useDepartmentData,
  useDepartmentKPIs,
  useDepartmentTrends,
  useDepartmentSummary,
} from './useRealAPI';
