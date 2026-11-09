import React, { FC } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import {
  NavbarContainer,
  NavWing,
  OverhangingLogoWrapper,
  NavLink,
  QuickActionBtn,
  ProfileMenuWrapper,
  ProfileTrigger,
} from './TopNavbar.style';
import { useTopNavbarLogic, TopNavbarProps } from './TopNavbar.logic';
import { UserPreferencesDropdown } from '../layout/PublicNavbar/UserPreferencesDropdown';

export type { TopNavbarProps };

export const TopNavbar: FC<TopNavbarProps> = props => {
  const {
    scrolled,
    currentPath,
    isDark,
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
      {/* ── Left Wing: Navigation Links ── */}
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
      </NavWing>

      {/* ── Central Overhanging Logo (64px, 50% overhang, Dead Center) ──── */}
      <OverhangingLogoWrapper
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          const targetHome =
            props.homeRoute ||
            (currentPath.startsWith('/dashboard') || currentPath.startsWith('/crm')
              ? '/dashboard'
              : '/');
          handleNavigate(targetHome);
        }}
        title={
          currentPath.startsWith('/dashboard')
            ? 'White Caves Dashboard Home'
            : 'White Caves Real Estate LLC — Sovereign Real Estate OS'
        }
        data-testid="navbar-logo-home"
      >
        <img src="/company-logo.jpg" alt="White Caves Logo" />
      </OverhangingLogoWrapper>

      {/* ── Right Wing: Notifications & Centralized Profile Menu ── */}
      <NavWing $align="right">
        {/* Notifications & Escalations */}
        <QuickActionBtn title="Notifications & Escalations" aria-label="Notifications">
          <Bell size={16} />
          <div className="alert-pip" />
        </QuickActionBtn>

        {/* Centralized Profile Component (with telemetry, role badge, theme, and full suite) */}
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
            </div>
            <ChevronDown size={14} color="#EF4444" />
          </ProfileTrigger>

          {isProfileOpen && (
            <UserPreferencesDropdown
              user={user}
              onClose={() => setIsProfileOpen(false)}
            />
          )}
        </ProfileMenuWrapper>
      </NavWing>
    </NavbarContainer>
  );
};

export default TopNavbar;
