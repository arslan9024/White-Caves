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
}

const TechnologyView: React.FC<TechnologyViewProps> = ({ serviceName = 'infrastructure-status', subitemId }) => {
  const config = getDepartmentConfig('TECHNOLOGY')!;

  const renderContent = (data: any) => {
    if (!subitemId && serviceName === 'infrastructure-status') {
      return (
        <>
          <DataCard 
            title="System Status"
            subtitle="All systems and services health"
          >
            Services: {JSON.stringify(data?.systemStatus?.length || 0)} items
          </DataCard>
          <DataCard 
            title="Active Incidents"
            subtitle="Ongoing incidents and issues"
          >
            Incidents: {JSON.stringify(data?.incidents?.length || 0)} items
          </DataCard>
        </>
      );
    }

    if (subitemId === 'infrastructure') {
      return (
        <DataCard title="Infrastructure" subtitle="Server and resource management">
          Servers: {JSON.stringify(data?.infrastructure?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'incident-management') {
      return (
        <DataCard title="Incident Management" subtitle="All incidents and resolutions">
          Incidents: {JSON.stringify(data?.incidents?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'security') {
      return (
        <DataCard title="Security" subtitle="Security monitoring and alerts">
          Alerts: {JSON.stringify(data?.security?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'backup-recovery') {
      return (
        <DataCard title="Backup & Recovery" subtitle="Backup status and recovery procedures">
          Backups: {JSON.stringify(data?.backups?.length || 0)} items
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

export default TechnologyView;
