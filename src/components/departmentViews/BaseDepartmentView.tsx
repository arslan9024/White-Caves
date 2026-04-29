import React, { useEffect, useState, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { DashboardShell, DataCardGrid } from '../shared/dashboard';
import { LoadingState } from '../shared/LoadingState';
import { ErrorState } from '../shared/ErrorState';
import { EmptyState } from '../shared/EmptyState';

/**
 * BaseDepartmentView Component
 * Generic base component for all department views
 * Eliminates code duplication across 10 department components
 */

interface DepartmentViewConfig {
  departmentCode: string; // e.g., 'SALES', 'FINANCE', 'HR'
  departmentName: string; // e.g., 'Sales & Leasing'
  apiBasePath: string; // e.g., '/api/sales'
  defaultService: string; // e.g., 'lead-pipeline'
  icon?: string;
}

interface BaseDepartmentViewProps {
  config: DepartmentViewConfig;
  serviceName?: string;
  subitemId?: string;
  departmentData?: any; // Data from Redux
  children?: ReactNode;
  kpiRenderer?: (data: any) => ReactNode;
  contentRenderer?: (data: any) => ReactNode;
  onDataLoaded?: (data: any) => void;
}

const ViewContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const ViewContent = styled.div`
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
`;

/**
 * Generic Department View Component
 * Handles common patterns:
 * - Receives data from Redux via props
 * - Loading and error states from Redux
 * - KPI rendering
 * - Content rendering
 */
export const BaseDepartmentView: React.FC<BaseDepartmentViewProps> = ({
  config,
  serviceName = config.defaultService,
  subitemId,
  departmentData,
  children,
  kpiRenderer,
  contentRenderer,
  onDataLoaded,
}) => {
  // Use departmentData from Redux (passed as prop)
  const [loading, setLoading] = useState(!departmentData);
  const [data, setData] = useState<any>(departmentData);
  const [error, setError] = useState<string | null>(null);

  // Update local state when departmentData changes
  useEffect(() => {
    if (departmentData) {
      setData(departmentData);
      setLoading(false);
      onDataLoaded?.(departmentData);
    }
  }, [departmentData, onDataLoaded]);

  // Determine title and subtitle
  const title = subitemId
    ? `${config.departmentName} - Details`
    : serviceName
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

  return (
    <ViewContainer>
      <DashboardShell
        title={title}
        subtitle={`Department: ${config.departmentName}`}
        loading={loading}
        error={error}
        showBreadcrumb
      >
        <ViewContent>
          {error && <ErrorState error={error} onRetry={() => window.location.reload()} />}

          {loading && <LoadingState message={`Loading ${config.departmentName} data...`} />}

          {!loading && !error && data && (
            <>
              {/* Render KPIs if provider function is given */}
              {kpiRenderer && !subitemId && (
                <DataCardGrid columns={4}>{kpiRenderer(data)}</DataCardGrid>
              )}

              {/* Render custom content */}
              {contentRenderer && <>{contentRenderer(data)}</>}

              {/* Render children as fallback */}
              {!contentRenderer && !kpiRenderer && children}
            </>
          )}

          {!loading && !error && !data && (
            <EmptyState
              icon="📊"
              title="No Data Available"
              description={`No data found for ${config.departmentName}`}
              actionLabel="Refresh"
              onAction={() => window.location.reload()}
            />
          )}
        </ViewContent>
      </DashboardShell>
    </ViewContainer>
  );
};

export default BaseDepartmentView;
