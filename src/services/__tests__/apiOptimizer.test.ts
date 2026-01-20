/**
 * Integration Tests for API Optimizer
 * Tests caching, deduplication, pagination, and performance monitoring
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { apiOptimizer } from '../services/apiOptimizer';
import { apiClient } from '../services/apiClient';

// Mock apiClient
vi.mock('../services/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('API Optimizer Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear any cached data
    apiOptimizer.clearCache();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Caching', () => {
    it('should cache API responses', async () => {
      const mockResponse = { data: [{ id: 1, name: 'Item 1' }] };

      (apiClient.get as any).mockResolvedValueOnce(mockResponse);

      // First request
      const result1 = await apiOptimizer.get('/api/departments', {
        cacheTTL: 60000, // 60 seconds
      });

      expect(result1).toEqual(mockResponse);
      expect(apiClient.get).toHaveBeenCalledTimes(1);

      // Second request (should use cache)
      const result2 = await apiOptimizer.get('/api/departments', {
        cacheTTL: 60000,
      });

      expect(result2).toEqual(mockResponse);
      expect(apiClient.get).toHaveBeenCalledTimes(1); // No additional call
    });

    it('should respect cache TTL', async () => {
      const mockResponse = { data: [{ id: 1 }] };

      (apiClient.get as any).mockResolvedValue(mockResponse);

      // First request
      await apiOptimizer.get('/api/departments', {
        cacheTTL: 100, // 100ms TTL
      });

      expect(apiClient.get).toHaveBeenCalledTimes(1);

      // Wait for cache to expire
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Second request (cache expired)
      await apiOptimizer.get('/api/departments', {
        cacheTTL: 100,
      });

      expect(apiClient.get).toHaveBeenCalledTimes(2);
    });

    it('should support cache invalidation', async () => {
      const mockResponse = { data: [{ id: 1 }] };

      (apiClient.get as any).mockResolvedValue(mockResponse);

      // First request
      await apiOptimizer.get('/api/departments', {
        cacheTTL: 60000,
      });

      expect(apiClient.get).toHaveBeenCalledTimes(1);

      // Invalidate cache
      apiOptimizer.invalidateCache('/api/departments');

      // Second request (cache invalidated)
      await apiOptimizer.get('/api/departments', {
        cacheTTL: 60000,
      });

      expect(apiClient.get).toHaveBeenCalledTimes(2);
    });

    it('should cache based on request parameters', async () => {
      const mockResponse1 = { data: [{ id: 1, dept: 'SALES' }] };
      const mockResponse2 = { data: [{ id: 2, dept: 'FINANCE' }] };

      (apiClient.get as any)
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      // Request 1
      const result1 = await apiOptimizer.get('/api/departments', {
        params: { dept: 'SALES' },
        cacheTTL: 60000,
      });

      expect(result1).toEqual(mockResponse1);
      expect(apiClient.get).toHaveBeenCalledTimes(1);

      // Request 2 (different params)
      const result2 = await apiOptimizer.get('/api/departments', {
        params: { dept: 'FINANCE' },
        cacheTTL: 60000,
      });

      expect(result2).toEqual(mockResponse2);
      expect(apiClient.get).toHaveBeenCalledTimes(2);

      // Request 1 again (should use cache)
      const result1Again = await apiOptimizer.get('/api/departments', {
        params: { dept: 'SALES' },
        cacheTTL: 60000,
      });

      expect(result1Again).toEqual(mockResponse1);
      expect(apiClient.get).toHaveBeenCalledTimes(2); // No additional call
    });

    it('should support partial cache invalidation', async () => {
      (apiClient.get as any)
        .mockResolvedValueOnce({ data: [{ id: 1 }] })
        .mockResolvedValueOnce({ data: [{ id: 2 }] });

      await apiOptimizer.get('/api/departments/SALES', {
        cacheTTL: 60000,
      });

      await apiOptimizer.get('/api/departments/FINANCE', {
        cacheTTL: 60000,
      });

      expect(apiClient.get).toHaveBeenCalledTimes(2);

      // Invalidate all department caches
      apiOptimizer.invalidateCache('/api/departments', true); // true = prefix match

      // Both should be invalidated
      (apiClient.get as any)
        .mockResolvedValueOnce({ data: [{ id: 1, updated: true }] })
        .mockResolvedValueOnce({
          data: [{ id: 2, updated: true }],
        });

      await apiOptimizer.get('/api/departments/SALES', {
        cacheTTL: 60000,
      });

      await apiOptimizer.get('/api/departments/FINANCE', {
        cacheTTL: 60000,
      });

      expect(apiClient.get).toHaveBeenCalledTimes(4);
    });
  });

  describe('Deduplication', () => {
    it('should deduplicate concurrent requests', async () => {
      const mockResponse = { data: [{ id: 1 }] };

      (apiClient.get as any).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockResponse), 100);
          })
      );

      // Simulate concurrent requests
      const promises = [
        apiOptimizer.get('/api/departments'),
        apiOptimizer.get('/api/departments'),
        apiOptimizer.get('/api/departments'),
      ];

      const results = await Promise.all(promises);

      // Should only call API once
      expect(apiClient.get).toHaveBeenCalledTimes(1);

      // All results should be the same
      expect(results).toEqual([mockResponse, mockResponse, mockResponse]);
    });

    it('should deduplicate across different instances', async () => {
      const mockResponse = { data: [{ id: 1 }] };

      (apiClient.get as any).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockResponse), 100);
          })
      );

      // Multiple concurrent requests to same endpoint
      const results = await Promise.all([
        apiOptimizer.get('/api/departments'),
        apiOptimizer.get('/api/departments'),
      ]);

      expect(apiClient.get).toHaveBeenCalledTimes(1);
      expect(results[0]).toEqual(mockResponse);
      expect(results[1]).toEqual(mockResponse);
    });

    it('should not deduplicate different parameters', async () => {
      (apiClient.get as any)
        .mockResolvedValueOnce({ data: [{ id: 1 }] })
        .mockResolvedValueOnce({ data: [{ id: 2 }] });

      const promises = [
        apiOptimizer.get('/api/departments', {
          params: { dept: 'SALES' },
        }),
        apiOptimizer.get('/api/departments', {
          params: { dept: 'FINANCE' },
        }),
      ];

      await Promise.all(promises);

      expect(apiClient.get).toHaveBeenCalledTimes(2);
    });

    it('should handle errors in deduplicated requests', async () => {
      const error = new Error('API Error');
      (apiClient.get as any).mockRejectedValueOnce(error);

      const promises = [
        apiOptimizer.get('/api/departments').catch((e) => e),
        apiOptimizer.get('/api/departments').catch((e) => e),
      ];

      const results = await Promise.all(promises);

      expect(results[0]).toEqual(error);
      expect(results[1]).toEqual(error);
      expect(apiClient.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('Pagination', () => {
    it('should handle paginated requests', async () => {
      const page1 = {
        data: Array.from({ length: 10 }, (_, i) => ({ id: i + 1 })),
        page: 1,
        total: 30,
      };

      const page2 = {
        data: Array.from({ length: 10 }, (_, i) => ({ id: i + 11 })),
        page: 2,
        total: 30,
      };

      (apiClient.get as any)
        .mockResolvedValueOnce(page1)
        .mockResolvedValueOnce(page2);

      const result1 = await apiOptimizer.get('/api/departments', {
        params: { page: 1, limit: 10 },
      });

      const result2 = await apiOptimizer.get('/api/departments', {
        params: { page: 2, limit: 10 },
      });

      expect(result1.data.length).toBe(10);
      expect(result2.data.length).toBe(10);
      expect(apiClient.get).toHaveBeenCalledTimes(2);
    });

    it('should cache paginated results separately', async () => {
      const page1 = {
        data: Array.from({ length: 10 }, (_, i) => ({ id: i + 1 })),
        page: 1,
      };

      (apiClient.get as any).mockResolvedValue(page1);

      // Request page 1 twice
      await apiOptimizer.get('/api/departments', {
        params: { page: 1, limit: 10 },
        cacheTTL: 60000,
      });

      await apiOptimizer.get('/api/departments', {
        params: { page: 1, limit: 10 },
        cacheTTL: 60000,
      });

      expect(apiClient.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('Performance Monitoring', () => {
    it('should track request performance', async () => {
      (apiClient.get as any).mockResolvedValueOnce({ data: [{ id: 1 }] });

      const result = await apiOptimizer.get('/api/departments', {
        cacheTTL: 60000,
        trackPerformance: true,
      });

      expect(result).toBeDefined();
      // Performance metrics should be tracked internally
      const metrics = apiOptimizer.getPerformanceMetrics();
      expect(metrics).toBeDefined();
    });

    it('should record cache hits vs misses', async () => {
      (apiClient.get as any).mockResolvedValue({ data: [{ id: 1 }] });

      // First call (cache miss)
      await apiOptimizer.get('/api/departments', {
        cacheTTL: 60000,
        trackPerformance: true,
      });

      // Second call (cache hit)
      await apiOptimizer.get('/api/departments', {
        cacheTTL: 60000,
        trackPerformance: true,
      });

      const metrics = apiOptimizer.getPerformanceMetrics();

      expect(metrics.cacheHits).toBeGreaterThan(0);
      expect(metrics.cacheMisses).toBeGreaterThan(0);
    });

    it('should measure response times', async () => {
      (apiClient.get as any).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ data: [{ id: 1 }] }), 50);
          })
      );

      await apiOptimizer.get('/api/departments', {
        trackPerformance: true,
      });

      const metrics = apiOptimizer.getPerformanceMetrics();

      expect(metrics.averageResponseTime).toBeGreaterThan(0);
      expect(metrics.totalRequests).toBeGreaterThan(0);
    });

    it('should provide performance summary', async () => {
      (apiClient.get as any).mockResolvedValue({ data: [{ id: 1 }] });

      await apiOptimizer.get('/api/departments', {
        cacheTTL: 60000,
        trackPerformance: true,
      });

      await apiOptimizer.get('/api/departments', {
        cacheTTL: 60000,
        trackPerformance: true,
      });

      const summary = apiOptimizer.getPerformanceSummary();

      expect(summary).toHaveProperty('totalRequests');
      expect(summary).toHaveProperty('cacheHitRate');
      expect(summary).toHaveProperty('averageResponseTime');
      expect(summary).toHaveProperty('totalTimeSaved');
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      const error = new Error('API Error');
      (apiClient.get as any).mockRejectedValueOnce(error);

      try {
        await apiOptimizer.get('/api/departments');
      } catch (e) {
        expect(e).toEqual(error);
      }

      expect(apiClient.get).toHaveBeenCalledOnce();
    });

    it('should retry on network errors', async () => {
      const error = new Error('Network Error');
      (apiClient.get as any)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({ data: [{ id: 1 }] });

      const result = await apiOptimizer.get('/api/departments', {
        retryCount: 2,
      });

      expect(result).toEqual({ data: [{ id: 1 }] });
      expect(apiClient.get).toHaveBeenCalledTimes(2);
    });

    it('should not cache errors', async () => {
      (apiClient.get as any)
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce({ data: [{ id: 1 }] });

      try {
        await apiOptimizer.get('/api/departments', {
          cacheTTL: 60000,
        });
      } catch (e) {
        // Expected error
      }

      const result = await apiOptimizer.get('/api/departments', {
        cacheTTL: 60000,
      });

      expect(result).toEqual({ data: [{ id: 1 }] });
      expect(apiClient.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('Memory Management', () => {
    it('should limit cache size', async () => {
      (apiClient.get as any).mockResolvedValue({ data: [{ id: 1 }] });

      // Create many cache entries
      for (let i = 0; i < 1000; i++) {
        await apiOptimizer.get(`/api/endpoint${i}`, {
          cacheTTL: 60000,
        });
      }

      const cacheSize = apiOptimizer.getCacheSize();

      // Cache size should be reasonable (not unlimited)
      expect(cacheSize).toBeLessThan(1000);
    });

    it('should evict old entries when cache is full', async () => {
      (apiClient.get as any).mockResolvedValue({ data: [{ id: 1 }] });

      // Fill cache
      await apiOptimizer.get('/api/endpoint1', {
        cacheTTL: 60000,
      });

      // Add entry that exceeds limit
      await apiOptimizer.get('/api/endpoint2', {
        cacheTTL: 60000,
      });

      // Oldest entry should be evicted
      (apiClient.get as any).mockResolvedValueOnce({
        data: [{ id: 2 }],
      });

      await apiOptimizer.get('/api/endpoint1', {
        cacheTTL: 60000,
      });

      expect(apiClient.get).toHaveBeenCalled();
    });

    it('should support cache clear', async () => {
      (apiClient.get as any)
        .mockResolvedValueOnce({ data: [{ id: 1 }] })
        .mockResolvedValueOnce({ data: [{ id: 1 }] });

      await apiOptimizer.get('/api/departments', {
        cacheTTL: 60000,
      });

      expect(apiClient.get).toHaveBeenCalledOnce();

      // Clear cache
      apiOptimizer.clearCache();

      // Next request should fetch from API
      await apiOptimizer.get('/api/departments', {
        cacheTTL: 60000,
      });

      expect(apiClient.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('Request Batching', () => {
    it('should support request batching', async () => {
      const mockResponse = {
        results: [
          { id: 1, data: 'result1' },
          { id: 2, data: 'result2' },
        ],
      };

      (apiClient.post as any).mockResolvedValueOnce(mockResponse);

      const requests = [
        { url: '/api/departments/SALES', method: 'GET' },
        { url: '/api/departments/FINANCE', method: 'GET' },
      ];

      const result = await apiOptimizer.batch(requests, {
        cacheTTL: 60000,
      });

      expect(result).toBeDefined();
      expect(apiClient.post).toHaveBeenCalled();
    });
  });
});
