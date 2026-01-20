/**
 * Finance Department View - Enhanced with KPI Cards
 * Demonstrates financial metrics and budget visualization
 */

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import BaseDepartmentView from '../../../components/departmentViews/BaseDepartmentView';
import { FinanceKPIRenderer } from '../../../utils/departmentKPIRenderer';
import { BarChart, LineChart, ProgressRing } from '../../../components/charts/DataVisualization';

const FinanceContentWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 24px;
  margin-top: 32px;
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  overflow: auto;

  h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 32px;
`;

interface FinanceDepartmentViewProps {
  serviceName?: string;
  subitemId?: string;
}

/**
 * Finance Department View Component
 * Shows financial KPIs and budget allocation
 */
export const FinanceDepartmentView: React.FC<FinanceDepartmentViewProps> = ({
  serviceName = 'budget-overview',
  subitemId,
}) => {
  // Get finance data from Redux
  const financeData = useSelector((state: any) => {
    const dept = state.relationalSidebar?.departments?.find(
      (d: any) => d.code === 'FINANCE'
    );
    return dept?.data || null;
  });

  // Mock finance data for demo
  const mockFinanceData = useMemo(() => ({
    totalBudget: 50000000,
    spent: 22500000,
    remaining: 27500000,
    utilizationRate: 45,
    departmentBudgets: [
      { label: 'Sales', value: 15000000, color: '#3498db' },
      { label: 'Marketing', value: 8000000, color: '#2ecc71' },
      { label: 'Operations', value: 12000000, color: '#e74c3c' },
      { label: 'IT', value: 5000000, color: '#f39c12' },
    ],
    monthlySpending: [
      { label: 'Jan', value: 3200000 },
      { label: 'Feb', value: 3100000 },
      { label: 'Mar', value: 4000000 },
      { label: 'Apr', value: 3500000 },
      { label: 'May', value: 4200000 },
      { label: 'Jun', value: 4500000 },
    ],
  }), []);

  const contentRenderer = (data: any) => (
    <FinanceContentWrapper>
      <ChartCard>
        <h3>Budget Allocation by Department</h3>
        <BarChart
          data={mockFinanceData.departmentBudgets}
          maxValue={18000000}
        />
      </ChartCard>

      <ChartCard>
        <h3>Monthly Spending Trend</h3>
        <LineChart
          data={mockFinanceData.monthlySpending}
          color="#e74c3c"
          maxValue={5000000}
        />
      </ChartCard>

      <MetricsGrid>
        <ChartCard>
          <h3>Budget Utilization</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ProgressRing
              value={mockFinanceData.utilizationRate}
              max={100}
              color="#3498db"
              size={150}
              showLabel
            />
          </div>
        </ChartCard>

        <ChartCard>
          <h3>Quarterly Breakdown</h3>
          <BarChart
            data={[
              { label: 'Q1', value: 10300000, color: '#3498db' },
              { label: 'Q2', value: 11700000, color: '#2ecc71' },
            ]}
            maxValue={15000000}
          />
        </ChartCard>
      </MetricsGrid>
    </FinanceContentWrapper>
  );

  return (
    <BaseDepartmentView
      config={{
        departmentCode: 'FINANCE',
        departmentName: 'Finance & Accounting',
        apiBasePath: '/api/finance',
        defaultService: 'budget-overview',
        icon: '💰',
      }}
      serviceName={serviceName}
      subitemId={subitemId}
      departmentData={financeData || mockFinanceData}
      kpiRenderer={FinanceKPIRenderer}
      contentRenderer={contentRenderer}
    />
  );
};

export default FinanceDepartmentView;
