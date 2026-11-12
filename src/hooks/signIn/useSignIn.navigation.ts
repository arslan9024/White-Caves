import { useCallback } from 'react';
import { UserRole } from './useSignIn.config';
import { CLIENT_ROLES } from './useSignIn.data';
import { STAFF_ROLES } from './useSignIn.data';
import { useSignInState } from './useSignIn.state';
export function useSignInNavigation(state: ReturnType<typeof useSignInState>) {
  const {
    setMode,
    setStep,
    setError,
    setSuccess,
    selectedCategory,
    setSelectedCategory,
    setSelectedRole,
    setOtp,
    setShowOtpInput,
    setTwoFactorEmail,
    setTwoFactorCode,
    setSocialSyncRecovery,
    setSocialRetryAttempts,
  } = state;
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
  return { switchMode, getRolesForCategory, goBackToStep, resetOtp };
}
