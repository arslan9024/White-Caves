import React, { useState, useEffect, type ReactNode } from 'react';
import { useSelector } from 'react-redux';
import MainNavBar from '../MainNavBar';
import CrimsonSidebarEnhanced from '../CrimsonSidebar/CrimsonSidebarEnhanced';
import AIAssistantsPanel from '../AIAssistantsPanel/AIAssistantsPanel';
import type { RootState } from '../../../store/store';
import './DashboardShell.css';

interface NotificationItem {
  isRead?: boolean;
  timestamp?: string;
  [key: string]: unknown;
}

interface UserInfo {
  displayName?: string;
  email?: string;
  photoURL?: string;
  [key: string]: unknown;
}

interface AssistantInfo {
  id: string;
  [key: string]: unknown;
}

interface DashboardShellProps {
  children: ReactNode;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  user?: UserInfo;
  onLogout?: () => void;
}

const DashboardShell: React.FC<DashboardShellProps> = ({ 
  children, 
  activeTab,
  onTabChange,
  user,
  onLogout 
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
  });

  const notifications = useSelector((state: RootState) => 
    (state as any).aiAssistantDashboard?.notifications?.byAssistantId || {}
  ) as Record<string, NotificationItem[]>;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
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
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleAssistantSelect = (assistant: AssistantInfo) => {
    if (onTabChange) {
      onTabChange(assistant.id);
    }
    setRightPanelOpen(false);
  };

  const getAllNotifications = (): (NotificationItem & { assistantId: string })[] => {
    const allNotifs: (NotificationItem & { assistantId: string })[] = [];
    Object.entries(notifications).forEach(([assistantId, notifs]) => {
      if (Array.isArray(notifs)) {
        notifs.forEach(n => allNotifs.push({ ...n, assistantId }));
      }
    });
    return allNotifs.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
  };

  return (
    <div className={`dashboard-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${rightPanelOpen ? 'right-panel-open' : ''}`} data-theme={theme}>
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
        activeTab={activeTab || ''}
        onTabChange={onTabChange || (() => {})}
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
        <div 
          className="mobile-overlay" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className="dashboard-main">
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardShell;
