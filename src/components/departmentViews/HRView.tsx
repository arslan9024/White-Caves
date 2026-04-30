// @ts-nocheck
import React from 'react';
import BaseDepartmentView from './BaseDepartmentView';
import { getDepartmentConfig } from '../../config/departmentViewConfigs';
import { DataCard } from '../shared/dashboard';

/**
 * HRView Component
 * Displays human resources, recruitment, employee management, and payroll
 * Default service for HR department
 */
interface HRViewProps {
  serviceName?: string;
  subitemId?: string;
  departmentData?: any;
}

const HRView: React.FC<HRViewProps> = ({ serviceName = 'employee-management', subitemId, departmentData }) => {
  const config = getDepartmentConfig('HR')!;

  const renderContent = (data: any) => {
    if (!subitemId && serviceName === 'employee-management') {
      return (
        <>
          <DataCard 
            title="Employee Directory"
            subtitle="All employees and their information"
          >
            Employees: {JSON.stringify(data?.employees?.length || 0)} items
          </DataCard>
          <DataCard 
            title="Open Positions"
            subtitle="Active job openings and applications"
          >
            Positions: {JSON.stringify(data?.openPositions?.length || 0)} items
          </DataCard>
        </>
      );
    }

    if (subitemId === 'employee-directory') {
      return (
        <DataCard title="Employee Directory" subtitle="All employees">
          Employees: {JSON.stringify(data?.employees?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'recruitment') {
      return (
        <DataCard title="Recruitment" subtitle="Job openings and candidates">
          Positions: {JSON.stringify(data?.openPositions?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'payroll') {
      return (
        <DataCard title="Payroll" subtitle="Salary and compensation management">
          Payroll: {JSON.stringify(data?.payroll?.length || 0)} items
        </DataCard>
      );
    }

    if (subitemId === 'performance-reviews') {
      return (
        <DataCard title="Performance Reviews" subtitle="Employee evaluations and feedback">
          Reviews: {JSON.stringify(data?.performanceReviews?.length || 0)} items
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

export default HRView;

