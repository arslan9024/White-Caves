/**
 * Tenant Common Utilities, Constants & Types
 */

import { Request } from 'express';

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

export const VALID_TENANT_STATUSES = ['active', 'inactive', 'moved_out', 'terminated'] as const;
export type ValidTenantStatus = (typeof VALID_TENANT_STATUSES)[number];

