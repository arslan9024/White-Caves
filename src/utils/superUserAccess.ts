export const CREATOR_SUPERUSER_EMAIL = 'arslanmalikgoraha@gmail.com';
export const CANONICAL_SUPERUSER_ROLE = 'lion';

const SUPERUSER_ROLE_ALIASES = new Set(['lion', 'owner', 'super_admin', 'managing_director', 'md']);

export function normalizeRoleToken(role?: string | null): string | null {
  if (!role) return null;
  return role.trim().toLowerCase();
}

export function isCreatorSuperUserEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === CREATOR_SUPERUSER_EMAIL;
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
