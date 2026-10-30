/**
 * User Common Constants, Types & Validation Helpers
 */

import { Request } from 'express';
import { ROLE_ALIAS_MAP } from '../../middleware/rbac.js';

export type RouteRequest = Request<Record<string, string>>;

export const routeParamToString = (value: string | string[] | undefined): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    const first = value[0].trim();
    return first.length > 0 ? first : null;
  }
  return null;
};

// All role strings accepted by the PATCH endpoint.
// Includes both canonical backend roles and frontend UI aliases.
export const ALL_VALID_ROLES = Object.keys(ROLE_ALIAS_MAP);

// Valid status strings
export const VALID_STATUSES = ['active', 'pending', 'inactive', 'suspended', 'rejected'] as const;
export type UserStatus = (typeof VALID_STATUSES)[number];

