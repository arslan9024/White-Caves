/**
 * UnifiedSidebar — Single Canonical Sidebar for White Caves CRM
 *
 * Merges SidebarContainer + EnhancedLeftSidebar into one component.
 *
 * Features:
 *  - 280px expanded / 64px collapsed (icon-rail) — toggle persisted in Redux + localStorage
 *  - Global search bar: searches departments, services, AND AI assistants simultaneously
 *  - Company departments tree (expandable, with badge counts)
 *  - AI Command Center (inline, grouped by department)
 *  - Admin & Settings footer
 *  - Full keyboard navigation (arrow keys, Enter, Escape, Cmd+J to focus)
 *  - WCAG 2.1 AA accessibility (ARIA landmarks, labels, focus management)
 *  - Responsive: visible on tablet (768px+) and desktop, hidden on mobile
 *  - localStorage persistence for expanded-depts and collapse state
 */

import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../../store/store';
import {
  Home,
  BarChart3,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  X,
  SearchX,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  selectSelectedDepartment,
  selectSelectedService,
  selectSelectedAssistant,
  selectGlobalSearch,
  selectSidebarCollapsed,
  selectDepartment,
  selectService,
  selectAssistant,
  setGlobalSearch,
  clearGlobalSearch,
  setSidebarCollapsed,
} from '../../../store/slices/sidebarSlice';
import {
  getAllAssistants,
  DEPARTMENTS as REGISTRY_DEPARTMENTS,
} from '../../../config/assistantRegistry';
import type { Assistant, DepartmentId } from '../../../config/assistantRegistry';
import { SIDEBAR_DEPARTMENTS as DEPARTMENTS } from '../../../config/departmentConfig';
import { selectHotLeads, selectAllProperties } from '../../../store/crmDataSlice';
import { selectQueuedCount } from '../../../store/slices/nadiaSlice';
import { createLogger } from '../../../utils/logger';
import {
  useKeyboardNavigation,
  type NavigableItem,
} from '../../../hooks/navigation/useKeyboardNavigation';
import SidebarTree, {
  type DepartmentTreeNode,
  type ServiceTreeNode,
} from '../EnhancedLeftSidebar/SidebarTree';
import SidebarNavItem from '../EnhancedLeftSidebar/SidebarNavItem';
import {
  SidebarWrapper,
  SidebarHeader,
  SidebarLogo,
  SidebarTitle,
  CollapseToggle,
  GlobalSearchBar,
  GlobalSearchInputWrapper,
  GlobalSearchIcon,
  GlobalSearchInput,
  GlobalSearchClear,
  SearchResultsContainer,
  SearchResultsSection,
  SearchResultsSectionTitle,
  SearchResultItem,
  SearchResultIcon,
  SearchResultText,
  SearchResultLabel,
  SearchResultSubLabel,
  SearchResultBadge,
  SearchEmptyState,
  SidebarSection,
  SidebarDivider,
  SidebarSectionTitle,
  DeptGroupHeader,
  SidebarNav,
  AISearchContainer,
  AISearchInput,
  AIAssistantItem,
  AIAssistantAvatar,
  AIAssistantInfo,
  AIAssistantName,
  AIAssistantTitle,
  CollapsedNavItem,
  CollapsedBadge,
  SidebarSpacer,
  SidebarFooter,
} from './styles';

const log = createLogger('UnifiedSidebar');

// ─── localStorage keys ────────────────────────────────────────────────────
const EXPAND_STORAGE_KEY = 'wc-sidebar-expanded-depts';
const COLLAPSE_STORAGE_KEY = 'wc-sidebar-collapsed';

function readExpandedDepts(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(EXPAND_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    log.warn('Failed to read sidebar expand state', error);
    return {};
  }
}

