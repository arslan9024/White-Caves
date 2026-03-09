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
import { useSelector } from 'react-redux';
import {
  ChevronLeft, Home, BarChart3, Users2, MessageSquare, Settings,
  Zap, TrendingUp, Command, ChevronRight, Shield, AlertCircle, Activity
} from 'lucide-react';
import './SidebarContainer.css';

const SidebarContainer = ({
  collapsed = false,
  onToggleCollapse = () => {},
  activeTab = 'overview',
  onTabChange = () => {},
  role = 'owner'
}) => {
  const [expandedGroups, setExpandedGroups] = useState({
    dashboard: true,
    management: true,
    analytics: false,
    admin: false
  });

  // Get user role from Redux for super user detection
  const userRole = useSelector(state => state.auth?.role || 'user');
  const isSuperUser = userRole === 'lion' || useSelector(state => state.auth?.isSuperUser);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
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
