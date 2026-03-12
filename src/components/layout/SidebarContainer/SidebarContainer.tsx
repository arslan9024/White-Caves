/**
 * SidebarContainer - Left Sidebar with Bold Branding
 * 
 * Features:
 * - Bold company branding (red gradient #D32F2F → #B71C1C)
 * - Responsive width: 280px → 72px collapse (icon-only mode)
 * - Navigation items with icons and labels
 * - Active/hover states
 * - Smooth collapse animation
 * - Mobile-responsive behavior
 */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ChevronLeft, Home, BarChart3, Users2, MessageSquare, Settings,
  Zap, TrendingUp, Command, ChevronRight, Shield, AlertCircle, Activity,
  Building2, Briefcase, DollarSign, Megaphone, Globe, Lock, Code, Scale
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
// @ts-ignore - sidebarSlice is a .js file pending conversion
import { selectDepartment, selectService } from '../../../store/slices/sidebarSlice';
import {
  SidebarContainerWrapper,
  SidebarHeader,
  SidebarLogo,
  LogoBadge,
  LogoText,
  LogoTitle,
  LogoSubtitle,
  SidebarNav,
  NavGroup,
  GroupHeader,
  GroupToggle,
  GroupItems,
  GroupItemsCollapsed,
  NavItem,
  NavIcon,
  NavLabel,
  NavItemIcon,
  NavIconLarge,
  NavTooltip,
  DepartmentsList,
  DepartmentItem,
  DepartmentHeader,
  DeptIcon,
  DeptLabel,
  DeptToggle,
  DepartmentServices,
  ServiceItem,
  ServiceDot,
  ServiceLabel,
  DepartmentsCollapsed,
  DeptIconBtn,
  AdminGroupHeader,
  AdminNavItem
} from './styles';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DepartmentDef {
  icon: LucideIcon;
  label: string;
  color: string;
  services: string[];
}

