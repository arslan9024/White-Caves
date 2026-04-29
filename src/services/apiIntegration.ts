/**
 * API Integration Layer
 * Connects API client, optimizer, and performance monitor
 * Provides a unified interface for all API operations
 */

import { apiClient } from './apiClient';
import { apiOptimizer, PaginationParams, PaginatedResponse } from './apiOptimizer';
import { performanceMonitor, PerformanceMetric } from './performanceMonitor';
import { optimizedDepartmentService } from './optimizedDepartmentService';

/**
 * Integration options
 */
export interface IntegrationOptions {
  enablePerformanceMonitoring: boolean;
  enableCaching: boolean;
  enableDeduplication: boolean;
  enablePagination: boolean;
  cacheTTL: number;
  verbose: boolean;
}

/**
 * API Integration Class
 * Main interface for optimized API operations
 */
export class APIIntegration {
  private options: IntegrationOptions;

  constructor(options?: Partial<IntegrationOptions>) {
    this.options = {
      enablePerformanceMonitoring: true,
      enableCaching: true,
      enableDeduplication: true,
      enablePagination: true,
      cacheTTL: 5 * 60 * 1000,
      verbose: false,
      ...options,
    };

    this.initializeOptimizations();
  }

  /**
   * Initialize optimizations based on options
   */
  private initializeOptimizations(): void {
    apiOptimizer.setCache(this.options.enableCaching);
    apiOptimizer.setDedup(this.options.enableDeduplication);
    apiOptimizer.setPagination(this.options.enablePagination);
    apiOptimizer.updateConfig({ cacheTTL: this.options.cacheTTL });

    if (!this.options.enablePerformanceMonitoring) {
      performanceMonitor.setEnabled(false);
    }

    this.log('API Integration initialized with options:', this.options);
  }

  /**
   * Get with optimization
   */
  async getOptimized<T>(
    url: string,
    cacheKey?: string,
    cacheTTL?: number
  ): Promise<T> {
    const startTime = Date.now();
    const finalCacheKey = cacheKey || url;

    try {
      this.log(`Fetching: ${url}`);

      const data = await apiOptimizer.getWithCache(
        finalCacheKey,
        async () => {
          return apiClient.get<T>(url);
        },
        cacheTTL || this.options.cacheTTL
      );

      const duration = Date.now() - startTime;
      this.recordMetric({
        name: `GET ${url}`,
        duration,
        endpoint: url,
        status: 'success',
        cached: duration < 10, // Assume cache hits are very fast
        deduped: false,
      });

      return data;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.recordMetric({
        name: `GET ${url}`,
        duration,
        endpoint: url,
        status: 'error',
        cached: false,
        deduped: false,
      });
      throw error;
    }
  }

  /**
   * Post with deduplication
   */
  async postOptimized<T>(
    url: string,
    data?: any
  ): Promise<T> {
    const startTime = Date.now();

    try {
      this.log(`Posting to: ${url}`);

      const result = await apiOptimizer.executeWithDedup(
        'POST',
        url,
        data,
        async () => {
          return apiClient.post<T>(url, data);
        }
      );

      const duration = Date.now() - startTime;
      this.recordMetric({
        name: `POST ${url}`,
        duration,
        endpoint: url,
        status: 'success',
        cached: false,
        deduped: true,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.recordMetric({
        name: `POST ${url}`,
        duration,
        endpoint: url,
        status: 'error',
        cached: false,
        deduped: false,
      });
      throw error;
    }
  }

  /**
   * Get paginated data
   */
  async getPaginated<T>(
    url: string,
    pagination: PaginationParams,
    cacheKey?: string,
    cacheTTL?: number
  ): Promise<PaginatedResponse<T>> {
    const startTime = Date.now();
    const request = apiOptimizer.buildPaginatedRequest(url, pagination);

    try {
      this.log(`Fetching paginated: ${request.url}`);

      const data = await apiOptimizer.getWithCache(
        cacheKey || request.url,
        async () => {
          return apiClient.get<T[]>(request.url);
        },
        cacheTTL || this.options.cacheTTL
      );

      const duration = Date.now() - startTime;
      this.recordMetric({
        name: `GET paginated ${url}`,
        duration,
        endpoint: url,
        status: 'success',
        cached: duration < 10,
        deduped: false,
      });

      // Create paginated response
      return apiOptimizer.createPaginatedResponse(
        data as T[],
        pagination.page || 1,
        pagination.pageSize || 20,
        (data as T[]).length
      );
    } catch (error) {
      const duration = Date.now() - startTime;
      this.recordMetric({
        name: `GET paginated ${url}`,
        duration,
        endpoint: url,
        status: 'error',
        cached: false,
        deduped: false,
      });
      throw error;
    }
  }

  /**
   * Get departments with full optimization
   */
  async getDepartments(forceRefresh = false) {
    return optimizedDepartmentService.getAllDepartments(forceRefresh);
  }

  /**
   * Get department data with full optimization
   */
  async getDepartmentData(code: string, forceRefresh = false) {
    return optimizedDepartmentService.getDepartmentData(code, forceRefresh);
  }

  /**
   * Get department KPIs with pagination
   */
  async getDepartmentKPIs(
    code: string,
    pagination?: PaginationParams,
    forceRefresh = false
  ) {
    return optimizedDepartmentService.getDepartmentKPIs(
      code,
      pagination,
      undefined,
      forceRefresh
    );
  }

  /**
   * Get department trends with pagination
   */
  async getDepartmentTrends(
    code: string,
    timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly',
    pagination?: PaginationParams,
    forceRefresh = false
  ) {
    return optimizedDepartmentService.getDepartmentTrends(
      code,
      timeframe || 'monthly',
      pagination,
      forceRefresh
    );
  }

  /**
   * Batch fetch departments
   */
  async batchFetchDepartments(codes: string[], forceRefresh = false) {
    return optimizedDepartmentService.batchFetchDepartments(codes, forceRefresh);
  }

  /**
   * Update configuration
   */
  updateConfig(options: Partial<IntegrationOptions>): void {
    this.options = { ...this.options, ...options };
    this.initializeOptimizations();
    this.log('Configuration updated:', this.options);
  }

  /**
   * Get performance stats
   */
  getPerformanceStats() {
    return performanceMonitor.getStats();
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): string {
    return performanceMonitor.getSummaryReport();
  }

  /**
   * Get optimization savings
   */
  getOptimizationSavings() {
    return performanceMonitor.getOptimizationSavings();
  }

  /**
   * Clear cache
   */
  clearCache(pattern?: string): void {
    apiOptimizer.invalidateCache(pattern);
    this.log('Cache cleared' + (pattern ? ` (pattern: ${pattern})` : ''));
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    apiOptimizer.clear();
    performanceMonitor.clearMetrics();
    this.log('All data cleared');
  }

  /**
   * Get cache info
   */
  getCacheInfo() {
    return apiOptimizer.getCacheStats();
  }

  /**
   * Record metric helper
   */
  private recordMetric(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    if (this.options.enablePerformanceMonitoring) {
      performanceMonitor.recordMetric(metric);
    }
  }

  /**
   * Log helper
   */
  private log(...args: any[]): void {
    if (this.options.verbose) {
      console.log('[APIIntegration]', ...args);
    }
  }
}

// Create singleton instance with default options
export const apiIntegration = new APIIntegration({
  enablePerformanceMonitoring: true,
  enableCaching: true,
  enableDeduplication: true,
  enablePagination: true,
  cacheTTL: 5 * 60 * 1000,
  verbose: false, // Set to true for debugging
});

export { APIIntegration };
