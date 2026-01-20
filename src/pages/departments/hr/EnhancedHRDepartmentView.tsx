/**
 * HR Department View - Enhanced with KPI Cards
 * Demonstrates HR metrics and employee analytics
 */

import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import BaseDepartmentView from '../../../components/departmentViews/BaseDepartmentView';
import { HRKPIRenderer } from '../../../utils/departmentKPIRenderer';
import { BarChart, LineChart, ProgressRing } from '../../../components/charts/DataVisualization';

const HRContentWrapper = styled.div`
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

interface HRDepartmentViewProps {
  serviceName?: string;
  subitemId?: string;
}

/**
 * HR Department View Component
 * Shows HR KPIs and employee analytics
 */
export const HRDepartmentView: React.FC<HRDepartmentViewProps> = ({
  serviceName = 'employee-analytics',
  subitemId,
}) => {
  // Get HR data from Redux
  const hrData = useSelector((state: any) => {
    const dept = state.relationalSidebar?.departments?.find(
      (d: any) => d.code === 'HR'
    );
    return dept?.data || null;
  });

  // Mock HR data for demo
  const mockHRData = useMemo(() => ({
    totalEmployees: 450,
    activePositions: 12,
    attendanceRate: 94.5,
    turnoverRate: 2.3,
    employeesByDepartment: [
      { label: 'Sales', value: 120, color: '#3498db' },
      { label: 'Engineering', value: 150, color: '#2ecc71' },
      { label: 'Finance', value: 45, color: '#e74c3c' },
      { label: 'HR', value: 35, color: '#f39c12' },
      { label: 'Operations', value: 100, color: '#9b59b6' },
    ],
    attendanceTrend: [
      { label: 'Jan', value: 92.5 },
      { label: 'Feb', value: 93.2 },
      { label: 'Mar', value: 94.1 },
      { label: 'Apr', value: 93.8 },
      { label: 'May', value: 94.5 },
      { label: 'Jun', value: 94.7 },
    ],
    hiresLastQuarter: [
      { label: 'Q1', value: 45, color: '#3498db' },
      { label: 'Q2', value: 38, color: '#2ecc71' },
      { label: 'Q3', value: 52, color: '#e74c3c' },
    ],
  }), []);

  const contentRenderer = (data: any) => (
    <HRContentWrapper>
      <ChartCard>
        <h3>Employees by Department</h3>
        <BarChart
          data={mockHRData.employeesByDepartment}
          maxValue={160}
        />
      </ChartCard>

      <ChartCard>
        <h3>Monthly Attendance Rate</h3>
        <LineChart
          data={mockHRData.attendanceTrend}
          color="#27ae60"
          maxValue={100}
        />
      </ChartCard>

      <MetricsGrid>
        <ChartCard>
          <h3>Overall Attendance</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ProgressRing
              value={94.5}
              max={100}
              color="#27ae60"
              size={150}
              showLabel
            />
          </div>
        </ChartCard>

        <ChartCard>
          <h3>Hires by Quarter</h3>
          <BarChart
            data={mockHRData.hiresLastQuarter}
            maxValue={60}
          />
        </ChartCard>
      </MetricsGrid>
    </HRContentWrapper>
  );

  return (
    <BaseDepartmentView
      config={{
        departmentCode: 'HR',
        departmentName: 'Human Resources',
        apiBasePath: '/api/hr',
        defaultService: 'employee-analytics',
        icon: '👔',
      }}
      serviceName={serviceName}
      subitemId={subitemId}
      departmentData={hrData || mockHRData}
      kpiRenderer={HRKPIRenderer}
      contentRenderer={contentRenderer}
    />
  );
};

export default HRDepartmentView;
