import React, { FC } from 'react';
import { Sun, Moon, Bell, ChevronDown, Cpu } from 'lucide-react';
import {
  NavbarContainer,
  NavWing,
  OverhangingLogoWrapper,
  NavLink,
  ThemeToggleBtn,
  RoleBadge,
  CenterTeleGroup,
  TelemetryPill,
  QuickActionBtn,
  ProfileMenuWrapper,
  ProfileTrigger,
} from './TopNavbar.style';
import { useTopNavbarLogic, TopNavbarProps } from './TopNavbar.logic';
import { UserPreferencesDropdown } from '../layout/PublicNavbar/UserPreferencesDropdown';
import { ROLE_LABELS } from '../../context/UserRoleContext';

export type { TopNavbarProps };

export const TopNavbar: FC<TopNavbarProps> = props => {
  const {
    scrolled,
    currentPath,
    isDark,
    toggleTheme,
    role,
    accessLevel,
    isFounder,
    user,
    displayName,
    displayRole,
    initial,
    photoURL,
    isProfileOpen,
    setIsProfileOpen,
    toggleProfile,
    handleNavigate,
  } = useTopNavbarLogic(props);

  return (
    <NavbarContainer
      $sticky={props.sticky}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        boxShadow: scrolled ? '0 4px 24px rgba(0, 0, 0, 0.12)' : '0 4px 20px rgba(0, 0, 0, 0.04)',
      }}
      data-testid="top-navbar"
    >
      {/* ── Left Wing: Navigation Links + Statutory & Telemetry Badges ── */}
      <NavWing $align="left">
        <NavLink $active={currentPath === '/'} onClick={() => handleNavigate('/')}>
          🏢 Corporate HQ
        </NavLink>
        <NavLink $active={currentPath === '/off-plan'} onClick={() => handleNavigate('/off-plan')}>
          🏗️ Primary Market
        </NavLink>
        <NavLink
          $active={currentPath === '/properties'}
          onClick={() => handleNavigate('/properties')}
        >
          🏡 Secondary Market
        </NavLink>

        {/* Live DLD & AI Mesh Telemetry (Left Anchor) */}
        <CenterTeleGroup>
          <TelemetryPill title="DLD Dubai Land Department License">
            <div className="live-dot" />
            <span className="label">DLD:</span>
            <span className="val">1388443</span>
          </TelemetryPill>
          <TelemetryPill title="RERA Office Registration Number">
            <span className="label">RERA:</span>
            <span className="val">44483</span>
          </TelemetryPill>
          <TelemetryPill title="AI Zoe Mesh Distributed Agents">
            <Cpu size={12} color="#10B981" />
            <span className="label">Zoe:</span>
            <span className="val" style={{ color: '#10B981' }}>
              121
            </span>
          </TelemetryPill>
        </CenterTeleGroup>
      </NavWing>

      {/* ── Central Overhanging Logo (64px, 50% overhang, Dead Center) ──── */}
      <OverhangingLogoWrapper
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleNavigate('/')}
        title="White Caves Real Estate LLC — Sovereign Real Estate OS"
      >
        <img src="/company-logo.jpg" alt="White Caves Logo" />
      </OverhangingLogoWrapper>

      {/* ── Right Wing: Workspace Controls, Profile & Master Theme Toggle ── */}
      <NavWing $align="right">
        <NavLink
          $active={currentPath.startsWith('/crm') || currentPath.startsWith('/dashboard')}
          onClick={() => handleNavigate('/dashboard')}
        >
          📊 CRM Hub
        </NavLink>

        {/* Notifications & Escalations */}
        <QuickActionBtn title="Notifications & Escalations" aria-label="Notifications">
          <Bell size={16} />
          <div className="alert-pip" />
        </QuickActionBtn>

        {/* Dynamic 14-Role Clearance Level Badge */}
        <RoleBadge $level={accessLevel}>
          {isFounder ? '👑 Founder (L5)' : `L${accessLevel} · ${ROLE_LABELS[role] || role}`}
        </RoleBadge>

        {/* Reused Profile Component (hideThemeSelector={true} removes duplicate theme controls) */}
        <ProfileMenuWrapper>
          <ProfileTrigger
            onClick={toggleProfile}
            aria-expanded={isProfileOpen}
            aria-label="User profile and preferences"
            data-testid="profile-trigger"
          >
            <div className="avatar">
              {photoURL ? <img src={photoURL} alt={displayName} /> : initial}
            </div>
            <div className="user-meta">
              <span className="name">{displayName}</span>
              <span className="role">{displayRole}</span>
            </div>
            <ChevronDown size={14} color="#EF4444" />
          </ProfileTrigger>

          {isProfileOpen && (
            <UserPreferencesDropdown
              user={user}
              onClose={() => setIsProfileOpen(false)}
              hideThemeSelector={true}
            />
          )}
        </ProfileMenuWrapper>

        {/* Canonical Master Full-Page Theme Toggle */}
        <ThemeToggleBtn
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          data-testid="theme-toggle-btn"
          aria-label="Toggle color theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </ThemeToggleBtn>
      </NavWing>
    </NavbarContainer>
  );
};

export default TopNavbar;
