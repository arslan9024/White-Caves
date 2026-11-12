import { useCallback } from 'react';
import { setUser } from '../../store/userSlice';
import { TIMING } from '../../constants';
import { safeStorage } from '../../utils/safeStorage';
import { getPostLoginRoute } from '../../utils/routing';
import { normalizeRoleKey } from './useSignIn.rules';
import { resolveSafeReturnPath } from './useSignIn.rules';
import { resolveCategoryFromRole } from './useSignIn.rules';
import { isSuperuserEmail } from './useSignIn.rules';
import { deriveProfileCompletionSignal } from './useSignIn.rules';
import { useSignInState } from './useSignIn.state';
export function useSignInSession(state: ReturnType<typeof useSignInState>) {
  const {
    navigate,
    location,
    dispatch,
    setStep,
    setSuccess,
    email,
    fullName,
    phone,
    setPendingUser,
    navTimerRef,
  } = state;
  const saveUserData = useCallback(
    (category: string, role: string, status: string = 'active'): void => {
      safeStorage.setJSON('userRole', { category, role, status, locked: true });
    },
    []
  );
  const resolvePostLoginRoute = useCallback(
    (user: {
      role?: string;
      status?: string;
      email?: string | null;
      profileCompleted?: boolean;
    }): string => {
      const stateValue = location.state as { from?: string } | null;
      const returnPath = resolveSafeReturnPath(stateValue?.from);
      if (returnPath) {
        return returnPath;
      }

      return getPostLoginRoute(user.role, user.email, {
        status: user.status,
        profileCompleted: user.profileCompleted,
      });
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
      profileCompleted?: boolean;
      profileComplete?: boolean;
    }): void => {
      const resolvedStatus = user.status?.toLowerCase().trim() || 'active';
      const normalizedRole = isSuperuserEmail(user.email)
        ? 'managing_director'
        : normalizeRoleKey(user.role);
      const profileCompleted = deriveProfileCompletionSignal(user);
      const fallbackRoute = resolvePostLoginRoute({
        role: normalizedRole,
        status: resolvedStatus,
        email: user.email,
        profileCompleted,
      });

      dispatch(
        setUser({
          id: user.id,
          email: user.email || '',
          name: user.name || user.displayName || undefined,
          displayName: user.displayName || user.name || undefined,
          role: normalizedRole || user.role,
          status: resolvedStatus === 'pending' ? 'pending' : 'active',
          photoURL: user.photoUrl || undefined,
          phone: user.phone || undefined,
          profileCompleted,
        })
      );

      const isFounderUser = isSuperuserEmail(user.email);
      const effectiveRole = isFounderUser
        ? 'managing_director'
        : normalizedRole || user.role || 'guest';
      const effectiveAccessLevel = isFounderUser
        ? 5
        : effectiveRole === 'landlord' || effectiveRole === 'agent'
          ? 2
          : 1;
      const isConfirmed = isFounderUser ? true : effectiveRole !== 'guest' && Boolean(user.role);

      const whitecavesUser = {
        id: user.id,
        name:
          user.name ||
          user.displayName ||
          (isFounderUser ? 'Arslan Malik Bashir Ahmad' : 'White Caves User'),
        email: user.email || '',
        photoURL: user.photoUrl || undefined,
        phone: user.phone || undefined,
        role: effectiveRole,
        accessLevel: effectiveAccessLevel,
        assignedDepartment: isFounderUser
          ? 'Executive Directorate'
          : effectiveRole === 'landlord'
            ? 'Asset Owner Portal'
            : 'Public Portal',
        isManagingDirector:
          isFounderUser || effectiveRole === 'managing_director' || effectiveRole === 'admin',
        isFounder: isFounderUser,
        isRoleConfirmed: isConfirmed,
        permissions: isFounderUser ? ['*'] : ['can_view_properties'],
      };

      safeStorage.setJSON('whitecaves_user', whitecavesUser);
      safeStorage.set('whitecaves_role', effectiveRole);
      safeStorage.set('whitecaves_access_level', String(effectiveAccessLevel));
      try {
        localStorage.setItem('white-caves-user', JSON.stringify(whitecavesUser));
        localStorage.setItem('whitecaves_user', JSON.stringify(whitecavesUser));
      } catch {
        // ignore
      }

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
  return { saveUserData, resolvePostLoginRoute, handleSignInSuccess, handleSignUpSuccess };
}
