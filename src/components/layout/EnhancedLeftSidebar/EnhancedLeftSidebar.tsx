/**
 * EnhancedLeftSidebar — Unified Sidebar (280px expanded / 64px collapsed)
 *
 * Features:
 *  - Collapse toggle: 280px ↔ 64px icon-rail mode
 *  - Quick nav items (Home, Analytics)
 *  - Company departments tree (expandable, with badges)
 *  - AI Command Center (inline, searchable)
 *  - Admin & Settings footer
 *  - Keyboard navigation (arrow keys, enter, escape)
 *  - localStorage persistence for expand/collapse state
 *  - WCAG 2.1 AA accessibility
 *  - Responsive: visible on tablet (768px+) and desktop, hidden on mobile
 */

import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store/store';
import {
  Home,
  BarChart3,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  selectSelectedDepartment,
  selectSelectedService,
  selectSelectedAssistant,
  selectDepartment,
  selectService,
  selectAssistant,
} from '../../../store/slices/sidebarSlice';
import {
  getAllAssistants,
  DEPARTMENTS as REGISTRY_DEPARTMENTS,
} from '../../../config/assistantRegistry';
import type { Assistant, DepartmentId } from '../../../config/assistantRegistry';
import { selectHotLeads, selectAllProperties } from '../../../store/crmDataSlice';
import { selectQueuedCount } from '../../../store/slices/nadiaSlice';
import { createLogger } from '../../../utils/logger';
import { SIDEBAR_DEPARTMENTS as DEPARTMENTS } from '../../../config/departmentConfig';
import {
  useKeyboardNavigation,
  type NavigableItem,
} from '../../../hooks/navigation/useKeyboardNavigation';
import SidebarTree, { type DepartmentTreeNode, type ServiceTreeNode } from './SidebarTree';
import SidebarNavItem from './SidebarNavItem';
import {
  SidebarContainer,
  SidebarHeader,
  SidebarLogo,
  SidebarTitle,
  CollapseToggle,
  SidebarSection,
  SidebarDivider,
  SidebarSectionTitle,
  SidebarNav,
  AISearchContainer,
  AISearchInput,
  AIAssistantItem,
  AIAssistantAvatar,
  AIAssistantInfo,
  AIAssistantName,
  AIAssistantTitle,
  SidebarSpacer,
  SidebarFooter,
  CollapsedNavItem,
  CollapsedBadge,
  DeptGroupHeader,
} from './styles';

const log = createLogger('EnhancedLeftSidebar');
const EXPAND_STORAGE_KEY = 'wc-enhanced-sidebar-expanded';
const COLLAPSE_STORAGE_KEY = 'wc-sidebar-collapsed';

function readExpandedDepts(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(EXPAND_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    log.warn('Failed to read enhanced sidebar expand state', error);
    return {};
  }
}

function writeExpandedDepts(state: Record<string, boolean>) {
  try {
    localStorage.setItem(EXPAND_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    log.warn('Failed to persist enhanced sidebar expand state', error);
  }
}

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

// ─── Quick Navigation Items ────────────────────────────────────────────

interface QuickNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}

const QUICK_NAV: QuickNavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
  },
];

// ─── Department Registry ───────────────────────────────────────────────
// Imported from src/config/departmentConfig.ts (single source of truth)

interface EnhancedLeftSidebarProps {
  onItemClick?: (itemId: string, itemData?: unknown) => void;
  isSuperUser?: boolean;
}

