import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  selectSelectedAssistant,
  selectSelectedDepartment,
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
    background: ${(props) => props.theme.colors.scrollbar || '#555'};
    border-radius: 4px;

    &:hover {
      background: ${(props) => props.theme.colors.scrollbarHover || '#777'};
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

const FeatureSidebarContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 280px;
  height: 100%;
  background: ${(props) => props.theme.colors.sidebar.background || '#1a1a1a'};
  border-left: 1px solid ${(props) => props.theme.colors.border || '#333'};
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  pointer-events: ${(props) => (props.isVisible ? 'auto' : 'none')};
  transform: translateX(${(props) => (props.isVisible ? '0' : '100%')});
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
 * - Main content: Contextual display
 * - Feature sidebar: Conditional (e.g., Inventory when Mary+Inventory selected)
 */
const RelationalDashboardLayout = ({ userPermissions = {} }) => {
  const dispatch = useDispatch();

  // Redux selectors
  const selectedAssistant = useSelector(selectSelectedAssistant);
  const selectedDepartment = useSelector(selectSelectedDepartment);
  const activeContext = useSelector(selectActiveContext);
  const showFeatureSidebar = useSelector(selectShowFeatureSidebar);

  // Fetch contextual data when context changes
  useEffect(() => {
    if (selectedAssistant && activeContext) {
      try {
        const isValid = isValidAssistantContext(selectedAssistant, activeContext);
        if (isValid) {
          dispatch(fetchContextualData({ assistantId: selectedAssistant, context: activeContext }));
        }
      } catch (error) {
        console.error('Error fetching contextual data:', error);
      }
    }
  }, [selectedAssistant, activeContext, dispatch]);

  // Get sidebar configuration
  const renderConfig = getSidebarRenderConfig(
    selectedAssistant,
    selectedDepartment,
    activeContext
  );

  // Render feature-specific sidebar
  const renderFeatureSidebar = () => {
    if (!showFeatureSidebar || !selectedAssistant) return null;

    // Map assistant ID + context to sidebar components
    const featureSidebarMap = {
      'mary_001-inventory': <MaryInventorySidebar />,
      // Add more mappings as feature sidebars are created
      // 'daisy_001-leasing': <LeaseManagerSidebar />,
      // 'cipher_001-analytics': <AnalyticsSidebar />,
    };

    const mapKey = `${selectedAssistant}-${activeContext}`;
    return featureSidebarMap[mapKey] || null;
  };

  // Render main content based on current selection
  const renderMainContent = () => {
    if (!selectedAssistant) {
      return (
        <EmptyState>
          <div>Select an assistant to get started</div>
        </EmptyState>
      );
    }

    if (activeContext && showFeatureSidebar) {
      return (
        <EmptyState>
          <div>
            {activeContext.charAt(0).toUpperCase() + activeContext.slice(1)} tools
            are displayed in the sidebar →
          </div>
        </EmptyState>
      );
    }

    return (
      <EmptyState>
        <div>
          <div style={{ marginBottom: '16px' }}>
            {selectedAssistant.charAt(0).toUpperCase() + selectedAssistant.slice(1)} Assistant
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Select a context tool to begin working
          </div>
        </div>
      </EmptyState>
    );
  };

  return (
    <DashboardContainer>
      {/* Left Sidebar: Departments & Services */}
      {renderConfig.showLeftSidebar && (
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
            {renderConfig.breadcrumb && (
              <BreadcrumbNav>
                {renderConfig.breadcrumb.department && (
                  <>
                    <span className="active">
                      {renderConfig.breadcrumb.department}
                    </span>
                    <span className="separator">/</span>
                  </>
                )}

                {renderConfig.breadcrumb.assistant && (
                  <>
                    <span className="active">
                      {renderConfig.breadcrumb.assistant}
                    </span>
                    {renderConfig.breadcrumb.context && (
                      <>
                        <span className="separator">/</span>
                        <span className="active">
                          {renderConfig.breadcrumb.context}
                        </span>
                      </>
                    )}
                  </>
                )}
              </BreadcrumbNav>
            )}

            {/* Dynamic Content */}
            {renderMainContent()}
          </DashboardContent>

          {/* Feature-Specific Sidebar (e.g., Inventory, Leasing, Analytics) */}
          <FeatureSidebarContainer isVisible={showFeatureSidebar}>
            {renderFeatureSidebar()}
          </FeatureSidebarContainer>
        </ContentWrapper>

        {/* Right Sidebar: AI Assistants */}
        {renderConfig.showRightSidebar && (
          <RelationalRightSidebar
            selectedDepartment={selectedDepartment}
            selectedService={renderConfig.breadcrumb?.service}
            userPermissions={userPermissions}
          />
        )}
      </MainContentArea>
    </DashboardContainer>
  );
};

export default RelationalDashboardLayout;
