/**
 * leadCommon.ts
 * Shared constants, types, and utility functions for leads controllers.
 */

import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { LEAD_SLA_HOURS } from '../../services/leadWorkflowService.js';

export type RouteRequest = Request<Record<string, string>>;

// Unified lead status enum — single source of truth for all lead endpoints
export const VALID_LEAD_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'viewing',
  'offered',
  'negotiating',
  'won',
  'lost',
] as const;

export const VALID_LEAD_SOURCES = [
  'direct',
  'website',
  'referral',
  'social',
  'portal',
  'cold_call',
  'event',
  'other',
  'homepage_search',
] as const;

export const SLA_HOURS = LEAD_SLA_HOURS;
export const SLA_MS = SLA_HOURS * 60 * 60 * 1000;

export interface BulkImportLeadInput {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  status?: string | null;
  source?: string | null;
  budget?: number | string | null;
  score?: number | null;
  notes?: string | null;
  tags?: string[] | null;
}

export interface BulkImportRowError {
  row: number;
  code:
    | 'missing_name'
    | 'invalid_email'
    | 'invalid_phone'
    | 'duplicate_in_batch'
    | 'duplicate_existing';
  message: string;
}

export interface PreparedBulkLead {
  row: number;
  data: {
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    status: string;
    source: string;
    budget: number | null;
    score: number;
    notes: string | null;
    tags: string[];
  };
}

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

export const normalizeJsonRecord = (
  value: Prisma.JsonValue | null | undefined
): Record<string, unknown> | null => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
};

