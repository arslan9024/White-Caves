import styled from 'styled-components';

/**
 * New CRM Layout: TopBar (56px) + SidebarRail (64px) + Content
 *
 * Desktop:  [64px Rail] [--- Content ---] [360px Right Panel (optional)]
 * Mobile:   [--- Full width ---] + bottom nav
 */

export const AppLayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F8F9FB;

  @media (prefers-color-scheme: dark) {
    background: #0F172A;
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
  background: #F8F9FB;
  overflow-y: auto;
  transition: margin-left 0.2s ease;

  /* When sidebar rail is shown (desktop), offset content */
  ${props => props.$withNav && `
    margin-left: 64px;

    @media (max-width: 768px) {
      margin-left: 0;
    }
  `}

  @media (prefers-color-scheme: dark) {
    background: #0F172A;
  }
`;
