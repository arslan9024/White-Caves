/**
 * MD sovereign identity helpers for CRM hub landing & suite gating.
 * Keep email list aligned with UserRoleContext SOVEREIGN_FOUNDER_EMAILS.
 */

export const MD_SOVEREIGN_EMAILS = [
  'arslanmalikgoraha@gmail.com',
  'the.white.caves@gmail.com',
  'arslan@whitecaves.com',
] as const;

export function isMdSovereignEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return MD_SOVEREIGN_EMAILS.some(e => e === normalized);
}

export function resolveIsManagingDirector(user?: {
  email?: string | null;
  role?: string | null;
} | null): boolean {
  if (!user) return false;
  if (isMdSovereignEmail(user.email)) return true;
  const role = (user.role || '').toString().toLowerCase();
  return (
    role === 'managing_director' ||
    role === 'admin' ||
    role === 'owner' ||
    role === 'md'
  );
}
