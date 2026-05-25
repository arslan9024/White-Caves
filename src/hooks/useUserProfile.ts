/**
 * useUserProfile Hook
 * ===================
 * Extracted from ProfilePage — owns Redux user state, form state,
 * profile save/patch, logout, and role management.
 */

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import { selectSessionUser } from '../store/selectors/sessionSelectors';
import { setUser } from '../store/userSlice';
import { logout as logoutAuthState } from '../store/authSlice';
import { auth } from '../config/firebase';
import { createLogger } from '../utils/logger';
import { safeStorage } from '../utils/safeStorage';
import { authFetch } from '../utils/authFetch';
import { useToast } from '../components/Toast';
import { signOut } from 'firebase/auth';
import { logout as logoutBackendSession } from '../services/authService';

const log = createLogger('useUserProfile');

interface UserData {
  role: string;
  locked?: boolean;
}

interface ProfilePageUser {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
  photoURL?: string;
  photoUrl?: string;
  role?: string;
}

export function useUserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) =>
    selectSessionUser(state)
  ) as ProfilePageUser | null;
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [userRole, setUserRole] = useState<UserData | null>(null);

  // Controlled form state for settings
  const [profileName, setProfileName] = useState<string>('');
  const [profilePhone, setProfilePhone] = useState<string>('');
  const [profileLanguage, setProfileLanguage] = useState<string>('en');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect((): void => {
    if (!user) {
      navigate('/signin');
      return;
    }

    // Initialize form state from user data
    setProfileName(user.name || '');
    setProfilePhone(user.phone || '');

    const stored = safeStorage.getJSON<UserData>('userRole');
    if (stored) {
      setUserRole(stored);
      return;
    }

    // Fallback for social-login users where role is present on the user object
    if (user.role) {
      setUserRole({ role: user.role, locked: true });
    }
  }, [user, navigate]);

  const handleLogout = async (): Promise<void> => {
    try {
      if (auth) {
        await signOut(auth);
      }
      await logoutBackendSession();
      safeStorage.remove('token');
      safeStorage.remove('userRole');
      dispatch(setUser(null));
      dispatch(logoutAuthState(undefined));
      navigate('/');
    } catch (error) {
      log.error('Logout error:', error);
    }
  };

  const handleSaveProfile = async (): Promise<void> => {
    if (!profileName.trim()) {
      toast.warning('Name cannot be empty.');
      return;
    }
    setIsSaving(true);
    try {
      const response = await authFetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileName.trim(),
          phone: profilePhone.trim() || null,
          language: profileLanguage,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(e => {
          log.debug('Non-JSON error response:', e);
          return {};
        });
        const parsedErrorData = errorData as Record<string, string>;
        throw new Error(
          parsedErrorData.error ||
            parsedErrorData.message ||
            parsedErrorData.details ||
            'Failed to save profile'
        );
      }
      await response.json();
      // Update Redux user state with new data
      if (user?.id && user?.email) {
        dispatch(
          setUser({
            ...user,
            id: user.id,
            email: user.email,
            name: profileName.trim(),
            phone: profilePhone.trim() || undefined,
          })
        );
      }
      toast.success('Profile updated successfully.');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save profile. Please try again.';
      toast.error(message);
      log.error('Save profile error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleLabel = (role: string): string => {
    switch (role) {
      case 'buyer':
        return 'Buyer';
      case 'seller':
        return 'Seller';
      case 'landlord':
        return 'Landlord';
      case 'leasing-agent':
        return 'Leasing Agent';
      case 'secondary-sales-agent':
        return 'Sales Agent';
      case 'leasing-team-leader':
        return 'Leasing Team Leader';
      case 'sales-team-leader':
        return 'Sales Team Leader';
      case 'admin':
        return 'Administrator';
      case 'owner':
        return 'Owner';
      case 'lion':
      case 'managing_director':
        return 'Managing Director';
      default:
        return role;
    }
  };

  return {
    user,
    activeTab,
    setActiveTab,
    userRole,
    profileName,
    setProfileName,
    profilePhone,
    setProfilePhone,
    profileLanguage,
    setProfileLanguage,
    isSaving,
    handleLogout,
    handleSaveProfile,
    getRoleLabel,
  };
}
