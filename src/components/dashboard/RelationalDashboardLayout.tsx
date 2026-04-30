import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  selectSelectedDepartment,
  selectSelectedService,
  selectSelectedAssistant,
  fetchDepartmentData,
} from '../../redux/slices/relationalSidebarSlice';
import RelationalLeftSidebar from '../sidebars/RelationalLeftSidebar/RelationalLeftSidebar';
import RelationalRightSidebar from '../sidebars/RelationalRightSidebar/RelationalRightSidebar';
// Import all department views
import ExecutiveView from '../departmentViews/ExecutiveView';
import SalesView from '../departmentViews/SalesView';
import OperationsView from '../departmentViews/OperationsView';
import FinanceView from '../departmentViews/FinanceView';
import ComplianceView from '../departmentViews/ComplianceView';
import AnalyticsView from '../departmentViews/AnalyticsView';
import TechnologyView from '../departmentViews/TechnologyView';
import MarketingView from '../departmentViews/MarketingView';
import PropertyManagementView from '../departmentViews/PropertyManagementView';
import HRView from '../departmentViews/HRView';

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background: ${props => props.theme.colors.background || '#0a0a0a'};
  color: ${props => props.theme.colors.text || '#fff'};
`;

const LeftSidebarWrapper = styled.div`
  flex: 0 0 auto;
  width: 280px;
  height: 100%;
  border-right: 1px solid ${props => props.theme.colors.border || '#333'};
  overflow: hidden;
`;

const MainContentArea = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const DashboardContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px;
  display: flex;
  flex-direction: column;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props: { theme?: { colors?: { scrollbar?: string } } }) =>
      props.theme?.colors?.scrollbar || '#555'};
    border-radius: 4px;

    &:hover {
      background: ${(props: { theme?: { colors?: { scrollbarHover?: string } } }) =>
        props.theme?.colors?.scrollbarHover || '#777'};
    }
  }
`;

const BreadcrumbNav = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary || '#999'};

  span {
    display: flex;
    align-items: center;

    &.separator {
      margin: 0 4px;
      color: ${props => props.theme.colors.textTertiary || '#666'};
    }

    &.active {
      color: ${props => props.theme.colors.primary || '#007bff'};
      font-weight: 500;
    }
  }
`;

const RightSidebarWrapper = styled.div`
  flex: 0 0 auto;
  width: 280px;
  height: 100%;
  border-left: 1px solid ${props => props.theme.colors.border || '#333'};
  overflow: hidden;
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.colors.textSecondary || '#999'};
  font-size: 14px;

  &::after {
    content: '';
    animation: spin 1s linear infinite;
    width: 16px;
    height: 16px;
    border: 2px solid ${props => props.theme.colors.border || '#333'};
    border-top-color: ${props => props.theme.colors.primary || '#007bff'};
    border-radius: 50%;
    margin-left: 8px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${props => props.theme.colors.textSecondary || '#999'};
  font-size: 14px;
  text-align: center;
  padding: 20px;
`;

/**
 * RelationalDashboardLayout Component
 * Main layout component that orchestrates:
 * - Left sidebar: Departments/Services
 * - Right sidebar: AI Assistants with notifications
 * - Main content: Dynamic department views
 */
const RelationalDashboardLayout = ({
  userPermissions = {},
}: {
  userPermissions?: Record<string, boolean>;
}) => {
  const dispatch = useDispatch();

  // Redux selectors
  const selectedDepartment = useSelector(selectSelectedDepartment);
  const selectedService = useSelector(selectSelectedService);
  const _selectedAssistant = useSelector(selectSelectedAssistant);
  const departmentData = useSelector(
    (state: { relationalSidebar?: { departmentData?: Record<string, unknown> } }) =>
      state.relationalSidebar?.departmentData
  );
  const departmentLoading = useSelector(
    (state: { relationalSidebar?: { departmentLoading?: boolean } }) =>
      state.relationalSidebar?.departmentLoading
  );
  const departmentError = useSelector(
    (state: { relationalSidebar?: { departmentError?: string | null } }) =>
      state.relationalSidebar?.departmentError
  );

  // Department view component map
  const departmentViewMap = useMemo(
    () =>
      ({
        EXECUTIVE: ExecutiveView,
        SALES: SalesView,
        OPERATIONS: OperationsView,
        FINANCE: FinanceView,
        COMPLIANCE: ComplianceView,
        ANALYTICS: AnalyticsView,
        TECHNOLOGY: TechnologyView,
        MARKETING: MarketingView,
        PROPERTY_MANAGEMENT: PropertyManagementView,
        HR: HRView,
      }) as Record<string, React.ComponentType<Record<string, unknown>>>,
    []
  );

  // Fetch department data when department selection changes
  useEffect(() => {
    if (selectedDepartment) {
      console.warn('[RelationalDashboardLayout] Fetching data for department:', selectedDepartment);
      dispatch(fetchDepartmentData(selectedDepartment) as Parameters<typeof dispatch>[0]);
    }
  }, [selectedDepartment, dispatch]);

  // Render main content based on current selection
  const renderMainContent = () => {
    // If no department selected, show empty state
    if (!selectedDepartment) {
      return (
        <EmptyState>
          <div>Select a department from the left sidebar to get started</div>
        </EmptyState>
      );
    }

    // Show loading state while fetching
    if (departmentLoading) {
      return <LoadingState>Loading {selectedDepartment} data...</LoadingState>;
    }

    // Show error state if fetch failed
    if (departmentError) {
      return (
        <EmptyState>
          <div style={{ color: '#ef4444' }}>Error loading data: {departmentError}</div>
        </EmptyState>
      );
    }

    // Get the component for the selected department
    // eslint-disable-next-line security/detect-object-injection
    const ViewComponent = departmentViewMap[selectedDepartment];

    if (!ViewComponent) {
      return (
        <EmptyState>
          <div>Department view not available for: {selectedDepartment}</div>
        </EmptyState>
      );
    }

    // Render the department view with service info and Redux data
    return (
      <ViewComponent
        serviceName={selectedService || undefined}
        subitemId={undefined}
        departmentData={departmentData}
      />
    );
  };

  return (
    <DashboardContainer>
      {/* Left Sidebar: Departments & Services */}
      <LeftSidebarWrapper>
        <RelationalLeftSidebar userPermissions={userPermissions} />
      </LeftSidebarWrapper>

      {/* Main Content Area */}
      <MainContentArea>
        {/* Dashboard Content */}
        <DashboardContent>
          {/* Breadcrumb Navigation */}
          {selectedDepartment && (
            <BreadcrumbNav>
              <span className="active">{selectedDepartment}</span>
              {selectedService && (
                <>
                  <span className="separator">/</span>
                  <span className="active">{selectedService}</span>
                </>
              )}
            </BreadcrumbNav>
          )}

          {/* Dynamic Content */}
          {renderMainContent()}
        </DashboardContent>

        {/* Right Sidebar: AI Assistants */}
        <RightSidebarWrapper>
          <RelationalRightSidebar
            selectedDepartment={selectedDepartment}
            selectedService={selectedService}
            userPermissions={userPermissions}
          />
        </RightSidebarWrapper>
      </MainContentArea>
    </DashboardContainer>
  );
};

export default RelationalDashboardLayout;
