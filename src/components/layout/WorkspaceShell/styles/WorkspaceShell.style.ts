/**
 * WorkspaceShell.style.ts — Hardware-Accelerated Layout Grid & Red/White Skeletons
 */

import styled, { keyframes } from 'styled-components';

const shimmerRedWhite = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const WorkspaceCanvas = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${({ $isDark }) => ($isDark ? '#0F172A' : '#F8FAFC')};
  color: ${({ $isDark }) => ($isDark ? '#F1F5F9' : '#0F172A')};
  transition: background-color 0.3s ease;
`;

export const MainContentContainer = styled.main<{
  $sidebarWidth: number;
  $headerHeight: number;
  $padding: number;
}>`
  margin-top: ${({ $headerHeight }) => `${$headerHeight}px`};
  margin-left: ${({ $sidebarWidth }) => `${$sidebarWidth}px`};
  padding: ${({ $padding }) => `${$padding}px`};
  min-height: calc(100vh - ${({ $headerHeight }) => `${$headerHeight}px`});
  transition: margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 16px;
  }
`;

export const RedWhiteSkeletonCard = styled.div<{ $height?: string; $isDark: boolean }>`
  height: ${({ $height }) => $height || '140px'};
  width: 100%;
  border-radius: 12px;
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.15)')};
  background: ${({ $isDark }) =>
    $isDark
      ? 'linear-gradient(90deg, #1E293B 25%, rgba(239, 68, 68, 0.15) 50%, #1E293B 75%)'
      : 'linear-gradient(90deg, #FFFFFF 25%, rgba(239, 68, 68, 0.08) 50%, #FFFFFF 75%)'};
  background-size: 200% 100%;
  animation: ${shimmerRedWhite} 1.8s infinite linear;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.05);
`;
