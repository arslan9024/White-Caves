// src/components/layout/DashboardLayout/DualSidebarLayout.tsx
/**
 * Dual Sidebar Layout Component
 * Main dashboard layout with left sidebar (departments) and right sidebar (AI assistants)
 * Dynamic content area in the middle that loads features based on sidebar selection
 */

import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { CompanyDepartmentSidebar } from '../../sidebars/CompanyDepartmentSidebar/CompanyDepartmentSidebar';
import { AIAssistantsSidebar } from '../../sidebars/AIAssistantsSidebar/AIAssistantsSidebar';
import DynamicContentRouter from './DynamicContentRouter';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background: ${props => props.theme.colors.background};
  overflow: hidden;
`;

const LeftSidebarWrapper = styled.div`
  width: 280px;
  height: 100%;
  border-right: 1px solid ${props => props.theme.colors.border};
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }
`;

const ContentAreaWrapper = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Content transitions smoothly */
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0.8;
    }
    to {
      opacity: 1;
    }
  }
`;

const RightSidebarWrapper = styled.div`
  width: 280px;
  height: 100%;
  border-left: 1px solid ${props => props.theme.colors.border};
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;

    &:hover {
      background: ${props => props.theme.colors.textSecondary};
    }
  }
`;

const StatusBar = styled.div`
  height: 48px;
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-size: 13px;
`;

const BreadcrumbNav = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);

  span {
    color: white;
    font-weight: 600;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;

  .indicator {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);

    &.active {
      background: #10b981;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  }
`;

export interface DualSidebarLayoutProps {
  className?: string;
}

export const DualSidebarLayout: React.FC<DualSidebarLayoutProps> = ({ className }) => {
  const [activeFeature, setActiveFeature] = useState<string>('dashboard');
  const [activeDepartment, setActiveDepartment] = useState<string>('SALES');
  const [activeAssistant, setActiveAssistant] = useState<string>('nina');
  const [contentContext, setContentContext] = useState<{
    department?: string;
    role?: string;
    assistantId?: string;
  }>({});

  const handleDepartmentSelect = useCallback((featureId: string, context?: any) => {
    setActiveFeature(featureId);
    setContentContext(context || {});
    if (context?.department) {
      setActiveDepartment(context.department);
    }
  }, []);

  const handleAssistantSelect = useCallback((assistantId: string, context?: any) => {
    setActiveFeature(`ai-${assistantId}`);
    setActiveAssistant(assistantId);
    setContentContext(context || { assistantId });
  }, []);

  const getBreadcrumbText = (): string => {
    if (activeFeature.startsWith('ai-')) {
      return `AI Assistants / ${activeAssistant}`;
    }
    if (activeFeature.startsWith('dept-')) {
      return `Departments / ${activeDepartment}`;
    }
    return 'White Caves Dashboard';
  };

  return (
    <LayoutContainer className={className}>
      {/* LEFT SIDEBAR: COMPANY DEPARTMENTS */}
      <LeftSidebarWrapper>
        <CompanyDepartmentSidebar
          onFeatureSelect={handleDepartmentSelect}
          activeFeature={activeFeature}
          activeDepartment={activeDepartment}
        />
      </LeftSidebarWrapper>

      {/* CONTENT AREA: DYNAMIC FEATURE RENDERING */}
      <ContentAreaWrapper>
        {/* Status Bar with Breadcrumb Navigation */}
        <StatusBar>
          <BreadcrumbNav>
            <span>🏢</span>
            <span>{getBreadcrumbText()}</span>
          </BreadcrumbNav>
          <StatusIndicator>
            <div className="indicator">
              <span>System Status:</span>
              <div className="dot active" />
              <span>All Systems Active</span>
            </div>
          </StatusIndicator>
        </StatusBar>

        {/* Dynamic Content Router */}
        <DynamicContentRouter
          featureId={activeFeature}
          context={contentContext}
        />
      </ContentAreaWrapper>

      {/* RIGHT SIDEBAR: AI ASSISTANTS */}
      <RightSidebarWrapper>
        <AIAssistantsSidebar
          onAssistantSelect={handleAssistantSelect}
          activeAssistant={activeAssistant}
        />
      </RightSidebarWrapper>
    </LayoutContainer>
  );
};

export default DualSidebarLayout;
