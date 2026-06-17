import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useUserProfile } from '../../hooks/useUserProfile';
import { BiometricSetup } from '../../features/auth/components/BiometricLogin';
import { authFetch } from '../../utils/authFetch';
import { isCreatorRole } from '../../config/ROLE_TAB_MAPPING';
import './AuthPages.css';

// ─── Sub-components ───────────────────────────────────────────────────────────

const CompletionRing: FC<{ pct: number; size?: number }> = ({ pct, size = 56 }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const filled = circ * (pct / 100);
  const color = pct === 100 ? '#4ade80' : pct >= 60 ? '#C9A84C' : '#6b7280';
  return (
    <svg width={size} height={size} className="pp-ring" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={6}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        className="pp-ring-progress"
      />
    </svg>
  );
};

interface SetPasswordFormProps {
  userEmail: string;
}
const SetPasswordForm: FC<SetPasswordFormProps> = ({ userEmail }) => {
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const save = useCallback(async () => {
    setMsg(null);
    if (newPw.length < 8) { setMsg({ type: 'error', text: 'Password must be at least 8 characters.' }); return; }
    if (!/[a-zA-Z]/.test(newPw) || !/[0-9]/.test(newPw)) {
      setMsg({ type: 'error', text: 'Password must contain letters and numbers.' }); return;
    }
    if (newPw !== confirmPw) { setMsg({ type: 'error', text: 'Passwords do not match.' }); return; }
    setSaving(true);
    try {
      const res = await authFetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPw }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (data.success) {
        setMsg({ type: 'success', text: 'Password set successfully. You can now sign in with email too.' });
        setNewPw(''); setConfirmPw('');
      } else {
        setMsg({ type: 'error', text: data.error ?? 'Failed to set password.' });
      }
    } catch { setMsg({ type: 'error', text: 'Network error. Try again.' }); }
    finally { setSaving(false); }
  }, [newPw, confirmPw]);

  const strength = newPw.length === 0 ? 0 : newPw.length < 8 ? 1 : newPw.length < 12 ? 2 : 3;
  const strengthColors = ['transparent', '#ef4444', '#C9A84C', '#4ade80'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

  return (
    <div className="pp-set-password">
      <p className="pp-helper">Your account uses Gmail sign-in. Set a password to also enable email+password login.</p>
      <div className="pp-form-row">
        <label htmlFor="sp-new">New Password</label>
        <input id="sp-new" type="password" autoComplete="new-password" value={newPw}
          onChange={e => setNewPw(e.target.value)} placeholder="Min 8 chars, letters + numbers" />
        {newPw.length > 0 && (
          <div className="pp-strength-bar" aria-label={`Password strength: ${strengthLabels[strength]}`}>
            {[1,2,3].map(n => (
              <span key={n} className={`pp-strength-seg pp-strength-seg--${n <= strength ? `s${strength}` : 'empty'}`} />
            ))}
            <span className={`pp-strength-label pp-strength-label--s${strength}`}>{strengthLabels[strength]}</span>
          </div>
        )}
      </div>
      <div className="pp-form-row">
        <label htmlFor="sp-confirm">Confirm Password</label>
        <input id="sp-confirm" type="password" autoComplete="new-password" value={confirmPw}
          onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat password" />
      </div>
      {msg?.type === 'error' && <p className="pp-msg pp-msg--error" role="alert">{msg.text}</p>}
      {msg?.type === 'success' && <p className="pp-msg pp-msg--success" role="status">{msg.text}</p>}
      <button className="pp-btn pp-btn--primary" onClick={() => void save()} disabled={saving}>
        {saving ? 'Saving…' : '🔐 Set Password'}
      </button>
    </div>
  );
};

