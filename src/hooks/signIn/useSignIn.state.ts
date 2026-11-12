import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { firebaseMissingReason as firebaseAuthUnavailableReason } from '../../auth/firebaseInit';
import { PendingUser } from './useSignIn.config';
import { ConfirmationResult } from './useSignIn.config';
import { SocialSyncRecovery } from './useSignIn.config';
export function useSignInState() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [twoFactorEmail, setTwoFactorEmail] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [pendingUser, setPendingUser] = useState<PendingUser | null>(null);
  const [socialSyncRecovery, setSocialSyncRecovery] = useState<SocialSyncRecovery | null>(null);
  const [socialRetryAttempts, setSocialRetryAttempts] = useState(0);
  const navTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const googleAuthUnavailableMessage =
    'Google sign-in is temporarily unavailable because Firebase authentication is not configured in this environment.' +
    (firebaseAuthUnavailableReason ? ` ${firebaseAuthUnavailableReason}` : '');
  const hasResetTokenInUrl = useRef(false);
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
  return {
    navigate,
    location,
    dispatch,
    mode,
    setMode,
    step,
    setStep,
    activeTab,
    setActiveTab,
    loading,
    setLoading,
    forgotPasswordLoading,
    setForgotPasswordLoading,
    verifyResetLoading,
    setVerifyResetLoading,
    completeResetLoading,
    setCompleteResetLoading,
    error,
    setError,
    success,
    setSuccess,
    resetStage,
    setResetStage,
    resetToken,
    setResetToken,
    resetSessionToken,
    setResetSessionToken,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
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
    setShowOtpInput,
    confirmationResult,
    setConfirmationResult,
    twoFactorEmail,
    setTwoFactorEmail,
    twoFactorCode,
    setTwoFactorCode,
    pendingUser,
    setPendingUser,
    socialSyncRecovery,
    setSocialSyncRecovery,
    socialRetryAttempts,
    setSocialRetryAttempts,
    navTimerRef,
    googleAuthUnavailableMessage,
    hasResetTokenInUrl,
  };
}
