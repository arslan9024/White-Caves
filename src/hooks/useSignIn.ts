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
  signOut as signOutFirebase,
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

const MAX_SOCIAL_RETRY_ATTEMPTS = 3;

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

  const handleSignInSuccess = useCallback(
    (user: {
      id: string;
      email: string | null;
      name: string | null;
      role?: string;
      photoUrl?: string | null;
    }): void => {
      dispatch(
        setUser({
          id: user.id,
          email: user.email || '',
          name: user.name || undefined,
          role: user.role,
          photoURL: user.photoUrl || undefined,
        })
      );
      setSuccess('Sign in successful!');
      // Return the user to where they came from (e.g. a protected page they tried to visit
      // before signing in), falling back to the main dashboard.
      const from = (location.state as { from?: string } | null)?.from;
      const destination =
        from && from !== '/signin' && from !== '/signup' ? from : '/dashboard';
      navTimerRef.current = setTimeout(() => navigate(destination), TIMING.NAVIGATION_DELAY);
    },
    [dispatch, navigate, location.state]
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
      dispatch(
        setUser({
          id: backendUser.id,
          email: backendUser.email,
          name: backendUser.name || undefined,
          role: resolvedRole,
          status,
        })
      );
      saveUserData(selectedCategory, resolvedRole, status);

      if (selectedCategory === 'staff') {
        setSuccess('Registration submitted! Your account is pending approval.');
        navTimerRef.current = setTimeout(
          () => navigate('/pending-approval'),
          TIMING.SIMULATED_API_DELAY
        );
      } else {
        setSuccess('Account created successfully!');
        navTimerRef.current = setTimeout(() => navigate('/dashboard'), TIMING.NAVIGATION_DELAY);
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
  ]);

  // ── Social auth ────────────────────────────────────────────────

  const handleSocialAuth = useCallback(
    async (provider: string, options?: { isRetry?: boolean }): Promise<void> => {
      setLoading(true);
      setError('');
      if (!options?.isRetry) {
        setSocialSyncRecovery(null);
        setSocialRetryAttempts(0);
      }
      try {
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
            handleSignUpSuccess(backendUser, { fromSocialProvider: provider });
          } else {
            handleSignInSuccess(backendUser);
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
        setError(err instanceof Error ? err.message : 'Authentication failed');
      } finally {
        setLoading(false);
      }
    },
    [mode, handleSignInSuccess, handleSignUpSuccess]
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
    error,
    setError,
    success,
    socialSyncRecovery,
    socialRetryAttempts,
    remainingSocialRetries,
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
    handlePhoneSubmit,
    handleOtpVerify,
    proceedToRoleSelection,
    completeSignUp,
    getRolesForCategory,
  };
}
