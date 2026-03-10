import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MainNavBar from '../MainNavBar';
import CrimsonSidebarEnhanced from '../CrimsonSidebar/CrimsonSidebarEnhanced';
import AIAssistantsPanel from '../AIAssistantsPanel/AIAssistantsPanel';
import {
  DashboardShellContainer,
  DashboardMain,
  DashboardContent,
  MobileOverlay
} from './styles';

const DashboardShell = ({ 
  children, 
  activeTab,
  onTabChange,
  user,
  onLogout 
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || 'light';
  });

  const notifications = useSelector(state => 
    state.aiAssistantDashboard?.notifications?.byAssistantId || {}
  );

  useEffect(() => {
    const handleKeyPress = (e) => {
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

  const handleAssistantSelect = (assistant) => {
    if (onTabChange) {
      onTabChange(assistant.id);
    }
    setRightPanelOpen(false);
  };

  const getAllNotifications = () => {
    const allNotifs = [];
    Object.entries(notifications).forEach(([assistantId, notifs]) => {
      if (Array.isArray(notifs)) {
        notifs.forEach(n => allNotifs.push({ ...n, assistantId }));
      }
    });
    return allNotifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
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
