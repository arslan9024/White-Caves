import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useUserRole } from '../../context/UserRoleContext';

export interface TopNavbarProps {
  isMDMode?: boolean; // Managing Director Mode
}

export const useTopNavbarLogic = (props: TopNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { role, accessLevel, isFounder, isManagingDirector, user, loginAsRole } = useUserRole();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLockedOpen, setIsLockedOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = useCallback((path: string) => {
    setActiveDropdown(null);
    setIsLockedOpen(false);
    navigate(path);
  }, [navigate]);

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
    loginAsRole,
    handleNavigate,
  };
};
