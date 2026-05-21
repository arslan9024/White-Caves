import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useUserProfile } from '../../hooks/useUserProfile';
import { BiometricSetup } from '../../features/auth/components/BiometricLogin';
import { authFetch } from '../../utils/authFetch';
import { isCreatorRole } from '../../config/ROLE_TAB_MAPPING';

// â”€â”€â”€ Luxury Styles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0A0A0A',
    color: '#F5F5F0',
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,
  hero: {
    position: 'relative' as const,
    background: 'linear-gradient(135deg, #141414 0%, #1a1205 50%, #141414 100%)',
    borderBottom: '1px solid #C9A84C33',
    padding: '0 0 32px',
    overflow: 'hidden' as const,
  } as React.CSSProperties,
  heroCover: {
    height: '140px',
    background: 'linear-gradient(135deg, #C9A84C22 0%, #0A0A0A 100%)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  } as React.CSSProperties,
  heroCoverPattern: {
    position: 'absolute' as const,
    inset: 0,
    backgroundImage:
      'repeating-linear-gradient(45deg, #C9A84C08 0px, #C9A84C08 1px, transparent 1px, transparent 30px)',
  } as React.CSSProperties,
  heroContent: {
    padding: '0 40px',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '24px',
    marginTop: '-40px',
  } as React.CSSProperties,
  avatarRing: {
    width: '88px',
    height: '88px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #C9A84C, #8B6914)',
    padding: '3px',
    flexShrink: 0 as const,
    boxShadow: '0 0 0 3px #0A0A0A, 0 8px 24px rgba(201,168,76,0.3)',
  } as React.CSSProperties,
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: '#141414',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 700,
    color: '#C9A84C',
    overflow: 'hidden' as const,
  } as React.CSSProperties,
  heroInfo: {
    flex: 1,
    paddingBottom: '4px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  } as React.CSSProperties,
  heroName: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#F5F5F0',
    margin: 0,
    letterSpacing: '-0.5px',
  } as React.CSSProperties,
  heroMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  heroEmail: {
    fontSize: '13px',
    color: '#9CA3AF',
  } as React.CSSProperties,
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 10px',
    borderRadius: '20px',
    background: '#C9A84C22',
    border: '1px solid #C9A84C44',
    color: '#C9A84C',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.3px',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,
  founderBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 10px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #C9A84C33, #8B691433)',
    border: '1px solid #C9A84C',
    color: '#C9A84C',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    boxShadow: '0 0 12px rgba(201,168,76,0.2)',
  } as React.CSSProperties,
  heroActions: {
    display: 'flex',
    gap: '10px',
    paddingBottom: '4px',
    flexShrink: 0 as const,
  } as React.CSSProperties,
  statsRow: {
    display: 'flex',
    gap: '12px',
    padding: '20px 40px 0',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  statCard: {
    flex: '1 1 120px',
    background: '#141414',
    border: '1px solid #2A2A2A',
    borderRadius: '10px',
    padding: '14px 18px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  } as React.CSSProperties,
  statValue: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#C9A84C',
  } as React.CSSProperties,
  statLabel: {
    fontSize: '11px',
    color: '#6B7280',
    letterSpacing: '0.3px',
  } as React.CSSProperties,
  tabsRow: {
    display: 'flex',
    gap: '0',
    padding: '0 40px',
    borderBottom: '1px solid #1E1E1E',
    background: '#0A0A0A',
    overflowX: 'auto' as const,
  } as React.CSSProperties,
  tabBtn: (active: boolean) =>
    ({
      padding: '14px 20px',
      background: 'transparent',
      border: 'none',
      borderBottom: active ? '2px solid #C9A84C' : '2px solid transparent',
      color: active ? '#C9A84C' : '#6B7280',
      fontSize: '13px',
      fontWeight: active ? 600 : 400,
      cursor: 'pointer',
      whiteSpace: 'nowrap' as const,
      transition: 'all 0.15s ease',
      letterSpacing: '0.2px',
    }) as React.CSSProperties,
  body: {
    padding: '32px 40px',
    maxWidth: '900px',
  } as React.CSSProperties,
  card: {
    background: '#141414',
    border: '1px solid #2A2A2A',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
  } as React.CSSProperties,
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#F5F5F0',
    margin: '0 0 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #1E1E1E',
  } as React.CSSProperties,
  infoLabel: {
    width: '160px',
    fontSize: '12px',
    color: '#6B7280',
    flexShrink: 0,
  } as React.CSSProperties,
  infoValue: {
    fontSize: '13px',
    color: '#F5F5F0',
  } as React.CSSProperties,
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  } as React.CSSProperties,
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    marginBottom: '16px',
  } as React.CSSProperties,
  label: {
    fontSize: '12px',
    color: '#9CA3AF',
    letterSpacing: '0.3px',
  } as React.CSSProperties,
  input: {
    padding: '10px 14px',
    background: '#0A0A0A',
    border: '1px solid #2A2A2A',
    borderRadius: '8px',
    color: '#F5F5F0',
    fontSize: '13px',
    outline: 'none',
  } as React.CSSProperties,
  select: {
    padding: '10px 14px',
    background: '#0A0A0A',
    border: '1px solid #2A2A2A',
    borderRadius: '8px',
    color: '#F5F5F0',
    fontSize: '13px',
    outline: 'none',
  } as React.CSSProperties,
  btnPrimary: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #C9A84C, #8B6914)',
    border: 'none',
    borderRadius: '8px',
    color: '#0A0A0A',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.3px',
  } as React.CSSProperties,
  btnSecondary: {
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid #C9A84C',
    borderRadius: '8px',
    color: '#C9A84C',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  } as React.CSSProperties,
  btnDanger: {
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid #EF4444',
    borderRadius: '8px',
    color: '#EF4444',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  } as React.CSSProperties,
  hint: {
    fontSize: '11px',
    color: '#6B7280',
  } as React.CSSProperties,
  comingSoon: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 40px',
    color: '#4B5563',
    gap: '12px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#141414',
    border: '1px solid #2A2A2A',
    borderRadius: '8px',
    color: '#9CA3AF',
    fontSize: '12px',
    cursor: 'pointer',
    textDecoration: 'none',
  } as React.CSSProperties,
};

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const PROFILE_TABS = [
  { id: 'overview', label: 'ðŸ“Š Overview' },
  { id: 'activity', label: 'âš¡ Activity' },
  { id: 'performance', label: 'ðŸ“ˆ Performance' },
  { id: 'settings', label: 'âš™ï¸ Settings' },
  { id: 'security', label: 'ðŸ”’ Security' },
  { id: 'permissions', label: 'ðŸ›¡ï¸ Permissions' },
  { id: 'system', label: 'ðŸ–¥ï¸ System' },
] as const;

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

  const isFounder = isCreatorRole(userRole?.role ?? '');

  const normalizeDashboardRole = (role: string): string => {
    if (role === 'lion' || role === 'managing_director' || role === 'md') return 'owner';
    return role;
  };

  // â”€â”€â”€ 2FA state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      .then(r => r.json())
      .then(payload => {
        if (!cancelled && payload.success) {
          setTwoFactorEnabled(Boolean(payload.data?.twoFactorEnabled));
        }
      })
      .catch(() => {});
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
      const res = await authFetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const payload = await res.json();
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
      const res = await authFetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email ?? '', code }),
      });
      const payload = await res.json();
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
      const res = await authFetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: password }),
      });
      const payload = await res.json();
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

  if (!user) return null;

  const avatarSrc =
    user.photo ||
    user.photoURL ||
    ((user as Record<string, unknown>).photoUrl as string | undefined);
  const initials = (user.name || user.email || 'U')[0].toUpperCase();
  const roleLabel = userRole ? getRoleLabel(userRole.role) : 'No role';

  // â”€â”€â”€ Tab content renderer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div style={styles.grid2}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>ðŸ‘¤ Account Information</h3>
                {[
                  { label: 'Full Name', value: user.name || 'Not set' },
                  { label: 'Email', value: user.email || 'Not set' },
                  { label: 'Phone', value: user.phone || 'Not set' },
                  {
                    label: 'Language',
                    value: profileLanguage === 'ar' ? 'Arabic ðŸ‡¦ðŸ‡ª' : 'English ðŸ‡¬ðŸ‡§',
                  },
                  { label: 'Role', value: roleLabel },
                ].map(row => (
                  <div key={row.label} style={styles.infoRow}>
                    <span style={styles.infoLabel}>{row.label}</span>
                    <span style={styles.infoValue}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div style={styles.card}>
                <h3 style={styles.cardTitle}>ðŸ”— Connected Accounts</h3>
                {[
                  { icon: 'G', name: 'Google', status: 'Connected', color: '#4285F4' },
                  { icon: 'f', name: 'Facebook', status: 'Not connected', color: '#1877F2' },
                  { icon: 'A', name: 'Apple', status: 'Not connected', color: '#F5F5F0' },
                ].map(acc => (
                  <div
                    key={acc.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 0',
                      borderBottom: '1px solid #1E1E1E',
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: `${acc.color}22`,
                        color: acc.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {acc.icon}
                    </span>
                    <span style={{ flex: 1, fontSize: 13, color: '#F5F5F0' }}>{acc.name}</span>
                    <span
                      style={{
                        fontSize: 11,
                        color: acc.status === 'Connected' ? '#22C55E' : '#6B7280',
                      }}
                    >
                      {acc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {isFounder && (
              <div
                style={{
                  ...styles.card,
                  borderColor: '#C9A84C44',
                  background: 'linear-gradient(135deg, #141414 0%, #1a1205 100%)',
                }}
              >
                <h3 style={{ ...styles.cardTitle, color: '#C9A84C' }}>ðŸ‘‘ Founder Panel</h3>
                <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 16px' }}>
                  You are the platform creator of White Caves Real Estate LLC. You have unrestricted
                  access to all features, modules, and system settings.
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[
                    'System Health',
                    'All Agents',
                    'All CRM Modules',
                    'Admin Dashboard',
                    'AI Registry',
                  ].map(item => (
                    <span
                      key={item}
                      style={{
                        padding: '4px 12px',
                        background: '#C9A84C15',
                        border: '1px solid #C9A84C33',
                        borderRadius: 20,
                        fontSize: 11,
                        color: '#C9A84C',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        );

      case 'settings':
        return (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>âš™ï¸ Profile Settings</h3>
            <div style={styles.grid2}>
              <div>
                <div style={styles.formGroup}>
                  <label htmlFor="profile-name" style={styles.label}>
                    Full Name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    placeholder="Enter your name"
                    autoComplete="name"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label htmlFor="profile-email" style={styles.label}>
                    Email Address
                  </label>
                  <input
                    id="profile-email"
                    type="email"
                    value={user.email || ''}
                    placeholder="Email"
                    disabled
                    autoComplete="email"
                    style={{ ...styles.input, opacity: 0.5 }}
                  />
                  <span style={styles.hint}>Email cannot be changed</span>
                </div>
              </div>
              <div>
                <div style={styles.formGroup}>
                  <label htmlFor="profile-phone" style={styles.label}>
                    Phone Number
                  </label>
                  <input
                    id="profile-phone"
                    type="tel"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    autoComplete="tel"
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label htmlFor="profile-language" style={styles.label}>
                    Preferred Language
                  </label>
                  <select
                    id="profile-language"
                    value={profileLanguage}
                    onChange={e => setProfileLanguage(e.target.value)}
                    style={styles.select}
                  >
                    <option value="en">English ðŸ‡¬ðŸ‡§</option>
                    <option value="ar">Arabic ðŸ‡¦ðŸ‡ª</option>
                  </select>
                </div>
              </div>
            </div>
            <button style={styles.btnPrimary} onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? 'Savingâ€¦' : 'ðŸ’¾ Save Changes'}
            </button>
          </div>
        );

      case 'security':
        return (
          <>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>ðŸ”‘ Biometric Login</h3>
              <BiometricSetup />
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>ðŸ” Two-Factor Authentication</h3>
              <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 16px' }}>
                Add an extra layer of security to your account
              </p>

              {!twoFactorEnabled && !twoFactorSetupUri && (
                <button
                  style={styles.btnSecondary}
                  onClick={() => void handleEnableTwoFactor()}
                  disabled={twoFactorSetupLoading}
                >
                  {twoFactorSetupLoading ? 'Preparingâ€¦' : 'ðŸ›¡ï¸ Enable 2FA'}
                </button>
              )}
              {twoFactorEnabled && (
                <p style={{ color: '#22C55E', fontSize: 13 }}>
                  âœ… 2FA is currently enabled on your account.
                </p>
              )}
              {twoFactorSetupUri && (
                <div>
                  <p style={{ ...styles.hint, wordBreak: 'break-all', marginBottom: 12 }}>
                    Scan this URI in your authenticator app: {twoFactorSetupUri}
                  </p>
                  <div style={styles.formGroup}>
                    <label htmlFor="two-factor-code" style={styles.label}>
                      Verification Code
                    </label>
                    <input
                      id="two-factor-code"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={twoFactorCode}
                      onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit code"
                      style={styles.input}
                    />
                  </div>
                  <button
                    style={styles.btnPrimary}
                    onClick={() => void handleVerifyTwoFactor()}
                    disabled={twoFactorVerifyLoading}
                  >
                    {twoFactorVerifyLoading ? 'Verifyingâ€¦' : 'âœ… Verify & Activate 2FA'}
                  </button>
                </div>
              )}
              {twoFactorSetupError && (
                <p role="alert" style={{ color: '#EF4444', fontSize: 12, marginTop: 8 }}>
                  {twoFactorSetupError}
                </p>
              )}
              {twoFactorVerifyError && (
                <p role="alert" style={{ color: '#EF4444', fontSize: 12, marginTop: 8 }}>
                  {twoFactorVerifyError}
                </p>
              )}
              {twoFactorVerifySuccess && (
                <p role="status" style={{ color: '#22C55E', fontSize: 12, marginTop: 8 }}>
                  {twoFactorVerifySuccess}
                </p>
              )}

              {twoFactorEnabled && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #2A2A2A' }}>
                  <div style={styles.formGroup}>
                    <label htmlFor="disable-two-factor-password" style={styles.label}>
                      Current Password (to disable 2FA)
                    </label>
                    <input
                      id="disable-two-factor-password"
                      type="password"
                      autoComplete="current-password"
                      value={twoFactorDisablePassword}
                      onChange={e => setTwoFactorDisablePassword(e.target.value)}
                      placeholder="Enter current password"
                      style={styles.input}
                    />
                  </div>
                  <button
                    style={styles.btnDanger}
                    onClick={() => void handleDisableTwoFactor()}
                    disabled={twoFactorDisableLoading}
                  >
                    {twoFactorDisableLoading ? 'Disabling...' : 'Disable 2FA'}
                  </button>
                  {twoFactorDisableError && (
                    <p role="alert" style={{ color: '#EF4444', fontSize: 12, marginTop: 8 }}>
                      {twoFactorDisableError}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div style={{ ...styles.card, borderColor: '#EF444444' }}>
              <h3 style={{ ...styles.cardTitle, color: '#EF4444' }}>Danger Zone</h3>
              <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 16 }}>
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
              <button style={styles.btnDanger}>Delete Account</button>
            </div>
          </>
        );

      case 'activity':
      case 'performance':
      case 'permissions':
      case 'system':
        return (
          <div style={styles.comingSoon}>
            <div style={{ fontSize: 48, opacity: 0.3 }}>
              {activeTab === 'activity'
                ? 'Activity'
                : activeTab === 'performance'
                  ? 'Performance'
                  : activeTab === 'permissions'
                    ? 'Permissions'
                    : 'System'}
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#4B5563' }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tab
            </p>
            <p style={{ fontSize: 13, color: '#374151' }}>Coming in the next sprint</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <div style={styles.hero}>
        {/* Cover Pattern */}
        <div style={styles.heroCover}>
          <div style={styles.heroCoverPattern} />
          {/* Back navigation */}
          <div style={{ position: 'absolute', top: 16, left: 40, display: 'flex', gap: 10 }}>
            <button
              onClick={() => navigate(-1)}
              style={{ ...styles.backBtn, background: '#00000060', border: '1px solid #ffffff20' }}
            >
              Back
            </button>
            {userRole && (
              <Link
                to={`/${normalizeDashboardRole(userRole.role)}/dashboard`}
                style={{
                  ...styles.backBtn,
                  background: '#00000060',
                  border: '1px solid #ffffff20',
                }}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Avatar + Info */}
        <div style={styles.heroContent}>
          <div style={styles.avatarRing}>
            <div style={styles.avatarInner}>
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user.name || 'User'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                initials
              )}
            </div>
          </div>

          <div style={styles.heroInfo}>
            <h1 style={styles.heroName}>{user.name || 'User'}</h1>
            <div style={styles.heroMeta}>
              <span style={styles.heroEmail}>{user.email}</span>
              <span style={styles.roleBadge}>{roleLabel}</span>
              {isFounder && <span style={styles.founderBadge}>ðŸ‘‘ Founder & Creator</span>}
            </div>
          </div>

          <div style={styles.heroActions}>
            <button style={styles.btnSecondary} onClick={() => setActiveTab('settings')}>
              âœï¸ Edit Profile
            </button>
            <button style={styles.btnDanger} onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          {[
            { value: '0', label: 'Saved Properties' },
            { value: '0', label: 'Viewings' },
            { value: '0', label: 'Inquiries' },
            { value: twoFactorEnabled ? 'ðŸŸ¢' : 'ðŸ”´', label: '2FA Status' },
          ].map(stat => (
            <div key={stat.label} style={styles.statCard}>
              <span style={styles.statValue}>{stat.value}</span>
              <span style={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* â”€â”€â”€ Tabs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={styles.tabsRow} role="tablist" aria-label="Profile sections">
        {PROFILE_TABS.map(tab => (
          <button
            key={tab.id}
            style={styles.tabBtn(activeTab === tab.id)}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* â”€â”€â”€ Tab Content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={styles.body} role="tabpanel">
        {renderTab()}
      </div>
    </div>
  );
};

export default ProfilePage;
