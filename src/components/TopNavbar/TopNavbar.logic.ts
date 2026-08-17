import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export interface TopNavbarProps {
  isMDMode?: boolean; // Managing Director Mode
}

export const useTopNavbarLogic = (props: TopNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLockedOpen, setIsLockedOpen] = useState(false);
  
  // Ghost Session Impersonation State
  const [impersonationLevel, setImpersonationLevel] = useState<string>('MD');

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

  const handleImpersonationChange = useCallback((level: string) => {
    setImpersonationLevel(level);
  }, []);

  const handleMouseEnter = useCallback((menu: string) => {
    if (!isLockedOpen) {
      setActiveDropdown(menu);
    }
  }, [isLockedOpen]);

  const handleMouseLeave = useCallback(() => {
    if (!isLockedOpen) {
      setActiveDropdown(null);
    }
  }, [isLockedOpen]);

  const handleClickToggle = useCallback((menu: string) => {
    if (activeDropdown === menu && isLockedOpen) {
      setIsLockedOpen(false);
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menu);
      setIsLockedOpen(true);
    }
  }, [activeDropdown, isLockedOpen]);

  return {
    scrolled,
    currentPath: location.pathname,
    impersonationLevel,
    isDark,
    toggleTheme,
    activeDropdown,
    isLockedOpen,
    handleNavigate,
    handleImpersonationChange,
    handleMouseEnter,
    handleMouseLeave,
    handleClickToggle,
  };
};
