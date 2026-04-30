import React from 'react';
import BaseDepartmentView from './BaseDepartmentView';
import { getDepartmentConfig } from '../../config/departmentViewConfigs';
import { DataCard } from '../shared/dashboard';

/**
 * ExecutiveView Component
 * Displays strategic overview, KPIs, announcements, and board reports
 * Default service for EXECUTIVE department
 */
interface ExecutiveViewProps {
  serviceName?: string;
  subitemId?: string;
  departmentData?: Record<string, unknown>;
}

const ExecutiveView: React.FC<ExecutiveViewProps> = ({
  serviceName = 'executive-dashboard',
  subitemId,
  departmentData,
}) => {
  const config = getDepartmentConfig('EXECUTIVE')!;

  const renderContent = (data: Record<string, unknown>) => {
    if (!subitemId && serviceName === 'strategic-overview') {
      return (
        <>
          <DataCard title="Strategic Overview" subtitle="Key metrics and announcements">
            Announcements: {JSON.stringify(data?.announcements?.length || 0)} items
          </DataCard>
          <DataCard title="Board Reports" subtitle="Recent board meeting summaries">
            Reports: {JSON.stringify(data?.boardReports?.length || 0)} items
          </DataCard>
        </>
      );
    }

    if (subitemId === 'kpi-dashboard') {
      return (
        <DataCard title="KPI Dashboard" subtitle="Real-time metrics">
          KPI data: {JSON.stringify(data?.kpis?.length || 0)} metrics
        </DataCard>
      );
    }

    if (subitemId === 'announcements') {
      return (
        <DataCard title="All Announcements" subtitle="Company-wide updates">
          Announcements: {JSON.stringify(data?.announcements?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'board-reports') {
      return (
        <DataCard title="Board Reports" subtitle="Board meeting documentation">
          Reports: {JSON.stringify(data?.boardReports?.length || 0)} items
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

export default ExecutiveView;
