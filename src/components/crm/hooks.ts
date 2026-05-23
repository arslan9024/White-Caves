import { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardView, UserRole, DashboardFilters, Metric, ROLE_ACCESS_MATRIX, DashboardState } from './types';
import { RootState, AppDispatch } from '../../store/store';
import { createLogger } from '../../utils/logger';

const log = createLogger('CRM');

/**
 * Hook to manage dashboard view and loading state
 */
export const useDashboardView = (defaultView: DashboardView = 'company') => {
  const [currentView, setCurrentView] = useState<DashboardView>(defaultView);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeView = useCallback(
    async (newView: DashboardView) => {
      try {
        setLoading(true);
        setError(null);
        setCurrentView(newView);
        
        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load view');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    currentView,
    setCurrentView: changeView,
    loading,
    error,
  };
};

/**
 * Hook to manage dashboard filters
 */
export const useDashboardFilters = () => {
  const [filters, setFilters] = useState<DashboardFilters>({});

  const updateFilter = useCallback((newFilters: Partial<DashboardFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    filters,
    updateFilter,
    clearFilters,
  };
};

/**
 * Hook to manage dashboard metrics
 */
export const useDashboardMetrics = (_refreshInterval = 60000) => {
  const [metrics] = useState<Map<string, Metric>>(new Map());
  const [loading] = useState(false);

  // TODO: Implement real metrics fetch when API endpoint is ready
  // Currently a placeholder — no interval running to avoid silent CPU waste
  const refreshMetrics = useCallback(async () => {
    // No-op until API endpoint /api/metrics is implemented
  }, []);

  return {
    metrics,
    loading,
    refreshMetrics,
  };
};

/**
 * Hook to manage user access to dashboards
 */
export const useDashboardAccess = () => {
  const userRole = useSelector((state: RootState) => state.auth?.user?.role || 'agent');

  const hasAccess = useCallback(
    (requiredRoles: UserRole[]): boolean => {
      return requiredRoles.includes(userRole as UserRole);
    },
    [userRole]
  );

  const getAccessibleDashboards = useCallback((allDashboards: DashboardView[]): DashboardView[] => {
    // P2-7: Use canonical ROLE_ACCESS_MATRIX from ./types instead of a local duplicate
    const accessibleViews = ROLE_ACCESS_MATRIX[userRole as UserRole] || [];
    return allDashboards.filter((view) => accessibleViews.includes(view));
  }, [userRole]);

  return {
    userRole,
    hasAccess,
    getAccessibleDashboards,
  };
};

/**
 * Hook to manage dashboard customization
 */
export const useDashboardCustomization = () => {
  // P2-8: Use concrete customLayout type from DashboardState instead of Record<string, any>
  const [customLayout, setCustomLayout] = useState<DashboardState['customLayout']>({});
  const [expandedMetrics, setExpandedMetrics] = useState<string[]>([]);

  const toggleMetricExpanded = useCallback((metricId: string) => {
    setExpandedMetrics((prev) =>
      prev.includes(metricId) ? prev.filter((id) => id !== metricId) : [...prev, metricId]
    );
  }, []);

  const updateLayout = useCallback((newLayout: NonNullable<DashboardState['customLayout']>) => {
    setCustomLayout(newLayout);
  }, []);

  const resetCustomization = useCallback(() => {
    setCustomLayout({});
    setExpandedMetrics([]);
  }, []);

  return {
    customLayout,
    expandedMetrics,
    toggleMetricExpanded,
    updateLayout,
    resetCustomization,
  };
};

/**
 * Hook for dashboard export functionality
 */
export const useDashboardExport = () => {
  const [exporting, setExporting] = useState(false);

  const exportAsCSV = useCallback(async (data: Record<string, unknown>[], filename = 'dashboard.csv') => {
    if (!data || data.length === 0) {
      log.warn('exportAsCSV: No data to export');
      return;
    }
    try {
      setExporting(true);
      // RFC 4180: Escape fields containing commas, quotes, or newlines
      const escapeCSV = (value: unknown): string => {
        const str = String(value ?? '');
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };
      const csv = [
        Object.keys(data[0]).map(escapeCSV).join(','),
        ...data.map((row) => Object.values(row).map(escapeCSV).join(','))
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      log.error('Failed to export CSV:', error);
    } finally {
      setExporting(false);
    }
  }, []);

  const exportAsJSON = useCallback(async (data: unknown, filename = 'dashboard.json') => {
    try {
      setExporting(true);
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      log.error('Failed to export JSON:', error);
    } finally {
      setExporting(false);
    }
  }, []);

  return {
    exporting,
    exportAsCSV,
    exportAsJSON,
  };
};

/**
 * Hook for real-time dashboard updates
 */
export const useRealtimeDashboard = (enabled = true) => {
  const [reconnecting, setReconnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 5;

  useEffect(() => {
    if (!enabled) return;

    const isMountedRef = { current: true };
    let reconnectTimerId: ReturnType<typeof setTimeout> | null = null;

    const connectWebSocket = () => {
      if (!isMountedRef.current) return; // Prevent connecting after unmount

      try {
        // NOTE: Replace with actual WebSocket URL
        const wsUrl = import.meta.env.VITE_WS_URL || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/dashboard`;
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
          if (!isMountedRef.current) return;
          setIsConnected(true);
          setReconnecting(false);
          retryCountRef.current = 0; // Reset on successful connection
        };

        wsRef.current.onerror = () => {
          if (!isMountedRef.current) return;
          setIsConnected(false);
          setReconnecting(true);
        };

        wsRef.current.onclose = () => {
          if (!isMountedRef.current) return; // Don't reconnect after unmount
          setIsConnected(false);
          // Exponential backoff with max retries
          if (retryCountRef.current < MAX_RETRIES) {
            const delay = Math.min(5000 * Math.pow(2, retryCountRef.current), 60000);
            retryCountRef.current++;
            setReconnecting(true);
            reconnectTimerId = setTimeout(connectWebSocket, delay);
          } else {
            setReconnecting(false); // Give up gracefully
          }
        };
      } catch (error) {
        log.error('WebSocket connection failed:', error);
        if (isMountedRef.current) {
          setReconnecting(false);
        }
      }
    };

    connectWebSocket();

    return () => {
      isMountedRef.current = false; // Prevent all state updates after unmount
      if (reconnectTimerId !== null) {
        clearTimeout(reconnectTimerId); // Cancel any pending reconnect
      }
      if (wsRef.current) {
        wsRef.current.onclose = null; // Prevent onclose from scheduling reconnect
        wsRef.current.onerror = null;
        wsRef.current.onopen = null;
        wsRef.current.close();
      }
    };
  }, [enabled]);

  const sendMessage = useCallback((message: Record<string, unknown>) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, [isConnected]);

  return {
    isConnected,
    reconnecting,
    sendMessage,
  };
};

/**
 * Hook for dashboard performance monitoring
 */
export const useDashboardPerformance = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    dataFetchTime: 0,
    totalLoadTime: 0,
  });

  const measurePerformance = useCallback((label: string) => {
    const start = window.performance.now();

    return () => {
      const end = window.performance.now();
      const duration = end - start;

      log.debug(`${label} took ${duration.toFixed(2)}ms`);

      // P1-9: persist measurement into state so consumers can read real values
      setMetrics(prev => {
        switch (label) {
          case 'render': return { ...prev, renderTime: duration };
          case 'fetch':  return { ...prev, dataFetchTime: duration };
          case 'load':   return { ...prev, totalLoadTime: duration };
          default:       return { ...prev, renderTime: duration };
        }
      });

      return duration;
    };
  }, []);

  return {
    metrics,
    measurePerformance,
  };
};

