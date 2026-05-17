/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
/**
 * Sales Department View - Fully Optimized with Caching and Performance Monitoring
 * Uses optimized API hooks with automatic caching, deduplication, and monitoring
 */

import React, { useMemo } from 'react';
import styled from 'styled-components';
import BaseDepartmentView from '../../../components/departmentViews/BaseDepartmentView';
import { SalesKPIRenderer } from '../../../utils/departmentKPIRenderer';
import { BarChart, LineChart } from '../../../components/charts/DataVisualization';
import {
  useDepartmentDataOptimized,
  useDepartmentKPIsOptimized,
  useDepartmentTrendsOptimized,
} from '../../../hooks/useOptimizedAPI';
import { ErrorState, LoadingState } from '../../../components/shared';

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
 * Shows sales KPIs and performance charts with live API data
 */
export const SalesDepartmentView: React.FC<SalesDepartmentViewProps> = ({
  serviceName = 'lead-pipeline',
  subitemId,
}) => {
  // Fetch department data from optimized API with caching
  const {
    data: salesData,
    loading: dataLoading,
    error: dataError,
  } = useDepartmentDataOptimized('SALES');
  const {
    kpis: salesKPIs,
    loading: kpiLoading,
    error: kpiError,
  } = useDepartmentKPIsOptimized('SALES');
  const { trends: salesTrends, loading: trendLoading } = useDepartmentTrendsOptimized(
    'SALES',
    'monthly'
  );

  // Fallback mock data if API data is not available
  const mockSalesData = useMemo(
    () => ({
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
    }),
    []
  );

  // Use API data if available, fallback to mock data
  const displayData = (salesData || mockSalesData) as typeof mockSalesData;

  // Handle loading state
  if (dataLoading || kpiLoading) {
    return <LoadingState message="Loading sales data..." />;
  }

  // Handle error state
  if (dataError || kpiError) {
    return (
      <ErrorState
        error={dataError || kpiError || 'Unable to fetch sales data. Using fallback data.'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const contentRenderer = (data: any) => (
    <SalesContentWrapper>
      <ChartCard>
        <h3>Leads by Source</h3>
        <BarChart data={displayData.leadSources || mockSalesData.leadSources} maxValue={150} />
      </ChartCard>

      <ChartCard>
        <h3>Monthly Sales Trend</h3>
        <LineChart
          data={displayData.monthlySales || mockSalesData.monthlySales}
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
      departmentData={displayData}
      kpiRenderer={SalesKPIRenderer}
      contentRenderer={contentRenderer}
      isLoading={dataLoading || kpiLoading || trendLoading}
      error={dataError || kpiError}
    />
  );
};

export default SalesDepartmentView;
