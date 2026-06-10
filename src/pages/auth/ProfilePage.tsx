import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useUserProfile } from '../../hooks/useUserProfile';
import { BiometricSetup } from '../../features/auth/components/BiometricLogin';
import { authFetch } from '../../utils/authFetch';
import { isCreatorRole } from '../../config/ROLE_TAB_MAPPING';
import './AuthPages.css';

const PROFILE_TABS = [
  { id: 'overview', label: '📊 Overview' },
  { id: 'activity', label: '⚡ Activity' },
  { id: 'performance', label: '📈 Performance' },
  { id: 'settings', label: '⚙️ Settings' },
  { id: 'security', label: '🔒 Security' },
  { id: 'permissions', label: '🛡️ Permissions' },
  { id: 'system', label: '🖥️ System' },
] as const;

const PROFILE_ONBOARDING_SEEN_KEY = 'wc-profile-onboarding-seen';
const EXECUTIVE_OPERATIONS_ROLES = new Set([
  'lion',
  'managing_director',
  'md',
  'owner',
  'super_admin',
  'super_user',
  'admin',
]);

const EXECUTIVE_COMPANY_DASHBOARD_PATH = '/crm?tab=overview&cockpit=md';

type ProfileTab = (typeof PROFILE_TABS)[number]['id'];

