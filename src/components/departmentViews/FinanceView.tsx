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
  departmentData?: Record<string, unknown>;
}

const FinanceView: React.FC<FinanceViewProps> = ({
  serviceName = 'financial-reports',
  subitemId,
  departmentData,
}) => {
  const config = getDepartmentConfig('FINANCE')!;

  // Render main content based on serviceName and subitemId
  const renderContent = (_data: Record<string, unknown>) => {
    if (!subitemId && serviceName === 'financial-reports') {
      return (
        <>
          {/* Financial Summary */}
          <DataCard
            title="Financial Summary"
            subtitle="Key financial metrics (Dubai UAE & FTA Compliance)"
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                padding: '0.5rem 0',
              }}
            >
              <div>
                <small style={{ color: 'var(--color-888, #888)' }}>Gross Revenue (YTD)</small>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-c9a84c, #c9a84c)' }}>
                  AED 15,400,000
                </div>
              </div>
              <div>
                <small style={{ color: 'var(--color-888, #888)' }}>FTA VAT 5% Filing</small>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-4ade80, #4ade80)' }}>
                  AED 770,000
                </div>
              </div>
              <div>
                <small style={{ color: 'var(--color-888, #888)' }}>Rolling Cash Flow</small>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-60a5fa, #60a5fa)' }}>
                  +18.4% MoM
                </div>
              </div>
            </div>
          </DataCard>

          {/* Budget Overview */}
          <DataCard title="Budget Overview" subtitle="Q3 2026 Allocation & Performance">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                padding: '0.5rem 0',
              }}
            >
              <div>
                <strong>Marketing & Portal Feeds (PF & Bayut):</strong> AED 450,000 (82% allocated)
              </div>
              <div>
                <strong>Agent Performance Slabs & Payouts:</strong> AED 7,700,000 (100% disbursed)
              </div>
            </div>
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
      departmentData={departmentData}
      contentRenderer={renderContent}
    />
  );
};

export default FinanceView;
