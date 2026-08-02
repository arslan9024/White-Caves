/**
 * BottomNav.logic.ts — Logic layer for mobile bottom navigation (W23-009 / REQ-MOB-010)
 *
 * Provides active tab state, unread lead badge count, and navigation handlers.
 */

import { useState, useCallback } from 'react';

export interface NavTab {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

export function useBottomNavLogic(currentPath: string = '/') {
  const [unreadLeadsCount] = useState<number>(3); // Mocked / synced unread leads count

  const tabs: NavTab[] = [
    { id: 'home', label: 'Home', icon: '🏠', path: '/' },
    { id: 'leads', label: 'Leads', icon: '👥', path: '/crm/leads', badge: unreadLeadsCount },
    { id: 'properties', label: 'Properties', icon: '🏙️', path: '/properties' },
    { id: 'viewings', label: 'Viewings', icon: '📅', path: '/viewings' },
    { id: 'more', label: 'More', icon: '⚙️', path: '/more' },
  ];

  const isActive = useCallback(
    (tabPath: string) => {
      if (tabPath === '/' && currentPath === '/') return true;
      if (tabPath !== '/' && currentPath.startsWith(tabPath)) return true;
      return false;
    },
    [currentPath]
  );

  return {
    tabs,
    isActive,
  };
}
