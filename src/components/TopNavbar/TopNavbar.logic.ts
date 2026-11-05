import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useUserRole } from '../../context/UserRoleContext';

export interface TopNavbarProps {
  isMDMode?: boolean; // Managing Director Mode
  sticky?: boolean;
  onToggleSidebar?: () => void;
  onOpenDeptManager?: () => void;
}

export const useTopNavbarLogic = (props: TopNavbarProps = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { role, accessLevel, isFounder, isManagingDirector, user, loginAsRole } = useUserRole();
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = useCallback(
    (path: string) => {
      setIsProfileOpen(false);
      navigate(path);
    },
    [navigate]
  );

  const toggleProfile = useCallback(() => {
    setIsProfileOpen(prev => !prev);
  }, []);

  const displayName = user?.name || 'Executive Owner';
  const displayRole = isFounder ? 'Founder (L5)' : `L${accessLevel} · ${role || 'Owner'}`;
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'W';
  const photoURL = user?.photoURL;

  return {
    scrolled,
    currentPath: location.pathname,
    isDark,
    toggleTheme,
    role,
    accessLevel,
    isFounder,
    isManagingDirector,
    user,
    displayName,
    displayRole,
    initial,
    photoURL,
    isProfileOpen,
    setIsProfileOpen,
    toggleProfile,
    loginAsRole,
    handleNavigate,
  };
};
