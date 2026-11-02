/**
 * Auth.tsx  (view – <350 lines)
 * Single-purpose: Renders the White Caves authentication UI.
 * All business logic lives in Auth.logic.ts; types in Auth.types.ts.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import type { AppUser } from '../../store/userSlice';
import { useToast } from '../Toast';
import { useFormValidation } from '../../hooks/useFormValidation';
import {
  required,
  minLength,
  maxLength,
  emailValidator,
  matchesPattern,
} from '../../utils/validation';
import Profile from '../Profile';
import ProfileCompletion from '../ProfileCompletion';
import FormField from '../ui/FormField/FormField';
import {
  GoogleIcon,
  AppleIcon,
  FacebookIcon,
  EmailIcon,
  PhoneIcon,
  LockIcon,
  ArrowLeftIcon,
} from './Auth.icons';
import {
  handleSocialSignIn,
  handleEmailAuth as doEmailAuth,
  sendPhoneOTP,
  verifyPhoneOTP,
  handleLogout,
  resolveFirebaseError,
} from './Auth.logic';
import {
  getAuthToken,
  setAuthToken,
  getStoredUser,
  setStoredUser,
} from './Auth.data';
import { firebaseAuth as auth } from '../../auth/firebaseInit';
import type { AuthMode, AuthUser, AuthProps } from './Auth.types';
import type { ConfirmationResult } from 'firebase/auth';
import '../Auth.css';

/** Map AuthUser → AppUser shape expected by Redux store */
function toAppUser(u: AuthUser): AppUser {
  return {
    id: u.id,
    email: u.email ?? '',
    name: u.name,
    phone: u.phone ?? undefined,
    photoURL: u.photoUrl ?? undefined,
  };
}

const PHONE_UAE_RE = /^\+?[1-9]\d{1,14}$/;

