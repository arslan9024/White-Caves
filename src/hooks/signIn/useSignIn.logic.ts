import { isFirebaseAuthConfigured } from '../../auth/firebaseInit';
import { useSignInState } from './useSignIn.state';
import { useSignInSession } from './useSignIn.session';
import { useSignInRegistration } from './useSignIn.registration';
import { useSignInSocial } from './useSignIn.social';
import { useSignInCredentials } from './useSignIn.credentials';
import { useSignInPasswordReset } from './useSignIn.reset';
import { useSignInNavigation } from './useSignIn.navigation';
export function useSignIn() {
  const state = useSignInState();
  const {
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
  } = state;
  const session = useSignInSession(state);
  const { saveUserData, resolvePostLoginRoute, handleSignInSuccess, handleSignUpSuccess } = session;
  const { proceedToRoleSelection, completeSignUp } = useSignInRegistration(state, session);
  const { handleSocialAuth, retrySocialAuth, clearSocialRecovery, remainingSocialRetries } =
    useSignInSocial(state, session);
  const { handleEmailSubmit, handleTwoFactorSubmit, handlePhoneSubmit, handleOtpVerify } =
    useSignInCredentials(state, session);
  const { handleForgotPassword, handleVerifyResetToken, handleCompletePasswordReset } =
    useSignInPasswordReset(state);
  const { switchMode, getRolesForCategory, goBackToStep, resetOtp } = useSignInNavigation(state);
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
