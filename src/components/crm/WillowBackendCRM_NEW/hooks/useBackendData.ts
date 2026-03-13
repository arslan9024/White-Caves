import { useState, useMemo, useCallback } from 'react';
import { API_ENDPOINTS, DATABASE_METRICS, CACHE_STATS, SECURITY_CHECKS, REALTIME_CONNECTIONS, APIEndpoint, SecurityCheck, RealtimeConnection } from '../data/backend';
import { WILLOW_BACKEND_FEATURES } from '../data/features';

export const useBackendData = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [apis, setApis] = useState<APIEndpoint[]>(API_ENDPOINTS);
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>(SECURITY_CHECKS);
  const [realtimeConnections, setRealtimeConnections] = useState<RealtimeConnection[]>(REALTIME_CONNECTIONS);

  const apiStats = useMemo(() => ({
    totalCalls: apis.reduce((sum, e) => sum + e.calls, 0),
    avgResponseTime: Math.round(apis.reduce((sum, e) => sum + e.avgTime, 0) / apis.length),
    avgSuccessRate: (apis.reduce((sum, e) => sum + e.successRate, 0) / apis.length).toFixed(2),
    cachedEndpoints: apis.filter(e => e.cached).length
  }), [apis]);

  const getSecurityStatus = useCallback(() => {
    const passed = securityChecks.filter(c => c.status === 'pass').length;
    return {
      passed,
      total: securityChecks.length,
      percentage: Math.round((passed / securityChecks.length) * 100)
    };
  }, [securityChecks]);

  const getRealtimeStats = useCallback(() => {
    return {
      totalActive: realtimeConnections.reduce((sum, c) => sum + c.active, 0),
      totalPeak: realtimeConnections.reduce((sum, c) => sum + c.peak, 0)
    };
  }, [realtimeConnections]);

  const getCacheHealthPercentage = useCallback(() => {
    return CACHE_STATS.hitRate.toFixed(1);
  }, []);

  const getDatabaseHealth = useCallback(() => {
    const connectionPercentage = Math.round((DATABASE_METRICS.connections.current / DATABASE_METRICS.connections.max) * 100);
    return {
      connections: `${DATABASE_METRICS.connections.current}/${DATABASE_METRICS.connections.max}`,
      storage: `${DATABASE_METRICS.storage.used}/${DATABASE_METRICS.storage.total}GB`,
      connectionPercentage,
      storagePercentage: DATABASE_METRICS.storage.percentage
    };
  }, []);

  return {
    activeTab,
    setActiveTab,
    timeRange,
    setTimeRange,
    apis,
    securityChecks,
    realtimeConnections,
    apiStats,
    databaseMetrics: DATABASE_METRICS,
    cacheStats: CACHE_STATS,
    getSecurityStatus,
    getRealtimeStats,
    getCacheHealthPercentage,
    getDatabaseHealth,
    features: WILLOW_BACKEND_FEATURES
  };
};
