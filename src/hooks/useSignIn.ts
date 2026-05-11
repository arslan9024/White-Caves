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
} from '../config/firebase';
import { TIMING } from '../constants';
import {
  loginWithEmail as backendLogin,
  registerWithEmail as backendRegister,
  syncFirebaseUser,
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

  // ── Post-auth pending user ─────────────────────────────────────
  const [pendingUser, setPendingUser] = useState<PendingUser | null>(null);

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
      const destination =
        user.role === 'landlord'
          ? '/landlord-portal'
          : user.role === 'tenant'
            ? '/tenant-portal'
            : '/dashboard';
      navTimerRef.current = setTimeout(() => navigate(destination), TIMING.NAVIGATION_DELAY);
    },
    [dispatch, navigate]
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

    try {
      const response = await backendRegister(
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
      dispatch(
        setUser({
          id: backendUser.id,
          email: backendUser.email,
          name: backendUser.name || undefined,
          role: selectedCategory === 'staff' ? selectedRole : backendUser.role,
          status,
        })
      );
      saveUserData(selectedCategory, selectedRole, status);

      if (selectedCategory === 'staff') {
        setSuccess('Registration submitted! Your account is pending approval.');
        navTimerRef.current = setTimeout(
          () => navigate('/pending-approval'),
          TIMING.SIMULATED_API_DELAY
        );
      } else {
        setSuccess('Account created successfully!');
        navTimerRef.current = setTimeout(
          () => navigate(`/${selectedRole}/dashboard`),
          TIMING.NAVIGATION_DELAY
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [selectedRole, selectedCategory, email, password, fullName, dispatch, navigate, saveUserData]);

  // ── Social auth ────────────────────────────────────────────────

  const handleSocialAuth = useCallback(
    async (provider: string): Promise<void> => {
      setLoading(true);
      setError('');
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

          if (mode === 'signup') {
            handleSignUpSuccess(backendUser, { fromSocialProvider: provider });
          } else {
            handleSignInSuccess(backendUser);
          }
        } catch (syncError: unknown) {
          if (mode === 'signin') {
            throw syncError;
          }
          const firebaseUser = result.user;
          const fallbackUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
          };
          if (mode === 'signup') {
            handleSignUpSuccess(fallbackUser, { fromSocialProvider: provider });
          } else {
            handleSignInSuccess(fallbackUser);
          }
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
      } finally {
        setLoading(false);
      }
    },
    [mode, handleSignInSuccess, handleSignUpSuccess]
  );

  // ── Email auth ─────────────────────────────────────────────────

  const handleEmailSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();
      setLoading(true);
      setError('');

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
            email,
            name: fullName || email,
          });
        } else {
          const response = await backendLogin(email, password);
          if (!response?.data?.user) throw new Error('Invalid response: missing user data');
          handleSignInSuccess(response.data.user);
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
        } catch {
          const firebaseUser = result.user;
          const fallbackUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
          };
          if (mode === 'signup') {
            handleSignUpSuccess(fallbackUser);
          } else {
            handleSignInSuccess(fallbackUser);
          }
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
  }, []);

  const getRolesForCategory = useCallback((): UserRole[] => {
    return selectedCategory === 'staff' ? STAFF_ROLES : CLIENT_ROLES;
  }, [selectedCategory]);

  const goBackToStep = useCallback((targetStep: number): void => {
    setStep(targetStep);
    if (targetStep === 1) setSelectedCategory('');
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

    // Post-auth user
    pendingUser,

    // Handlers
    handleSignInSuccess,
    handleSocialAuth,
    handleEmailSubmit,
    handlePhoneSubmit,
    handleOtpVerify,
    proceedToRoleSelection,
    completeSignUp,
    getRolesForCategory,
  };
}
