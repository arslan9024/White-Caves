import React, { FC } from 'react';
import { Sun, Moon, Shield } from 'lucide-react';
import { 
  NavbarContainer, 
  OverhangingLogoWrapper, 
  NavGroup, 
  NavLink, 
  ThemeToggleBtn,
  RoleBadge 
} from './TopNavbar.style';
import { useTopNavbarLogic, TopNavbarProps } from './TopNavbar.logic';
import { UserPreferencesDropdown } from '../layout/PublicNavbar/UserPreferencesDropdown';
import { ROLE_LABELS } from '../../context/UserRoleContext';

export const TopNavbar: FC<TopNavbarProps> = (props) => {
  const {
    scrolled,
    currentPath,
    isDark,
    toggleTheme,
    role,
    accessLevel,
    isFounder,
    handleNavigate,
  } = useTopNavbarLogic(props);

  return (
    <NavbarContainer
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        boxShadow: scrolled ? '0 4px 24px rgba(0, 0, 0, 0.12)' : '0 4px 20px rgba(0, 0, 0, 0.04)',
      }}
      data-testid="top-navbar"
    >
      {/* Left Navigation Group */}
      <NavGroup>
        <NavLink 
          $active={currentPath === '/'} 
          onClick={() => handleNavigate('/')}
        >
          🏢 Corporate HQ
        </NavLink>
        <NavLink 
          $active={currentPath === '/off-plan'} 
          onClick={() => handleNavigate('/off-plan')}
        >
          🏗️ Primary Market
        </NavLink>
        <NavLink 
          $active={currentPath === '/properties'} 
          onClick={() => handleNavigate('/properties')}
        >
          🏡 Secondary Market
        </NavLink>
      </NavGroup>

      {/* Central Overhanging Logo (64px, 50% overhang) */}
      <OverhangingLogoWrapper
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleNavigate('/')}
        title="White Caves Real Estate LLC — Sovereign Real Estate OS"
      >
        <img src="/company-logo.jpg" alt="White Caves Logo" />
      </OverhangingLogoWrapper>

      {/* Right Navigation Group & Executive Tools */}
      <NavGroup>
        <NavLink 
          $active={currentPath.startsWith('/crm')} 
          onClick={() => handleNavigate('/crm')}
        >
          📊 CRM Hub
        </NavLink>
        <NavLink 
          $active={currentPath === '/profile'} 
          onClick={() => handleNavigate('/profile')}
        >
          👤 Profile
        </NavLink>

        {/* Dynamic 14-Role Clearance Level Badge */}
        <RoleBadge $level={accessLevel}>
          {isFounder ? '👑 Founder (L5)' : `L${accessLevel} · ${ROLE_LABELS[role] || role}`}
        </RoleBadge>

        {/* Universal User Preferences Dropdown (Role / Lang / Theme / Currency) */}
        <UserPreferencesDropdown />

        {/* Quick Theme Switcher */}
        <ThemeToggleBtn 
          onClick={toggleTheme} 
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          data-testid="theme-toggle-btn"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </ThemeToggleBtn>
      </NavGroup>
    </NavbarContainer>
  );
};

export default TopNavbar;
