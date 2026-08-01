import React, { FC, useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Search, Bell, Shield, User as UserIcon, LogOut, Home, LayoutDashboard } from 'lucide-react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Personnel } from '../../types/companyCore';
import './TopNavbar.css';

export const TopNavbar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    activeUser,
    impersonatedUser,
    setImpersonatedUser,
    clearImpersonation,
    isMaster,
    personnel
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleImpersonationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      clearImpersonation();
      return;
    }
    const found = personnel.find(p => p.id === selectedId);
    if (found) {
      setImpersonatedUser(found);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="top-navbar-container" data-testid="top-navbar" role="banner" aria-label="Global Header Navigation">
      <div className="top-navbar-left">
        <Link to="/" className="top-navbar-brand" aria-label="White Caves Real Estate Home">
          <div className="top-navbar-logo-badge">WC</div>
          <div className="top-navbar-title">
            White <span>Caves</span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="top-navbar-search" role="search" aria-label="Global Search">
          <Search size={15} className="top-navbar-search-icon" aria-hidden="true" />
          <input
            ref={searchInputRef}
            id="global-search-input"
            type="text"
            className="top-navbar-search-input"
            placeholder="Global Search (Ctrl+K to focus)..."
            aria-label="Global Search Property or Lead Input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* DLD / RERA Realtime Ticker */}
        <div className="top-navbar-ticker">
          <span className="ticker-dot"></span>
          <span><strong>RERA Live:</strong> Dubai Land Dept 2026 API Connected</span>
        </div>
      </div>

      <div className="top-navbar-right">
        {/* Navigation Quick Links */}
        <Link to="/" className="nav-link-btn" title="Homepage View">
          Home
        </Link>
        <Link to="/crm" className="nav-link-btn" title="CRM Dashboard">
          Dashboard
        </Link>
        <Link to="/profile" className="nav-link-btn" title="Profile & Security">
          Profile
        </Link>

        {/* Managing Director Ghost Impersonation Dropdown (Level 5 Master Exclusive) */}
        {isMaster && (
          <div className="impersonation-panel" data-testid="md-impersonation-panel">
            <select
              className="impersonation-select"
              value={impersonatedUser?.id || ''}
              onChange={handleImpersonationChange}
              title="MD Ghost Session Impersonation Matrix"
            >
              <option value="">🎭 Impersonate User Mode</option>
              <optgroup label="Core Leadership">
                {personnel.filter(p => p.accessLevel >= 4).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.roleTitle} - Level {p.accessLevel})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Sales & Leasing Brokers">
                {personnel.filter(p => p.accessLevel === 2 || p.accessLevel === 3).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.roleTitle} - Level {p.accessLevel})
                  </option>
                ))}
              </optgroup>
              <optgroup label="External Portals">
                {personnel.filter(p => p.accessLevel === 1).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.roleTitle} - External)
                  </option>
                ))}
              </optgroup>
            </select>

            {impersonatedUser && (
              <div className="impersonation-badge-active">
                <span>VIEWING AS: {impersonatedUser.name.split(' ')[0]} (L{impersonatedUser.accessLevel})</span>
                <button
                  onClick={clearImpersonation}
                  className="clear-impersonation-btn"
                  title="Reset to Master Mode"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}

        {/* Notification Indicator */}
        <button
          className="nav-link-btn"
          style={{ padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center' }}
          onClick={() => navigate('/crm/communications')}
          title="Notifications & WhatsApp Queue"
        >
          <Bell size={18} color="#EF4444" />
        </button>

        {/* Active User Avatar */}
        <button
          className="top-navbar-profile-btn"
          onClick={() => navigate('/profile')}
          title={`${activeUser?.name} (${activeUser?.roleTitle})`}
        >
          {activeUser?.avatarUrl ? (
            <img
              src={activeUser.avatarUrl}
              alt={activeUser.name}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            activeUser?.name?.charAt(0) || 'U'
          )}
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
