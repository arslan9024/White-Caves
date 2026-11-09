// FILE: src/pages/dashboard/ModernDashboardPage.logic.ts
/**
 * White Caves Real Estate LLC - ModernDashboardPage Domain Logic & Canonical Routing
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

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
  'explorer',
];

export interface SubsystemConfig {
  subsystem: string;
  name: string;
  collection: string;
  activityTab: ActivityTab;
  legacyPrefixes: string[];
}

export const SUBSYSTEM_TAXONOMY: Record<string, SubsystemConfig> = {
  pms: {
    subsystem: 'pms',
    name: 'Property Management System',
    collection: 'properties',
    activityTab: 'REproperties',
    legacyPrefixes: ['REproperties', 'properties'],
  },
  dms: {
    subsystem: 'dms',
    name: 'Department Management System',
    collection: 'departments',
    activityTab: 'departments',
    legacyPrefixes: ['departments'],
  },
  ems: {
    subsystem: 'ems',
    name: 'Employee Management System',
    collection: 'employees',
    activityTab: 'employees',
    legacyPrefixes: ['employees'],
  },
  aiams: {
    subsystem: 'aiams',
    name: 'AI Assistants Management System',
    collection: 'assistants',
    activityTab: 'aiams',
    legacyPrefixes: ['aiams', 'ai-command'],
  },
  tms: {
    subsystem: 'tms',
    name: 'Task Management System',
    collection: 'tasks',
    activityTab: 'tasks',
    legacyPrefixes: ['tasks'],
  },
  fms: {
    subsystem: 'fms',
    name: 'Financial & Deals Management System',
    collection: 'deals',
    activityTab: 'deals',
    legacyPrefixes: ['deals'],
  },
  cms: {
    subsystem: 'cms',
    name: 'Client & Leads Management System',
    collection: 'customers',
    activityTab: 'customers',
    legacyPrefixes: ['customers'],
  },
  dvs: {
    subsystem: 'dvs',
    name: 'Document Vault System',
    collection: 'documents',
    activityTab: 'documents',
    legacyPrefixes: ['documents'],
  },
  lms: {
    subsystem: 'lms',
    name: 'Leaderboard & Merit System',
    collection: 'leaderboard',
    activityTab: 'leaderboard',
    legacyPrefixes: ['leaderboard'],
  },
  erms: {
    subsystem: 'erms',
    name: 'Enterprise Relational Mesh System',
    collection: 'relationships',
    activityTab: 'erms',
    legacyPrefixes: ['erms', 'relationships'],
  },
  rms: {
    subsystem: 'rms',
    name: 'Role & Privilege Management System',
    collection: 'roles',
    activityTab: 'roles',
    legacyPrefixes: ['roles'],
  },
};

export interface ParsedHierarchicalRoute {
  subsystem: string | null;
  collection: string | null;
  activeTab: ActivityTab;
  activeItemId: string | null;
  canonicalPath: string;
  isCanonical: boolean;
}

/**
 * Normalizes any dashboard pathname (canonical hierarchical, legacy flat, or explorer alias)
 * into a structured domain representation with automatic canonical redirect target.
 */