function writeExpandedDepts(state: Record<string, boolean>) {
  try {
    localStorage.setItem(EXPAND_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    log.warn('Failed to persist sidebar expand state', error);
  }
}

// ─── Quick Navigation ─────────────────────────────────────────────────────

interface QuickNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const QUICK_NAV: QuickNavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

// ─── Search Result Types ──────────────────────────────────────────────────

interface DeptSearchResult {
  type: 'department';
  deptId: string;
  label: string;
  color: string;
  icon: LucideIcon;
  badge?: number;
}

interface ServiceSearchResult {
  type: 'service';
  deptId: string;
  deptLabel: string;
  deptColor: string;
  deptIcon: LucideIcon;
  serviceId: string;
  label: string;
}

interface AssistantSearchResult {
  type: 'assistant';
  assistant: Assistant;
}

type SearchResult = DeptSearchResult | ServiceSearchResult | AssistantSearchResult;

// ─── Props ───────────────────────────────────────────────────────────────

export interface UnifiedSidebarProps {
  onItemClick?: (itemId: string, itemData?: unknown) => void;
  isSuperUser?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────

const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({ onItemClick, isSuperUser = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ─── Redux state ───────────────────────────────────────────────────
  const selectedDept = useSelector((state: RootState) => selectSelectedDepartment(state));
  const selectedSvc = useSelector((state: RootState) => selectSelectedService(state));
  const selectedAssistantId = useSelector((state: RootState) => selectSelectedAssistant(state));
  const globalSearch = useSelector((state: RootState) => selectGlobalSearch(state));
  const collapsed = useSelector((state: RootState) => selectSidebarCollapsed(state));
  const hotLeads = useSelector((state: RootState) => selectHotLeads(state));
  const properties = useSelector((state: RootState) => selectAllProperties(state));
  const queuedMessages = useSelector((state: RootState) => selectQueuedCount(state));

  // ─── Local state ───────────────────────────────────────────────────
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>(() =>
    readExpandedDepts()
  );
  const [companyExpanded, setCompanyExpanded] = useState(true);
  const [aiExpanded, setAiExpanded] = useState(true);
  // AI-section–only search (used when globalSearch is empty)
  const [aiOnlySearch, setAiOnlySearch] = useState('');

  // ─── Badge counts ──────────────────────────────────────────────────
  const badgeCounts = useMemo(
    () => ({
      hotLeads: hotLeads.length,
      properties: properties.length,
      messages: queuedMessages,
    }),
    [hotLeads, properties, queuedMessages]
  );

  // ─── Department tree (for non-search view) ─────────────────────────
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

  // ─── AI assistants ────────────────────────────────────────────────
  const allAssistants = getAllAssistants();

  // When globalSearch is active, also filter AI assistants
  const effectiveAISearch = globalSearch.trim() ? globalSearch : aiOnlySearch;
  const filteredAssistants = useMemo(() => {
    if (!effectiveAISearch) return allAssistants;
    const q = effectiveAISearch.toLowerCase();
    return allAssistants.filter(
      a =>
        a.name.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q)
    );
  }, [allAssistants, effectiveAISearch]);

  const groupedAssistants = useMemo(() => {
    const groups: Record<string, Assistant[]> = {};
    filteredAssistants.forEach(a => {
      if (!groups[a.department]) groups[a.department] = [];

      groups[a.department].push(a);
    });
    return groups;
  }, [filteredAssistants]);

  // ─── Global search results ────────────────────────────────────────
  const searchResults = useMemo<SearchResult[]>(() => {
    if (!globalSearch.trim()) return [];
    const q = globalSearch.toLowerCase();
    const results: SearchResult[] = [];

    // Departments and their services
    Object.entries(DEPARTMENTS).forEach(([deptId, dept]) => {
      const deptMatches = dept.label.toLowerCase().includes(q);
      if (deptMatches) {
        const badge = dept.badgeKey ? badgeCounts[dept.badgeKey] : undefined;
        results.push({
          type: 'department',
          deptId,
          label: dept.label,
          color: dept.color,
          icon: dept.icon,
          badge,
        });
      }
      // Match individual services
      dept.services.forEach(svc => {
        if (svc.toLowerCase().includes(q)) {
          results.push({
            type: 'service',
            deptId,
            deptLabel: dept.label,
            deptColor: dept.color,
            deptIcon: dept.icon,
            serviceId: svc.toLowerCase().replace(/\s+/g, '-'),
            label: svc,
          });
        }
      });
    });

    // AI Assistants
    allAssistants.forEach(a => {
      if (
        a.name.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q)
      ) {
        results.push({ type: 'assistant', assistant: a });
      }
    });

    return results;
  }, [globalSearch, badgeCounts, allAssistants]);

  const deptServiceResults = searchResults.filter(
    r => r.type === 'department' || r.type === 'service'
  ) as (DeptSearchResult | ServiceSearchResult)[];
  const assistantResults = searchResults.filter(
    r => r.type === 'assistant'
  ) as AssistantSearchResult[];

  // ─── Handlers ────────────────────────────────────────────────────

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
      dispatch(clearGlobalSearch());
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
      // Default internal navigation path (used when parent does not intercept clicks)
      switch (itemId) {
        case 'home':
          navigate('/dashboard');
          break;
        case 'analytics':
          navigate('/owner/system-health');
          break;
        case 'admin':
          navigate('/lion/admin-dashboard');
          break;
        case 'settings':
          navigate('/owner/whatsapp/settings');
          break;
        default:
          break;
      }
      onItemClick?.('quick-nav', { itemId });
    },
    [navigate, onItemClick]
  );

  const toggleDeptExpand = useCallback((deptId: string, shouldExpand?: boolean) => {
    setExpandedDepts(prev => {
      // eslint-disable-next-line security/detect-object-injection
      const nextValue = shouldExpand ?? !prev[deptId];
      const next = { ...prev, [deptId]: nextValue };
      writeExpandedDepts(next);
      return next;
    });
  }, []);

  const handleToggleCollapsed = useCallback(() => {
    const next = !collapsed;
    dispatch(setSidebarCollapsed(next));
    try {
      localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
    } catch {
      /* noop */
    }
  }, [collapsed, dispatch]);

  const handleGlobalSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setGlobalSearch(e.target.value));
    },
    [dispatch]
  );

  const handleGlobalSearchClear = useCallback(() => {
    dispatch(clearGlobalSearch());
    searchInputRef.current?.focus();
  }, [dispatch]);

  // ─── Keyboard navigation (non-search mode) ───────────────────────

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
      items.push({ id: `assistant-${assistant.id}`, label: assistant.name, depth: 0 });
    });

    if (isSuperUser) items.push({ id: 'footer-admin', label: 'Admin', depth: 0 });
    items.push({ id: 'footer-settings', label: 'Settings', depth: 0 });
    return items;
  }, [deptTree, expandedDepts, filteredAssistants, isSuperUser]);

  const handleNavigableSelect = useCallback(
    (item: NavigableItem) => {
      if (item.id.startsWith('quick-')) {
        handleQuickNavClick(item.id.replace('quick-', ''));
      } else if (item.id.startsWith('dept-')) {
        handleDeptClick(item.id.replace('dept-', ''));
      } else if (item.id.startsWith('service-')) {
        const [, deptId, ...parts] = item.id.split('-');
        handleServiceClick(deptId, parts.join('-'));
      } else if (item.id.startsWith('assistant-')) {
        handleAssistantClick(item.id.replace('assistant-', ''));
      } else if (item.id === 'footer-admin') {
        handleQuickNavClick('admin');
      } else if (item.id === 'footer-settings') {
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
      const el = document.activeElement as HTMLElement | null;
      el?.blur();
    },
  });

  const getItemFocusProps = useCallback(
    (itemId: string) => {
      const index = navigableItems.findIndex(i => i.id === itemId);
      return index >= 0 ? getFocusProps(index) : undefined;
    },
    [getFocusProps, navigableItems]
  );

  // Cmd+J: focus search, Cmd+Shift+J: focus sidebar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') return; // let CommandPalette handle Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        if (e.shiftKey) {
          setFocus(0);
        } else {
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setFocus]);

  // ─────────────────────────────────────────────────────────────────
  // COLLAPSED (icon-rail) render
  // ─────────────────────────────────────────────────────────────────
  if (collapsed) {
    return (
      <SidebarWrapper
        ref={sidebarRef}
        $collapsed
        role="navigation"
        aria-label="Main navigation (collapsed)"
        data-testid="unified-sidebar"
      >
        <SidebarHeader>
          <SidebarLogo src="/white-caves-logo.png" alt="White Caves" title="White Caves CRM" />
          <CollapseToggle
            onClick={handleToggleCollapsed}
            title="Expand sidebar (Cmd+J)"
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
      </SidebarWrapper>
    );
  }

  const isSearching = globalSearch.trim().length > 0;

  // ─────────────────────────────────────────────────────────────────
  // EXPANDED render
  // ─────────────────────────────────────────────────────────────────
  return (
    <SidebarWrapper
      ref={sidebarRef}
      onKeyDown={!isSearching ? handleNavigationKeyDown : undefined}
      role="navigation"
      aria-label="Main navigation"
      data-testid="unified-sidebar"
    >
      {/* ─── Header ─────────────────────────────────────────────── */}
      <SidebarHeader>
        <SidebarLogo
          src="/white-caves-logo.png"
          alt="White Caves"
          title="White Caves CRM Platform"
        />
        <SidebarTitle>White Caves</SidebarTitle>
        <CollapseToggle
          onClick={handleToggleCollapsed}
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft />
        </CollapseToggle>
      </SidebarHeader>

      {/* ─── Global Search Bar ──────────────────────────────────── */}
      <GlobalSearchBar>
        <GlobalSearchInputWrapper>
          <GlobalSearchIcon aria-hidden="true">
            <Search />
          </GlobalSearchIcon>
          <GlobalSearchInput
            ref={searchInputRef}
            type="text"
            placeholder="Search departments, services, AI…"
            value={globalSearch}
            onChange={handleGlobalSearchChange}
            aria-label="Search departments, services, and AI assistants"
            aria-expanded={isSearching}
            aria-controls="sidebar-search-results"
          />
          {isSearching && (
            <GlobalSearchClear
              onClick={handleGlobalSearchClear}
              title="Clear search"
              aria-label="Clear search"
            >
              <X />
            </GlobalSearchClear>
          )}
        </GlobalSearchInputWrapper>
      </GlobalSearchBar>

      {/* ─── Search Results (when query is active) ──────────────── */}
      {isSearching ? (
        <SearchResultsContainer
          id="sidebar-search-results"
          role="region"
          aria-label="Search results"
        >
          {searchResults.length === 0 ? (
            <SearchEmptyState>
              <SearchX aria-hidden="true" />
              <span>
                No results for &quot;<strong>{globalSearch}</strong>&quot;
              </span>
            </SearchEmptyState>
          ) : (
            <>
              {/* Departments & Services section */}
              {deptServiceResults.length > 0 && (
                <SearchResultsSection>
                  <SearchResultsSectionTitle>
                    Departments &amp; Services ({deptServiceResults.length})
                  </SearchResultsSectionTitle>
                  {deptServiceResults.map((result, idx) => {
                    if (result.type === 'department') {
                      const Icon = result.icon;
                      return (
                        <SearchResultItem
                          key={`dept-${result.deptId}-${idx}`}
                          $active={selectedDept === result.deptId}
                          $color={result.color}
                          onClick={() => handleDeptClick(result.deptId)}
                          aria-label={`Department: ${result.label}`}
                        >
                          <SearchResultIcon $color={result.color}>
                            <Icon />
                          </SearchResultIcon>
                          <SearchResultText>
                            <SearchResultLabel>{result.label}</SearchResultLabel>
                          </SearchResultText>
                          <SearchResultBadge>dept</SearchResultBadge>
                        </SearchResultItem>
                      );
                    }
                    // service
                    const DeptIcon = result.deptIcon;
                    return (
                      <SearchResultItem
                        key={`svc-${result.deptId}-${result.serviceId}-${idx}`}
                        $active={selectedDept === result.deptId && selectedSvc === result.serviceId}
                        $color={result.deptColor}
                        onClick={() => handleServiceClick(result.deptId, result.serviceId)}
                        aria-label={`${result.label} in ${result.deptLabel}`}
                      >
                        <SearchResultIcon $color={result.deptColor}>
                          <DeptIcon />
                        </SearchResultIcon>
                        <SearchResultText>
                          <SearchResultLabel>{result.label}</SearchResultLabel>
                          <SearchResultSubLabel>{result.deptLabel}</SearchResultSubLabel>
                        </SearchResultText>
                        <SearchResultBadge>service</SearchResultBadge>
                      </SearchResultItem>
                    );
                  })}
                </SearchResultsSection>
              )}

              {/* AI Assistants section */}
              {assistantResults.length > 0 && (
                <SearchResultsSection>
                  <SearchResultsSectionTitle>
                    AI Assistants ({assistantResults.length})
                  </SearchResultsSectionTitle>
                  {assistantResults.map((result, idx) => {
                    const a = result.assistant;
                    return (
                      <SearchResultItem
                        key={`assistant-${a.id}-${idx}`}
                        $active={selectedAssistantId === a.id}
                        $color={a.color}
                        onClick={() => handleAssistantClick(a.id)}
                        aria-label={`${a.name} AI assistant`}
                      >
                        <AIAssistantAvatar
                          $color={a.color}
                          style={{ width: 24, height: 24, borderRadius: 6, fontSize: 10 }}
                        >
                          {a.avatar || a.name[0]}
                        </AIAssistantAvatar>
                        <SearchResultText>
                          <SearchResultLabel>{a.name}</SearchResultLabel>
                          <SearchResultSubLabel>{a.title}</SearchResultSubLabel>
                        </SearchResultText>
                        <SearchResultBadge>AI</SearchResultBadge>
                      </SearchResultItem>
                    );
                  })}
                </SearchResultsSection>
              )}
            </>
          )}
        </SearchResultsContainer>
      ) : (
        <>
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

          {/* ─── Company Departments ────────────────────────────────── */}
          <SidebarSection>
            <DeptGroupHeader
              onClick={() => setCompanyExpanded(v => !v)}
              aria-label="Toggle company departments"
              aria-expanded={companyExpanded}
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

          {/* ─── AI Command Center ──────────────────────────────────── */}
          <SidebarSection>
            <DeptGroupHeader
              onClick={() => setAiExpanded(v => !v)}
              aria-label="Toggle AI Command Center"
              aria-expanded={aiExpanded}
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
                    placeholder="Filter assistants…"
                    value={aiOnlySearch}
                    onChange={e => setAiOnlySearch(e.target.value)}
                    aria-label="Filter AI assistants"
                  />
                </AISearchContainer>

                <SidebarNav aria-label="AI assistants">
                  {Object.entries(groupedAssistants).map(([deptId, assistants]) => {
                    const deptInfo = REGISTRY_DEPARTMENTS[deptId as DepartmentId];
                    return (
                      <div key={deptId}>
                        {filteredAssistants.length > 1 && (
                          <SidebarSectionTitle style={{ padding: '4px 14px', fontSize: '10px' }}>
                            {deptInfo?.label || deptId} ({assistants.length})
                          </SidebarSectionTitle>
                        )}
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
        </>
      )}

      {/* ─── Footer (Admin + Settings) ──────────────────────────── */}
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
    </SidebarWrapper>
  );
};

export default UnifiedSidebar;
