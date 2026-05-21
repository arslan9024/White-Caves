import React, { FC, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
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
    google: 'Google',
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
    google: 'جوجل',
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
  const locale = getAuthLocale();
  const copy = AUTH_COPY[locale];

  const {
    mode,
    step,
    activeTab,
    setActiveTab,
    loading,
    error,
    setError,
    success,
    socialSyncRecovery,
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
    handleSignInSuccess,
    handleSocialAuth,
    retrySocialAuth,
    handleEmailSubmit,
    handlePhoneSubmit,
    handleOtpVerify,
    proceedToRoleSelection,
    completeSignUp,
    getRolesForCategory,
  } = useSignIn();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/" className="auth-logo">
          <img src="/company-logo.jpg" alt="White Caves" width={60} height={60} />
          <span>White Caves</span>
        </Link>

        <div className="auth-card">
          {step === 1 && (
            <>
              <h1>{mode === 'signup' ? copy.signUpTitle : copy.signInTitle}</h1>
              <p className="auth-subtitle">
                {mode === 'signup' ? copy.signUpSubtitle : copy.signInSubtitle}
              </p>

              {error && <div className="auth-error">{error}</div>}
              {socialSyncRecovery && (
                <div className="auth-recovery" role="status" aria-live="polite">
                  <p className="auth-recovery__title">
                    {socialSyncRecovery.provider[0].toUpperCase() +
                      socialSyncRecovery.provider.slice(1)}{' '}
                    sign-in needs one more step
                  </p>
                  <p className="auth-recovery__hint">
                    We secured your authentication, but CRM session activation failed. Please retry
                    once to finish sign-in.
                  </p>
                  <p className="auth-recovery__reason">Reason: {socialSyncRecovery.reason}</p>
                  <button
                    type="button"
                    className="btn btn-secondary btn-full"
                    disabled={loading}
                    onClick={() => {
                      void retrySocialAuth();
                    }}
                  >
                    {loading
                      ? 'Retrying...'
                      : `Retry ${socialSyncRecovery.provider[0].toUpperCase() + socialSyncRecovery.provider.slice(1)} sign-in`}
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
              />

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
                      <input
                        id="signin-email"
                        type="email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="signin-password">Password</label>
                      <input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        placeholder="Enter your password"
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
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
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
                    className={`category-card ${selectedCategory === cat.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{ '--accent-color': cat.color } as React.CSSProperties}
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
                  <p>Staff accounts require admin approval. You'll receive access once verified.</p>
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
                <div className="form-group" style={{ marginBottom: '1rem' }}>
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
  );
};

export default SignInPage;
