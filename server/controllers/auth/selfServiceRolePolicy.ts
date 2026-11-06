// FILE: server/controllers/auth/selfServiceRolePolicy.ts
/**
 * Self-Service Role Policy (Turing Law T20 — server enforcement)
 * Single Purpose: Decide which role/status a user may assign to themselves.
 *
 * Rules:
 * - New accounts with no confirmed persona are `guest` (zero CRM permissions in rbac.ts).
 * - Client personas (buyer/seller/landlord/tenant) are self-service and active immediately.
 * - Staff signups NEVER receive a staff role directly. They stay `guest` with status
 *   `pending`, and a RoleRequest for `agent` is filed for admin approval.
 * - The superuser / founder is always `managing_director`.
 */

import { AppError } from '../../middleware/errorHandler.js';

export const UNCONFIRMED_ROLE = 'guest';
export const CLIENT_SELF_SERVICE_ROLES = new Set(['buyer', 'seller', 'landlord', 'tenant']);
export const STAFF_REQUESTED_ROLE = 'agent';

export type SelfServiceStatus = 'active' | 'pending';

export interface SelfServiceRoleDecision {
  role: string;
  status: SelfServiceStatus;
  /** Set when an admin-approval RoleRequest must be filed for this user. */
  pendingRoleRequest: string | null;
  category: 'client' | 'staff' | 'superuser';
}

export function resolveSelfServiceRole(input: {
  isSuperuser: boolean;
  category: unknown;
  role: unknown;
}): SelfServiceRoleDecision {
  if (input.isSuperuser) {
    return {
      role: 'managing_director',
      status: 'active',
      pendingRoleRequest: null,
      category: 'superuser',
    };
  }

  const category = String(input.category ?? '')
    .toLowerCase()
    .trim();
  const role = String(input.role ?? '')
    .toLowerCase()
    .trim();

  if (category === 'client') {
    if (!role || !CLIENT_SELF_SERVICE_ROLES.has(role)) {
      throw new AppError(
        'Client signup requires a valid role: buyer, seller, landlord, or tenant',
        400
      );
    }
    return { role, status: 'active', pendingRoleRequest: null, category: 'client' };
  }

  if (category === 'staff') {
    return {
      role: UNCONFIRMED_ROLE,
      status: 'pending',
      pendingRoleRequest: STAFF_REQUESTED_ROLE,
      category: 'staff',
    };
  }

  throw new AppError('Invalid category. Must be either client or staff', 400);
}

/** A role is "confirmed" once it is anything other than the unconfirmed guest role. */
export function isRoleConfirmed(role: string | null | undefined): boolean {
  const normalized = String(role ?? '')
    .toLowerCase()
    .trim();
  return normalized.length > 0 && normalized !== UNCONFIRMED_ROLE;
}
