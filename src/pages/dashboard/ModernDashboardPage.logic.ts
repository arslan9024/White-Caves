// FILE: src/pages/dashboard/ModernDashboardPage.logic.ts
import { useState, useCallback } from 'react';
import type { ActivityTab } from '../../components/dashboard/ExecutiveVSCodeSidebar/ExecutiveVSCodeSidebar.logic';

export const VALID_DASHBOARD_TABS: ActivityTab[] = [
  'departments',
  'employees',
  'aiams',
  'tasks',
  'leaderboard',
  'REproperties',
  'deals',
  'documents',
  'relationships',
  'erms',
  'customers',
  'roles',
  'profile',
  'landlord',
  'tenant',
  'broker',
  'linda',
  'ai-command',
  'audit',
  'governance',
  'commissions',
  'performance',
  'viewings',
  'analytics',
  'module',
  'dept-view',
];

export function useSidebarToggles() {
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(true);
  const [isRightCollapsed, setIsRightCollapsed] = useState(true);

  const toggleLeftSidebar = useCallback((forceBoth = false) => {
    setIsLeftCollapsed(prev => {
      if (prev && !forceBoth) setIsRightCollapsed(true);
      return !prev;
    });
  }, []);

  const toggleRightSidebar = useCallback((forceBoth = false) => {
    setIsRightCollapsed(prev => {
      if (prev && !forceBoth) setIsLeftCollapsed(true);
      return !prev;
    });
  }, []);

  return { isLeftCollapsed, isRightCollapsed, toggleLeftSidebar, toggleRightSidebar };
}

export function resolveSidebarItemRoute(key: string, activeTab: string): string {
  if (key === 'departments-crud') return '/dashboard/departments/slots';
  if (key.startsWith('route-')) return key.replace('route-', '');
  if (key.startsWith('entity-')) return `/dashboard/erms/entities/${key.replace('entity-', '')}`;
  if (key.startsWith('rel-')) return `/dashboard/erms/relationships/${key.replace('rel-', '')}`;
  const prefixes: Record<string, string> = {
    'emp-': '/dashboard/employees/',
    'ai-': '/dashboard/aiams/',
    'task-': '/dashboard/tasks/',
    'lead-': '/dashboard/leaderboard/',
    'prop-': '/dashboard/REproperties/',
    'deal-': '/dashboard/deals/',
    'doc-': '/dashboard/documents/',
    'cust-': '/dashboard/customers/',
    'role-': '/dashboard/roles/',
  };
  for (const [pfx, route] of Object.entries(prefixes)) {
    if (key.startsWith(pfx)) return `${route}${key.replace(pfx, '')}`;
  }
  return `/dashboard/${activeTab}`;
}
