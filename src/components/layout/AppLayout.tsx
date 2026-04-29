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
 *   ├────┬──────────────────────────────────────────┤
 *   │64px│              Main Content                │
 *   │Rail│         (responsive, full width)         │
 *   └────┴──────────────────────────────────────────┘
 *
 *   Mobile (<768px):
 *   ┌──────────────── TopBar (56px) ────────────────┐
 *   │                Main Content                   │
 *         + 56px bottom mobile nav (MobileBottomNav)
 *
 * - TopBar: unified breadcrumb nav, Cmd+K search, notifications, user menu
 * - Desktop: EnhancedLeftSidebar (280px, departments + AI inline)
 * - Tablet: SidebarContainer (64px rail + 240px flyout)
 * - Mobile: Hidden sidebar, content full width, bottom nav
 * - CommandPalette: global search overlay (Cmd+K)
 */

import React, { useEffect, ReactNode, lazy, Suspense, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRole } from '../../store/navigationSlice';
import { useResponsiveLayout } from '../../hooks/navigation/useResponsiveLayout';
import { TopBar } from './TopBar';
import SidebarContainer from './SidebarContainer';
import EnhancedLeftSidebar from './EnhancedLeftSidebar/EnhancedLeftSidebar';
import CommandPalette from '../common/CommandPalette';
import { AppLayoutContainer, AppBody, AppMain } from './AppLayout/styles';
import type { RootState } from '../../store/store';
import { authFetch } from '../../utils/authFetch';
import { createLogger } from '../../utils/logger';

const log = createLogger('AppLayout');

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
  isSuperUser = false,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const { isDesktop, isTablet } = useResponsiveLayout();
  const showCrmChrome = showNav && Boolean(user);

  // ─── Notifications ────────────────────────────────────────────────
  const [notifications, setNotifications] = useState<Array<{ id: string; read: boolean; title?: string; message?: string }>>([]);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await authFetch('/api/notifications?pageSize=20');
      if (res.ok) {
        const json = await res.json();
        const items = json.data || json.notifications || [];
        setNotifications(
          items.map((n: Record<string, unknown>) => ({
            id: String(n.id ?? n._id ?? ''),
            read: Boolean(n.read ?? n.isRead ?? false),
          }))
        );
      }
    } catch (err) {
      log.warn('Failed to fetch notifications:', err);
    }
  }, [user]);

  useEffect(() => {
    if (!showCrmChrome) return;
    fetchNotifications();
    // Poll every 60 seconds for new notifications
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [showCrmChrome, fetchNotifications]);

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
      {showCrmChrome && (
        <TopBar
          notifications={notifications}
        />
      )}

      {/* ─── Command Palette Overlay (Cmd+K / Ctrl+K) ─────────────── */}
      {showCrmChrome && <CommandPalette />}

      {/* ─── Body: Responsive Navigation + Content ────────────────── */}
      <AppBody>
        {/* Desktop (1024px+): 280px Unified Sidebar */}
        {showCrmChrome && isDesktop && <EnhancedLeftSidebar isSuperUser={isSuperUser} />}

        {/* Tablet (768-1023px): 64px Rail + 240px Flyout */}
        {showCrmChrome && isTablet && <SidebarContainer />}

        {/* Mobile (<768px): Hidden, content full width + bottom nav */}

        {/* Main content area — responsive width based on sidebar */}
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
