/**
 * Sidebar108.style.ts — Isolated Hardware-Accelerated Styling Engine
 */

import styled from 'styled-components';

export const SidebarContainer = styled.aside<{ $isCollapsed: boolean; $isDark: boolean }>`
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  width: ${({ $isCollapsed }) => ($isCollapsed ? '72px' : '280px')};
  background: ${({ $isDark }) => ($isDark ? '#0B1120' : '#FFFFFF')};
  border-right: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(239, 68, 68, 0.2)' : '#F1F5F9')};
  box-shadow: ${({ $isDark }) =>
    $isDark ? '4px 0 24px rgba(0, 0, 0, 0.4)' : '4px 0 20px rgba(0, 0, 0, 0.03)'};
  z-index: 900;
  display: flex;
  flex-direction: column;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease;
  overflow: hidden;
  user-select: none;

  @media (max-width: 768px) {
    transform: ${({ $isCollapsed }) => ($isCollapsed ? 'translateX(-100%)' : 'translateX(0)')};
    width: 280px;
  }
`;

export const SidebarHeader = styled.div<{ $isDark: boolean }>`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid ${({ $isDark }) => ($isDark ? '#1E293B' : '#F1F5F9')};
`;

export const SidebarScrollableArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(239, 68, 68, 0.3);
    border-radius: 4px;
  }
`;

export const FounderHubPodium = styled.div<{ $isDark: boolean }>`
  margin: 6px 4px 14px 4px;
  padding: 12px;
  border-radius: 12px;
  background: ${({ $isDark }) =>
    $isDark
      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, #FFFFFF 100%)'};
  border: 1px solid #EF4444;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.15);
`;

export const NavItemButton = styled.button<{ $isActive: boolean; $isDark: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  margin-bottom: 3px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: ${({ $isActive }) => ($isActive ? '700' : '500')};
  background: ${({ $isActive, $isDark }) =>
    $isActive
      ? $isDark
        ? 'rgba(239, 68, 68, 0.2)'
        : 'rgba(239, 68, 68, 0.08)'
      : 'transparent'};
  color: ${({ $isActive, $isDark }) =>
    $isActive ? '#EF4444' : $isDark ? '#94A3B8' : '#475569'};
  border: 1px solid ${({ $isActive }) => ($isActive ? 'rgba(239, 68, 68, 0.4)' : 'transparent')};
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: ${({ $isDark }) =>
      $isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.04)'};
    color: #EF4444;
  }
`;

export const SidebarFooter = styled.div<{ $isDark: boolean }>`
  padding: 12px;
  border-top: 1px solid ${({ $isDark }) => ($isDark ? '#1E293B' : '#F1F5F9')};
  background: ${({ $isDark }) => ($isDark ? '#0F172A' : '#F8FAFC')};
`;
