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
  departmentData?: Record<string, unknown>;
}

const OperationsView: React.FC<OperationsViewProps> = ({
  serviceName = 'operations-center',
  subitemId,
  departmentData,
}) => {
  const config = getDepartmentConfig('OPERATIONS')!;

  const renderContent = (data: Record<string, unknown>) => {
    const getCount = (value: unknown): number => (Array.isArray(value) ? value.length : 0);

    if (!subitemId && serviceName === 'daily-operations') {
      return (
        <>
          <DataCard title="Daily Operations" subtitle="Operational metrics and task management">
            Tasks: {JSON.stringify(getCount(data?.tasks))} items
          </DataCard>
          <DataCard title="Team Performance" subtitle="Individual and team metrics">
            Performance: {JSON.stringify(getCount(data?.teamPerformance))} items
          </DataCard>
        </>
      );
    }

    if (subitemId === 'task-board') {
      return (
        <DataCard title="Task Board" subtitle="All tasks and assignments">
          Tasks: {JSON.stringify(getCount(data?.tasks))} items
        </DataCard>
      );
    }

    if (subitemId === 'team-schedule') {
      return (
        <DataCard title="Team Schedule" subtitle="Team member availability">
          Schedule: {JSON.stringify(getCount(data?.schedule))} items
        </DataCard>
      );
    }

    if (subitemId === 'quality-metrics') {
      return (
        <DataCard title="Quality Metrics" subtitle="Service quality and standards">
          Metrics: {JSON.stringify(getCount(data?.metrics))} items
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