interface ChangePasswordFormProps { hasPassword: boolean; }
const ChangePasswordForm: FC<ChangePasswordFormProps> = ({ hasPassword }) => {
  const [curr, setCurr] = useState('');
  const [next, setNext] = useState('');
  const [conf, setConf] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const save = useCallback(async () => {
    setMsg(null);
    if (hasPassword && !curr) { setMsg({ type: 'error', text: 'Enter your current password.' }); return; }
    if (next.length < 8) { setMsg({ type: 'error', text: 'New password must be at least 8 characters.' }); return; }
    if (!/[a-zA-Z]/.test(next) || !/[0-9]/.test(next)) {
      setMsg({ type: 'error', text: 'Password must contain letters and numbers.' }); return;
    }
    if (next !== conf) { setMsg({ type: 'error', text: 'Passwords do not match.' }); return; }
    setSaving(true);
    try {
      const res = await authFetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: curr, newPassword: next }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (data.success) {
        setMsg({ type: 'success', text: 'Password updated successfully.' });
        setCurr(''); setNext(''); setConf('');
      } else {
        setMsg({ type: 'error', text: data.error ?? 'Failed to update password.' });
      }
    } catch { setMsg({ type: 'error', text: 'Network error. Try again.' }); }
    finally { setSaving(false); }
  }, [curr, next, conf, hasPassword]);

  return (
    <div className="pp-set-password">
      {hasPassword && (
        <div className="pp-form-row">
          <label htmlFor="cp-curr">Current Password</label>
          <input id="cp-curr" type="password" autoComplete="current-password" value={curr}
            onChange={e => setCurr(e.target.value)} placeholder="Enter current password" />
        </div>
      )}
      <div className="pp-form-row">
        <label htmlFor="cp-next">New Password</label>
        <input id="cp-next" type="password" autoComplete="new-password" value={next}
          onChange={e => setNext(e.target.value)} placeholder="Min 8 chars, letters + numbers" />
      </div>
      <div className="pp-form-row">
        <label htmlFor="cp-conf">Confirm New Password</label>
        <input id="cp-conf" type="password" autoComplete="new-password" value={conf}
          onChange={e => setConf(e.target.value)} placeholder="Repeat new password" />
      </div>
      {msg?.type === 'error' && <p className="pp-msg pp-msg--error" role="alert">{msg.text}</p>}
      {msg?.type === 'success' && <p className="pp-msg pp-msg--success" role="status">{msg.text}</p>}
      <button className="pp-btn pp-btn--primary" onClick={() => void save()} disabled={saving}>
        {saving ? 'Saving…' : '🔐 Update Password'}
      </button>
    </div>
  );
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PROFILE_TABS = [
  { id: 'overview',     label: 'Overview',     icon: '◎' },
  { id: 'settings',     label: 'Profile',      icon: '✦' },
  { id: 'security',     label: 'Security',     icon: '⬡' },
  { id: 'activity',     label: 'Activity',     icon: '⚡' },
  { id: 'performance',  label: 'Performance',  icon: '◈' },
  { id: 'permissions',  label: 'Permissions',  icon: '⬟' },
  { id: 'system',       label: 'System',       icon: '⬕' },
] as const;

