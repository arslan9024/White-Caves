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

const toNumber = (value: unknown): number => {
  const parsed = typeof value === 'number' ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toText = (value: unknown): string => String(value ?? '0');

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
        const displayValue = config.format ? config.format(value) : toText(value);

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
      format: v => toNumber(v).toLocaleString(),
    },
    {
      key: 'activeDeals',
      label: 'Active Deals',
      icon: '🤝',
      format: v => toText(v),
    },
    {
      key: 'conversionRate',
      label: 'Conversion Rate',
      icon: '📈',
      trend: 'up',
      format: v => `${toNumber(v).toFixed(1)}%`,
      unit: '%',
    },
    {
      key: 'monthlyRevenue',
      label: 'Monthly Revenue',
      icon: '💰',
      trend: 'up',
      format: v => `₹${(toNumber(v) / 1000000).toFixed(1)}M`,
    },
  ]);

// Finance Department KPIs
export const FinanceKPIRenderer = (data: Record<string, unknown>) =>
  renderDepartmentKPIs(data, [
    {
      key: 'totalBudget',
      label: 'Total Budget',
      icon: '💵',
      format: v => `₹${(toNumber(v) / 1000000).toFixed(2)}M`,
    },
    {
      key: 'spent',
      label: 'Amount Spent',
      icon: '💸',
      trend: 'down',
      format: v => `₹${(toNumber(v) / 1000000).toFixed(2)}M`,
    },
    {
      key: 'remaining',
      label: 'Remaining Budget',
      icon: '🏦',
      trend: 'up',
      format: v => `₹${(toNumber(v) / 1000000).toFixed(2)}M`,
    },
    {
      key: 'utilizationRate',
      label: 'Budget Utilization',
      icon: '📊',
      showProgress: true,
      format: v => `${toNumber(v).toFixed(0)}%`,
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
      format: v => toText(v),
    },
    {
      key: 'activePositions',
      label: 'Open Positions',
      icon: '💼',
      format: v => toText(v),
    },
    {
      key: 'attendanceRate',
      label: 'Attendance Rate',
      icon: '📍',
      trend: 'up',
      format: v => `${toNumber(v).toFixed(1)}%`,
      unit: '%',
    },
    {
      key: 'turnoverRate',
      label: 'Turnover Rate',
      icon: '📊',
      trend: 'down',
      format: v => `${toNumber(v).toFixed(1)}%`,
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
      format: v => toText(v),
    },
    {
      key: 'engagement',
      label: 'Engagement Rate',
      icon: '💬',
      trend: 'up',
      format: v => `${toNumber(v).toFixed(2)}%`,
      unit: '%',
    },
    {
      key: 'reach',
      label: 'Total Reach',
      icon: '📱',
      format: v => `${(toNumber(v) / 1000).toFixed(1)}K`,
    },
    {
      key: 'roi',
      label: 'Campaign ROI',
      icon: '💹',
      trend: 'up',
      format: v => `${toNumber(v).toFixed(1)}%`,
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
      format: v => toText(v),
    },
    {
      key: 'efficiency',
      label: 'Efficiency Rate',
      icon: '⚙️',
      trend: 'up',
      format: v => `${toNumber(v).toFixed(1)}%`,
      unit: '%',
    },
    {
      key: 'downtimeMinutes',
      label: 'Downtime',
      icon: '⏱️',
      trend: 'down',
      format: v => `${toText(v)} min`,
    },
    {
      key: 'costPerProcess',
      label: 'Cost Per Process',
      icon: '₹',
      trend: 'down',
      format: v => `₹${toNumber(v).toFixed(2)}`,
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
      format: v => `${toNumber(v).toFixed(2)}%`,
      unit: '%',
    },
    {
      key: 'ticketsResolved',
      label: 'Tickets Resolved',
      icon: '🎫',
      format: v => toText(v),
    },
    {
      key: 'avgResolutionTime',
      label: 'Avg Resolution Time',
      icon: '⏰',
      trend: 'down',
      format: v => `${toText(v)} hrs`,
    },
    {
      key: 'securityIncidents',
      label: 'Security Incidents',
      icon: '🔒',
      trend: 'down',
      format: v => toText(v),
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
      format: v => toText(v),
    },
    {
      key: 'satisfactionScore',
      label: 'Satisfaction Score',
      icon: '⭐',
      trend: 'up',
      format: v => `${toNumber(v).toFixed(1)}/10`,
    },
    {
      key: 'ticketsOpen',
      label: 'Open Tickets',
      icon: '🎫',
      format: v => toText(v),
    },
    {
      key: 'responseTime',
      label: 'Avg Response Time',
      icon: '⏱️',
      trend: 'down',
      format: v => `${toText(v)} min`,
    },
  ]);

// Property Management KPIs
export const PropertyKPIRenderer = (data: Record<string, unknown>) =>
  renderDepartmentKPIs(data, [
    {
      key: 'totalProperties',
      label: 'Total Properties',
      icon: '🏢',
      format: v => toText(v),
    },
    {
      key: 'occupancyRate',
      label: 'Occupancy Rate',
      icon: '🏠',
      trend: 'up',
      showProgress: true,
      format: v => `${toNumber(v).toFixed(1)}%`,
      unit: '%',
    },
    {
      key: 'maintenanceRequests',
      label: 'Pending Maintenance',
      icon: '🔧',
      format: v => toText(v),
    },
    {
      key: 'monthlyRevenue',
      label: 'Monthly Revenue',
      icon: '💰',
      trend: 'up',
      format: v => `₹${(toNumber(v) / 100000).toFixed(1)}L`,
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
