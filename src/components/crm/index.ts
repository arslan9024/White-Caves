// ============================================================================
// CRM Components - Main Export File
// ============================================================================

export { default as UnifiedCRM } from './UnifiedCRM';
export type { UnifiedCRMProps } from './UnifiedCRM';

// Export custom hooks
export {
  useDashboardView,
  useDashboardFilters,
  useDashboardMetrics,
  useDashboardAccess,
  useDashboardCustomization,
  useDashboardExport,
  useRealtimeDashboard,
  useDashboardPerformance,
} from './hooks';

// Export types
export type {
  DashboardView,
  UserRole,
  Metric,
  Feature,
  DashboardConfig,
  DashboardState,
  DashboardFilters,
  DashboardContextType,
  DashboardDataResponse,
  ChartData,
} from './types';

export {
  DASHBOARD_ACTIONS,
  DEFAULT_DASHBOARD_CONFIG,
  METRIC_FORMATS,
  DASHBOARD_COLORS,
  ROLE_ACCESS_MATRIX,
} from './types';
