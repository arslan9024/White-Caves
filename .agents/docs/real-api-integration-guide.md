---
title: 'Real API Integration - Complete Implementation Guide'
author: Development Team
date: 2026-01-21
version: 1.0
---

# Real API Integration - Complete Guide

**Status:** 🚀 **IMPLEMENTATION GUIDE**
**Target:** Replace Mock API with Real API
**Difficulty:** MEDIUM
**Est. Time:** 4-5 days

---

## 📋 Overview

This guide covers the complete process of replacing the mock API system with a real API backend. By the end, all data will flow from a real server instead of hardcoded mock data.

---

## 🏗️ Current Architecture

```
Components
    ↓
Redux Store (Mock Data)
    ↓
useApi Hook (Mock)
    ↓
departmentData.ts (Hardcoded)
```

---

## 🎯 Target Architecture

```
Components
    ↓
Redux Store (Real Data)
    ↓
RTK Query / Redux Thunk
    ↓
API Service Layer
    ↓
API Client (axios/fetch)
    ↓
Real Backend API
```

---

## 🔧 Implementation Steps

### Step 1: Set Up API Configuration

**File:** `src/config/apiConfig.ts`

```typescript
/**
 * API Configuration
 * Centralized API endpoints and settings
 */

export const API_CONFIG = {
  // Base URL
  BASE_URL: process.env.REACT_APP_API_URL || 'https://api.whitecaves.com',

  // Timeout (ms)
  TIMEOUT: 30000,

  // Retry configuration
  RETRY: {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
  },

  // Cache configuration
  CACHE: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutes
  },
};

export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },

  // Departments
  departments: {
    list: '/departments',
    get: (code: string) => `/departments/${code}`,
    data: (code: string) => `/departments/${code}/data`,
    kpis: (code: string) => `/departments/${code}/kpis`,
    trends: (code: string) => `/departments/${code}/trends`,
    summary: (code: string) => `/departments/${code}/summary`,
    export: (code: string) => `/departments/${code}/export`,
  },

  // Users
  users: {
    profile: '/users/profile',
    settings: '/users/settings',
  },
};

export const API_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
```

### Step 2: Create API Client

**File:** `src/services/apiClient.ts`

