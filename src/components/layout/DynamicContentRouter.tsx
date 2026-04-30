// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  selectSelectedDepartment,
  selectSelectedService,
  selectSelectedSubitem,
  selectMainContentLoading,
  selectMainContentError,
  setMainContentLoading,
  setMainContentError,
} from '../../../redux/slices/relationalSidebarSlice';
import {
  getDepartmentById,
  getServiceById,
  getSubitemsByService,
} from '../../../config/departmentContentMap';
import {
  ExecutiveView,
  SalesView,
  OperationsView,
  PropertyManagementView,
  FinanceView,
  ComplianceView,
  AnalyticsView,
  TechnologyView,
  MarketingView,
  HRView,
} from '../departmentViews';

/**
 * DynamicContentRouter.tsx
 * Routes (department + service + subitem) to appropriate view component
 * Handles loading states, error boundaries, and permission checks
 */

const RouterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #f9fafb;
  overflow: hidden;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const Spinner = styled.div`
  border: 4px solid #f3f4f6;
  border-top: 4px solid #6366f1;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 2rem;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const ErrorTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const ErrorMessage = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #6366f1;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #4f46e5;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 2rem;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const EmptyStateMessage = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
`;

const AccessDeniedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 2rem;
  text-align: center;
`;

const LockIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const AccessDeniedTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #dc2626;
  margin: 0 0 0.5rem 0;
`;

const AccessDeniedMessage = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow: auto;
  background-color: #f9fafb;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;

    &:hover {
      background: #9ca3af;
    }
  }
`;

/**
 * View Component Registry
 * Maps (department, service) to component
 */
const viewComponentRegistry = {
  EXECUTIVE: {
    'strategic-overview': ExecutiveView,
  },
  SALES: {
    'lead-pipeline': SalesView,
  },
  OPERATIONS: {
    'daily-operations': OperationsView,
  },
  PROPERTY_MANAGEMENT: {
    'property-portfolio': PropertyManagementView,
  },
  FINANCE: {
    'financial-reports': FinanceView,
  },
  COMPLIANCE: {
    'compliance-dashboard': ComplianceView,
  },
  ANALYTICS: {
    'business-intelligence': AnalyticsView,
  },
  TECHNOLOGY: {
    'infrastructure-status': TechnologyView,
  },
  MARKETING: {
    'campaign-management': MarketingView,
  },
  HR: {
    'employee-management': HRView,
  },
};

/**
 * DynamicContentRouter Component
 */
const DynamicContentRouter = ({ userPermissions = [] }) => {
  const dispatch = useDispatch();

  // Redux state
  const selectedDept = useSelector(selectSelectedDepartment);
  const selectedService = useSelector(selectSelectedService);
  const selectedSubitem = useSelector(selectSelectedSubitem);
  const loading = useSelector(selectMainContentLoading);
  const error = useSelector(selectMainContentError);

  // Get metadata
  const deptInfo = selectedDept ? getDepartmentById(selectedDept) : null;
  const serviceInfo = selectedDept && selectedService
    ? getServiceById(selectedDept, selectedService)
    : null;
  const subitems = selectedDept && selectedService
    ? getSubitemsByService(selectedDept, selectedService)
    : [];
  const selectedSubitemInfo = selectedSubitem
    ? subitems.find((s) => s.id === selectedSubitem)
    : null;

  // Determine which component to render
  const getComponentToRender = () => {
    if (!selectedDept) {
      return {
        type: 'empty',
        message: 'Select a department from the left sidebar to begin',
      };
    }

    if (!selectedService) {
      return {
        type: 'empty',
        message: 'Select a service to view its content',
      };
    }

    if (!selectedSubitem) {
      return {
        type: 'empty',
        message: 'Select a sub-item or feature to continue',
      };
    }

    // Check permissions
    if (
      !serviceInfo?.permissions.some((perm) =>
        userPermissions.includes(perm)
      )
    ) {
      return {
        type: 'access-denied',
        message: 'You do not have permission to access this service',
      };
    }

    if (
      selectedSubitemInfo &&
      !selectedSubitemInfo.permissions.some((perm) =>
        userPermissions.includes(perm)
      )
    ) {
      return {
        type: 'access-denied',
        message: 'You do not have permission to access this view',
      };
    }

    // Return component info
    const componentClass = viewComponentRegistry[selectedDept]?.[selectedService];

    return {
      type: 'view',
      componentClass,
      deptInfo,
      serviceInfo,
      selectedSubitemInfo,
    };
  };

  const componentInfo = getComponentToRender();

  const handleRetry = () => {
    dispatch(setMainContentError(null));
  };

  return (
    <RouterContainer>
      {loading && (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      )}

      {error && (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Error Loading Content</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={handleRetry}>Try Again</RetryButton>
        </ErrorContainer>
      )}

      {!loading && !error && (
        <ContentWrapper>
          {componentInfo.type === 'empty' && (
            <EmptyState>
              <EmptyStateIcon>📋</EmptyStateIcon>
              <EmptyStateTitle>Select a Service</EmptyStateTitle>
              <EmptyStateMessage>{componentInfo.message}</EmptyStateMessage>
            </EmptyState>
          )}

          {componentInfo.type === 'access-denied' && (
            <AccessDeniedContainer>
              <LockIcon>🔒</LockIcon>
              <AccessDeniedTitle>Access Denied</AccessDeniedTitle>
              <AccessDeniedMessage>{componentInfo.message}</AccessDeniedMessage>
            </AccessDeniedContainer>
          )}

          {componentInfo.type === 'view' && (
            <>
              {componentInfo.componentClass && (
                React.createElement(componentInfo.componentClass, {
                  serviceName: selectedService,
                  subitemId: selectedSubitem,
                })
              )}
            </>
          )}
        </ContentWrapper>
      )}
    </RouterContainer>
  );
};

// Helper function to get service by ID
function getServiceById(deptId: string, serviceId: string) {
  const dept = getDepartmentById(deptId);
  return dept?.services?.[serviceId] || null;
}

export default DynamicContentRouter;

