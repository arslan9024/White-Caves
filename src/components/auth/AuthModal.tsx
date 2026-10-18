import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
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
  presentation?: 'modal' | 'page';
}

const AuthModal: FC<AuthModalProps> = ({
  mode: initialMode = 'signin',
  onClose,
  presentation = 'modal',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const locale = getAuthLocale();
  const copy = AUTH_COPY[locale];
  const isPage = presentation === 'page';

  useEffect(() => {
    if (!isPage && closeButtonRef.current) {
      closeButtonRef.current.focus();
    } else {
      emailInputRef.current?.focus();
    }
  }, [isPage]);

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
    phone,
    setPhone,
    otp,
    setOtp,
    showOtpInput,
    resetOtp,
    twoFactorCode,
    setTwoFactorCode,
    handleTwoFactorSubmit,
    handleSocialAuth,
    retrySocialAuth,
    clearSocialRecovery,
    handleEmailSubmit,
    handleForgotPassword,
    handleVerifyResetToken,
    handleCompletePasswordReset,
    handlePhoneSubmit,
    handleOtpVerify,
    proceedToRoleSelection,
    getRolesForCategory,
    completeSignUp,
  } = useSignIn();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isPage && initialMode !== mode) switchMode();
  }, [initialMode, isPage, mode, switchMode]);

  const handleModeSwitch = useCallback(() => {
    if (isPage) {
      navigate(mode === 'signup' ? '/signin' : '/signup');
      return;
    }
    switchMode();
  }, [isPage, mode, navigate, switchMode]);

  const retryLimitReached = remainingSocialRetries <= 0;
  const isPasswordResetRoute =
    location.pathname === '/forgot-password' ||
    location.pathname === '/reset-password' ||
    resetStage !== 'request';

  useEffect(() => {
    if (isPage) return undefined;

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
  }, [handleClose, isPage]);

  return (
    <div
      className={isPage ? 'auth-page-shell' : 'auth-modal-overlay'}
      role={isPage ? undefined : 'presentation'}
      onClick={isPage ? undefined : handleClose}
    >
      <div
        className={isPage ? 'auth-modal-window auth-page-card' : 'auth-modal-window'}
        role={isPage ? undefined : 'dialog'}
        aria-modal={isPage ? undefined : true}
        aria-label={isPage ? undefined : mode === 'signup' ? 'Sign up window' : 'Sign in window'}
        ref={modalRef}
        onClick={event => {
          event.stopPropagation();
        }}
      >
        {!isPage && (
          <button
            type="button"
            className="auth-close-btn"
            onClick={handleClose}
            aria-label="Close authentication popup"
            ref={closeButtonRef}
          >
            ×
          </button>
        )}

        <Link to="/" className="auth-logo">
          <img src="/company-logo.jpg" alt="White Caves" />
          <span>White Caves</span>
        </Link>

        {step === 1 && (
          <>
            <div className="auth-intro">
              <h1 id="auth-heading">
                {isPasswordResetRoute
                  ? 'Reset your password'
                  : mode === 'signup'
                    ? copy.signUpTitle
                    : copy.signInTitle}
              </h1>
              <p className="auth-subtitle">
                {isPasswordResetRoute
                  ? 'Recover access securely using your email address.'
                  : mode === 'signup'
                    ? copy.signUpSubtitle
                    : copy.signInSubtitle}
              </p>
            </div>

            {socialSyncRecovery && (
              <div className="auth-recovery" role="status" aria-live="polite">
                <p className="auth-recovery-title">
                  {socialSyncRecovery.provider.toUpperCase()} sign-in needs another try
                </p>
                <p className="auth-recovery-message">
                  We couldn’t complete your secure session. Retry or use email sign-in.
                </p>
                <p className="auth-recovery-attempts" aria-live="polite">
                  {remainingSocialRetries} retry attempts remaining
                </p>
                <button
                  className="btn btn-secondary btn-full"
                  disabled={loading || retryLimitReached}
                  aria-label={`Retry ${socialSyncRecovery.provider} sign-in`}
                  onClick={() => {
                    void retrySocialAuth();
                  }}
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

            {!isPasswordResetRoute && (
              <>
                <SocialAuthButtons
                  loading={loading}
                  onSocialAuth={handleSocialAuth}
                  label={copy.socialLabel}
                  googleText={copy.google}
                  facebookText={copy.facebook}
                  appleText={copy.apple}
                  googleDisabled={!isGoogleAuthAvailable}
                  providersDisabled={!isGoogleAuthAvailable}
                  helperText={!isGoogleAuthAvailable ? googleAuthUnavailableMessage : undefined}
                />

                <div className="auth-divider">
                  <span>{copy.email}</span>
                </div>

                <AuthMethodTabs
                  activeTab={activeTab}
                  onChange={tab => {
                    setActiveTab(tab);
                    setError('');
                  }}
                  emailLabel={copy.email}
                  phoneLabel={copy.phone}
                />
              </>
            )}

            <div
              className="auth-content"
              id={activeTab === 'email' ? 'auth-method-email-panel' : 'auth-method-phone-panel'}
              role={isPasswordResetRoute ? undefined : 'tabpanel'}
              aria-labelledby={
                isPasswordResetRoute
                  ? undefined
                  : activeTab === 'email'
                    ? 'auth-method-email-tab'
                    : 'auth-method-phone-tab'
              }
            >
              {isPasswordResetRoute ? (
                <section className="auth-reset-panel" aria-labelledby="reset-heading">
                  <h2 id="reset-heading">
                    {resetStage === 'request' ? 'Reset your password' : 'Password recovery'}
                  </h2>
                  <p className="auth-reset-copy">
                    {resetStage === 'request'
                      ? 'Enter the email address linked to your account. If it exists, we’ll send reset instructions.'
                      : resetStage === 'verify'
                        ? 'Enter the secure code sent to your inbox.'
                        : resetStage === 'reset'
                          ? 'Choose a new password for your account.'
                          : resetStage === 'success'
                            ? 'Your password has been updated. You can now sign in.'
                            : 'Password recovery is temporarily unavailable. Please try again later.'}
                  </p>

                  {resetStage === 'request' && (
                    <form
                      className="auth-form"
                      onSubmit={event => {
                        event.preventDefault();
                        void handleForgotPassword();
                      }}
                    >
                      <div className="form-group">
                        <label htmlFor="reset-email">Email address</label>
                        <input
                          ref={emailInputRef}
                          id="reset-email"
                          type="email"
                          value={email}
                          onChange={event => setEmail(event.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                          required
                        />
                      </div>
                      <button
                        className="btn btn-primary btn-full"
                        disabled={loading || forgotPasswordLoading}
                      >
                        {forgotPasswordLoading
                          ? 'Sending instructions…'
                          : 'Send reset instructions'}
                      </button>
                    </form>
                  )}

                  {resetStage === 'verify' && (
                    <form
                      className="auth-form"
                      onSubmit={event => {
                        event.preventDefault();
                        void handleVerifyResetToken();
                      }}
                    >
                      <div className="form-group">
                        <label htmlFor="reset-code">Email verification code</label>
                        <input
                          id="reset-code"
                          type="text"
                          value={resetToken}
                          onChange={event => setResetToken(event.target.value)}
                          placeholder="Enter the code from your email"
                          autoComplete="one-time-code"
                          inputMode="numeric"
                          required
                        />
                      </div>
                      <button
                        className="btn btn-primary btn-full"
                        disabled={loading || verifyResetLoading}
                      >
                        {verifyResetLoading ? 'Verifying…' : 'Verify code'}
                      </button>
                    </form>
                  )}

                  {resetStage === 'reset' && (
                    <form
                      className="auth-form"
                      onSubmit={event => {
                        event.preventDefault();
                        void handleCompletePasswordReset();
                      }}
                    >
                      <div className="form-group">
                        <label htmlFor="new-password">New password</label>
                        <input
                          id="new-password"
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={event => setNewPassword(event.target.value)}
                          placeholder="Create a new password"
                          autoComplete="new-password"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="confirm-new-password">Confirm new password</label>
                        <input
                          id="confirm-new-password"
                          type={showPassword ? 'text' : 'password'}
                          value={confirmNewPassword}
                          onChange={event => setConfirmNewPassword(event.target.value)}
                          placeholder="Confirm your new password"
                          autoComplete="new-password"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        className="auth-forgot-link"
                        onClick={() => setShowPassword(value => !value)}
                      >
                        {showPassword ? 'Hide passwords' : 'Show passwords'}
                      </button>
                      <button
                        className="btn btn-primary btn-full"
                        disabled={loading || completeResetLoading}
                      >
                        {completeResetLoading ? 'Updating password…' : 'Update password'}
                      </button>
                    </form>
                  )}

                  {(resetStage === 'success' || resetStage === 'locked') && (
                    <button
                      type="button"
                      className="btn btn-primary btn-full"
                      onClick={() => {
                        setError('');
                        setResetStage('request');
                        if (isPage) navigate('/signin');
                      }}
                    >
                      {resetStage === 'success' ? 'Return to sign in' : 'Back to sign in'}
                    </button>
                  )}

                  {success && (
                    <p className="auth-success" role="status">
                      {success}
                    </p>
                  )}
                  {error && (
                    <p className="auth-error" role="alert">
                      {error}
                    </p>
                  )}
                  {resetStage !== 'success' && resetStage !== 'locked' && (
                    <button
                      type="button"
                      className="auth-forgot-link"
                      onClick={() => {
                        setError('');
                        setResetStage('request');
                        if (isPage) navigate('/signin');
                      }}
                    >
                      Back to sign in
                    </button>
                  )}
                </section>
              ) : (
                <>
                  {activeTab === 'email' && (
                    <form onSubmit={handleEmailSubmit} className="auth-form">
                      {mode === 'signup' && (
                        <div className="form-group">
                          <label htmlFor="signin-fullname">Full name</label>
                          <input
                            id="signin-fullname"
                            type="text"
                            value={fullName}
                            onChange={event => setFullName(event.target.value)}
                            placeholder="Full name"
                            autoComplete="name"
                            required
                          />
                        </div>
                      )}
                      <div className="form-group">
                        <label htmlFor="signin-email">Email address</label>
                        <input
                          ref={emailInputRef}
                          id="signin-email"
                          type="email"
                          value={email}
                          onChange={event => setEmail(event.target.value)}
                          placeholder="you@example.com"
                          autoComplete="username"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="signin-password">Password</label>
                        <input
                          id="signin-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={event => setPassword(event.target.value)}
                          placeholder="Enter your password"
                          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                          required
                        />
                      </div>
                      {mode === 'signup' && (
                        <div className="form-group">
                          <label htmlFor="signin-confirm-password">Confirm password</label>
                          <input
                            id="signin-confirm-password"
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={event => setConfirmPassword(event.target.value)}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            required
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        className="auth-forgot-link"
                        onClick={() => setShowPassword(value => !value)}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? 'Hide password' : 'Show password'}
                      </button>
                      <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading
                          ? 'Please wait…'
                          : mode === 'signup'
                            ? 'Create account'
                            : 'Sign in'}
                      </button>
                      {mode === 'signin' && (
                        <button
                          type="button"
                          className="auth-forgot-link"
                          onClick={() => {
                            if (isPage) navigate('/forgot-password');
                            else void handleForgotPassword();
                          }}
                          disabled={forgotPasswordLoading || loading}
                        >
                          Forgot password?
                        </button>
                      )}
                    </form>
                  )}

                  {activeTab === 'phone' && (
                    <>
                      <div id="recaptcha-container" />
                      {showOtpInput ? (
                        <form onSubmit={handleOtpVerify} className="auth-form">
                          <div className="form-group">
                            <label htmlFor="phone-otp">Verification code</label>
                            <input
                              id="phone-otp"
                              type="text"
                              value={otp}
                              onChange={event => setOtp(event.target.value)}
                              autoComplete="one-time-code"
                              inputMode="numeric"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={loading}
                          >
                            {loading ? 'Verifying…' : 'Verify phone'}
                          </button>
                          <button type="button" className="auth-forgot-link" onClick={resetOtp}>
                            Use a different phone number
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handlePhoneSubmit} className="auth-form">
                          <div className="form-group">
                            <label htmlFor="signin-phone">Phone number</label>
                            <input
                              id="signin-phone"
                              type="tel"
                              value={phone}
                              onChange={event => setPhone(event.target.value)}
                              placeholder="+971 50 123 4567"
                              autoComplete="tel"
                              required
                              disabled={!isGoogleAuthAvailable}
                            />
                          </div>
                          {!isGoogleAuthAvailable && (
                            <p className="auth-helper" role="status">
                              Phone sign-in is unavailable until Firebase is configured.
                            </p>
                          )}
                          <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={loading || !isGoogleAuthAvailable}
                          >
                            {loading ? 'Sending code…' : 'Send verification code'}
                          </button>
                        </form>
                      )}
                    </>
                  )}

                  <BiometricLoginButton
                    disabled={loading}
                    onError={biometricError =>
                      setError(
                        biometricError instanceof Error
                          ? biometricError.message
                          : 'Passkey sign-in failed.'
                      )
                    }
                  />
                  {success && (
                    <p className="auth-success" role="status">
                      {success}
                    </p>
                  )}
                  {error && (
                    <p className="auth-error" role="alert">
                      {error}
                    </p>
                  )}
                  <AuthModeSwitch
                    mode={mode}
                    onSwitch={handleModeSwitch}
                    signInPromptText={copy.signInPromptText}
                    signUpPromptText={copy.signUpPromptText}
                  />
                </>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="auth-intro">
              <h1>I am a...</h1>
              <p className="auth-subtitle">Select your account type</p>
            </div>

            <div className="auth-category-grid">
              {USER_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className={`category-card category-card--${cat.id} ${selectedCategory === cat.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  type="button"
                  aria-pressed={selectedCategory === cat.id}
                >
                  <span className="auth-category-icon" aria-hidden="true">
                    {cat.icon}
                  </span>
                  <strong>{cat.label}</strong>
                  <span className="auth-category-description">{cat.desc}</span>
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

            <div className="auth-role-grid" role="group" aria-label="Available account roles">
              {getRolesForCategory().map(
                (role: { id: string; label: string; desc: string; icon: string }) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    type="button"
                    className={`auth-role-option ${selectedRole === role.id ? 'selected' : ''}`}
                    aria-pressed={selectedRole === role.id}
                  >
                    <span className="auth-role-icon" aria-hidden="true">
                      {role.icon}
                    </span>
                    <div>
                      <strong>{role.label}</strong>
                      <span>{role.desc}</span>
                    </div>
                  </button>
                )
              )}
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
              <p className="auth-error" role="alert">
                {error}
              </p>
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

        <p className="auth-footer">
          By continuing, you agree to our <a href="/terms">Terms of Service</a> and{' '}
          <a href="/privacy-policy">Privacy Policy</a>
        </p>
      </div>
      {isPage && (
        <aside className="auth-page-visual" aria-label="White Caves Dubai real estate">
          <div className="auth-page-visual-content">
            <span className="auth-page-eyebrow">WHITE CAVES · DUBAI</span>
            <h2>Your property journey, thoughtfully managed.</h2>
            <p>
              Sign in to continue with your properties, conversations, and personalized workspace.
            </p>
            <ul>
              <li>Secure access to your account</li>
              <li>Role-aware tools for clients and teams</li>
              <li>Support when you need it</li>
            </ul>
          </div>
          <span className="auth-page-visual-caption">White Caves Real Estate LLC</span>
        </aside>
      )}
    </div>
  );
};

export default AuthModal;
