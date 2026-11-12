import { useCallback } from 'react';
import { setUser } from '../../store/userSlice';
import { TIMING } from '../../constants';
import {
  registerWithEmail as backendRegister,
  completeSocialRegistration,
} from '../../services/authService';
import { getPostLoginRoute } from '../../utils/routing';
import { normalizeRoleKey } from './useSignIn.rules';
import { useSignInState } from './useSignIn.state';
import { useSignInSession } from './useSignIn.session';
export function useSignInRegistration(
  state: ReturnType<typeof useSignInState>,
  session: ReturnType<typeof useSignInSession>
) {
  const {
    navigate,
    dispatch,
    setStep,
    setLoading,
    setError,
    setSuccess,
    email,
    password,
    fullName,
    selectedCategory,
    selectedRole,
    pendingUser,
    navTimerRef,
  } = state;
  const { saveUserData, resolvePostLoginRoute } = session;
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
        navTimerRef.current = setTimeout(
          () => navigate(getPostLoginRoute(resolvedRole, backendUser.email)),
          TIMING.NAVIGATION_DELAY
        );
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
  return { proceedToRoleSelection, completeSignUp };
}
