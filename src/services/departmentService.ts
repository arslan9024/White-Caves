/**
 * Department API Service
 * Handles all department-related API calls with proper typing and error handling
 */

import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/apiConfig';

/**
 * KPI Interface
 */
export interface KPI {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
  color?: string;
}

/**
 * Trend Interface
 */
export interface Trend {
  date: string;
  value: number;
  label?: string;
  timestamp?: number;
}

/**
 * Department Summary Interface
 */
export interface DepartmentSummary {
  totalRecords: number;
  activeRecords: number;
  inactiveRecords: number;
  lastUpdated: string;
  percentChange?: number;
}

/**
 * Department Data Interface
 */
export interface DepartmentData {
  code: string;
  name: string;
  departmentCode: string; // Alias for code (backward compatibility)
  departmentName: string; // Alias for name (backward compatibility)
  description?: string;
  kpis: KPI[];
  summary: DepartmentSummary;
  trends: Trend[];
  lastFetch?: number;
}

/**
 * Date Range Interface
 */
export interface DateRange {
  from: string;
  to: string;
}

/**
 * Department Service Class
 */
class DepartmentService {
  /**
   * Get all available departments
   */
  async getAllDepartments(): Promise<{ code: string; name: string }[]> {
    try {
      console.log('[DepartmentService] Fetching all departments...');

      const data = await apiClient.get<{
        departments: { code: string; name: string }[];
      }>(API_ENDPOINTS.departments.list);

      console.log('[DepartmentService] Departments fetched:', data.departments);
      return data.departments || [];
    } catch (error) {
      console.error('[DepartmentService] Error fetching departments:', error);
      throw error;
    }
  }

  /**
   * Get complete department data including KPIs and trends
   */
  async getDepartmentData(code: string): Promise<DepartmentData> {
    try {
      console.log(`[DepartmentService] Fetching data for department: ${code}`);

      const data = await apiClient.get<DepartmentData>(
        API_ENDPOINTS.departments.data(code)
      );

      // Add fetch timestamp
      return {
        ...data,
        lastFetch: Date.now(),
      };
    } catch (error) {
      console.error(
        `[DepartmentService] Error fetching department data for ${code}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get KPIs for a specific department
   * Can optionally filter by date range
   */
  async getDepartmentKPIs(
    code: string,
    dateRange?: DateRange
  ): Promise<KPI[]> {
    try {
      console.log(
        `[DepartmentService] Fetching KPIs for department: ${code}`,
        dateRange
      );

      const params = dateRange
        ? {
            fromDate: dateRange.from,
            toDate: dateRange.to,
          }
        : {};

      const data = await apiClient.get<{ kpis: KPI[] }>(
        API_ENDPOINTS.departments.kpis(code),
        { params }
      );

      return data.kpis || [];
    } catch (error) {
      console.error(`[DepartmentService] Error fetching KPIs for ${code}:`, error);
      throw error;
    }
  }

  /**
   * Get trends for a specific department
   */
  async getDepartmentTrends(
    code: string,
    timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'
  ): Promise<Trend[]> {
    try {
      console.log(
        `[DepartmentService] Fetching trends for department: ${code}, timeframe: ${timeframe}`
      );

      const data = await apiClient.get<{ trends: Trend[] }>(
        API_ENDPOINTS.departments.trends(code),
        {
          params: { timeframe },
        }
      );

      return data.trends || [];
    } catch (error) {
      console.error(
        `[DepartmentService] Error fetching trends for ${code}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get summary for a specific department
   */
  async getDepartmentSummary(code: string): Promise<DepartmentSummary> {
    try {
      console.log(`[DepartmentService] Fetching summary for department: ${code}`);

      const data = await apiClient.get<{ summary: DepartmentSummary }>(
        API_ENDPOINTS.departments.summary(code)
      );

      return data.summary || {};
    } catch (error) {
      console.error(
        `[DepartmentService] Error fetching summary for ${code}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Search departments by query
   */
  async searchDepartments(query: string): Promise<DepartmentData[]> {
    try {
      console.log('[DepartmentService] Searching departments:', query);

      const data = await apiClient.get<{ departments: DepartmentData[] }>(
        API_ENDPOINTS.departments.search,
        {
          params: { q: query },
        }
      );

      return data.departments || [];
    } catch (error) {
      console.error('[DepartmentService] Error searching departments:', error);
      throw error;
    }
  }

  /**
   * Export department data in various formats
   */
  async exportDepartmentData(
    code: string,
    format: 'csv' | 'excel' | 'pdf' | 'json' = 'csv'
  ): Promise<Blob> {
    try {
      console.log(
        `[DepartmentService] Exporting department ${code} as ${format}`
      );

      const blob = await apiClient.download(
        API_ENDPOINTS.departments.export(code),
        {
          params: { format },
        }
      );

      return blob;
    } catch (error) {
      console.error(
        `[DepartmentService] Error exporting data for ${code}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Download file from blob
   * Helper method for browser file downloads
   */
  downloadFile(blob: Blob, filename: string): void {
    try {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[DepartmentService] Error downloading file:', error);
      throw error;
    }
  }

  /**
   * Cache management - get cached data
   */
  private cache: Map<string, { data: any; timestamp: number }> = new Map();

  /**
   * Get from cache if available and not expired
   */
  public getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    const age = now - cached.timestamp;

    // Return if still fresh (5 minutes)
    if (age < 5 * 60 * 1000) {
      console.log(`[DepartmentService] Cache hit for: ${key}`);
      return cached.data;
    }

    // Remove stale cache
    this.cache.delete(key);
    return null;
  }

  /**
   * Set cache
   */
  public setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear all cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear specific cache entry
   */
  public clearCacheEntry(key: string): void {
    this.cache.delete(key);
  }
}

// Export singleton instance
export const departmentService = new DepartmentService();

// Export class for testing
export { DepartmentService };
