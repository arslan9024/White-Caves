import { useCallback } from 'react';
import {
  requestPasswordReset,
  verifyPasswordResetToken,
  resetPasswordWithToken,
} from '../../services/authService';
import { useSignInState } from './useSignIn.state';
export function useSignInPasswordReset(state: ReturnType<typeof useSignInState>) {
  const {
    navigate,
    setForgotPasswordLoading,
    setVerifyResetLoading,
    setCompleteResetLoading,
    setError,
    success,
    setSuccess,
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
    password,
    hasResetTokenInUrl,
  } = state;
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
  return { handleForgotPassword, handleVerifyResetToken, handleCompletePasswordReset };
}
