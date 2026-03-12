import React, { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import MainNavBar from '../MainNavBar';
import SidebarContainer from '../SidebarContainer';
import RightPanelContainer from '../RightPanelContainer';
import useDashboardState from './useDashboardState';
import type { RootState } from '../../../store/store';
import {
  DashboardLayoutContainer,
  DashboardNavBar,
  DashboardSidebarContainer,
  DashboardMainContent,
  DashboardRightPanel,
  DashboardContentWrapper,
  DashboardOverlay
} from './styles';

interface NotificationItem {
  isRead?: boolean;
  timestamp?: string;
  [key: string]: unknown;
}

interface AssistantInfo {
  id: string;
  [key: string]: unknown;
}

interface UserInfo {
  displayName?: string;
  email?: string;
  photoURL?: string;
  [key: string]: unknown;
}

interface UnifiedDashboardLayoutProps {
  children: ReactNode;
  user?: UserInfo;
  onLogout?: () => void;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  role?: string;
}

const UnifiedDashboardLayout: React.FC<UnifiedDashboardLayoutProps> = ({
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
  const notifications = useSelector((state: RootState) => {
    const aiAssistant = (state as any).aiAssistantDashboard?.notifications?.byAssistantId || {};
    return aiAssistant as Record<string, NotificationItem[]>;
  });

  // Get quick stats for navbar (super user only)
  const quickStats = useSelector((state: RootState) => ({
    properties: (state as any).properties?.totalCount || 234,
    users: (state as any).users?.totalCount || 47,
    leads: (state as any).leads?.totalCount || 156,
    systemHealth: 'good' as const
  }));

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarCollapsed((prev: boolean) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        setRightPanelOpen((prev: boolean) => !prev);
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
        if (width < 768) {
          setRightPanelOpen(false);
        }
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

  const handleAssistantSelect = useCallback((assistant: AssistantInfo) => {
    if (onTabChange) {
      onTabChange(assistant.id);
    }
    if (isMobile) {
      setRightPanelOpen(false);
    }
  }, [onTabChange, isMobile, setRightPanelOpen]);

  const getAllNotifications = (): (NotificationItem & { assistantId: string })[] => {
    const allNotifs: (NotificationItem & { assistantId: string })[] = [];
    if (notifications && typeof notifications === 'object') {
      Object.entries(notifications).forEach(([assistantId, notifs]) => {
        if (Array.isArray(notifs)) {
          notifs.forEach(n => allNotifs.push({ ...n, assistantId }));
        }
      });
    }
    return allNotifs.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
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
