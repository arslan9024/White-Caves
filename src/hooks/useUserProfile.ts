/**
 * useUserProfile Hook
 * ===================
 * Extracted from ProfilePage — owns Redux user state, form state,
 * profile save/patch, logout, and role management.
 */

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import { selectSessionUser } from '../store/selectors/sessionSelectors';
import { setUser, type AppUser } from '../store/userSlice';
import { auth } from '../config/firebase';
import { createLogger } from '../utils/logger';
import { safeStorage } from '../utils/safeStorage';
import { authFetch } from '../utils/authFetch';
import { useToast } from '../components/Toast';
import { signOut } from 'firebase/auth';
import { logout as logoutBackendSession } from '../services/authService';
import type { ProfileResponse } from '../services/authService';
import { completeClientLogout } from '../utils/authSession';
import { getReturnToFromLocationState, resolvePostLoginDestination } from '../utils/authSession';

const log = createLogger('useUserProfile');

interface UserData {
  role: string;
  locked?: boolean;
}

export function useUserProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => selectSessionUser(state));
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
      completeClientLogout(dispatch);
      navigate('/');
    } catch (error) {
      log.error('Logout error:', error);
      // Still clean up state even if backend logout fails
      completeClientLogout(dispatch);
      navigate('/');
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
      const result = (await response.json()) as ProfileResponse;
      if (!result.success || !result.data || !user?.id || !user.email) {
        throw new Error(
          'The server returned an incomplete profile response. Please refresh and retry.'
        );
      }

      const updatedUser: AppUser = {
        ...user,
        ...result.data,
        name: result.data.name ?? user.name ?? undefined,
        phone: result.data.phone ?? undefined,
        profileComplete: result.data.profileCompleted,
      };
      dispatch(setUser(updatedUser));
      safeStorage.setJSON('user', updatedUser);

      const destination = resolvePostLoginDestination({
        user: updatedUser,
        returnTo: getReturnToFromLocationState(location.state),
      });
      toast.success('Profile updated successfully.');
      if (destination !== location.pathname) navigate(destination, { replace: true });
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
