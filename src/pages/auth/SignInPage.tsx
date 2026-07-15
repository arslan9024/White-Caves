/**
 * SignInPage.tsx
 * Full-featured authentication page for White Caves Real Estate
 * Supports: email/password, phone, Google/Facebook/Apple social auth,
 * sign-up with role selection, social recovery panel, Gmail troubleshooting
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
  signOut,
  handleRedirectResult,
  isFirebaseAuthConfigured,
  firebaseAuthUnavailableReason,
} from '../../config/firebase';
import {
  loginWithEmail,
  registerWithEmail,
  syncFirebaseUser,
  type AuthUser,
  type LoginSuccessData,
} from '../../services/authService';
import {
  finalizeAuthenticatedSession,
  getReturnToFromLocationState,
  navigateToPostLoginDestination,
  resolvePostLoginDestination,
} from '../../utils/authSession';
import { SocialAuthButtons } from './components/SocialAuthButtons';
import { AuthMethodTabs } from './components/AuthMethodTabs';
import { AuthModeSwitch } from './components/AuthModeSwitch';
import { BiometricLoginButton } from '../../features/auth/components/BiometricLogin';
import './AuthPages.css';

// ─── Types ─────────────────────────────────────────────────────────────────

type AuthMode = 'signin' | 'signup';
type AuthTab = 'email' | 'phone';
type SignupStep = 1 | 2 | 3; // 1=credentials, 2=category, 3=role

interface SocialRecoveryState {
  visible: boolean;
  provider: 'google' | 'facebook' | 'apple' | null;
  firebaseUser: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
  reason: string;
  retryCount: number;
  isRetrying: boolean;
  maxRetries: number;
}

const MAX_SOCIAL_RETRIES = 3;

// ─── Category/Role Data ─────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'client', label: 'Client', description: 'Browse and purchase properties' },
  { id: 'staff', label: 'Staff Member', description: 'Internal team member' },
];

// ─── Component ──────────────────────────────────────────────────────────────

const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const returnTo = getReturnToFromLocationState(location.state);

  // Handle redirect result from Firebase social auth
  useEffect(() => {
    const processRedirect = async () => {
      try {
        const result = await handleRedirectResult();
        if (result?.user) {
          console.log('Got redirect result user:', result.user);
          const backendResponse = await syncFirebaseUser({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
            getIdToken: (forceRefresh?: boolean) => result.user.getIdToken(forceRefresh),
          });
          const user = backendResponse?.data?.user ?? null;
          if (user && backendResponse.data.token) {
            const destination = finalizeAuthenticatedSession({
              dispatch,
              user: user as any,
              token: backendResponse.data.token,
              provider: 'google' as any,
              rememberMe: false,
              returnTo,
            });
            setSuccessMsg('Sign in successful!');
            setTimeout(() => {
              navigateToPostLoginDestination(navigate, destination);
            }, 1500);
          }
        }
      } catch (error: unknown) {
        console.error('Error processing redirect result:', error);
        setError('Error processing sign-in redirect. Please try again.');
      }
    };
    processRedirect();
  }, [dispatch, navigate, returnTo]);

  // Auth mode
  const [mode, setMode] = useState<AuthMode>('signin');
  const [activeTab, setActiveTab] = useState<AuthTab>('email');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Signup multi-step
  const [signupStep, setSignupStep] = useState<SignupStep>(1);
  const [registeredUser, setRegisteredUser] = useState<AuthUser | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Social recovery panel
  const [socialRecovery, setSocialRecovery] = useState<SocialRecoveryState>({
    visible: false,
    provider: null,
    firebaseUser: null,
    reason: '',
    retryCount: 0,
    isRetrying: false,
    maxRetries: MAX_SOCIAL_RETRIES,
  });

  // Gmail troubleshooting panel
  const [showGmailTroubleshooting, setShowGmailTroubleshooting] = useState(false);

  // ─── Helpers ────────────────────────────────────────────────────────────

  const resetState = useCallback(() => {
    setError(null);
    setSuccessMsg(null);
    setSocialRecovery(prev => ({ ...prev, visible: false, provider: null, firebaseUser: null }));
    setShowGmailTroubleshooting(false);
  }, []);

  const switchMode = useCallback(() => {
    setMode(prev => (prev === 'signin' ? 'signup' : 'signin'));
    resetState();
    setSignupStep(1);
    setRegisteredUser(null);
    setSelectedCategory(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }, [resetState]);

  // ─── Email/Password Auth ─────────────────────────────────────────────────

  const validateSignup = (): string | null => {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return 'Password must contain at least one letter and one number';
    }
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === 'signup') {
      // Validate first
      const validationError = validateSignup();
      if (validationError) {
        setError(validationError);
        return;
      }

      setLoading(true);
      try {
        const response = await registerWithEmail(email, password);
        const user = response?.data?.user ?? null;
        if (user && response.data?.token) {
          const destination = finalizeAuthenticatedSession({
            dispatch,
            user: user as any,
            token: response.data.token,
            provider: 'email',
            rememberMe: false,
            returnTo,
          });
          setRegisteredUser(user);
          setSignupStep(2);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Registration failed';
        setError(msg);
      } finally {
        setLoading(false);
      }
    } else {
      // Sign in
      setLoading(true);
      try {
        const response = await loginWithEmail(email, password);
        if (response.success && !response.requiresTwoFactor) {
          const successData = response.data as LoginSuccessData;
          const user = successData.user;
          const destination = finalizeAuthenticatedSession({
            dispatch,
            user: user as any,
            token: successData.token,
            provider: 'email',
            rememberMe: false,
            returnTo,
          });
          setSuccessMsg('Sign in successful!');
          setTimeout(() => {
            navigateToPostLoginDestination(navigate, destination);
          }, 1500);
        } else {
          setError('Two-factor authentication is required');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Sign in failed';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
  };

  // ─── Role Selection ──────────────────────────────────────────────────────

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleCategoryContinue = () => {
    if (!selectedCategory) return;
    // Finalize registration with selected role
    const user = registeredUser;
    if (user) {
      const destination = resolvePostLoginDestination({ user: user as any, returnTo });
      navigateToPostLoginDestination(navigate, destination);
    }
  };

  // ─── Social Auth ─────────────────────────────────────────────────────────

  const handleSocialAuth = useCallback(
    async (provider: 'google' | 'facebook' | 'apple') => {
      setError(null);
      setShowGmailTroubleshooting(false);
      setLoading(true);

      try {
        let firebaseResult: {
          user: {
            uid: string;
            email: string | null;
            displayName: string | null;
            photoURL: string | null;
            getIdToken?: (forceRefresh?: boolean) => Promise<string>;
          };
        } | null = null;

        if (provider === 'google') {
          firebaseResult = (await signInWithGoogle()) as any;
        } else if (provider === 'facebook') {
          firebaseResult = (await signInWithFacebook()) as any;
        } else if (provider === 'apple') {
          firebaseResult = (await signInWithApple()) as any;
        }

        // If we did a redirect (firebaseResult is null), don't show error —
        // useEffect will handle the redirect result when the component mounts again!
        if (!firebaseResult?.user) {
          console.log('No firebaseResult.user: user as any, probably did a redirect.');
          setLoading(false);
          return;
        }

        const fbUser = firebaseResult.user;

        // Sync with backend
        try {
          console.log('Calling syncFirebaseUser with fbUser:', fbUser);
          const backendResponse = await syncFirebaseUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            getIdToken: ((forceRefresh?: boolean) =>
              (fbUser as any).getIdToken?.(forceRefresh)) as any,
          });

          const user = backendResponse?.data?.user ?? null;
          if (user && backendResponse.data.token) {
            const destination = finalizeAuthenticatedSession({
              dispatch,
              user: user as any,
              token: backendResponse.data.token,
              provider,
              rememberMe: false,
              returnTo,
            });
            setSuccessMsg('Sign in successful!');
            setTimeout(() => {
              navigateToPostLoginDestination(navigate, destination);
            }, 1500);
          } else {
            throw new Error('Invalid response from backend');
          }
        } catch (syncErr: unknown) {
          // Backend sync failed — show recovery panel
          await signOut().catch(() => {});
          const reason = syncErr instanceof Error ? syncErr.message : 'Backend sync failed';
          setSocialRecovery({
            visible: true,
            provider,
            firebaseUser: fbUser,
            reason,
            retryCount: MAX_SOCIAL_RETRIES,
            isRetrying: false,
            maxRetries: MAX_SOCIAL_RETRIES,
          });
        }
      } catch (authErr: unknown) {
        console.error('Social auth error:', authErr);
        const errMsg = authErr instanceof Error ? authErr.message : 'Authentication error';
        if (provider === 'google' && errMsg.includes('popup')) {
          setShowGmailTroubleshooting(true);
        } else {
          setError(errMsg);
        }
      } finally {
        setLoading(false);
      }
    },
    [dispatch, navigate, returnTo]
  );

  // ─── Social Recovery ─────────────────────────────────────────────────────

  const handleSocialRetry = useCallback(async () => {
    if (!socialRecovery.firebaseUser || socialRecovery.retryCount <= 0) return;

    setSocialRecovery(prev => ({ ...prev, isRetrying: true }));

    try {
      // Re-auth with Firebase
      let firebaseResult: {
        user: {
          uid: string;
          email: string | null;
          displayName: string | null;
          photoURL: string | null;
          getIdToken?: (forceRefresh?: boolean) => Promise<string>;
        };
      } | null = null;

      if (socialRecovery.provider === 'google') {
        firebaseResult = (await signInWithGoogle()) as any;
      } else if (socialRecovery.provider === 'facebook') {
        firebaseResult = (await signInWithFacebook()) as any;
      } else if (socialRecovery.provider === 'apple') {
        firebaseResult = (await signInWithApple()) as any;
      }

      const fbUser = firebaseResult?.user ?? socialRecovery.firebaseUser;

      const backendResponse = await syncFirebaseUser({
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
        photoURL: fbUser.photoURL,
        getIdToken: ((forceRefresh?: boolean) => (fbUser as any).getIdToken?.(forceRefresh)) as any,
      });

      const user = backendResponse?.data?.user ?? null;
      if (user && backendResponse.data.token) {
        const destination = finalizeAuthenticatedSession({
          dispatch,
          user: user as any,
          token: backendResponse.data.token,
          provider: socialRecovery.provider as any,
          rememberMe: false,
          returnTo,
        });
        setSocialRecovery(prev => ({ ...prev, visible: false, isRetrying: false }));
        setSuccessMsg('Sign in successful!');
        setTimeout(() => {
          navigateToPostLoginDestination(navigate, destination);
        }, 1500);
      } else {
        throw new Error('Invalid response from backend');
      }
    } catch (retryErr: unknown) {
      const reason = retryErr instanceof Error ? retryErr.message : 'Retry failed';
      setSocialRecovery(prev => ({
        ...prev,
        isRetrying: false,
        reason,
        retryCount: prev.retryCount - 1,
      }));
    }
  }, [socialRecovery, dispatch, navigate, returnTo]);

  const handleSocialRecoveryDismiss = useCallback(() => {
    setSocialRecovery(prev => ({ ...prev, visible: false }));
  }, []);

  // ─── Biometric ───────────────────────────────────────────────────────────

  const handleBiometricSuccess = useCallback(
    (data: any) => {
      const user = data as { uid: string; email: string; displayName: string };
      const destination = resolvePostLoginDestination({ user: user as any, returnTo });
      navigateToPostLoginDestination(navigate, destination);
    },
    [dispatch, navigate, returnTo]
  );

  // ─── Firebase Helper Text ─────────────────────────────────────────────────

  const googleHelperText = !isFirebaseAuthConfigured
    ? `Google sign-in is temporarily unavailable because Firebase authentication is not configured. ${firebaseAuthUnavailableReason || ''}`.trim()
    : undefined;

  // ─── Render ───────────────────────────────────────────────────────────────

  const isSignup = mode === 'signup';
  const retriesLeft = socialRecovery.retryCount;
  const retryLimitReached = retriesLeft <= 0 && socialRecovery.retryCount === 0;

  // Step 2 — Category selection after signup
  if (isSignup && signupStep === 2) {
    return (
      <div className="auth-page-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Select Your Category</h1>
            <p>Choose the category that best describes you</p>
          </div>

          <div className="category-selection">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat.id)}
              >
                <span className="category-label">{cat.label}</span>
                <span className="category-desc">{cat.description}</span>
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary"
            onClick={handleCategoryContinue}
            disabled={!selectedCategory}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <span className="auth-logo-text">White Caves</span>
          </div>
          <h1>{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="auth-subtitle">
            {isSignup
              ? 'Join White Caves to explore luxury properties in Dubai'
              : 'Sign in to access your personalized dashboard'}
          </p>
        </div>

        {/* Social Auth */}
        <SocialAuthButtons
          loading={loading}
          onSocialAuth={handleSocialAuth}
          label="Continue with"
          googleText="Google"
          facebookText="Facebook"
          appleText="Apple"
          googleDisabled={!isFirebaseAuthConfigured}
          helperText={googleHelperText}
        />

        {/* Gmail Troubleshooting Panel */}
        {showGmailTroubleshooting && (
          <div className="gmail-troubleshooting-panel" role="alert">
            <p>Trouble signing in with Gmail?</p>
            <p>
              Your browser may be blocking popups. Try allowing popups or use email sign-in instead.
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowGmailTroubleshooting(false);
                setActiveTab('email');
              }}
            >
              Continue with Email
            </button>
          </div>
        )}

        {/* Social Recovery Panel */}
        {socialRecovery.visible && (
          <div className="social-recovery-panel" role="alert">
            <p>Your sign-in needs one more step</p>
            <p className="recovery-detail">
              backend session setup failed — Reason: {socialRecovery.reason}
            </p>
            <p>Retries remaining: {retriesLeft}</p>

            {retriesLeft <= 0 ? (
              <>
                <p>Too many retry attempts. Please try again later or use email sign-in.</p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled
                  aria-label="Retry limit reached"
                >
                  Retry limit reached
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSocialRetry}
                disabled={socialRecovery.isRetrying}
                aria-label={
                  socialRecovery.isRetrying
                    ? 'Retrying...'
                    : `Retry ${socialRecovery.provider === 'google' ? 'Google' : socialRecovery.provider} sign-in`
                }
              >
                {socialRecovery.isRetrying
                  ? 'Retrying...'
                  : `Retry ${socialRecovery.provider === 'google' ? 'Google' : socialRecovery.provider} sign-in`}
              </button>
            )}

            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleSocialRecoveryDismiss}
              disabled={socialRecovery.isRetrying}
              aria-label="Dismiss recovery notice"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Auth Method Tabs */}
        <AuthMethodTabs
          activeTab={activeTab}
          onChange={tab => {
            setActiveTab(tab);
            setError(null);
          }}
          emailLabel="Email"
          phoneLabel="Phone"
        />

        {/* Email Form */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailSubmit} className="auth-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>

            {isSignup && (
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            )}

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="auth-success" role="status">
                {successMsg}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Phone Form */}
        {activeTab === 'phone' && (
          <form className="auth-form">
            <div className="form-group">
              <input
                type="tel"
                placeholder="+971 50 123 4567"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="form-input"
              />
            </div>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Please wait...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Biometric */}
        <BiometricLoginButton onSuccess={handleBiometricSuccess} onError={() => {}} />

        {/* Mode Switch */}
        <AuthModeSwitch
          mode={mode}
          onSwitch={switchMode}
          signInPromptText="Already have an account? Sign In"
          signUpPromptText="Don't have an account? Sign Up"
        />
      </div>
    </div>
  );
};

export default SignInPage;
