/**
 * AppLayout — Unified CRM Dashboard Layout
 *
 * Structure:
 *   ┌──────────────── TopBar (56px fixed) ─────────────────┐
 *   │ [WC Logo] | Breadcrumbs ──── [⌘K] [🔔] [👤 User ▾] │
 *   ├──────┬───────────────────────────────────────────────┤
 *   │ Rail │              Main Content                     │
 *   │ 64px │                                               │
 *   │      │  (full width — no right panel)                │
 *   └──────┴───────────────────────────────────────────────┘
 *
 * - TopBar: unified breadcrumb nav, Cmd+K search, notifications, user menu
 * - SidebarContainer: 64px icon rail + 240px flyout for BOTH departments & AI assistants
 * - CommandPalette: global search overlay (Cmd+K)
 * - AI Command Center: integrated into left sidebar flyout (no separate right panel)
 */

import React, { useEffect, ReactNode, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveRole } from '../../store/navigationSlice';
import { TopBar } from './TopBar';
import SidebarContainer from './SidebarContainer';
import CommandPalette from '../common/CommandPalette';
import { AppLayoutContainer, AppBody, AppMain } from './AppLayout/styles';

// Lazy-load non-critical UI
const BiometricReminder = lazy(() =>
  import('../../features/auth/components/BiometricLogin').then(m => ({
    default: m.BiometricReminder,
  }))
);

interface AppLayoutProps {
  children: ReactNode;
  /** Show sidebar navigation (default: true) */
  showNav?: boolean;
  /** Optional props forwarded to SidebarContainer */
  navProps?: Record<string, unknown>;
}

const ROLE_PATHS: string[] = [
  'buyer', 'seller', 'landlord', 'tenant',
  'leasing-agent', 'secondary-sales-agent', 'owner',
];

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showNav = true,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Detect role from URL and sync to Redux
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const potentialRole = pathParts[1];
    if (ROLE_PATHS.includes(potentialRole)) {
      dispatch(setActiveRole(potentialRole));
    }
  }, [location.pathname, dispatch]);

  return (
    <AppLayoutContainer>
      {/* ─── Top Navigation Bar (56px) ─────────────────────────────── */}
      <TopBar />

      {/* ─── Command Palette Overlay (Cmd+K / Ctrl+K) ─────────────── */}
      <CommandPalette />

      {/* ─── Body: Rail + Content (full width, no right panel) ─────── */}
      <AppBody>
        {/* Left icon rail (64px) + unified flyout (departments & AI) */}
        {showNav && <SidebarContainer />}

        {/* Main content area — full width */}
        <AppMain $withNav={showNav}>
          <Suspense fallback={null}>
            <BiometricReminder />
          </Suspense>
          {children}
        </AppMain>
      </AppBody>
    </AppLayoutContainer>
  );
};

export default AppLayout;
