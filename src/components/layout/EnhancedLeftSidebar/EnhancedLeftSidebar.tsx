/**
 * EnhancedLeftSidebar — Desktop Unified Sidebar (280px)
 *
 * Features:
 *  - Icon rail (removed, now integrated into sidebar)
 *  - Quick nav items (Home, Analytics, Dashboard)
 *  - Company departments tree (expandable)
 *  - AI Command Center (inline, searchable)
 *  - Admin & Settings footer
 *  - Keyboard navigation (arrow keys, enter, escape)
 *  - localStorage persistence for expand/collapse state
 *  - WCAG 2.1 AA accessibility
 */

import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store/store';
import {
  Home,
  BarChart3,
  Building2,
  DollarSign,
  TrendingUp,
  Megaphone,
  MessageSquare,
  Globe,
  Lock,
  Code,
  Scale,
  Bot,
  Shield,
  Settings,
  Search,
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
import { getAllAssistants, DEPARTMENTS as REGISTRY_DEPARTMENTS } from '../../../config/assistantRegistry';
import type { Assistant, DepartmentId } from '../../../config/assistantRegistry';
import { selectHotLeads, selectAllProperties, selectQueuedCount } from '../../../store/crmDataSlice';
import { colors } from '../../../styles/theme/colors';
import { createLogger } from '../../../utils/logger';
import { useKeyboardNavigation, type NavigableItem } from '../../../hooks/navigation/useKeyboardNavigation';
import SidebarTree, { type DepartmentTreeNode, type ServiceTreeNode } from './SidebarTree';
import SidebarNavItem from './SidebarNavItem';
import {
  SidebarContainer,
  SidebarHeader,
  SidebarLogo,
  SidebarTitle,
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
} from './styles';

const log = createLogger('EnhancedLeftSidebar');

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

// ─── Department Registry (from styles/config) ──────────────────────────

interface DepartmentDef {
  icon: LucideIcon;
  label: string;
  color: string;
  services: string[];
  badgeKey?: 'hotLeads' | 'properties' | 'messages';
}

const DEPARTMENTS: Record<string, DepartmentDef> = {
  operations: {
    icon: Building2,
    label: 'Operations',
    color: '#3B82F6',
    services: ['Inventory Management', 'Properties', 'Asset Tracking', 'Data Management'],
    badgeKey: 'properties',
  },
  finance: {
    icon: DollarSign,
    label: 'Finance',
    color: '#F59E0B',
    services: ['Invoicing', 'Payment Tracking', 'Financial Reports', 'Budget Analysis'],
  },
  sales: {
    icon: TrendingUp,
    label: 'Sales',
    color: '#10B981',
    services: ['Lead Management', 'Negotiations', 'Deal Tracking', 'Pipeline'],
    badgeKey: 'hotLeads',
  },
  marketing: {
    icon: Megaphone,
    label: 'Marketing',
    color: '#EC4899',
    services: ['Campaigns', 'Content', 'Analytics', 'Lead Generation'],
  },
  communications: {
    icon: MessageSquare,
    label: 'Communications',
    color: '#8B5CF6',
    services: ['Messages', 'Emails', 'Templates', 'Notifications'],
    badgeKey: 'messages',
  },
  executive: {
    icon: Globe,
    label: 'Executive',
    color: colors.primary,
    services: ['Strategic Overview', 'KPIs', 'Reports', 'Insights'],
  },
  compliance: {
    icon: Lock,
    label: 'Compliance',
    color: '#059669',
    services: ['Regulations', 'Audits', 'Policies', 'Documentation'],
  },
  technology: {
    icon: Code,
    label: 'Technology',
    color: '#06B6D4',
    services: ['Systems', 'Integration', 'Support', 'Development'],
  },
  legal: {
    icon: Scale,
    label: 'Legal',
    color: '#8B5CF6',
    services: ['Contracts', 'Disputes', 'Compliance', 'Documentation'],
  },
};

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
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  // Keyboard navigation for entire sidebar (optional)
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      // Blur all focused elements
      const focusedEl = document.activeElement as HTMLElement;
      if (focusedEl) focusedEl.blur();
    }
  }, []);

  return (
    <SidebarContainer ref={sidebarRef} onKeyDown={handleKeyDown} role="navigation" aria-label="Main navigation">
      {/* ─── Header ────────────────────────────────────────────── */}
      <SidebarHeader>
        <SidebarLogo
          src="/white-caves-logo.png"
          alt="White Caves"
          title="White Caves CRM Platform"
        />
        <SidebarTitle>White Caves</SidebarTitle>
      </SidebarHeader>

      {/* ─── Quick Navigation ──────────────────────────────────── */}
      <SidebarSection>
        <SidebarNav>
          {QUICK_NAV.map(item => {
            const Icon = item.icon;
            return (
              <SidebarNavItem
                key={item.id}
                id={`quick-${item.id}`}
                icon={Icon}
                label={item.label}
                onClick={() => handleQuickNavClick(item.id)}
                title={item.label}
              />
            );
          })}
        </SidebarNav>
      </SidebarSection>

      <SidebarDivider />

      {/* ─── Company Departments ───────────────────────────────── */}
      <SidebarSection>
        <SidebarSectionTitle>Company</SidebarSectionTitle>
        <SidebarTree
          departments={deptTree}
          selectedDept={selectedDept}
          selectedService={selectedSvc}
          onDeptClick={handleDeptClick}
          onServiceClick={handleServiceClick}
          storageKey="departments"
        />
      </SidebarSection>

      <SidebarDivider />

      {/* ─── AI Command Center ────────────────────────────────── */}
      <SidebarSection>
        <SidebarSectionTitle>AI Command Center</SidebarSectionTitle>

        <AISearchContainer>
          <AISearchInput
            type="text"
            placeholder="Search assistants..."
            value={aiSearch}
            onChange={e => setAiSearch(e.target.value)}
            aria-label="Search AI assistants"
          />
        </AISearchContainer>

        <SidebarNav>
          {Object.entries(groupedAssistants).map(([deptId, assistants]) => {
            const deptInfo = REGISTRY_DEPARTMENTS[deptId as DepartmentId];
            return (
              <div key={deptId}>
                {/* Group header */}
                {filteredAssistants.length > 1 && (
                  <SidebarSectionTitle style={{ padding: '6px 12px', fontSize: '10px' }}>
                    {deptInfo?.label || deptId} ({assistants.length})
                  </SidebarSectionTitle>
                )}

                {/* Assistants in group */}
                {assistants.map(assistant => (
                  <AIAssistantItem
                    key={assistant.id}
                    $selected={selectedAssistantId === assistant.id}
                    onClick={() => handleAssistantClick(assistant.id)}
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
            title="Admin Dashboard"
          />
        )}

        <SidebarNavItem
          id="settings-btn"
          icon={Settings}
          label="Settings"
          onClick={() => handleQuickNavClick('settings')}
          title="Settings"
        />
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default EnhancedLeftSidebar;
