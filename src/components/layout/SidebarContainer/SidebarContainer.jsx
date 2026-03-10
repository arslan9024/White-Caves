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
import { selectDepartment, selectService } from '../../../store/slices/sidebarSlice';
import './SidebarContainer.css';

// Department definitions with services
const DEPARTMENTS = {
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

const SidebarContainer = ({
  collapsed = false,
  onToggleCollapse = () => {},
  activeTab = 'overview',
  onTabChange = () => {},
  role = 'owner'
}) => {
  const dispatch = useDispatch();
  const [expandedGroups, setExpandedGroups] = useState({
    dashboard: true,
    management: true,
    departments: false,
    analytics: false,
    admin: false
  });
  const [expandedDepartments, setExpandedDepartments] = useState({});

  // Get user role from Redux for super user detection
  const userRole = useSelector(state => state.auth?.role || 'user');
  const isSuperUser = userRole === 'lion' || useSelector(state => state.auth?.isSuperUser);
  const selectedDepartment = useSelector(state => state.sidebar?.selectedDepartment);
  const selectedService = useSelector(state => state.sidebar?.selectedService);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const toggleDepartment = (deptId) => {
    setExpandedDepartments(prev => ({
      ...prev,
      [deptId]: !prev[deptId]
    }));
  };

  const handleDepartmentSelect = (deptId) => {
    dispatch(selectDepartment(deptId));
    if (!collapsed) {
      toggleDepartment(deptId);
    }
  };

  // Define menu items for each role
  const getMenuItems = () => {
    const baseItems = [
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

  return (
    <aside className={`sidebar-container ${collapsed ? 'collapsed' : ''}`}>
      {/* Header with Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-badge">
            <span>WC</span>
          </div>
          {!collapsed && (
            <div className="logo-text">
              <div className="logo-title">White Caves</div>
              <div className="logo-subtitle">Real Estate</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuGroups.map(group => (
          <div key={group.group} className="nav-group">
            {/* Group Header */}
            <button
              className={`group-header ${expandedGroups[group.group] ? 'expanded' : ''}`}
              onClick={() => !collapsed && toggleGroup(group.group)}
              title={collapsed ? group.label : ''}
            >
              <span className="group-label">{group.label}</span>
              {!collapsed && (
                <ChevronRight
                  size={16}
                  className={`group-toggle ${expandedGroups[group.group] ? 'rotated' : ''}`}
                />
              )}
            </button>

            {/* Group Items */}
            {expandedGroups[group.group] && !collapsed && (
              <div className="group-items">
                {group.items.map(item => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                      onClick={() => onTabChange(item.id)}
                      title={item.label}
                    >
                      <IconComponent size={20} className="nav-icon" />
                      <span className="nav-label">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Icon-Only Mode (Collapsed) */}
            {collapsed && (
              <div className="group-items-collapsed">
                {group.items.map(item => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      className={`nav-item-icon ${activeTab === item.id ? 'active' : ''}`}
                      onClick={() => onTabChange(item.id)}
                      title={item.label}
                    >
                      <IconComponent size={24} className="nav-icon-large" />
                      <span className="nav-tooltip">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {/* Departments Section */}
        <div className="nav-group departments-group">
          {/* Departments Header */}
          <button
            className={`group-header departments-header ${expandedGroups.departments ? 'expanded' : ''}`}
            onClick={() => !collapsed && toggleGroup('departments')}
            title={collapsed ? 'Departments' : ''}
          >
            <span className="group-label">Departments</span>
            {!collapsed && (
              <ChevronRight
                size={16}
                className={`group-toggle ${expandedGroups.departments ? 'rotated' : ''}`}
              />
            )}
          </button>

          {/* Departments List */}
          {expandedGroups.departments && !collapsed && (
            <div className="departments-list">
              {Object.entries(DEPARTMENTS).map(([deptId, dept]) => {
                const IconComponent = dept.icon;
                const isExpanded = expandedDepartments[deptId];
                const isSelected = selectedDepartment === deptId;

                return (
                  <div key={deptId} className="department-item">
                    {/* Department Header */}
                    <button
                      className={`department-header ${isExpanded ? 'expanded' : ''} ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleDepartmentSelect(deptId)}
                      style={{
                        '--dept-color': dept.color
                      }}
                      title={dept.label}
                    >
                      <IconComponent size={18} className="dept-icon" />
                      <span className="dept-label">{dept.label}</span>
                      <ChevronRight
                        size={14}
                        className={`dept-toggle ${isExpanded ? 'rotated' : ''}`}
                      />
                    </button>

                    {/* Department Services */}
                    {isExpanded && (
                      <div className="department-services">
                        {dept.services.map((service, idx) => (
                          <button
                            key={idx}
                            className={`service-item ${selectedService === service ? 'active' : ''}`}
                            onClick={() => {
                              dispatch(selectService({ department: deptId, service }));
                              onTabChange(`service-${deptId}-${idx}`);
                            }}
                            title={service}
                          >
                            <span className="service-dot" style={{ backgroundColor: dept.color }}></span>
                            <span className="service-label">{service}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Icon-Only Mode (Collapsed) - Department Icons */}
          {collapsed && (
            <div className="departments-collapsed">
              {Object.entries(DEPARTMENTS).slice(0, 4).map(([deptId, dept]) => {
                const IconComponent = dept.icon;
                const isSelected = selectedDepartment === deptId;

                return (
                  <button
                    key={deptId}
                    className={`dept-icon-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => handleDepartmentSelect(deptId)}
                    title={dept.label}
                    style={{
                      '--dept-color': dept.color
                    }}
                  >
                    <IconComponent size={20} />
                    <span className="nav-tooltip">{dept.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Footer with Collapse Button */}
      <div className="sidebar-footer">
        <button
          className="collapse-toggle"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar (Cmd+B)' : 'Collapse sidebar (Cmd+B)'}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default SidebarContainer;
