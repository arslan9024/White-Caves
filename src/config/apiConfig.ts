/**
 * API Configuration
 * Centralized API endpoints and settings for all environments
 */

export const API_CONFIG = {
  // Base URL - uses environment variable or defaults
  BASE_URL: process.env.REACT_APP_API_URL || 'https://api.whitecaves.com',

  // Request timeout (ms)
  TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000', 10),

  // Retry configuration for failed requests
  RETRY: {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
  },

  // Cache configuration
  CACHE: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes in milliseconds
  },

  // Feature flags
  FEATURES: {
    useRealApi: process.env.REACT_APP_USE_REAL_API !== 'false',
    useMockApi: process.env.REACT_APP_USE_MOCK_API === 'true',
    logRequests: process.env.REACT_APP_LOG_LEVEL === 'debug',
  },
};

/**
 * API Endpoints
 * All API routes organized by resource
 */
export const API_ENDPOINTS = {
  // Authentication endpoints
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    verify: '/auth/verify',
  },

  // Department endpoints
  departments: {
    list: '/departments',
    get: (code: string) => `/departments/${code}`,
    data: (code: string) => `/departments/${code}/data`,
    kpis: (code: string) => `/departments/${code}/kpis`,
    trends: (code: string) => `/departments/${code}/trends`,
    summary: (code: string) => `/departments/${code}/summary`,
    export: (code: string) => `/departments/${code}/export`,
    search: '/departments/search',
  },

  // User endpoints
  users: {
    profile: '/users/profile',
    settings: '/users/settings',
    update: '/users/update',
    changePassword: '/users/change-password',
  },

  // Analytics endpoints
  analytics: {
    dashboard: '/analytics/dashboard',
    metrics: '/analytics/metrics',
    reports: '/analytics/reports',
  },

  // Health check
  health: '/health',
};

/**
 * Default HTTP Headers
 */
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * Response Status Codes and their meanings
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

/**
 * Error Messages
 */
export const API_ERRORS = {
  NETWORK_ERROR: 'Network error - unable to reach server',
  TIMEOUT_ERROR: 'Request timeout - server took too long to respond',
  UNAUTHORIZED: 'Authentication required - please login',
  FORBIDDEN: 'You do not have permission to access this resource',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Server error - please try again later',
  UNKNOWN_ERROR: 'An unknown error occurred',
  INVALID_RESPONSE: 'Invalid response from server',
};

/**
 * API Response Interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
  timestamp?: string;
}

/**
 * Pagination Interface
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Date Range Interface
 */
export interface DateRangeParams {
  from?: string;
  to?: string;
  startDate?: string;
  endDate?: string;
  fromDate?: string;
  toDate?: string;
}

/**
 * Filter Interface
 */
export interface FilterParams {
  search?: string;
  status?: string;
  category?: string;
  department?: string;
  [key: string]: any;
}

/**
 * Query Parameters Builder
 */
export const buildQueryParams = (
  params: Record<string, any>
): Record<string, any> => {
  const cleaned: Record<string, any> = {};

  Object.keys(params).forEach((key) => {
    const value = params[key];

    // Skip null, undefined, and empty string values
    if (value === null || value === undefined || value === '') {
      return;
    }

    // Skip empty arrays
    if (Array.isArray(value) && value.length === 0) {
      return;
    }

    cleaned[key] = value;
  });

  return cleaned;
};

/**
 * Determine if API should use real or mock data
 */
export const shouldUseRealApi = (): boolean => {
  if (API_CONFIG.FEATURES.useMockApi) {
    return false;
  }
  return API_CONFIG.FEATURES.useRealApi;
};
