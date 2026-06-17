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
import { setUser } from '../store/userSlice';
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
  signInWithPhone,
  createRecaptchaVerifier,
  resetPassword,
  signOut as signOutFirebase,
  isFirebaseAuthConfigured,
} from '../config/firebase';
import { TIMING } from '../constants';
import {
  loginWithEmail as backendLogin,
  registerWithEmail as backendRegister,
  syncFirebaseUser,
  completeSocialRegistration,
  verifyTwoFactor as backendVerifyTwoFactor,
  type LoginSuccessData,
} from '../services/authService';
import { safeStorage } from '../utils/safeStorage';
import { isCreatorSuperUserEmail } from '../utils/superUserAccess';

// ─── Types ──────────────────────────────────────────────────────────

interface PendingUser {
  id: string;
  email: string;
  name: string;
  photo?: string;
  fromSocialProvider?: string;
}

interface ConfirmationResult {
  confirm: (otp: string) => Promise<{
    user: {
      uid: string;
      email: string | null;
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
const AUTH_ROUTE_BLOCKLIST = new Set(['/signin', '/signup', '/select-role', '/pending-approval']);
const CLIENT_ROLE_KEYS = new Set(['buyer', 'seller', 'landlord', 'property-owner', 'tenant']);
const LANDLORD_ROLE_KEYS = new Set(['landlord', 'property-owner']);

const normalizeRoleKey = (role: string | null | undefined): string =>
  (role || '').toLowerCase().trim();

const toTitleCase = (value: string): string =>
  value.length > 0 ? `${value[0].toUpperCase()}${value.slice(1)}` : value;

const resolveSafeReturnPath = (path: string | undefined): string | null => {
  if (!path || !path.startsWith('/')) {
    return null;
  }

  const normalizedPath = path.toLowerCase().trim();
  if (AUTH_ROUTE_BLOCKLIST.has(normalizedPath) || normalizedPath.startsWith('/auth')) {
    return null;
  }

  return path;
};

const resolveCategoryFromRole = (role: string | null | undefined): 'client' | 'staff' => {
  const normalizedRole = normalizeRoleKey(role);
  return CLIENT_ROLE_KEYS.has(normalizedRole) ? 'client' : 'staff';
};

const isProfileComplete = (user: {
  name?: string | null;
  displayName?: string | null;
  phone?: string | null;
}): boolean => Boolean((user.name || user.displayName || '').trim() && (user.phone || '').trim());

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
  const dispatch = useDispatch();

  // ── Step & mode state ─────────────────────────────────────────
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
  const [twoFactorEmail, setTwoFactorEmail] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // ── Post-auth pending user ─────────────────────────────────────
  const [pendingUser, setPendingUser] = useState<PendingUser | null>(null);
  const [socialSyncRecovery, setSocialSyncRecovery] = useState<SocialSyncRecovery | null>(null);
  const [socialRetryAttempts, setSocialRetryAttempts] = useState(0);

  // Ref for navigation timers
  const navTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const googleAuthUnavailableMessage =
    'Google sign-in is temporarily unavailable because Firebase authentication is not configured. Please complete Firebase web auth setup and try again.';

  useEffect(() => {
    return () => {
      clearTimeout(navTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (location.pathname === '/signup') {
      setMode('signup');
      setStep(1);
    }
  }, [location.pathname]);

  // ── Helpers ────────────────────────────────────────────────────

  const saveUserData = useCallback(
    (category: string, role: string, status: string = 'active'): void => {
      safeStorage.setJSON('userRole', { category, role, status, locked: true });
    },
    []
  );

  const resolvePostLoginRoute = useCallback(
    (user: { role?: string; status?: string; profileComplete?: boolean }): string => {
      const resolvedStatus = user.status?.toLowerCase().trim() || 'active';
      const normalizedRole = normalizeRoleKey(user.role);

      if (resolvedStatus === 'pending') {
        return '/pending-approval';
      }

      const stateValue = location.state as { from?: string } | null;
      const returnPath = resolveSafeReturnPath(stateValue?.from);
      if (returnPath) {
        return returnPath;
      }

      if (!normalizedRole) {
        return '/select-role';
      }

      if (normalizedRole === 'tenant') {
        return '/tenant-portal';
      }

      if (LANDLORD_ROLE_KEYS.has(normalizedRole)) {
        return '/landlord-portal';
      }

      if (normalizedRole === 'managing_director' || normalizedRole === 'lion' || normalizedRole === 'owner') {
        return '/crm';
      }

      if (user.profileComplete) {
        return '/crm';
      }

      // Profile-first post-login journey: CRM-eligible users visit /profile
      // when their account setup is still incomplete.
      return '/profile';
    },
    [location.state]
  );

  const handleSignInSuccess = useCallback(
    (user: {
      id: string;
      email: string | null;
      name: string | null;
      displayName?: string | null;
      role?: string;
      status?: string;
      phone?: string | null;
      photoUrl?: string | null;
      photoURL?: string | null;
    }): void => {
      const resolvedStatus = user.status?.toLowerCase().trim() || 'active';
      const normalizedRole = isCreatorSuperUserEmail(user.email)
        ? 'managing_director'
        : normalizeRoleKey(user.role);
      const profileComplete = isProfileComplete({
        name: user.name,
        displayName: user.displayName,
        phone: user.phone,
      });
      const fallbackRoute = resolvePostLoginRoute({
        role: normalizedRole,
        status: resolvedStatus,
        profileComplete,
      });
      const resolvedPhoto = user.photoUrl || user.photoURL || undefined;

      dispatch(
        setUser({
          id: user.id,
          email: user.email || '',
          name: user.name || user.displayName || undefined,
          displayName: user.displayName || user.name || undefined,
          role: normalizedRole || user.role,
          status: resolvedStatus === 'pending' ? 'pending' : 'active',
          phone: user.phone || undefined,
          photoURL: resolvedPhoto,
          profileComplete,
        })
      );

      if (normalizedRole) {
        saveUserData(resolveCategoryFromRole(normalizedRole), normalizedRole, resolvedStatus);
      }

      setSuccess('Sign in successful!');
      navTimerRef.current = setTimeout(() => navigate(fallbackRoute), TIMING.NAVIGATION_DELAY);
    },
    [dispatch, navigate, resolvePostLoginRoute, saveUserData]
  );

  const handleSignUpSuccess = useCallback(
    (
      user: {
        id: string;
        email: string | null;
        name: string | null;
        photoUrl?: string | null;
      },
      options?: { fromSocialProvider?: string }
    ): void => {
      setPendingUser({
        id: user.id,
        email: user.email || '',
        name: user.name || fullName,
        photo: user.photoUrl || undefined,
        fromSocialProvider: options?.fromSocialProvider,
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

    const status = selectedCategory === 'staff' ? 'pending' : 'active';
    const isSocialRegistration = Boolean(pendingUser?.fromSocialProvider);

    try {
      const response = isSocialRegistration
        ? await completeSocialRegistration(selectedCategory, selectedRole)
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
      const resolvedRole =
        selectedCategory === 'staff' && !isSocialRegistration ? selectedRole : backendUser.role;
      const normalizedRole = normalizeRoleKey(resolvedRole) || 'agent';
      dispatch(
        setUser({
          id: backendUser.id,
          email: backendUser.email,
          name: backendUser.name || undefined,
          role: normalizedRole,
          status,
        })
      );
      saveUserData(selectedCategory, normalizedRole, status);

      if (selectedCategory === 'staff') {
        setSuccess('Registration submitted! Your account is pending approval.');
        navTimerRef.current = setTimeout(
          () => navigate('/pending-approval'),
          TIMING.SIMULATED_API_DELAY
        );
      } else {
        setSuccess('Account created successfully!');
        const nextRoute = resolvePostLoginRoute({ role: normalizedRole, status });
        navTimerRef.current = setTimeout(() => navigate(nextRoute), TIMING.NAVIGATION_DELAY);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [
    selectedRole,
    selectedCategory,
    email,
    password,
    fullName,
    dispatch,
    navigate,
    saveUserData,
    pendingUser,
    resolvePostLoginRoute,
  ]);

  // ── Social auth ────────────────────────────────────────────────

  const handleSocialAuth = useCallback(
    async (provider: string, options?: { isRetry?: boolean }): Promise<void> => {
      if (provider === 'google' && !isFirebaseAuthConfigured) {
        setError(googleAuthUnavailableMessage);
        return;
      }
      if (
        provider === 'google' &&
        !options?.isRetry &&
        typeof window !== 'undefined' &&
        import.meta.env.MODE !== 'test'
      ) {
        const popupProbe = window.open('', '_blank', 'noopener,noreferrer,width=1,height=1');
        if (!popupProbe) {
          setSocialSyncRecovery({
            provider: 'google',
            reason: 'Popup blocked by browser settings',
          });
          setError(
            'Google sign-in popup was blocked by your browser. Allow popups for this site and press Try again.'
          );
          return;
        }
        popupProbe.close();
      }
      setLoading(true);
      setError('');
      if (!options?.isRetry) {
        setSocialSyncRecovery(null);
        setSocialRetryAttempts(0);
      }
      try {
        if (!isSupportedSocialProvider(provider)) {
          throw new Error('Invalid provider');
        }

        let result;
        switch (provider) {
          case 'google':
            result = await signInWithGoogle();
            break;
          case 'facebook':
            result = await signInWithFacebook();
            break;
          case 'apple':
            result = await signInWithApple();
            break;
          default:
            throw new Error('Invalid provider');
        }

        try {
          const backendResponse = await syncFirebaseUser(result.user);
          if (!backendResponse?.data?.user) {
            throw new Error('Invalid backend response: missing user data');
          }
          const backendUser = backendResponse.data.user;
          setSocialSyncRecovery(null);
          setSocialRetryAttempts(0);
          setError('');

          if (mode === 'signup') {
            if (isCreatorSuperUserEmail(backendUser.email)) {
              handleSignInSuccess({
                ...backendUser,
                role: 'managing_director',
                status: 'active',
                photoURL: backendUser.photoUrl || result.user.photoURL,
                displayName: backendUser.name || result.user.displayName,
              });
            } else {
              handleSignUpSuccess(
                {
                  ...backendUser,
                  photoUrl: backendUser.photoUrl || result.user.photoURL,
                },
                { fromSocialProvider: provider }
              );
            }
          } else {
            handleSignInSuccess(
              isCreatorSuperUserEmail(backendUser.email)
                ? {
                    ...backendUser,
                    role: 'managing_director',
                    status: 'active',
                    photoURL: backendUser.photoUrl || result.user.photoURL,
                    displayName: backendUser.name || result.user.displayName,
                  }
                : {
                    ...backendUser,
                    photoURL: backendUser.photoUrl || result.user.photoURL,
                    displayName: backendUser.name || result.user.displayName,
                  }
            );
          }
        } catch (syncError: unknown) {
          await signOutFirebase().catch(() => {
            // noop: firebase session cleanup is best effort here
          });
          const syncMessage = (() => {
            if (syncError instanceof Error && syncError.message.trim()) {
              return syncError.message.trim();
            }
            if (
              typeof syncError === 'object' &&
              syncError !== null &&
              'message' in syncError &&
              typeof (syncError as { message?: unknown }).message === 'string'
            ) {
              const rawMessage = (syncError as { message: string }).message.trim();
              if (rawMessage) {
                return rawMessage;
              }
            }
            return 'Unable to complete authentication sync';
          })();
          if (provider === 'google' || provider === 'facebook' || provider === 'apple') {
            setSocialSyncRecovery({ provider, reason: syncMessage });
            if (options?.isRetry) {
              setSocialRetryAttempts(prev => prev + 1);
            }
          }
          setError(
            `Authentication succeeded with ${provider}, but backend session setup failed: ${syncMessage}. Please try again.`
          );
          setSuccess('');
        }
      } catch (err: unknown) {
        setError(normalizeSocialAuthErrorMessage(err, provider));
      } finally {
        setLoading(false);
      }
    },
    [mode, handleSignInSuccess, handleSignUpSuccess, googleAuthUnavailableMessage]
  );

  const retrySocialAuth = useCallback(async (): Promise<void> => {
    if (!socialSyncRecovery) {
      return;
    }

    if (socialRetryAttempts >= MAX_SOCIAL_RETRY_ATTEMPTS) {
      setError('Retry limit reached. Please switch to email login or try again later.');
      return;
    }

    await handleSocialAuth(socialSyncRecovery.provider, { isRetry: true });
  }, [handleSocialAuth, socialSyncRecovery, socialRetryAttempts]);

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
          if (isCreatorSuperUserEmail(normalizedEmail)) {
            const response = await backendRegister(
              normalizedEmail,
              password,
              fullName || undefined,
              undefined,
              undefined,
              'staff',
              'managing_director'
            );
            if (!response?.data?.user) {
              throw new Error('Invalid response: missing user data');
            }
            handleSignInSuccess({
              ...response.data.user,
              role: 'managing_director',
              status: 'active',
            });
            return;
          }

          handleSignUpSuccess({
            id: 'pending-signup',
            email: normalizedEmail,
            name: fullName || normalizedEmail,
          });
        } else {
          const response = await backendLogin(normalizedEmail, password);
          if (response.requiresTwoFactor) {
            // Advance to the 2FA code-entry step.
            // The email is stored so handleTwoFactorSubmit can send it to the server.
            setTwoFactorEmail(normalizedEmail);
            setTwoFactorCode('');
            setStep(4);
          } else {
            const data = response.data as LoginSuccessData;
            if (!data?.user) throw new Error('Invalid response: missing user data');
            handleSignInSuccess(data.user);
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
        const user = await backendVerifyTwoFactor(twoFactorEmail, twoFactorCode);
        handleSignInSuccess(user);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Verification failed');
      } finally {
        setLoading(false);
      }
    },
    [twoFactorEmail, twoFactorCode, handleSignInSuccess]
  );

  // ── Phone auth ─────────────────────────────────────────────────

  const handlePhoneSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
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
    [phone]
  );

  const handleOtpVerify = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      setLoading(true);
      setError('');

      try {
        const result = await confirmationResult?.confirm(otp);
        if (!result?.user) {
          throw new Error('OTP verification failed');
        }

        try {
          const backendResponse = await syncFirebaseUser(result.user);
          const backendUser = backendResponse.data.user;
          if (mode === 'signup') {
            handleSignUpSuccess(backendUser);
          } else {
            handleSignInSuccess(backendUser);
          }
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
    [confirmationResult, otp, mode, handleSignInSuccess, handleSignUpSuccess]
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
      await resetPassword(normalizedEmail);
      setSuccess(
        'Password reset email sent. Please check your inbox (and spam folder) for the reset link.'
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(message);
    } finally {
      setForgotPasswordLoading(false);
    }
  }, [email]);

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
  }, []);

  const getRolesForCategory = useCallback((): UserRole[] => {
    return selectedCategory === 'staff' ? STAFF_ROLES : CLIENT_ROLES;
  }, [selectedCategory]);

  const goBackToStep = useCallback((targetStep: number): void => {
    setStep(targetStep);
    if (targetStep === 1) {
      setSelectedCategory('');
      setTwoFactorEmail('');
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
    error,
    setError,
    success,
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
    handlePhoneSubmit,
    handleOtpVerify,
    proceedToRoleSelection,
    completeSignUp,
    getRolesForCategory,
  };
}
