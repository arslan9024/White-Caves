import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useUserProfile } from '../../hooks/useUserProfile';
import { BiometricSetup } from '../../features/auth/components/BiometricLogin';
import { authFetch } from '../../utils/authFetch';
import './AuthPages.css';

const ProfilePage: FC = () => {
  useDocumentTitle('My Profile');
  const {
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
  } = useUserProfile();

  const normalizeDashboardRole = (role: string): string => {
    if (role === 'lion' || role === 'managing_director' || role === 'md') {
      return 'owner';
    }
    return role;
  };

  const [twoFactorSetupUri, setTwoFactorSetupUri] = useState<string | null>(null);
  const [twoFactorSetupError, setTwoFactorSetupError] = useState<string | null>(null);
  const [twoFactorSetupLoading, setTwoFactorSetupLoading] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorVerifyLoading, setTwoFactorVerifyLoading] = useState(false);
  const [twoFactorVerifyError, setTwoFactorVerifyError] = useState<string | null>(null);
  const [twoFactorVerifySuccess, setTwoFactorVerifySuccess] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorDisablePassword, setTwoFactorDisablePassword] = useState('');
  const [twoFactorDisableLoading, setTwoFactorDisableLoading] = useState(false);
  const [twoFactorDisableError, setTwoFactorDisableError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    authFetch('/api/auth/profile')
      .then(response => response.json())
      .then(payload => {
        if (!cancelled && payload.success) {
          setTwoFactorEnabled(Boolean(payload.data?.twoFactorEnabled));
        }
      })
      .catch(() => {
        // non-blocking: keep default false when profile bootstrap fails
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleEnableTwoFactor = useCallback(async () => {
    setTwoFactorSetupLoading(true);
    setTwoFactorSetupError(null);
    setTwoFactorVerifyError(null);
    setTwoFactorVerifySuccess(null);
    setTwoFactorDisableError(null);

    try {
      const response = await authFetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const payload = await response.json();

      if (payload.success && payload.data?.otpAuthUrl) {
        setTwoFactorSetupUri(payload.data.otpAuthUrl as string);
        setTwoFactorCode('');
      } else {
        setTwoFactorSetupError(payload.error || 'Unable to start 2FA setup.');
      }
    } catch {
      setTwoFactorSetupError('Unable to start 2FA setup. Please try again.');
    } finally {
      setTwoFactorSetupLoading(false);
    }
  }, []);

  const handleVerifyTwoFactor = useCallback(async () => {
    const normalizedCode = twoFactorCode.trim();
    if (!/^\d{6}$/.test(normalizedCode)) {
      setTwoFactorVerifyError('Please enter a valid 6-digit code.');
      return;
    }

    setTwoFactorVerifyLoading(true);
    setTwoFactorVerifyError(null);
    setTwoFactorVerifySuccess(null);

    try {
      const response = await authFetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          code: normalizedCode,
        }),
      });
      const payload = await response.json();

      if (payload.success) {
        setTwoFactorEnabled(true);
        setTwoFactorSetupUri(null);
        setTwoFactorCode('');
        setTwoFactorDisableError(null);
        setTwoFactorVerifySuccess('Two-factor authentication is now enabled.');
      } else {
        setTwoFactorVerifyError(payload.error || 'Invalid verification code. Please try again.');
      }
    } catch {
      setTwoFactorVerifyError('Unable to verify 2FA code. Please try again.');
    } finally {
      setTwoFactorVerifyLoading(false);
    }
  }, [twoFactorCode, user.email]);

  const handleDisableTwoFactor = useCallback(async () => {
    const password = twoFactorDisablePassword.trim();
    if (!password) {
      setTwoFactorDisableError('Please enter your current password to disable 2FA.');
      return;
    }

    setTwoFactorDisableLoading(true);
    setTwoFactorDisableError(null);

    try {
      const response = await authFetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: password }),
      });
      const payload = await response.json();

      if (payload.success) {
        setTwoFactorEnabled(false);
        setTwoFactorSetupUri(null);
        setTwoFactorCode('');
        setTwoFactorDisablePassword('');
        setTwoFactorVerifySuccess('Two-factor authentication has been disabled.');
      } else {
        setTwoFactorDisableError(payload.error || 'Unable to disable 2FA.');
      }
    } catch {
      setTwoFactorDisableError('Unable to disable 2FA. Please try again.');
    } finally {
      setTwoFactorDisableLoading(false);
    }
  }, [twoFactorDisablePassword]);

  if (!user) {
    return null;
  }

  return (
    <div className="auth-page profile-page">
      <div className="profile-container">
        <div className="profile-sidebar">
          <Link to="/" className="auth-logo">
            <img src="/company-logo.jpg" alt="White Caves" loading="lazy" width={120} height={40} />
            <span>White Caves</span>
          </Link>

          <div className="profile-user-card">
            <div className="profile-avatar">
              {user.photo || user.photoURL || user.photoUrl ? (
                <img
                  src={user.photo || user.photoURL || user.photoUrl}
                  alt={user.name || 'User'}
                  loading="lazy"
                  width={48}
                  height={48}
                />
              ) : (
                <span>{(user.name || user.email || 'U')[0].toUpperCase()}</span>
              )}
            </div>
            <h3>{user.name || 'User'}</h3>
            <p>{user.email}</p>
            {userRole && <span className="role-badge">{getRoleLabel(userRole.role)}</span>}
          </div>

          <nav className="profile-nav">
            <button
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="nav-icon">📊</span>
              Overview
            </button>
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="nav-icon">⚙️</span>
              Settings
            </button>
            <button
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <span className="nav-icon">🔒</span>
              Security
            </button>

            <div className="nav-divider"></div>

            {userRole && (
              <Link to={`/${normalizeDashboardRole(userRole.role)}/dashboard`} className="nav-item">
                <span className="nav-icon">🏠</span>
                Go to Dashboard
              </Link>
            )}

            <Link to="/" className="nav-item">
              <span className="nav-icon">🏡</span>
              Home
            </Link>

            <button className="nav-item logout" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>
              Sign Out
            </button>
          </nav>
        </div>

        <div className="profile-content">
          {activeTab === 'overview' && (
            <div className="profile-section">
              <h1>Profile Overview</h1>
              <p className="section-subtitle">Manage your account information</p>

              <div className="info-cards">
                <div className="info-card">
                  <h3>Account Information</h3>
                  <div className="info-rows">
                    <div className="info-row">
                      <span className="info-label">Full Name</span>
                      <span className="info-value">{user.name || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Email</span>
                      <span className="info-value">{user.email || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{user.phone || 'Not set'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Role</span>
                      <span className="info-value">
                        {userRole ? getRoleLabel(userRole.role) : 'Not selected'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Quick Stats</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-value">0</span>
                      <span className="stat-label">Saved Properties</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">0</span>
                      <span className="stat-label">Viewings</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">0</span>
                      <span className="stat-label">Inquiries</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">0</span>
                      <span className="stat-label">Alerts</span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Connected Accounts</h3>
                  <div className="connected-accounts">
                    <div className="account-item">
                      <span className="account-icon google">G</span>
                      <span className="account-name">Google</span>
                      <span className="account-status connected">Connected</span>
                    </div>
                    <div className="account-item">
                      <span className="account-icon facebook">f</span>
                      <span className="account-name">Facebook</span>
                      <span className="account-status">Not connected</span>
                    </div>
                    <div className="account-item">
                      <span className="account-icon apple">A</span>
                      <span className="account-name">Apple</span>
                      <span className="account-status">Not connected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="profile-section">
              <h1>Account Settings</h1>
              <p className="section-subtitle">Update your profile information</p>

              <div className="settings-form">
                <div className="form-group">
                  <label htmlFor="profile-name">Full Name</label>
                  <input
                    id="profile-name"
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    placeholder="Enter your name"
                    autoComplete="name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="profile-email">Email Address</label>
                  <input
                    id="profile-email"
                    type="email"
                    value={user.email || ''}
                    placeholder="Enter your email"
                    disabled
                    autoComplete="email"
                  />
                  <span className="input-hint">Email cannot be changed</span>
                </div>
                <div className="form-group">
                  <label htmlFor="profile-phone">Phone Number</label>
                  <input
                    id="profile-phone"
                    type="tel"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    autoComplete="tel"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="profile-language">Preferred Language</label>
                  <select
                    id="profile-language"
                    value={profileLanguage}
                    onChange={e => setProfileLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
                <button className="btn btn-primary" onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="settings-section">
                <h3>Notification Preferences</h3>
                <div className="toggle-group" role="group" aria-label="Notification preferences">
                  <label className="toggle-item">
                    <span>Email notifications</span>
                    <input type="checkbox" defaultChecked aria-label="Email notifications" />
                  </label>
                  <label className="toggle-item">
                    <span>Price drop alerts</span>
                    <input type="checkbox" defaultChecked aria-label="Price drop alerts" />
                  </label>
                  <label className="toggle-item">
                    <span>New property matches</span>
                    <input type="checkbox" defaultChecked aria-label="New property matches" />
                  </label>
                  <label className="toggle-item">
                    <span>Marketing emails</span>
                    <input type="checkbox" aria-label="Marketing emails" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="profile-section">
              <h1>Security Settings</h1>
              <p className="section-subtitle">Manage your account security</p>

              <div className="security-cards">
                <BiometricSetup />

                <div className="info-card">
                  <h3>Change Password</h3>
                  <div className="settings-form">
                    <div className="form-group">
                      <label htmlFor="current-password">Current Password</label>
                      <input
                        id="current-password"
                        type="password"
                        placeholder="Enter current password"
                        autoComplete="current-password"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="new-password">New Password</label>
                      <input
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirm-new-password">Confirm New Password</label>
                      <input
                        id="confirm-new-password"
                        type="password"
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                      />
                    </div>
                    <button className="btn btn-primary">Update Password</button>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                  {!twoFactorEnabled && !twoFactorSetupUri && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => void handleEnableTwoFactor()}
                      disabled={twoFactorSetupLoading}
                      style={{ marginTop: '0.75rem' }}
                    >
                      {twoFactorSetupLoading ? 'Preparing…' : 'Enable 2FA'}
                    </button>
                  )}

                  {twoFactorEnabled && (
                    <p className="field-hint" style={{ marginTop: '0.75rem', color: '#065f46' }}>
                      2FA is currently enabled on your account.
                    </p>
                  )}

                  {twoFactorSetupUri && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <p className="field-hint" style={{ wordBreak: 'break-word' }}>
                        Scan this URI in your authenticator app: {twoFactorSetupUri}
                      </p>
                      <div className="form-group" style={{ marginTop: '0.75rem' }}>
                        <label htmlFor="two-factor-code">Verification code</label>
                        <input
                          id="two-factor-code"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={twoFactorCode}
                          onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter 6-digit code"
                        />
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => void handleVerifyTwoFactor()}
                        disabled={twoFactorVerifyLoading}
                      >
                        {twoFactorVerifyLoading ? 'Verifying…' : 'Verify & Activate 2FA'}
                      </button>
                    </div>
                  )}

                  {twoFactorSetupError && (
                    <p
                      className="field-hint"
                      role="alert"
                      style={{ color: '#b91c1c', marginTop: '0.75rem' }}
                    >
                      {twoFactorSetupError}
                    </p>
                  )}

                  {twoFactorVerifyError && (
                    <p
                      className="field-hint"
                      role="alert"
                      style={{ color: '#b91c1c', marginTop: '0.75rem' }}
                    >
                      {twoFactorVerifyError}
                    </p>
                  )}

                  {twoFactorVerifySuccess && (
                    <p
                      className="field-hint"
                      role="status"
                      style={{ color: '#065f46', marginTop: '0.75rem' }}
                    >
                      {twoFactorVerifySuccess}
                    </p>
                  )}

                  {twoFactorEnabled && (
                    <div style={{ marginTop: '1rem' }}>
                      <div className="form-group" style={{ marginTop: 0 }}>
                        <label htmlFor="disable-two-factor-password">Current password</label>
                        <input
                          id="disable-two-factor-password"
                          type="password"
                          autoComplete="current-password"
                          value={twoFactorDisablePassword}
                          onChange={e => setTwoFactorDisablePassword(e.target.value)}
                          placeholder="Enter current password"
                        />
                      </div>
                      <button
                        className="btn btn-danger"
                        onClick={() => void handleDisableTwoFactor()}
                        disabled={twoFactorDisableLoading}
                      >
                        {twoFactorDisableLoading ? 'Disabling…' : 'Disable 2FA'}
                      </button>
                      {twoFactorDisableError && (
                        <p
                          className="field-hint"
                          role="alert"
                          style={{ color: '#b91c1c', marginTop: '0.75rem' }}
                        >
                          {twoFactorDisableError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="info-card danger">
                  <h3>Danger Zone</h3>
                  <p>Permanently delete your account and all associated data</p>
                  <button className="btn btn-danger">Delete Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