interface DepartmentsMap {
  [key: string]: DepartmentDef;
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface MenuGroup {
  group: string;
  label: string;
  icon?: LucideIcon;
  items: MenuItem[];
}

interface ExpandedGroups {
  [key: string]: boolean;
}

interface ExpandedDepartments {
  [key: string]: boolean;
}

interface SidebarContainerProps {
  collapsed?: boolean;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  role?: string;
}

interface AuthState {
  role?: string;
  isSuperUser?: boolean;
}

interface SidebarState {
  selectedDepartment?: string;
  selectedService?: string;
}

interface RootState {
  auth?: AuthState;
  sidebar?: SidebarState;
}

// ---------------------------------------------------------------------------
// Department Definitions
// ---------------------------------------------------------------------------

const DEPARTMENTS: DepartmentsMap = {
  operations: {
    icon: Building2,
    label: 'Operations',
    color: '#3B82F6',
    services: ['Inventory Management', 'Properties', 'Asset Tracking', 'Data Management']
  },
  finance: {
    icon: DollarSign,
    label: 'Finance',
    color: '#F59E0B',
    services: ['Invoicing', 'Payment Tracking', 'Financial Reports', 'Budget Analysis']
  },
  sales: {
    icon: TrendingUp,
    label: 'Sales',
    color: '#10B981',
    services: ['Lead Management', 'Negotiations', 'Deal Tracking', 'Commission Tracking']
  },
  marketing: {
    icon: Megaphone,
    label: 'Marketing',
    color: '#EC4899',
    services: ['Campaigns', 'Content', 'Analytics', 'Lead Generation']
  },
  communications: {
    icon: MessageSquare,
    label: 'Communications',
    color: '#8B5CF6',
    services: ['Messages', 'Emails', 'Templates', 'Notifications']
  },
  executive: {
    icon: Globe,
    label: 'Executive',
    color: '#DC2626',
    services: ['Strategic Overview', 'KPIs', 'Reports', 'Insights']
  },
  compliance: {
    icon: Lock,
    label: 'Compliance',
    color: '#059669',
    services: ['Regulations', 'Audits', 'Policies', 'Documentation']
  },
  technology: {
    icon: Code,
    label: 'Technology',
    color: '#06B6D4',
    services: ['Systems', 'Integration', 'Support', 'Development']
  },
  legal: {
    icon: Scale,
    label: 'Legal',
    color: '#7C3AED',
    services: ['Contracts', 'Agreements', 'Compliance', 'Documentation']
  }
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const SidebarContainer: React.FC<SidebarContainerProps> = ({
  collapsed = false,
  activeTab = 'overview',
  onTabChange = () => {},
  role = 'owner'
}) => {
  const dispatch = useDispatch();
  const [expandedGroups, setExpandedGroups] = useState<ExpandedGroups>({
    dashboard: true,
    management: true,
    departments: false,
    analytics: false,
    admin: false
  });
  const [expandedDepartments, setExpandedDepartments] = useState<ExpandedDepartments>({});

  // Get user role from Redux for super user detection
  const userRole = useSelector((state: RootState) => state.auth?.role || 'user');
  const isSuperUser = userRole === 'lion' || useSelector((state: RootState) => state.auth?.isSuperUser);
  const selectedDepartment = useSelector((state: RootState) => state.sidebar?.selectedDepartment);
  const selectedService = useSelector((state: RootState) => state.sidebar?.selectedService);

  const toggleGroup = (groupId: string): void => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const toggleDepartment = (deptId: string): void => {
    setExpandedDepartments(prev => ({
      ...prev,
      [deptId]: !prev[deptId]
    }));
  };

  const handleDepartmentSelect = (deptId: string): void => {
    dispatch(selectDepartment(deptId));
    if (!collapsed) {
      toggleDepartment(deptId);
    }
  };

  // Define menu items for each role
  const getMenuItems = (): MenuGroup[] => {
    const baseItems: MenuGroup[] = [
      {
        group: 'dashboard',
        label: 'Dashboard',
        items: [
          { id: 'overview', label: 'Overview', icon: Home },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'reports', label: 'Reports', icon: TrendingUp }
        ]
      },
      {
        group: 'management',
        label: 'Management',
        items: [
          { id: 'clients', label: 'Clients', icon: Users2 },
          { id: 'leads', label: 'Leads', icon: Command },
          { id: 'communications', label: 'Communications', icon: MessageSquare }
        ]
      },
      {
        group: 'analytics',
        label: 'Analytics',
        items: [
          { id: 'performance', label: 'Performance', icon: Zap },
          { id: 'settings', label: 'Settings', icon: Settings }
        ]
      }
    ];

    // Add admin section for super users
    if (isSuperUser) {
      baseItems.push({
        group: 'admin',
        label: 'Administration',
        icon: Shield,
        items: [
          { id: 'admin-dashboard', label: 'Admin Dashboard', icon: Shield },
          { id: 'system-health', label: 'System Health', icon: Activity },
          { id: 'user-management', label: 'User Management', icon: Users2 },
          { id: 'alerts', label: 'Alerts & Monitoring', icon: AlertCircle },
          { id: 'system-settings', label: 'System Settings', icon: Settings }
        ]
      });
    }

    return baseItems;
  };

  const menuGroups = getMenuItems();

  const isAdminGroup = (group: MenuGroup): boolean => group.group === 'admin' && !!isSuperUser;

  return (
    <SidebarContainerWrapper $collapsed={collapsed}>
      {/* Header with Logo */}
      <SidebarHeader>
        <SidebarLogo>
          <LogoBadge>
            <span>WC</span>
          </LogoBadge>
          {!collapsed && (
            <LogoText>
              <LogoTitle>White Caves</LogoTitle>
              <LogoSubtitle>Real Estate</LogoSubtitle>
            </LogoText>
          )}
        </SidebarLogo>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarNav>
        {menuGroups.map(group => {
          const isAdmin = isAdminGroup(group);
          const GroupHeaderComponent = isAdmin ? AdminGroupHeader : GroupHeader;

          return (
            <NavGroup key={group.group} className={group.group === 'departments' ? 'departments-group' : ''}>
              {/* Group Header */}
              <GroupHeaderComponent
                $expanded={expandedGroups[group.group]}
                $isDepartments={group.group === 'departments'}
                onClick={() => !collapsed && toggleGroup(group.group)}
                title={collapsed ? group.label : ''}
              >
                <span>{group.label}</span>
                {!collapsed && (
                  <GroupToggle $rotated={expandedGroups[group.group]}>
                    <ChevronRight size={16} />
                  </GroupToggle>
                )}
              </GroupHeaderComponent>

              {/* Group Items */}
              {expandedGroups[group.group] && !collapsed && (
                <GroupItems>
                  {group.items.map(item => {
                    const IconComponent = item.icon;
                    const ItemComponent = isAdmin ? AdminNavItem : NavItem;

                    return (
                      <ItemComponent
                        key={item.id}
                        $active={activeTab === item.id}
                        onClick={() => onTabChange(item.id)}
                        title={item.label}
                      >
                        <NavIcon>
                          <IconComponent size={20} />
                        </NavIcon>
                        <NavLabel>{item.label}</NavLabel>
                      </ItemComponent>
                    );
                  })}
                </GroupItems>
              )}

              {/* Icon-Only Mode (Collapsed) */}
              {collapsed && (
                <GroupItemsCollapsed>
                  {group.items.map(item => {
                    const IconComponent = item.icon;
                    return (
                      <NavItemIcon
                        key={item.id}
                        $active={activeTab === item.id}
                        onClick={() => onTabChange(item.id)}
                        title={item.label}
                      >
                        <NavIconLarge>
                          <IconComponent size={24} />
                        </NavIconLarge>
                        <NavTooltip>{item.label}</NavTooltip>
                      </NavItemIcon>
                    );
                  })}
                </GroupItemsCollapsed>
              )}
            </NavGroup>
          );
        })}

        {/* Departments Section */}
        <NavGroup className="departments-group">
          {/* Departments Header */}
          <GroupHeader
            $expanded={expandedGroups.departments}
            $isDepartments={true}
            onClick={() => !collapsed && toggleGroup('departments')}
            title={collapsed ? 'Departments' : ''}
          >
            <span>Departments</span>
            {!collapsed && (
              <GroupToggle $rotated={expandedGroups.departments}>
                <ChevronRight size={16} />
              </GroupToggle>
            )}
          </GroupHeader>

          {/* Departments List */}
          {expandedGroups.departments && !collapsed && (
            <DepartmentsList>
              {Object.entries(DEPARTMENTS).map(([deptId, dept]) => {
                const IconComponent = dept.icon;
                const isExpanded = expandedDepartments[deptId];
                const isSelected = selectedDepartment === deptId;

                return (
                  <DepartmentItem key={deptId}>
                    {/* Department Header */}
                    <DepartmentHeader
                      $selected={isSelected}
                      $deptColor={dept.color}
                      onClick={() => handleDepartmentSelect(deptId)}
                      title={dept.label}
                    >
                      <DeptIcon $deptColor={dept.color}>
                        <IconComponent size={18} />
                      </DeptIcon>
                      <DeptLabel>{dept.label}</DeptLabel>
                      <DeptToggle $rotated={isExpanded} $deptColor={dept.color}>
                        <ChevronRight size={14} />
                      </DeptToggle>
                    </DepartmentHeader>

                    {/* Department Services */}
                    {isExpanded && (
                      <DepartmentServices $deptColor={dept.color}>
                        {dept.services.map((service: string, idx: number) => (
                          <ServiceItem
                            key={idx}
                            $active={selectedService === service}
                            $deptColor={dept.color}
                            onClick={() => {
                              dispatch(selectService({ department: deptId, service }));
                              onTabChange(`service-${deptId}-${idx}`);
                            }}
                            title={service}
                          >
                            <ServiceDot $color={dept.color} />
                            <ServiceLabel>{service}</ServiceLabel>
                          </ServiceItem>
                        ))}
                      </DepartmentServices>
                    )}
                  </DepartmentItem>
                );
              })}
            </DepartmentsList>
          )}

          {/* Icon-Only Mode (Collapsed) - Department Icons */}
          {collapsed && (
            <DepartmentsCollapsed>
              {Object.entries(DEPARTMENTS).slice(0, 4).map(([deptId, dept]) => {
                const IconComponent = dept.icon;
                const isSelected = selectedDepartment === deptId;

                return (
                  <DeptIconBtn
                    key={deptId}
                    $active={isSelected}
                    $deptColor={dept.color}
                    onClick={() => handleDepartmentSelect(deptId)}
                    title={dept.label}
                  >
                    <IconComponent size={20} />
                    <NavTooltip>{dept.label}</NavTooltip>
                  </DeptIconBtn>
                );
              })}
            </DepartmentsCollapsed>
          )}
        </NavGroup>
      </SidebarNav>
    </SidebarContainerWrapper>
  );
};

export default SidebarContainer;
