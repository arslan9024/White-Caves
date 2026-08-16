/**
 * TopNavbar.tsx — Overhanging Logo Shell & Binary Light/Dark Theme Switch
 *
 * Implements RUP Construction directives:
 * 1. Double logo vector boundaries to 64px x 64px (h-16 w-16).
 * 2. Overhangs 50% down past bottom navbar border (translateY(33.33%), z-index: 1010).
 * 3. Removes black written corporate title text strings next to brand graphic asset.
 * 4. Binary Light/Dark mode switch (#FFFFFF + #EF4444 vs #0F172A + #EF4444).
 * 5. Fluid Dropdown Flow with hover micro-shadow and click lock.
 */

import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Sun, Moon, User, ShieldAlert } from 'lucide-react';
import { useTopNavbarLogic } from './TopNavbar.logic';
import { useProfileScheduler } from '../../hooks/useProfileScheduler';
import { useTheme } from '../../context/ThemeContext';
import {
  NavHeaderContainer,
  OverhangingLogoWrapper,
  OverhangingLogoBadge,
  ThemeToggleButton,
  DropdownWrapper,
} from './TopNavbar.style';
import './TopNavbar.css';

export const TopNavbar: FC = () => {
  const scheduler = useProfileScheduler();
  let isDark = false;
  let setThemeMode = (_mode: 'light' | 'dark' | 'system') => {};

  try {
    const themeCtx = useTheme();
    if (themeCtx) {
      isDark = themeCtx.isDark;
      setThemeMode = themeCtx.setThemeMode;
    }
  } catch {
    // Safe fallback when rendered outside ThemeProvider
  }

  const [isDropdownLocked, setIsDropdownLocked] = useState(false);

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

  const toggleTheme = () => {
    setThemeMode(isDark ? 'light' : 'dark');
  };

  return (
    <NavHeaderContainer $isDark={isDark} data-testid="top-navbar" role="banner" aria-label="Global Header Navigation">
      {/* ── Left Section: 76px Overhanging Circular Brand Logo (Shifted Right) ─────── */}
      <div className="top-navbar-left" style={{ paddingLeft: '6rem' }}>
        <OverhangingLogoWrapper style={{ marginLeft: '1rem' }}>
          <Link to="/" aria-label="White Caves Real Estate Home" style={{ textDecoration: 'none' }}>
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '1rem',
                transform: 'translateY(22%)',
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.6rem',
                border: '3.5px solid #EF4444',
                boxShadow: '0 10px 28px rgba(239, 68, 68, 0.5)',
                zIndex: 1010,
                overflow: 'hidden',
              }}
              title="White Caves Real Estate Dubai"
            >
              <img
                src={`${import.meta.env.BASE_URL || '/'}company-logo.jpg`.replace('//', '/')}
                alt="WC"
                onError={(e) => {
                  // Fallback to text WC badge if image file is not found
                  (e.target as HTMLElement).style.display = 'none';
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
              <span style={{ position: 'absolute' }}>WC</span>
            </div>
          </Link>
        </OverhangingLogoWrapper>

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
            style={{
              background: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(248, 250, 252, 0.9)',
              color: isDark ? '#F8FAFC' : '#1E293B',
              borderColor: isDark ? 'rgba(239, 68, 68, 0.4)' : '#CBD5E1',
            }}
          />
        </form>

        {/* DLD / RERA Realtime Ticker & Credential Expiry Banner */}
        <div
          className={`top-navbar-ticker ${scheduler.highestSeverity !== 'CLEAR' ? 'ticker-alert-active' : ''}`}
          style={
            scheduler.highestSeverity !== 'CLEAR'
              ? { backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1.5px solid #EF4444', color: '#EF4444', fontWeight: 'bold' }
              : {}
          }
        >
          <span
            className={`ticker-dot ${scheduler.highestSeverity !== 'CLEAR' ? 'ticker-dot-pulse' : ''}`}
            style={scheduler.highestSeverity !== 'CLEAR' ? { backgroundColor: '#EF4444' } : {}}
          />
          <span>{scheduler.primaryTickerMessage}</span>
        </div>
      </div>

      {/* ── Right Section: Navigation Links & Binary Theme Switch ────────────── */}
      <div className="top-navbar-right">
        <Link to="/" className="nav-link-btn" title="Homepage View" style={{ color: isDark ? '#F8FAFC' : '#1E293B' }}>
          Home
        </Link>
        <Link to="/crm" className="nav-link-btn" title="CRM Dashboard" style={{ color: isDark ? '#F8FAFC' : '#1E293B' }}>
          Dashboard
        </Link>
        <Link to="/profile" className="nav-link-btn" title="Profile & Security" style={{ color: isDark ? '#F8FAFC' : '#1E293B' }}>
          Profile
        </Link>

        {/* Strict Binary Light / Dark Mode Toggle */}
        <ThemeToggleButton $isDark={isDark} onClick={toggleTheme} title={isDark ? 'Switch to Light Mode (#FFFFFF)' : 'Switch to Dark Mode (#0F172A)'}>
          {isDark ? <Sun size={15} color="#EF4444" /> : <Moon size={15} color="#EF4444" />}
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </ThemeToggleButton>

        {/* MD Ghost Impersonation — Master Level Only */}
        {isMaster && (
          <div className="impersonation-panel" data-testid="md-impersonation-panel">
            <select
              className="impersonation-select"
              value={impersonatedUser?.id || ''}
              onChange={handleImpersonationChange}
              title="MD Ghost Session Impersonation Matrix"
              style={{
                background: isDark ? '#1E293B' : '#FFFFFF',
                color: isDark ? '#F8FAFC' : '#1E293B',
                borderColor: '#EF4444',
              }}
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

        {/* Notifications Hub */}
        <button
          onClick={handleNotificationsClick}
          className="top-navbar-btn"
          title="Notifications & WhatsApp Queue"
          style={{ color: isDark ? '#F8FAFC' : '#1E293B' }}
        >
          <Bell size={18} />
        </button>

        {/* Fluid Hover & Click-Locked Profile Dropdown */}
        <DropdownWrapper $isLocked={isDropdownLocked} $isDark={isDark} onClick={() => setIsDropdownLocked((prev) => !prev)}>
          <button
            onClick={handleProfileClick}
            className="top-navbar-avatar-btn"
            title={`Active User: ${activeUser?.name || 'Executive'}`}
          >
            <User size={18} color="#EF4444" />
          </button>
          <div className="dropdown-menu">
            <div style={{ padding: '8px', fontSize: '0.8rem', fontWeight: 'bold', color: isDark ? '#F8FAFC' : '#1E293B', borderBottom: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {activeUser?.name || 'Managing Director'}
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 'normal' }}>{activeUser?.email}</div>
            </div>
            <Link to="/profile" style={{ display: 'block', padding: '8px', fontSize: '0.8rem', color: '#EF4444', fontWeight: 'bold', textDecoration: 'none' }}>
              👤 Sovereign Profile
            </Link>
            <Link to="/crm" style={{ display: 'block', padding: '8px', fontSize: '0.8rem', color: isDark ? '#F8FAFC' : '#1E293B', textDecoration: 'none' }}>
              📊 Executive Dashboard
            </Link>
          </div>
        </DropdownWrapper>
      </div>
    </NavHeaderContainer>
  );
};

export default TopNavbar;
