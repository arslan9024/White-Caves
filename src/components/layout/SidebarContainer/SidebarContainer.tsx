/**
 * SidebarContainer — Unified Slim Icon Rail (64px) + Flyout Panel (240px)
 *
 * Single sidebar architecture combining departments AND AI Command Center.
 * - 64px icon rail always visible on desktop
 * - Click department → opens 240px flyout with services
 * - Click Bot icon → opens 240px flyout with AI assistants (from registry)
 * - Department flyout & AI flyout are mutually exclusive
 * - Active state: RED left border + icon fill
 * - Bottom-pinned: AI Assistant + Settings icons
 * - Mobile: hidden (replaced by BottomTabBar)
 */

import React, { useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store/store';
import {
  Home, BarChart3, Users2, Settings,
  TrendingUp, Building2, DollarSign, Megaphone,
  MessageSquare, Globe, Lock, Code, Scale, Bot,
  Shield, ChevronLeft, ChevronDown, Search,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  selectSelectedDepartment,
  selectFlyoutOpen,
  selectFlyoutDepartment,
  selectSelectedService,
  selectAICommandOpen,
  selectSelectedAssistant,
  toggleFlyout,
  closeFlyout,
  selectDepartment,
  selectService,
  toggleAICommand,
  closeAICommand,
  selectAssistant,
} from '../../../store/slices/sidebarSlice';
import {
  getAllAssistants,
  DEPARTMENTS as REGISTRY_DEPARTMENTS,
} from '../../../config/assistantRegistry';
import type { Assistant, DepartmentId } from '../../../config/assistantRegistry';
import {
  RailContainer,
  RailWrapper,
  RailIcon,
  RailIconButton,
  RailTooltip,
  RailDivider,
  RailSpacer,
  FlyoutPanel,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutClose,
  FlyoutNav,
  FlyoutItem,
  FlyoutDot,
  FlyoutBackdrop,
  AISearchBar,
  AISearchInput,
  AIGroupHeader,
  AIAssistantBtn,
  AIAvatar,
  AIAssistantName,
  AIAssistantDesc,
  AIAssistantInfo,
  AIFooter,
} from './styles';

// ─── Department definitions ───────────────────────────────────────────────

interface DepartmentDef {
  icon: LucideIcon;
  label: string;
  color: string;
  services: string[];
}

const DEPARTMENTS: Record<string, DepartmentDef> = {
  operations: {
    icon: Building2, label: 'Operations', color: '#3B82F6',
    services: ['Inventory Management', 'Properties', 'Asset Tracking', 'Data Management'],
  },
  finance: {
    icon: DollarSign, label: 'Finance', color: '#F59E0B',
    services: ['Invoicing', 'Payment Tracking', 'Financial Reports', 'Budget Analysis'],
  },
  sales: {
    icon: TrendingUp, label: 'Sales', color: '#10B981',
    services: ['Lead Management', 'Negotiations', 'Deal Tracking', 'Pipeline'],
  },
  marketing: {
    icon: Megaphone, label: 'Marketing', color: '#EC4899',
    services: ['Campaigns', 'Content', 'Analytics', 'Lead Generation'],
  },
  communications: {
    icon: MessageSquare, label: 'Communications', color: '#8B5CF6',
    services: ['Messages', 'Emails', 'Templates', 'Notifications'],
  },
  executive: {
    icon: Globe, label: 'Executive', color: '#E31E24',
    services: ['Strategic Overview', 'KPIs', 'Reports', 'Insights'],
  },
  compliance: {
    icon: Lock, label: 'Compliance', color: '#059669',
    services: ['Regulations', 'Audits', 'Policies', 'Documentation'],
  },
  technology: {
    icon: Code, label: 'Technology', color: '#06B6D4',
    services: ['Systems', 'Integration', 'Support', 'Development'],
  },
  legal: {
    icon: Scale, label: 'Legal', color: '#7C3AED',
    services: ['Contracts', 'Agreements', 'Compliance', 'Documentation'],
  },
};

// ─── Top nav items ────────────────────────────────────────────────────────

const TOP_ITEMS = [
  { id: 'home', icon: Home, label: 'Dashboard' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'clients', icon: Users2, label: 'Clients' },
];

// ─── Props ────────────────────────────────────────────────────────────────

interface SidebarContainerProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────

const SidebarContainer: React.FC<SidebarContainerProps> = ({
  activeTab = 'home',
  onTabChange = () => {},
}) => {
  const dispatch = useDispatch();

  const selectedDepartment = useSelector(selectSelectedDepartment);
  const selectedSvc = useSelector(selectSelectedService);
  const flyoutOpen = useSelector(selectFlyoutOpen);
  const flyoutDepartment = useSelector(selectFlyoutDepartment);
  const aiCommandOpen = useSelector(selectAICommandOpen);
  const selectedAssistantId = useSelector(selectSelectedAssistant);
  const userRole = useSelector((state: RootState) => state.auth?.user?.role || 'user');
  const isSuperUser = userRole === 'lion';

  // AI assistant local search state
  const [aiSearch, setAiSearch] = useState('');
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>({});

  const handleDeptClick = useCallback((deptId: string) => {
    dispatch(toggleFlyout(deptId));
    dispatch(selectDepartment(deptId));
  }, [dispatch]);

  const handleServiceClick = useCallback((deptId: string, service: string) => {
    dispatch(selectService({ department: deptId, service }));
    onTabChange(`service-${deptId}`);
  }, [dispatch, onTabChange]);

  const handleTopItemClick = useCallback((itemId: string) => {
    dispatch(closeFlyout());
    onTabChange(itemId);
  }, [dispatch, onTabChange]);

  const handleAIToggle = useCallback(() => {
    dispatch(toggleAICommand());
    setAiSearch('');
  }, [dispatch]);

  const handleCloseFlyout = useCallback(() => {
    if (aiCommandOpen) {
      dispatch(closeAICommand());
    } else {
      dispatch(closeFlyout());
    }
  }, [dispatch, aiCommandOpen]);

  // Build AI assistant list grouped by department
  const allAssistants = useMemo(() => getAllAssistants(), []);
  const filteredAssistants = useMemo(() => {
    if (!aiSearch.trim()) return allAssistants;
    const q = aiSearch.toLowerCase();
    return allAssistants.filter(a =>
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

  const toggleDeptExpand = useCallback((dept: string) => {
    setExpandedDepts(prev => ({ ...prev, [dept]: !prev[dept] }));
  }, []);

  const isDeptExpanded = useCallback((dept: string) => {
    return expandedDepts[dept] !== false; // default expanded
  }, [expandedDepts]);

  const activeDept = DEPARTMENTS[flyoutDepartment || ''];
  const anyFlyoutOpen = flyoutOpen || aiCommandOpen;

  return (
    <>
      {/* Backdrop to close flyout on outside click */}
      {anyFlyoutOpen && <FlyoutBackdrop onClick={handleCloseFlyout} />}

      <RailContainer>
        <RailWrapper>
          {/* ── Top navigation items ─────────────────────── */}
          {TOP_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <RailIcon key={item.id}>
                <RailIconButton
                  $active={isActive}
                  onClick={() => handleTopItemClick(item.id)}
                  aria-label={item.label}
                  title={item.label}
                >
                  <Icon size={22} />
                </RailIconButton>
                <RailTooltip>{item.label}</RailTooltip>
              </RailIcon>
            );
          })}

          <RailDivider />

          {/* ── Department icons ──────────────────────────── */}
          {Object.entries(DEPARTMENTS).map(([deptId, dept]) => {
            const Icon = dept.icon;
            const isActive = selectedDepartment === deptId;
            const isFlyoutTarget = flyoutDepartment === deptId && flyoutOpen;
            return (
              <RailIcon key={deptId}>
                <RailIconButton
                  $active={isActive}
                  $isFlyoutTarget={isFlyoutTarget}
                  $color={dept.color}
                  onClick={() => handleDeptClick(deptId)}
                  aria-label={dept.label}
                  title={dept.label}
                >
                  <Icon size={20} />
                </RailIconButton>
                <RailTooltip>{dept.label}</RailTooltip>
              </RailIcon>
            );
          })}

          <RailSpacer />

          {/* ── Bottom pinned items ──────────────────────── */}
          <RailDivider />

          {/* AI Command Center toggle */}
          <RailIcon>
            <RailIconButton
              $active={aiCommandOpen}
              $color="#E31E24"
              onClick={handleAIToggle}
              aria-label="AI Command Center"
              title="AI Command Center"
            >
              <Bot size={22} />
            </RailIconButton>
            <RailTooltip>AI Command Center</RailTooltip>
          </RailIcon>

          {/* Admin (super user only) */}
          {isSuperUser && (
            <RailIcon>
              <RailIconButton
                onClick={() => onTabChange('admin-dashboard')}
                aria-label="Admin"
                title="Admin Dashboard"
              >
                <Shield size={20} />
              </RailIconButton>
              <RailTooltip>Admin</RailTooltip>
            </RailIcon>
          )}

          {/* Settings */}
          <RailIcon>
            <RailIconButton
              $active={activeTab === 'settings'}
              onClick={() => handleTopItemClick('settings')}
              aria-label="Settings"
              title="Settings"
            >
              <Settings size={20} />
            </RailIconButton>
            <RailTooltip>Settings</RailTooltip>
          </RailIcon>
        </RailWrapper>

        {/* ── Flyout panel — Department services OR AI Command Center ── */}
        <FlyoutPanel $open={anyFlyoutOpen} $color={aiCommandOpen ? '#E31E24' : activeDept?.color}>
          {/* Department flyout content */}
          {flyoutOpen && activeDept && flyoutDepartment && (
            <>
              <FlyoutHeader>
                <FlyoutTitle $color={activeDept.color}>
                  {activeDept.label}
                </FlyoutTitle>
                <FlyoutClose onClick={() => dispatch(closeFlyout())} aria-label="Close flyout">
                  <ChevronLeft size={16} />
                </FlyoutClose>
              </FlyoutHeader>
              <FlyoutNav>
                {activeDept.services.map((service) => {
                  const isActiveSvc =
                    selectedDepartment === flyoutDepartment && selectedSvc === service;
                  return (
                    <FlyoutItem
                      key={service}
                      $active={isActiveSvc}
                      $color={activeDept.color}
                      onClick={() => handleServiceClick(flyoutDepartment, service)}
                    >
                      <FlyoutDot $color={activeDept.color} />
                      {service}
                    </FlyoutItem>
                  );
                })}
              </FlyoutNav>
            </>
          )}

          {/* AI Command Center flyout content */}
          {aiCommandOpen && (
            <>
              <FlyoutHeader>
                <FlyoutTitle $color="#E31E24">
                  AI Command Center
                </FlyoutTitle>
                <FlyoutClose onClick={() => dispatch(closeAICommand())} aria-label="Close AI panel">
                  <ChevronLeft size={16} />
                </FlyoutClose>
              </FlyoutHeader>

              <AISearchBar>
                <AISearchInput>
                  <Search size={14} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                  <input
                    value={aiSearch}
                    onChange={e => setAiSearch(e.target.value)}
                    placeholder="Search assistants..."
                    autoComplete="off"
                  />
                </AISearchInput>
              </AISearchBar>

              <FlyoutNav>
                {Object.entries(groupedAssistants).map(([deptId, assistants]) => {
                  const deptInfo = REGISTRY_DEPARTMENTS[deptId as DepartmentId];
                  const isExpanded = isDeptExpanded(deptId);
                  return (
                    <div key={deptId}>
                      <AIGroupHeader onClick={() => toggleDeptExpand(deptId)}>
                        <span>{deptInfo?.label || deptId} ({assistants.length})</span>
                        <ChevronDown
                          size={12}
                          style={{
                            transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                            transition: 'transform 0.2s ease',
                          }}
                        />
                      </AIGroupHeader>
                      {isExpanded && assistants.map(assistant => (
                        <AIAssistantBtn
                          key={assistant.id}
                          $selected={selectedAssistantId === assistant.id}
                          onClick={() => dispatch(selectAssistant(assistant.id))}
                        >
                          <AIAvatar $color={assistant.color}>
                            {assistant.avatar || assistant.name[0]}
                          </AIAvatar>
                          <AIAssistantInfo>
                            <AIAssistantName>{assistant.name}</AIAssistantName>
                            <AIAssistantDesc>{assistant.title}</AIAssistantDesc>
                          </AIAssistantInfo>
                        </AIAssistantBtn>
                      ))}
                    </div>
                  );
                })}
              </FlyoutNav>

              <AIFooter>
                {filteredAssistants.length} assistant{filteredAssistants.length !== 1 ? 's' : ''} • <kbd>Esc</kbd> to close
              </AIFooter>
            </>
          )}
        </FlyoutPanel>
      </RailContainer>
    </>
  );
};

export default SidebarContainer;
