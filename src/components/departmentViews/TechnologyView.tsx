import React from 'react';
import BaseDepartmentView from './BaseDepartmentView';
import { getDepartmentConfig } from '../../config/departmentViewConfigs';
import { DataCard } from '../shared/dashboard';

/**
 * TechnologyView Component
 * Displays IT infrastructure, system health, and technical operations
 * Default service for TECHNOLOGY department
 */
interface TechnologyViewProps {
  serviceName?: string;
  subitemId?: string;
  departmentData?: Record<string, unknown>;
}

const TechnologyView: React.FC<TechnologyViewProps> = ({
  serviceName = 'infrastructure',
  subitemId,
  departmentData,
}) => {
  const config = getDepartmentConfig('TECHNOLOGY')!;

  const renderContent = (data: Record<string, unknown>) => {
    const getCount = (value: unknown): number => (Array.isArray(value) ? value.length : 0);

    if (!subitemId && serviceName === 'infrastructure-status') {
      return (
        <>
          <DataCard title="System Status" subtitle="All systems and services health">
            Services: {JSON.stringify(getCount(data?.systemStatus))} items
          </DataCard>
          <DataCard title="Active Incidents" subtitle="Ongoing incidents and issues">
            Incidents: {JSON.stringify(getCount(data?.incidents))} items
          </DataCard>
        </>
      );
    }

    if (subitemId === 'infrastructure') {
      return (
        <DataCard title="Infrastructure" subtitle="Server and resource management">
          Servers: {JSON.stringify(getCount(data?.infrastructure))} items
        </DataCard>
      );
    }

    if (subitemId === 'incident-management') {
      return (
        <DataCard title="Incident Management" subtitle="All incidents and resolutions">
          Incidents: {JSON.stringify(getCount(data?.incidents))} items
        </DataCard>
      );
    }

    if (subitemId === 'security') {
      return (
        <DataCard title="Security" subtitle="Security monitoring and alerts">
          Alerts: {JSON.stringify(getCount(data?.security))} items
        </DataCard>
      );
    }

    if (subitemId === 'backup-recovery') {
      return (
        <DataCard title="Backup & Recovery" subtitle="Backup status and recovery procedures">
          Backups: {JSON.stringify(getCount(data?.backups))} items
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

export default TechnologyView;
