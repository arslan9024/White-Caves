import styled from 'styled-components';
import { theme } from '../../../styles/theme';

const { colors, transitions } = theme;

/**
 * Unified CRM Layout: TopBar (56px) + Sidebar + Content
 *
 * Desktop (1024px+):  [280px Sidebar] [--- Content (full width) ---]
 * Tablet (768-1023px): [64px collapsed Sidebar] [--- Content ---]
 * Mobile (<768px):     [--- Full width ---] + 56px bottom nav
 */

export const AppLayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${colors.background.primary};

  @media (prefers-color-scheme: dark) {
    background: ${colors.background.dark};
  }
`;

export const AppBody = styled.div`
  display: flex;
  flex: 1;
  padding-top: 56px; /* TopBar height */
`;

export const AppMain = styled.main<{ $withNav?: boolean }>`
  flex: 1;
  min-height: calc(100vh - 56px);
  background: ${colors.background.primary};
  overflow-y: auto;
  transition: margin-left ${transitions.durations.shorter} ${transitions.easing.easeInOut};

  /* Add bottom padding for MobileBottomNav on mobile */
  @media (max-width: 767px) {
    padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px));
  }

  @media (prefers-color-scheme: dark) {
    background: ${colors.background.dark};
  }
`;
