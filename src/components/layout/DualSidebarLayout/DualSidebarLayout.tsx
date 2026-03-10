/**
 * Enhanced Dual Sidebar Layout with Resizable Support
 * Wraps left and right sidebars with resize functionality
 */

import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import { ResizableSidebar } from '../../ResizableSidebar';

export type DualSidebarLayoutProps = {
  leftSidebarContent?: ReactNode;
  rightSidebarContent?: ReactNode;
  centerContent: ReactNode;
  showLeftSidebar?: boolean;
  showRightSidebar?: boolean;
  onLeftSidebarResize?: (width: number) => void;
  onRightSidebarResize?: (width: number) => void;
  className?: string;
};

const LayoutContainer = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 64px); // Navbar height (64px)
  margin-top: 64px;
  background: ${theme.colors.background.primary};
  position: relative;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    height: auto;
  }
`;

const LeftSidebarWrapper = styled.div<{ $show: boolean }>`
  display: ${(props) => (props.$show ? 'flex' : 'none')};
  flex-direction: column;
  min-width: 200px;
  max-width: 500px;
  background: ${theme.colors.background.secondary};
  border-right: 1px solid ${theme.colors.border};

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
    max-width: none;
    border-right: none;
    border-bottom: 1px solid ${theme.colors.border};
  }
`;

const CenterContentWrapper = styled.div<{ $withLeftSidebar: boolean; $withRightSidebar: boolean }>`
  flex: 1;
  overflow-y: auto;
  min-width: 0;
  background: ${theme.colors.background.primary};

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

const RightSidebarWrapper = styled.div<{ $show: boolean }>`
  display: ${(props) => (props.$show ? 'flex' : 'none')};
  flex-direction: column;
  min-width: 200px;
  max-width: 500px;
  background: ${theme.colors.background.secondary};
  border-left: 1px solid ${theme.colors.border};

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
    max-width: none;
    border-left: none;
    border-top: 1px solid ${theme.colors.border};
  }
`;

const ResizeInfo = styled.div`
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.text.disabled};
  text-align: center;
  padding: ${theme.spacing.sm};
  border-top: 1px solid ${theme.colors.border};
  background: ${theme.colors.background.primary};

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

export const DualSidebarLayout: React.FC<DualSidebarLayoutProps> = ({
  leftSidebarContent,
  rightSidebarContent,
  centerContent,
  showLeftSidebar = true,
  showRightSidebar = true,
  onLeftSidebarResize,
  onRightSidebarResize,
  className = '',
}) => {
  return (
    <LayoutContainer className={className}>
      {showLeftSidebar && (
        <LeftSidebarWrapper $show={showLeftSidebar}>
          <ResizableSidebar
            side="left"
            onResize={onLeftSidebarResize}
          >
            {leftSidebarContent}
          </ResizableSidebar>
        </LeftSidebarWrapper>
      )}

      <CenterContentWrapper
        $withLeftSidebar={showLeftSidebar}
        $withRightSidebar={showRightSidebar}
      >
        {centerContent}
      </CenterContentWrapper>

      {showRightSidebar && (
        <RightSidebarWrapper $show={showRightSidebar}>
          <ResizableSidebar
            side="right"
            onResize={onRightSidebarResize}
          >
            {rightSidebarContent}
            <ResizeInfo>💡 Drag edges to resize</ResizeInfo>
          </ResizableSidebar>
        </RightSidebarWrapper>
      )}
    </LayoutContainer>
  );
};

DualSidebarLayout.displayName = 'DualSidebarLayout';

export default DualSidebarLayout;
