/**
 * Sales Department View - Enhanced with KPI Cards
 * Demonstrates the new KPI card and visualization system
 */

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import BaseDepartmentView from '../../../components/departmentViews/BaseDepartmentView';
import { SalesKPIRenderer } from '../../../utils/departmentKPIRenderer';
import { BarChart, LineChart } from '../../../components/charts/DataVisualization';

const SalesContentWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
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

interface SalesDepartmentViewProps {
  serviceName?: string;
  subitemId?: string;
}

/**
 * Sales Department View Component
 * Shows sales KPIs and performance charts
 */
export const SalesDepartmentView: React.FC<SalesDepartmentViewProps> = ({
  serviceName = 'lead-pipeline',
  subitemId,
}) => {
  // Get sales data from Redux
  const salesData = useSelector((state: any) => {
    const dept = state.relationalSidebar?.departments?.find(
      (d: any) => d.code === 'SALES'
    );
    return dept?.data || null;
  });

  // Mock sales data for demo
  const mockSalesData = useMemo(() => ({
    totalLeads: 245,
    activeDeals: 18,
    conversionRate: 7.35,
    monthlyRevenue: 2450000,
    leadSources: [
      { label: 'Direct', value: 45, color: '#3498db' },
      { label: 'Referral', value: 120, color: '#2ecc71' },
      { label: 'Online', value: 80, color: '#e74c3c' },
    ],
    monthlySales: [
      { label: 'Jan', value: 1800000 },
      { label: 'Feb', value: 2100000 },
      { label: 'Mar', value: 1950000 },
      { label: 'Apr', value: 2450000 },
    ],
  }), []);

  const contentRenderer = (data: any) => (
    <SalesContentWrapper>
      <ChartCard>
        <h3>Leads by Source</h3>
        <BarChart
          data={mockSalesData.leadSources}
          maxValue={150}
        />
      </ChartCard>

      <ChartCard>
        <h3>Monthly Sales Trend</h3>
        <LineChart
          data={mockSalesData.monthlySales}
          color="#27ae60"
          maxValue={3000000}
        />
      </ChartCard>
    </SalesContentWrapper>
  );

  return (
    <BaseDepartmentView
      config={{
        departmentCode: 'SALES',
        departmentName: 'Sales & Leasing',
        apiBasePath: '/api/sales',
        defaultService: 'lead-pipeline',
        icon: '📈',
      }}
      serviceName={serviceName}
      subitemId={subitemId}
      departmentData={salesData || mockSalesData}
      kpiRenderer={SalesKPIRenderer}
      contentRenderer={contentRenderer}
    />
  );
};

export default SalesDepartmentView;
