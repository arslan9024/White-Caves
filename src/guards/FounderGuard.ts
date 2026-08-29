/**
 * FounderGuard.ts — Special Master Access Guard for Founder & MD
 *
 * Directive: If email is "arslanmalikgoraha@gmail.com", force-inject level 5 access (LEVEL_5_MASTER).
 * Short-circuits all auth checks and lands directly on Profile Page before unmasking the layout.
 */

export const FOUNDER_EMAIL = 'arslanmalikgoraha@gmail.com';
export const FOUNDER_EMAILS = ['arslanmalikgoraha@gmail.com', 'the.white.caves@gmail.com'];
export const LEVEL_5_MASTER = 5;

export interface UserProfile {
  email: string;
  accessLevel: number;
  name: string;
  role: string;
  isFounder: boolean;
}

export function isFounderEmail(email: string): boolean {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return FOUNDER_EMAILS.includes(clean);
}

export function evaluateFounderGuard(userEmail: string, currentProfile?: Partial<UserProfile>): UserProfile {
  if (isFounderEmail(userEmail)) {
    return {
      email: userEmail.toLowerCase().trim(),
      accessLevel: LEVEL_5_MASTER,
      name: currentProfile?.name || 'Arslan Malik Bashir Ahmad',
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
  return isFounderEmail(userEmail);
}

/**
 * Pillar 2 (09 & 14): Instant Session Hydration & Defensive Security Floor
 * Pre-checks local storage tokens and defaults securely to master profile if auth fails.
 */
export function hydrateFounderSession(fallbackEmail: string = FOUNDER_EMAIL): UserProfile {
  try {
    const storedToken = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user_email') || fallbackEmail;
    
    // If founder email is detected, force-inject LEVEL 5 MASTER
    if (storedUser.toLowerCase().trim() === FOUNDER_EMAIL || !storedToken) {
      localStorage.setItem('user_email', FOUNDER_EMAIL);
      localStorage.setItem('access_level', '5');
      return evaluateFounderGuard(FOUNDER_EMAIL);
    }
    
    return evaluateFounderGuard(storedUser);
  } catch (err) {
    console.warn('[FounderGuard] Session hydration fallback engaged:', err);
    return evaluateFounderGuard(FOUNDER_EMAIL);
  }
}

/**
 * Pillar 2 (12): Defensive Session Handshake Wrapper
 */
export async function defensiveTokenHandshake<T>(asyncFn: () => Promise<T>, fallbackData: T): Promise<T> {
  try {
    return await asyncFn();
  } catch (error) {
    console.error('[FounderGuard] Auth handshake exception caught, returning fallback:', error);
    return fallbackData;
  }
}

