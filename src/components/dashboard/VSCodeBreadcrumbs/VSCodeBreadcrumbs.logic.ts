// FILE: src/components/dashboard/VSCodeBreadcrumbs/VSCodeBreadcrumbs.logic.ts
/**
 * White Caves Real Estate LLC - VSCode Breadcrumbs State Logic
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { BreadcrumbSegment, VSCodeBreadcrumbsProps } from './VSCodeBreadcrumbs.types';
import {
  SUBSYSTEM_TAXONOMY,
  normalizeDashboardRoute,
} from '../../../pages/dashboard/ModernDashboardPage.logic';

interface SubsystemMetadata {
  label: string;
  icon: string;
  root: string;
  collections: Array<{ id: string; label: string; route: string }>;
}

const CANONICAL_SUBSYSTEM_MAP: Record<string, SubsystemMetadata> = {
  pms: {
    label: 'PMS: Property Portfolio',
    icon: '🏢',
    root: '/dashboard/pms/properties',
    collections: [
      { id: 'properties', label: 'Units Inventory', route: '/dashboard/pms/properties' },
      { id: 'clusters', label: 'Dubai Clusters', route: '/dashboard/pms/properties/clusters' },
    ],
  },
  dms: {
    label: 'DMS: Corporate Departments',
    icon: '🏛️',
    root: '/dashboard/dms/departments',
    collections: [
      { id: 'departments', label: '12 Corporate Slots', route: '/dashboard/dms/departments/slots' },
      { id: 'pillars', label: '7 Operational Pillars', route: '/dashboard/dms/departments/pillars' },
    ],
  },
  ems: {
    label: 'EMS: Staff & Specialists',
    icon: '👥',
    root: '/dashboard/ems/employees',
    collections: [
      { id: 'employees', label: '121 Staff Roster', route: '/dashboard/ems/employees/roster' },
      { id: 'supervisors', label: 'Supervisors Pool', route: '/dashboard/ems/employees/supervisors' },
      { id: 'directors', label: '12 Dept Directors', route: '/dashboard/ems/employees/directors' },
    ],
  },
  aiams: {
    label: 'AIAMS: AI Assistants Hub',
    icon: '🤖',
    root: '/dashboard/aiams/assistants',
    collections: [
      { id: 'assistants', label: '121+ AI Agents CRUD', route: '/dashboard/aiams/assistants' },
      { id: 'directors', label: '12 Dept AI Directors', route: '/dashboard/aiams/assistants/directors' },
      { id: 'supervisors', label: '108 AI Supervisors', route: '/dashboard/aiams/assistants/supervisors' },
    ],
  },
  tms: {
    label: 'TMS: Statutory Tasks',
    icon: '📋',
    root: '/dashboard/tms/tasks',
    collections: [
      { id: 'tasks', label: '200+ Statutory Tasks', route: '/dashboard/tms/tasks/catalog' },
      { id: 'categories', label: 'Pillars & Categories', route: '/dashboard/tms/tasks/categories' },
    ],
  },
  fms: {
    label: 'FMS: Deals & Escrow',
    icon: '💼',
    root: '/dashboard/fms/deals',
    collections: [
      { id: 'deals', label: 'Active Pipeline', route: '/dashboard/fms/deals/pipeline' },
      { id: 'escrow', label: 'Escrow Accounts', route: '/dashboard/fms/deals/escrow' },
    ],
  },
  cms: {
    label: 'CMS: Client & Lead Directory',
    icon: '🎯',
    root: '/dashboard/cms/customers',
    collections: [
      { id: 'customers', label: 'Client Leads', route: '/dashboard/cms/customers/leads' },
      { id: 'investors', label: 'VIP Investors', route: '/dashboard/cms/customers/investors' },
    ],
  },
  dvs: {
    label: 'DVS: Document Vault & OCR',
    icon: '🔒',
    root: '/dashboard/dvs/documents',
    collections: [
      { id: 'documents', label: 'Vault Documents', route: '/dashboard/dvs/documents/vault' },
      { id: 'compliance', label: 'RERA Compliance', route: '/dashboard/dvs/documents/compliance' },
    ],
  },
  lms: {
    label: 'LMS: Merit XP Leaderboard',
    icon: '🏆',
    root: '/dashboard/lms/leaderboard',
    collections: [
      { id: 'leaderboard', label: 'Merit Rankings', route: '/dashboard/lms/leaderboard/rankings' },
      { id: 'tiers', label: 'Tiers L0-L5', route: '/dashboard/lms/leaderboard/tiers' },
    ],
  },
  erms: {
    label: 'ERMS: Relational Mesh',
    icon: '🕸️',
    root: '/dashboard/erms/relationships',
    collections: [
      { id: 'relationships', label: 'Relational Matrix', route: '/dashboard/erms/relationships' },
      { id: 'entities', label: 'Entities CRUD Hub', route: '/dashboard/erms/entities' },
      { id: 'erd', label: 'UML ERD Visualizer', route: '/dashboard/erms/erd' },
    ],
  },
  rms: {
    label: 'RMS: Roles & Privileges',
    icon: '🛡️',
    root: '/dashboard/rms/roles',
    collections: [
      { id: 'roles', label: 'Role Catalog', route: '/dashboard/rms/roles' },
    ],
  },
};

// Aliases for legacy flat routes in breadcrumbs
const LEGACY_FALLBACK_ALIASES: Record<string, string> = {
  departments: 'dms',
  employees: 'ems',
  aiams: 'aiams',
  tasks: 'tms',
  REproperties: 'pms',
  properties: 'pms',
  deals: 'fms',
  customers: 'cms',
  documents: 'dvs',
  leaderboard: 'lms',
  relationships: 'erms',
  roles: 'rms',
};

export function useVSCodeBreadcrumbsLogic(props: VSCodeBreadcrumbsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = props.currentPath || location.pathname;

  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpenPopoverIndex(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const segments: BreadcrumbSegment[] = useMemo(() => {
    // 1. Root Tier: White Caves HQ
    const segs: BreadcrumbSegment[] = [
      {
        id: 'HQ',
        label: 'White Caves HQ',
        icon: '🏢',
        route: '/dashboard/dms/departments',
        level: 'ROOT',
        siblings: Object.entries(CANONICAL_SUBSYSTEM_MAP).map(([key, sys]) => ({
          id: key.toUpperCase(),
          label: sys.label,
          route: sys.root,
        })),
      },
    ];

    const cleanPath = activePath.replace(/^\/dashboard\/?/, '');
    const rawParts = cleanPath.split('/').filter(Boolean);
    if (rawParts.length === 0) return segs;

    // Resolve subsystem key
    let sysKey = rawParts[0];
    if (sysKey === 'explorer' && rawParts.length > 1) {
      sysKey = LEGACY_FALLBACK_ALIASES[rawParts[1]] || rawParts[1];
    } else if (LEGACY_FALLBACK_ALIASES[sysKey]) {
      sysKey = LEGACY_FALLBACK_ALIASES[sysKey];
    }

    const subsystem = CANONICAL_SUBSYSTEM_MAP[sysKey];
    if (!subsystem) {
      // Unmapped or standalone portal
      rawParts.forEach((p, idx) => {
        segs.push({
          id: p.toUpperCase(),
          label: p,
          route: `/dashboard/${rawParts.slice(0, idx + 1).join('/')}`,
          level: idx === 0 ? 'SYSTEM' : 'CATEGORY',
        });
      });
      return segs;
    }

    // 2. Subsystem Tier: e.g. PMS: Property Portfolio
    segs.push({
      id: sysKey.toUpperCase(),
      label: subsystem.label,
      icon: subsystem.icon,
      route: subsystem.root,
      level: 'SYSTEM',
      siblings: Object.entries(CANONICAL_SUBSYSTEM_MAP).map(([k, s]) => ({
        id: k.toUpperCase(),
        label: s.label,
        route: s.root,
      })),
    });

    // 3. Collection Tier: e.g. Units Inventory / Properties
    const collectionId = rawParts[1] || subsystem.collections[0]?.id;
    if (collectionId) {
      const match = subsystem.collections.find(c => c.id === collectionId);
      const collectionLabel = match ? match.label : collectionId.charAt(0).toUpperCase() + collectionId.slice(1);
      const collectionRoute = match ? match.route : `/dashboard/${sysKey}/${collectionId}`;

      segs.push({
        id: collectionId.toUpperCase(),
        label: collectionLabel,
        route: collectionRoute,
        level: 'CATEGORY',
        siblings: subsystem.collections.map(c => ({
          id: c.id.toUpperCase(),
          label: c.label,
          route: c.route,
        })),
      });

      // Multi-Tier Drilldown: Support arbitrary depth beyond Tier 4
      // e.g., /dashboard/pms/properties/PROP-108/units/UNIT-402/leases/LEAS-99
      for (let i = 2; i < rawParts.length; i++) {
        const segVal = rawParts[i];
        const isActionOrSubEntity = i % 2 === 1; // alternating sub-collection and record ID
        const subRoute = `/dashboard/${rawParts.slice(0, i + 1).join('/')}`;

        segs.push({
          id: segVal.toUpperCase(),
          label: isActionOrSubEntity
            ? segVal.charAt(0).toUpperCase() + segVal.slice(1)
            : `Record ${segVal}`,
          route: subRoute,
          level: (i === 2 ? 'ENTITY' : 'LEAF') as any,
        });
      }
    }

    return segs;
  }, [activePath]);

  const handleSegmentClick = (route: string) => {
    setOpenPopoverIndex(null);
    if (props.onNavigate) {
      props.onNavigate(route);
    } else {
      navigate(route);
    }
  };

  const togglePopover = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenPopoverIndex(prev => (prev === idx ? null : idx));
  };

  const handleHistoryBack = () => window.history.back();
  const handleHistoryForward = () => window.history.forward();

  return {
    segments,
    openPopoverIndex,
    popoverRef,
    handleSegmentClick,
    togglePopover,
    handleHistoryBack,
    handleHistoryForward,
  };
}
