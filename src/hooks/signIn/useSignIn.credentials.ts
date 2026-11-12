import { useCallback, type FormEvent } from 'react';
import {
  signInWithPhone,
  createRecaptchaVerifier,
  signOut as signOutFirebase,
} from '../../config/firebase';
import {
  loginWithEmail as backendLogin,
  registerWithEmail as backendRegister,
  syncFirebaseUser,
  verifyTwoFactor as backendVerifyTwoFactor,
  type LoginSuccessData,
} from '../../services/authService';
import { isSuperuserEmail } from './useSignIn.rules';
import { useSignInState } from './useSignIn.state';
import { useSignInSession } from './useSignIn.session';
export function useSignInCredentials(
  state: ReturnType<typeof useSignInState>,
  session: ReturnType<typeof useSignInSession>
) {
  const {
    mode,
    step,
    setStep,
    setLoading,
    setError,
    setSuccess,
    email,
    password,
    confirmPassword,
    fullName,
    phone,
    otp,
    setShowOtpInput,
    confirmationResult,
    setConfirmationResult,
    twoFactorEmail,
    setTwoFactorEmail,
    twoFactorCode,
    setTwoFactorCode,
  } = state;
  const { handleSignInSuccess, handleSignUpSuccess } = session;
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
          if (isSuperuserEmail(normalizedEmail)) {
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
  return { handleEmailSubmit, handleTwoFactorSubmit, handlePhoneSubmit, handleOtpVerify };
}
