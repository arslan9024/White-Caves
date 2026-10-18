/**
 * useSignIn Hook
 * ==============
 * Extracted from SignInPage — owns all auth state, form handling,
 * social / email / phone sign-in, OTP verification, role selection,
 * and backend sync logic.
 */

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
  signInWithPhone,
  auth as firebaseAuth,
  createRecaptchaVerifier,
  signOut as signOutFirebase,
  isFirebaseAuthConfigured,
  handleRedirectResult,
} from '../config/firebase';
import {
  loginWithEmail as backendLogin,
  registerWithEmail as backendRegister,
  syncFirebaseUser,
  completeSocialRegistration,
  verifyTwoFactor as backendVerifyTwoFactor,
  requestPasswordReset,
  verifyPasswordResetToken,
  resetPasswordWithToken,
  type LoginSuccessData,
  type TwoFactorChallengeData,
} from '../services/authService';
import {
  finalizeAuthenticatedSession,
  getReturnToFromLocationState,
  navigateToPostLoginDestination,
} from '../utils/authSession';
import type { UserCredential } from 'firebase/auth';

// ─── Types ──────────────────────────────────────────────────────────

interface PendingUser {
  id: string;
  email: string;
  name: string;
  photo?: string;
  fromSocialProvider?: string;
  sessionToken?: string;
}

interface ConfirmationResult {
  confirm: (otp: string) => Promise<{
    user: {
      uid: string;
      email: string | null;
      phoneNumber?: string | null;
      displayName: string | null;
      photoURL: string | null;
    };
  }>;
}

interface SocialSyncRecovery {
  provider: 'google' | 'facebook' | 'apple';
  reason: string;
}

type SupportedSocialProvider = 'google' | 'facebook' | 'apple';

interface SocialAuthErrorLike {
  code?: string;
  message?: string;
}

const MAX_SOCIAL_RETRY_ATTEMPTS = 3;

const hasVerifiedMasterRole = (user: {
  role?: string;
  status?: string;
  accessLevel?: number;
}): boolean =>
  user.role?.toLowerCase() === 'managing_director' &&
  user.status === 'active' &&
  user.accessLevel === 5;

const toTitleCase = (value: string): string =>
  value.length > 0 ? `${value[0].toUpperCase()}${value.slice(1)}` : value;

