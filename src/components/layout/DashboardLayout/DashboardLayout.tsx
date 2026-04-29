// src/components/layout/DashboardLayout/DashboardLayout.tsx
/**
 * Main Dashboard Layout Component
 * Integrates the sidebar and dynamic content rendering
 * This is your main working area component
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { MaryInventorySidebar } from '../../sidebars/MaryInventorySidebar/MaryInventorySidebar';
import { DynamicContentRouter } from '../DashboardWorkspace/DynamicContentRouter';
import { featureRegistry } from '../../layout/DashboardWorkspace/FeatureRegistry';
import allFeatures from '../../../config/featureRegistration';
import { RootState } from '../../../store';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.family};
`;

const SidebarWrapper = styled.div`
  width: 280px;
  height: 100%;
  border-right: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.sidebarBg};
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 3px;

    &:hover {
      background: ${props => props.theme.colors.scrollbarHover};
    }
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  background: ${props => props.theme.colors.background};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 4px;

    &:hover {
      background: ${props => props.theme.colors.scrollbarHover};
    }
  }
`;

export interface DashboardLayoutProps {
  sidebarWidth?: number;
  showMobileMenu?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  sidebarWidth = 280,
}) => {
  const dispatch = useDispatch();
  const activeFeature = useSelector((state: RootState) => state.sidebarUI.activeFeature);

  // Initialize features on mount
  useEffect(() => {
    // Register all features
    featureRegistry.registerFeatures(allFeatures);

    // Set default feature if none is selected
    if (!activeFeature) {
      dispatch({
        type: 'sidebarUI/setActiveFeature',
        payload: 'inventory-dashboard',
      });
    }
  }, []);

  const handleFeatureSelect = (featureId: string) => {
    dispatch({
      type: 'sidebarUI/setActiveFeature',
      payload: featureId,
    });
  };

  return (
    <LayoutContainer>
      <SidebarWrapper style={{ width: `${sidebarWidth}px` }}>
        <MaryInventorySidebar
          activeFeature={activeFeature}
          onFeatureSelect={handleFeatureSelect}
        />
      </SidebarWrapper>

      <ContentWrapper>
        <ContentArea>
          <DynamicContentRouter featureId={activeFeature} />
        </ContentArea>
      </ContentWrapper>
    </LayoutContainer>
  );
};

export default DashboardLayout;
