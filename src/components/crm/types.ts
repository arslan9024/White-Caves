// =============================================================================
// UnifiedCRM Types and Interfaces
// =============================================================================

/**
 * Common props shared by CRM module components
 * (LeadScoringModule, DLDIntegrationModule, RERAComplianceModule, PropertyValuationModule)
 */
export interface CRMModuleProps {
  role: string;
  user: {
    id: string;
    name?: string;
    email: string;
    role?: string;
  } | null;
  data?: Record<string, unknown>;
}

/**
 * Dashboard view types - all supported dashboard views
 */
export type DashboardView =
  | 'company'       // Company-wide overview
  | 'department'    // Department metrics
  | 'sales'         // Sales pipeline
  | 'property'      // Property inventory
  | 'commission'    // Commission tracking
  | 'leads'         // Lead management
  | 'office'        // Office management
  | 'agent'         // Agent performance
  | 'financial'     // Financial metrics
  | 'performance'   // KPI dashboard
  | 'inventory'     // Inventory management
  | 'client';       // Client profiles

/**
 * User roles in the system
 */
export type UserRole =
  | 'admin'
  | 'ceo'
  | 'coo'
  | 'manager'
  | 'finance'
  | 'operations'
  | 'agent'
  | 'viewer'
  | 'support';

/**
 * Metric types for different dashboard metrics
 */
export interface Metric {
  id: string;
  label: string;
  value: number;
  unit?: string;
  format?: 'currency' | 'percentage' | 'number';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
}

/**
 * Feature description for each dashboard
 */
export interface Feature {
  id: string;
  name: string;
  description: string;
  icon?: string;
  enabled: boolean;
}

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
  id: DashboardView;
  label: string;
  icon: string;
  description: string;
  roles: UserRole[];
  metrics: string[];
  features: string[];
  refreshInterval?: number; // milliseconds
  defaultMetrics?: string[];
  customization?: {
    allowResize?: boolean;
    allowReorder?: boolean;
    allowExport?: boolean;
  };
}

/**
 * Props for UnifiedCRM component
 */
export interface UnifiedCRMProps {
  defaultView?: DashboardView;
  onViewChange?: (view: DashboardView) => void;
  onMetricsUpdate?: (metrics: Metric[]) => void;
  refreshInterval?: number;
  enableExport?: boolean;
  enableCustomization?: boolean;
}

/**
 * Redux state for dashboard
 */
export interface DashboardState {
  currentView: DashboardView;
  loading: boolean;
  error: string | null;
  metrics: Metric[];
  features: Feature[];
  filters: {
    dateRange?: {
      start: string;
      end: string;
    };
    department?: string;
    agent?: string;
  };
  expandedMetrics: string[];
  customLayout?: {
    [key: string]: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
  };
}

/**
 * Filter options for dashboard
 */
export interface DashboardFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  department?: string;
  agent?: string;
  property?: string;
  client?: string;
  status?: string;
}

/**
 * Dashboard data context
 */
export interface DashboardContextType {
  currentView: DashboardView;
  userRole: UserRole;
  metrics: Map<string, Metric>;
  filters: DashboardFilters;
  setFilter: (filter: Partial<DashboardFilters>) => void;
  refreshMetrics: () => Promise<void>;
  exportData: (format: 'csv' | 'pdf' | 'excel') => void;
}

/**
 * API response for dashboard data
 */
export interface DashboardDataResponse {
  view: DashboardView;
  metrics: Metric[];
  features: Feature[];
  timestamp: string;
  success: boolean;
  error?: string;
}

/**
 * Chart data structure
 */
export interface ChartData {
  label: string;
  data: number[];
  labels: string[];
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
}

/**
 * Dashboard action types for Redux
 */
export const DASHBOARD_ACTIONS = {
  SET_VIEW: 'dashboard/setView',
  SET_LOADING: 'dashboard/setLoading',
  SET_ERROR: 'dashboard/setError',
  SET_METRICS: 'dashboard/setMetrics',
  SET_FILTERS: 'dashboard/setFilters',
  CLEAR_FILTERS: 'dashboard/clearFilters',
  SET_EXPANDED_METRICS: 'dashboard/setExpandedMetrics',
  SET_CUSTOM_LAYOUT: 'dashboard/setCustomLayout',
  RESET_DASHBOARD: 'dashboard/reset',
} as const;

/**
 * Default dashboard configurations
 */
export const DEFAULT_DASHBOARD_CONFIG: Record<DashboardView, Partial<DashboardConfig>> = {
  company: {
    refreshInterval: 60000, // 1 minute
  },
  department: {
    refreshInterval: 45000, // 45 seconds
  },
  sales: {
    refreshInterval: 30000, // 30 seconds
  },
  property: {
    refreshInterval: 120000, // 2 minutes
  },
  commission: {
    refreshInterval: 60000, // 1 minute
  },
  leads: {
    refreshInterval: 30000, // 30 seconds
  },
  office: {
    refreshInterval: 90000, // 90 seconds
  },
  agent: {
    refreshInterval: 30000, // 30 seconds
  },
  financial: {
    refreshInterval: 300000, // 5 minutes
  },
  performance: {
    refreshInterval: 60000, // 1 minute
  },
  inventory: {
    refreshInterval: 120000, // 2 minutes
  },
  client: {
    refreshInterval: 90000, // 90 seconds
  },
};

/**
 * Metric formatting utilities
 */
export const METRIC_FORMATS = {
  currency: (value: number, currency = 'AED') => {
    return `${currency} ${value.toLocaleString()}`;
  },
  percentage: (value: number) => {
    return `${value.toFixed(1)}%`;
  },
  number: (value: number) => {
    return value.toLocaleString();
  },
  short: (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  },
} as const;

/**
 * Color scheme for different dashboard elements
 */
export const DASHBOARD_COLORS = {
  primary: '#1976d2',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  neutral: '#9e9e9e',
  light: '#f5f5f5',
  dark: '#333333',
} as const;

/**
 * Role-based access matrix
 */
export const ROLE_ACCESS_MATRIX: Record<UserRole, DashboardView[]> = {
  admin: ['company', 'department', 'sales', 'property', 'commission', 'leads', 'office', 'agent', 'financial', 'performance', 'inventory', 'client'],
  ceo: ['company', 'financial', 'performance'],
  coo: ['company', 'department', 'office', 'financial'],
  manager: ['department', 'sales', 'property', 'commission', 'leads', 'agent', 'office', 'performance'],
  finance: ['financial', 'commission', 'company'],
  operations: ['office', 'property', 'inventory'],
  agent: ['sales', 'leads', 'agent', 'commission', 'client', 'property', 'performance'],
  viewer: ['company', 'performance'],
  support: ['client', 'leads'],
};
