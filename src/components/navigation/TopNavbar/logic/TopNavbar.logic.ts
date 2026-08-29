/**
 * TopNavbar.logic.ts — State Machine, Theme Switcher & Impersonation Logic
 */

import { useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../workspace/contexts/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';

export function useTopNavbarLogic() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, isRtl } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedRole, setImpersonatedRole] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isMaster = useMemo(() => {
    return (
      user?.email?.toLowerCase().trim() === 'arslanmalikgoraha@gmail.com' ||
      user?.role === 'managing_director' ||
      user?.clearance_level === 5
    );
  }, [user]);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    },
    [searchQuery, navigate]
  );

  const handleImpersonate = useCallback((role: string) => {
    setImpersonatedRole(role);
    setIsImpersonating(true);
  }, []);

  const resetImpersonation = useCallback(() => {
    setImpersonatedRole(null);
    setIsImpersonating(false);
  }, []);

  return {
    user,
    isMaster,
    isDark,
    toggleTheme,
    language,
    setLanguage,
    isRtl,
    searchQuery,
    setSearchQuery,
    searchInputRef,
    handleSearchSubmit,
    isImpersonating,
    impersonatedRole,
    handleImpersonate,
    resetImpersonation,
    handleLogout: logout,
    navigate,
  };
}