const PROFILE_ONBOARDING_SEEN_KEY = 'wc-profile-onboarding-seen';
const EXECUTIVE_OPERATIONS_ROLES = new Set([
  'lion', 'managing_director', 'md', 'owner', 'super_admin', 'super_user', 'admin',
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

  const [activeTab, setActiveTab]   = useState<ProfileTab>('overview');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // 2FA
  const [twoFactorSetupUri, setTwoFactorSetupUri]   = useState<string | null>(null);
  const [twoFactorSetupError, setTwoFactorSetupError] = useState<string | null>(null);
  const [twoFactorSetupLoading, setTwoFactorSetupLoading] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorVerifyLoading, setTwoFactorVerifyLoading] = useState(false);
  const [twoFactorVerifyError, setTwoFactorVerifyError]     = useState<string | null>(null);
  const [twoFactorVerifySuccess, setTwoFactorVerifySuccess] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorDisablePassword, setTwoFactorDisablePassword] = useState('');
  const [twoFactorDisableLoading, setTwoFactorDisableLoading] = useState(false);
  const [twoFactorDisableError, setTwoFactorDisableError] = useState<string | null>(null);

  // Gmail password detection
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const isGmailUser = Boolean(user?.email?.endsWith('@gmail.com') || (user as Record<string, unknown>)?.firebaseUid);

  const isFounder          = isCreatorRole(userRole?.role ?? '');
  const effectiveRole      = (userRole?.role ?? user?.role ?? '').toLowerCase();
  const isExecutiveOperator = EXECUTIVE_OPERATIONS_ROLES.has(effectiveRole);
  const defaultDashboardPath = isExecutiveOperator ? EXECUTIVE_COMPANY_DASHBOARD_PATH : '/crm';
  const dashboardButtonLabel = isExecutiveOperator ? 'Company Dashboard' : 'Dashboard';

  // Profile completion
  const completionItems = [
    { id: 'name',  label: 'Add full name',    complete: Boolean((user?.name || profileName || '').trim()), action: () => setActiveTab('settings') },
    { id: 'phone', label: 'Add phone number', complete: Boolean((user?.phone || profilePhone || '').trim()), action: () => setActiveTab('settings') },
    { id: '2fa',   label: 'Enable 2FA',       complete: twoFactorEnabled, action: () => setActiveTab('security') },
    ...(isGmailUser
      ? [{ id: 'password', label: 'Set a password (Gmail users)', complete: hasPassword === true, action: () => setActiveTab('security') }]
      : []),
  ];
  const completedCount = completionItems.filter(i => i.complete).length;
  const completionPct  = Math.round((completedCount / completionItems.length) * 100);

  useEffect(() => { if (!user) navigate('/signin'); }, [navigate, user]);

  useEffect(() => {
    try { setShowOnboarding(localStorage.getItem(PROFILE_ONBOARDING_SEEN_KEY) !== 'true'); }
    catch { setShowOnboarding(true); }
  }, []);

  useEffect(() => {
    let cancelled = false;
    authFetch('/api/auth/profile')
      .then(r => r.json())
      .then((p: unknown) => {
        const payload = p as { success?: boolean; data?: { twoFactorEnabled?: boolean; hasPassword?: boolean } };
        if (!cancelled && payload.success) {
          setTwoFactorEnabled(Boolean(payload.data?.twoFactorEnabled));
          setHasPassword(Boolean(payload.data?.hasPassword));
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const dismissOnboarding = useCallback(() => {
    setShowOnboarding(false);
    try { localStorage.setItem(PROFILE_ONBOARDING_SEEN_KEY, 'true'); } catch {}
  }, []);

  const goToDashboard = useCallback(() => { dismissOnboarding(); navigate(defaultDashboardPath); }, [defaultDashboardPath, dismissOnboarding, navigate]);
  const goToCockpit   = useCallback(() => { dismissOnboarding(); navigate(EXECUTIVE_COMPANY_DASHBOARD_PATH); }, [dismissOnboarding, navigate]);
  const goToKpis      = useCallback(() => { dismissOnboarding(); navigate('/crm?tab=analytics&cockpit=md'); }, [dismissOnboarding, navigate]);

  // ── 2FA handlers ──────────────────────────────────────────────────────────
  const handleEnableTwoFactor = useCallback(async () => {
    setTwoFactorSetupLoading(true); setTwoFactorSetupError(null);
    setTwoFactorVerifyError(null); setTwoFactorVerifySuccess(null); setTwoFactorDisableError(null);
    try {
      const res  = await authFetch('/api/auth/2fa/setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      const data = await res.json() as { success?: boolean; data?: { otpAuthUrl?: string }; error?: string };
      if (data.success && data.data?.otpAuthUrl) { setTwoFactorSetupUri(data.data.otpAuthUrl); setTwoFactorCode(''); }
      else { setTwoFactorSetupError(data.error ?? 'Unable to start 2FA setup.'); }
    } catch { setTwoFactorSetupError('Unable to start 2FA setup. Please try again.'); }
    finally { setTwoFactorSetupLoading(false); }
  }, []);

  const handleVerifyTwoFactor = useCallback(async () => {
    const code = twoFactorCode.trim();
    if (!/^\d{6}$/.test(code)) { setTwoFactorVerifyError('Please enter a valid 6-digit code.'); return; }
    setTwoFactorVerifyLoading(true); setTwoFactorVerifyError(null); setTwoFactorVerifySuccess(null);
    try {
      const res  = await authFetch('/api/auth/2fa/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: user?.email ?? '', code }) });
      const data = await res.json() as { success?: boolean; error?: string };
      if (data.success) { setTwoFactorEnabled(true); setTwoFactorSetupUri(null); setTwoFactorCode(''); setTwoFactorVerifySuccess('Two-factor authentication is now enabled.'); }
      else { setTwoFactorVerifyError(data.error ?? 'Invalid verification code.'); }
    } catch { setTwoFactorVerifyError('Unable to verify code. Please try again.'); }
    finally { setTwoFactorVerifyLoading(false); }
  }, [twoFactorCode, user?.email]);

  const handleDisableTwoFactor = useCallback(async () => {
    const password = twoFactorDisablePassword.trim();
    if (!password) { setTwoFactorDisableError('Please enter your current password.'); return; }
    setTwoFactorDisableLoading(true); setTwoFactorDisableError(null);
    try {
      const res  = await authFetch('/api/auth/2fa/disable', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: password }) });
      const data = await res.json() as { success?: boolean; error?: string };
      if (data.success) { setTwoFactorEnabled(false); setTwoFactorSetupUri(null); setTwoFactorCode(''); setTwoFactorDisablePassword(''); setTwoFactorVerifySuccess('2FA has been disabled.'); }
      else { setTwoFactorDisableError(data.error ?? 'Unable to disable 2FA.'); }
    } catch { setTwoFactorDisableError('Unable to disable 2FA. Please try again.'); }
    finally { setTwoFactorDisableLoading(false); }
  }, [twoFactorDisablePassword]);

  if (!user) return null;

  const avatarSrc = user.photo || user.photoURL || ((user as Record<string, unknown>).photoUrl as string | undefined);
  const initials  = (user.name || user.email || 'U')[0].toUpperCase();
  const roleLabel = userRole ? getRoleLabel(userRole.role) : 'No role';

  // ── Tab renderer ──────────────────────────────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <section className="pp-section" aria-labelledby="tab-overview">
            <h2 id="tab-overview" className="pp-section-title">Overview</h2>
            <p className="pp-section-sub">Your account at a glance.</p>

            {/* Completion banner */}
            {completionPct < 100 && showOnboarding && (
              <div className="pp-banner" role="status">
                <div className="pp-banner__left">
                  <CompletionRing pct={completionPct} />
                  <div>
                    <strong>{completionPct}% complete</strong>
                    <span className="pp-banner__sub">{completedCount}/{completionItems.length} essentials done</span>
                  </div>
                </div>
                <ul className="pp-checklist">
                  {completionItems.map(item => (
                    <li key={item.id} className={`pp-check${item.complete ? ' pp-check--done' : ''}`} onClick={item.complete ? undefined : item.action} role={item.complete ? 'listitem' : 'button'} tabIndex={item.complete ? undefined : 0} onKeyDown={item.complete ? undefined : (e) => { if (e.key === 'Enter') item.action(); }}>
                      <span aria-hidden="true">{item.complete ? '✓' : '○'}</span> {item.label}
                    </li>
                  ))}
                </ul>
                <button className="pp-btn pp-btn--ghost pp-banner__dismiss" onClick={dismissOnboarding} aria-label="Dismiss banner">✕</button>
              </div>
            )}

            <div className="pp-cards">
              {/* Account card */}
              <div className="pp-card">
                <h3 className="pp-card-title">Account</h3>
                <dl className="pp-dl">
                  {[
                    ['Name',     user.name || '—'],
                    ['Email',    user.email || '—'],
                    ['Phone',    user.phone || '—'],
                    ['Language', profileLanguage === 'ar' ? 'Arabic' : 'English'],
                    ['Role',     roleLabel],
                  ].map(([k, v]) => (
                    <div key={k} className="pp-dl-row"><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              </div>

              {/* Security quick-status */}
              <div className="pp-card">
                <h3 className="pp-card-title">Security</h3>
                <div className="pp-security-grid">
                  <div className={`pp-sec-item ${twoFactorEnabled ? 'pp-sec-item--ok' : 'pp-sec-item--warn'}`}>
                    <span aria-hidden="true">{twoFactorEnabled ? '✓' : '!'}</span>
                    <span>2FA {twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  {isGmailUser && (
                    <div className={`pp-sec-item ${hasPassword ? 'pp-sec-item--ok' : 'pp-sec-item--warn'}`}>
                      <span aria-hidden="true">{hasPassword ? '✓' : '!'}</span>
                      <span>Password {hasPassword ? 'Set' : 'Not set'}</span>
                    </div>
                  )}
                  <div className="pp-sec-item pp-sec-item--ok">
                    <span aria-hidden="true">G</span>
                    <span>Google {isGmailUser ? 'Connected' : 'Not linked'}</span>
                  </div>
                </div>
                <button className="pp-btn pp-btn--ghost pp-card-cta" onClick={() => setActiveTab('security')}>
                  Manage Security →
                </button>
              </div>

              {/* Executive cockpit */}
              {isExecutiveOperator && (
                <div className="pp-card pp-card--gold">
                  <h3 className="pp-card-title">Executive Cockpit</h3>
                  <div className="pp-pills">
                    {['Portfolio: Live', 'Lead Ops: Active', 'AI: Online', 'Compliance: OK'].map(pill => (
                      <span key={pill} className="pp-pill">{pill}</span>
                    ))}
                  </div>
                  <div className="pp-card-actions">
                    <button className="pp-btn pp-btn--primary" onClick={goToCockpit}>Open Cockpit</button>
                    <button className="pp-btn pp-btn--ghost"   onClick={goToDashboard}>Unified CRM</button>
                    <button className="pp-btn pp-btn--ghost"   onClick={goToKpis}>KPIs</button>
                  </div>
                </div>
              )}

              {/* Founder badge */}
              {isFounder && (
                <div className="pp-card pp-card--gold">
                  <h3 className="pp-card-title">Founder &amp; Creator</h3>
                  <p className="pp-card-body">Platform owner with unrestricted access to all modules and system settings.</p>
                  <div className="pp-pills">
                    {['System Health', 'All Agents', 'CRM Modules', 'Admin', 'AI Registry'].map(b => (
                      <span key={b} className="pp-pill">{b}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        );

      case 'settings':
        return (
          <section className="pp-section" aria-labelledby="tab-settings">
            <h2 id="tab-settings" className="pp-section-title">Profile Settings</h2>
            <p className="pp-section-sub">Update your personal information</p>
            <div className="pp-form pp-card">
              <div className="pp-form-row">
                <label htmlFor="pf-name">Full Name</label>
                <input id="pf-name" type="text" value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Enter your full name" autoComplete="name" />
              </div>
              <div className="pp-form-row">
                <label htmlFor="pf-email">Email Address</label>
                <input id="pf-email" type="email" value={user.email || ''} disabled autoComplete="email" />
                <span className="pp-hint">Email is managed by your sign-in provider</span>
              </div>
              <div className="pp-form-row">
                <label htmlFor="pf-phone">Phone Number</label>
                <input id="pf-phone" type="tel" value={profilePhone} onChange={e => setProfilePhone(e.target.value)} placeholder="+971 50 123 4567" autoComplete="tel" />
              </div>
              <div className="pp-form-row">
                <label htmlFor="pf-lang">Language</label>
                <select id="pf-lang" value={profileLanguage} onChange={e => setProfileLanguage(e.target.value)}>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
              <button className="pp-btn pp-btn--primary" onClick={() => void handleSaveProfile()} disabled={isSaving}>
                {isSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </section>
        );

      case 'security':
        return (
          <section className="pp-section" aria-labelledby="tab-security">
            <h2 id="tab-security" className="pp-section-title">Security</h2>
            <p className="pp-section-sub">Protect your account with strong authentication</p>
            <div className="pp-cards">

              {/* Gmail password setup */}
              {isGmailUser && hasPassword === false && (
                <div className="pp-card pp-card--highlight">
                  <h3 className="pp-card-title">
                    <span className="pp-badge pp-badge--warn" aria-hidden="true">!</span>
                    Set a Password
                  </h3>
                  <p className="pp-card-body">Your account was created with Google. Adding a password lets you also sign in with email+password as a fallback.</p>
                  <SetPasswordForm userEmail={user.email ?? ''} />
                </div>
              )}

              {/* Change password (has existing password) */}
              {hasPassword === true && (
                <div className="pp-card">
                  <h3 className="pp-card-title">Change Password</h3>
                  <ChangePasswordForm hasPassword={true} />
                </div>
              )}

              {/* Gmail already has password — still allow change */}
              {isGmailUser && hasPassword === true && (
                <p className="pp-hint pp-hint--inline">✓ Password is already set for your Gmail account.</p>
              )}

              {/* 2FA */}
              <div className="pp-card">
                <h3 className="pp-card-title">Two-Factor Authentication</h3>
                <p className="pp-card-body">
                  {twoFactorEnabled
                    ? '✅ 2FA is active. Your account is protected with a one-time code on every login.'
                    : 'Add an extra layer of protection to your account.'}
                </p>

                {!twoFactorEnabled && !twoFactorSetupUri && (
                  <button className="pp-btn pp-btn--primary" onClick={() => void handleEnableTwoFactor()} disabled={twoFactorSetupLoading}>
                    {twoFactorSetupLoading ? 'Preparing…' : 'Enable 2FA'}
                  </button>
                )}

                {twoFactorSetupUri && (
                  <div className="pp-2fa-setup">
                    <p className="pp-hint">Scan this in your authenticator app (Google Authenticator, Authy, etc.):</p>
                    <code className="pp-code">{twoFactorSetupUri}</code>
                    <div className="pp-form-row">
                      <label htmlFor="pp-2fa-code">6-digit code from app</label>
                      <input id="pp-2fa-code" type="text" inputMode="numeric" maxLength={6} value={twoFactorCode}
                        onChange={e => setTwoFactorCode(e.target.value.replace(/\D/g, ''))} placeholder="000000" />
                    </div>
                    <button className="pp-btn pp-btn--primary" onClick={() => void handleVerifyTwoFactor()} disabled={twoFactorVerifyLoading}>
                      {twoFactorVerifyLoading ? 'Verifying…' : 'Activate 2FA'}
                    </button>
                  </div>
                )}

                {twoFactorSetupError && <p className="pp-msg pp-msg--error" role="alert">{twoFactorSetupError}</p>}
                {twoFactorVerifyError && <p className="pp-msg pp-msg--error" role="alert">{twoFactorVerifyError}</p>}
                {twoFactorVerifySuccess && <p className="pp-msg pp-msg--success" role="status">{twoFactorVerifySuccess}</p>}

                {twoFactorEnabled && (
                  <div className="pp-2fa-disable">
                    <div className="pp-form-row">
                      <label htmlFor="pp-2fa-disable-pw">Current password (to disable 2FA)</label>
                      <input id="pp-2fa-disable-pw" type="password" autoComplete="current-password" value={twoFactorDisablePassword}
                        onChange={e => setTwoFactorDisablePassword(e.target.value)} placeholder="Enter current password" />
                    </div>
                    <button className="pp-btn pp-btn--danger" onClick={() => void handleDisableTwoFactor()} disabled={twoFactorDisableLoading}>
                      {twoFactorDisableLoading ? 'Disabling…' : 'Disable 2FA'}
                    </button>
                    {twoFactorDisableError && <p className="pp-msg pp-msg--error" role="alert">{twoFactorDisableError}</p>}
                  </div>
                )}
              </div>

              {/* Biometric */}
              <div className="pp-card">
                <h3 className="pp-card-title">Biometric Login</h3>
                <BiometricSetup />
              </div>

              {/* Danger zone */}
              <div className="pp-card pp-card--danger">
                <h3 className="pp-card-title">Danger Zone</h3>
                <p className="pp-card-body">Permanently delete your account. This action cannot be undone.</p>
                <button className="pp-btn pp-btn--danger">Delete Account</button>
              </div>
            </div>
          </section>
        );

      default:
        return (
          <section className="pp-section" aria-labelledby={`tab-${activeTab}`}>
            <h2 id={`tab-${activeTab}`} className="pp-section-title">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <div className="pp-card pp-card--placeholder">
              <p className="pp-placeholder-text">Coming in the next sprint ✦</p>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="pp-root" data-theme="dark">
      {/* ── Left rail ── */}
      <aside className="pp-rail" aria-label="Profile navigation">
        <Link to="/" className="pp-logo" aria-label="White Caves home">
          <img src="/company-logo.jpg" alt="" aria-hidden="true" />
          <span>White Caves</span>
        </Link>

        {/* Avatar + completion ring */}
        <div className="pp-user-card">
          <div className="pp-avatar-wrap" aria-label={`Profile ${completionPct}% complete`}>
            <div className="pp-avatar">
              {avatarSrc ? <img src={avatarSrc} alt={user.name || 'User avatar'} /> : <span aria-hidden="true">{initials}</span>}
            </div>
            <div className="pp-avatar-ring">
              <CompletionRing pct={completionPct} size={72} />
            </div>
          </div>
          <h3 className="pp-user-name">{user.name || 'User'}</h3>
          <p className="pp-user-email">{user.email || '—'}</p>
          <span className="pp-role-badge">{roleLabel}</span>
          {isFounder && <span className="pp-role-badge pp-role-badge--gold">Founder</span>}
          <span className="pp-completion-label">{completionPct}% profile complete</span>
        </div>

        {/* Tab nav */}
        <nav className="pp-nav" role="tablist" aria-label="Profile sections">
          {PROFILE_TABS.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`pp-nav-item${activeTab === tab.id ? ' pp-nav-item--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="pp-nav-icon" aria-hidden="true">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="pp-rail-footer">
          <button className="pp-nav-item pp-nav-item--cta" onClick={goToDashboard}>
            <span aria-hidden="true">⬟</span>
            <span>{dashboardButtonLabel}</span>
          </button>
          {isExecutiveOperator && (
            <button className="pp-nav-item" onClick={goToCockpit}>
              <span aria-hidden="true">◆</span>
              <span>Cockpit</span>
            </button>
          )}
          <Link to="/" className="pp-nav-item">
            <span aria-hidden="true">◎</span>
            <span>Homepage</span>
          </Link>
          <button className="pp-nav-item pp-nav-item--logout" onClick={() => void handleLogout()}>
            <span aria-hidden="true">↩</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="pp-main" role="tabpanel">
        {renderTab()}
      </main>
    </div>
  );
};

export default ProfilePage;

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