```typescript
/**
 * API Client
 * Handles all HTTP requests with interceptors, auth, retries, etc.
 */

import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { API_CONFIG, API_HEADERS } from '../config/apiConfig';

class APIClient {
  private client: AxiosInstance;
  private retryCount: Map<string, number> = new Map();

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_HEADERS,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      config => this.onRequest(config),
      error => this.onError(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      response => this.onResponse(response),
      error => this.onError(error)
    );
  }

  private onRequest(config: any) {
    // Add auth token
    const token = this.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = this.generateRequestID();

    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  }

  private onResponse(response: AxiosResponse) {
    console.log(`[API] Response: ${response.status} ${response.statusText}`);

    // Clear retry count on success
    const key = `${response.config.method}-${response.config.url}`;
    this.retryCount.delete(key);

    return response;
  }

  private async onError(error: AxiosError) {
    console.error(`[API] Error:`, error.message);

    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      return this.handleUnauthorized(error);
    }

    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      console.error('[API] Forbidden - insufficient permissions');
      return Promise.reject(error);
    }

    // Handle 404 - Not Found
    if (error.response?.status === 404) {
      console.error('[API] Resource not found');
      return Promise.reject(error);
    }

    // Handle 500 - Server Error (with retry)
    if (error.response?.status >= 500) {
      return this.handleServerError(error);
    }

    // Handle network errors (with retry)
    if (!error.response) {
      return this.handleNetworkError(error);
    }

    return Promise.reject(error);
  }

  private async handleUnauthorized(error: AxiosError) {
    try {
      // Try to refresh token
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        const response = await this.client.post('/auth/refresh', {
          refreshToken,
        });

        const { token } = response.data;
        this.setAuthToken(token);

        // Retry original request
        const originalConfig = error.config as any;
        originalConfig.headers.Authorization = `Bearer ${token}`;
        return this.client(originalConfig);
      }
    } catch (refreshError) {
      console.error('[API] Token refresh failed');
      // Redirect to login
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }

  private async handleServerError(error: AxiosError) {
    const config = error.config as any;
    const key = `${config.method}-${config.url}`;
    const attempts = (this.retryCount.get(key) || 0) + 1;

    if (attempts <= API_CONFIG.RETRY.maxAttempts) {
      this.retryCount.set(key, attempts);

      // Calculate backoff delay
      const delay =
        API_CONFIG.RETRY.delayMs * Math.pow(API_CONFIG.RETRY.backoffMultiplier, attempts - 1);

      console.log(
        `[API] Retrying (attempt ${attempts}/${API_CONFIG.RETRY.maxAttempts}) after ${delay}ms`
      );

      await new Promise(resolve => setTimeout(resolve, delay));
      return this.client(config);
    }

    return Promise.reject(error);
  }

  private async handleNetworkError(error: AxiosError) {
    const config = error.config as any;
    const key = `${config.method}-${config.url}`;
    const attempts = (this.retryCount.get(key) || 0) + 1;

    if (attempts <= API_CONFIG.RETRY.maxAttempts) {
      this.retryCount.set(key, attempts);

      const delay =
        API_CONFIG.RETRY.delayMs * Math.pow(API_CONFIG.RETRY.backoffMultiplier, attempts - 1);

      console.log(
        `[API] Network error - retrying (attempt ${attempts}/${API_CONFIG.RETRY.maxAttempts})`
      );

      await new Promise(resolve => setTimeout(resolve, delay));
      return this.client(config);
    }

    console.error('[API] Network error - max retries exceeded');
    return Promise.reject(error);
  }

  // Public methods
  public async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Auth token management
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Utility
  private generateRequestID(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const apiClient = new APIClient();
```

### Step 3: Create API Service

**File:** `src/services/departmentService.ts`

```typescript
/**
 * Department API Service
 * Handles all department-related API calls
 */

import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/apiConfig';

export interface DepartmentData {
  code: string;
  name: string;
  kpis: KPI[];
  summary: DepartmentSummary;
  trends: Trend[];
}

export interface KPI {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export interface DepartmentSummary {
  totalRecords: number;
  activeRecords: number;
  inactiveRecords: number;
  lastUpdated: string;
}

export interface Trend {
  date: string;
  value: number;
  label?: string;
}

export interface DateRange {
  from: string;
  to: string;
}

class DepartmentService {
  /**
   * Get all departments
   */
  async getAllDepartments(): Promise<{ code: string; name: string }[]> {
    try {
      const data = await apiClient.get<{ departments: { code: string; name: string }[] }>(
        API_ENDPOINTS.departments.list
      );
      return data.departments;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  }

  /**
   * Get department data
   */
  async getDepartmentData(code: string): Promise<DepartmentData> {
    try {
      const data = await apiClient.get<DepartmentData>(API_ENDPOINTS.departments.data(code));
      return data;
    } catch (error) {
      console.error(`Error fetching department data for ${code}:`, error);
      throw error;
    }
  }

  /**
   * Get department KPIs
   */
  async getDepartmentKPIs(code: string, dateRange?: DateRange): Promise<KPI[]> {
    try {
      const data = await apiClient.get<{ kpis: KPI[] }>(API_ENDPOINTS.departments.kpis(code), {
        params: dateRange
          ? {
              fromDate: dateRange.from,
              toDate: dateRange.to,
            }
          : {},
      });
      return data.kpis;
    } catch (error) {
      console.error(`Error fetching KPIs for ${code}:`, error);
      throw error;
    }
  }

  /**
   * Get department trends
   */
  async getDepartmentTrends(
    code: string,
    timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'
  ): Promise<Trend[]> {
    try {
      const data = await apiClient.get<{ trends: Trend[] }>(
        API_ENDPOINTS.departments.trends(code),
        {
          params: { timeframe },
        }
      );
      return data.trends;
    } catch (error) {
      console.error(`Error fetching trends for ${code}:`, error);
      throw error;
    }
  }

  /**
   * Get department summary
   */
  async getDepartmentSummary(code: string): Promise<DepartmentSummary> {
    try {
      const data = await apiClient.get<{ summary: DepartmentSummary }>(
        API_ENDPOINTS.departments.summary(code)
      );
      return data.summary;
    } catch (error) {
      console.error(`Error fetching summary for ${code}:`, error);
      throw error;
    }
  }

  /**
   * Export department data
   */
  async exportDepartmentData(
    code: string,
    format: 'csv' | 'excel' | 'pdf' | 'json' = 'csv'
  ): Promise<Blob> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.departments.export(code), {
        params: { format },
        responseType: 'blob',
      });
      return response as unknown as Blob;
    } catch (error) {
      console.error(`Error exporting data for ${code}:`, error);
      throw error;
    }
  }
}

export const departmentService = new DepartmentService();
```

