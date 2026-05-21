/**
 * RBAC Middleware Tests
 * ────────────────────
 * Tests for requireRole, requirePermission, requireAllPermissions,
 * requireMinRole, scopeToOwn, and roleHasPermission utilities.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import {
  requireRole,
  requirePermission,
  requireAllPermissions,
  requireMinRole,
  requireMinRank,
  scopeToOwn,
  roleHasPermission,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
  ROLE_RANK,
} from './rbac';
import type { AuthRequest } from './auth';

// ─── Helper: create mock request/response/next ──────────────────────────────
function createMocks(userOverrides?: { id?: string; email?: string; role?: string } | null) {
  const req = {
    user:
      userOverrides === null
        ? undefined
        : {
            id: 'user-123',
            email: 'test@whitecaves.ae',
            role: 'agent',
            ...userOverrides,
          },
  } as AuthRequest;

  const res = {} as Response;
  const next = vi.fn() as unknown as NextFunction;

  return { req, res, next: next as NextFunction & ReturnType<typeof vi.fn> };
}

// ─── roleHasPermission ──────────────────────────────────────────────────────
describe('roleHasPermission', () => {
  it('returns true when role has the permission', () => {
    expect(roleHasPermission('owner', 'access_whatsapp_business')).toBe(true);
    expect(roleHasPermission('agent', 'view_leads')).toBe(true);
    expect(roleHasPermission('finance', 'process_payments')).toBe(true);
  });

  it('returns false when role lacks the permission', () => {
    expect(roleHasPermission('buyer', 'manage_leads')).toBe(false);
    expect(roleHasPermission('viewer', 'delete_property')).toBe(false);
    expect(roleHasPermission('tenant', 'access_whatsapp_business')).toBe(false);
  });

  it('returns false for unknown role', () => {
    expect(roleHasPermission('nonexistent', 'view_dashboard')).toBe(false);
  });

  it('returns false for unknown permission', () => {
    expect(roleHasPermission('owner', 'fly_to_moon')).toBe(false);
  });
});

// ─── ROLE_HIERARCHY ─────────────────────────────────────────────────────────
describe('ROLE_HIERARCHY', () => {
  it('owner has highest level (100)', () => {
    expect(ROLE_HIERARCHY['owner']).toBe(100);
  });

  it('buyer/tenant have lowest level (10)', () => {
    expect(ROLE_HIERARCHY['buyer']).toBe(10);
    expect(ROLE_HIERARCHY['tenant']).toBe(10);
  });

  it('manager > admin > finance > agent', () => {
    expect(ROLE_HIERARCHY['manager']).toBeGreaterThan(ROLE_HIERARCHY['admin']);
    expect(ROLE_HIERARCHY['admin']).toBeGreaterThan(ROLE_HIERARCHY['finance']);
    expect(ROLE_HIERARCHY['finance']).toBeGreaterThan(ROLE_HIERARCHY['agent']);
  });
});

// ─── ROLE_PERMISSIONS completeness ──────────────────────────────────────────
describe('ROLE_PERMISSIONS', () => {
  it('defines permissions for all canonical roles', () => {
    const expectedRoles = [
      'owner',
      'manager',
      'admin',
      'hr_staff',
      'accounts_staff',
      'agent',
      'leasing_agent',
      'sales_agent',
      'leasing-agent',
      'secondary-sales-agent',
      'finance',
      'viewer',
      'buyer',
      'seller',
      'landlord',
      'tenant',
      'property_owner',
      'user',
    ];
    for (const role of expectedRoles) {
      expect(ROLE_PERMISSIONS[role]).toBeDefined();
      expect(Array.isArray(ROLE_PERMISSIONS[role])).toBe(true);
      expect(ROLE_PERMISSIONS[role].length).toBeGreaterThan(0);
    }
  });

  it('owner has the most permissions', () => {
    const ownerPerms = ROLE_PERMISSIONS['owner'].length;
    for (const [role, perms] of Object.entries(ROLE_PERMISSIONS)) {
      if (role !== 'owner') {
        expect(ownerPerms).toBeGreaterThanOrEqual(perms.length);
      }
    }
  });

  it('every role has view_dashboard and edit_profile', () => {
    for (const [, perms] of Object.entries(ROLE_PERMISSIONS)) {
      expect(perms).toContain('view_dashboard');
      expect(perms).toContain('edit_profile');
    }
  });
});

// ─── requireRole ────────────────────────────────────────────────────────────
describe('requireRole', () => {
  it('passes when user role is in the allowed list', () => {
    const { req, res, next } = createMocks({ role: 'owner' });
    requireRole('owner', 'manager')(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('rejects when user role is NOT in the allowed list', () => {
    const { req, res, next } = createMocks({ role: 'buyer' });
    requireRole('owner', 'manager')(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        message: expect.stringContaining('requires role'),
      })
    );
  });

  it('rejects with 401 when no user is attached', () => {
    const { req, res, next } = createMocks(null);
    requireRole('owner')(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
      })
    );
  });

  it('works with a single role', () => {
    const { req, res, next } = createMocks({ role: 'admin' });
    requireRole('admin')(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });
});

// ─── requirePermission ──────────────────────────────────────────────────────
describe('requirePermission', () => {
  it('passes when user role has the permission', () => {
    const { req, res, next } = createMocks({ role: 'agent' });
    requirePermission('view_leads')(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('passes when user role has ANY of the listed permissions', () => {
    const { req, res, next } = createMocks({ role: 'finance' });
    requirePermission('manage_leads', 'process_payments')(req, res, next);
    expect(next).toHaveBeenCalledWith(); // finance has process_payments
  });

  it('rejects when user role has NONE of the permissions', () => {
    const { req, res, next } = createMocks({ role: 'buyer' });
    requirePermission('manage_leads', 'delete_property')(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        message: expect.stringContaining('requires permission'),
      })
    );
  });

  it('rejects with 401 when no user is attached', () => {
    const { req, res, next } = createMocks(null);
    requirePermission('view_dashboard')(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
      })
    );
  });
});

// ─── requireAllPermissions ──────────────────────────────────────────────────
describe('requireAllPermissions', () => {
  it('passes when user role has ALL listed permissions', () => {
    const { req, res, next } = createMocks({ role: 'owner' });
    requireAllPermissions('manage_users', 'delete_property', 'access_whatsapp_business')(
      req,
      res,
      next
    );
    expect(next).toHaveBeenCalledWith();
  });

  it('rejects when user role has only SOME of the required permissions', () => {
    const { req, res, next } = createMocks({ role: 'admin' });
    requireAllPermissions('manage_users', 'configure_chatbot')(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
      })
    ); // admin has manage_users but NOT configure_chatbot
  });
});

// ─── requireMinRole ─────────────────────────────────────────────────────────
describe('requireMinRole', () => {
  it('passes when user role meets the minimum level', () => {
    const { req, res, next } = createMocks({ role: 'owner' });
    requireMinRole('agent')(req, res, next); // owner(100) >= agent(50)
    expect(next).toHaveBeenCalledWith();
  });

  it('passes when user role exactly matches the minimum', () => {
    const { req, res, next } = createMocks({ role: 'agent' });
    requireMinRole('agent')(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('rejects when user role is below the minimum', () => {
    const { req, res, next } = createMocks({ role: 'buyer' });
    requireMinRole('agent')(req, res, next); // buyer(10) < agent(50)
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        message: expect.stringContaining('minimum role required'),
      })
    );
  });

  it('rejects with 401 when no user', () => {
    const { req, res, next } = createMocks(null);
    requireMinRole('viewer')(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
      })
    );
  });
});

// ─── scopeToOwn ─────────────────────────────────────────────────────────────
describe('scopeToOwn', () => {
  it('attaches empty filter for supervisors (owner/manager/admin)', () => {
    for (const role of ['owner', 'manager', 'admin']) {
      const { req, res, next } = createMocks({ role });
      scopeToOwn()(req, res, next);
      expect((req as any).ownershipFilter).toEqual({});
      expect(next).toHaveBeenCalledWith();
    }
  });

  it('attaches userId filter for agents', () => {
    const { req, res, next } = createMocks({ id: 'agent-456', role: 'agent' });
    scopeToOwn()(req, res, next);
    expect((req as any).ownershipFilter).toEqual({ userId: 'agent-456' });
  });

  it('uses custom owner field name', () => {
    const { req, res, next } = createMocks({ id: 'agent-789', role: 'agent' });
    scopeToOwn('assignedToId')(req, res, next);
    expect((req as any).ownershipFilter).toEqual({ assignedToId: 'agent-789' });
  });

  it('attaches userId filter for buyer', () => {
    const { req, res, next } = createMocks({ id: 'buyer-100', role: 'buyer' });
    scopeToOwn()(req, res, next);
    expect((req as any).ownershipFilter).toEqual({ userId: 'buyer-100' });
  });

  it('rejects with 401 when no user', () => {
    const { req, res, next } = createMocks(null);
    scopeToOwn()(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
      })
    );
  });
});

// ─── Integration: real role/permission combinations ─────────────────────────
describe('Real-world RBAC scenarios', () => {
  it('owner can access WhatsApp Business', () => {
    const { req, res, next } = createMocks({ role: 'owner' });
    requirePermission('access_whatsapp_business')(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('agent CANNOT access WhatsApp Business', () => {
    const { req, res, next } = createMocks({ role: 'agent' });
    requirePermission('access_whatsapp_business')(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it('agent can view/reply WhatsApp but cannot assign/close conversations', () => {
    const { req: viewReq, res: viewRes, next: viewNext } = createMocks({ role: 'agent' });
    requirePermission('view_whatsapp_conversations')(viewReq, viewRes, viewNext);
    expect(viewNext).toHaveBeenCalledWith();

    const { req: replyReq, res: replyRes, next: replyNext } = createMocks({ role: 'agent' });
    requirePermission('reply_whatsapp_conversations')(replyReq, replyRes, replyNext);
    expect(replyNext).toHaveBeenCalledWith();

    const { req: assignReq, res: assignRes, next: assignNext } = createMocks({ role: 'agent' });
    requirePermission('assign_whatsapp_conversations')(assignReq, assignRes, assignNext);
    expect(assignNext).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));

    const { req: closeReq, res: closeRes, next: closeNext } = createMocks({ role: 'agent' });
    requirePermission('close_whatsapp_conversations')(closeReq, closeRes, closeNext);
    expect(closeNext).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it('manager can fully operate WhatsApp conversations', () => {
    const perms = [
      'view_whatsapp_conversations',
      'reply_whatsapp_conversations',
      'assign_whatsapp_conversations',
      'close_whatsapp_conversations',
    ];

    for (const perm of perms) {
      const { req, res, next } = createMocks({ role: 'manager' });
      requirePermission(perm)(req, res, next);
      expect(next).toHaveBeenCalledWith();
    }
  });

  it('buyer can view properties but cannot create', () => {
    const { req: req1, res: res1, next: next1 } = createMocks({ role: 'buyer' });
    requirePermission('view_properties')(req1, res1, next1);
    expect(next1).toHaveBeenCalledWith(); // pass

    const { req: req2, res: res2, next: next2 } = createMocks({ role: 'buyer' });
    requirePermission('create_property')(req2, res2, next2);
    expect(next2).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 })); // reject
  });

  it('finance can process payments but cannot manage leads', () => {
    const { req: req1, res: res1, next: next1 } = createMocks({ role: 'finance' });
    requirePermission('process_payments')(req1, res1, next1);
    expect(next1).toHaveBeenCalledWith();

    const { req: req2, res: res2, next: next2 } = createMocks({ role: 'finance' });
    requirePermission('manage_leads')(req2, res2, next2);
    expect(next2).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it('viewer can see everything but cannot modify anything', () => {
    const viewPerms = [
      'view_dashboard',
      'view_properties',
      'view_leads',
      'view_contracts',
      'view_payments',
      'view_analytics',
    ];
    for (const perm of viewPerms) {
      const { req, res, next } = createMocks({ role: 'viewer' });
      requirePermission(perm)(req, res, next);
      expect(next).toHaveBeenCalledWith();
    }

    const writePerms = [
      'create_property',
      'manage_leads',
      'create_contracts',
      'process_payments',
      'delete_property',
    ];
    for (const perm of writePerms) {
      const { req, res, next } = createMocks({ role: 'viewer' });
      requirePermission(perm)(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
    }
  });

  it('only owner can delete properties (via permission-based check)', () => {
    // delete_property is only granted to owner, manager, admin
    const canDelete = ['owner', 'manager', 'admin'];
    const cannotDelete = ['agent', 'finance', 'viewer', 'buyer', 'seller', 'landlord', 'tenant'];

    for (const role of canDelete) {
      const { req, res, next } = createMocks({ role });
      requirePermission('delete_property')(req, res, next);
      expect(next).toHaveBeenCalledWith();
    }

    for (const role of cannotDelete) {
      const { req, res, next } = createMocks({ role });
      requirePermission('delete_property')(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
    }
  });
});

// ─── requireMinRank ──────────────────────────────────────────────────────────
describe('requireMinRank', () => {
  it('ROLE_RANK defines rank for all canonical roles', () => {
    const rank2Roles = [
      'owner',
      'admin',
      'manager',
      'hr_staff',
      'accounts_staff',
      'agent',
      'leasing_agent',
      'sales_agent',
      'finance',
      'viewer',
    ];
    const rank3Roles = ['landlord', 'tenant', 'buyer', 'seller', 'property_owner'];

    for (const role of rank2Roles) {
      expect(ROLE_RANK[role]).toBe(2);
    }
    for (const role of rank3Roles) {
      expect(ROLE_RANK[role]).toBe(3);
    }
    expect(ROLE_RANK['user']).toBe(1);
  });

  it('passes when user rank meets minimum (owner = rank 2)', () => {
    const { req, res, next } = createMocks({ role: 'owner' });
    requireMinRank(2)(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('passes when user rank exceeds minimum (staff accessing rank 1 route)', () => {
    const { req, res, next } = createMocks({ role: 'admin' });
    requireMinRank(1)(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

  it('rejects when user rank is below minimum (user accessing staff route)', () => {
    const { req, res, next } = createMocks({ role: 'user' });
    requireMinRank(2)(req, res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 403, message: expect.stringContaining('rank') })
    );
  });

  it('rejects unauthenticated requests with 401', () => {
    const { req, res, next } = createMocks(null);
    requireMinRank(1)(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it('hr_staff and accounts_staff pass rank 2 gate', () => {
    for (const role of ['hr_staff', 'accounts_staff']) {
      const { req, res, next } = createMocks({ role });
      requireMinRank(2)(req, res, next);
      expect(next).toHaveBeenCalledWith();
    }
  });
});

// ─── New role permissions ─────────────────────────────────────────────────────
describe('New role permissions (v2.0)', () => {
  it('hr_staff can manage HR but cannot manage leads', () => {
    const { req, res, next } = createMocks({ role: 'hr_staff' });
    requirePermission('manage_hr')(req, res, next);
    expect(next).toHaveBeenCalledWith();

    const { req: r2, res: r2res, next: n2 } = createMocks({ role: 'hr_staff' });
    requirePermission('manage_leads')(r2, r2res, n2);
    expect(n2).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it('accounts_staff can approve commissions but cannot manage leads', () => {
    const { req, res, next } = createMocks({ role: 'accounts_staff' });
    requirePermission('approve_commission')(req, res, next);
    expect(next).toHaveBeenCalledWith();

    const { req: r2, res: r2res, next: n2 } = createMocks({ role: 'accounts_staff' });
    requirePermission('manage_leads')(r2, r2res, n2);
    expect(n2).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it('property_owner can manage maintenance but cannot manage HR', () => {
    const { req, res, next } = createMocks({ role: 'property_owner' });
    requirePermission('manage_maintenance')(req, res, next);
    expect(next).toHaveBeenCalledWith();

    const { req: r2, res: r2res, next: n2 } = createMocks({ role: 'property_owner' });
    requirePermission('manage_hr')(r2, r2res, n2);
    expect(n2).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it('tenant can submit maintenance and pay rent', () => {
    for (const perm of ['submit_maintenance', 'pay_rent_online', 'view_own_lease']) {
      const { req, res, next } = createMocks({ role: 'tenant' });
      requirePermission(perm)(req, res, next);
      expect(next).toHaveBeenCalledWith();
    }
  });

  it('leasing_agent (underscore) has same permissions as leasing-agent (hyphen)', () => {
    const hyphenPerms = ROLE_PERMISSIONS['leasing-agent'];
    const underscorePerms = ROLE_PERMISSIONS['leasing_agent'];
    expect(underscorePerms).toBeDefined();
    expect(underscorePerms).toEqual(hyphenPerms);
  });
});
