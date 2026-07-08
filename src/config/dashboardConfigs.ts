export type DashboardRole = 'owner' | 'agent' | 'manager' | 'admin';

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  enabled: boolean;
}

export interface DashboardRoleConfig {
  role: DashboardRole;
  widgets: DashboardWidgetConfig[];
}

export const DASHBOARD_CONFIGS: Record<DashboardRole, DashboardRoleConfig> = {
  owner: {
    role: 'owner',
    widgets: [
      { id: 'kpi-overview', title: 'KPI Overview', enabled: true },
      { id: 'ai-insights', title: 'AI Insights', enabled: true },
      { id: 'finance-summary', title: 'Finance Summary', enabled: true },
      { id: 'team-performance', title: 'Team Performance', enabled: true },
      { id: 'market-intel', title: 'Market Intelligence', enabled: true },
    ],
  },
  agent: {
    role: 'agent',
    widgets: [
      { id: 'my-leads', title: 'My Leads', enabled: true },
      { id: 'my-properties', title: 'My Properties', enabled: true },
      { id: 'my-viewings', title: 'My Viewings', enabled: true },
      { id: 'my-commission', title: 'My Commission', enabled: true },
      { id: 'activity-feed', title: 'Activity Feed', enabled: true },
    ],
  },
  manager: {
    role: 'manager',
    widgets: [
      { id: 'team-kpis', title: 'Team KPIs', enabled: true },
      { id: 'pipeline-health', title: 'Pipeline Health', enabled: true },
      { id: 'revenue-forecast', title: 'Revenue Forecast', enabled: true },
      { id: 'conversion-funnel', title: 'Conversion Funnel', enabled: true },
      { id: 'risk-alerts', title: 'Risk Alerts', enabled: true },
    ],
  },
  admin: {
    role: 'admin',
    widgets: [
      { id: 'system-health', title: 'System Health', enabled: true },
      { id: 'user-counts', title: 'User Counts', enabled: true },
      { id: 'security-events', title: 'Security Events', enabled: true },
      { id: 'audit-log', title: 'Audit Log', enabled: true },
      { id: 'platform-metrics', title: 'Platform Metrics', enabled: true },
    ],
  },
};

export const getDashboardRoleConfig = (role: string): DashboardRoleConfig => {
  const normalizedRole = role.toLowerCase();
  if (normalizedRole in DASHBOARD_CONFIGS) {
    return DASHBOARD_CONFIGS[normalizedRole as DashboardRole];
  }
  return DASHBOARD_CONFIGS.agent;
};
