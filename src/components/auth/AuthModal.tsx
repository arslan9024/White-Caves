import React, { FC, ChangeEvent, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSignIn, USER_CATEGORIES } from '../../hooks/useSignIn';
import { BiometricLoginButton } from '../../features/auth/components/BiometricLogin';
import { SocialAuthButtons } from '../../pages/auth/components/SocialAuthButtons';
import { AuthMethodTabs } from '../../pages/auth/components/AuthMethodTabs';
import { AuthModeSwitch } from '../../pages/auth/components/AuthModeSwitch';
import '../../pages/auth/AuthPages.css';

const AUTH_COPY = {
  en: {
    signInTitle: 'Welcome Back',
    signUpTitle: 'Create Account',
    signInSubtitle: 'Sign in to access your personalized dashboard',
    signUpSubtitle: 'Join White Caves to explore luxury properties in Dubai',
    socialLabel: 'Quick sign in with',
    google: 'Continue with Google (Gmail)',
    facebook: 'Facebook',
    apple: 'Apple',
    email: 'Email',
    phone: 'Phone',
    signInPromptText: 'Already have an account? Sign In',
    signUpPromptText: "Don't have an account? Sign Up",
  },
  ar: {
    signInTitle: 'مرحباً بعودتك',
    signUpTitle: 'إنشاء حساب',
    signInSubtitle: 'سجّل الدخول للوصول إلى لوحة التحكم الخاصة بك',
    signUpSubtitle: 'انضم إلى وايت كيفز لاستكشاف العقارات الفاخرة في دبي',
    socialLabel: 'تسجيل الدخول السريع عبر',
    google: 'المتابعة باستخدام جوجل (Gmail)',
    facebook: 'فيسبوك',
    apple: 'آبل',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    signInPromptText: 'لديك حساب بالفعل؟ سجّل الدخول',
    signUpPromptText: 'ليس لديك حساب؟ أنشئ حساباً',
  },
} as const;

const getAuthLocale = (): keyof typeof AUTH_COPY => {
  if (typeof document === 'undefined') return 'en';
  const lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();
  return lang.startsWith('ar') ? 'ar' : 'en';
};

interface AuthModalProps {
  mode?: 'signin' | 'signup';
  onClose: () => void;
}

