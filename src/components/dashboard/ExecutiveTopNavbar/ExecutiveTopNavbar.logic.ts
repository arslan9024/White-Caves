import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useUserRole } from '../../../context/UserRoleContext';

export function useExecutiveTopNavbarLogic() {
  const { user, logout } = useAuth();
  const { isFounder, isManagingDirector, accessLevel, role } = useUserRole();
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
    await logout();
    navigate('/signin');
  };

  const displayName = user?.name || 'Arslan Malik';
  const displayRole =
    isFounder || isManagingDirector || accessLevel >= 5
      ? 'Managing Director'
      : role || 'Executive Broker';
  const initial = displayName.charAt(0).toUpperCase();

  return {
    displayName,
    displayRole,
    initial,
    isProfileOpen,
    dropdownRef,
    toggleProfile,
    handleNavigate,
    handleLogout,
  };
}
