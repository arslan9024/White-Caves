import React from 'react';
import BaseDepartmentView from './BaseDepartmentView';
import { getDepartmentConfig } from '../../config/departmentViewConfigs';
import { DataCard } from '../shared/dashboard';

/**
 * AnalyticsView Component
 * Displays business intelligence, data analytics, and reporting
 * Default service for ANALYTICS department
 */
interface AnalyticsViewProps {
  serviceName?: string;
  subitemId?: string;
  departmentData?: Record<string, unknown>;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  serviceName = 'business-intelligence',
  subitemId,
  departmentData,
}) => {
  const config = getDepartmentConfig('ANALYTICS')!;

  const renderContent = (data: Record<string, unknown>) => {
    const getCount = (value: unknown): number => (Array.isArray(value) ? value.length : 0);

    if (!subitemId && serviceName === 'business-intelligence') {
      return (
        <>
          <DataCard title="Key Metrics" subtitle="Business performance metrics">
            Metrics: {JSON.stringify(getCount(data?.metrics))} items
          </DataCard>
          <DataCard title="Available Reports" subtitle="Scheduled and ad-hoc reports">
            Reports: {JSON.stringify(getCount(data?.reports))} items
          </DataCard>
        </>
      );
    }

    if (subitemId === 'customer-analytics') {
      return (
        <DataCard title="Customer Analytics" subtitle="Customer behavior and trends">
          Segments: {JSON.stringify(getCount(data?.customerAnalytics))} items
        </DataCard>
      );
    }

    if (subitemId === 'sales-analytics') {
      return (
        <DataCard title="Sales Analytics" subtitle="Sales performance and trends">
          Data: {JSON.stringify(getCount(data?.salesAnalytics))} items
        </DataCard>
      );
    }

    if (subitemId === 'usage-analytics') {
      return (
        <DataCard title="Usage Analytics" subtitle="Platform usage and engagement">
          Usage: {JSON.stringify(getCount(data?.usageAnalytics))} items
        </DataCard>
      );
    }

    if (subitemId === 'custom-reports') {
      return (
        <DataCard title="Custom Reports" subtitle="User-defined reports and dashboards">
          Reports: {JSON.stringify(getCount(data?.customReports))} items
        </DataCard>
      );
    }

    return null;
  };

  return (
    <BaseDepartmentView
      config={config}
      serviceName={serviceName}
      subitemId={subitemId}
      departmentData={departmentData}
      contentRenderer={renderContent}
    />
  );
};

export default AnalyticsView;
