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

import React, { useEffect, ReactNode, lazy, Suspense, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRole } from '../../store/navigationSlice';
import { setOfflineMode } from '../../store/dashboardSlice';
import { TopBar } from './TopBar';
import UnifiedSidebar from './UnifiedSidebar';
import CommandPalette from '../common/CommandPalette';
import styled, { keyframes } from 'styled-components';
import { AppLayoutContainer, AppBody, AppMain } from './AppLayout/styles';
import type { RootState } from '../../store/store';
import { authFetch } from '../../utils/authFetch';
import { hasPermission, PERMISSIONS } from '../../utils/permissions';
import { createLogger } from '../../utils/logger';

const log = createLogger('AppLayout');

// Lazy-load non-critical UI
const BiometricReminder = lazy(() =>
  import('../../features/auth/components/BiometricLogin').then(m => ({
    default: m.BiometricReminder,
  }))
);

const slideDown = keyframes`
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
`;

const OfflineBannerContainer = styled.div`
  background: linear-gradient(90deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  text-align: center;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: ${slideDown} 0.3s ease-out;
  position: relative;
  z-index: 10001;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

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

const isJsDomTestEnvironment =
  typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent);

export function canReadCompanyActivityNotifications(role: string | null | undefined): boolean {
  return hasPermission(role ?? null, PERMISSIONS.VIEW_AUDIT_LOGS);
}

import { MobileBottomNav } from './MobileBottomNav';

const AppLayout: React.FC<AppLayoutProps> = ({ children, showNav = true, isSuperUser = false }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const showCrmChrome = showNav && Boolean(user);

  // ─── Notifications ────────────────────────────────────────────────
  const [notifications, setNotifications] = useState<Array<{ id: string; read: boolean }>>([]);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    if (isJsDomTestEnvironment) {
      setNotifications([]);
      return;
    }
    if (!canReadCompanyActivityNotifications(user.role)) {
      setNotifications([]);
      return;
    }
    try {
      const res = await authFetch('/api/activities?limit=10&sortBy=createdAt&sortOrder=desc');
      if (res.ok) {
        const json = await res.json();
        const items = json.data || [];
        setNotifications(
          items.map((a: any) => ({
            id: a.id,
            title: `New Activity: ${a.type}`,
            message: a.description,
            timestamp: new Date(a.createdAt).toLocaleTimeString(),
            read: false, // We'd need an ActivityRead model to track this properly, assume false for now
          }))
        );
      }
    } catch (err) {
      log.warn('Failed to fetch activities:', err);
    }
  }, [user]);

  useEffect(() => {
    if (!showCrmChrome) return;
    fetchNotifications();
    // Poll every 60 seconds for new notifications
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [showCrmChrome, fetchNotifications]);

  const isOfflineMode = useSelector((state: RootState) => state.dashboard?.isOfflineMode ?? false);

  // Sync window online/offline events to Redux
  useEffect(() => {
    if (isJsDomTestEnvironment) return;

    const handleOnline = () => {
      dispatch(setOfflineMode(false));
      log.info('Application is online. Reconnected.');
    };
    const handleOffline = () => {
      dispatch(setOfflineMode(true));
      log.warn('Application is offline. Switched to offline cache mode.');
    };

    // Initialize with current status
    dispatch(setOfflineMode(!navigator.onLine));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

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
      {isOfflineMode && (
        <OfflineBannerContainer role="alert" aria-live="assertive">
          <span>⚠️</span> You are currently offline. Viewing cached CRM data only.
        </OfflineBannerContainer>
      )}
      {/* ─── Skip Navigation (WCAG 2.4.1) ────────────────────────── */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* ─── Top Navigation Bar (CRM only for authenticated users) ─── */}
      {showCrmChrome && <TopBar notifications={notifications} />}

      {/* ─── Command Palette Overlay (Cmd+K / Ctrl+K) ─────────────── */}
      {showCrmChrome && <CommandPalette />}

      {/* ─── Body: Unified Sidebar + Content ─────────────────────── */}
      <AppBody>
        {/* Unified sidebar: visible on tablet (768px+) and desktop */}
        {showCrmChrome && <UnifiedSidebar isSuperUser={isSuperUser} />}

        {/* Main content area */}
        <AppMain $withNav={showCrmChrome} id="main-content" tabIndex={-1}>
          <Suspense fallback={null}>
            <BiometricReminder />
          </Suspense>
          {children}
        </AppMain>
      </AppBody>

      {/* ─── Mobile Bottom Nav (Wave 23) ─────────────────────────── */}
      {showCrmChrome && <MobileBottomNav />}
    </AppLayoutContainer>
  );
};

export default AppLayout;
