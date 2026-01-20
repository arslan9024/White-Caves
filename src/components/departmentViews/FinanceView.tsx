import React from 'react';
import BaseDepartmentView from './BaseDepartmentView';
import { getDepartmentConfig } from '../../config/departmentViewConfigs';
import { DataCard } from '../shared/dashboard';

/**
 * FinanceView Component
 * Displays financial reports, budgets, cash flow, and accounting
 * Default service for FINANCE department
 * Refactored to use BaseDepartmentView to eliminate code duplication
 */
interface FinanceViewProps {
  serviceName?: string;
  subitemId?: string;
}

const FinanceView: React.FC<FinanceViewProps> = ({ serviceName = 'financial-reports', subitemId }) => {
  const config = getDepartmentConfig('FINANCE')!;

  // Render main content based on serviceName and subitemId
  const renderContent = (data: any) => {
    if (!subitemId && serviceName === 'financial-reports') {
      return (
        <>
          {/* Financial Summary */}
          <DataCard 
            title="Financial Summary"
            subtitle="Key financial metrics"
          >
            {/* TODO: Implement financial summary */}
            Summary data...
          </DataCard>

          {/* Budget Overview */}
          <DataCard 
            title="Budget Overview"
            subtitle="Current budget allocation"
          >
            {/* TODO: Implement budget overview */}
            Budget data...
          </DataCard>
        </>
      );
    }

    if (subitemId === 'cash-flow') {
      return (
        <DataCard title="Cash Flow" subtitle="Cash flow analysis">
          Cash flow data...
        </DataCard>
      );
    }

    if (subitemId === 'budgets') {
      return (
        <DataCard title="Budgets" subtitle="Department budgets">
          Budget data...
        </DataCard>
      );
    }

    if (subitemId === 'reconciliation') {
      return (
        <DataCard title="Reconciliation" subtitle="Account reconciliation">
          Reconciliation data...
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

export default FinanceView;
