/**
 * PortalLayout — Phase 2.12: Lightweight layout for self-service portals
 *
 * Wraps Landlord and Tenant portal pages with a simple header + main area.
 * Does NOT include the CRM sidebar or main AppLayout.
 *
 * Structure:
 *   ┌─────────────── PortalNavbar (60px) ────────────────┐
 *   │  [Logo] [Landlord/Tenant Portal]    [User] [Logout] │
 *   ├─────────────────────────────────────────────────────┤
 *   │                   <children>                        │
 *   └─────────────────────────────────────────────────────┘
 *
 * @component
 */

import React, { FC, ReactNode } from 'react';
import PortalNavbar, { type PortalType } from './PortalNavbar';

interface PortalLayoutProps {
  /** Which portal this layout belongs to */
  portalType: PortalType;
  children: ReactNode;
}

const PortalLayout: FC<PortalLayoutProps> = ({ portalType, children }) => (
  <div className={`portal-layout portal-layout--${portalType}`} data-testid="portal-layout">
    <PortalNavbar portalType={portalType} />
    <main className="portal-layout__main" id="portal-main-content">
      {children}
    </main>
  </div>
);

export default PortalLayout;
