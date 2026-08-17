/**
 * UserPreferencesDropdown.logic.ts — Hook & Logic Layer
 */

import { useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTheme, type ThemeMode } from '../../../../../context/ThemeContext';
import { useLanguage, type LanguageType } from '../../../../../context/LanguageContext';
import { useGlobalCurrency, type CurrencyCode } from '../../../../../context/CurrencyContext';
import { useUserRole, type UserRole, ROLE_LABELS } from '../../../../../context/UserRoleContext';
import { logout } from '../../../../../store/authSlice';
import { THEME_ITEMS } from '../data/UserPreferencesDropdown.data';

export interface UseUserPreferencesDropdownProps {
  user?: {
    name?: string;
    email?: string;
    photoURL?: string;
    role?: string;
  } | null;
  onClose: () => void;
}

export function useUserPreferencesDropdownLogic({ user, onClose }: UseUserPreferencesDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { themeMode, setThemeMode } = useTheme();
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const { currency, setCurrency, currencies } = useGlobalCurrency();
  const {
    user: contextUser,
    role: currentRole,
    accessLevel,
    isFounder,
    isManagingDirector,
    loginAsRole,
    switchRole,
    logout: roleLogout,
    allRoles,
  } = useUserRole();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleNavigate = useCallback(
    (path: string) => {
      onClose();
      navigate(path);
    },
    [onClose, navigate]
  );

  const handleLogout = useCallback(() => {
    roleLogout();
    dispatch(logout());
    onClose();
    navigate('/login');
  }, [roleLogout, dispatch, onClose, navigate]);

  const handleSelectRole = useCallback(
    (targetRole: UserRole) => {
      loginAsRole(targetRole);
      onClose();
    },
    [loginAsRole, onClose]
  );

  return {
    dropdownRef,
    user: contextUser || user,
    currentRole,
    accessLevel,
    isFounder,
    isManagingDirector,
    allRoles,
    roleLabels: ROLE_LABELS,
    themeMode,
    setThemeMode,
    language,
    setLanguage,
    supportedLanguages,
    currency,
    setCurrency,
    currencies,
    themeItems: THEME_ITEMS,
    handleNavigate,
    handleLogout,
    handleSelectRole,
  };
}
