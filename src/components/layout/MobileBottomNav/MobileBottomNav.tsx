/**
 * MobileBottomNav — 5-tab bottom navigation for mobile/tablet (≤ 768px)
 *
 * Replaces the desktop SidebarContainer when the viewport is ≤ 768px.
 * Tabs: Dashboard, Analytics, Messages, AI Center, Menu (opens drawer)
 *
 * Features:
 * - 56px fixed bar + safe-area-inset-bottom for iPhone notch
 * - Gold active indicator dot + icon color
 * - Unread badge on Messages tab (from nadiaSlice)
 * - Menu tab opens the MobileMenuDrawer (via onMenuOpen callback)
 * - 44×44px minimum touch targets per WCAG 2.1 AA
 * - Keyboard accessible (tab + enter/space)
 * - prefers-reduced-motion respected
 */

import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Home,
  BarChart3,
  MessageSquare,
  Bot,
  Menu,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { selectQueuedCount } from '../../../store/slices/nadiaSlice';
import {
  BottomNavContainer,
  BottomNavItem,
  BottomNavLabel,
  BottomNavBadge,
} from './styles';

// ─── Tab definitions ──────────────────────────────────────────────────────

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  badgeSelector?: string; // Redux selector key
}

const TABS: Tab[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'messages', label: 'Messages', icon: MessageSquare, badgeSelector: 'messages' },
  { id: 'ai', label: 'AI', icon: Bot },
  { id: 'menu', label: 'Menu', icon: Menu },
];

// ─── Props ────────────────────────────────────────────────────────────────

interface MobileBottomNavProps {
  /** Currently active tab id */
  activeTab?: string;
  /** Called when user taps a tab (except 'menu') */
  onTabChange?: (tabId: string) => void;
  /** Called when user taps the Menu tab — parent opens the MobileMenuDrawer */
  onMenuOpen?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────

const MobileBottomNav: React.FC<MobileBottomNavProps> = React.memo(function MobileBottomNav({
  activeTab = 'home',
  onTabChange = () => {},
  onMenuOpen = () => {},
}) {
  const queuedMessages = useSelector(selectQueuedCount);

  const badgeCounts = useMemo<Record<string, number>>(() => ({
    messages: queuedMessages ?? 0,
  }), [queuedMessages]);

  const handleTabClick = useCallback((tabId: string) => {
    if (tabId === 'menu') {
      onMenuOpen();
    } else {
      onTabChange(tabId);
    }
  }, [onTabChange, onMenuOpen]);

  return (
    <BottomNavContainer aria-label="Mobile navigation">
      {TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const badge = tab.badgeSelector ? badgeCounts[tab.badgeSelector] : 0;

        return (
          <BottomNavItem
            key={tab.id}
            $active={isActive}
            onClick={() => handleTabClick(tab.id)}
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
