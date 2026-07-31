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

export function evaluateFounderGuard(userEmail: string, currentProfile?: Partial<UserProfile>): UserProfile {
  if (userEmail.toLowerCase().trim() === FOUNDER_EMAIL) {
    return {
      email: FOUNDER_EMAIL,
      accessLevel: LEVEL_5_MASTER,
      name: currentProfile?.name || 'Arslan Malik Goraha',
      role: 'Managing Director & Founder',
      isFounder: true,
    };
  }

  return {
    email: userEmail,
    accessLevel: currentProfile?.accessLevel || 1,
    name: currentProfile?.name || 'Standard User',
    role: currentProfile?.role || 'Agent',
    isFounder: false,
  };
}

export function shouldShortCircuitToProfile(userEmail: string): boolean {
  return userEmail.toLowerCase().trim() === FOUNDER_EMAIL;
}
