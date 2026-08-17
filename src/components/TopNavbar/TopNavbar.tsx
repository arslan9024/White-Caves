import React, { FC } from 'react';
import { Sun, Moon } from 'lucide-react';
import { 
  NavbarContainer, 
  OverhangingLogoWrapper, 
  NavGroup, 
  NavLink, 
  ThemeToggleBtn,
  ImpersonationSwitch 
} from './TopNavbar.style';
import { useTopNavbarLogic, TopNavbarProps } from './TopNavbar.logic';

export const TopNavbar: FC<TopNavbarProps> = (props) => {
  const {
    scrolled,
    currentPath,
    isDark,
    toggleTheme,
    impersonationLevel,
    handleNavigate,
    handleImpersonationChange
  } = useTopNavbarLogic(props);

  return (
    <NavbarContainer
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.08)' : '0 4px 20px rgba(0, 0, 0, 0.02)',
      }}
      data-testid="top-navbar"
    >
      {/* Left Navigation Group */}
      <NavGroup>
        <NavLink 
          $active={currentPath === '/'} 
          onClick={() => handleNavigate('/')}
        >
          Corporate HQ
        </NavLink>
        <NavLink 
          $active={currentPath === '/off-plan'} 
          onClick={() => handleNavigate('/off-plan')}
        >
          Primary Market
        </NavLink>
        <NavLink 
          $active={currentPath === '/properties'} 
          onClick={() => handleNavigate('/properties')}
        >
          Secondary Market
        </NavLink>
      </NavGroup>

      {/* Central Overhanging Logo (64px, 50% overhang) */}
      <OverhangingLogoWrapper
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleNavigate('/')}
        title="White Caves Real Estate LLC"
      >
        <img src="/company-logo.jpg" alt="White Caves Logo" />
      </OverhangingLogoWrapper>

      {/* Right Navigation Group & Executive Tools */}
      <NavGroup>
        <NavLink 
          $active={currentPath === '/crm'} 
          onClick={() => handleNavigate('/crm')}
        >
          CRM Hub
        </NavLink>
        <NavLink 
          $active={currentPath === '/profile'} 
          onClick={() => handleNavigate('/profile')}
        >
          Executive Profile
        </NavLink>

        {/* Binary Theme Switcher (Light = Crisp White / Dark = Deep Slate) */}
        <ThemeToggleBtn 
          onClick={toggleTheme} 
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          data-testid="theme-toggle-btn"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </ThemeToggleBtn>

        {/* Ghost Session Impersonation Switch (Visible only for MD Mode) */}
        {props.isMDMode && (
          <ImpersonationSwitch 
            value={impersonationLevel}
            onChange={(e) => handleImpersonationChange(e.target.value)}
          >
            <option value="MD">👑 MD View</option>
            <option value="Level 4">🏛️ Dept Manager (Level 4)</option>
            <option value="Level 3">👥 Team Lead (Level 3)</option>
            <option value="Level 2">👔 Broker (Level 2)</option>
          </ImpersonationSwitch>
        )}
      </NavGroup>
    </NavbarContainer>
  );
};

export default TopNavbar;
