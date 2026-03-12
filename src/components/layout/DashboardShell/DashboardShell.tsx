import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MainNavBar from '../MainNavBar';
// @ts-ignore - CrimsonSidebarEnhanced is a .jsx file pending conversion
import CrimsonSidebarEnhanced from '../CrimsonSidebar/CrimsonSidebarEnhanced';
// @ts-ignore - AIAssistantsPanel resolved via barrel export
import AIAssistantsPanel from '../AIAssistantsPanel';
import {
  DashboardShellContainer,
  DashboardMain,
  DashboardContent,
  MobileOverlay
} from './styles';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UserProp {
  displayName?: string;
  email?: string;
  photoURL?: string;
}

interface AssistantInfo {
  id: string;
  name: string;
  [key: string]: any;
}

interface Notification {
  isRead: boolean;
  timestamp: string;
  assistantId?: string;
  [key: string]: any;
}

interface NotificationsByAssistant {
  [assistantId: string]: Notification[];
}

interface DashboardShellProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  user?: UserProp | null;
  onLogout?: () => void;
}

interface RootState {
  aiAssistantDashboard?: {
    notifications?: {
      byAssistantId?: NotificationsByAssistant;
    };
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const DashboardShell: React.FC<DashboardShellProps> = ({ 
  children, 
  activeTab,
  onTabChange,
  user,
  onLogout 
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [rightPanelOpen, setRightPanelOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>(() => {
    return document.documentElement.getAttribute('data-theme') || 'light';
  });

  const notifications = useSelector((state: RootState) => 
    state.aiAssistantDashboard?.notifications?.byAssistantId || {}
  );

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarCollapsed(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        setRightPanelOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth < 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleThemeToggle = (): void => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleAssistantSelect = (assistant: AssistantInfo): void => {
    if (onTabChange) {
      onTabChange(assistant.id);
    }
    setRightPanelOpen(false);
  };

  const getAllNotifications = (): (Notification & { assistantId: string })[] => {
    const allNotifs: (Notification & { assistantId: string })[] = [];
    Object.entries(notifications).forEach(([assistantId, notifs]) => {
      if (Array.isArray(notifs)) {
        notifs.forEach((n: Notification) => allNotifs.push({ ...n, assistantId }));
      }
    });
    return allNotifs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  return (
    <DashboardShellContainer
      $sidebarCollapsed={sidebarCollapsed}
      $rightPanelOpen={rightPanelOpen}
      data-theme={theme}
    >
      <MainNavBar
        theme={theme}
        onThemeToggle={handleThemeToggle}
        user={user}
        notifications={getAllNotifications()}
        onLogout={onLogout}
        onAssistantPanelToggle={() => setRightPanelOpen(!rightPanelOpen)}
        isAssistantPanelOpen={rightPanelOpen}
      />

      <CrimsonSidebarEnhanced
        activeTab={activeTab}
        onTabChange={onTabChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        notifications={notifications}
      />

      <AIAssistantsPanel
        isOpen={rightPanelOpen}
        onClose={() => setRightPanelOpen(false)}
        onAssistantSelect={handleAssistantSelect}
        notifications={notifications}
      />

      {mobileMenuOpen && (
        <MobileOverlay onClick={() => setMobileMenuOpen(false)} />
      )}

      <DashboardMain
        $sidebarCollapsed={sidebarCollapsed}
        $rightPanelOpen={rightPanelOpen}
      >
        <DashboardContent>
          {children}
        </DashboardContent>
      </DashboardMain>
    </DashboardShellContainer>
  );
};

export default DashboardShell;
