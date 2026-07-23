/**
 * Mock API Handler
 * Simulates API responses for department data
 * Replaces real API calls during development/testing
 */

import { DepartmentData, MOCK_DEPARTMENT_DATA, getMockDepartmentData } from './departmentData';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Simulate network delay
const NETWORK_DELAY = 300; // milliseconds

/**
 * Simulate API call with delay
 */
const simulateApiDelay = (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(resolve, NETWORK_DELAY + Math.random() * 200);
  });
};

/**
 * Simulate random errors (5% chance)
 */
const shouldSimulateError = (): boolean => {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return false;
  }
  return Math.random() < 0.05; // 5% error rate
};

/**
 * Fetch department data from mock API
 */
export const fetchDepartmentDataFromApi = async (
  departmentCode: string
): Promise<ApiResponse<DepartmentData>> => {
  await simulateApiDelay();

  // Simulate occasional errors
  if (shouldSimulateError()) {
    return {
      success: false,
      error: `Failed to fetch data for department: ${departmentCode}`,
      timestamp: Date.now(),
    };
  }

  const data = getMockDepartmentData(departmentCode);

  if (!data) {
    return {
      success: false,
      error: `Department not found: ${departmentCode}`,
      timestamp: Date.now(),
    };
  }

  return {
    success: true,
    data,
    timestamp: Date.now(),
  };
};

/**
 * Fetch all departments data
 */
export const fetchAllDepartmentsDataFromApi = async (): Promise<
  ApiResponse<Record<string, DepartmentData>>
> => {
  await simulateApiDelay();

  if (shouldSimulateError()) {
    return {
      success: false,
      error: 'Failed to fetch all departments',
      timestamp: Date.now(),
    };
  }

  return {
    success: true,
    data: MOCK_DEPARTMENT_DATA,
    timestamp: Date.now(),
  };
};

/**
 * Fetch department KPIs
 */
export type DepartmentKPI = DepartmentData['kpis'][number];
export type DepartmentSummary = DepartmentData['summary'];
export interface DepartmentSearchResult {
  kpis: DepartmentKPI[];
}
export interface DepartmentExportResult {
  fileName: string;
  content: DepartmentData;
}
export interface DepartmentTrendPoint {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
}

export const fetchDepartmentKPIs = async (
  departmentCode: string
): Promise<ApiResponse<DepartmentKPI[]>> => {
  await simulateApiDelay();

  const data = getMockDepartmentData(departmentCode);
  if (!data) {
    return {
      success: false,
      error: `Department not found: ${departmentCode}`,
      timestamp: Date.now(),
    };
  }

  return {
    success: true,
    data: data.kpis,
    timestamp: Date.now(),
  };
};

/**
 * Fetch department summary
 */
export const fetchDepartmentSummary = async (
  departmentCode: string
): Promise<ApiResponse<DepartmentSummary>> => {
  await simulateApiDelay();

  const data = getMockDepartmentData(departmentCode);
  if (!data) {
    return {
      success: false,
      error: `Department not found: ${departmentCode}`,
      timestamp: Date.now(),
    };
  }

  return {
    success: true,
    data: data.summary,
    timestamp: Date.now(),
  };
};

/**
 * Search department data
 */
export const searchDepartmentData = async (
  departmentCode: string,
  searchTerm: string
): Promise<ApiResponse<DepartmentSearchResult>> => {
  await simulateApiDelay();

  const data = getMockDepartmentData(departmentCode);
  if (!data) {
    return {
      success: false,
      error: `Department not found: ${departmentCode}`,
      timestamp: Date.now(),
    };
  }

  // Simple search implementation
  const results = {
    kpis: data.kpis.filter(kpi => kpi.label.toLowerCase().includes(searchTerm.toLowerCase())),
  };

  return {
    success: true,
    data: results,
    timestamp: Date.now(),
  };
};

/**
 * Export/download department data
 */
export const exportDepartmentData = async (
  departmentCode: string
): Promise<ApiResponse<DepartmentExportResult>> => {
  await simulateApiDelay();

  const data = getMockDepartmentData(departmentCode);
  if (!data) {
    return {
      success: false,
      error: `Department not found: ${departmentCode}`,
      timestamp: Date.now(),
    };
  }

  return {
    success: true,
    data: {
      fileName: `${departmentCode}-report-${new Date().toISOString().split('T')[0]}.json`,
      content: data,
    },
    timestamp: Date.now(),
  };
};

/**
 * Get department analytics/trends
 */
export const fetchDepartmentTrends = async (departmentCode: string) => {
  await simulateApiDelay();

  const data = getMockDepartmentData(departmentCode);
  if (!data) {
    return {
      success: false,
      error: `Department not found: ${departmentCode}`,
      timestamp: Date.now(),
    };
  }

  const trends = {
    currentMonth: { total: data.summary.totalItems, growth: 5 },
    lastMonth: { total: Math.round(data.summary.totalItems * 0.95), growth: 3 },
    trend: 'up',
  };

  return {
    success: true,
    data: trends,
    timestamp: Date.now(),
  };
};

/**
 * Mock API routes for Express-like servers
 * Can be used in API mocking frameworks
 */
export const mockApiRoutes = {
  GET: {
    '/api/departments/:code': async (code: string) => fetchDepartmentDataFromApi(code),
    '/api/departments': async () => fetchAllDepartmentsDataFromApi(),
    '/api/departments/:code/kpis': async (code: string) => fetchDepartmentKPIs(code),
    '/api/departments/:code/summary': async (code: string) => fetchDepartmentSummary(code),
    '/api/departments/:code/trends': async (code: string) => fetchDepartmentTrends(code),
  },
  POST: {
    '/api/departments/:code/search': async (code: string, searchTerm: string) =>
      searchDepartmentData(code, searchTerm),
    '/api/departments/:code/export': async (code: string) => exportDepartmentData(code),
  },
};
