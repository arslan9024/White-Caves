import React from 'react';
import { useAuthContext } from './contexts/AuthContext';
import { useActiveView, VIEW_KEYS } from './contexts/ActiveViewContext';
import { DEPARTMENTS } from '../../data/departments';

/**
 * Sidebar.jsx — Clearance-Aware CRM Navigation
 * STAGE 2 (AEGIS): Expanded to 10 Departments with Red/White theme accents
 *
 * Access rules:
 * - Dashboard visible to all authenticated users
 * - Departments filtered by clearance_level OR managing_director role
 */

export default function Sidebar() {
  const { user, logout } = useAuthContext();
  const { activeView, setActiveView } = useActiveView();

  const userClearance = user?.accessLevel || user?.clearance_level || 0;

  return (
    <aside className="ws-sidebar">
      {/* Brand Logo */}
      <div className="ws-sidebar-brand">
        <div className="ws-sidebar-logo">WC</div>
        <span>White Caves</span>
      </div>

      <nav className="ws-sidebar-nav">
        {/* Dashboard — always visible */}
        <button
          className={`ws-nav-item ${activeView === VIEW_KEYS.DASHBOARD ? 'ws-nav-active' : ''}`}
          onClick={() => setActiveView(VIEW_KEYS.DASHBOARD)}
        >
          <span className="ws-nav-icon">📊</span>
          <span className="ws-nav-label">Dashboard</span>
        </button>

        <div className="ws-nav-divider" />
        <div className="ws-sidebar-section">Departments</div>

        {/* Dynamic Departments filtered by clearance */}
        {DEPARTMENTS.filter(
          dept => userClearance >= dept.clearanceLevel || user?.role === 'managing_director'
        ).map(dept => {
          const viewKey = VIEW_KEYS[dept.id.toUpperCase()];
          const isActive = activeView === viewKey;
          return (
            <button
              key={dept.id}
              className={`ws-nav-item ${isActive ? 'ws-nav-active' : ''}`}
              onClick={() => setActiveView(viewKey)}
            >
              <span className="ws-nav-icon">
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: dept.accentColor,
                  }}
                />
              </span>
              <span className="ws-nav-label">{dept.name}</span>
            </button>
          );
        })}
      </nav>

      {/* User Card + Logout */}
      <div className="ws-sidebar-user">
        <div className="ws-sidebar-user-card">
          <div className="ws-sidebar-avatar">
            {user?.avatar_initials || 'U'}
          </div>
          <div className="ws-sidebar-user-info">
            <div className="ws-sidebar-user-name">{user?.name}</div>
            <div className="ws-sidebar-user-role">{user?.department_label}</div>
          </div>
          <div className="ws-sidebar-clearance">
            CL{user?.clearance_level}
          </div>
        </div>
        <button className="ws-sidebar-logout" onClick={logout}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
