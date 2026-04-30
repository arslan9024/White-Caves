/**
 * Department KPI Renderer
 * Maps department data to KPI cards
 */

import React from 'react';
import { KPICard } from '../components/cards/KPICard';
import styled from 'styled-components';

const KPIGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

interface DepartmentKPIConfig {
  key: string; // Data key to extract
  label: string; // Display label
  format?: (value: unknown) => string; // Format the value
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  showProgress?: boolean;
  unit?: string;
}

/**
 * Generic KPI renderer for any department
 */
export const renderDepartmentKPIs = (
  data: Record<string, unknown>,
  kpiConfigs: DepartmentKPIConfig[]
): React.ReactNode => {
  return (
    <KPIGridContainer>
      {kpiConfigs.map(config => {
        const value = data?.[config.key];
        const displayValue = config.format ? config.format(value) : value;

        return (
          <KPICard
            key={config.key}
            label={config.label}
            value={displayValue}
            icon={config.icon}
            trend={config.trend}
            showProgress={config.showProgress}
            unit={config.unit}
          />
        );
      })}
    </KPIGridContainer>
  );
};

/**
 * KPI Renderers for specific departments
 */

// Sales Department KPIs
export const SalesKPIRenderer = (data: Record<string, unknown>) =>
  renderDepartmentKPIs(data, [
    {
      key: 'totalLeads',
      label: 'Total Leads',
      icon: '👥',
      trend: 'up',
      format: v => v?.toLocaleString() || '0',
    },
    {
      key: 'activeDeals',
      label: 'Active Deals',
      icon: '🤝',
      format: v => v || '0',
    },
    {
      key: 'conversionRate',
      label: 'Conversion Rate',
      icon: '📈',
      trend: 'up',
      format: v => `${v?.toFixed(1) || '0'}%`,
      unit: '%',
    },
    {
      key: 'monthlyRevenue',
      label: 'Monthly Revenue',
      icon: '💰',
      trend: 'up',
      format: v => `₹${(v / 1000000)?.toFixed(1) || '0'}M`,
    },
  ]);

// Finance Department KPIs
export const FinanceKPIRenderer = (data: Record<string, unknown>) =>
  renderDepartmentKPIs(data, [
    {
      key: 'totalBudget',
      label: 'Total Budget',
      icon: '💵',
      format: v => `₹${(v / 1000000)?.toFixed(2) || '0'}M`,
    },
    {
      key: 'spent',
      label: 'Amount Spent',
      icon: '💸',
      trend: 'down',
      format: v => `₹${(v / 1000000)?.toFixed(2) || '0'}M`,
    },
    {
      key: 'remaining',
      label: 'Remaining Budget',
      icon: '🏦',
      trend: 'up',
      format: v => `₹${(v / 1000000)?.toFixed(2) || '0'}M`,
    },
    {
      key: 'utilizationRate',
      label: 'Budget Utilization',
      icon: '📊',
      showProgress: true,
      format: v => `${v?.toFixed(0) || '0'}%`,
      unit: '%',
    },
  ]);

// HR Department KPIs
export const HRKPIRenderer = (data: Record<string, unknown>) =>
  renderDepartmentKPIs(data, [
    {
      key: 'totalEmployees',
      label: 'Total Employees',
      icon: '👔',
      format: v => v || '0',
    },
    {
      key: 'activePositions',
      label: 'Open Positions',
      icon: '💼',
      format: v => v || '0',
    },
    {
      key: 'attendanceRate',
      label: 'Attendance Rate',
      icon: '📍',
      trend: 'up',
      format: v => `${v?.toFixed(1) || '0'}%`,
      unit: '%',
    },
    {
      key: 'turnoverRate',
      label: 'Turnover Rate',
      icon: '📊',
      trend: 'down',
      format: v => `${v?.toFixed(1) || '0'}%`,
      unit: '%',
    },
  ]);

// Marketing Department KPIs
export const MarketingKPIRenderer = (data: Record<string, unknown>) =>
  renderDepartmentKPIs(data, [
    {
      key: 'campaigns',
      label: 'Active Campaigns',
      icon: '📢',
      format: v => v || '0',
    },
    {
      key: 'engagement',
      label: 'Engagement Rate',
      icon: '💬',
      trend: 'up',
      format: v => `${v?.toFixed(2) || '0'}%`,
      unit: '%',
    },
    {
      key: 'reach',
      label: 'Total Reach',
      icon: '📱',
      format: v => `${(v / 1000)?.toFixed(1) || '0'}K`,
    },
    {
      key: 'roi',
      label: 'Campaign ROI',
      icon: '💹',
      trend: 'up',
      format: v => `${v?.toFixed(1) || '0'}%`,
      unit: '%',
    },
  ]);

