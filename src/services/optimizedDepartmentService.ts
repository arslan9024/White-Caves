/**
 * Optimized Department Service
 * Extends the base department service with caching, pagination, and deduplication
 */

import { apiOptimizer, PaginationParams, PaginatedResponse } from './apiOptimizer';
import {
  DepartmentService,
  DepartmentData,
  KPI,
  Trend,
  DepartmentSummary,
  DateRange,
} from './departmentService';

/**
 * Optimized Department Service Class
 * Wraps the base service with optimization features
 */
export class OptimizedDepartmentService {
  private baseService: DepartmentService;

  constructor(baseService: DepartmentService) {
    this.baseService = baseService;
  }

  /**
   * Get all departments with caching
   */
  async getAllDepartments(forceRefresh = false): Promise<{ code: string; name: string }[]> {
    const cacheKey = 'departments:list';

    if (forceRefresh) {
      apiOptimizer.invalidateCache('departments');
    }

    return apiOptimizer.getWithCache(
      cacheKey,
      () => this.baseService.getAllDepartments(),
      10 * 60 * 1000 // 10 minutes for list
    );
  }

  /**
   * Get department data with caching and deduplication
   */
  async getDepartmentData(
    code: string,
    forceRefresh = false
  ): Promise<DepartmentData> {
    const cacheKey = `departments:data:${code}`;

    if (forceRefresh) {
      apiOptimizer.invalidateCache(`departments:data:${code}`);
    }

    return apiOptimizer.getWithCache(
      cacheKey,
      () => this.baseService.getDepartmentData(code),
      5 * 60 * 1000 // 5 minutes
    );
  }

  /**
   * Get department KPIs with pagination and caching
   */
  async getDepartmentKPIs(
    code: string,
    pagination?: PaginationParams,
    dateRange?: DateRange,
    forceRefresh = false
  ): Promise<PaginatedResponse<KPI>> {
    const params = pagination || { page: 1, pageSize: 20 };
    const cacheKey = `departments:kpis:${code}:page-${params.page}`;

    if (forceRefresh) {
      apiOptimizer.invalidateCache(`departments:kpis:${code}`);
    }

    const kpis = await apiOptimizer.getWithCache(
      cacheKey,
      () => this.baseService.getDepartmentKPIs(code, dateRange),
      3 * 60 * 1000 // 3 minutes
    );

    // Apply pagination to results
    const totalRecords = kpis.length;
    const pageSize = params.pageSize;
    const page = params.page;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedKPIs = kpis.slice(startIndex, endIndex);

    return apiOptimizer.createPaginatedResponse(
      paginatedKPIs,
      page,
      pageSize,
      totalRecords
    );
  }

  /**
   * Get department trends with pagination and caching
   */
  async getDepartmentTrends(
    code: string,
    timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly',
    pagination?: PaginationParams,
    forceRefresh = false
  ): Promise<PaginatedResponse<Trend>> {
    const params = pagination || { page: 1, pageSize: 50 };
    const cacheKey = `departments:trends:${code}:${timeframe}`;

    if (forceRefresh) {
      apiOptimizer.invalidateCache(`departments:trends:${code}`);
    }

    const trends = await apiOptimizer.getWithCache(
      cacheKey,
      () => this.baseService.getDepartmentTrends(code, timeframe),
      5 * 60 * 1000 // 5 minutes
    );

    // Apply pagination to results
    const totalRecords = trends.length;
    const pageSize = params.pageSize;
    const page = params.page;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTrends = trends.slice(startIndex, endIndex);

    return apiOptimizer.createPaginatedResponse(
      paginatedTrends,
      page,
      pageSize,
      totalRecords
    );
  }

  /**
   * Get department summary with caching
   */
  async getDepartmentSummary(
    code: string,
    forceRefresh = false
  ): Promise<DepartmentSummary> {
    const cacheKey = `departments:summary:${code}`;

    if (forceRefresh) {
      apiOptimizer.invalidateCache(`departments:summary:${code}`);
    }

    return apiOptimizer.getWithCache(
      cacheKey,
      () => this.baseService.getDepartmentSummary(code),
      5 * 60 * 1000 // 5 minutes
    );
  }

  /**
   * Batch fetch departments data
   * Optimized for fetching multiple departments with deduplication
   */
  async batchFetchDepartments(
    codes: string[],
    forceRefresh = false
  ): Promise<Map<string, DepartmentData>> {
    if (forceRefresh) {
      apiOptimizer.invalidateCache('departments:data');
    }

    // Use Promise.all for parallel requests with deduplication
    const promises = codes.map((code) =>
      this.getDepartmentData(code, forceRefresh)
        .then((data) => ({ code, data }))
        .catch((error) => {
          console.error(`[OptimizedDepartmentService] Error fetching ${code}:`, error);
          return { code, data: null };
        })
    );

    const results = await Promise.all(promises);

    // Convert to map
    const map = new Map<string, DepartmentData>();
    results.forEach(({ code, data }) => {
      if (data) {
        map.set(code, data);
      }
    });

    return map;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): any {
    return apiOptimizer.getCacheStats();
  }

  /**
   * Clear all caches
   */
  clearCache(pattern?: string): void {
    apiOptimizer.invalidateCache(pattern);
  }

  /**
   * Update cache TTL settings
   */
  updateCacheTTL(ttl: number): void {
    apiOptimizer.updateConfig({ cacheTTL: ttl });
  }

  /**
   * Enable/disable optimizations
   */
  setOptimizations(
    enableCache?: boolean,
    enableDedup?: boolean,
    enablePagination?: boolean
  ): void {
    if (enableCache !== undefined) {
      apiOptimizer.setCache(enableCache);
    }
    if (enableDedup !== undefined) {
      apiOptimizer.setDedup(enableDedup);
    }
    if (enablePagination !== undefined) {
      apiOptimizer.setPagination(enablePagination);
    }
  }
}

// Create singleton instance with base service
import { departmentService } from './departmentService';
export const optimizedDepartmentService = new OptimizedDepartmentService(
  departmentService
);
