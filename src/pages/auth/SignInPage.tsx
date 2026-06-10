import React, { FC, ChangeEvent, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useSignIn, USER_CATEGORIES } from '../../hooks/useSignIn';
import { BiometricLoginButton } from '../../features/auth/components/BiometricLogin';
import { SocialAuthButtons } from './components/SocialAuthButtons';
import { AuthMethodTabs } from './components/AuthMethodTabs';
import { AuthModeSwitch } from './components/AuthModeSwitch';
import './AuthPages.css';

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

const SignInPage: FC = () => {
  useDocumentTitle('Sign In');
  const navigate = useNavigate();
  const location = useLocation();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const locale = getAuthLocale();
  const copy = AUTH_COPY[locale];

  const {
    mode,
    step,
    activeTab,
    setActiveTab,
    loading,
    forgotPasswordLoading,
    error,
    setError,
    success,
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
    handlePhoneSubmit,
    handleOtpVerify,
    proceedToRoleSelection,
    completeSignUp,
    getRolesForCategory,
  } = useSignIn();

  const retryLimitReached = socialRetryAttempts >= 3;
  const isSigningUp = mode === 'signup';
  const hasGoogleErrorSignal = /google|gmail|popup|firebase|third-party cookies|blocked/i.test(
    error.toLowerCase()
  );
  const shouldShowGoogleHelp =
    mode === 'signin' &&
    step === 1 &&
    (!isGoogleAuthAvailable || socialSyncRecovery?.provider === 'google' || hasGoogleErrorSignal);
  const authHighlights = isSigningUp
    ? ['Fast account setup', 'Google / Gmail sign-in', 'Mobile OTP backup']
    : ['Secure CRM access', 'Gmail-friendly login', 'Phone verification ready'];

  const closeAuthModal = useCallback((): void => {
    const stateValue = location.state as { from?: string } | null;
    const returnTo = stateValue?.from;
    if (returnTo && returnTo !== '/signin' && returnTo !== '/signup') {
      navigate(returnTo, { replace: true });
      return;
    }
    navigate('/', { replace: true });
  }, [location.state, navigate]);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeAuthModal();
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
  }, [closeAuthModal]);

  return (
    <div
      className="auth-modal-overlay"
      role="presentation"
      onClick={() => {
        closeAuthModal();
      }}
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
        <div className="auth-container">
          <button
            type="button"
            className="auth-close-btn"
            onClick={() => {
              closeAuthModal();
            }}
            aria-label="Close authentication popup"
            ref={closeButtonRef}
          >
            ×
          </button>

          <Link to="/" className="auth-logo">
            <img src="/company-logo.jpg" alt="White Caves" width={60} height={60} />
            <span>White Caves</span>
          </Link>

          <div className="auth-card">
            {step === 1 && (
              <>
                <div className="auth-intro">
                  <p className="auth-eyebrow">
                    {isSigningUp
                      ? 'Create your secure White Caves account'
                      : 'Sign in faster with Gmail'}
                  </p>
                  <h1>{mode === 'signup' ? copy.signUpTitle : copy.signInTitle}</h1>
                  <p className="auth-subtitle">
                    {mode === 'signup' ? copy.signUpSubtitle : copy.signInSubtitle}
                  </p>
                  <div className="auth-highlights" aria-label="Authentication benefits">
                    {authHighlights.map(highlight => (
                      <span key={highlight} className="auth-highlight-pill">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {error && <div className="auth-error">{error}</div>}
                {socialSyncRecovery && (
                  <div
                    className="auth-recovery"
                    role="status"
                    aria-live="polite"
                  >
                    <p className="auth-recovery__title">
                      {socialSyncRecovery.provider[0].toUpperCase() +
                        socialSyncRecovery.provider.slice(1)}{' '}
                      sign-in needs one more step
                    </p>
                    <p className="auth-recovery__hint">
                      We secured your authentication, but CRM session activation failed. Please
                      retry once to finish sign-in.
                    </p>
                    <p className="auth-recovery__reason">Reason: {socialSyncRecovery.reason}</p>
                    <p className="auth-recovery__hint">
                      Retries remaining: {remainingSocialRetries}
                    </p>
                    <button
                      type="button"
                      className="btn btn-secondary btn-full"
                      disabled={loading || retryLimitReached}
                      onClick={() => {
                        void retrySocialAuth();
                      }}
                    >
                      {retryLimitReached
                        ? 'Retry limit reached'
                        : loading
                          ? 'Retrying...'
                          : `Retry ${socialSyncRecovery.provider[0].toUpperCase() + socialSyncRecovery.provider.slice(1)} sign-in`}
                    </button>
                    {retryLimitReached && (
                      <p className="auth-recovery__hint">
                        Too many retry attempts. Please continue with email sign-in or try again
                        later.
                      </p>
                    )}
                    <button
                      type="button"
                      className="btn btn-link auth-recovery__dismiss"
                      disabled={loading}
                      onClick={clearSocialRecovery}
                    >
                      Dismiss recovery notice
                    </button>
                  </div>
                )}
                {success && <div className="auth-success">{success}</div>}

                {mode === 'signin' && (
                  <BiometricLoginButton
                    onSuccess={(user: unknown) => {
                      const u = user as Record<string, unknown>;
                      handleSignInSuccess({
                        id: String(u.uid || u.id || ''),
                        email: String(u.email || ''),
                        name: String(u.displayName || u.name || ''),
                        photoUrl: u.photoURL ? String(u.photoURL) : undefined,
                      });
                    }}
                    onError={(error: unknown) =>
                      setError(error instanceof Error ? error.message : 'Login failed')
                    }
                    disabled={loading}
                  />
                )}

                <SocialAuthButtons
                  loading={loading}
                  onSocialAuth={handleSocialAuth}
                  label={copy.socialLabel}
                  googleText={copy.google}
                  facebookText={copy.facebook}
                  appleText={copy.apple}
                  googleDisabled={!isGoogleAuthAvailable}
                  helperText={
                    !isGoogleAuthAvailable
                      ? googleAuthUnavailableMessage
                      : 'Use the Gmail account linked to your White Caves profile for the fastest login.'
                  }
                />

                {shouldShowGoogleHelp && (
                  <div className="auth-google-help" role="region" aria-label="Google sign-in help">
                    <p className="auth-google-help__title">Trouble signing in with Gmail?</p>
                    <ul className="auth-google-help__list">
                      <li>Allow popups and third-party cookies for this site.</li>
                      <li>Pick the same Gmail account linked to your White Caves profile.</li>
                      <li>If Google still fails, continue with Email + password below.</li>
                    </ul>
                    <div className="auth-google-help__actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          void handleSocialAuth('google');
                        }}
                        disabled={loading || !isGoogleAuthAvailable}
                      >
                        Try Gmail again
                      </button>
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => {
                          setActiveTab('email');
                          window.setTimeout(() => {
                            emailInputRef.current?.focus();
                          }, 0);
                        }}
                      >
                        Continue with Email
                      </button>
                    </div>
                  </div>
                )}

                <div className="auth-divider">
                  <span>or continue with</span>
                </div>

                <AuthMethodTabs
                  activeTab={activeTab}
                  onChange={setActiveTab}
                  emailLabel={copy.email}
                  phoneLabel={copy.phone}
                />

                <div className="auth-content">
                  {activeTab === 'email' && (
                    <form onSubmit={handleEmailSubmit} className="auth-form">
                      {mode === 'signup' && (
                        <div className="form-group">
                          <label htmlFor="signin-fullname">Full Name</label>
                          <input
                            id="signin-fullname"
                            type="text"
                            value={fullName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setFullName(e.target.value)
                            }
                            placeholder="Enter your full name"
                            required
                            autoComplete="name"
                          />
                        </div>
                      )}
                      <div className="form-group">
                        <label htmlFor="signin-email">Email Address</label>
                        {mode === 'signup' ? (
                          <input
                            ref={emailInputRef}
                            id="signin-email"
                            type="email"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            autoComplete="email"
                          />
                        ) : (
                          <input
                            ref={emailInputRef}
                            id="signin-email"
                            type="email"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            autoComplete="username"
                          />
                        )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="signin-password">Password</label>
                        {mode === 'signup' ? (
                          <input
                            id="signin-password"
                            type="password"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            required
                            autoComplete="new-password"
                          />
                        ) : (
                          <input
                            id="signin-password"
                            type="password"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            required
                            autoComplete="current-password"
                          />
                        )}
                      </div>
                      {mode === 'signup' && (
                        <div className="form-group">
                          <label htmlFor="signin-confirm-password">Confirm Password</label>
                          <input
                            id="signin-confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setConfirmPassword(e.target.value)
                            }
                            placeholder="Confirm your password"
                            required
                            autoComplete="new-password"
                          />
                        </div>
                      )}
                      <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Please wait...' : mode === 'signup' ? 'Continue' : 'Sign In'}
                      </button>
                      {mode === 'signin' && (
                        <button
                          type="button"
                          className="btn btn-link auth-forgot-link"
                          onClick={() => {
                            void handleForgotPassword();
                          }}
                          disabled={forgotPasswordLoading || loading}
                        >
                          {forgotPasswordLoading ? 'Sending reset link...' : 'Forgot password?'}
                        </button>
                      )}
                    </form>
                  )}

                  {activeTab === 'phone' && (
                    <div className="auth-form">
                      {!showOtpInput ? (
                        <form onSubmit={handlePhoneSubmit}>
                          {mode === 'signup' && (
                            <div className="form-group">
                              <label htmlFor="phone-fullname">Full Name</label>
                              <input
                                id="phone-fullname"
                                type="text"
                                value={fullName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                  setFullName(e.target.value)
                                }
                                placeholder="Enter your full name"
                                required
                                autoComplete="name"
                              />
                            </div>
                          )}
                          <div className="form-group">
                            <label htmlFor="phone-number">Phone Number</label>
                            <input
                              id="phone-number"
                              type="tel"
                              value={phone}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setPhone(e.target.value)
                              }
                              placeholder="+971 50 123 4567"
                              required
                              autoComplete="tel"
                            />
                            <span className="input-hint">Include country code (e.g., +971)</span>
                          </div>
                          <div id="recaptcha-container"></div>
                          <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={loading}
                          >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleOtpVerify}>
                          <div className="form-group">
                            <label htmlFor="otp-code">Enter OTP</label>
                            <input
                              id="otp-code"
                              type="text"
                              value={otp}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setOtp(e.target.value)
                              }
                              placeholder="Enter 6-digit code"
                              maxLength={6}
                              required
                              autoComplete="one-time-code"
                              inputMode="numeric"
                            />
                            <span className="input-hint">Enter the code sent to {phone}</span>
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={loading}
                          >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                          </button>
                          <button type="button" className="btn btn-link" onClick={resetOtp}>
                            Change Phone Number
                          </button>
                        </form>
                      )}
                    </div>
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
                <h1>I am a...</h1>
                <p className="auth-subtitle">Select your account type</p>

                {error && <div className="auth-error">{error}</div>}

                <div className="category-selection">
                  {USER_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      className={`category-card category-card--${cat.id} ${selectedCategory === cat.id ? 'selected' : ''}`}
                      onClick={() => setSelectedCategory(cat.id)}
                      type="button"
                    >
                      <span className="category-icon">{cat.icon}</span>
                      <div className="category-info">
                        <span className="category-label">{cat.label}</span>
                        <span className="category-desc">{cat.desc}</span>
                      </div>
                      {selectedCategory === cat.id && <span className="category-check">✓</span>}
                    </button>
                  ))}
                </div>

                {selectedCategory === 'staff' && (
                  <div className="staff-notice">
                    <span className="notice-icon">ℹ️</span>
                    <p>
                      Staff accounts require admin approval. You'll receive access once verified.
                    </p>
                  </div>
                )}

                <button
                  className="btn btn-primary btn-full"
                  onClick={proceedToRoleSelection}
                  disabled={!selectedCategory}
                >
                  Continue
                </button>

                <button className="btn btn-link" onClick={() => goBackToStep(1)}>
                  Go Back
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <h1>Select Your Role</h1>
                <p className="auth-subtitle">
                  {selectedCategory === 'staff'
                    ? 'Choose your position at White Caves'
                    : 'How will you be using White Caves?'}
                </p>

                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

                <div className="role-selection-grid">
                  {getRolesForCategory().map(role => (
                    <button
                      key={role.id}
                      className={`role-card ${selectedRole === role.id ? 'selected' : ''}`}
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <span className="role-icon">{role.icon}</span>
                      <span className="role-label">{role.label}</span>
                      <span className="role-desc">{role.desc}</span>
                    </button>
                  ))}
                </div>

                {selectedCategory === 'staff' && (
                  <div className="form-group auth-form-group-spaced">
                    <label htmlFor="employee-id">Employee ID (Optional)</label>
                    <input
                      id="employee-id"
                      type="text"
                      value={employeeId}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setEmployeeId(e.target.value)}
                      placeholder="Enter your employee ID"
                    />
                  </div>
                )}

                <button
                  className="btn btn-primary btn-full"
                  onClick={completeSignUp}
                  disabled={!selectedRole || loading}
                >
                  {selectedCategory === 'staff' ? 'Submit for Approval' : 'Complete Registration'}
                </button>

                <button className="btn btn-link" onClick={() => goBackToStep(2)}>
                  Go Back
                </button>
              </>
            )}

            {step === 4 && (
              <>
                <h1>Two-Factor Authentication</h1>
                <p className="auth-subtitle">
                  Enter the 6-digit code from your authenticator app (or an 8-character backup
                  code)
                </p>

                {error && <div className="auth-error">{error}</div>}
                {success && <div className="auth-success">{success}</div>}

                <form onSubmit={handleTwoFactorSubmit} className="auth-form">
                  <div className="form-group">
                    <label htmlFor="totp-code">Authentication Code</label>
                    <input
                      id="totp-code"
                      type="text"
                      value={twoFactorCode}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setTwoFactorCode(e.target.value)
                      }
                      placeholder="000000"
                      maxLength={8}
                      required
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      autoFocus
                    />
                    <span className="input-hint">6-digit TOTP or 8-character backup code</span>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-full"
                    disabled={loading || twoFactorCode.trim().length === 0}
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </button>
                </form>

                <button className="btn btn-link" onClick={() => goBackToStep(1)}>
                  Back to Sign In
                </button>
              </>
            )}
          </div>

          <p className="auth-footer">
            By continuing, you agree to our{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
