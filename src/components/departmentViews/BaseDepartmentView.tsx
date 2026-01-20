import React, { useEffect, useState, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { DashboardShell, DataCardGrid } from '../shared/dashboard';

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

const ErrorContainer = styled.div`
  padding: 24px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
  text-align: center;
`;

const LoadingContainer = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: #999;
`;

/**
 * Generic Department View Component
 * Handles common patterns:
 * - Data fetching based on department and service
 * - Loading and error states
 * - KPI rendering
 * - Content rendering
 * - Redux integration
 */
export const BaseDepartmentView: React.FC<BaseDepartmentViewProps> = ({
  config,
  serviceName = config.defaultService,
  subitemId,
  children,
  kpiRenderer,
  contentRenderer,
  onDataLoaded,
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Select from Redux
  const userRole = useSelector((state: any) => state.auth?.user?.role);
  const selectedDepartment = useSelector(
    (state: any) => state.relationalSidebar?.selectedDepartment
  );

  // Data fetching effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const endpoint = subitemId
          ? `${config.apiBasePath}/${serviceName}/${subitemId}`
          : `${config.apiBasePath}/${serviceName}`;

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${config.departmentName} data: ${response.statusText}`
          );
        }

        const result = await response.json();
        setData(result);
        onDataLoaded?.(result);
      } catch (err: any) {
        setError(err.message || `Failed to load ${config.departmentName} data`);
        console.error(`[${config.departmentCode}] Error:`, err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if this is the selected department
    if (selectedDepartment === config.departmentCode) {
      fetchData();
    }
  }, [serviceName, subitemId, selectedDepartment, config]);

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
          {error && <ErrorContainer>{error}</ErrorContainer>}

          {loading && (
            <LoadingContainer>Loading {config.departmentName} data...</LoadingContainer>
          )}

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
            <LoadingContainer>No data available</LoadingContainer>
          )}
        </ViewContent>
      </DashboardShell>
    </ViewContainer>
  );
};

export default BaseDepartmentView;
