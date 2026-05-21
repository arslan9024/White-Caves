/**
 * PortalProfileTab — Phase 2.14: Portal Profile Settings
 *
 * Shared profile settings page for both Landlord and Tenant portals.
 *
 * Features:
 * - Update name and phone number
 * - Update profile photo URL
 * - Change password (with current password verification)
 * - Email and role are read-only
 *
 * @component
 */

import React, { FC, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setUser } from '../../store/userSlice';
import { auth } from '../../config/firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { authFetch } from '../../utils/authFetch';
import { createLogger } from '../../utils/logger';
import '../../pages/RolePages.css';

const log = createLogger('PortalProfileTab');

const PortalProfileTab: FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  // Profile form state
  const [name, setName] = useState(currentUser?.name ?? '');
  const [phone, setPhone] = useState(currentUser?.phone ?? '');
  const [photoUrl, setPhotoUrl] = useState<string>(currentUser?.photoURL ?? '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSaveProfile = useCallback(async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setProfileError('Name cannot be empty.');
      return;
    }

    setProfileError(null);
    setProfileSuccess(null);
    setIsSavingProfile(true);

    try {
      const response = await authFetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          phone: phone.trim() || null,
          photoUrl: photoUrl.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(error => {
          log.debug('Non-JSON profile save error response:', error);
          return {};
        });
        throw new Error(
          (errorData as { error?: string; message?: string }).error ||
            (errorData as { error?: string; message?: string }).message ||
            'Failed to update profile.'
        );
      }

      const payload = (await response.json().catch(() => null)) as {
        data?: {
          id: string;
          email: string;
          name?: string | null;
          role?: string;
          phone?: string | null;
          photoUrl?: string | null;
        };
      } | null;

      const updatedUser = payload?.data;

      // Update Redux state from canonical backend response (fallback to local values)
      if (currentUser) {
        dispatch(
          setUser({
            ...currentUser,
            id: updatedUser?.id || currentUser.id,
            email: updatedUser?.email || currentUser.email,
            role: updatedUser?.role || currentUser.role,
            name: updatedUser?.name ?? trimmedName,
            phone: updatedUser?.phone ?? (phone.trim() || undefined),
            photoURL: updatedUser?.photoUrl ?? (photoUrl.trim() || undefined),
          })
        );
      }

      setProfileSuccess('Profile updated successfully.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile.';
      setProfileError(message);
      log.error('Profile API error:', err);
    } finally {
      setIsSavingProfile(false);
    }
  }, [name, phone, photoUrl, currentUser, dispatch]);

  const handleChangePassword = useCallback(async () => {
    if (!newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    if (!currentPassword) {
      setPasswordError('Please enter your current password to confirm.');
      return;
    }

    setPasswordError(null);
    setPasswordSuccess(null);
    setIsChangingPassword(true);

    try {
      const firebaseUser = auth?.currentUser;
      if (firebaseUser && firebaseUser.email) {
        const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
        await reauthenticateWithCredential(firebaseUser, credential);
        await updatePassword(firebaseUser, newPassword);
        setPasswordSuccess('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError('Unable to change password — please sign in again.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to change password.';
      if (msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setPasswordError('Current password is incorrect.');
      } else {
        setPasswordError(msg);
      }
      log.error('Password change error:', err);
    } finally {
      setIsChangingPassword(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view profile settings.</p>
      </div>
    );
  }

  return (
    <div className="tab-content-section portal-profile-tab" data-testid="portal-profile-tab">
      <div className="tab-header">
        <h3>Profile Settings</h3>
        <p>Update your name, phone number, and password.</p>
      </div>

      {/* ── Personal Info ── */}
      <div className="profile-section" data-testid="profile-section-info">
        <h4>Personal Information</h4>

        <div className="profile-field">
          <label htmlFor="profile-email">Email address</label>
          <input
            id="profile-email"
            type="email"
            value={currentUser.email ?? ''}
            disabled
            aria-readonly="true"
            aria-describedby="profile-email-hint"
            data-testid="profile-email-input"
          />
          <p id="profile-email-hint" className="field-hint">
            Email cannot be changed. Contact support if needed.
          </p>
        </div>

        <div className="profile-field">
          <label htmlFor="profile-role">Role</label>
          <input
            id="profile-role"
            type="text"
            value={currentUser.role ?? ''}
            disabled
            aria-readonly="true"
            data-testid="profile-role-input"
          />
        </div>

        <div className="profile-field">
          <label htmlFor="profile-name">Full name</label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your full name"
            data-testid="profile-name-input"
          />
        </div>

        <div className="profile-field">
          <label htmlFor="profile-phone">Phone number</label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+971-50-000-0000"
            data-testid="profile-phone-input"
          />
        </div>

        <div className="profile-field">
          <label htmlFor="profile-photo">Profile photo URL</label>
          <input
            id="profile-photo"
            type="url"
            value={photoUrl}
            onChange={e => setPhotoUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            data-testid="profile-photo-input"
          />
        </div>

        {profileError && (
          <p className="profile-error-msg" role="alert" data-testid="profile-error">
            {profileError}
          </p>
        )}
        {profileSuccess && (
          <p className="profile-success-msg" role="status" data-testid="profile-success">
            {profileSuccess}
          </p>
        )}

        <button
          type="button"
          className="profile-save-btn"
          onClick={() => void handleSaveProfile()}
          disabled={isSavingProfile}
          aria-disabled={isSavingProfile}
          data-testid="profile-save-btn"
        >
          {isSavingProfile ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {/* ── Change Password ── */}
      <div className="profile-section" data-testid="profile-section-password">
        <h4>Change Password</h4>

        <div className="profile-field">
          <label htmlFor="profile-current-password">Current password</label>
          <input
            id="profile-current-password"
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
            autoComplete="current-password"
            data-testid="profile-current-password-input"
          />
        </div>

        <div className="profile-field">
          <label htmlFor="profile-new-password">New password</label>
          <input
            id="profile-new-password"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            data-testid="profile-new-password-input"
          />
        </div>

        <div className="profile-field">
          <label htmlFor="profile-confirm-password">Confirm new password</label>
          <input
            id="profile-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            autoComplete="new-password"
            data-testid="profile-confirm-password-input"
          />
        </div>

        {passwordError && (
          <p className="profile-error-msg" role="alert" data-testid="password-error">
            {passwordError}
          </p>
        )}
        {passwordSuccess && (
          <p className="profile-success-msg" role="status" data-testid="password-success">
            {passwordSuccess}
          </p>
        )}

        <button
          type="button"
          className="profile-save-btn"
          onClick={() => void handleChangePassword()}
          disabled={isChangingPassword}
          aria-disabled={isChangingPassword}
          data-testid="profile-change-password-btn"
        >
          {isChangingPassword ? 'Updating…' : 'Change Password'}
        </button>
      </div>
    </div>
  );
};

export default PortalProfileTab;
