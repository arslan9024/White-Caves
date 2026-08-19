/**
 * MobileCRMBottomNav.logic.ts — Hook Layer
 */

import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface NavTab {
  id: string;
  label: string;
  path: string;
  icon: string;
}

export const MOBILE_NAV_TABS: NavTab[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/crm/dashboard', icon: 'LayoutDashboard' },
  { id: 'leads', label: 'Leads', path: '/crm/leads', icon: 'Users' },
  { id: 'listings', label: 'Listings', path: '/crm/listings', icon: 'Building2' },
  { id: 'calendar', label: 'Calendar', path: '/crm/calendar', icon: 'Calendar' },
  { id: 'profile', label: 'Profile', path: '/crm/profile', icon: 'User' },
];

export interface UseMobileCRMBottomNavReturn {
  tabs: NavTab[];
  activeTabId: string;
  navigate: (path: string) => void;
}

export function useMobileCRMBottomNavLogic(): UseMobileCRMBottomNavReturn {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const activeTabId = MOBILE_NAV_TABS.find(t => pathname.startsWith(t.path))?.id ?? 'dashboard';

  const navigate = useCallback((path: string) => nav(path), [nav]);

  return { tabs: MOBILE_NAV_TABS, activeTabId, navigate };
}
