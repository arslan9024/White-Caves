import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MainNavBar from '../MainNavBar';
import CrimsonSidebar from '../CrimsonSidebar';
import './DashboardShell.css';

const DashboardShell = ({ 
  children, 
  activeTab,
  onTabChange,
  user,
  onLogout 
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    <div className={`dashboard-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} data-theme={theme}>
      <MainNavBar
        theme={theme}
        onThemeToggle={handleThemeToggle}
        user={user}
        notifications={getAllNotifications()}
        onLogout={onLogout}
      />

      <CrimsonSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
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
