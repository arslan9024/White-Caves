/**
 * AppLayout — Unified CRM Dashboard Layout
 *
 * Structure (Responsive):
 *   Desktop (1024px+):
 *   ┌──────────────── TopBar (56px fixed) ─────────────────┐
 *   │ [WC Logo] | Breadcrumbs ──── [⌘K] [🔔] [👤 User ▾] │
 *   ├─────────┬────────────────────────────────────────────┤
 *   │ 280px   │              Main Content                  │
 *   │Sidebar  │         (responsive, full width)           │
 *   └─────────┴────────────────────────────────────────────┘
 *
 *   Tablet (768-1023px):
 *   ┌──────────────── TopBar (56px) ─────────────────┐
 *   ├────────────────────────────────────────────────┤
 *   │64px Sidebar │       Main Content               │
 *   └─────────────────────────────────────────────────┘
 *
 *   Mobile (<768px):
 *   ┌──────────────── TopBar (56px) ────────────────┐
 *   │                Main Content                   │
 *         + 56px bottom mobile nav (MobileBottomNav)
 *
 * - TopBar: unified breadcrumb nav, Cmd+K search, notifications, user menu
 * - Desktop/Tablet: EnhancedLeftSidebar (280px expanded / 64px collapsed)
 * - Mobile: Hidden sidebar, content full width, bottom nav
 * - CommandPalette: global search overlay (Cmd+K)
 */

import React, { useEffect, ReactNode, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRole } from '../../store/navigationSlice';
import { TopBar } from './TopBar';
import EnhancedLeftSidebar from './EnhancedLeftSidebar/EnhancedLeftSidebar';
import CommandPalette from '../common/CommandPalette';
import { AppLayoutContainer, AppBody, AppMain } from './AppLayout/styles';
import type { RootState } from '../../store/store';

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
  /** Is current user a super user (admin) */
  isSuperUser?: boolean;
}

const ROLE_PATHS: string[] = [
  'buyer',
  'seller',
  'landlord',
  'tenant',
  'leasing-agent',
  'secondary-sales-agent',
  'owner',
];

const AppLayout: React.FC<AppLayoutProps> = ({ children, showNav = true, isSuperUser = false }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const showCrmChrome = showNav && Boolean(user);

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
      {/* ─── Skip Navigation (WCAG 2.4.1) ────────────────────────── */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* ─── Top Navigation Bar (CRM only for authenticated users) ─── */}
      {showCrmChrome && <TopBar />}

      {/* ─── Command Palette Overlay (Cmd+K / Ctrl+K) ─────────────── */}
      {showCrmChrome && <CommandPalette />}

      {/* ─── Body: Unified Sidebar + Content ─────────────────────── */}
      <AppBody>
        {/* Unified sidebar: visible on tablet (768px+) and desktop */}
        {showCrmChrome && <EnhancedLeftSidebar isSuperUser={isSuperUser} />}

        {/* Main content area */}
        <AppMain $withNav={showCrmChrome} id="main-content" tabIndex={-1}>
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
