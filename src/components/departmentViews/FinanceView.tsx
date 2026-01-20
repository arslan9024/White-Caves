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
            <DataCard 
              title="Financial Summary"
              subtitle="Monthly and quarterly financial overview"
              loading={loading}
            >
              <Table
                columns={['period', 'revenue', 'expenses', 'profit', 'margin']}
                data={data?.summary || []}
                onRowClick={(row) => console.log('Period clicked:', row)}
              />
            </DataCard>

            {/* Budget Tracking */}
            <DataCard 
              title="Budget Tracking"
              subtitle="Budget vs actual spending"
              loading={loading}
            >
              <Table
                columns={['department', 'budget', 'actual', 'variance', 'utilization']}
                data={data?.budgets || []}
              />
            </DataCard>
          </>
        )}

        {subitemId === 'cash-flow' && (
          <DataCard title="Cash Flow" subtitle="Cash flow projections and actuals">
            <Table
              columns={['period', 'inflow', 'outflow', 'net_flow', 'balance']}
              data={data?.cashFlow || []}
            />
          </DataCard>
        )}

        {subitemId === 'budget-planning' && (
          <DataCard title="Budget Planning" subtitle="Annual and quarterly budgets">
            <Table
              columns={['department', 'category', 'budget', 'actual', 'variance']}
              data={data?.budgets || []}
            />
          </DataCard>
        )}

        {subitemId === 'accounting' && (
          <DataCard title="Accounting" subtitle="General ledger and accounting records">
            <Table
              columns={['date', 'account', 'description', 'debit', 'credit']}
              data={data?.ledger || []}
            />
          </DataCard>
        )}

        {subitemId === 'invoices' && (
          <DataCard title="Invoices" subtitle="Invoice management and tracking">
            <Table
              columns={['invoice_id', 'client', 'amount', 'due_date', 'status']}
              data={data?.invoices || []}
            />
          </DataCard>
        )}
      </DashboardShell>
    </FinanceViewContainer>
  );
};

export default FinanceView;
