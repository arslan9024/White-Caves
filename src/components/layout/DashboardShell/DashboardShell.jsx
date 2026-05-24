import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import DashboardAppLayout from '../AppLayout/AppLayout';
import './DashboardShell.css';

const DashboardShell = ({ 
  children, 
  activeTab,
  onTabChange,
  user,
  onLogout 
}) => {
  const theme = useSelector(state => state.navigation?.theme || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="dashboard-shell" data-theme={theme}>
      <DashboardAppLayout 
        user={user}
        onLogout={onLogout}
      >
        {children}
      </DashboardAppLayout>
    </div>
  );
};

export default DashboardShell;
