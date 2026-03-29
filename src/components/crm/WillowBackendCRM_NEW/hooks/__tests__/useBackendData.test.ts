import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock the data imports
vi.mock('../../data/backend', () => ({
  API_ENDPOINTS: [
    { path: '/api/properties', method: 'GET', avgTime: 100, successRate: 99.5, calls: 1000, cached: true },
    { path: '/api/leads', method: 'POST', avgTime: 200, successRate: 98.0, calls: 500, cached: false },
  ],
  DATABASE_METRICS: {
    connections: { current: 25, max: 100, available: 75 },
    queryPerformance: { avgTime: 15, slowQueries: 3, indexHits: 95 },
    storage: { used: 50, total: 100, percentage: 50 },
    operations: { reads: 5000, writes: 1000, updates: 200, deletes: 50 },
  },
  CACHE_STATS: {
    hitRate: 94.5,
    missRate: 5.5,
    totalHits: 234567,
    totalMisses: 13456,
    memoryUsed: 256,
    memoryTotal: 512,
    ttlAvg: 3600,
  },
  SECURITY_CHECKS: [
    { name: 'SSL/TLS Configuration', status: 'pass', lastCheck: '2 hours ago' },
    { name: 'CORS Policy', status: 'warning', lastCheck: '1 hour ago' },
    { name: 'Authentication', status: 'pass', lastCheck: '3 hours ago' },
  ],
  REALTIME_CONNECTIONS: [
    { type: 'WebSocket', active: 45, peak: 120, status: 'healthy' },
    { type: 'SSE', active: 20, peak: 80, status: 'healthy' },
    { type: 'Long Polling', active: 5, peak: 30, status: 'degraded' },
  ],
}));

vi.mock('../../data/features', () => ({
  WILLOW_BACKEND_FEATURES: [
    { id: 'api_management', name: 'API Management', description: 'RESTful API monitoring', category: 'core' },
  ],
}));

import { useBackendData } from '../useBackendData';

describe('useBackendData', () => {
  it('should return initial state values', () => {
    const { result } = renderHook(() => useBackendData());

    expect(result.current.activeTab).toBe('overview');
    expect(result.current.timeRange).toBe('24h');
  });

  it('should expose state setters', () => {
    const { result } = renderHook(() => useBackendData());

    act(() => {
      result.current.setActiveTab('security');
    });
    expect(result.current.activeTab).toBe('security');

    act(() => {
      result.current.setTimeRange('7d');
    });
    expect(result.current.timeRange).toBe('7d');
  });

  it('should return apis, securityChecks, and realtimeConnections arrays', () => {
    const { result } = renderHook(() => useBackendData());

    expect(result.current.apis).toHaveLength(2);
    expect(result.current.securityChecks).toHaveLength(3);
    expect(result.current.realtimeConnections).toHaveLength(3);
  });

  describe('apiStats', () => {
    it('should calculate total calls correctly', () => {
      const { result } = renderHook(() => useBackendData());
      // 1000 + 500 = 1500
      expect(result.current.apiStats.totalCalls).toBe(1500);
    });

    it('should calculate average response time', () => {
      const { result } = renderHook(() => useBackendData());
      // Math.round((100 + 200) / 2) = 150
      expect(result.current.apiStats.avgResponseTime).toBe(150);
    });

    it('should calculate average success rate', () => {
      const { result } = renderHook(() => useBackendData());
      // (99.5 + 98.0) / 2 = 98.75
      expect(result.current.apiStats.avgSuccessRate).toBe('98.75');
    });

    it('should calculate cached endpoints count', () => {
      const { result } = renderHook(() => useBackendData());
      // Only 1 endpoint is cached
      expect(result.current.apiStats.cachedEndpoints).toBe(1);
    });
  });

  describe('getSecurityStatus', () => {
    it('should return correct passed/total/percentage', () => {
      const { result } = renderHook(() => useBackendData());
      const status = result.current.getSecurityStatus();

      expect(status.passed).toBe(2); // 2 passed, 1 warning
      expect(status.total).toBe(3);
      expect(status.percentage).toBe(67); // Math.round(2/3 * 100)
    });
  });

  describe('getRealtimeStats', () => {
    it('should return total active and peak connections', () => {
      const { result } = renderHook(() => useBackendData());
      const stats = result.current.getRealtimeStats();

      expect(stats.totalActive).toBe(70); // 45 + 20 + 5
      expect(stats.totalPeak).toBe(230); // 120 + 80 + 30
    });
  });

  describe('getCacheHealthPercentage', () => {
    it('should return formatted cache hit rate', () => {
      const { result } = renderHook(() => useBackendData());
      const percentage = result.current.getCacheHealthPercentage();

      expect(percentage).toBe('94.5');
    });
  });

  describe('getDatabaseHealth', () => {
    it('should return formatted connection info', () => {
      const { result } = renderHook(() => useBackendData());
      const health = result.current.getDatabaseHealth();

      expect(health.connections).toBe('25/100');
      expect(health.connectionPercentage).toBe(25);
    });

    it('should return formatted storage info', () => {
      const { result } = renderHook(() => useBackendData());
      const health = result.current.getDatabaseHealth();

      expect(health.storage).toBe('50/100GB');
      expect(health.storagePercentage).toBe(50);
    });
  });

  it('should expose databaseMetrics and cacheStats', () => {
    const { result } = renderHook(() => useBackendData());

    expect(result.current.databaseMetrics).toBeDefined();
    expect(result.current.databaseMetrics.connections.current).toBe(25);
    expect(result.current.cacheStats).toBeDefined();
    expect(result.current.cacheStats.hitRate).toBe(94.5);
  });

  it('should expose features data', () => {
    const { result } = renderHook(() => useBackendData());

    expect(result.current.features).toHaveLength(1);
    expect(result.current.features[0].name).toBe('API Management');
  });
});