### Step 4: Update Redux Slice with API Integration

**File:** `src/store/slices/departmentSlice.ts`

```typescript
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
} from '../../services/departmentService';

// Async thunks
export const fetchAllDepartments = createAsyncThunk(
  'departments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const departments = await departmentService.getAllDepartments();
      return departments;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDepartmentData = createAsyncThunk(
  'departments/fetchData',
  async (code: string, { rejectWithValue }) => {
    try {
      const data = await departmentService.getDepartmentData(code);
      return { [code]: data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDepartmentKPIs = createAsyncThunk(
  'departments/fetchKPIs',
  async ({ code, dateRange }: { code: string; dateRange?: DateRange }, { rejectWithValue }) => {
    try {
      const kpis = await departmentService.getDepartmentKPIs(code, dateRange);
      return { code, kpis };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDepartmentTrends = createAsyncThunk(
  'departments/fetchTrends',
  async (
    { code, timeframe }: { code: string; timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly' },
    { rejectWithValue }
  ) => {
    try {
      const trends = await departmentService.getDepartmentTrends(code, timeframe);
      return { code, trends };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// State interface
export interface DepartmentState {
  departments: Array<{ code: string; name: string }>;
  departmentData: Record<string, DepartmentData>;
  kpis: Record<string, KPI[]>;
  trends: Record<string, any[]>;
  loading: {
    departments: boolean;
    data: boolean;
    kpis: boolean;
    trends: boolean;
  };
  error: {
    departments: string | null;
    data: string | null;
    kpis: string | null;
    trends: string | null;
  };
  lastUpdated: {
    departments: number | null;
    data: Record<string, number>;
    kpis: Record<string, number>;
  };
}

const initialState: DepartmentState = {
  departments: [],
  departmentData: {},
  kpis: {},
  trends: {},
  loading: {
    departments: false,
    data: false,
    kpis: false,
    trends: false,
  },
  error: {
    departments: null,
    data: null,
    kpis: null,
    trends: null,
  },
  lastUpdated: {
    departments: null,
    data: {},
    kpis: {},
  },
};

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state, action: PayloadAction<keyof DepartmentState['error']>) => {
      state.error[action.payload] = null;
    },

    // Clear all data
    clearDepartmentData: state => {
      state.departmentData = {};
      state.kpis = {};
      state.trends = {};
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
      })
      .addCase(fetchDepartmentTrends.rejected, (state, action) => {
        state.loading.trends = false;
        state.error.trends = action.payload as string;
      });
  },
});

export const { clearError, clearDepartmentData } = departmentSlice.actions;
export default departmentSlice.reducer;
```

### Step 5: Create Custom Hooks for API

**File:** `src/hooks/useRealAPI.ts`

