import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  selectSelectedAssistant,
  selectSelectedDepartment,
  selectSelectedService,
  selectActiveContext,
  selectShowFeatureSidebar,
  fetchContextualData,
} from '../../redux/slices/relationalSidebarSlice';
import {
  isValidAssistantContext,
  getSidebarRenderConfig,
} from '../../utils/relationalSidebarUtils';
import RelationalLeftSidebar from '../sidebars/RelationalLeftSidebar/RelationalLeftSidebar';
import RelationalRightSidebar from '../sidebars/RelationalRightSidebar/RelationalRightSidebar';
import MaryInventorySidebar from '../sidebars/MaryInventorySidebar/MaryInventorySidebar';
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
  background: ${(props) => props.theme.colors.background || '#0a0a0a'};
  color: ${(props) => props.theme.colors.text || '#fff'};
`;

const LeftSidebarWrapper = styled.div`
  flex: 0 0 auto;
  width: 280px;
  height: 100%;
  border-right: 1px solid ${(props) => props.theme.colors.border || '#333'};
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
    background: ${(props) => (props.theme?.colors as any)?.scrollbar || '#555'};
    border-radius: 4px;

    &:hover {
      background: ${(props) => (props.theme?.colors as any)?.scrollbarHover || '#777'};
    }
  }
`;

const BreadcrumbNav = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 13px;
  color: ${(props) => props.theme.colors.textSecondary || '#999'};

  span {
    display: flex;
    align-items: center;

    &.separator {
      margin: 0 4px;
      color: ${(props) => props.theme.colors.textTertiary || '#666'};
    }

    &.active {
      color: ${(props) => props.theme.colors.primary || '#007bff'};
      font-weight: 500;
    }
  }
`;

const FeatureSidebarContainer = styled.div<{ $isVisible?: boolean }>`
  position: absolute;
  right: 0;
  top: 0;
  width: 280px;
  height: 100%;
  background: ${(props) => (props.theme?.colors as any)?.sidebarBg || '#1a1a1a'};
  border-left: 1px solid ${(props) => props.theme.colors.border || '#333'};
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  pointer-events: ${(props) => (props.$isVisible ? 'auto' : 'none')};
  transform: translateX(${(props) => (props.$isVisible ? '0' : '100%')});
`;

const ContentWrapper = styled.div`
  position: relative;
  flex: 1;
  overflow: hidden;
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${(props) => props.theme.colors.textSecondary || '#999'};
  font-size: 14px;

  &::after {
    content: '';
    animation: spin 1s linear infinite;
    width: 16px;
    height: 16px;
    border: 2px solid ${(props) => props.theme.colors.border || '#333'};
    border-top-color: ${(props) => props.theme.colors.primary || '#007bff'};
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
  color: ${(props) => props.theme.colors.textSecondary || '#999'};
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
 * - Feature sidebar: Conditional (e.g., Inventory when Mary+Inventory selected)
 */
const RelationalDashboardLayout = ({ userPermissions = {} }) => {
  const dispatch = useDispatch();

  // Redux selectors
  const selectedAssistant = useSelector(selectSelectedAssistant);
  const selectedDepartment = useSelector(selectSelectedDepartment);
  const selectedService = useSelector(selectSelectedService);
  const activeContext = useSelector(selectActiveContext);
  const showFeatureSidebar = useSelector(selectShowFeatureSidebar);

  // Department view component map
  const departmentViewMap = useMemo(() => ({
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
  } as any), []);

  // Fetch contextual data when context changes
  useEffect(() => {
    if (selectedAssistant && activeContext) {
      try {
        const isValid = isValidAssistantContext(selectedAssistant, activeContext);
        if (isValid) {
          // TODO: Implement contextual data fetching for selected assistant/context
          // dispatch(fetchContextualData({ assistantId: selectedAssistant, context: activeContext }));
          console.debug('[RelationalDashboardLayout] Context changed:', {
            selectedAssistant,
            activeContext,
            isValid
          });
        }
      } catch (error) {
        console.error('Error validating context:', error);
      }
    }
  }, [selectedAssistant, activeContext]);

  // Get sidebar configuration
  const renderConfig = getSidebarRenderConfig(
    selectedAssistant,
    selectedDepartment,
    activeContext
  ) as any;

  // Default to true for now since we always show sidebars
  const showRightSidebar = renderConfig?.showRightSidebar !== false;

  // Render feature-specific sidebar
  const renderFeatureSidebar = () => {
    if (!showFeatureSidebar || !selectedAssistant) return null;

    // Map assistant ID + context to sidebar components
    const featureSidebarMap = {
      'mary_001-inventory': <MaryInventorySidebar />,
      // Add more mappings as feature sidebars are created
      // 'daisy_001-leasing': <LeaseManagerSidebar />,
      // 'cipher_001-analytics': <AnalyticsSidebar />,
    } as any;

    const mapKey = `${selectedAssistant}-${activeContext}`;
    return featureSidebarMap[mapKey] || null;
  };

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

    // Get the component for the selected department
    const ViewComponent = departmentViewMap[selectedDepartment];

    if (!ViewComponent) {
      return (
        <EmptyState>
          <div>Department view not available for: {selectedDepartment}</div>
        </EmptyState>
      );
    }

    // Render the department view with service info
    return (
      <ViewComponent
        serviceName={selectedService || undefined}
        subitemId={undefined}
      />
    );
  };

  return (
    <DashboardContainer>
      {/* Left Sidebar: Departments & Services */}
      {renderConfig?.showLeftSidebar !== false && (
        <LeftSidebarWrapper>
          <RelationalLeftSidebar userPermissions={userPermissions} />
        </LeftSidebarWrapper>
      )}

      {/* Main Content Area */}
      <MainContentArea>
        <ContentWrapper>
          {/* Dashboard Content */}
          <DashboardContent>
            {/* Breadcrumb Navigation */}
            {selectedDepartment && (
              <BreadcrumbNav>
                <span className="active">
                  {selectedDepartment}
                </span>
                {selectedService && (
                  <>
                    <span className="separator">/</span>
                    <span className="active">
                      {selectedService}
                    </span>
                  </>
                )}
              </BreadcrumbNav>
            )}

            {/* Dynamic Content */}
            {renderMainContent()}
          </DashboardContent>

          {/* Feature-Specific Sidebar (e.g., Inventory, Leasing, Analytics) */}
          <FeatureSidebarContainer $isVisible={showFeatureSidebar}>
            {renderFeatureSidebar()}
          </FeatureSidebarContainer>
        </ContentWrapper>

        {/* Right Sidebar: AI Assistants */}
        {renderConfig?.showRightSidebar !== false && (
          <RelationalRightSidebar
            selectedDepartment={selectedDepartment}
            selectedService={selectedService}
            userPermissions={userPermissions}
          />
        )}
      </MainContentArea>
    </DashboardContainer>
  );
};

export default RelationalDashboardLayout;
