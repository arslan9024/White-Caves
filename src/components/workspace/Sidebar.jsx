import React, { useMemo, useCallback } from 'react';
import { useAuthContext } from './contexts/AuthContext';
import { useActiveView, VIEW_KEYS } from './contexts/ActiveViewContext';
import { DEPARTMENTS } from '../../data/departments';

/**
 * Sidebar.jsx — Clearance-Aware CRM Navigation
 *
 * Access rules:
 * - Universal (all authenticated):  Dashboard, Leads Kanban, My Deals, Live Leaderboard
 * - Restricted (CL ≥ 3 or DEPT_ADMIN_CRM): Compliance Library, Commission Ledgers, AI Command Center
 *
 * Every item dispatches setActiveView — zero router usage.
 */

// ─── Navigation Item Definitions ────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: 'Operations',
    items: [
      {
        key: VIEW_KEYS.DASHBOARD,
        icon: '📊',
        label: 'Personal Dashboard',
        minClearance: 0,
      },
      {
        key: VIEW_KEYS.LEADS,
        icon: '🎯',
        label: 'Leads Kanban',
        minClearance: 0,
      },
      {
        key: VIEW_KEYS.DEALS,
        icon: '🤝',
        label: 'My Deals',
        minClearance: 0,
      },
      {
        key: VIEW_KEYS.LEADERBOARD,
        icon: '🏆',
        label: 'Live Leaderboard',
        minClearance: 0,
      },
    ],
  },
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
                key={item.key}
                className={`ws-sidebar-item ${activeView === item.key ? 'active' : ''}`}
                onClick={() => handleItemClick(item.key)}
                title={item.label}
              >
                <span className="ws-sidebar-item-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ws-sidebar-item-badge">{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        ))}
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
