/**
 * Client Common Utilities, Constants & Types
 */

import { Request } from 'express';

export type RouteRequest = Request<Record<string, string>>;

export const VALID_CATEGORIES = ['buyer', 'seller', 'landlord', 'tenant', 'investor'] as const;
export type ValidCategory = (typeof VALID_CATEGORIES)[number];

export const VALID_STATUSES = ['active', 'inactive', 'prospect', 'archived'] as const;
export type ValidStatus = (typeof VALID_STATUSES)[number];

export const VALID_TYPES = ['individual', 'corporate', 'investment_firm'] as const;
export type ValidType = (typeof VALID_TYPES)[number];

export const VALID_RELATIONSHIPS = [
  'owner',
  'tenant',
  'buyer',
  'interested',
  'previous_owner',
  'previous_tenant',
] as const;
export type ValidRelationship = (typeof VALID_RELATIONSHIPS)[number];

export const VALID_COMM_TYPES = ['call', 'email', 'whatsapp', 'meeting', 'note', 'sms'] as const;
export type ValidCommType = (typeof VALID_COMM_TYPES)[number];

export const getRouteParam = (value: string | string[] | undefined): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }

  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    const first = value[0].trim();
    return first.length > 0 ? first : null;
  }

  return null;
};