const EnhancedLeftSidebar: React.FC<EnhancedLeftSidebarProps> = ({
  onItemClick,
  isSuperUser = false,
}) => {
  const dispatch = useDispatch();

  // Redux selectors
  const selectedDept = useSelector((state: RootState) => selectSelectedDepartment(state));
  const selectedSvc = useSelector((state: RootState) => selectSelectedService(state));
  const selectedAssistantId = useSelector((state: RootState) => selectSelectedAssistant(state));
  const hotLeads = useSelector((state: RootState) => selectHotLeads(state));
  const properties = useSelector((state: RootState) => selectAllProperties(state));
  const queuedMessages = useSelector((state: RootState) => selectQueuedCount(state));

  // Local state
  const [aiSearch, setAiSearch] = useState('');
  const sidebarRef = useRef<HTMLElement>(null);
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>(() =>
    readExpandedDepts()
  );
  const [collapsed, setCollapsed] = useState<boolean>(() => readCollapsed());
  const [companyExpanded, setCompanyExpanded] = useState(true);
  const [aiExpanded, setAiExpanded] = useState(true);

  // Badge counts
  const badgeCounts = useMemo(
    () => ({
      hotLeads: hotLeads.length,
      properties: properties.length,
      messages: queuedMessages,
    }),
    [hotLeads, properties, queuedMessages]
  );

  // Build department tree
  const deptTree: DepartmentTreeNode[] = useMemo(() => {
    return Object.entries(DEPARTMENTS).map(([deptId, dept]) => {
      const badge = dept.badgeKey ? badgeCounts[dept.badgeKey] : undefined;
      const services: ServiceTreeNode[] = dept.services.map(svc => ({
        id: svc.toLowerCase().replace(/\s+/g, '-'),
        label: svc,
      }));

      return {
        id: deptId,
        label: dept.label,
        icon: dept.icon,
        color: dept.color,
        services,
        badge,
        badgeColor:
          dept.badgeKey === 'hotLeads'
            ? '#EF4444'
            : dept.badgeKey === 'properties'
              ? '#3B82F6'
              : '#F59E0B',
      };
    });
  }, [badgeCounts]);

  // AI assistants (searchable)
  const allAssistants = getAllAssistants();
  const filteredAssistants = useMemo(() => {
    if (!aiSearch.trim()) return allAssistants;
    const q = aiSearch.toLowerCase();
    return allAssistants.filter(
      a =>
        a.name.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q)
    );
  }, [allAssistants, aiSearch]);

  const groupedAssistants = useMemo(() => {
    const groups: Record<string, Assistant[]> = {};
    filteredAssistants.forEach(a => {
      if (!groups[a.department]) groups[a.department] = [];
      groups[a.department].push(a);
    });
    return groups;
  }, [filteredAssistants]);

  const toggleDeptExpand = useCallback((deptId: string, shouldExpand?: boolean) => {
    setExpandedDepts(prev => {
      // eslint-disable-next-line security/detect-object-injection
      const nextValue = shouldExpand ?? !prev[deptId];
      const next = { ...prev, [deptId]: nextValue };
      writeExpandedDepts(next);
      return next;
    });
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  // Handlers
  const handleDeptClick = useCallback(
    (deptId: string) => {
      dispatch(selectDepartment(deptId));
      onItemClick?.('department', { deptId });
    },
    [dispatch, onItemClick]
  );

  const handleServiceClick = useCallback(
    (deptId: string, serviceId: string) => {
      dispatch(selectService({ department: deptId, service: serviceId }));
      onItemClick?.('service', { deptId, serviceId });
    },
    [dispatch, onItemClick]
  );

  const handleAssistantClick = useCallback(
    (assistantId: string) => {
      dispatch(selectAssistant(assistantId));
      onItemClick?.('assistant', { assistantId });
    },
    [dispatch, onItemClick]
  );

  const handleQuickNavClick = useCallback(
    (itemId: string) => {
      onItemClick?.('quick-nav', { itemId });
    },
    [onItemClick]
  );

  const navigableItems = useMemo<NavigableItem[]>(() => {
    const items: NavigableItem[] = QUICK_NAV.map(item => ({
      id: `quick-${item.id}`,
      label: item.label,
      depth: 0,
    }));

    deptTree.forEach(dept => {
      const expanded = expandedDepts[dept.id] !== false;
      items.push({
        id: `dept-${dept.id}`,
        label: dept.label,
        depth: 0,
        isExpandable: true,
        isExpanded: expanded,
      });

      if (expanded) {
        dept.services.forEach(service => {
          items.push({
            id: `service-${dept.id}-${service.id}`,
            label: service.label,
            depth: 1,
            parent: dept.id,
          });
        });
      }
    });

    filteredAssistants.forEach(assistant => {
      items.push({
        id: `assistant-${assistant.id}`,
        label: assistant.name,
        depth: 0,
      });
    });

    if (isSuperUser) {
      items.push({ id: 'footer-admin', label: 'Admin', depth: 0 });
    }

    items.push({ id: 'footer-settings', label: 'Settings', depth: 0 });
    return items;
  }, [deptTree, expandedDepts, filteredAssistants, isSuperUser]);

  const handleNavigableSelect = useCallback(
    (item: NavigableItem) => {
      if (item.id.startsWith('quick-')) {
        handleQuickNavClick(item.id.replace('quick-', ''));
        return;
      }

      if (item.id.startsWith('dept-')) {
        handleDeptClick(item.id.replace('dept-', ''));
        return;
      }

      if (item.id.startsWith('service-')) {
        const [, deptId, ...serviceParts] = item.id.split('-');
        handleServiceClick(deptId, serviceParts.join('-'));
        return;
      }

      if (item.id.startsWith('assistant-')) {
        handleAssistantClick(item.id.replace('assistant-', ''));
        return;
      }

      if (item.id === 'footer-admin') {
        handleQuickNavClick('admin');
        return;
      }

      if (item.id === 'footer-settings') {
        handleQuickNavClick('settings');
      }
    },
    [handleAssistantClick, handleDeptClick, handleQuickNavClick, handleServiceClick]
  );

  const handleNavigableExpand = useCallback(
    (item: NavigableItem, shouldExpand: boolean) => {
      if (item.id.startsWith('dept-')) {
        toggleDeptExpand(item.id.replace('dept-', ''), shouldExpand);
      }
    },
    [toggleDeptExpand]
  );

  const {
    handleKeyDown: handleNavigationKeyDown,
    getFocusProps,
    setFocus,
  } = useKeyboardNavigation({
    items: navigableItems,
    onSelect: handleNavigableSelect,
    onExpand: handleNavigableExpand,
    onEscape: () => {
      const focusedEl = document.activeElement as HTMLElement | null;
      focusedEl?.blur();
    },
  });

  const getItemFocusProps = useCallback(
    (itemId: string) => {
      const index = navigableItems.findIndex(item => item.id === itemId);
      return index >= 0 ? getFocusProps(index) : undefined;
    },
    [getFocusProps, navigableItems]
  );

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'j') {
        event.preventDefault();
        setFocus(0);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [setFocus]);

  // ─── Collapsed (icon rail) render ──────────────────────────────────
  if (collapsed) {
    return (
      <SidebarContainer
        ref={sidebarRef}
        $collapsed
        role="navigation"
        aria-label="Main navigation (collapsed)"
        data-testid="enhanced-left-sidebar"
      >
        {/* Header: just logo + expand button */}
        <SidebarHeader>
          <SidebarLogo src="/white-caves-logo.png" alt="White Caves" title="White Caves CRM" />
          <CollapseToggle
            onClick={toggleCollapsed}
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <ChevronRight />
          </CollapseToggle>
        </SidebarHeader>

        {/* Quick nav icons */}
        {QUICK_NAV.map(item => {
          const Icon = item.icon;
          return (
            <CollapsedNavItem
              key={item.id}
              onClick={() => handleQuickNavClick(item.id)}
              title={item.label}
              aria-label={item.label}
            >
              <Icon />
            </CollapsedNavItem>
          );
        })}

        <SidebarDivider />

        {/* Department icons */}
        {Object.entries(DEPARTMENTS).map(([deptId, dept]) => {
          const Icon = dept.icon;
          const badge = dept.badgeKey ? badgeCounts[dept.badgeKey] : 0;
          return (
            <CollapsedNavItem
              key={deptId}
              $active={selectedDept === deptId}
              $color={dept.color}
              onClick={() => handleDeptClick(deptId)}
              title={dept.label}
              aria-label={dept.label}
            >
              <Icon />
              {badge > 0 && (
                <CollapsedBadge $color={dept.color}>{badge > 99 ? '99+' : badge}</CollapsedBadge>
              )}
            </CollapsedNavItem>
          );
        })}

        <SidebarSpacer />
        <SidebarDivider />

        {isSuperUser && (
          <CollapsedNavItem
            onClick={() => handleQuickNavClick('admin')}
            title="Admin"
            aria-label="Admin"
          >
            <Shield />
          </CollapsedNavItem>
        )}
        <CollapsedNavItem
          onClick={() => handleQuickNavClick('settings')}
          title="Settings"
          aria-label="Settings"
        >
          <Settings />
        </CollapsedNavItem>
      </SidebarContainer>
    );
  }

  // ─── Expanded (full 280px) render ─────────────────────────────────
  return (
    <SidebarContainer
      ref={sidebarRef}
      onKeyDown={handleNavigationKeyDown}
      role="navigation"
      aria-label="Main navigation"
      data-testid="enhanced-left-sidebar"
    >
      {/* ─── Header ────────────────────────────────────────────── */}
      <SidebarHeader>
        <SidebarLogo
          src="/white-caves-logo.png"
          alt="White Caves"
          title="White Caves CRM Platform"
        />
        <SidebarTitle>White Caves</SidebarTitle>
        <CollapseToggle
          onClick={toggleCollapsed}
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft />
        </CollapseToggle>
      </SidebarHeader>

      {/* ─── Quick Navigation ──────────────────────────────────── */}
      <SidebarSection>
        <SidebarNav aria-label="Quick navigation">
          {QUICK_NAV.map(item => {
            const Icon = item.icon;
            return (
              <SidebarNavItem
                key={item.id}
                id={`quick-${item.id}`}
                icon={Icon}
                label={item.label}
                onClick={() => handleQuickNavClick(item.id)}
                onKeyDown={handleNavigationKeyDown}
                focusProps={getItemFocusProps(`quick-${item.id}`)}
                ariaCurrent={false}
                title={item.label}
              />
            );
          })}
        </SidebarNav>
      </SidebarSection>

      <SidebarDivider />

      {/* ─── Company Departments ───────────────────────────────── */}
      <SidebarSection>
        <DeptGroupHeader
          onClick={() => setCompanyExpanded(v => !v)}
          aria-label="Toggle company departments"
        >
          <span>Company</span>
          <ChevronDown
            style={{
              transform: companyExpanded ? 'rotate(0)' : 'rotate(-90deg)',
              transition: 'transform 0.2s',
            }}
          />
        </DeptGroupHeader>
        {companyExpanded && (
          <SidebarTree
            departments={deptTree}
            selectedDept={selectedDept ?? undefined}
            selectedService={selectedSvc ?? undefined}
            onDeptClick={handleDeptClick}
            onServiceClick={handleServiceClick}
            expandedDepts={expandedDepts}
            onToggleDept={toggleDeptExpand}
            onItemKeyDown={handleNavigationKeyDown}
            getFocusProps={getItemFocusProps}
          />
        )}
      </SidebarSection>

      <SidebarDivider />

      {/* ─── AI Command Center ────────────────────────────────── */}
      <SidebarSection>
        <DeptGroupHeader
          onClick={() => setAiExpanded(v => !v)}
          aria-label="Toggle AI Command Center"
        >
          <span>AI Command Center</span>
          <ChevronDown
            style={{
              transform: aiExpanded ? 'rotate(0)' : 'rotate(-90deg)',
              transition: 'transform 0.2s',
            }}
          />
        </DeptGroupHeader>

        {aiExpanded && (
          <>
            <AISearchContainer>
              <AISearchInput
                type="text"
                placeholder="Search assistants..."
                value={aiSearch}
                onChange={e => setAiSearch(e.target.value)}
                aria-label="Search AI assistants"
              />
            </AISearchContainer>

            <SidebarNav aria-label="AI assistants">
              {Object.entries(groupedAssistants).map(([deptId, assistants]) => {
                const deptInfo = REGISTRY_DEPARTMENTS[deptId as DepartmentId];
                return (
                  <div key={deptId}>
                    {/* Group header */}
                    {filteredAssistants.length > 1 && (
                      <SidebarSectionTitle style={{ padding: '4px 14px', fontSize: '10px' }}>
                        {deptInfo?.label || deptId} ({assistants.length})
                      </SidebarSectionTitle>
                    )}

                    {/* Assistants in group */}
                    {assistants.map(assistant => (
                      <AIAssistantItem
                        key={assistant.id}
                        $selected={selectedAssistantId === assistant.id}
                        onClick={() => handleAssistantClick(assistant.id)}
                        onKeyDown={handleNavigationKeyDown}
                        {...(getItemFocusProps(`assistant-${assistant.id}`) ?? {})}
                        aria-label={`${assistant.name} assistant`}
                        aria-selected={selectedAssistantId === assistant.id}
                        title={assistant.title}
                      >
                        <AIAssistantAvatar $color={assistant.color}>
                          {assistant.avatar || assistant.name[0]}
                        </AIAssistantAvatar>
                        <AIAssistantInfo>
                          <AIAssistantName>{assistant.name}</AIAssistantName>
                          <AIAssistantTitle>{assistant.title}</AIAssistantTitle>
                        </AIAssistantInfo>
                      </AIAssistantItem>
                    ))}
                  </div>
                );
              })}
            </SidebarNav>
          </>
        )}
      </SidebarSection>

      <SidebarSpacer />

      {/* ─── Footer (Admin & Settings) ────────────────────────── */}
      <SidebarDivider />

      <SidebarFooter>
        {isSuperUser && (
          <SidebarNavItem
            id="admin-btn"
            icon={Shield}
            label="Admin"
            onClick={() => handleQuickNavClick('admin')}
            onKeyDown={handleNavigationKeyDown}
            focusProps={getItemFocusProps('footer-admin')}
            ariaCurrent={false}
            title="Admin Dashboard"
          />
        )}

        <SidebarNavItem
          id="settings-btn"
          icon={Settings}
          label="Settings"
          onClick={() => handleQuickNavClick('settings')}
          onKeyDown={handleNavigationKeyDown}
          focusProps={getItemFocusProps('footer-settings')}
          ariaCurrent={false}
          title="Settings"
        />
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default EnhancedLeftSidebar;
