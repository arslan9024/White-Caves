import React, { FC, ReactNode } from 'react';
import './DashboardShell.css';

interface DashboardShellProps {
  sidebar: ReactNode;
  topbar: ReactNode;
  children: ReactNode;
  rightPanel?: ReactNode;
  isSidebarCollapsed?: boolean;
}

const DashboardShell: FC<DashboardShellProps> = ({
  sidebar,
  topbar,
  children,
  rightPanel,
  isSidebarCollapsed = false,
}) => {
  return (
    <div className="dashboard-shell-v2">
      <header className="dashboard-shell-v2__topbar">{topbar}</header>
      <div className="dashboard-shell-v2__body">
        <aside
          className={`dashboard-shell-v2__sidebar ${isSidebarCollapsed ? 'dashboard-shell-v2__sidebar--collapsed' : ''}`}
          aria-label="Dashboard navigation"
        >
          {sidebar}
        </aside>
        <main className="dashboard-shell-v2__content">{children}</main>
        {rightPanel && <aside className="dashboard-shell-v2__right">{rightPanel}</aside>}
      </div>
    </div>
  );
};

export default DashboardShell;
