import styled from 'styled-components';
import { theme } from '../../../styles/theme';

/* ===============================================
   DASHBOARD SHELL CONTAINER
   =============================================== */

export const DashboardShellContainer = styled.div<{
  $sidebarCollapsed?: boolean;
  $rightPanelOpen?: boolean;
}>`
  min-height: 100vh;
  background: ${theme.colors.background.tertiary};

  @media (prefers-color-scheme: dark) {
    background: #0f0f1a;
  }
`;

/* ===============================================
   DASHBOARD MAIN
   =============================================== */

export const DashboardMain = styled.main<{
  $sidebarCollapsed?: boolean;
  $rightPanelOpen?: boolean;
}>`
  margin-left: 280px;
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-right: ${props => (props.$rightPanelOpen ? '360px' : '0')};

  ${props =>
    props.$sidebarCollapsed &&
    `
    margin-left: 72px;
  `}

  @media (max-width: 1280px) {
    ${props =>
      props.$rightPanelOpen &&
      `
      margin-right: 320px;
    `}
  }

  @media (max-width: 1024px) {
    margin-left: 0;
    margin-right: 0;

    ${props =>
      props.$sidebarCollapsed &&
      `
      margin-left: 0;
    `}
  }

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

/* ===============================================
   DASHBOARD CONTENT
   =============================================== */

export const DashboardContent = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 1280px) {
    padding: ${theme.spacing.md};
  }

  @media (max-width: 1024px) {
    padding: ${theme.spacing.md};
  }

  @media (max-width: 768px) {
    padding: ${theme.spacing.sm};
  }
`;

/* ===============================================
   MOBILE OVERLAY
   =============================================== */

export const MobileOverlay = styled.div`
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  backdrop-filter: blur(4px);
`;
