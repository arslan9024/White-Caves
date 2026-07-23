import React, { ReactNode, useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import MobileBottomNav from '../components/layout/MobileBottomNav/MobileBottomNav';
import MobileMenuDrawer from '../components/layout/MobileMenuDrawer/MobileMenuDrawer';
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

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/crm/leaderboard')) return 'analytics';
    if (path.includes('/crm/communications')) return 'messages';
    if (path.includes('/crm/ai-command')) return 'ai';
    return 'home';
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === 'home') navigate('/crm');
    else if (tabId === 'analytics') navigate('/crm/leaderboard');
    else if (tabId === 'messages') navigate('/crm/communications');
    else if (tabId === 'ai') navigate('/crm/ai-command');
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
            <div className="global-search-wrapper" style={{ marginLeft: '32px' }}>
              <input
                type="text"
                placeholder="Global Search (Properties, Leads, Form 7...)"
                className="global-search-input"
                style={{
                  background: 'var(--wc-surface-card)',
                  border: '1px solid var(--wc-border)',
                  color: 'var(--wc-text-primary)',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  width: '300px',
                  fontSize: '0.875rem',
                }}
              />
            </div>
          </div>
          <div className="header-right">
            {/* Gold-accented Local Offline Status Indicator */}
            {!isOnline && (
              <div
                className="offline-status-indicator"
                style={{
                  color: 'var(--wc-gold-metallic)',
                  border: '1px solid var(--wc-gold-metallic)',
                  background: 'rgba(201, 168, 76, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                ⚠️ OFFLINE
              </div>
            )}
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
                  {isMaster && (
                    <span
                      className="master-badge"
                      style={{ marginLeft: '6px', color: 'var(--wc-gold-metallic)' }}
                    >
                      LION LVL 5
                    </span>
                  )}
                </div>
              </div>
              <button
                className="user-profile-btn"
                onClick={() => navigate('/profile')}
                title="Profile Settings"
                style={{
                  background: 'var(--wc-surface-card)',
                  border: '1px solid var(--wc-gold-metallic)',
                  color: 'var(--wc-gold-metallic)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
              >
                {user?.displayName?.charAt(0) || user?.name?.charAt(0) || 'U'}
              </button>
              <button
                onClick={handleLogout}
                title="Log Out"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--wc-text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Viewport for Routes */}
        <main className="workspace-viewport">{children}</main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav
          activeTab={getActiveTab()}
          onTabChange={handleTabChange}
          onMenuOpen={() => setIsDrawerOpen(true)}
        />

        {/* Mobile Slide-out Menu Drawer */}
        <MobileMenuDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onTabChange={handleTabChange}
        />
      </div>
    </div>
  );
};
