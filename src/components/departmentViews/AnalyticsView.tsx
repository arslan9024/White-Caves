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
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ serviceName = 'business-intelligence', subitemId }) => {
  const config = getDepartmentConfig('ANALYTICS')!;

  const renderContent = (data: any) => {
    if (!subitemId && serviceName === 'business-intelligence') {
      return (
        <>
          <DataCard 
            title="Key Metrics"
            subtitle="Business performance metrics"
          >
            Metrics: {JSON.stringify(data?.metrics?.length || 0)} items
          </DataCard>
          <DataCard 
            title="Available Reports"
            subtitle="Scheduled and ad-hoc reports"
          >
            Reports: {JSON.stringify(data?.reports?.length || 0)} items
          </DataCard>
        </>
      );
    }

    if (subitemId === 'customer-analytics') {
      return (
        <DataCard title="Customer Analytics" subtitle="Customer behavior and trends">
          Segments: {JSON.stringify(data?.customerAnalytics?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'sales-analytics') {
      return (
        <DataCard title="Sales Analytics" subtitle="Sales performance and trends">
          Data: {JSON.stringify(data?.salesAnalytics?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'usage-analytics') {
      return (
        <DataCard title="Usage Analytics" subtitle="Platform usage and engagement">
          Usage: {JSON.stringify(data?.usageAnalytics?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'custom-reports') {
      return (
        <DataCard title="Custom Reports" subtitle="User-defined reports and dashboards">
          Reports: {JSON.stringify(data?.customReports?.length || 0)} items
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
      contentRenderer={renderContent}
    />
  );
};

export default AnalyticsView;
