/**
 * TopNavbar.tsx — View Layer (Atomic 3-Folder Pattern)
 *
 * Pure render shell — all business logic delegated to useTopNavbarLogic().
 * Styles delegated to TopNavbar.css.
 */

import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { useTopNavbarLogic } from './TopNavbar.logic';
import { useProfileScheduler } from '../../hooks/useProfileScheduler';
import './TopNavbar.css';

// ─── Component ────────────────────────────────────────────────────────────────

export const TopNavbar: FC = () => {
  const scheduler = useProfileScheduler();
  const {
    searchQuery,
    searchInputRef,
    handleSearchChange,
    handleSearchSubmit,
    handleImpersonationChange,
    handleNotificationsClick,
    handleProfileClick,
    activeUser,
    impersonatedUser,
    isMaster,
    personnel,
    clearImpersonation,
  } = useTopNavbarLogic();

  return (
    <header
      className="top-navbar-container"
      data-testid="top-navbar"
      role="banner"
      aria-label="Global Header Navigation"
    >
      {/* ── Left Section ────────────────────────────────────── */}
      <div className="top-navbar-left">
        <Link to="/" className="top-navbar-brand" aria-label="White Caves Real Estate Home">
          <div className="top-navbar-logo-badge">WC</div>
          <div className="top-navbar-title">
            White <span>Caves</span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="top-navbar-search"
          role="search"
          aria-label="Global Search"
        >
          <Search size={15} className="top-navbar-search-icon" aria-hidden="true" />
          <input
            ref={searchInputRef}
            id="global-search-input"
            type="text"
            className="top-navbar-search-input"
            placeholder="Global Search (Ctrl+K to focus)..."
            aria-label="Global Search Property or Lead Input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </form>

        {/* DLD / RERA Realtime Ticker & Credential Expiry Banner */}
        <div className={`top-navbar-ticker ${scheduler.highestSeverity !== 'CLEAR' ? 'ticker-alert-active' : ''}`} style={scheduler.highestSeverity !== 'CLEAR' ? { backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid #EF4444', color: '#EF4444', fontWeight: 'bold' } : {}}>
          <span className={`ticker-dot ${scheduler.highestSeverity !== 'CLEAR' ? 'ticker-dot-pulse' : ''}`} style={scheduler.highestSeverity !== 'CLEAR' ? { backgroundColor: '#EF4444' } : {}} />
          <span>
            {scheduler.primaryTickerMessage}
          </span>
        </div>
      </div>

      {/* ── Right Section ───────────────────────────────────── */}
      <div className="top-navbar-right">
        <Link to="/" className="nav-link-btn" title="Homepage View">Home</Link>
        <Link to="/crm" className="nav-link-btn" title="CRM Dashboard">Dashboard</Link>
        <Link to="/profile" className="nav-link-btn" title="Profile & Security">Profile</Link>

        {/* MD Ghost Impersonation — Master Level Only */}
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
                {personnel
                  .filter((p) => p.accessLevel >= 4)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.roleTitle} - Level {p.accessLevel})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Sales & Leasing Brokers">
                {personnel
                  .filter((p) => p.accessLevel === 2 || p.accessLevel === 3)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.roleTitle} - Level {p.accessLevel})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="External Portals">
                {personnel
                  .filter((p) => p.accessLevel === 1)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.roleTitle} - External)
                    </option>
                  ))}
              </optgroup>
            </select>

            {impersonatedUser && (
              <div className="impersonation-badge-active">
                <span>
                  VIEWING AS: {impersonatedUser.name.split(' ')[0]} (L{impersonatedUser.accessLevel})
                </span>
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

        {/* Notification Bell */}
        <button
          className="nav-link-btn"
          style={{ padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center' }}
          onClick={handleNotificationsClick}
          title="Notifications & WhatsApp Queue"
          aria-label="Open Notifications"
        >
          <Bell size={18} color="#EF4444" />
        </button>

        {/* Active User Avatar */}
        <button
          className="top-navbar-profile-btn"
          onClick={handleProfileClick}
          title={`${activeUser?.name} (${activeUser?.roleTitle})`}
          aria-label="Open User Profile"
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