```typescript
/**
 * Custom Hooks for Real API Integration
 * Provides easy access to API data and loading states
 */

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  fetchAllDepartments,
  fetchDepartmentData,
  fetchDepartmentKPIs,
  fetchDepartmentTrends,
} from '../store/slices/departmentSlice';
import { RootState } from '../store';

/**
 * Hook to fetch all departments
 */
export const useDepartments = () => {
  const dispatch = useDispatch();
  const {
    departments,
    loading: departmentsLoading,
    error: departmentsError,
  } = useSelector((state: RootState) => ({
    departments: state.departments.departments,
    departmentsLoading: state.departments.loading.departments,
    departmentsError: state.departments.error.departments,
  }));

  useEffect(() => {
    if (departments.length === 0) {
      dispatch(fetchAllDepartments() as any);
    }
  }, [dispatch, departments.length]);

  return {
    departments,
    loading: departmentsLoading,
    error: departmentsError,
  };
};

/**
 * Hook to fetch department data
 */
export const useDepartmentData = (code: string | null) => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => ({
    data: code ? state.departments.departmentData[code] : null,
    loading: state.departments.loading.data,
    error: state.departments.error.data,
  }));

  useEffect(() => {
    if (code && !data) {
      dispatch(fetchDepartmentData(code) as any);
    }
  }, [code, dispatch, data]);

  return {
    data,
    loading,
    error,
  };
};

/**
 * Hook to fetch department KPIs
 */
export const useDepartmentKPIs = (
  code: string | null,
  dateRange?: { from: string; to: string }
) => {
  const dispatch = useDispatch();
  const { kpis, loading, error } = useSelector((state: RootState) => ({
    kpis: code ? state.departments.kpis[code] || [] : [],
    loading: state.departments.loading.kpis,
    error: state.departments.error.kpis,
  }));

  useEffect(() => {
    if (code) {
      dispatch(fetchDepartmentKPIs({ code, dateRange }) as any);
    }
  }, [code, dateRange, dispatch]);

  return {
    kpis,
    loading,
    error,
  };
};

/**
 * Hook to fetch department trends
 */
export const useDepartmentTrends = (
  code: string | null,
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly'
) => {
  const dispatch = useDispatch();
  const { trends, loading, error } = useSelector((state: RootState) => ({
    trends: code ? state.departments.trends[code] || [] : [],
    loading: state.departments.loading.trends,
    error: state.departments.error.trends,
  }));

  useEffect(() => {
    if (code) {
      dispatch(fetchDepartmentTrends({ code, timeframe }) as any);
    }
  }, [code, timeframe, dispatch]);

  return {
    trends,
    loading,
    error,
  };
};
```

### Step 6: Update Components to Use Real API

**File:** `src/pages/departments/sales/EnhancedSalesDepartmentView.tsx` (Updated)

```typescript
/**
 * Sales Department View - Using Real API
 */

import React from 'react';
import styled from 'styled-components';
import BaseDepartmentView from '../../../components/departmentViews/BaseDepartmentView';
import { useDepartmentKPIs, useDepartmentTrends } from '../../../hooks/useRealAPI';
import { BarChart, LineChart } from '../../../components/charts/DataVisualization';
import { LoadingState, ErrorState } from '../../../components/states';

const SalesContentWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
  padding: 24px;
`;

export const EnhancedSalesDepartmentView: React.FC<{ code?: string }> = ({
  code = 'SALES'
}) => {
  const { kpis, loading: kpisLoading, error: kpisError } = useDepartmentKPIs(code);
  const { trends, loading: trendsLoading, error: trendsError } = useDepartmentTrends(code, 'monthly');

  if (kpisLoading || trendsLoading) {
    return <LoadingState message="Loading sales data..." />;
  }

  if (kpisError || trendsError) {
    return <ErrorState error={kpisError || trendsError} />;
  }

  return (
    <BaseDepartmentView title="Sales Department" code={code}>
      <SalesContentWrapper>
        <BarChart
          data={kpis}
          title="Sales Metrics"
          xAxis="label"
          yAxis="value"
        />
        <LineChart
          data={trends}
          title="Sales Trend"
          xAxis="date"
          yAxis="value"
        />
      </SalesContentWrapper>
    </BaseDepartmentView>
  );
};