export function normalizeDashboardRoute(pathname: string): ParsedHierarchicalRoute {
  const cleanPath = pathname.replace(/^\/dashboard\/?/, '').split('?')[0];
  const parts = cleanPath.split('/').filter(Boolean);

  if (parts.length === 0) {
    return {
      subsystem: 'dms',
      collection: 'departments',
      activeTab: 'departments',
      activeItemId: null,
      canonicalPath: '/dashboard/dms/departments',
      isCanonical: false,
    };
  }

  // 1. Direct Canonical Check: /dashboard/<subsystem>/<collection>[/<id>]
  const first = parts[0];
  if (SUBSYSTEM_TAXONOMY[first]) {
    const sys = SUBSYSTEM_TAXONOMY[first];

    // Direct Subsystem Hub (e.g. /dashboard/dms without collection)
    if (parts.length === 1) {
      return {
        subsystem: first,
        collection: sys.collection,
        activeTab: sys.activityTab,
        activeItemId: null,
        canonicalPath: `/dashboard/${first}`,
        isCanonical: true,
      };
    }

    // Direct /dashboard/dms/:deptId or /dashboard/dms/departments/:deptId
    const isCollection = parts[1] === sys.collection || (parts[1] && parts[1].length > 15);
    const col = isCollection ? parts[1] : sys.collection;
    const itemId = isCollection ? parts[2] || null : parts[1] || null;

    return {
      subsystem: first,
      collection: col,
      activeTab: sys.activityTab,
      activeItemId: itemId,
      canonicalPath: itemId
        ? `/dashboard/${first}/${col}/${itemId}`
        : `/dashboard/${first}/${col}`,
      isCanonical: true,
    };
  }

  // 2. Explorer Alias: /dashboard/explorer/<entity>[/<id>]
  if (first === 'explorer' && parts.length > 1) {
    const explorerSub = parts[1];
    const explorerId = parts[2] || null;
    for (const sys of Object.values(SUBSYSTEM_TAXONOMY)) {
      if (
        sys.legacyPrefixes.includes(explorerSub) ||
        sys.collection === explorerSub ||
        sys.activityTab === explorerSub
      ) {
        return {
          subsystem: sys.subsystem,
          collection: sys.collection,
          activeTab: sys.activityTab,
          activeItemId: explorerId,
          canonicalPath: explorerId
            ? `/dashboard/${sys.subsystem}/${sys.collection}/${explorerId}`
            : `/dashboard/${sys.subsystem}/${sys.collection}`,
          isCanonical: false,
        };
      }
    }
  }

  // 3. Legacy Flat Routes: /dashboard/<legacyPrefix>[/<id>]
  for (const sys of Object.values(SUBSYSTEM_TAXONOMY)) {
    if (sys.legacyPrefixes.includes(first) || sys.activityTab === first) {
      const itemId = parts[1] || null;
      return {
        subsystem: sys.subsystem,
        collection: sys.collection,
        activeTab: sys.activityTab,
        activeItemId: itemId,
        canonicalPath: itemId
          ? `/dashboard/${sys.subsystem}/${sys.collection}/${itemId}`
          : `/dashboard/${sys.subsystem}/${sys.collection}`,
        isCanonical: false,
      };
    }
  }

  // 4. Fallback for standalone portals or unmapped activity tabs (landlord, tenant, broker, profile)
  const fallbackTab = (VALID_DASHBOARD_TABS.includes(first as ActivityTab)
    ? first
    : 'departments') as ActivityTab;

  return {
    subsystem: null,
    collection: null,
    activeTab: fallbackTab,
    activeItemId: parts[1] || null,
    canonicalPath: `/dashboard/${parts.join('/')}`,
    isCanonical: true,
  };
}

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
  if (key === 'departments-crud') return '/dashboard/dms/departments/slots';
  if (key.startsWith('route-')) return key.replace('route-', '');
  if (key.startsWith('entity-')) return `/dashboard/erms/relationships/${key.replace('entity-', '')}`;
  if (key.startsWith('rel-')) return `/dashboard/erms/relationships/${key.replace('rel-', '')}`;

  const prefixes: Record<string, string> = {
    'emp-': '/dashboard/ems/employees/',
    'ai-': '/dashboard/aiams/assistants/',
    'task-': '/dashboard/tms/tasks/',
    'lead-': '/dashboard/lms/leaderboard/',
    'prop-': '/dashboard/pms/properties/',
    'deal-': '/dashboard/fms/deals/',
    'doc-': '/dashboard/dvs/documents/',
    'cust-': '/dashboard/cms/customers/',
    'role-': '/dashboard/rms/roles/',
  };

  for (const [pfx, route] of Object.entries(prefixes)) {
    if (key.startsWith(pfx)) return `${route}${key.replace(pfx, '')}`;
  }

  // Map activeTab to canonical subsystem
  for (const sys of Object.values(SUBSYSTEM_TAXONOMY)) {
    if (sys.activityTab === activeTab || sys.legacyPrefixes.includes(activeTab)) {
      return `/dashboard/${sys.subsystem}/${sys.collection}`;
    }
  }

  return `/dashboard/${activeTab}`;
}
