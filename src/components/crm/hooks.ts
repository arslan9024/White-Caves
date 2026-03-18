import { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardView, UserRole, DashboardFilters, Metric } from './types';
import { RootState, AppDispatch } from '../../store/store';

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
export const useDashboardMetrics = (refreshInterval = 60000) => {
  const dispatch = useDispatch<AppDispatch>();
  const [metrics, setMetrics] = useState<Map<string, Metric>>(new Map());
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const refreshMetrics = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch metrics from API
      // const response = await fetchDashboardMetrics();
      // setMetrics(response);
    } catch (error) {
      console.error('Failed to refresh metrics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMetrics();

    // Set up auto-refresh
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(refreshMetrics, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval, refreshMetrics]);

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
    // Filter dashboards based on user role
    const roleAccessMap: Record<UserRole, DashboardView[]> = {
      admin: ['company', 'department', 'sales', 'property', 'commission', 'leads', 'office', 'agent', 'financial', 'performance', 'inventory', 'client'],
      ceo: ['company', 'financial', 'performance'],
      coo: ['company', 'department', 'office', 'financial'],
      manager: ['department', 'sales', 'property', 'commission', 'leads', 'agent', 'office', 'performance'],
      finance: ['financial', 'commission', 'company'],
      operations: ['office', 'property', 'inventory'],
      agent: ['sales', 'leads', 'agent', 'commission', 'client'],
      viewer: ['company', 'performance'],
      support: ['client', 'leads'],
    };

    const accessibleViews = roleAccessMap[userRole as UserRole] || [];
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
  const [customLayout, setCustomLayout] = useState<Record<string, any>>({});
  const [expandedMetrics, setExpandedMetrics] = useState<string[]>([]);

  const toggleMetricExpanded = useCallback((metricId: string) => {
    setExpandedMetrics((prev) =>
      prev.includes(metricId) ? prev.filter((id) => id !== metricId) : [...prev, metricId]
    );
  }, []);

  const updateLayout = useCallback((newLayout: Record<string, any>) => {
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

  const exportAsCSV = useCallback(async (data: any[], filename = 'dashboard.csv') => {
    try {
      setExporting(true);
      const csv = [Object.keys(data[0]).join(','), ...data.map((row) => Object.values(row).join(','))].join(
        '\n'
      );
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export CSV:', error);
    } finally {
      setExporting(false);
    }
  }, []);

  const exportAsJSON = useCallback(async (data: any, filename = 'dashboard.json') => {
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
      console.error('Failed to export JSON:', error);
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

  useEffect(() => {
    if (!enabled) return;

    const connectWebSocket = () => {
      try {
        // NOTE: Replace with actual WebSocket URL
        const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/dashboard';
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
          setIsConnected(true);
          setReconnecting(false);
        };

        wsRef.current.onerror = () => {
          setIsConnected(false);
          setReconnecting(true);
        };

        wsRef.current.onclose = () => {
          setIsConnected(false);
          // Attempt to reconnect after 5 seconds
          setTimeout(connectWebSocket, 5000);
        };
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setReconnecting(true);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [enabled]);

  const sendMessage = useCallback((message: any) => {
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

      console.log(`${label} took ${duration.toFixed(2)}ms`);

      return duration;
    };
  }, []);

  return {
    metrics,
    measurePerformance,
  };
};
