// FILE: src/components/dashboard/VSCodeBreadcrumbs/VSCodeBreadcrumbs.logic.ts
/**
 * White Caves Real Estate LLC - VSCode Breadcrumbs State Logic
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { BreadcrumbSegment, VSCodeBreadcrumbsProps } from './VSCodeBreadcrumbs.types';

const SYSTEM_MAP: Record<
  string,
  { label: string; root: string; categories: Array<{ id: string; label: string; route: string }> }
> = {
  departments: {
    label: 'DMS: Corporate Departments',
    root: '/dashboard/departments',
    categories: [
      { id: 'slots', label: '12 Corporate Slots', route: '/dashboard/departments/slots' },
      { id: 'pillars', label: '7 Operational Pillars', route: '/dashboard/departments/pillars' },
    ],
  },
  employees: {
    label: 'EMS: Staff & Specialists',
    root: '/dashboard/employees',
    categories: [
      { id: 'roster', label: '121 Staff Roster', route: '/dashboard/employees/roster' },
      { id: 'supervisors', label: 'Supervisors Pool', route: '/dashboard/employees/supervisors' },
      {
        id: 'directors',
        label: '12 Department Directors',
        route: '/dashboard/employees/directors',
      },
    ],
  },
  aiams: {
    label: 'AIAMS: AI Assistants Management',
    root: '/dashboard/aiams',
    categories: [
      { id: 'agents', label: '121+ AI Agents CRUD', route: '/dashboard/aiams/agents' },
      { id: 'managers', label: '12 Dept AI Directors', route: '/dashboard/aiams/managers' },
      { id: 'supervisors', label: '108 AI Supervisors', route: '/dashboard/aiams/supervisors' },
      { id: 'organogram', label: '1-12-108 Organogram', route: '/dashboard/aiams/organogram' },
    ],
  },
  tasks: {
    label: 'TMS: Tasks & Statutory Catalog',
    root: '/dashboard/tasks',
    categories: [
      { id: 'catalog', label: '200+ Statutory Tasks', route: '/dashboard/tasks/catalog' },
      { id: 'categories', label: 'Pillars & Categories', route: '/dashboard/tasks/categories' },
    ],
  },
  REproperties: {
    label: 'PMS: Property Portfolio',
    root: '/dashboard/REproperties',
    categories: [
      { id: 'inventory', label: 'Units Inventory', route: '/dashboard/REproperties/inventory' },
      { id: 'clusters', label: 'Dubai Clusters', route: '/dashboard/REproperties/clusters' },
    ],
  },
  deals: {
    label: 'Deals & Escrow Pipeline',
    root: '/dashboard/deals',
    categories: [
      { id: 'pipeline', label: 'Active Pipeline', route: '/dashboard/deals/pipeline' },
      { id: 'escrow', label: 'Escrow Accounts', route: '/dashboard/deals/escrow' },
    ],
  },
  customers: {
    label: 'CMS: Client & Lead Directory',
    root: '/dashboard/customers',
    categories: [
      { id: 'leads', label: 'Client Leads', route: '/dashboard/customers/leads' },
      { id: 'investors', label: 'VIP Investors', route: '/dashboard/customers/investors' },
    ],
  },
  documents: {
    label: 'DVS: Document Vault & OCR',
    root: '/dashboard/documents',
    categories: [
      { id: 'vault', label: 'Vault Documents', route: '/dashboard/documents/vault' },
      { id: 'compliance', label: 'RERA Compliance', route: '/dashboard/documents/compliance' },
    ],
  },
  leaderboard: {
    label: 'LMS: Merit XP Leaderboard',
    root: '/dashboard/leaderboard',
    categories: [
      { id: 'rankings', label: 'Merit Rankings', route: '/dashboard/leaderboard/rankings' },
      { id: 'tiers', label: 'Tiers L0-L5', route: '/dashboard/leaderboard/tiers' },
    ],
  },
  erms: {
    label: 'ERMS: Entities & Relational Hub',
    root: '/dashboard/erms',
    categories: [
      { id: 'entities', label: 'Entities CRUD Hub', route: '/dashboard/erms/entities' },
      { id: 'relationships', label: 'Relational Matrix', route: '/dashboard/erms/relationships' },
      { id: 'erd', label: 'UML ERD Visualizer', route: '/dashboard/erms/erd' },
    ],
  },
};

export function useVSCodeBreadcrumbsLogic(props: VSCodeBreadcrumbsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = props.currentPath || location.pathname;

  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
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
    const segs: BreadcrumbSegment[] = [
      {
        id: 'HQ',
        label: 'White Caves HQ',
        icon: '🏢',
        route: '/dashboard/departments',
        level: 'ROOT',
        siblings: Object.entries(SYSTEM_MAP).map(([key, sys]) => ({
          id: key.toUpperCase(),
          label: sys.label,
          route: sys.root,
        })),
      },
    ];

    const cleanPath = activePath.replace(/^\/dashboard\/?/, '');
    const parts = cleanPath.split('/').filter(Boolean);

    if (parts.length === 0) return segs;

    const sysKey = parts[0];
    const system = SYSTEM_MAP[sysKey];

    if (system) {
      segs.push({
        id: sysKey.toUpperCase(),
        label: system.label,
        route: system.root,
        level: 'SYSTEM',
        siblings: Object.entries(SYSTEM_MAP).map(([k, s]) => ({
          id: k.toUpperCase(),
          label: s.label,
          route: s.root,
        })),
      });

      if (parts[1]) {
        const catKey = parts[1];
        const categoryMatch = system.categories.find(c => c.id === catKey);

        segs.push({
          id: catKey.toUpperCase(),
          label: categoryMatch ? categoryMatch.label : catKey,
          route: categoryMatch ? categoryMatch.route : `/dashboard/${sysKey}/${catKey}`,
          level: 'CATEGORY',
          siblings: system.categories.map(c => ({
            id: c.id.toUpperCase(),
            label: c.label,
            route: c.route,
          })),
        });

        if (parts[2]) {
          const itemKey = parts[2];
          segs.push({
            id: itemKey.toUpperCase(),
            label: `Item ${itemKey}`,
            route: `/dashboard/${sysKey}/${catKey}/${itemKey}`,
            level: 'ENTITY',
          });
        }
      }
    } else {
      parts.forEach((p, idx) => {
        segs.push({
          id: p.toUpperCase(),
          label: p,
          route: `/dashboard/${parts.slice(0, idx + 1).join('/')}`,
          level: idx === 0 ? 'SYSTEM' : 'CATEGORY',
        });
      });
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
