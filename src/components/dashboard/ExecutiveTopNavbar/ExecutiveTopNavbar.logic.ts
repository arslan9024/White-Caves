// FILE: src/components/dashboard/ExecutiveTopNavbar/ExecutiveTopNavbar.logic.ts
/**
 * White Caves Real Estate LLC - Executive Top Navbar State & RBAC Logic
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useUserRole, ROLE_LABELS } from '../../../context/UserRoleContext';

export function useExecutiveTopNavbarLogic() {
  const { user: authUser, logout: authLogout } = useAuth();
  const {
    isFounder,
    isManagingDirector,
    accessLevel,
    role,
    user: roleUser,
    logout: roleLogout,
    isRoleConfirmed,
  } = useUserRole();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleProfile = useCallback(() => {
    setIsProfileOpen(prev => !prev);
  }, []);

  const closeProfile = useCallback(() => {
    setIsProfileOpen(false);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeProfile();
      }
    }
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen, closeProfile]);

  const handleNavigate = (path: string) => {
    closeProfile();
    navigate(path);
  };

  const handleLogout = async () => {
    closeProfile();
    roleLogout();
    await authLogout();
    navigate('/signin');
  };

  const activeUser = roleUser || authUser;
  const isGuest = !activeUser || activeUser.role === 'guest' || activeUser.id === 'guest_user';

  const displayName = isFounder
    ? 'Arslan Malik Bashir Ahmad'
    : activeUser?.name || (isGuest ? 'Executive Guest' : 'White Caves User');

  const displayRole =
    isFounder || isManagingDirector || accessLevel >= 5
      ? 'Managing Director'
      : ROLE_LABELS[role] || (isGuest ? 'Executive Guest (Unconfirmed)' : 'Client Portal');

  const initial = (displayName.charAt(0) || 'U').toUpperCase();

  return {
    displayName,
    displayRole,
    initial,
    isProfileOpen,
    dropdownRef,
    isGuest,
    isRoleConfirmed,
    toggleProfile,
    handleNavigate,
    handleLogout,
  };
}
