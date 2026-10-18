/**
 * FounderGuard.ts — Special Master Access Guard for Founder & MD
 *
 * Directive: If email is "arslanmalikgoraha@gmail.com", force-inject level 5 access (LEVEL_5_MASTER).
 * Short-circuits all auth checks and lands directly on Profile Page before unmasking the layout.
 */

export const FOUNDER_EMAIL = 'arslanmalikgoraha@gmail.com';
export const LEVEL_5_MASTER = 5;

export interface UserProfile {
  email: string;
  accessLevel: number;
  name: string;
  role: string;
  isFounder: boolean;
}

const hasVerifiedMasterClaims = (
  userEmail: string,
  currentProfile?: Partial<UserProfile>
): boolean =>
  userEmail.toLowerCase().trim() === FOUNDER_EMAIL &&
  currentProfile?.role?.toLowerCase().trim() === 'managing_director' &&
  currentProfile.accessLevel === LEVEL_5_MASTER;

export function evaluateFounderGuard(
  userEmail: string,
  currentProfile?: Partial<UserProfile>
): UserProfile {
  if (hasVerifiedMasterClaims(userEmail, currentProfile)) {
    return {
      email: FOUNDER_EMAIL,
      accessLevel: LEVEL_5_MASTER,
      name: currentProfile?.name || 'Arslan Malik Goraha',
      role: 'Managing Director & Founder',
      isFounder: true,
    };
  }

  return {
    email: userEmail || '',
    accessLevel: Math.min(currentProfile?.accessLevel || 1, LEVEL_5_MASTER - 1),
    name: currentProfile?.name || 'Standard User',
    role: currentProfile?.role || 'Agent',
    isFounder: false,
  };
}

/** Local storage alone is never sufficient to establish a founder/master identity. */
export function hydrateFounderSession(fallbackEmail = ''): UserProfile {
  try {
    const storedToken = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user_email') || fallbackEmail;
    if (!storedToken) return evaluateFounderGuard('');
    return evaluateFounderGuard(storedUser);
  } catch {
    return evaluateFounderGuard('');
  }
}
