import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface TopNavbarProps {
  isMDMode?: boolean; // Managing Director Mode
}

export const useTopNavbarLogic = (props: TopNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  // Ghost Session Impersonation State
  const [impersonationLevel, setImpersonationLevel] = useState<string>('MD');

  // Handle Scroll to shrink/adjust navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleImpersonationChange = useCallback((level: string) => {
    setImpersonationLevel(level);
    console.log(`[Executive Deck] Impersonating: Level ${level}`);
    // Logic to dispatch context updates would go here
  }, []);

  return {
    scrolled,
    currentPath: location.pathname,
    impersonationLevel,
    handleNavigate,
    handleImpersonationChange,
  };
};
