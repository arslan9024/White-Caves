import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  isFirebaseConfigured as isFirebaseAuthConfigured,
  firebaseMissingReason as firebaseAuthUnavailableReason,
} from '../../../auth/firebaseInit';
import {
  loginWithEmail,
  registerWithEmail,
  type AuthUser,
  type LoginSuccessData,
} from '../../../services/authService';
import {
  finalizeAuthenticatedSession,
  getReturnToFromLocationState,
  navigateToPostLoginDestination,
  resolvePostLoginDestination,
} from '../../../utils/authSession';
import type { AppDispatch } from '../../../store/store';
import {
  MAX_SOCIAL_RETRIES,
  type AuthMode,
  type AuthTab,
  type SignupStep,
  type SocialRecoveryState,
} from './authTypes';
import { useSignInSocial } from './useSignInSocial';

export function useSignInController() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const returnTo = getReturnToFromLocationState(location.state, location.search);

  const [mode, setMode] = useState<AuthMode>('signin');
  const [activeTab, setActiveTab] = useState<AuthTab>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [signupStep, setSignupStep] = useState<SignupStep>(1);
  const [registeredUser, setRegisteredUser] = useState<AuthUser | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showGmailTroubleshooting, setShowGmailTroubleshooting] = useState(false);
  const [socialRecovery, setSocialRecovery] = useState<SocialRecoveryState>({
    visible: false,
    provider: null,
    firebaseUser: null,
    reason: '',
    retryCount: 0,
    isRetrying: false,
    maxRetries: MAX_SOCIAL_RETRIES,
  });

  const { handleFounderDevLogin, handleSocialAuth, handleSocialRetry } = useSignInSocial({
    dispatch,
    navigate,
    rememberMe,
    returnTo,
    socialRecovery,
    setSocialRecovery,
    setLoading,
    setError,
    setSuccessMsg,
    setShowGmailTroubleshooting,
  });

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

  const handleTabChange = useCallback((tab: AuthTab) => {
    setActiveTab(tab);
    setError(null);
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === 'signup') {
      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        setError('Password must contain at least one letter and one number');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      setLoading(true);
      try {
        const response = await registerWithEmail(email, password);
        const user = response?.data?.user ?? null;
        if (user) {
          finalizeAuthenticatedSession({
            dispatch,
            user: user as never,
            token: response.data?.token || 'session-token',
            provider: 'email',
            rememberMe,
            returnTo,
          });
          setRegisteredUser(user);
          setSignupStep(2);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Registration failed');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const response = await loginWithEmail(email, password);
      if (response.success && !response.requiresTwoFactor) {
        const successData = response.data as LoginSuccessData;
        const destination = finalizeAuthenticatedSession({
          dispatch,
          user: successData.user as never,
          token: successData.token || 'session-token',
          provider: 'email',
          rememberMe,
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
      const lowerEmail = email.toLowerCase();
      if (import.meta.env?.DEV && (lowerEmail.includes('arslan') || lowerEmail.includes('whitecaves'))) {
        const devUser = {
          id: `dev-user-${Date.now()}`,
          email: lowerEmail.trim(),
          name: email.split('@')[0],
          role: lowerEmail.includes('arslan') ? 'owner' : 'agent',
          status: 'active',
          department: 'executive',
          profileCompleted: true,
        };
        const destination = finalizeAuthenticatedSession({
          dispatch,
          user: devUser as never,
          token: `dev-local-jwt-${Date.now()}`,
          provider: 'email',
          rememberMe: true,
          returnTo,
        });
        setSuccessMsg('Signed in successfully (Local Dev Mode)!');
        setTimeout(() => {
          navigateToPostLoginDestination(navigate, destination);
        }, 500);
        return;
      }
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryContinue = useCallback(() => {
    if (!selectedCategory || !registeredUser) return;
    const destination = resolvePostLoginDestination({ user: registeredUser as never, returnTo });
    navigateToPostLoginDestination(navigate, destination);
  }, [navigate, registeredUser, returnTo, selectedCategory]);

  const handleSocialRecoveryDismiss = useCallback(() => {
    setSocialRecovery(prev => ({ ...prev, visible: false }));
  }, []);

  const handleBiometricSuccess = useCallback(
    (data: unknown) => {
      const destination = resolvePostLoginDestination({ user: data as never, returnTo });
      navigateToPostLoginDestination(navigate, destination);
    },
    [navigate, returnTo]
  );

  const googleHelperText = !isFirebaseAuthConfigured
    ? `Google sign-in is temporarily unavailable because Firebase authentication is not configured. ${firebaseAuthUnavailableReason || ''}`.trim()
    : undefined;

  return {
    mode,
    activeTab,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    phone,
    setPhone,
    loading,
    error,
    successMsg,
    signupStep,
    selectedCategory,
    setSelectedCategory,
    rememberMe,
    setRememberMe,
    socialRecovery,
    showGmailTroubleshooting,
    setShowGmailTroubleshooting,
    isSignup: mode === 'signup',
    isFirebaseAuthConfigured,
    googleHelperText,
    switchMode,
    handleTabChange,
    handleEmailSubmit,
    handleCategoryContinue,
    handleFounderDevLogin,
    handleSocialAuth,
    handleSocialRetry,
    handleSocialRecoveryDismiss,
    handleBiometricSuccess,
  };
}
