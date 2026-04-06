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
import { setUser } from '../store/userSlice';
import { auth } from '../config/firebase';
import { createLogger } from '../utils/logger';
import { safeStorage } from '../utils/safeStorage';
import { authFetch } from '../utils/authFetch';
import { useToast } from '../components/Toast';
import { signOut } from 'firebase/auth';

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
}

interface RoleLabels {
  [key: string]: string;
}

export function useUserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser) as ProfilePageUser | null;
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
    }
  }, [user, navigate]);

  const handleLogout = async (): Promise<void> => {
    try {
      if (auth) {
        await signOut(auth);
      }
      safeStorage.remove('userRole');
      dispatch(setUser(null));
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
      const response = await authFetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileName.trim(),
          phone: profilePhone.trim() || null,
          language: profileLanguage,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as Record<string, string>).error || 'Failed to save profile');
      }
      await response.json();
      // Update Redux user state with new data
      if (user?.id && user?.email) {
        dispatch(setUser({ ...user, id: user.id, email: user.email, name: profileName.trim(), phone: profilePhone.trim() || undefined }));
      }
      toast.success('Profile updated successfully.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save profile. Please try again.';
      toast.error(message);
      log.error('Save profile error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleLabel = (role: string): string => {
    const labels: RoleLabels = {
      'buyer': 'Buyer',
      'seller': 'Seller',
      'landlord': 'Landlord',
      'leasing-agent': 'Leasing Agent',
      'secondary-sales-agent': 'Sales Agent',
      'leasing-team-leader': 'Leasing Team Leader',
      'sales-team-leader': 'Sales Team Leader',
      'admin': 'Administrator'
    };
    return labels[role] || role;
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
