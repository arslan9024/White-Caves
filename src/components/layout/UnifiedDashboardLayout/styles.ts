import styled from 'styled-components';
import { theme } from '../../../styles/theme';

/* ===============================================
   UNIFIED DASHBOARD LAYOUT CONTAINER
   =============================================== */

export const DashboardLayoutContainer = styled.div<{
  $sidebarCollapsed?: boolean;
  $rightPanelOpen?: boolean;
  $isMobile?: boolean;
  $isTablet?: boolean;
}>`
  min-height: 100vh;
  display: grid;
  grid-template-columns: ${props => {
    if (props.$isMobile) return '1fr';
    if (props.$isTablet) {
      return props.$rightPanelOpen ? '280px 1fr 300px' : '280px 1fr';
    }
    // Desktop
    const leftWidth = props.$sidebarCollapsed ? '72px' : '280px';
    return props.$rightPanelOpen ? `${leftWidth} 1fr 360px` : `${leftWidth} 1fr`;
  }};
  grid-template-rows: 64px 1fr;
  background: ${theme.colors.background.tertiary};
  transition: grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (prefers-color-scheme: dark) {
    background: #0f0f1a;
  }

  @media (max-width: 1199px) {
    /* Tablet layout */
    grid-template-columns: ${props => {
      if (props.$rightPanelOpen) {
        return props.$sidebarCollapsed ? '72px 1fr 300px' : '280px 1fr 300px';
      }
      return props.$sidebarCollapsed ? '72px 1fr' : '280px 1fr';
    }};
  }

  @media (max-width: 767px) {
    /* Mobile layout - stack vertically */
    grid-template-columns: 1fr;
    grid-template-rows: 64px 1fr;
  }
`;

/* ===============================================
   NAVBAR
   =============================================== */

export const DashboardNavBar = styled.header`
  grid-column: 1 / -1;
  z-index: ${theme.zIndex.navbar};
`;

/* ===============================================
   SIDEBAR CONTAINER
   =============================================== */

export const DashboardSidebarContainer = styled.aside`
  grid-column: 1;
  grid-row: 2;
  z-index: ${theme.zIndex.sidebar};

  @media (max-width: 767px) {
    display: none;

    /* Show when invoked on mobile */
    ${props => (props as any).$show && 'display: flex;'}
  }
`;

/* ===============================================
   MAIN CONTENT AREA
   =============================================== */

export const DashboardMainContent = styled.main`
  grid-column: 2;
  grid-row: 2;
  overflow-y: auto;
  overflow-x: hidden;
  background: ${theme.colors.background.tertiary};

  @media (max-width: 767px) {
    grid-column: 1;
    padding-bottom: 72px; /* Space for mobile nav */
  }
`;

/* ===============================================
   RIGHT PANEL
   =============================================== */

export const DashboardRightPanel = styled.aside`
  grid-column: 3;
  grid-row: 2;
  z-index: ${theme.zIndex.sidebar};

  @media (max-width: 767px) {
    display: none;

    /* Show when invoked on mobile */
    ${props => (props as any).$show && 'display: flex;'}
  }
`;

/* ===============================================
   CONTENT WRAPPER
   =============================================== */

export const DashboardContentWrapper = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 1600px;
  margin: 0 auto;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 1280px) {
    padding: ${theme.spacing.md};
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing.sm};
  }
`;

/* ===============================================
   MOBILE OVERLAY (for floating panels)
   =============================================== */

export const DashboardOverlay = styled.div<{ $isVisible?: boolean }>`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${props => (props.$isVisible ? 1 : 0)};
  visibility: ${props => (props.$isVisible ? 'visible' : 'hidden')};
  z-index: ${props => (props.$isVisible ? '98' : '-1')};
  transition: opacity 0.3s ease, visibility 0.3s ease;

  @media (min-width: 768px) {
    display: none;
  }
`;

/* ===============================================
   LOADING SKELETON
   =============================================== */

export const SkeletonLoader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};

  @keyframes shimmer {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

export const SkeletonBlock = styled.div<{ $height?: string; $width?: string }>`
  height: ${props => props.$height || '20px'};
  width: ${props => props.$width || '100%'};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.spacing.xs};
  animation: shimmer 2s infinite;
`;

export const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background.secondary};
  border-radius: ${theme.spacing.xs};
  border: 1px solid ${theme.colors.border};
`;

/* ===============================================
   RESPONSIVE HELPERS
   =============================================== */

export const HideOnMobile = styled.div`
  @media (max-width: 767px) {
    display: none;
  }
`;

export const HideOnTablet = styled.div`
  @media (max-width: 1199px) {
    display: none;
  }
`;

export const ShowOnMobileOnly = styled.div`
  display: none;

  @media (max-width: 767px) {
    display: block;
  }
`;

/* ===============================================
   LAYOUT TRANSITIONS
   =============================================== */

export const TransitionGroup = styled.div`
  & > * {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;