export default function Auth({ onLogin }: AuthProps) {
  const dispatch = useDispatch();
  const toast = useToast();

  // ─── State ───────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('phone');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [pendingUser, setPendingUser] = useState<AuthUser | null>(null);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // ─── Boot: restore session ────────────────────────────────────────────────
  useEffect(() => {
    const stored = getStoredUser<AuthUser>();
    const token = getAuthToken();
    if (stored && token) {
      setCurrentUser(stored);
      dispatch(setUser(toAppUser(stored)));
    }
  }, [dispatch]);

  // ─── OTP countdown ───────────────────────────────────────────────────────
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const t = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [otpCountdown]);

  // ─── Form validation (Validator[] schema) ────────────────────────────────
  const { values, errors, touched, handleChange, handleBlur, isValid, setFieldValue } =
    useFormValidation(
      {
        email: [required(), emailValidator()],
        password: [required(), minLength(6)],
        confirmPassword: [],  // validated inline in submit
        name: isSignUp ? [required()] : [],
        phone: authMode === 'phone'
          ? [required(), matchesPattern(PHONE_UAE_RE, 'Please enter a valid phone number with country code')]
          : [],
        otp: confirmationResult !== null ? [required(), minLength(6), maxLength(6)] : [],
      },
      { email: '', password: '', confirmPassword: '', name: '', phone: '', otp: '' },
    );

  // ─── Shared success handler ───────────────────────────────────────────────
  const onSuccess = useCallback(
    (user: AuthUser) => {
      setCurrentUser(user);
      dispatch(setUser(toAppUser(user)));
      onLogin(user);
    },
    [dispatch, onLogin],
  );

  // ─── Social sign-in ───────────────────────────────────────────────────────
  const handleSocial = useCallback(
    async (provider: 'google' | 'facebook' | 'apple') => {
      if (!auth) {
        toast.error('Firebase is not configured. Please add Firebase credentials.');
        return;
      }
      setLoading(true);
      try {
        const user = await handleSocialSignIn(provider);
        toast.success(`Successfully signed in with ${provider}!`);
        onSuccess(user);
      } catch (err: unknown) {
        const e = err as { code?: string; message?: string };
        toast.error(resolveFirebaseError(e.code, e.message ?? `Failed to sign in with ${provider}`));
      } finally {
        setLoading(false);
      }
    },
    [auth, onSuccess, toast],
  );

  // ─── Email auth ───────────────────────────────────────────────────────────
  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid) { toast.error('Please fix the form errors'); return; }
      if (isSignUp && values.password !== values.confirmPassword) {
        toast.error('Passwords do not match'); return;
      }
      if (!auth) { toast.error('Firebase is not configured.'); return; }
      setLoading(true);
      try {
        const user = await doEmailAuth(values.email, values.password, values.name, isSignUp);
        toast.success(isSignUp ? 'Account created successfully!' : 'Successfully signed in!');
        onSuccess(user);
      } catch (err: unknown) {
        const e = err as { code?: string; message?: string };
        if (e.code === 'auth/email-already-in-use') setIsSignUp(false);
        if (e.code === 'auth/user-not-found') setIsSignUp(true);
        toast.error(resolveFirebaseError(e.code, e.message ?? 'Authentication failed.'));
      } finally {
        setLoading(false);
      }
    },
    [auth, isSignUp, isValid, onSuccess, toast, values],
  );

  // ─── Phone OTP ────────────────────────────────────────────────────────────
  const handleSendOTP = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid) { toast.error('Please enter a valid phone number'); return; }
      if (!auth) { toast.error('Firebase is not configured.'); return; }
      setLoading(true);
      try {
        const result = await sendPhoneOTP(values.phone);
        setConfirmationResult(result);
        setOtpCountdown(60);
        toast.success('OTP sent to your phone!');
      } catch (err: unknown) {
        const e = err as { code?: string };
        toast.error(resolveFirebaseError(e.code, 'Failed to send OTP. Please check your phone number.'));
        if (typeof window !== 'undefined') window.recaptchaVerifier = null;
      } finally {
        setLoading(false);
      }
    },
    [auth, isValid, toast, values.phone],
  );

  const handleVerifyOTP = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!values.otp || values.otp.length !== 6) { toast.error('Please enter the 6-digit OTP'); return; }
      if (!confirmationResult) { toast.error('Please send OTP first'); return; }
      setLoading(true);
      try {
        const user = await verifyPhoneOTP(confirmationResult, values.otp, values.phone);
        toast.success('Successfully signed in!');
        onSuccess(user);
      } catch (err: unknown) {
        const e = err as { code?: string };
        toast.error(resolveFirebaseError(e.code, 'Verification failed. Please try again.'));
      } finally {
        setLoading(false);
      }
    },
    [confirmationResult, onSuccess, toast, values.otp, values.phone],
  );

  // ─── Logout ───────────────────────────────────────────────────────────────
  const onLogout = useCallback(async () => {
    try {
      await handleLogout();
      setCurrentUser(null);
      setConfirmationResult(null);
      dispatch(setUser(null));
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to log out');
    }
  }, [dispatch, toast]);

  // ─── Profile completion ───────────────────────────────────────────────────
  const onProfileComplete = useCallback(
    (user: AuthUser, token: string) => {
      setAuthToken(token);
      setStoredUser(user);
      setCurrentUser(user);
      dispatch(setUser(toAppUser(user)));
      setShowProfileCompletion(false);
      setPendingUser(null);
      setPendingToken(null);
      onLogin(user);
    },
    [dispatch, onLogin],
  );

  const onProfileSkip = useCallback(() => {
    if (pendingUser && pendingToken) {
      setAuthToken(pendingToken);
      setStoredUser(pendingUser);
      setCurrentUser(pendingUser);
      dispatch(setUser(toAppUser(pendingUser)));
      onLogin(pendingUser);
    }
    setShowProfileCompletion(false);
    setPendingUser(null);
    setPendingToken(null);
  }, [dispatch, onLogin, pendingToken, pendingUser]);

  // ─── Render ───────────────────────────────────────────────────────────────
  if (showProfileCompletion && pendingUser && pendingToken) {
    return (
      <ProfileCompletion
        user={pendingUser}
        token={pendingToken}
        onComplete={onProfileComplete}
        onSkip={onProfileSkip}
      />
    );
  }

  if (currentUser) {
    return <Profile user={currentUser} onLogout={onLogout} />;
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo"><div className="auth-logo-icon">WC</div></div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to access your account</p>
        </div>

        {/* Method tabs */}
        <div className="auth-method-selector">
          {(['phone', 'email'] as AuthMode[]).map((m) => (
            <button key={m} className={`method-btn ${authMode === m ? 'active' : ''}`} onClick={() => setAuthMode(m)}>
              {m === 'phone' ? <PhoneIcon /> : <EmailIcon />}
              <span>{m.charAt(0).toUpperCase() + m.slice(1)}</span>
            </button>
          ))}
        </div>

        <div className="auth-content">
          {/* Email form */}
          {authMode === 'email' && (
            <form className="auth-form" onSubmit={handleEmailSubmit}>
              {isSignUp && (
                <FormField
                  label="Full Name" name="name" value={values.name}
                  onChange={handleChange} onBlur={handleBlur}
                  error={touched.name ? errors.name : undefined}
                  placeholder="Enter your full name"
                />
              )}
              <FormField
                label="Email Address" name="email" type="email" value={values.email}
                onChange={handleChange} onBlur={handleBlur}
                error={touched.email ? errors.email : undefined}
                placeholder="Enter your email"
              />
              {/* Password: manual for show/hide toggle */}
              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon"><LockIcon /></span>
                  <input
                    type={showPassword ? 'text' : 'password'} name="password"
                    value={values.password} onChange={handleChange} onBlur={handleBlur}
                    placeholder="Enter your password"
                    className={`auth-input ${errors.password && touched.password ? 'error' : ''}`}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword((p) => !p)}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && touched.password && <span className="input-error">{errors.password}</span>}
              </div>
              {isSignUp && (
                <FormField
                  label="Confirm Password" name="confirmPassword" type="password"
                  value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                  error={touched.confirmPassword ? errors.confirmPassword : undefined}
                  placeholder="Confirm your password"
                />
              )}
              {!isSignUp && (
                <div className="forgot-password">
                  <button type="button" className="forgot-btn">Forgot password?</button>
                </div>
              )}
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading
                  ? <span className="btn-loading"><span className="spinner" />Please wait...</span>
                  : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
              <p className="auth-toggle">
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button type="button" onClick={() => setIsSignUp((s) => !s)} className="auth-toggle-btn">
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </form>
          )}

          {/* Phone form */}
          {authMode === 'phone' && (
            <form className="auth-form" onSubmit={confirmationResult ? handleVerifyOTP : handleSendOTP}>
              <div id="recaptcha-container" />
              {!confirmationResult ? (
                <>
                  <FormField
                    label="Phone Number" name="phone" type="tel" value={values.phone}
                    onChange={handleChange} onBlur={handleBlur}
                    error={touched.phone ? errors.phone : undefined}
                    placeholder="+971 50 123 4567"
                  />
                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading
                      ? <span className="btn-loading"><span className="spinner" />Sending...</span>
                      : 'Send Verification Code'}
                  </button>
                </>
              ) : (
                <>
                  <div className="otp-header">
                    <button type="button" className="back-btn" onClick={() => setConfirmationResult(null)}>
                      <ArrowLeftIcon />
                    </button>
                    <div className="otp-info">
                      <h3>Verify Your Phone</h3>
                      <p>Enter the 6-digit code sent to <strong>{values.phone}</strong></p>
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Verification Code</label>
                    <div className="otp-input-container">
                      <input
                        type="text" name="otp" value={values.otp}
                        onChange={(e) =>
                          handleChange({
                            target: { name: 'otp', value: e.target.value.replace(/\D/g, '').slice(0, 6) },
                          } as React.ChangeEvent<HTMLInputElement>)
                        }
                        onBlur={handleBlur} placeholder="000000"
                        className={`otp-input ${errors.otp && touched.otp ? 'error' : ''}`}
                        maxLength={6} autoComplete="one-time-code"
                      />
                    </div>
                    {errors.otp && touched.otp && <span className="input-error">{errors.otp}</span>}
                  </div>
                  {otpCountdown > 0 ? (
                    <p className="resend-timer">Resend code in {otpCountdown}s</p>
                  ) : (
                    <button
                      type="button" className="resend-btn"
                      onClick={() => { setConfirmationResult(null); setFieldValue('otp', ''); }}
                    >
                      Didn't receive code? Send again
                    </button>
                  )}
                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading
                      ? <span className="btn-loading"><span className="spinner" />Verifying...</span>
                      : 'Verify & Continue'}
                  </button>
                </>
              )}
            </form>
          )}

          {/* Social buttons */}
          <div className="auth-divider"><span>or continue with</span></div>
          <div className="social-buttons">
            {(['google', 'apple', 'facebook'] as const).map((p) => (
              <button key={p} className={`social-btn ${p}`} onClick={() => handleSocial(p)} disabled={loading}>
                {p === 'google' ? <GoogleIcon /> : p === 'apple' ? <AppleIcon /> : <FacebookIcon />}
                <span>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="auth-footer">
          <p>By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></p>
        </div>
      </div>
    </div>
  );
}
