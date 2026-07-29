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

const ORDERED_DEPARTMENTS = [
  { id: 'sales', num: '01', name: 'Sales & Secondary Market', icon: '💰', path: '/crm/sales' },
  { id: 'operations', num: '02', name: 'Operations & Facility Mgmt', icon: '⚙️', path: '/crm/operations' },
  { id: 'communications', num: '03', name: 'Communications & Client Care', icon: '📞', path: '/crm/communications' },
  { id: 'finance', num: '04', name: 'Finance & Accounting', icon: '📊', path: '/crm/finance' },
  { id: 'marketing', num: '05', name: 'Marketing & Growth', icon: '🎯', path: '/crm/marketing' },
  { id: 'executive', num: '06', name: 'Executive Council', icon: '👔', path: '/crm/executive' },
  { id: 'compliance', num: '07', name: 'Compliance & Regulatory', icon: '⚖️', path: '/crm/compliance' },
  { id: 'technology', num: '08', name: 'Technology & Engineering', icon: '💻', path: '/crm/technology' },
  { id: 'legal', num: '09', name: 'Legal & Documentation', icon: '📜', path: '/crm/legal' },
  { id: 'intelligence', num: '10', name: 'AI & Data Intelligence', icon: '🧠', path: '/crm/intelligence' },
  { id: 'leasing', num: '11', name: 'Leasing & Tenancy', icon: '🏠', path: '/crm/leasing' },
  { id: 'maintenance', num: '12', name: 'Maintenance & Facilities', icon: '🔧', path: '/crm/maintenance' },
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

  const showSidebar = effectiveAccessLevel > 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', background: '#F8FAFC' }}>
      {/* Universal Top Navigation Header (Global across public & private) */}
      <TopNavbar />

      <div className="unified-workspace" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Fixed Left Sidebar (Dynamic RBAC display) */}
        {showSidebar && (
          <aside className="unified-sidebar" style={{ background: '#FFFFFF', borderRight: '2px solid rgba(239, 68, 68, 0.2)', overflowY: 'auto', zIndex: 100, position: 'relative' }}>
            <nav className="sidebar-nav" style={{ padding: '12px' }}>
              <div className="sidebar-section-title" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EF4444', margin: '6px 0 6px 8px', letterSpacing: '0.5px' }}>
                🔴 12 DEPARTMENTS — 1-12-108 PROTOCOL
              </div>
              {ORDERED_DEPARTMENTS.map(dept => (
                <Link
                  key={dept.id}
                  to={dept.path}
                  className={`sidebar-link ${location.pathname.startsWith(dept.path) ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: location.pathname.startsWith(dept.path) ? 700 : 500,
                    color: location.pathname.startsWith(dept.path) ? '#EF4444' : '#475569',
                    background: location.pathname.startsWith(dept.path) ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                    marginBottom: '2px',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', width: '18px' }}>{dept.num}</span>
                  <span>{dept.icon}</span>
                  <span>{dept.name}</span>
                </Link>
              ))}

              <div className="sidebar-section-title" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', margin: '16px 0 6px 8px', letterSpacing: '0.5px' }}>
                EXECUTIVE DECK
              </div>
              <Link
                to="/crm/leaderboard"
                className={`sidebar-link ${location.pathname === '/crm/leaderboard' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem', color: '#1E293B', fontWeight: 600 }}
              >
                <span>🏆</span>
                <span>Dual Leaderboards</span>
              </Link>
            </nav>
          </aside>
        )}

        {/* Main Content Area */}
        <div className="workspace-content-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Sub Header / Status Strip */}
          <header className="workspace-header" style={{ padding: '12px 24px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => navigate('/crm')}
                style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                ← Return to Dashboard
              </button>
              <div className="header-breadcrumbs" style={{ fontSize: '0.85rem', color: '#64748B' }}>
                <span>White Caves</span>
                <span style={{ margin: '0 6px' }}>/</span>
                <span className="breadcrumb-active" style={{ color: '#1E293B', fontWeight: 700 }}>
                  {location.pathname.split('/').pop()?.toUpperCase() || 'DASHBOARD'}
                </span>
              </div>
            </div>
            <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {!isOnline && (
                <div style={{ color: '#EF4444', border: '1px solid #EF4444', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                  ⚠️ OFFLINE
                </div>
              )}
              <button className="ai-command-shortcut" onClick={() => navigate('/crm/ai-command')} style={{ background: '#1E293B', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                ⌘K Ask Zoe
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>
                    {activeUser?.name || user?.displayName || user?.name || 'Arslan Malik'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    {activeUser?.roleTitle || 'Managing Director'}
                    {isMaster && effectiveAccessLevel === 5 && (
                      <span style={{ marginLeft: '6px', color: '#FFFFFF', background: '#EF4444', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800 }}>
                        LEVEL 5 MASTER
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={handleLogout} title="Log Out" style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.875rem' }}>
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Viewport for Routes */}
          <main className="workspace-viewport" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>{children}</main>

          {/* Persistent Core System Banner */}
          <div
            style={{
              backgroundColor: '#1E293B',
              borderTop: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#94A3B8',
              fontSize: '0.75rem',
              padding: '6px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 600,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span>🟢 [ONLINE CORE OPERATIONAL] — Dubai Real Estate Management Engine v2026.05</span>
              <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                💱 LIVE FX: 1 AED = 0.27 USD | 0.25 EUR | 0.22 GBP
              </span>
            </div>
            <span>RERA Index: Active | UAE VAT: 5% Fixed | Clearance: Level 5 Master</span>
          </div>

          <MobileBottomNav onMenuOpen={() => setIsDrawerOpen(true)} />
          <MobileMenuDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} onTabChange={handleTabChange} />
        </div>
      </div>
    </div>
  );
};
