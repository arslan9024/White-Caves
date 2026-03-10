/**
 * Resizable Sidebar Component
 * Wraps sidebar content with drag-to-resize functionality
 */

import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { useResizableSidebar } from '../../hooks/useResizableSidebar';

export type ResizableSidebarProps = {
  side: 'left' | 'right';
  children: ReactNode;
  className?: string;
  onResize?: (width: number) => void;
};

const SidebarContainer = styled.div<{ $width: number; $isResizing: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${(props) => props.$width}px;
  height: 100vh;
  background: ${theme.colors.background.secondary};
  border-right: 1px solid ${theme.colors.border};
  overflow-y: auto;
  transition: ${(props) =>
    props.$isResizing ? 'none' : `width ${theme.transitions.durations.standard} ease`};
  position: relative;
  user-select: ${(props) => (props.$isResizing ? 'none' : 'auto')};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid ${theme.colors.border};
  }
`;

const ResizeHandle = styled.div<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 0;
  ${(props) => (props.$side === 'right' ? 'left: 0;' : 'right: 0;')}
  width: 4px;
  height: 100%;
  background: transparent;
  cursor: ${(props) => (props.$side === 'right' ? 'w-resize' : 'e-resize')};
  transition: ${theme.transitions.create('background', theme.transitions.durations.short)};
  
  &:hover {
    background: ${theme.colors.primary};
  }

  &:active {
    background: ${theme.colors.primary};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 4px; // Space for resize handle

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: 3px;

    &:hover {
      background: ${theme.colors.text.secondary};
    }
  }
`;

const ResetButton = styled.button`
  align-self: flex-end;
  margin-right: ${theme.spacing.md};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.text.secondary};
  background: none;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.spacing.xs};
  cursor: pointer;
  transition: ${theme.transitions.create('all', theme.transitions.durations.standard)};
  
  &:hover {
    color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
    background: ${theme.colors.background.primary};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

export const ResizableSidebar: React.FC<ResizableSidebarProps> = ({
  side,
  children,
  className = '',
  onResize,
}) => {
  const { width, setWidth, isResizing, setIsResizing, resetWidth, MIN_WIDTH, MAX_WIDTH } =
    useResizableSidebar(side);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      let newWidth: number;

      if (side === 'right') {
        newWidth = startWidth - delta; // Right sidebar: resize from left edge
      } else {
        newWidth = startWidth + delta; // Left sidebar: resize from right edge
      }

      setWidth(newWidth);
      onResize?.(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <SidebarContainer $width={width} $isResizing={isResizing} className={className}>
      <ResizeHandle $side={side} onMouseDown={handleMouseDown} title="Drag to resize" />
      <SidebarContent>
        {children}
      </SidebarContent>
      <ResetButton onClick={resetWidth} title="Reset sidebar width">
        ↺ Reset
      </ResetButton>
    </SidebarContainer>
  );
};

ResizableSidebar.displayName = 'ResizableSidebar';

export default ResizableSidebar;
