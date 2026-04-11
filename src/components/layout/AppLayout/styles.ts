import styled from 'styled-components';
import { theme } from '../../../styles/theme';

const { colors, mediaQueries, transitions } = theme;

/**
 * Unified CRM Layout: TopBar (56px) + SidebarRail (64px) + Content
 *
 * Desktop:  [64px Rail] [--- Content (full width) ---]
 * Tablet:   [--- Full width ---] (no sidebar)
 * Mobile:   [--- Full width ---] + 56px bottom nav
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

  /* When sidebar rail is shown (desktop), offset content */
  ${props => props.$withNav && `
    margin-left: 64px;

    ${mediaQueries.tablet} {
      margin-left: 0;
    }
  `}

  /* Add bottom padding for MobileBottomNav on tablet/mobile */
  ${mediaQueries.tablet} {
    padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px));
  }

  @media (prefers-color-scheme: dark) {
    background: ${colors.background.dark};
  }
`;
