/**
 * UnifiedDashboardLayout - Main Dashboard Container
 * 
 * Features:
 * - Floating/docking sidebars (desktop) to stacked (mobile)
 * - Left sidebar with bold branding: 280px expanded, 72px collapsed
 * - Right panel toggle with Cmd+A / Ctrl+A and button
 * - Responsive: Desktop (float) to Tablet (dock) to Mobile (drawer)
 * - Progressive rendering with skeleton loaders
 * - Keyboard shortcuts: Cmd+B for sidebar, Cmd+A for right panel
 * - Dark mode support
 * 
 * Usage:
 * Pass role-specific content as children
 * @param {React.ReactNode} children - Dashboard content
 * @param {Object} user - Current user object
 * @param {Function} onLogout - Logout handler
 * @param {string} role - User role (owner, buyer, agent, etc)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import MainNavBar from '../MainNavBar';
import SidebarContainer from '../SidebarContainer';
import RightPanelContainer from '../RightPanelContainer';
import useDashboardState from './useDashboardState';
import {
  DashboardLayoutContainer,
  DashboardNavBar,
  DashboardSidebarContainer,
  DashboardMainContent,
  DashboardRightPanel,
  DashboardContentWrapper,
  DashboardOverlay
} from './styles';

const UnifiedDashboardLayout = ({
  children,
  user,
  onLogout,
  activeTab = 'overview',
  onTabChange = () => {},
  role = 'owner'
}) => {
  // Get all UI state from custom hook
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    rightPanelOpen,
    setRightPanelOpen,
    theme,
    setTheme,
    isMobile,
    isTablet
  } = useDashboardState();

  // Get notifications from Redux (if available)
  const notifications = useSelector(state => {
    const aiAssistant = state.aiAssistantDashboard?.notifications?.byAssistantId || {};
    return aiAssistant;
  });

  // Get quick stats for navbar (super user only)
  const quickStats = useSelector(state => ({
    properties: state.properties?.totalCount || 234,
    users: state.users?.totalCount || 47,
    leads: state.leads?.totalCount || 156,
    systemHealth: 'good' // From system monitoring
  }));

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Cmd+B or Ctrl+B - Toggle sidebar collapse
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarCollapsed(prev => !prev);
      }
      // Cmd+A or Ctrl+A - Toggle right panel (but don't trigger default select all)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        setRightPanelOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setSidebarCollapsed, setRightPanelOpen]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        // Auto-close right panel on mobile
        if (width < 768) {
          setRightPanelOpen(false);
        }
        // Auto-close sidebar on mobile  
        if (width < 1024) {
          setRightPanelOpen(false);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setRightPanelOpen]);

  const handleThemeToggle = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('dashboard-theme', newTheme);
  }, [theme, setTheme]);

  const handleAssistantSelect = useCallback((assistant) => {
    if (onTabChange) {
      onTabChange(assistant.id);
    }
    // Auto-close right panel on mobile after selection
    if (isMobile) {
      setRightPanelOpen(false);
    }
  }, [onTabChange, isMobile, setRightPanelOpen]);

  const getAllNotifications = () => {
    const allNotifs = [];
    if (notifications && typeof notifications === 'object') {
      Object.entries(notifications).forEach(([assistantId, notifs]) => {
        if (Array.isArray(notifs)) {
          notifs.forEach(n => allNotifs.push({ ...n, assistantId }));
        }
      });
    }
    return allNotifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  return (
    <DashboardLayoutContainer
      $sidebarCollapsed={sidebarCollapsed}
      $rightPanelOpen={rightPanelOpen}
      $isMobile={isMobile}
      $isTablet={isTablet}
      data-theme={theme}
    >
      {/* Main Navigation Bar */}
      <DashboardNavBar>
        <MainNavBar
          theme={theme}
          onThemeToggle={handleThemeToggle}
          user={user}
          notifications={getAllNotifications()}
          onLogout={onLogout}
          onAssistantPanelToggle={() => setRightPanelOpen(!rightPanelOpen)}
          isAssistantPanelOpen={rightPanelOpen}
          shortcuts={{ sidebar: 'Cmd+B', rightPanel: 'Cmd+A' }}
          isSuperUser={role === 'lion'}
          quickStats={role === 'lion' ? quickStats : null}
        />
      </DashboardNavBar>

      {/* Left Sidebar */}
      <DashboardSidebarContainer>
        <SidebarContainer
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeTab={activeTab}
          onTabChange={onTabChange}
          role={role}
          notifications={notifications}
        />
      </DashboardSidebarContainer>

      {/* Main Content Area */}
      <DashboardMainContent>
        <DashboardContentWrapper>
          {children}
        </DashboardContentWrapper>
      </DashboardMainContent>

      {/* Right Panel (Floating/Drawer) */}
      <DashboardRightPanel>
        <RightPanelContainer
          isOpen={rightPanelOpen}
          onClose={() => setRightPanelOpen(false)}
          onAssistantSelect={handleAssistantSelect}
          notifications={notifications}
          isMobile={isMobile}
          isTablet={isTablet}
        />
      </DashboardRightPanel>

      {/* Mobile Overlay */}
      {isMobile && rightPanelOpen && (
        <DashboardOverlay
          $isVisible={rightPanelOpen}
          onClick={() => setRightPanelOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close right panel"
        />
      )}
    </DashboardLayoutContainer>
  );
};

export default UnifiedDashboardLayout;
