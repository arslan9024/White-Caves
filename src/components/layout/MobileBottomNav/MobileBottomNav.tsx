/**
 * MobileBottomNav — Wave 23 CRM-specific 5-tab bottom navigation (≤ 768px)
 *
 * Tabs: Home, Leads, Properties, Viewings, More (opens drawer)
 *
 * Features:
 * - 56px fixed bar + safe-area-inset-bottom for iPhone notch
 * - Gold active indicator dot + icon color
 * - Unread badge on Leads tab for new/unread count
 * - More tab opens the MobileMenuDrawer (via onMenuOpen callback)
 * - 44×44px minimum touch targets per WCAG 2.1 AA
 * - Keyboard accessible (tab + enter/space)
 * - prefers-reduced-motion respected
 * - React Router navigation on tab change
 *
 * @agent @Una + @Tracy — Wave 23 (W23-009)
 */

import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Building2,
  Calendar,
  MoreHorizontal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { selectQueuedCount } from '../../../store/slices/nadiaSlice';
import {
  BottomNavContainer,
  BottomNavItem,
  BottomNavLabel,
  BottomNavBadge,
} from './styles';

// ─── Tab definitions (CRM-specific per Wave 23 SDD) ─────────────────────

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  badgeKey?: string;
}

const TABS: Tab[] = [
  { id: 'home', label: 'Home', icon: Home, path: '/crm' },
  { id: 'leads', label: 'Leads', icon: Users, path: '/crm/leads', badgeKey: 'leads' },
  { id: 'properties', label: 'Properties', icon: Building2, path: '/crm/properties' },
  { id: 'viewings', label: 'Viewings', icon: Calendar, path: '/crm/viewings' },
  { id: 'more', label: 'More', icon: MoreHorizontal, path: '' },
];

// ─── Props ────────────────────────────────────────────────────────────────

interface MobileBottomNavProps {
  /** Number of new/unread leads to show as badge */
  unreadLeadCount?: number;
  /** Called when user taps the More tab — parent opens the MobileMenuDrawer */
  onMenuOpen?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────

const MobileBottomNav: React.FC<MobileBottomNavProps> = React.memo(function MobileBottomNav({
  unreadLeadCount = 0,
  onMenuOpen = () => {},
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const queuedMessages = useSelector(selectQueuedCount);

  // Determine active tab from current route
  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/crm/leads')) return 'leads';
    if (path.startsWith('/crm/properties')) return 'properties';
    if (path.startsWith('/crm/viewings')) return 'viewings';
    if (path === '/crm' || path === '/crm/') return 'home';
    return 'home';
  }, [location.pathname]);

  const badgeCounts = useMemo<Record<string, number>>(() => ({
    leads: unreadLeadCount || (queuedMessages ?? 0),
  }), [unreadLeadCount, queuedMessages]);

  const handleTabClick = useCallback((tab: Tab) => {
    if (tab.id === 'more') {
      onMenuOpen();
    } else {
      navigate(tab.path);
    }
  }, [navigate, onMenuOpen]);

  return (
    <BottomNavContainer aria-label="CRM mobile navigation" role="navigation">
      {TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const badge = tab.badgeKey ? badgeCounts[tab.badgeKey] : 0;

        return (
          <BottomNavItem
            key={tab.id}
            $active={isActive}
            onClick={() => handleTabClick(tab)}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
            data-tab={tab.id}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <BottomNavLabel $active={isActive}>{tab.label}</BottomNavLabel>
            {badge > 0 && (
              <BottomNavBadge aria-label={`${badge} unread`}>
                {badge > 99 ? '99+' : badge}
              </BottomNavBadge>
            )}
          </BottomNavItem>
        );
      })}
    </BottomNavContainer>
  );
});

export default MobileBottomNav;
