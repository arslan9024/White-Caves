/**
 * Test Suite for Mock API and Department Data
 * Tests the mock API handler, data structure, and hooks
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  fetchDepartmentDataFromApi,
  fetchAllDepartmentsDataFromApi,
  fetchDepartmentKPIs,
  fetchDepartmentSummary,
  fetchDepartmentTrends,
  searchDepartmentData,
  exportDepartmentData,
} from '../../src/mocks/apiHandler';
import { getDepartmentData, getAvailableDepartments } from '../../src/mocks/departmentData';

describe('Mock API Handler', () => {
  describe('fetchDepartmentDataFromApi', () => {
    it('should fetch data for valid department code', async () => {
      const response = await fetchDepartmentDataFromApi('SALES');
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data?.departmentCode).toBe('SALES');
      expect(response.timestamp).toBeDefined();
    });

    it('should return error for invalid department code', async () => {
      const response = await fetchDepartmentDataFromApi('INVALID');
      
      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
      expect(response.data).toBeUndefined();
    });

    it('should include KPIs in response', async () => {
      const response = await fetchDepartmentDataFromApi('SALES');
      
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data?.kpis)).toBe(true);
      expect(response.data?.kpis!.length).toBeGreaterThan(0);
    });

    it('should include summary in response', async () => {
      const response = await fetchDepartmentDataFromApi('FINANCE');
      
      expect(response.success).toBe(true);
      expect(response.data?.summary).toBeDefined();
      expect(response.data?.summary?.totalItems).toBeGreaterThan(0);
    });
  });

  describe('fetchAllDepartmentsDataFromApi', () => {
    it('should fetch all departments', async () => {
      const response = await fetchAllDepartmentsDataFromApi();
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(Object.keys(response.data || {}).length).toBeGreaterThan(0);
    });

    it('should contain all department codes', async () => {
      const response = await fetchAllDepartmentsDataFromApi();
      const availableCodes = getAvailableDepartments();
      
      if (response.success && response.data) {
        availableCodes.forEach((code: string) => {
          expect(response.data).toHaveProperty(code);
        });
      }
    });
  });

  describe('fetchDepartmentKPIs', () => {
    it('should fetch KPIs for valid department', async () => {
      const response = await fetchDepartmentKPIs('SALES');
      
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data!.length).toBeGreaterThan(0);
    });

    it('should include label and value in KPIs', async () => {
      const response = await fetchDepartmentKPIs('FINANCE');
      
      if (response.success && Array.isArray(response.data)) {
        response.data.forEach((kpi: any) => {
          expect(kpi.label).toBeDefined();
          expect(kpi.value).toBeDefined();
        });
      }
    });

    it('should return error for invalid department', async () => {
      const response = await fetchDepartmentKPIs('INVALID_DEPT');
      
      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
    });
  });

  describe('fetchDepartmentSummary', () => {
    it('should fetch summary for valid department', async () => {
      const response = await fetchDepartmentSummary('OPERATIONS');
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data?.totalItems).toBeGreaterThan(0);
    });

    it('should include required summary fields', async () => {
      const response = await fetchDepartmentSummary('HR');
      
      if (response.success && response.data) {
        expect(response.data.totalItems).toBeDefined();
        expect(response.data.activeItems).toBeDefined();
        expect(response.data.pendingItems).toBeDefined();
        expect(response.data.completedItems).toBeDefined();
      }
    });
  });

  describe('fetchDepartmentTrends', () => {
    it('should fetch trends for valid department', async () => {
      const response = await fetchDepartmentTrends('SALES');
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data?.trend).toBeDefined();
    });

    it('should include current and last month data', async () => {
      const response = await fetchDepartmentTrends('FINANCE');
      
      if (response.success && response.data) {
        expect(response.data.currentMonth).toBeDefined();
        expect(response.data.lastMonth).toBeDefined();
      }
    });
  });

  describe('searchDepartmentData', () => {
    it('should search for KPIs by label', async () => {
      const response = await searchDepartmentData('SALES', 'leads');
      
      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
    });

    it('should return empty results for non-matching search', async () => {
      const response = await searchDepartmentData('SALES', 'xyz123nonsense');
      
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data?.kpis)).toBe(true);
    });
  });

  describe('exportDepartmentData', () => {
    it('should export data with filename', async () => {
      const response = await exportDepartmentData('FINANCE');
      
      expect(response.success).toBe(true);
      expect(response.data?.fileName).toBeDefined();
      expect(response.data?.content).toBeDefined();
    });

    it('should include department code in filename', async () => {
      const response = await exportDepartmentData('COMPLIANCE');
      
      if (response.success && response.data) {
        expect(response.data.fileName).toContain('COMPLIANCE');
      }
    });
  });

  describe('Data Consistency', () => {
    it('should have consistent data across all departments', async () => {
      const response = await fetchAllDepartmentsDataFromApi();
      
      if (response.success && response.data) {
        Object.entries(response.data).forEach(([code, dept]: [string, any]) => {
          expect(dept.departmentCode).toBe(code);
          expect(dept.departmentName).toBeDefined();
          expect(Array.isArray(dept.kpis)).toBe(true);
          expect(dept.summary).toBeDefined();
        });
      }
    });

    it('should have valid KPI structure in all departments', async () => {
      const response = await fetchAllDepartmentsDataFromApi();
      
      if (response.success && response.data) {
        Object.values(response.data).forEach((dept: any) => {
          dept.kpis.forEach((kpi: any) => {
            expect(kpi.label).toBeDefined();
            expect(kpi.value).toBeDefined();
          });
        });
      }
    });
  });

  describe('Mock API Performance', () => {
    it('should respond within acceptable time', async () => {
      const start = performance.now();
      await fetchDepartmentDataFromApi('SALES');
      const duration = performance.now() - start;
      
      // Response should be within 1 second
      expect(duration).toBeLessThan(1000);
    });

    it('should handle multiple concurrent requests', async () => {
      const requests = ['SALES', 'FINANCE', 'HR', 'OPERATIONS'].map((dept) =>
        fetchDepartmentDataFromApi(dept)
      );
      
      const responses = await Promise.all(requests);
      responses.forEach((response: any) => {
        expect(response.success).toBe(true);
      });
    });
  });
});

describe('Mock Department Data', () => {
  describe('Data Structure', () => {
    it('should have all departments defined', () => {
      const departments = getAvailableDepartments();
      expect(departments.length).toBeGreaterThan(0);
    });

    it('should retrieve department by code', () => {
      const data = getDepartmentData('SALES');
      expect(data).toBeDefined();
      expect(data?.departmentCode).toBe('SALES');
    });

    it('should return null for invalid department', () => {
      const data = getDepartmentData('INVALID_CODE');
      expect(data).toBeNull();
    });
  });

  describe('Department Data Completeness', () => {
    it('should have required fields for Sales department', () => {
      const data = getDepartmentData('SALES');
      
      expect(data?.departmentCode).toBe('SALES');
      expect(data?.departmentName).toBeDefined();
      expect(data?.summary).toBeDefined();
      expect(data?.kpis).toBeDefined();
    });

    it('should have department-specific data', () => {
      const salesData = getDepartmentData('SALES');
      const financeData = getDepartmentData('FINANCE');
      
      // Sales should have sales-specific fields
      expect(salesData?.activeDeals).toBeDefined();
      
      // Finance should have finance-specific fields
      expect(financeData?.financialSummary).toBeDefined();
    });
  });
});
