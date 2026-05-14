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
  serviceName = 'strategic-overview',
  subitemId,
  departmentData,
}) => {
  const config = getDepartmentConfig('EXECUTIVE')!;

  const renderKPIs = () => {
    if (serviceName !== 'strategic-overview' || subitemId) {
      return null;
    }

    return (
      <>
        <DataCard title="Revenue YTD" subtitle="Year-to-date company revenue">
          AED 24.8M
        </DataCard>
        <DataCard title="Active Projects" subtitle="Strategic initiatives in progress">
          6
        </DataCard>
        <DataCard title="Team Performance" subtitle="Cross-department delivery score">
          94%
        </DataCard>
        <DataCard title="Market Share" subtitle="Current Dubai market position">
          12.3%
        </DataCard>
      </>
    );
  };

  const renderContent = (data: Record<string, unknown>) => {
    const getCount = (value: unknown): number => (Array.isArray(value) ? value.length : 0);

    if (!subitemId && serviceName === 'strategic-overview') {
      return (
        <>
          <DataCard title="Strategic Overview" subtitle="Key metrics and announcements">
            Announcements: {JSON.stringify(getCount(data?.announcements))} items
          </DataCard>
          <DataCard title="Board Reports" subtitle="Recent board meeting summaries">
            Reports: {JSON.stringify(getCount(data?.boardReports))} items
          </DataCard>
        </>
      );
    }

    if (subitemId === 'kpi-dashboard') {
      return (
        <DataCard title="KPI Dashboard" subtitle="Real-time metrics">
          KPI data: {JSON.stringify(getCount(data?.kpis))} metrics
        </DataCard>
      );
    }

    if (subitemId === 'announcements') {
      return (
        <DataCard title="All Announcements" subtitle="Company-wide updates">
          Announcements: {JSON.stringify(getCount(data?.announcements))} items
        </DataCard>
      );
    }

    if (subitemId === 'board-reports') {
      return (
        <DataCard title="Board Reports" subtitle="Board meeting documentation">
          Reports: {JSON.stringify(getCount(data?.boardReports))} items
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
      kpiRenderer={renderKPIs}
      contentRenderer={renderContent}
    />
  );
};

export default ExecutiveView;
