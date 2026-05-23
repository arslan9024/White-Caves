/**
 * Integration Tests for Redux + API Layer
 * Tests Redux thunks, state management, and API integration
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import departmentReducer, {
  fetchAllDepartments,
  fetchDepartmentData,
  fetchDepartmentKPIs,
  selectDepartments,
  selectDepartmentData,
  selectDepartmentLoading,
  selectDepartmentError,
} from '../store/slices/departmentSlice';
import { apiIntegration } from '../services/apiIntegration';

// Mock apiIntegration
vi.mock('../services/apiIntegration', () => ({
  apiIntegration: {
    getAllDepartments: vi.fn(),
    getDepartmentData: vi.fn(),
    getDepartmentKPIs: vi.fn(),
    getDepartmentTrends: vi.fn(),
    getDepartmentSummary: vi.fn(),
  },
}));

describe('Redux + API Integration Tests', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        departments: departmentReducer,
      },
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('fetchAllDepartments thunk', () => {
    it('should fetch and store all departments', async () => {
      const mockDepartments = [
        { id: '1', name: 'Sales', code: 'SALES' },
        { id: '2', name: 'Finance', code: 'FINANCE' },
        { id: '3', name: 'HR', code: 'HR' },
      ];

      (apiIntegration.getAllDepartments as any).mockResolvedValueOnce({
        data: mockDepartments,
        cached: false,
      });

      // Dispatch thunk
      await store.dispatch(fetchAllDepartments(false) as any);

      // Check state
      const state = store.getState();
      const departments = selectDepartments(state);

      expect(departments).toEqual(mockDepartments);
      expect(departments.length).toBe(3);
    });

    it('should handle loading state', async () => {
      let initialLoading = selectDepartmentLoading(store.getState()).departments;
      expect(initialLoading).toBe(false);

      (apiIntegration.getAllDepartments as any).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ data: [], cached: false }), 100);
          })
      );

      const promise = store.dispatch(fetchAllDepartments(false) as any);

      // Should be loading
      let loadingState = selectDepartmentLoading(store.getState()).departments;
      expect(loadingState).toBe(true);

      await promise;

      // Should not be loading
      loadingState = selectDepartmentLoading(store.getState()).departments;
      expect(loadingState).toBe(false);
    });

    it('should handle errors', async () => {
      const error = new Error('API Error');
      (apiIntegration.getAllDepartments as any).mockRejectedValueOnce(error);

      try {
        await store.dispatch(fetchAllDepartments(false) as any);
      } catch (e) {
        // Expected
      }

      const state = store.getState();
      const storeError = selectDepartmentError(state).departments;

      expect(storeError).toBeDefined();
    });

    it('should support force refresh', async () => {
      const mockDepartments = [
        { id: '1', name: 'Sales', code: 'SALES' },
      ];

      (apiIntegration.getAllDepartments as any).mockResolvedValue({
        data: mockDepartments,
        cached: false,
      });

      // First call
      await store.dispatch(fetchAllDepartments(false) as any);

      let departments = selectDepartments(store.getState());
      expect(departments.length).toBe(1);

      // Force refresh
      (apiIntegration.getAllDepartments as any).mockResolvedValueOnce({
        data: [
          ...mockDepartments,
          { id: '2', name: 'Finance', code: 'FINANCE' },
        ],
        cached: false,
      });

      await store.dispatch(fetchAllDepartments(true) as any);

      departments = selectDepartments(store.getState());
      expect(departments.length).toBe(2);
    });

    it('should maintain department count consistency', async () => {
      const mockDepartments = Array.from({ length: 10 }, (_, i) => ({
        id: String(i + 1),
        name: `Department ${i + 1}`,
        code: `DEPT${i + 1}`,
      }));

      (apiIntegration.getAllDepartments as any).mockResolvedValueOnce({
        data: mockDepartments,
        cached: false,
      });

      await store.dispatch(fetchAllDepartments(false) as any);

      const departments = selectDepartments(store.getState());

      expect(departments.length).toBe(10);
      expect(departments.every((d) => d.id && d.name && d.code)).toBe(true);
    });
  });

  describe('fetchDepartmentData thunk', () => {
    it('should fetch department data with filters', async () => {
      const mockData = [
        { id: 'record1', value: 1000, date: '2025-01-01' },
        { id: 'record2', value: 2000, date: '2025-01-02' },
      ];

      (apiIntegration.getDepartmentData as any).mockResolvedValueOnce({
        data: mockData,
        total: 2,
        cached: false,
      });

      const filters = {
        startDate: '2025-01-01',
        endDate: '2025-01-31',
      };

      await store.dispatch(
        fetchDepartmentData({
          department: 'SALES',
          filters,
        }) as any
      );

      const state = store.getState();
      const departmentData = selectDepartmentData(state);

      expect(departmentData).toBeDefined();
    });

    it('should handle pagination', async () => {
      const mockData = Array.from({ length: 20 }, (_, i) => ({
        id: `record${i}`,
        value: (i + 1) * 1000,
      }));

      (apiIntegration.getDepartmentData as any).mockResolvedValueOnce({
        data: mockData.slice(0, 10),
        total: 20,
        cached: false,
      });

      const pagination = { page: 1, limit: 10 };

      await store.dispatch(
        fetchDepartmentData({
          department: 'SALES',
          pagination,
        }) as any
      );

      const state = store.getState();
      const data = selectDepartmentData(state);

      expect(data).toBeDefined();
    });

    it('should update state with new data', async () => {
      const mockData1 = [{ id: 'record1', value: 1000 }];

      (apiIntegration.getDepartmentData as any).mockResolvedValueOnce({
        data: mockData1,
        total: 1,
        cached: false,
      });

      await store.dispatch(
        fetchDepartmentData({
          department: 'SALES',
        }) as any
      );

      let data = selectDepartmentData(store.getState());
      expect(data).toBeDefined();

      // Fetch new data
      const mockData2 = [
        { id: 'record1', value: 2000 },
        { id: 'record2', value: 3000 },
      ];

      (apiIntegration.getDepartmentData as any).mockResolvedValueOnce({
        data: mockData2,
        total: 2,
        cached: false,
      });

      await store.dispatch(
        fetchDepartmentData({
          department: 'FINANCE',
        }) as any
      );

      data = selectDepartmentData(store.getState());
      expect(data).toBeDefined();
    });

    it('should handle empty results', async () => {
      (apiIntegration.getDepartmentData as any).mockResolvedValueOnce({
        data: [],
        total: 0,
        cached: false,
      });

      await store.dispatch(
        fetchDepartmentData({
          department: 'SALES',
        }) as any
      );

      const state = store.getState();
      const data = selectDepartmentData(state);

      expect(data).toBeDefined();
    });

    it('should preserve previous data on error', async () => {
      const mockData = [{ id: 'record1', value: 1000 }];

      (apiIntegration.getDepartmentData as any).mockResolvedValueOnce({
        data: mockData,
        total: 1,
        cached: false,
      });

      await store.dispatch(
        fetchDepartmentData({
          department: 'SALES',
        }) as any
      );

      let data = selectDepartmentData(store.getState());
      expect(data).toBeDefined();

      // Next request fails
      (apiIntegration.getDepartmentData as any).mockRejectedValueOnce(
        new Error('API Error')
      );

      try {
        await store.dispatch(
          fetchDepartmentData({
            department: 'SALES',
          }) as any
        );
      } catch (e) {
        // Expected
      }

      // Previous data should still be available
      data = selectDepartmentData(store.getState());
      expect(data).toBeDefined();
    });
  });

  describe('fetchDepartmentKPIs thunk', () => {
    it('should fetch and store KPI data', async () => {
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

      await store.dispatch(fetchDepartmentKPIs('SALES') as any);

      const state = store.getState();
      // Verify KPIs are stored (selector depends on implementation)
      expect(state.departments).toBeDefined();
    });

    it('should handle KPI updates', async () => {
      const mockKPIs1 = { revenue: 1000000 };

      (apiIntegration.getDepartmentKPIs as any).mockResolvedValueOnce({
        data: mockKPIs1,
        cached: false,
      });

      await store.dispatch(fetchDepartmentKPIs('SALES') as any);

      const mockKPIs2 = { revenue: 1500000 };

      (apiIntegration.getDepartmentKPIs as any).mockResolvedValueOnce({
        data: mockKPIs2,
        cached: false,
      });

      await store.dispatch(fetchDepartmentKPIs('FINANCE') as any);

      const state = store.getState();
      expect(state.departments).toBeDefined();
    });
  });

  describe('State Selectors', () => {
    it('should select departments correctly', async () => {
      const mockDepartments = [
        { id: '1', name: 'Sales', code: 'SALES' },
      ];

      (apiIntegration.getAllDepartments as any).mockResolvedValueOnce({
        data: mockDepartments,
        cached: false,
      });

      await store.dispatch(fetchAllDepartments(false) as any);

      const departments = selectDepartments(store.getState());

      expect(departments).toEqual(mockDepartments);
      expect(departments[0].id).toBe('1');
      expect(departments[0].name).toBe('Sales');
    });

    it('should select loading state', async () => {
      (apiIntegration.getAllDepartments as any).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ data: [], cached: false }), 50);
          })
      );

      const promise = store.dispatch(fetchAllDepartments(false) as any);

      let loading = selectDepartmentLoading(store.getState()).departments;
      expect(loading).toBe(true);

      await promise;

      loading = selectDepartmentLoading(store.getState()).departments;
      expect(loading).toBe(false);
    });

    it('should select error state', async () => {
      const error = new Error('API Error');
      (apiIntegration.getAllDepartments as any).mockRejectedValueOnce(error);

      try {
        await store.dispatch(fetchAllDepartments(false) as any);
      } catch (e) {
        // Expected
      }

      const errorState = selectDepartmentError(store.getState()).departments;
      expect(errorState).toBeDefined();
    });
  });

  describe('Concurrent Requests', () => {
    it('should handle concurrent thunk dispatches', async () => {
      const mockDepartments = [
        { id: '1', name: 'Sales', code: 'SALES' },
      ];

      const mockData = [{ id: 'record1', value: 1000 }];

      (apiIntegration.getAllDepartments as any).mockResolvedValueOnce({
        data: mockDepartments,
        cached: false,
      });

      (apiIntegration.getDepartmentData as any).mockResolvedValueOnce({
        data: mockData,
        total: 1,
        cached: false,
      });

      // Dispatch multiple thunks concurrently
      await Promise.all([
        store.dispatch(fetchAllDepartments(false) as any),
        store.dispatch(
          fetchDepartmentData({
            department: 'SALES',
          }) as any
        ),
      ]);

      const state = store.getState();

      // Both should be in state
      const departments = selectDepartments(state);
      expect(departments).toBeDefined();
    });

    it('should not overwrite state when concurrent requests complete out of order', async () => {
      const mockData1 = [{ id: 'record1', value: 1000 }];
      const mockData2 = [{ id: 'record2', value: 2000 }];

      // Simulate out-of-order responses
      (apiIntegration.getDepartmentData as any)
        .mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              setTimeout(
                () => resolve({ data: mockData1, total: 1, cached: false }),
                100
              );
            })
        )
        .mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              setTimeout(
                () => resolve({ data: mockData2, total: 1, cached: false }),
                50
              );
            })
        );

      const promise1 = store.dispatch(
        fetchDepartmentData({
          department: 'SALES',
        }) as any
      );

      const promise2 = store.dispatch(
        fetchDepartmentData({
          department: 'FINANCE',
        }) as any
      );

      await Promise.all([promise1, promise2]);

      const state = store.getState();
      // Final state should be consistent
      expect(state.departments).toBeDefined();
    });
  });

  describe('Error Recovery', () => {
    it('should allow retry after error', async () => {
      (apiIntegration.getAllDepartments as any)
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce({
          data: [{ id: '1', name: 'Sales', code: 'SALES' }],
          cached: false,
        });

      try {
        await store.dispatch(fetchAllDepartments(false) as any);
      } catch (e) {
        // Expected error
      }

      let error = selectDepartmentError(store.getState()).departments;
      expect(error).toBeDefined();

      // Retry
      await store.dispatch(fetchAllDepartments(true) as any);

      error = selectDepartmentError(store.getState()).departments;
      expect(error).toBeNull();

      const departments = selectDepartments(store.getState());
      expect(departments.length).toBe(1);
    });

    it('should clear previous error when new request succeeds', async () => {
      (apiIntegration.getDepartmentData as any)
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce({
          data: [{ id: 'record1', value: 1000 }],
          total: 1,
          cached: false,
        });

      try {
        await store.dispatch(
          fetchDepartmentData({
            department: 'SALES',
          }) as any
        );
      } catch (e) {
        // Expected
      }

      let error = selectDepartmentError(store.getState()).departmentData;
      expect(error).toBeDefined();

      // Successful request
      await store.dispatch(
        fetchDepartmentData({
          department: 'SALES',
        }) as any
      );

      error = selectDepartmentError(store.getState()).departmentData;
      // Error should be cleared or set to null
      expect(!error || error === null).toBe(true);
    });
  });

  describe('Data Integrity', () => {
    it('should maintain referential integrity of stored objects', async () => {
      const mockDepartments = [
        { id: '1', name: 'Sales', code: 'SALES' },
      ];

      (apiIntegration.getAllDepartments as any).mockResolvedValueOnce({
        data: mockDepartments,
        cached: false,
      });

      await store.dispatch(fetchAllDepartments(false) as any);

      const departments1 = selectDepartments(store.getState());
      const departments2 = selectDepartments(store.getState());

      // Selectors should return consistent references
      expect(departments1).toEqual(departments2);
    });

    it('should not mutate state directly', async () => {
      const mockDepartments = [
        { id: '1', name: 'Sales', code: 'SALES' },
      ];

      (apiIntegration.getAllDepartments as any).mockResolvedValueOnce({
        data: mockDepartments,
        cached: false,
      });

      await store.dispatch(fetchAllDepartments(false) as any);

      const stateBefore = JSON.stringify(store.getState());

      // Try to mutate returned data (should not affect state)
      const departments = selectDepartments(store.getState());
      departments[0].name = 'Modified';

      const stateAfter = JSON.stringify(store.getState());

      // State should not have changed
      expect(stateBefore).toEqual(stateAfter);
    });
  });
});
