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
import type { RootState } from '../../../store/store';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background: ${({ theme }) => String((theme as any)?.colors?.backgroundAlt ?? '#f9fafb')};
  color: ${({ theme }) => String((theme as any)?.colors?.textPrimary ?? '#1f2937')};
  font-family: ${({ theme }) => String((theme as any)?.fonts?.family ?? 'Inter, sans-serif')};
`;

const SidebarWrapper = styled.div`
  width: 280px;
  height: 100%;
  border-right: 1px solid ${({ theme }) => String((theme as any)?.colors?.border ?? '#e5e7eb')};
  background: ${({ theme }) => String((theme as any)?.colors?.sidebarBg ?? '#ffffff')};
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => String((theme as any)?.colors?.borderDark ?? '#d1d5db')};
    border-radius: 3px;

    &:hover {
      background: ${({ theme }) => String((theme as any)?.colors?.textSecondary ?? '#6b7280')};
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
  background: ${({ theme }) => String((theme as any)?.colors?.backgroundAlt ?? '#f9fafb')};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => String((theme as any)?.colors?.borderDark ?? '#d1d5db')};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => String((theme as any)?.colors?.textSecondary ?? '#6b7280')};
    }
  }
`;

export interface DashboardLayoutProps {
  sidebarWidth?: number;
  showMobileMenu?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ sidebarWidth = 280 }) => {
  const dispatch = useDispatch();
  const activeFeature = useSelector(
    (state: RootState) => (state as any).sidebarUI?.activeFeature ?? null
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <MaryInventorySidebar activeFeature={activeFeature} onFeatureSelect={handleFeatureSelect} />
      </SidebarWrapper>

      <ContentWrapper>
        <ContentArea>
          <DynamicContentRouter activeFeatureId={activeFeature} />
        </ContentArea>
      </ContentWrapper>
    </LayoutContainer>
  );
};

export default DashboardLayout;
