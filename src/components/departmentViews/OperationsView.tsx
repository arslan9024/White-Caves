// @ts-nocheck
import React from 'react';
import BaseDepartmentView from './BaseDepartmentView';
import { getDepartmentConfig } from '../../config/departmentViewConfigs';
import { DataCard } from '../shared/dashboard';

/**
 * OperationsView Component
 * Displays operational efficiency, team productivity, and task management
 * Default service for OPERATIONS department
 */
interface OperationsViewProps {
  serviceName?: string;
  subitemId?: string;
  departmentData?: any;
}

const OperationsView: React.FC<OperationsViewProps> = ({ serviceName = 'operations-center', subitemId, departmentData }) => {
  const config = getDepartmentConfig('OPERATIONS')!;

  const renderContent = (data: any) => {
    if (!subitemId && serviceName === 'daily-operations') {
      return (
        <>
          <DataCard 
            title="Daily Operations"
            subtitle="Operational metrics and task management"
          >
            Tasks: {JSON.stringify(data?.tasks?.length || 0)} items
          </DataCard>
          <DataCard 
            title="Team Performance"
            subtitle="Individual and team metrics"
          >
            Performance: {JSON.stringify(data?.teamPerformance?.length || 0)} items
          </DataCard>
        </>
      );
    }

    if (subitemId === 'task-board') {
      return (
        <DataCard title="Task Board" subtitle="All tasks and assignments">
          Tasks: {JSON.stringify(data?.tasks?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'team-schedule') {
      return (
        <DataCard title="Team Schedule" subtitle="Team member availability">
          Schedule: {JSON.stringify(data?.schedule?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'quality-metrics') {
      return (
        <DataCard title="Quality Metrics" subtitle="Service quality and standards">
          Metrics: {JSON.stringify(data?.metrics?.length || 0)} items
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

export default OperationsView;

