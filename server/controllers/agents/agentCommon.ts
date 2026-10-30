/**
 * Agent Common Constants, Types & Parameters
 */

import { Request } from 'express';

export type RouteRequest = Request<Record<string, string>>;

export const CACHE_TTL_AGENTS = 300; // 5 minutes

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

export const VALID_STATUSES = ['active', 'inactive', 'pending', 'suspended'] as const;
export const VALID_DEPARTMENTS = [
  'sales',
  'leasing',
  'support',
  'management',
  'marketing',
  'finance',
  'hr',
  'it',
] as const;

