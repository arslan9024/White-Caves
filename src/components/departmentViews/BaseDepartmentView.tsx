/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, ReactNode } from 'react';
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

/** Generic department data payload — strongly typed as a JSON-safe record */
type DepartmentPayload = Record<string, unknown>;

interface BaseDepartmentViewProps {
  config: DepartmentViewConfig;
  serviceName?: string;
  subitemId?: string;
  departmentData?: DepartmentPayload; // Data from Redux
  children?: ReactNode;
  kpiRenderer?: (data: DepartmentPayload) => ReactNode;
  contentRenderer?: (data: DepartmentPayload) => ReactNode;
  onDataLoaded?: (data: DepartmentPayload) => void;
  isLoading?: boolean;
  error?: string | null;
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
  isLoading,
  error: externalError,
}) => {
  // Use departmentData from Redux (passed as prop)
  const [loading, setLoading] = useState(isLoading ?? !departmentData);
  const [data, setData] = useState<DepartmentPayload | undefined>(departmentData);
  const [error, setError] = useState<string | null>(externalError ?? null);

  // Update local state when departmentData changes
  useEffect(() => {
    if (departmentData) {
      setData(departmentData);
      setLoading(false);
      onDataLoaded?.(departmentData);
    }
  }, [departmentData, onDataLoaded]);

  useEffect(() => {
    if (typeof isLoading === 'boolean') {
      setLoading(isLoading);
    }
  }, [isLoading]);

  useEffect(() => {
    if (externalError !== undefined) {
      setError(externalError);
    }
  }, [externalError]);

  useEffect(() => {
    if (departmentData || isLoading === true) {
      return;
    }

    let isMounted = true;

    const loadDepartmentData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${config.apiBasePath}/${serviceName}`);

        if (!response.ok) {
          throw new Error(`Failed to load ${config.departmentName} data`);
        }

        const payload = await response.json();

        if (!isMounted) {
          return;
        }

        setData(payload);
        onDataLoaded?.(payload);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(
          err instanceof Error ? err.message : `Failed to load ${config.departmentName} data`
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDepartmentData();

    return () => {
      isMounted = false;
    };
  }, [
    config.apiBasePath,
    config.departmentName,
    departmentData,
    isLoading,
    onDataLoaded,
    serviceName,
  ]);

  // Determine title and subtitle
  const title = subitemId
    ? `${config.departmentName} - Details`
    : serviceName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

  return (
    <ViewContainer>
      <DashboardShell
        title={title}
        icon={config.icon}
        loading={loading}
        onFilterChange={() => {}}
        onBreadcrumbClick={() => {}}
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
