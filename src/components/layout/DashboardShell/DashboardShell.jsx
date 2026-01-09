import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DashboardHeader from '../../dashboard/DashboardHeader';
import CrimsonSidebar from '../CrimsonSidebar';
import { toggleMobileMenu, closeMobileMenu } from '../../../store/navigationSlice';
import './DashboardShell.css';

const DashboardShell = ({ 
  children, 
  activeTab,
  onTabChange,
  user,
  onLogout 
}) => {
  const dispatch = useDispatch();
  const sidebarWidth = useSelector(state => state.navigation?.sidebarWidth || 40);
  const mobileMenuOpen = useSelector(state => state.navigation?.mobileMenuOpen || false);
  const theme = useSelector(state => state.navigation?.theme || 'light');

  const notifications = useSelector(state => 
    state.aiAssistantDashboard?.notifications?.byAssistantId || {}
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        dispatch(closeMobileMenu());
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const handleMenuToggle = () => {
    dispatch(toggleMobileMenu());
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
    <div className="dashboard-shell" data-theme={theme}>
      <DashboardHeader
        activeTab={activeTab}
        onTabChange={onTabChange}
        onMenuToggle={handleMenuToggle}
        user={user}
        notifications={getAllNotifications()}
        onLogout={onLogout}
      />

      <CrimsonSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        notifications={notifications}
        user={user}
      />

      {mobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => dispatch(closeMobileMenu())}
        />
      )}

      <main 
        className="dashboard-main"
        style={{ marginLeft: `${sidebarWidth}%` }}
      >
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardShell;
