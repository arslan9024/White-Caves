import { describe, expect, it } from 'vitest';
import {
  CANONICAL_SUPERUSER_ROLE,
  CREATOR_SUPERUSER_EMAIL,
  isCreatorSuperUserEmail,
  isSuperUserAliasRole,
  normalizeRoleForUserContext,
  normalizeRoleToken,
} from './superUserAccess';

describe('superUserAccess', () => {
  describe('normalizeRoleToken', () => {
    it('returns null for empty-like values', () => {
      expect(normalizeRoleToken(undefined)).toBeNull();
      expect(normalizeRoleToken(null)).toBeNull();
      expect(normalizeRoleToken('')).toBeNull();
    });

    it('trims and lowercases role values', () => {
      expect(normalizeRoleToken('  Managing_Director  ')).toBe('managing_director');
    });
  });

  describe('isCreatorSuperUserEmail', () => {
    it('matches creator email case-insensitively with whitespace trimming', () => {
      expect(isCreatorSuperUserEmail(`  ${CREATOR_SUPERUSER_EMAIL.toUpperCase()}  `)).toBe(true);
    });

    it('returns false for non-creator email', () => {
      expect(isCreatorSuperUserEmail('other@example.com')).toBe(false);
    });
  });

  describe('isSuperUserAliasRole', () => {
    it('recognizes all configured aliases', () => {
      expect(isSuperUserAliasRole('lion')).toBe(true);
      expect(isSuperUserAliasRole('owner')).toBe(true);
      expect(isSuperUserAliasRole('super_admin')).toBe(true);
      expect(isSuperUserAliasRole('managing_director')).toBe(true);
      expect(isSuperUserAliasRole('md')).toBe(true);
    });

    it('returns false for unknown role aliases', () => {
      expect(isSuperUserAliasRole('admin')).toBe(false);
      expect(isSuperUserAliasRole(undefined)).toBe(false);
    });
  });

  describe('normalizeRoleForUserContext', () => {
    it('returns null when role is empty', () => {
      expect(normalizeRoleForUserContext(undefined, CREATOR_SUPERUSER_EMAIL)).toBeNull();
    });

    it('canonicalizes creator alias roles to lion', () => {
      expect(normalizeRoleForUserContext('owner', CREATOR_SUPERUSER_EMAIL)).toBe(CANONICAL_SUPERUSER_ROLE);
      expect(normalizeRoleForUserContext(' MD ', CREATOR_SUPERUSER_EMAIL)).toBe(CANONICAL_SUPERUSER_ROLE);
    });

    it('maps md to managing_director for non-creator users', () => {
      expect(normalizeRoleForUserContext('md', 'agent@example.com')).toBe('managing_director');
    });

    it('keeps non-creator super alias role as-is', () => {
      expect(normalizeRoleForUserContext('owner', 'agent@example.com')).toBe('owner');
    });

    it('keeps regular roles normalized', () => {
      expect(normalizeRoleForUserContext('  Tenant ', 'tenant@example.com')).toBe('tenant');
    });
  });
});