const AuthModal: FC<AuthModalProps> = ({ mode: initialMode = 'signin', onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const locale = getAuthLocale();
  const copy = AUTH_COPY[locale];

  useEffect(() => {
    // Basic accessibility trap
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, []);

  const {
    mode,
    step,
    activeTab,
    setActiveTab,
    loading,
    forgotPasswordLoading,
    verifyResetLoading,
    completeResetLoading,
    error,
    setError,
    success,
    resetStage,
    setResetStage,
    resetToken,
    setResetToken,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    socialSyncRecovery,
    socialRetryAttempts,
    remainingSocialRetries,
    isGoogleAuthAvailable,
    googleAuthUnavailableMessage,
    switchMode,
    goBackToStep,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    fullName,
    setFullName,
    selectedCategory,
    setSelectedCategory,
    selectedRole,
    setSelectedRole,
    employeeId,
    setEmployeeId,
    phone,
    setPhone,
    otp,
    setOtp,
    showOtpInput,
    resetOtp,
    twoFactorCode,
    setTwoFactorCode,
    handleTwoFactorSubmit,
    handleSignInSuccess,
    handleSocialAuth,
    retrySocialAuth,
    clearSocialRecovery,
    handleEmailSubmit,
    handleForgotPassword,
    proceedToRoleSelection,
    getRolesForCategory,
    completeSignUp,
  } = useSignIn();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (initialMode === 'signup' && mode === 'signin') {
       switchMode();
    } else if (initialMode === 'signin' && mode === 'signup') {
       switchMode();
    }
  }, [initialMode, mode, switchMode]);

  const retryLimitReached = socialRetryAttempts >= 3;

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const container = modalRef.current;
      if (!container) {
        return;
      }

      const focusable = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);

  return (
    <div
      className="auth-modal-overlay"
      role="presentation"
      onClick={handleClose}
    >
      <div
        className="auth-modal-window"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'signup' ? 'Sign up window' : 'Sign in window'}
        ref={modalRef}
        onClick={event => {
          event.stopPropagation();
        }}
      >
        <button
          type="button"
          className="auth-close-btn"
          onClick={() => {
            onClose();
          }}
          aria-label="Close authentication popup"
          ref={closeButtonRef}
        >
          ×
        </button>

        <Link to="/" className="auth-logo">
          <img src="/company-logo.jpg" alt="White Caves" />
          <span>White Caves</span>
        </Link>

        {step === 1 && (
          <>
            <div className="auth-intro">
              <h1>{mode === 'signup' ? copy.signUpTitle : copy.signInTitle}</h1>
              <p className="auth-subtitle">
                {mode === 'signup' ? copy.signUpSubtitle : copy.signInSubtitle}
              </p>
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  color: '#ef4444',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  marginBottom: '24px',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}
              >
                {error}
              </div>
            )}

            {socialSyncRecovery && (
              <div
                style={{
                  background: 'rgba(245,158,11,0.1)',
                  color: '#f59e0b',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  marginBottom: '24px',
                  border: '1px solid rgba(245,158,11,0.2)',
                }}
              >
                <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>
                  {socialSyncRecovery.provider.toUpperCase()} Sign-in interrupted
                </p>
                <p style={{ margin: '0 0 12px 0' }}>{socialSyncRecovery.reason}</p>
                <button
                  className="btn btn-secondary btn-full"
                  disabled={loading || retryLimitReached}
                  onClick={() => {
                    void retrySocialAuth();
                  }}
                  style={{ background: 'var(--amber-500-10, rgba(245, 158, 11, 0.15))', color: 'var(--amber-400, #fbbf24)', border: 'none' }}
                >
                  {loading ? 'Retrying...' : 'Retry Sign-in'}
                </button>
                <button
                  className="auth-forgot-link"
                  style={{
                    marginTop: '12px',
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                  }}
                  onClick={clearSocialRecovery}
                >
                  Dismiss
                </button>
              </div>
            )}

            <SocialAuthButtons
              loading={loading}
              onSocialAuth={handleSocialAuth}
              label={copy.socialLabel}
              googleText={copy.google}
              facebookText={copy.facebook}
              appleText={copy.apple}
              googleDisabled={!isGoogleAuthAvailable}
            />

            <div className="auth-divider">
              <span>{copy.email}</span>
            </div>

            <AuthMethodTabs
              activeTab={activeTab}
              onChange={setActiveTab}
              emailLabel={copy.email}
              phoneLabel={copy.phone}
            />

            <div className="auth-content" style={{ marginTop: '20px' }}>
              {activeTab === 'email' && (
                <form onSubmit={handleEmailSubmit} className="auth-form">
                  {mode === 'signup' && (
                    <div className="form-group">
                      <label htmlFor="signin-fullname">Full Name</label>
                      <input
                        id="signin-fullname"
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="John Doe"
                        required
                        autoComplete="name"
                      />
                    </div>
                  )}
                  <div className="form-group">
                    <label htmlFor="signin-email">Email Address</label>
                    <input
                      ref={emailInputRef}
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="username"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="signin-password">Password</label>
                    <input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    />
                  </div>
                  {mode === 'signup' && (
                    <div className="form-group">
                      <label htmlFor="signin-confirm-password">Confirm Password</label>
                      <input
                        id="signin-confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                    {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
                  </button>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      className="auth-forgot-link"
                      onClick={() => {
                        void handleForgotPassword();
                      }}
                      disabled={forgotPasswordLoading || loading}
                      style={{ textAlign: 'center', marginTop: '12px' }}
                    >
                      {forgotPasswordLoading ? 'Sending...' : 'Forgot password?'}
                    </button>
                  )}
                </form>
              )}
            </div>

            <AuthModeSwitch
              mode={mode}
              onSwitch={switchMode}
              signInPromptText={copy.signInPromptText}
              signUpPromptText={copy.signUpPromptText}
            />
          </>
        )}

        {step === 2 && (
          <>
            <div className="auth-intro">
              <h1>I am a...</h1>
              <p className="auth-subtitle">Select your account type</p>
            </div>

            <div
              className="category-selection"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              {USER_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`category-card category-card--${cat.id} ${selectedCategory === cat.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  type="button"
                  style={{
                    background:
                      selectedCategory === cat.id ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${selectedCategory === cat.id ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>
                    {cat.icon}
                  </span>
                  <strong style={{ display: 'block', fontSize: '15px' }}>{cat.label}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)' }}>{cat.desc}</span>
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={proceedToRoleSelection}
              disabled={!selectedCategory}
            >
              Continue
            </button>
            <button
              className="auth-forgot-link"
              style={{ width: '100%', textAlign: 'center', marginTop: '16px' }}
              onClick={() => goBackToStep(1)}
            >
              Go Back
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="auth-intro">
              <h1>Select Your Role</h1>
              <p className="auth-subtitle">Choose your exact position</p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '8px',
                marginBottom: '24px',
                maxHeight: '40vh',
                overflowY: 'auto',
                paddingRight: '8px',
              }}
            >
              {getRolesForCategory().map((role: { id: string; label: string; desc: string; icon: string }) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  style={{
                    background:
                      selectedRole === role.id ? 'rgba(59,130,246,0.1)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${selectedRole === role.id ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{role.icon}</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px' }}>{role.label}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)' }}>{role.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={completeSignUp}
              disabled={!selectedRole || loading}
            >
              {loading ? 'Please wait...' : 'Complete Registration'}
            </button>
            <button
              className="auth-forgot-link"
              style={{ width: '100%', textAlign: 'center', marginTop: '16px' }}
              onClick={() => goBackToStep(2)}
            >
              Go Back
            </button>
          </>
        )}

        {step === 4 && (
          <>
            <div className="auth-intro">
              <h1>Two-Factor Authentication</h1>
              <p className="auth-subtitle">Enter the 6-digit code from your authenticator app</p>
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  color: '#ef4444',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  marginBottom: '24px',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleTwoFactorSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="totp-code">Authentication Code</label>
                <input
                  id="totp-code"
                  type="text"
                  value={twoFactorCode}
                  onChange={e => setTwoFactorCode(e.target.value)}
                  placeholder="000000"
                  maxLength={8}
                  required
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading || twoFactorCode.trim().length === 0}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </form>

            <button
              className="auth-forgot-link"
              style={{ width: '100%', textAlign: 'center', marginTop: '16px' }}
              onClick={() => goBackToStep(1)}
            >
              Back to Sign In
            </button>
          </>
        )}

        <p
          className="auth-footer"
          style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary, #64748b)', marginTop: '32px' }}
        >
          By continuing, you agree to our{' '}
          <a href="/terms" style={{ color: 'var(--text-muted, #94a3b8)' }}>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" style={{ color: 'var(--text-muted, #94a3b8)' }}>
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