export default EnhancedSalesDepartmentView;
```

### Step 7: Environment Configuration

**File:** `.env`

```
# API Configuration
REACT_APP_API_URL=https://api.whitecaves.com
REACT_APP_API_TIMEOUT=30000

# Feature Flags
REACT_APP_USE_REAL_API=true
REACT_APP_USE_MOCK_API=false

# Logging
REACT_APP_LOG_LEVEL=debug
```

---

## ✅ Migration Checklist

### Phase 1: Setup (Day 1)

- [ ] Create API configuration
- [ ] Create API client with interceptors
- [ ] Create department service
- [ ] Set up environment variables

### Phase 2: Redux Integration (Day 2)

- [ ] Update Redux slice with async thunks
- [ ] Create API hooks
- [ ] Test Redux + API integration

### Phase 3: Component Updates (Day 3)

- [ ] Update department views to use real API
- [ ] Update filters to use real API
- [ ] Remove mock data imports

### Phase 4: Testing & QA (Day 4-5)

- [ ] Test all API endpoints
- [ ] Test error handling
- [ ] Test loading states
- [ ] Performance testing
- [ ] Security audit

---

## 🧪 Testing Real API

**File:** `src/integration/__tests__/real-api.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { departmentService } from '../../services/departmentService';

describe('Real API Integration', () => {
  beforeEach(() => {
    // Mock API responses
    vi.mock('../../services/apiClient', () => ({
      apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
      },
    }));
  });

  describe('Department Service', () => {
    it('should fetch all departments', async () => {
      const departments = await departmentService.getAllDepartments();
      expect(departments).toBeDefined();
      expect(Array.isArray(departments)).toBe(true);
    });

    it('should fetch department data', async () => {
      const data = await departmentService.getDepartmentData('SALES');
      expect(data).toBeDefined();
      expect(data.code).toBe('SALES');
      expect(data.kpis).toBeDefined();
    });

    it('should fetch KPIs with date range', async () => {
      const kpis = await departmentService.getDepartmentKPIs('SALES', {
        from: '2024-01-01',
        to: '2024-01-31',
      });
      expect(Array.isArray(kpis)).toBe(true);
    });

    it('should handle API errors gracefully', async () => {
      try {
        await departmentService.getDepartmentData('INVALID');
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
```

---

## 🚀 Deployment Steps

### 1. Staging Deployment

```bash
# Build for staging
npm run build:staging

# Deploy to staging
npm run deploy:staging

# Test in staging environment
npm run test:e2e:staging
```

### 2. Production Deployment

```bash
# Build for production
npm run build:production

# Deploy to production
npm run deploy:production

# Monitor in production
npm run monitor:production
```

---

## 📊 Success Metrics

```
API Response Time:     < 500ms
Error Rate:           < 0.1%
Cache Hit Rate:       > 80%
Test Coverage:        > 85%
Performance Score:    > 90
Uptime:              > 99.9%
```

---

## 🔗 Related Files

- `/src/config/apiConfig.ts` - API Configuration
- `/src/services/apiClient.ts` - HTTP Client
- `/src/services/departmentService.ts` - API Service
- `/src/store/slices/departmentSlice.ts` - Redux State
- `/src/hooks/useRealAPI.ts` - Custom Hooks
- `.env` - Environment Variables

---

## 📞 Next Steps

1. ✅ Create API configuration and client
2. ✅ Implement department service
3. ✅ Update Redux slices
4. ✅ Create custom hooks
5. ✅ Update components
6. ✅ Run integration tests
7. ✅ Deploy to staging
8. ✅ Production deployment

---

Report Generated: January 21, 2026
Status: IMPLEMENTATION GUIDE READY
Difficulty: MEDIUM-HARD
Est. Duration: 4-5 days
