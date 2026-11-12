import { SupportedSocialProvider } from './useSignIn.config';
import { SocialAuthErrorLike } from './useSignIn.config';
export const MAX_SOCIAL_RETRY_ATTEMPTS = 3;
export const SUPERUSER_EMAIL = (import.meta.env.VITE_CREATOR_SUPERUSER_EMAIL ?? '')
  .toLowerCase()
  .trim();
export const AUTH_ROUTE_BLOCKLIST = new Set([
  '/signin',
  '/signup',
  '/select-role',
  '/pending-approval',
]);
export const CLIENT_ROLE_KEYS = new Set([
  'buyer',
  'seller',
  'landlord',
  'property-owner',
  'tenant',
]);
export const LANDLORD_ROLE_KEYS = new Set(['landlord', 'property-owner']);
export const normalizeRoleKey = (role: string | null | undefined): string =>
  (role || '').toLowerCase().trim();
export const toTitleCase = (value: string): string =>
  value.length > 0 ? `${value[0].toUpperCase()}${value.slice(1)}` : value;
export const resolveSafeReturnPath = (path: string | undefined): string | null => {
  if (!path || !path.startsWith('/')) {
    return null;
  }

  const normalizedPath = path.toLowerCase().trim();
  if (AUTH_ROUTE_BLOCKLIST.has(normalizedPath) || normalizedPath.startsWith('/auth')) {
    return null;
  }

  return path;
};
export const resolveCategoryFromRole = (role: string | null | undefined): 'client' | 'staff' => {
  const normalizedRole = normalizeRoleKey(role);
  return CLIENT_ROLE_KEYS.has(normalizedRole) ? 'client' : 'staff';
};
export const isSuperuserEmail = (value: string | null | undefined): boolean =>
  // Read env var lazily at call time so vi.stubEnv works correctly in tests
  (() => {
    const configured = (import.meta.env.VITE_CREATOR_SUPERUSER_EMAIL ?? '').toLowerCase().trim();
    if (!configured) return false;
    return (value || '').toLowerCase().trim() === configured;
  })();
export const normalizeSocialAuthErrorMessage = (error: unknown, provider: string): string => {
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
    case 'auth/unauthorized-domain':
      return `${toTitleCase(provider)} sign-in is blocked for this domain. Please contact support to authorize this domain in Firebase.`;
    case 'auth/operation-not-allowed':
      return `${toTitleCase(provider)} sign-in is not enabled for this environment yet. Please use email sign-in or contact support.`;
    case 'auth/account-exists-with-different-credential':
      return 'This email is already registered with a different sign-in method. Try email sign-in to continue.';
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
export const isSupportedSocialProvider = (provider: string): provider is SupportedSocialProvider =>
  provider === 'google' || provider === 'facebook' || provider === 'apple';
export const shouldClearFirebaseSessionAfterSyncFailure = (message: string): boolean =>
  /uid mismatch|email mismatch|token verification failed|invalid firebase token|verified firebase email is required|authentication token is missing|firebase token is required/i.test(
    message.toLowerCase()
  );
export const deriveProfileCompletionSignal = (user: {
  name?: string | null;
  phone?: string | null;
  profileCompleted?: boolean;
  profileComplete?: boolean;
  profileCompletion?: {
    profileCompleted?: boolean;
  };
}): boolean | undefined => {
  if (typeof user.profileCompleted === 'boolean') {
    return user.profileCompleted;
  }

  if (typeof user.profileComplete === 'boolean') {
    return user.profileComplete;
  }

  if (typeof user.profileCompletion?.profileCompleted === 'boolean') {
    return user.profileCompletion.profileCompleted;
  }

  const hasPhoneField = Object.prototype.hasOwnProperty.call(user, 'phone');
  if (!hasPhoneField) {
    return undefined;
  }

  const hasName = typeof user.name === 'string' && user.name.trim().length > 0;
  const hasPhone = typeof user.phone === 'string' && user.phone.trim().length > 0;
  return hasName && hasPhone;
};