const normalizeSocialAuthErrorMessage = (error: unknown, provider: string): string => {
  const socialError = error as SocialAuthErrorLike;
  const socialErrorCode = socialError?.code;

  switch (socialErrorCode) {
    case 'auth/popup-blocked':
      return `Unable to open ${toTitleCase(provider)} sign-in popup. Please allow popups and try again.`;
    case 'auth/popup-closed-by-user':
      return `${toTitleCase(provider)} sign-in was cancelled before completion.`;
    case 'auth/cancelled-popup-request':
      return `Another sign-in request interrupted ${toTitleCase(provider)} authentication. Please retry.`;
    case 'auth/network-request-failed':
      return 'Network issue detected during social sign-in. Please check your connection and retry.';
    case 'auth/unauthorized-domain':
      return `${toTitleCase(provider)} sign-in is blocked for this domain. Please contact support to authorize this domain in Firebase.`;
    case 'auth/operation-not-allowed':
      return `${toTitleCase(provider)} sign-in is not enabled for this environment yet. Please use email sign-in or contact support.`;
    case 'auth/account-exists-with-different-credential':
      return 'This email is already registered with a different sign-in method. Try email sign-in to continue.';
    default:
      break;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  if (typeof socialError?.message === 'string' && socialError.message.trim()) {
    return socialError.message.trim();
  }

  return `${toTitleCase(provider)} authentication failed. Please try again.`;
};

const isSupportedSocialProvider = (provider: string): provider is SupportedSocialProvider =>
  provider === 'google' || provider === 'facebook' || provider === 'apple';

const shouldClearFirebaseSessionAfterSyncFailure = (message: string): boolean =>
  /uid mismatch|email mismatch|token verification failed|invalid firebase token|verified firebase email is required|authentication token is missing|firebase token is required/i.test(
    message.toLowerCase()
  );

const deriveProfileCompletionSignal = (user: {
  name?: string | null;
  phone?: string | null;
  profileCompleted?: boolean;
  profileComplete?: boolean;
  profileCompletion?: {
    profileCompleted?: boolean;
  };
}): boolean | undefined => {
  if (typeof user.profileCompleted === 'boolean') {
    return user.profileCompleted;
  }

  if (typeof user.profileComplete === 'boolean') {
    return user.profileComplete;
  }

  if (typeof user.profileCompletion?.profileCompleted === 'boolean') {
    return user.profileCompletion.profileCompleted;
  }

  const hasPhoneField = Object.prototype.hasOwnProperty.call(user, 'phone');
  if (!hasPhoneField) {
    return undefined;
  }

  const hasName = typeof user.name === 'string' && user.name.trim().length > 0;
  const hasPhone = typeof user.phone === 'string' && user.phone.trim().length > 0;
  return hasName && hasPhone;
};

export interface UserCategory {
  id: string;
  label: string;
  icon: string;
  desc: string;
  color: string;
}

export interface UserRole {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

// ─── Data ───────────────────────────────────────────────────────────

export const USER_CATEGORIES: UserCategory[] = [
  {
    id: 'client',
    label: 'Client',
    icon: '🏠',
    desc: 'Looking to buy, sell, or rent property',
    color: '#10b981',
  },
  {
    id: 'staff',
    label: 'Staff Member',
    icon: '💼',
    desc: 'White Caves employee or agent',
    color: '#3b82f6',
  },
];

export const CLIENT_ROLES: UserRole[] = [
  { id: 'buyer', label: 'Buyer', icon: '🔍', desc: 'Looking to purchase property' },
  { id: 'seller', label: 'Seller', icon: '💰', desc: 'Want to sell your property' },
  { id: 'landlord', label: 'Landlord', icon: '🏢', desc: 'Renting out your property' },
  { id: 'tenant', label: 'Tenant', icon: '🔑', desc: 'Looking to rent a property' },
];

export const STAFF_ROLES: UserRole[] = [
  { id: 'leasing-agent', label: 'Leasing Agent', icon: '📋', desc: 'Property rental specialist' },
  {
    id: 'secondary-sales-agent',
    label: 'Sales Agent',
    icon: '📊',
    desc: 'Property sales specialist',
  },
  { id: 'team-leader', label: 'Team Leader', icon: '👥', desc: 'Managing agent teams' },
];

// ─── Hook ───────────────────────────────────────────────────────────

export function useSignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const returnTo = getReturnToFromLocationState(location.state);

  // ── Step & mode state ─────────────────────────────────────────
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [verifyResetLoading, setVerifyResetLoading] = useState(false);
  const [completeResetLoading, setCompleteResetLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetStage, setResetStage] = useState<
    'request' | 'verify' | 'reset' | 'success' | 'locked'
  >('request');
  const [resetToken, setResetToken] = useState('');
  const [resetSessionToken, setResetSessionToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // ── Form fields ────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  // ── Phone / OTP ────────────────────────────────────────────────
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // ── 2FA verification ───────────────────────────────────────────
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // ── Post-auth pending user ─────────────────────────────────────
  const [pendingUser, setPendingUser] = useState<PendingUser | null>(null);
  const [socialSyncRecovery, setSocialSyncRecovery] = useState<SocialSyncRecovery | null>(null);
  const [socialRetryAttempts, setSocialRetryAttempts] = useState(0);

  const googleAuthUnavailableMessage =
    'Social and phone sign-in are temporarily unavailable. Use email sign-in or try again later.';

  const hasResetTokenInUrl = useRef(false);

  useEffect(() => {
    if (
      !['/signin', '/signup', '/forgot-password', '/reset-password'].includes(location.pathname)
    ) {
      return;
    }
    setMode(location.pathname === '/signup' ? 'signup' : 'signin');
    setStep(1);
  }, [location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromQuery = params.get('reset_email');
    const tokenFromQuery = params.get('reset_token');

    if (!emailFromQuery || !tokenFromQuery) {
      return;
    }

    hasResetTokenInUrl.current = true;
    setMode('signin');
    setStep(1);
    setActiveTab('email');
    setEmail(emailFromQuery.trim().toLowerCase());
    setResetToken(tokenFromQuery.trim());
    setResetStage('verify');
    setSuccess('Reset token detected. Verify token to continue with password reset.');
  }, [location.search]);

  // ── Helpers ────────────────────────────────────────────────────

  const handleSignInSuccess = useCallback(
    (
      user: {
        id: string;
        email: string | null;
        name: string | null;
        displayName?: string | null;
        role?: string;
        status?: string;
        accessLevel?: number;
        phone?: string | null;
        photoUrl?: string | null;
        profileCompleted?: boolean;
        profileComplete?: boolean;
      },
      session?: { token?: string; provider?: string }
    ): void => {
      const resolvedStatus = user.status?.toLowerCase().trim() || 'active';
      const profileCompleted = deriveProfileCompletionSignal(user);
      const destination = finalizeAuthenticatedSession({
        dispatch,
        token: session?.token,
        provider: session?.provider ?? 'backend',
        returnTo,
        user: {
          id: user.id,
          email: user.email || '',
          name: user.name || user.displayName || undefined,
          displayName: user.displayName || user.name || undefined,
          role: user.role,
          status:
            resolvedStatus === 'active' || resolvedStatus === 'pending'
              ? resolvedStatus
              : 'suspended',
          accessLevel: user.accessLevel,
          photoURL: user.photoUrl || undefined,
          phone: user.phone || undefined,
          profileCompleted,
        },
      });
      setSuccess('Sign in successful!');
      navigateToPostLoginDestination(navigate, destination);
    },
    [dispatch, navigate, returnTo]
  );

  const handleSignUpSuccess = useCallback(
    (
      user: {
        id: string;
        email: string | null;
        name: string | null;
        photoUrl?: string | null;
      },
      options?: { fromSocialProvider?: string; sessionToken?: string }
    ): void => {
      setPendingUser({
        id: user.id,
        email: user.email || '',
        name: user.name || fullName,
        photo: user.photoUrl || undefined,
        fromSocialProvider: options?.fromSocialProvider,
        sessionToken: options?.sessionToken,
      });
      setStep(2);
    },
    [fullName]
  );

  // ── Step navigation ────────────────────────────────────────────

  const proceedToRoleSelection = useCallback((): void => {
    if (!selectedCategory) {
      setError('Please select a category');
      return;
    }
    setError('');
    setStep(3);
  }, [selectedCategory]);

  const completeSignUp = useCallback(async (): Promise<void> => {
    if (!selectedRole) {
      setError('Please select a role to continue');
      return;
    }

    setLoading(true);
    setError('');

    const isSocialRegistration = Boolean(pendingUser?.fromSocialProvider);

    try {
      const response = isSocialRegistration
        ? await completeSocialRegistration(
            selectedCategory,
            selectedRole,
            pendingUser?.sessionToken ?? ''
          )
        : await backendRegister(
            email,
            password,
            fullName || undefined,
            undefined,
            undefined,
            selectedCategory,
            selectedRole
          );

      if (!response?.data?.user) {
        throw new Error('Invalid response: missing user data');
      }

      const backendUser = response.data.user;
      handleSignInSuccess(backendUser, {
        token: response.data.token,
        provider: pendingUser?.fromSocialProvider ?? 'email',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [selectedRole, selectedCategory, email, password, fullName, pendingUser, handleSignInSuccess]);

  // ── Social auth redirect handling ──────────────────────────────
  useEffect(() => {
    const processRedirect = async () => {
      try {
        const result = await handleRedirectResult();
        if (result && result.user) {
          setLoading(true);
          const redirectMode = location.pathname === '/signup' ? 'signup' : 'signin';
          const backendResponse = await syncFirebaseUser(result.user, {
            intent: redirectMode,
            persistSession: redirectMode === 'signin',
          });
          if (!backendResponse?.data?.user) {
            throw new Error('Invalid backend response: missing user data');
          }
          const backendUser = backendResponse.data.user;
          setSocialSyncRecovery(null);
          setSocialRetryAttempts(0);
          setError('');

          if (redirectMode === 'signup' && !hasVerifiedMasterRole(backendUser)) {
            handleSignUpSuccess(backendUser, {
              fromSocialProvider: result.providerId || 'social',
              sessionToken: backendResponse.data.token,
            });
          } else {
            handleSignInSuccess(
              {
                ...backendUser,
                photoUrl: backendUser.photoUrl || result.user.photoURL,
                displayName: backendUser.name || result.user.displayName,
              },
              { token: backendResponse.data.token, provider: 'social' }
            );
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Redirect auth failed';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    void processRedirect();
  }, [handleSignInSuccess, handleSignUpSuccess, location.pathname]);

  const handleSocialAuth = useCallback(
    async (provider: string, options?: { isRetry?: boolean }): Promise<void> => {
      if (!isFirebaseAuthConfigured) {
        setError(googleAuthUnavailableMessage);
        return;
      }

      if (!isSupportedSocialProvider(provider)) {
        setSocialSyncRecovery(null);
        setSocialRetryAttempts(0);
        setError('Invalid provider');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        let firebaseResult: UserCredential | void;

        try {
          switch (provider) {
            case 'google':
              firebaseResult = await signInWithGoogle();
              break;
            case 'facebook':
              firebaseResult = await signInWithFacebook();
              break;
            case 'apple':
              firebaseResult = await signInWithApple();
              break;
            default:
              throw new Error('Invalid provider');
          }
        } catch (providerError: unknown) {
          const providerMessage = normalizeSocialAuthErrorMessage(providerError, provider);
          setSocialSyncRecovery(null);
          setSocialRetryAttempts(0);
          setError(providerMessage);
          setLoading(false);
          return;
        }

        if (!firebaseResult?.user) {
          setLoading(false);
          return;
        }

        const firebaseUser = firebaseResult.user;
        const backendResponse = await syncFirebaseUser(firebaseUser, {
          intent: mode === 'signup' ? 'signup' : 'signin',
          persistSession: mode === 'signin',
        });

        if (!backendResponse?.data?.user) {
          throw new Error('Invalid backend response: missing user data');
        }

        const backendUser = backendResponse.data.user;
        setSocialSyncRecovery(null);
        setSocialRetryAttempts(0);
        setError('');

        if (mode === 'signup') {
          if (hasVerifiedMasterRole(backendUser)) {
            handleSignInSuccess(
              {
                ...backendUser,
                photoUrl: backendUser.photoUrl || firebaseUser.photoURL,
                displayName: backendUser.name || firebaseUser.displayName,
              },
              { token: backendResponse.data.token, provider }
            );
          } else {
            handleSignUpSuccess(backendUser, {
              fromSocialProvider: provider,
              sessionToken: backendResponse.data.token,
            });
          }
        } else {
          handleSignInSuccess({
            ...backendUser,
            photoUrl: backendUser.photoUrl || firebaseUser.photoURL,
            displayName: backendUser.name || firebaseUser.displayName,
          });
        }
      } catch (err: unknown) {
        const syncMessage =
          err instanceof Error && err.message.trim()
            ? err.message.trim()
            : 'Unable to complete authentication sync';
        setSocialSyncRecovery({
          provider: provider as SupportedSocialProvider,
          reason: syncMessage,
        });
        setError(`backend session setup failed: ${syncMessage}`);
      } finally {
        setLoading(false);
      }
    },
    [googleAuthUnavailableMessage, handleSignInSuccess, handleSignUpSuccess, mode]
  );

  const retrySocialAuth = useCallback(async (): Promise<void> => {
    if (!socialSyncRecovery) {
      return;
    }

    const nextAttemptCount = socialRetryAttempts + 1;
    if (nextAttemptCount > MAX_SOCIAL_RETRY_ATTEMPTS) {
      setError('Retry limit reached. Please switch to email login or try again later.');
      return;
    }

    setSocialRetryAttempts(nextAttemptCount);

    if (socialSyncRecovery.provider === 'google' && firebaseAuth?.currentUser) {
      setLoading(true);
      setError('');

      try {
        const backendResponse = await syncFirebaseUser(firebaseAuth.currentUser, {
          intent: mode === 'signup' ? 'signup' : 'signin',
          persistSession: mode === 'signin',
        });
        if (!backendResponse?.data?.user) {
          throw new Error('Invalid backend response: missing user data');
        }

        const backendUser = backendResponse.data.user;
        setSocialSyncRecovery(null);
        setSocialRetryAttempts(0);
        setError('');

        if (mode === 'signup') {
          if (hasVerifiedMasterRole(backendUser)) {
            handleSignInSuccess(backendUser, {
              token: backendResponse.data.token,
              provider: 'google',
            });
          } else {
            handleSignUpSuccess(backendUser, {
              fromSocialProvider: 'google',
              sessionToken: backendResponse.data.token,
            });
          }
        } else {
          handleSignInSuccess(backendUser, {
            token: backendResponse.data.token,
            provider: 'google',
          });
        }
      } catch (syncError: unknown) {
        const syncMessage =
          syncError instanceof Error && syncError.message.trim()
            ? syncError.message.trim()
            : 'Unable to complete authentication sync';
        setSocialSyncRecovery({ provider: 'google', reason: syncMessage });
        setError(`backend session setup failed: ${syncMessage}`);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      await handleSocialAuth(socialSyncRecovery.provider, { isRetry: true });
    } catch {
      // noop; handleSocialAuth already surfaces errors in state
    }
  }, [
    handleSignInSuccess,
    handleSignUpSuccess,
    handleSocialAuth,
    mode,
    socialSyncRecovery,
    socialRetryAttempts,
  ]);

  const clearSocialRecovery = useCallback((): void => {
    setSocialSyncRecovery(null);
    setSocialRetryAttempts(0);
    setError('');
  }, []);

  const remainingSocialRetries = Math.max(0, MAX_SOCIAL_RETRY_ATTEMPTS - socialRetryAttempts);

  // ── Email auth ─────────────────────────────────────────────────

  const handleEmailSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      setLoading(true);
      setError('');

      const normalizedEmail = email.trim().toLowerCase();

      if (mode === 'signup' && password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (mode === 'signup') {
        if (password.length < 8) {
          setError('Password must be at least 8 characters');
          setLoading(false);
          return;
        }
        if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
          setError('Password must contain at least one letter and one number');
          setLoading(false);
          return;
        }
      }

      try {
        if (mode === 'signup') {
          handleSignUpSuccess({
            id: 'pending-signup',
            email: normalizedEmail,
            name: fullName || normalizedEmail,
          });
        } else {
          const response = await backendLogin(normalizedEmail, password);
          if (response.requiresTwoFactor) {
            const challengeData = response.data as TwoFactorChallengeData;
            if (!challengeData?.twoFactorToken) {
              throw new Error('The 2FA challenge could not be started. Please sign in again.');
            }
            setTwoFactorToken(challengeData.twoFactorToken);
            setTwoFactorCode('');
            setStep(4);
          } else {
            const data = response.data as LoginSuccessData;
            if (!data?.user) throw new Error('Invalid response: missing user data');
            handleSignInSuccess(data.user, { token: data.token, provider: 'email' });
          }
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Authentication failed';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [mode, email, password, confirmPassword, fullName, handleSignInSuccess, handleSignUpSuccess]
  );

  // ── 2FA verification ──────────────────────────────────────────────

  const handleTwoFactorSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        if (!twoFactorToken) {
          throw new Error('The 2FA challenge has expired. Please sign in again.');
        }
        const user = await backendVerifyTwoFactor(twoFactorToken, twoFactorCode);
        handleSignInSuccess(user);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Verification failed');
      } finally {
        setLoading(false);
      }
    },
    [twoFactorToken, twoFactorCode, handleSignInSuccess]
  );

  // ── Phone auth ─────────────────────────────────────────────────

  const handlePhoneSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      if (mode === 'signup') {
        setError(
          'Phone sign-up is unavailable. Use email or social sign-up, or switch to sign-in.'
        );
        return;
      }
      setLoading(true);
      setError('');

      try {
        const recaptchaVerifier = createRecaptchaVerifier('recaptcha-container');
        const result = await signInWithPhone(phone, recaptchaVerifier);
        setConfirmationResult(result);
        setShowOtpInput(true);
        setSuccess('OTP sent to your phone');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to send OTP');
      } finally {
        setLoading(false);
      }
    },
    [mode, phone]
  );

  const handleOtpVerify = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      if (mode === 'signup') {
        setError(
          'Phone sign-up is unavailable. Use email or social sign-up, or switch to sign-in.'
        );
        return;
      }
      setLoading(true);
      setError('');

      try {
        const result = await confirmationResult?.confirm(otp);
        if (!result?.user) {
          throw new Error('OTP verification failed');
        }

        try {
          const backendResponse = await syncFirebaseUser(result.user, {
            intent: 'signin',
          });
          const backendUser = backendResponse.data.user;
          handleSignInSuccess(backendUser);
        } catch (syncError: unknown) {
          await signOutFirebase().catch(() => {
            // noop: firebase session cleanup is best effort here
          });
          const syncMessage =
            syncError instanceof Error
              ? syncError.message
              : 'Unable to complete authentication sync';
          setError(
            `Phone verification succeeded but backend session setup failed: ${syncMessage}.`
          );
          setSuccess('');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Invalid OTP');
      } finally {
        setLoading(false);
      }
    },
    [confirmationResult, otp, mode, handleSignInSuccess]
  );

  const handleForgotPassword = useCallback(async (): Promise<void> => {
    const normalizedEmail = email.trim().toLowerCase();
    setError('');
    setSuccess('');

    if (!normalizedEmail) {
      setError('Please enter your email address first to receive a reset link.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      setError('Please enter a valid email address before requesting a reset link.');
      return;
    }

    setForgotPasswordLoading(true);
    try {
      await requestPasswordReset(normalizedEmail);
      setResetStage('verify');
      setSuccess(
        'Password reset requested. Check your inbox for the reset token, then verify it to continue.'
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(message);
      if (/rate-limit|too many|locked|retry/i.test(message.toLowerCase())) {
        setResetStage('locked');
      }
    } finally {
      setForgotPasswordLoading(false);
    }
  }, [email]);

  const handleVerifyResetToken = useCallback(async (): Promise<void> => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedToken = resetToken.trim();

    setError('');
    setSuccess('');

    if (!normalizedEmail) {
      setError('Please provide your email before verifying reset token.');
      return;
    }

    if (!normalizedToken) {
      setError('Please enter the reset token from your email.');
      return;
    }

    setVerifyResetLoading(true);
    try {
      const response = await verifyPasswordResetToken(normalizedEmail, normalizedToken);
      setResetSessionToken(response.data.resetSessionToken);
      setResetStage('reset');
      setSuccess('Reset token verified. You can now set a new password.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Reset token verification failed';
      setError(message);
      if (/rate-limit|too many|locked|retry/i.test(message.toLowerCase())) {
        setResetStage('locked');
      }
    } finally {
      setVerifyResetLoading(false);
    }
  }, [email, resetToken]);

  const handleCompletePasswordReset = useCallback(async (): Promise<void> => {
    setError('');
    setSuccess('');

    if (!resetSessionToken) {
      setError('Reset session is missing. Verify reset token again.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError('Password must contain at least one letter and one number.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setCompleteResetLoading(true);
    try {
      await resetPasswordWithToken(resetSessionToken, newPassword);
      setResetStage('success');
      setResetSessionToken('');
      setResetToken('');
      setNewPassword('');
      setConfirmNewPassword('');
      if (hasResetTokenInUrl.current) {
        navigate('/signin', { replace: true });
        hasResetTokenInUrl.current = false;
      }
      setSuccess('Password reset successful. You can now sign in with your new password.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setError(message);
      if (/rate-limit|too many|locked|retry/i.test(message.toLowerCase())) {
        setResetStage('locked');
      }
    } finally {
      setCompleteResetLoading(false);
    }
  }, [confirmNewPassword, navigate, newPassword, resetSessionToken]);

  // ── Mode switch ────────────────────────────────────────────────

  const switchMode = useCallback((): void => {
    setMode(prev => (prev === 'signin' ? 'signup' : 'signin'));
    setStep(1);
    setSelectedCategory('');
    setSelectedRole('');
    setError('');
    setSuccess('');
    setSocialSyncRecovery(null);
    setSocialRetryAttempts(0);
    setTwoFactorToken('');
    setTwoFactorCode('');
  }, []);

  const getRolesForCategory = useCallback((): UserRole[] => {
    return selectedCategory === 'staff' ? STAFF_ROLES : CLIENT_ROLES;
  }, [selectedCategory]);

  const goBackToStep = useCallback((targetStep: number): void => {
    setStep(targetStep);
    if (targetStep === 1) {
      setSelectedCategory('');
      setTwoFactorToken('');
      setTwoFactorCode('');
    }
    if (targetStep <= 2) setSelectedRole('');
  }, []);

  const resetOtp = useCallback((): void => {
    setShowOtpInput(false);
    setOtp('');
  }, []);

  return {
    // Mode & flow
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
    isGoogleAuthAvailable: isFirebaseAuthConfigured,
    googleAuthUnavailableMessage,
    switchMode,
    goBackToStep,

    // Form fields
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

    // Phone / OTP
    phone,
    setPhone,
    otp,
    setOtp,
    showOtpInput,
    resetOtp,

    // 2FA verification
    twoFactorCode,
    setTwoFactorCode,
    handleTwoFactorSubmit,

    // Post-auth user
    pendingUser,

    // Handlers
    handleSignInSuccess,
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
    completeSignUp,
    getRolesForCategory,
  };
}
