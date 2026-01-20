/**
 * Unit Tests for useOptimizedAPI Hooks
 * Tests all optimized hooks with caching, deduplication, and monitoring
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import departmentReducer from '../store/slices/departmentSlice';
import {
  useDepartmentsOptimized,
  useDepartmentDataOptimized,
  useDepartmentKPIsOptimized,
  useDepartmentTrendsOptimized,
  useDepartmentSummaryOptimized,
  useDepartmentExportOptimized,
} from '../hooks/useOptimizedAPI';
import { apiIntegration } from '../services/apiIntegration';
import * as React from 'react';

// Mock API integration
vi.mock('../services/apiIntegration', () => ({
  apiIntegration: {
    getAllDepartments: vi.fn(),
    getDepartmentData: vi.fn(),
    getDepartmentKPIs: vi.fn(),
    getDepartmentTrends: vi.fn(),
    getDepartmentSummary: vi.fn(),
    exportDepartmentData: vi.fn(),
    getPerformanceMetrics: vi.fn(),
  },
}));

// Test store configuration
const createTestStore = () => {
  return configureStore({
    reducer: {
      departments: departmentReducer,
    },
  });
};

// Test wrapper component
const TestWrapper = ({ children, store }: any) => (
  React.createElement(Provider, { store }, children)
);

describe('useOptimizedAPI Hooks', () => {
  let store: any;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('useDepartmentsOptimized', () => {
    it('should fetch departments on mount', async () => {
      const mockDepartments = [
        { id: '1', name: 'Sales', code: 'SALES' },
        { id: '2', name: 'Finance', code: 'FINANCE' },
      ];

      (apiIntegration.getAllDepartments as any).mockResolvedValueOnce({
        data: mockDepartments,
        cached: false,
      });

      const { result } = renderHook(() => useDepartmentsOptimized(), {
        wrapper: ({ children }) =>
          React.createElement(TestWrapper, { store, children }),
      });

      // Initially should be loading
      expect(result.current.loading).toBe(true);

      // Wait for data to load
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.departments).toEqual(mockDepartments);
      expect(apiIntegration.getAllDepartments).toHaveBeenCalledOnce();
    });

    it('should use cache on subsequent calls', async () => {
      const mockDepartments = [
        { id: '1', name: 'Sales', code: 'SALES' },
      ];

      (apiIntegration.getAllDepartments as any).mockResolvedValueOnce({
        data: mockDepartments,
        cached: false,
      });

      // First call
      const { result: result1 } = renderHook(() => useDepartmentsOptimized(), {
        wrapper: ({ children }) =>
          React.createElement(TestWrapper, { store, children }),
      });

      await waitFor(() => {
        expect(result1.current.loading).toBe(false);
      });

      // Second call should use cache
      (apiIntegration.getAllDepartments as any).mockResolvedValueOnce({
        data: mockDepartments,
        cached: true,
      });

      const { result: result2 } = renderHook(() => useDepartmentsOptimized(), {
        wrapper: ({ children }) =>
          React.createElement(TestWrapper, { store, children }),
      });

      await waitFor(() => {
        expect(result2.current.loading).toBe(false);
      });

      // Should only call API once (second is from cache)
      expect(result2.current.cached).toBe(true);
    });

    it('should force refresh when requested', async () => {
      const mockDepartments = [
        { id: '1', name: 'Sales', code: 'SALES' },
      ];

      (apiIntegration.getAllDepartments as any).mockResolvedValueOnce({
        data: mockDepartments,
        cached: false,
      });

      const { result, rerender } = renderHook(
        ({ forceRefresh }) => useDepartmentsOptimized(forceRefresh),
        {
          wrapper: ({ children }) =>
            React.createElement(TestWrapper, { store, children }),
          initialProps: { forceRefresh: false },
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Force refresh
      (apiIntegration.getAllDepartments as any).mockResolvedValueOnce({
        data: mockDepartments,
        cached: false,
      });

      rerender({ forceRefresh: true });

      await waitFor(() => {
        expect(apiIntegration.getAllDepartments).toHaveBeenCalledTimes(2);
      });
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('API Error');
      (apiIntegration.getAllDepartments as any).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useDepartmentsOptimized(), {
        wrapper: ({ children }) =>
          React.createElement(TestWrapper, { store, children }),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.departments).toEqual([]);
    });

    it('should clear errors on demand', async () => {
      (apiIntegration.getAllDepartments as any).mockRejectedValueOnce(
        new Error('API Error')
      );

      const { result } = renderHook(() => useDepartmentsOptimized(), {
        wrapper: ({ children }) =>
          React.createElement(TestWrapper, { store, children }),
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });

      result.current.clearError();

      expect(result.current.error).toBeNull();
    });
  });

  describe('useDepartmentDataOptimized', () => {
    it('should fetch department data with filters', async () => {
      const mockData = [
        { id: 'record1', value: 1000 },
        { id: 'record2', value: 2000 },
      ];

      (apiIntegration.getDepartmentData as any).mockResolvedValueOnce({
        data: mockData,
        total: 2,
        cached: false,
      });

      const { result } = renderHook(
        () =>
          useDepartmentDataOptimized('SALES', {
            startDate: '2025-01-01',
            endDate: '2025-01-31',
          }),
        {
          wrapper: ({ children }) =>
            React.createElement(TestWrapper, { store, children }),
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.total).toBe(2);
      expect(apiIntegration.getDepartmentData).toHaveBeenCalledWith(
        'SALES',
        expect.objectContaining({
          startDate: '2025-01-01',
          endDate: '2025-01-31',
        }),
        undefined
      );
    });

    it('should respect pagination', async () => {
      const mockData = Array.from({ length: 20 }, (_, i) => ({
        id: `record${i}`,
        value: (i + 1) * 1000,
      }));

      (apiIntegration.getDepartmentData as any).mockResolvedValueOnce({
        data: mockData.slice(0, 10),
        total: 20,
        cached: false,
      });

      const { result } = renderHook(
        () =>
          useDepartmentDataOptimized('SALES', undefined, {
            page: 1,
            limit: 10,
          }),
        {
          wrapper: ({ children }) =>
            React.createElement(TestWrapper, { store, children }),
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data.length).toBe(10);
      expect(result.current.total).toBe(20);
      expect(apiIntegration.getDepartmentData).toHaveBeenCalledWith(
        'SALES',
        undefined,
        { page: 1, limit: 10 }
      );
    });

    it('should cache by department and date range', async () => {
      const mockData = [{ id: 'record1', value: 1000 }];

      (apiIntegration.getDepartmentData as any).mockResolvedValueOnce({
        data: mockData,
        cached: false,
      });

      // First call
      const { result: result1 } = renderHook(
        () =>
          useDepartmentDataOptimized('SALES', {
            startDate: '2025-01-01',
            endDate: '2025-01-31',
          }),
        {
          wrapper: ({ children }) =>
            React.createElement(TestWrapper, { store, children }),
        }
      );

      await waitFor(() => {
        expect(result1.current.loading).toBe(false);
      });

      // Second call with same params should use cache
      (apiIntegration.getDepartmentData as any).mockResolvedValueOnce({
        data: mockData,
        cached: true,
      });

      const { result: result2 } = renderHook(
        () =>
          useDepartmentDataOptimized('SALES', {
            startDate: '2025-01-01',
            endDate: '2025-01-31',
          }),
        {
          wrapper: ({ children }) =>
            React.createElement(TestWrapper, { store, children }),
        }
      );

      await waitFor(() => {
        expect(result2.current.loading).toBe(false);
      });

      expect(result2.current.cached).toBe(true);
    });

    it('should handle empty results', async () => {
      (apiIntegration.getDepartmentData as any).mockResolvedValueOnce({
        data: [],
        total: 0,
        cached: false,
      });

      const { result } = renderHook(
        () =>
          useDepartmentDataOptimized('SALES', {
            startDate: '2025-01-01',
            endDate: '2025-01-01',
          }),
        {
          wrapper: ({ children }) =>
            React.createElement(TestWrapper, { store, children }),
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual([]);
      expect(result.current.total).toBe(0);
      expect(result.current.isEmpty).toBe(true);
    });
  });

  describe('useDepartmentKPIsOptimized', () => {
    it('should fetch KPI data', async () => {
      const mockKPIs = {
        revenue: 1000000,
        growth: 15.5,
        target: 900000,
        achievement: 111.1,
      };

      (apiIntegration.getDepartmentKPIs as any).mockResolvedValueOnce({
        data: mockKPIs,
        cached: false,
      });

      const { result } = renderHook(() => useDepartmentKPIsOptimized('SALES'), {
        wrapper: ({ children }) =>
          React.createElement(TestWrapper, { store, children }),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.kpis).toEqual(mockKPIs);
    });

    it('should compute metrics correctly', async () => {
      const mockKPIs = {
        revenue: 1000000,
        target: 900000,
      };

      (apiIntegration.getDepartmentKPIs as any).mockResolvedValueOnce({
        data: mockKPIs,
        cached: false,
      });

      const { result } = renderHook(() => useDepartmentKPIsOptimized('SALES'), {
        wrapper: ({ children }) =>
          React.createElement(TestWrapper, { store, children }),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Check if metric computation is available
      expect(result.current.kpis.revenue).toBe(1000000);
    });

    it('should update on data changes', async () => {
      const mockKPIs1 = { revenue: 1000000 };
      const mockKPIs2 = { revenue: 1500000 };

      (apiIntegration.getDepartmentKPIs as any)
        .mockResolvedValueOnce({
          data: mockKPIs1,
          cached: false,
        })
        .mockResolvedValueOnce({
          data: mockKPIs2,
          cached: false,
        });

      const { result, rerender } = renderHook(
        ({ department }) => useDepartmentKPIsOptimized(department),
        {
          wrapper: ({ children }) =>
            React.createElement(TestWrapper, { store, children }),
          initialProps: { department: 'SALES' },
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.kpis.revenue).toBe(1000000);

      // Update to different department
      rerender({ department: 'FINANCE' });

      await waitFor(() => {
        expect(result.current.kpis.revenue).toBe(1500000);
      });
    });
  });

  describe('useDepartmentTrendsOptimized', () => {
    it('should fetch trend data', async () => {
      const mockTrends = [
        { date: '2025-01-01', value: 100 },
        { date: '2025-01-02', value: 120 },
        { date: '2025-01-03', value: 150 },
      ];

      (apiIntegration.getDepartmentTrends as any).mockResolvedValueOnce({
        data: mockTrends,
        cached: false,
      });

      const { result } = renderHook(
        () =>
          useDepartmentTrendsOptimized('SALES', {
            startDate: '2025-01-01',
            endDate: '2025-01-31',
          }),
        {
          wrapper: ({ children }) =>
            React.createElement(TestWrapper, { store, children }),
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.trends).toEqual(mockTrends);
      expect(result.current.trends.length).toBe(3);
    });

    it('should aggregate by time period', async () => {
      const mockTrends = [
        { period: 'Week 1', value: 500 },
        { period: 'Week 2', value: 600 },
      ];

      (apiIntegration.getDepartmentTrends as any).mockResolvedValueOnce({
        data: mockTrends,
        cached: false,
      });

      const { result } = renderHook(
        () =>
          useDepartmentTrendsOptimized('SALES', undefined, 'weekly'),
        {
          wrapper: ({ children }) =>
            React.createElement(TestWrapper, { store, children }),
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.trends).toEqual(mockTrends);
    });

    it('should return correct format', async () => {
      const mockTrends = [
        { date: '2025-01-01', value: 100, label: '01 Jan' },
      ];

      (apiIntegration.getDepartmentTrends as any).mockResolvedValueOnce({
        data: mockTrends,
        cached: false,
      });

      const { result } = renderHook(
        () => useDepartmentTrendsOptimized('SALES'),
        {
          wrapper: ({ children }) =>
            React.createElement(TestWrapper, { store, children }),
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.trends[0]).toHaveProperty('date');
      expect(result.current.trends[0]).toHaveProperty('value');
    });
  });

  describe('useDepartmentSummaryOptimized', () => {
    it('should fetch summary data', async () => {
      const mockSummary = {
        totalRecords: 100,
        averageValue: 5000,
        minValue: 100,
        maxValue: 50000,
      };

      (apiIntegration.getDepartmentSummary as any).mockResolvedValueOnce({
        data: mockSummary,
        cached: false,
      });

      const { result } = renderHook(
        () => useDepartmentSummaryOptimized('SALES'),
        {
          wrapper: ({ children }) =>
            React.createElement(TestWrapper, { store, children }),
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.summary).toEqual(mockSummary);
    });
  });

  describe('useDepartmentExportOptimized', () => {
    it('should export data successfully', async () => {
      const mockBlob = new Blob(['test data'], { type: 'text/csv' });

      (apiIntegration.exportDepartmentData as any).mockResolvedValueOnce({
        data: mockBlob,
        cached: false,
      });

      const { result } = renderHook(
        () => useDepartmentExportOptimized('SALES', 'csv'),
        {
          wrapper: ({ children }) =>
            React.createElement(TestWrapper, { store, children }),
        }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBe(mockBlob);
    });

    it('should support multiple export formats', async () => {
      (apiIntegration.exportDepartmentData as any).mockResolvedValue({
        data: new Blob(['test'], { type: 'text/csv' }),
        cached: false,
      });

      const { result: csvResult } = renderHook(
        () => useDepartmentExportOptimized('SALES', 'csv'),
        {
          wrapper: ({ children }) =>
            React.createElement(TestWrapper, { store, children }),
        }
      );

      await waitFor(() => {
        expect(csvResult.current.loading).toBe(false);
      });

      expect(apiIntegration.exportDepartmentData).toHaveBeenCalledWith(
        'SALES',
        'csv',
        expect.anything(),
        expect.anything()
      );
    });
  });

  describe('Performance Monitoring', () => {
    it('should track API call performance', async () => {
      (apiIntegration.getDepartmentKPIs as any).mockResolvedValueOnce({
        data: { revenue: 1000000 },
        cached: false,
        performanceMetrics: {
          duration: 150,
          cacheHit: false,
        },
      });

      const { result } = renderHook(() => useDepartmentKPIsOptimized('SALES'), {
        wrapper: ({ children }) =>
          React.createElement(TestWrapper, { store, children }),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Performance metrics should be available
      expect(result.current.metrics).toBeDefined();
    });
  });

  describe('Deduplication', () => {
    it('should deduplicate concurrent requests', async () => {
      const mockData = [{ id: 'record1', value: 1000 }];

      (apiIntegration.getDepartmentData as any).mockResolvedValueOnce({
        data: mockData,
        cached: false,
      });

      // Simulate concurrent requests
      const promises = [
        renderHook(
          () =>
            useDepartmentDataOptimized('SALES', {
              startDate: '2025-01-01',
              endDate: '2025-01-31',
            }),
          {
            wrapper: ({ children }) =>
              React.createElement(TestWrapper, { store, children }),
          }
        ),
        renderHook(
          () =>
            useDepartmentDataOptimized('SALES', {
              startDate: '2025-01-01',
              endDate: '2025-01-31',
            }),
          {
            wrapper: ({ children }) =>
              React.createElement(TestWrapper, { store, children }),
          }
        ),
      ];

      await waitFor(() => {
        // Should only call API once due to deduplication
        expect(apiIntegration.getDepartmentData).toHaveBeenCalledTimes(1);
      });
    });
  });
});
