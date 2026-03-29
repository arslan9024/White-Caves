/**
 * SidebarContainer — Slim Icon Rail (64px) + Flyout Panel (240px)
 *
 * Industry-standard 2025-2026 CRM sidebar pattern:
 * - 64px icon rail always visible on desktop
 * - Click → opens 240px flyout with department services
 * - Active state: RED left border + icon fill
 * - Bottom-pinned: AI Assistant + Settings icons
 * - Mobile: hidden (replaced by BottomTabBar)
 */

import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store/store';
import {
  Home, BarChart3, Users2, Settings,
  TrendingUp, Building2, DollarSign, Megaphone,
  MessageSquare, Globe, Lock, Code, Scale, Bot,
  Shield, ChevronLeft
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  selectSelectedDepartment,
  selectFlyoutOpen,
  selectFlyoutDepartment,
  selectSelectedService,
  toggleFlyout,
  closeFlyout,
  selectDepartment,
  selectService,
  toggleRightPanel,
} from '../../../store/slices/sidebarSlice';
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
  const userRole = useSelector((state: RootState) => state.auth?.user?.role || 'user');
  const isSuperUser = userRole === 'lion';

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

  const activeDept = DEPARTMENTS[flyoutDepartment || ''];

  return (
    <>
      {/* Backdrop to close flyout on outside click */}
      {flyoutOpen && <FlyoutBackdrop onClick={() => dispatch(closeFlyout())} />}

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

          {/* AI Assistants toggle */}
          <RailIcon>
            <RailIconButton
              onClick={() => dispatch(toggleRightPanel())}
              aria-label="AI Assistants"
              title="AI Assistants"
            >
              <Bot size={22} />
            </RailIconButton>
            <RailTooltip>AI Assistants</RailTooltip>
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

        {/* ── Flyout panel ─────────────────────────────── */}
        <FlyoutPanel $open={flyoutOpen} $color={activeDept?.color}>
          {activeDept && flyoutDepartment && (
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
        </FlyoutPanel>
      </RailContainer>
    </>
  );
};

export default SidebarContainer;