const ProfilePage: FC = () => {
  useDocumentTitle('My Profile');
  const navigate = useNavigate();
  const {
    user,
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

  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [showProfileOnboarding, setShowProfileOnboarding] = useState(false);
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

  const isFounder = isCreatorRole(userRole?.role ?? '');
  const effectiveRole = (userRole?.role ?? user?.role ?? '').toLowerCase();
  const isExecutiveOperator = EXECUTIVE_OPERATIONS_ROLES.has(effectiveRole);
  const defaultDashboardPath = isExecutiveOperator
    ? EXECUTIVE_COMPANY_DASHBOARD_PATH
    : '/crm';
  const dashboardButtonLabel = isExecutiveOperator ? 'Company Dashboard' : 'Dashboard';

  const profileSetupItems = [
    { id: 'name', label: 'Add full name', complete: Boolean((user?.name || profileName || '').trim()) },
    { id: 'phone', label: 'Add phone number', complete: Boolean((user?.phone || profilePhone || '').trim()) },
    { id: '2fa', label: 'Enable two-factor authentication', complete: twoFactorEnabled },
  ];

  const profileSetupCompleted = profileSetupItems.filter(item => item.complete).length;
  const profileSetupPercent = Math.round((profileSetupCompleted / profileSetupItems.length) * 100);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [navigate, user]);

  useEffect(() => {
    try {
      const hasSeenOnboarding = localStorage.getItem(PROFILE_ONBOARDING_SEEN_KEY) === 'true';
      setShowProfileOnboarding(!hasSeenOnboarding);
    } catch {
      setShowProfileOnboarding(true);
    }
  }, []);

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
        // no-op: profile page should stay usable even if this check fails
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const markProfileOnboardingSeen = useCallback(() => {
    setShowProfileOnboarding(false);
    try {
      localStorage.setItem(PROFILE_ONBOARDING_SEEN_KEY, 'true');
    } catch {
      // no-op: onboarding remains functional without persistence
    }
  }, []);

  const handleContinueToDashboard = useCallback(() => {
    markProfileOnboardingSeen();
    navigate(defaultDashboardPath);
  }, [defaultDashboardPath, markProfileOnboardingSeen, navigate]);

  const handleOpenOperationsCockpit = useCallback(() => {
    markProfileOnboardingSeen();
    navigate(EXECUTIVE_COMPANY_DASHBOARD_PATH);
  }, [markProfileOnboardingSeen, navigate]);

  const handleOpenExecutiveKpis = useCallback(() => {
    markProfileOnboardingSeen();
    navigate('/crm?tab=analytics&cockpit=md');
  }, [markProfileOnboardingSeen, navigate]);

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
    const code = twoFactorCode.trim();
    if (!/^\d{6}$/.test(code)) {
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
        body: JSON.stringify({ email: user?.email ?? '', code }),
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
  }, [twoFactorCode, user?.email]);

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

  const avatarSrc =
    user.photo ||
    user.photoURL ||
    ((user as Record<string, unknown>).photoUrl as string | undefined);
  const initials = (user.name || user.email || 'U')[0].toUpperCase();
  const roleLabel = userRole ? getRoleLabel(userRole.role) : 'No role';

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <section className="profile-section">
            <h1>Profile Summary</h1>
            <p className="section-subtitle">Review your profile quickly, then continue to CRM when you are ready.</p>

            {showProfileOnboarding && (
              <div className="info-card profile-onboarding" role="status" aria-live="polite">
                <h3>✨ Welcome to your Profile-first workspace</h3>
                <p className="profile-onboarding__text">
                  Finish the essentials below, then continue to the dashboard whenever you are ready.
                </p>

                <div className="profile-checklist">
                  {profileSetupItems.map(item => (
                    <div
                      key={item.id}
                      className={`profile-checklist-item${item.complete ? ' complete' : ''}`}
                    >
                      <span aria-hidden="true">{item.complete ? '✅' : '⬜'}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                <p className="profile-status-message profile-status-message--muted">
                  Setup progress: {profileSetupCompleted}/{profileSetupItems.length} complete ({profileSetupPercent}%)
                </p>

                <div className="profile-actions-row">
                  <button className="btn-primary" onClick={handleContinueToDashboard}>
                    {isExecutiveOperator ? 'Continue to Company Dashboard' : 'Continue to Dashboard'}
                  </button>
                  <button className="btn-secondary" onClick={() => setActiveTab('settings')}>
                    Finish Profile Setup
                  </button>
                  <button className="btn-secondary" onClick={markProfileOnboardingSeen}>
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            <div className="info-cards">
              <div className="info-card">
                <h3>Account Information</h3>
                <div className="info-rows">
                  {[
                    { label: 'Full Name', value: user.name || 'Not set' },
                    { label: 'Email', value: user.email || 'Not set' },
                    { label: 'Phone', value: user.phone || 'Not set' },
                    {
                      label: 'Language',
                      value: profileLanguage === 'ar' ? 'Arabic 🇦🇪' : 'English 🇬🇧',
                    },
                    { label: 'Role', value: roleLabel },
                  ].map(row => (
                    <div key={row.label} className="info-row">
                      <span className="info-label">{row.label}</span>
                      <span className="info-value">{row.value}</span>
                    </div>
                  ))}
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
                      <span className="stat-value">{twoFactorEnabled ? '🟢' : '🔴'}</span>
                      <span className="stat-label">2FA Status</span>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h3>Connected Accounts</h3>
                <div className="connected-accounts">
                  {[
                    { icon: 'G', name: 'Google', status: 'Connected', colorClass: 'google' },
                    { icon: 'f', name: 'Facebook', status: 'Not connected', colorClass: 'facebook' },
                    { icon: 'A', name: 'Apple', status: 'Not connected', colorClass: 'apple' },
                  ].map(acc => (
                    <div key={acc.name} className="account-item">
                      <span className={`account-icon ${acc.colorClass}`}>{acc.icon}</span>
                      <span className="account-name">{acc.name}</span>
                      <span className={`account-status${acc.status === 'Connected' ? ' connected' : ''}`}>
                        {acc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {isFounder && (
                <div className="info-card">
                  <h3>Founder Panel</h3>
                  <p>
                    You are the platform creator of White Caves Real Estate LLC. You have unrestricted access to all
                    features, modules, and system settings.
                  </p>
                  <div className="profile-actions-row">
                    {['System Health', 'All Agents', 'All CRM Modules', 'Admin Dashboard', 'AI Registry'].map(item => (
                      <span key={item} className="role-badge">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {isExecutiveOperator && (
                <div className="info-card">
                  <h3>Executive Operations Cockpit</h3>
                  <p>
                    End-to-end company operations are visible here for Managing Director control across CRM, teams,
                    analytics, finance, and governance.
                  </p>

                  <div className="profile-executive-status" role="list" aria-label="Executive operations status">
                    <span className="profile-status-pill" role="listitem">
                      Portfolio: Live
                    </span>
                    <span className="profile-status-pill" role="listitem">
                      Lead Ops: Active
                    </span>
                    <span className="profile-status-pill" role="listitem">
                      AI Modules: Online
                    </span>
                    <span className="profile-status-pill" role="listitem">
                      Risk & Compliance: Monitored
                    </span>
                  </div>

                  <div className="profile-actions-row">
                    <button className="btn-primary" onClick={handleOpenOperationsCockpit}>
                      Open Operations Cockpit
                    </button>
                    <button className="btn-secondary" onClick={handleContinueToDashboard}>
                      Open Unified CRM
                    </button>
                    <button className="btn-secondary" onClick={handleOpenExecutiveKpis}>
                      Review Executive KPIs
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        );

      case 'settings':
        return (
          <section className="profile-section">
            <h1>Profile Settings</h1>
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
                  placeholder="Email"
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
                  <option value="en">English 🇬🇧</option>
                  <option value="ar">Arabic 🇦🇪</option>
                </select>
              </div>

              <button className="btn-primary" onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? 'Saving…' : '💾 Save Changes'}
              </button>
            </div>
          </section>
        );

      case 'security':
        return (
          <section className="profile-section">
            <h1>Security Settings</h1>
            <p className="section-subtitle">Keep your account locked down with strong authentication</p>

            <div className="security-cards">
              <div className="info-card">
                <h3>Biometric Login</h3>
                <BiometricSetup />
              </div>

              <div className="info-card">
                <h3>Two-Factor Authentication</h3>
                <p>Add an extra layer of security to your account</p>

                {!twoFactorEnabled && !twoFactorSetupUri && (
                  <button
                    className="btn-secondary"
                    onClick={() => void handleEnableTwoFactor()}
                    disabled={twoFactorSetupLoading}
                  >
                    {twoFactorSetupLoading ? 'Preparing…' : '🛡️ Enable 2FA'}
                  </button>
                )}

                {twoFactorEnabled && (
                  <p className="profile-status-message profile-status-message--success">
                    ✅ 2FA is currently enabled on your account.
                  </p>
                )}

                {twoFactorSetupUri && (
                  <div>
                    <p className="input-hint profile-uri">Scan this URI in your authenticator app: {twoFactorSetupUri}</p>
                    <div className="form-group">
                      <label htmlFor="two-factor-code">Verification Code</label>
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
                      className="btn-primary"
                      onClick={() => void handleVerifyTwoFactor()}
                      disabled={twoFactorVerifyLoading}
                    >
                      {twoFactorVerifyLoading ? 'Verifying…' : '✅ Verify & Activate 2FA'}
                    </button>
                  </div>
                )}

                {twoFactorSetupError && (
                  <p role="alert" className="profile-status-message profile-status-message--error">
                    {twoFactorSetupError}
                  </p>
                )}
                {twoFactorVerifyError && (
                  <p role="alert" className="profile-status-message profile-status-message--error">
                    {twoFactorVerifyError}
                  </p>
                )}
                {twoFactorVerifySuccess && (
                  <p role="status" className="profile-status-message profile-status-message--success">
                    {twoFactorVerifySuccess}
                  </p>
                )}

                {twoFactorEnabled && (
                  <div className="settings-section">
                    <div className="form-group">
                      <label htmlFor="disable-two-factor-password">Current Password (to disable 2FA)</label>
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
                      className="btn-danger"
                      onClick={() => void handleDisableTwoFactor()}
                      disabled={twoFactorDisableLoading}
                    >
                      {twoFactorDisableLoading ? 'Disabling…' : 'Disable 2FA'}
                    </button>
                    {twoFactorDisableError && (
                      <p role="alert" className="profile-status-message profile-status-message--error">
                        {twoFactorDisableError}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="info-card danger">
                <h3>Danger Zone</h3>
                <p>Permanently delete your account and all associated data. This cannot be undone.</p>
                <button className="btn-danger">Delete Account</button>
              </div>
            </div>
          </section>
        );

      case 'activity':
      case 'performance':
      case 'permissions':
      case 'system':
        return (
          <section className="profile-section">
            <div className="info-card profile-placeholder">
              <div className="profile-placeholder__icon" aria-hidden="true">
                {activeTab === 'activity'
                  ? 'Activity'
                  : activeTab === 'performance'
                    ? 'Performance'
                    : activeTab === 'permissions'
                      ? 'Permissions'
                      : 'System'}
              </div>
              <p className="profile-placeholder__title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tab</p>
              <p className="profile-placeholder__subtitle">Coming in the next sprint</p>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="auth-page profile-page">
      <div className="profile-container">
        <aside className="profile-sidebar">
          <Link to="/" className="auth-logo">
            <img src="/company-logo.jpg" alt="White Caves" />
            <span>White Caves</span>
          </Link>

          <div className="profile-user-card">
            <div className="profile-avatar">
              {avatarSrc ? <img src={avatarSrc} alt={user.name || 'User'} /> : <span>{initials}</span>}
            </div>
            <h3>{user.name || 'User'}</h3>
            <p>{user.email || 'No email'}</p>
            <span className="role-badge">{roleLabel}</span>
            {isFounder && <span className="role-badge">Founder & Creator</span>}
          </div>

          <nav className="profile-nav" role="tablist" aria-label="Profile sections">
            {PROFILE_TABS.map(tab => (
              <div
                key={tab.id}
                className={`nav-item${activeTab === tab.id ? ' active' : ''}`}
                role="tab"
                tabIndex={0}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={event => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveTab(tab.id);
                  }
                }}
              >
                {tab.label}
              </div>
            ))}
          </nav>

          <div className="profile-nav-actions">
            <div className="nav-divider" />

            <button type="button" className="nav-item" onClick={handleContinueToDashboard}>
              <span aria-hidden="true">🏠</span>
              <span>{dashboardButtonLabel}</span>
            </button>

            {isExecutiveOperator && (
              <button type="button" className="nav-item" onClick={handleOpenOperationsCockpit}>
                <span aria-hidden="true">👑</span>
                <span>Operations Cockpit</span>
              </button>
            )}

            <button
              type="button"
              className="nav-item"
              onClick={() => {
                markProfileOnboardingSeen();
                navigate(-1);
              }}
            >
              <span aria-hidden="true">↩️</span>
              <span>Back</span>
            </button>

            <Link to="/" className="nav-item">
              <span aria-hidden="true">🏡</span>
              <span>Home</span>
            </Link>

            <button type="button" className="nav-item logout" onClick={handleLogout}>
              <span aria-hidden="true">🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        <main className="profile-content">{renderTab()}</main>
      </div>
    </div>
  );
};

export default ProfilePage;
