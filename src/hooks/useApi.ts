/**
 * Custom Hooks for API Data Fetching
 * Provides convenient React hooks for fetching department data
 */

import { useEffect, useState } from 'react';
import {
  fetchDepartmentDataFromApi,
  fetchDepartmentKPIs,
  fetchDepartmentSummary,
  fetchDepartmentTrends,
  searchDepartmentData,
  exportDepartmentData,
} from '../mocks/apiHandler';
import { DepartmentData } from '../mocks/departmentData';
import { DepartmentKPI, DepartmentSummary, DepartmentSearchResult } from '../mocks/apiHandler';

interface UseApiOptions {
  immediate?: boolean; // auto-fetch on mount
  cacheTime?: number; // cache duration in ms
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  timestamp?: number;
}

/**
 * Hook to fetch department data
 */
export const useFetchDepartmentData = (
  departmentCode: string,
  options: UseApiOptions = { immediate: true }
): UseApiState<DepartmentData> & { refetch: () => Promise<void> } => {
  const [data, setData] = useState<DepartmentData | null>(null);
  const [loading, setLoading] = useState(options.immediate || false);
  const [error, setError] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<number>();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchDepartmentDataFromApi(departmentCode);
      if (response.success && response.data) {
        setData(response.data);
        setTimestamp(response.timestamp);
      } else {
        setError(response.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate) {
      fetchData();
    }
  }, [departmentCode, options.immediate]);

  return { data, loading, error, timestamp, refetch: fetchData };
};

/**
 * Hook to fetch department KPIs
 */
export const useFetchDepartmentKPIs = (
  departmentCode: string,
  options: UseApiOptions = { immediate: true }
) => {
  const [data, setData] = useState<DepartmentKPI[] | null>(null);
  const [loading, setLoading] = useState(options.immediate || false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchDepartmentKPIs(departmentCode);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch KPIs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate) {
      fetchData();
    }
  }, [departmentCode, options.immediate]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook to fetch department summary
 */
export const useFetchDepartmentSummary = (
  departmentCode: string,
  options: UseApiOptions = { immediate: true }
) => {
  const [data, setData] = useState<DepartmentSummary | null>(null);
  const [loading, setLoading] = useState(options.immediate || false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchDepartmentSummary(departmentCode);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate) {
      fetchData();
    }
  }, [departmentCode, options.immediate]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook to fetch department trends
 */
export const useFetchDepartmentTrends = (
  departmentCode: string,
  options: UseApiOptions = { immediate: true }
) => {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(options.immediate || false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchDepartmentTrends(departmentCode);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trends');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (options.immediate) {
      fetchData();
    }
  }, [departmentCode, options.immediate]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook to search department data
 */
export const useSearchDepartmentData = (departmentCode: string) => {
  const [results, setResults] = useState<DepartmentSearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (searchTerm: string) => {
    setSearching(true);
    setError(null);
    try {
      const response = await searchDepartmentData(departmentCode, searchTerm);
      if (response.success && response.data) {
        setResults(response.data);
      } else {
        setError(response.error || 'Search failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search error');
    } finally {
      setSearching(false);
    }
  };

  return { results, searching, error, search };
};

/**
 * Hook to export department data
 */
export const useExportDepartmentData = (departmentCode: string) => {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = async () => {
    setExporting(true);
    setError(null);
    try {
      const response = await exportDepartmentData(departmentCode);
      if (response.success && response.data) {
        // Trigger download
        const element = document.createElement('a');
        const file = new Blob([JSON.stringify(response.data.content, null, 2)], {
          type: 'application/json',
        });
        element.href = URL.createObjectURL(file);
        element.download = response.data.fileName;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      } else {
        setError(response.error || 'Export failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export error');
    } finally {
      setExporting(false);
    }
  };

  return { exporting, error, exportData };
};