// Operations Department KPIs
export const OperationsKPIRenderer = (data: Record<string, unknown>) =>
  renderDepartmentKPIs(data, [
    {
      key: 'processCompleted',
      label: 'Processes Completed',
      icon: '✅',
      trend: 'up',
      format: v => v || '0',
    },
    {
      key: 'efficiency',
      label: 'Efficiency Rate',
      icon: '⚙️',
      trend: 'up',
      format: v => `${v?.toFixed(1) || '0'}%`,
      unit: '%',
    },
    {
      key: 'downtimeMinutes',
      label: 'Downtime',
      icon: '⏱️',
      trend: 'down',
      format: v => `${v || '0'} min`,
    },
    {
      key: 'costPerProcess',
      label: 'Cost Per Process',
      icon: '₹',
      trend: 'down',
      format: v => `₹${v?.toFixed(2) || '0'}`,
    },
  ]);

// IT Department KPIs
export const ITKPIRenderer = (data: Record<string, unknown>) =>
  renderDepartmentKPIs(data, [
    {
      key: 'systemUptime',
      label: 'System Uptime',
      icon: '🖥️',
      trend: 'up',
      showProgress: true,
      format: v => `${v?.toFixed(2) || '0'}%`,
      unit: '%',
    },
    {
      key: 'ticketsResolved',
      label: 'Tickets Resolved',
      icon: '🎫',
      format: v => v || '0',
    },
    {
      key: 'avgResolutionTime',
      label: 'Avg Resolution Time',
      icon: '⏰',
      trend: 'down',
      format: v => `${v || '0'} hrs`,
    },
    {
      key: 'securityIncidents',
      label: 'Security Incidents',
      icon: '🔒',
      trend: 'down',
      format: v => v || '0',
    },
  ]);

// Client Services KPIs
export const ClientServicesKPIRenderer = (data: Record<string, unknown>) =>
  renderDepartmentKPIs(data, [
    {
      key: 'activeClients',
      label: 'Active Clients',
      icon: '🤝',
      trend: 'up',
      format: v => v || '0',
    },
    {
      key: 'satisfactionScore',
      label: 'Satisfaction Score',
      icon: '⭐',
      trend: 'up',
      format: v => `${v?.toFixed(1) || '0'}/10`,
    },
    {
      key: 'ticketsOpen',
      label: 'Open Tickets',
      icon: '🎫',
      format: v => v || '0',
    },
    {
      key: 'responseTime',
      label: 'Avg Response Time',
      icon: '⏱️',
      trend: 'down',
      format: v => `${v || '0'} min`,
    },
  ]);

// Property Management KPIs
export const PropertyKPIRenderer = (data: Record<string, unknown>) =>
  renderDepartmentKPIs(data, [
    {
      key: 'totalProperties',
      label: 'Total Properties',
      icon: '🏢',
      format: v => v || '0',
    },
    {
      key: 'occupancyRate',
      label: 'Occupancy Rate',
      icon: '🏠',
      trend: 'up',
      showProgress: true,
      format: v => `${v?.toFixed(1) || '0'}%`,
      unit: '%',
    },
    {
      key: 'maintenanceRequests',
      label: 'Pending Maintenance',
      icon: '🔧',
      format: v => v || '0',
    },
    {
      key: 'monthlyRevenue',
      label: 'Monthly Revenue',
      icon: '💰',
      trend: 'up',
      format: v => `₹${(v / 100000)?.toFixed(1) || '0'}L`,
    },
  ]);

// Create a mapping of department types to their KPI renderers
export const departmentKPIRenderers: Record<
  string,
  (data: Record<string, unknown>) => React.ReactNode
> = {
  SALES: SalesKPIRenderer,
  FINANCE: FinanceKPIRenderer,
  HR: HRKPIRenderer,
  MARKETING: MarketingKPIRenderer,
  OPERATIONS: OperationsKPIRenderer,
  IT: ITKPIRenderer,
  CLIENT_SERVICES: ClientServicesKPIRenderer,
  PROPERTY: PropertyKPIRenderer,
};

/**
 * Get KPI renderer for a department
 */
export const getKPIRenderer = (departmentCode: string) => {
  // eslint-disable-next-line security/detect-object-injection
  return departmentKPIRenderers[departmentCode] || renderDepartmentKPIs;
};

export default renderDepartmentKPIs;
