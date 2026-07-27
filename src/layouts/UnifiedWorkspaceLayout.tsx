import React, { ReactNode, useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import MobileBottomNav from '../components/layout/MobileBottomNav/MobileBottomNav';
import MobileMenuDrawer from '../components/layout/MobileMenuDrawer/MobileMenuDrawer';
import TopNavbar from '../components/navigation/TopNavbar';
import { useWorkspace } from '../context/WorkspaceContext';
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

  const { activeUser, effectiveAccessLevel, isMaster } = useWorkspace();

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

  const handleTabChange = (tabId: string) => {
    if (tabId === 'home') navigate('/crm');
    else if (tabId === 'analytics') navigate('/crm/leaderboard');
    else if (tabId === 'messages') navigate('/crm/communications');
    else if (tabId === 'ai') navigate('/crm/ai-command');
  };

  // Hide left sidebar if external client level 1 is active
  const showSidebar = effectiveAccessLevel > 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw' }}>
      {/* Universal Top Navigation Header (Global across public & private) */}
      <TopNavbar />

      <div className="unified-workspace" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Fixed Left Sidebar (Dynamic RBAC display) */}
        {showSidebar && (
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
        )}

        {/* Main Content Area */}
        <div className="workspace-content-wrapper">
          {/* Sub Header / Status Strip */}
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
              {!isOnline && (
                <div
                  className="offline-status-indicator"
                  style={{
                    color: '#EF4444',
                    border: '1px solid #EF4444',
                    background: 'rgba(239, 68, 68, 0.1)',
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
                    {activeUser?.name || user?.displayName || user?.name || 'User'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--wc-text-secondary)' }}>
                    {activeUser?.roleTitle || 'Agent'}
                    {isMaster && effectiveAccessLevel === 5 && (
                      <span
                        className="master-badge"
                        style={{ marginLeft: '6px', color: '#FFFFFF', background: '#EF4444' }}
                      >
                        LEVEL 5 MASTER
                      </span>
                    )}
                  </div>
                </div>
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
          <MobileBottomNav onMenuOpen={() => setIsDrawerOpen(true)} />

          {/* Mobile Slide-out Menu Drawer */}
          <MobileMenuDrawer
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onTabChange={handleTabChange}
          />
        </div>
      </div>
    </div>
  );
};
