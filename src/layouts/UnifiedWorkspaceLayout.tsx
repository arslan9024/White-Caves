import React, { ReactNode } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import './DashboardComponents.css';

interface LayoutProps {
  children: ReactNode;
}

const DEPARTMENTS = [
  { id: 'sales', name: 'Sales', icon: '💰', path: '/crm/sales' },
  { id: 'operations', name: 'Operations', icon: '⚙️', path: '/crm/operations' },
  { id: 'communications', name: 'Communications', icon: '📞', path: '/crm/communications' },
  { id: 'finance', name: 'Finance', icon: '📊', path: '/crm/finance' },
  { id: 'marketing', name: 'Marketing', icon: '🎯', path: '/crm/marketing' },
  { id: 'executive', name: 'Executive', icon: '👔', path: '/crm/executive' },
  { id: 'compliance', name: 'Compliance', icon: '⚖️', path: '/crm/compliance' },
  { id: 'technology', name: 'Technology', icon: '💻', path: '/crm/technology' },
  { id: 'legal', name: 'Legal', icon: '📜', path: '/crm/legal' },
  { id: 'intelligence', name: 'Intelligence', icon: '🧠', path: '/crm/intelligence' },
];

export const UnifiedWorkspaceLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);

  const isMaster = user?.accessLevel === 5;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };

  return (
    <div className="unified-workspace">
      {/* Fixed Left Sidebar */}
      <aside className="unified-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">WC</div>
          <div className="sidebar-title">White Caves</div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Core Departments</div>
          {DEPARTMENTS.map(dept => (
            <Link
              key={dept.id}
              to={dept.path}
              className={`sidebar-link ${location.pathname.startsWith(dept.path) ? 'active' : ''}`}
            >
              <span className="sidebar-icon">{dept.icon}</span>
              <span>{dept.name}</span>
            </Link>
          ))}

          <div className="sidebar-section-title">Operations & Growth</div>
          <Link
            to="/crm/pipeline"
            className={`sidebar-link ${location.pathname === '/crm/pipeline' ? 'active' : ''}`}
          >
            <span className="sidebar-icon">🚥</span>
            <span>Service Pipeline</span>
          </Link>
          <Link
            to="/crm/ledger"
            className={`sidebar-link ${location.pathname === '/crm/ledger' ? 'active' : ''}`}
          >
            <span className="sidebar-icon">🧾</span>
            <span>Financial Ledger</span>
          </Link>
          <Link
            to="/crm/leaderboard"
            className={`sidebar-link ${location.pathname === '/crm/leaderboard' ? 'active' : ''}`}
          >
            <span className="sidebar-icon">🏆</span>
            <span>Leaderboard</span>
          </Link>

          <div className="sidebar-section-title">Artificial Intelligence</div>
          <Link
            to="/crm/ai-command"
            className={`sidebar-link ${location.pathname === '/crm/ai-command' ? 'active' : ''}`}
          >
            <span className="sidebar-icon">🤖</span>
            <span>AI Command Center</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="workspace-content-wrapper">
        {/* Contextual Top Header */}
        <header className="workspace-header">
          <div className="header-left">
            <div className="header-breadcrumbs">
              <span>White Caves</span>
              <span>/</span>
              <span className="breadcrumb-active">
                {location.pathname.split('/').pop()?.toUpperCase() || 'DASHBOARD'}
              </span>
            </div>
          </div>
          <div className="header-right">
            <button className="ai-command-shortcut" onClick={() => navigate('/crm/ai-command')}>
              ⌘K Ask Zoe
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                  {user?.displayName || user?.name || 'User'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--wc-text-secondary)' }}>
                  {user?.role || 'Agent'}
                  {isMaster && <span className="master-badge">LVL 5</span>}
                </div>
              </div>
              <button className="user-profile-btn" onClick={handleLogout} title="Log Out">
                {user?.displayName?.charAt(0) || user?.name?.charAt(0) || 'U'}
              </button>
            </div>
          </div>
        </header>

        {/* Viewport for Routes */}
        <main className="workspace-viewport">{children}</main>
      </div>
    </div>
  );
};
