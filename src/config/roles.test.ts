import { describe, it, expect } from 'vitest';
import REAL_ESTATE_ROLES, {
  REAL_ESTATE_ROLES as NamedRoles,
  ROLE_KEY_MAP,
  normalizeRoleKey,
  getRoleById,
  getRolesByCategory,
  type RoleDefinition,
} from './roles';

// ═══════════════════════════════════════════════════════════════════════
describe('roles config', () => {
  // ── REAL_ESTATE_ROLES array ───────────────────────────────────────
  describe('REAL_ESTATE_ROLES', () => {
    it('exports as default and named export', () => {
      expect(REAL_ESTATE_ROLES).toBe(NamedRoles);
    });

    it('contains 24 role definitions', () => {
      expect(REAL_ESTATE_ROLES).toHaveLength(24);
    });

    it('every role has required fields', () => {
      for (const role of REAL_ESTATE_ROLES) {
        expect(role.id).toBeTruthy();
        expect(role.name).toBeTruthy();
        expect(role.icon).toBeDefined();
        expect(role.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
        expect(role.description).toBeTruthy();
        expect(Array.isArray(role.permissions)).toBe(true);
        expect(role.permissions.length).toBeGreaterThan(0);
        expect(role.dashboardPath).toMatch(/^\//);
        expect([
          'executive',
          'admin',
          'management',
          'agent',
          'specialist',
          'support',
          'client',
        ]).toContain(role.category);
      }
    });

    it('all role IDs are unique', () => {
      const ids = REAL_ESTATE_ROLES.map(r => r.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('managing_director has wildcard permissions', () => {
      const md = REAL_ESTATE_ROLES.find(r => r.id === 'managing_director');
      expect(md).toBeDefined();
      expect(md!.permissions).toContain('*');
    });

    it.each([
      ['executive', ['managing_director', 'real_estate_company', 'property_mgmt_company']],
      ['admin', ['super_admin']],
      ['management', ['branch_manager', 'sales_manager', 'leasing_manager']],
    ])('category %s contains expected roles', (category, expectedIds) => {
      const rolesInCategory = REAL_ESTATE_ROLES.filter(r => r.category === category).map(r => r.id);
      for (const id of expectedIds) {
        expect(rolesInCategory).toContain(id);
      }
    });
  });

  // ── ROLE_KEY_MAP ──────────────────────────────────────────────────
  describe('ROLE_KEY_MAP', () => {
    it('maps owner to managing_director', () => {
      expect(ROLE_KEY_MAP['owner']).toBe('managing_director');
    });

    it('maps md to managing_director', () => {
      expect(ROLE_KEY_MAP['md']).toBe('managing_director');
    });

    it('maps admin to super_admin', () => {
      expect(ROLE_KEY_MAP['admin']).toBe('super_admin');
    });

    it('maps seller to landlord', () => {
      expect(ROLE_KEY_MAP['seller']).toBe('landlord');
    });

    it('maps freelancer to affiliated_agent (removed in Phase 0)', () => {
      // freelancer role was removed during Phase 0 — commission/freelancer cleanup
      expect(ROLE_KEY_MAP['freelancer']).toBeUndefined();
    });

    it('maps dashed keys to underscored canonical IDs', () => {
      expect(ROLE_KEY_MAP['leasing-agent']).toBe('leasing_agent');
      expect(ROLE_KEY_MAP['sales-agent']).toBe('sales_agent');
      expect(ROLE_KEY_MAP['property-manager']).toBe('property_manager');
    });
  });

  // ── normalizeRoleKey ──────────────────────────────────────────────
  describe('normalizeRoleKey', () => {
    it('returns managing_director for null', () => {
      expect(normalizeRoleKey(null)).toBe('managing_director');
    });

    it('returns managing_director for undefined', () => {
      expect(normalizeRoleKey(undefined)).toBe('managing_director');
    });

    it('returns managing_director for empty string', () => {
      expect(normalizeRoleKey('')).toBe('managing_director');
    });

    it('uses ROLE_KEY_MAP when available', () => {
      expect(normalizeRoleKey('owner')).toBe('managing_director');
      expect(normalizeRoleKey('admin')).toBe('super_admin');
    });

    it('converts dashes to underscores for unknown keys', () => {
      expect(normalizeRoleKey('some-custom-role')).toBe('some_custom_role');
    });

    it('passes through already-canonical IDs', () => {
      expect(normalizeRoleKey('sales_agent')).toBe('sales_agent');
    });
  });

  // ── getRoleById ───────────────────────────────────────────────────
  describe('getRoleById', () => {
    it('finds role by canonical ID', () => {
      const role = getRoleById('managing_director');
      expect(role).toBeDefined();
      expect(role!.name).toBe('Managing Director');
    });

    it('finds role by legacy key via normalization', () => {
      const role = getRoleById('owner');
      expect(role).toBeDefined();
      expect(role!.id).toBe('managing_director');
    });

    it('finds role by dashed key', () => {
      const role = getRoleById('leasing-agent');
      expect(role).toBeDefined();
      expect(role!.id).toBe('leasing_agent');
    });

    it('returns undefined for non-existent role', () => {
      expect(getRoleById('nonexistent_role')).toBeUndefined();
    });

    it('returns managing_director for empty string', () => {
      const role = getRoleById('');
      expect(role?.id).toBe('managing_director');
    });
  });

  // ── getRolesByCategory ────────────────────────────────────────────
  describe('getRolesByCategory', () => {
    it('returns executive roles', () => {
      const roles = getRolesByCategory('executive');
      expect(roles.length).toBeGreaterThan(0);
      expect(roles.every(r => r.category === 'executive')).toBe(true);
    });

    it('returns admin roles', () => {
      const roles = getRolesByCategory('admin');
      expect(roles.length).toBe(1); // only super_admin
      expect(roles[0].id).toBe('super_admin');
    });

    it('returns management roles', () => {
      const roles = getRolesByCategory('management');
      expect(roles.length).toBe(3);
    });

    it('returns agent roles', () => {
      const roles = getRolesByCategory('agent');
      expect(roles.length).toBeGreaterThanOrEqual(3);
    });

    it('returns specialist roles', () => {
      const roles = getRolesByCategory('specialist');
      expect(roles.length).toBeGreaterThanOrEqual(3);
    });

    it('returns support roles', () => {
      const roles = getRolesByCategory('support');
      expect(roles.length).toBeGreaterThanOrEqual(3);
    });

    it('returns client roles', () => {
      const roles = getRolesByCategory('client');
      expect(roles.length).toBeGreaterThanOrEqual(4);
    });

    it('returns empty array for unknown category', () => {
      expect(getRolesByCategory('unknown' as Parameters<typeof getRolesByCategory>[0])).toEqual([]);
    });
  });
});
