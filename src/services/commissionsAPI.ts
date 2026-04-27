/**
 * Commissions / Finance API Service Layer
 * ─────────────────────────────────────────
 * Typed HTTP client for /api/finance endpoints.
 * Uses authFetch for automatic JWT injection + session handling.
 *
 * @module commissionsAPI
 * @see server/routes/finance.ts — backend implementation (PRODUCTION READY)
 */

import { authFetch, extractApiError } from '@/utils/authFetch';
import { createLogger } from '@/utils/logger';

const log = createLogger('commissionsAPI');

// ─── Types ──────────────────────────────────────────────────────────────

export type CommissionType = 'sale' | 'rental' | 'referral';
export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'cancelled';

export interface Commission {
  id: string;
  agentId: string;
  agent?: { id: string; name: string; email: string };
  amount: number;
  percentage?: number;
  type: CommissionType;
  status: CommissionStatus;
  notes?: string;
  paidAt?: string;
  leadId?: string;
  lead?: { id: string; name: string; email: string; budget?: number };
  propertyId?: string;
  property?: { id: string; title: string; price: number; location?: string };
  createdAt: string;
  updatedAt: string;
}

export interface CommissionListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  type?: string;
  agentId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FinanceSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  commissions: {
    total: { count: number; value: number };
    paid: { count: number; value: number };
    pending: { count: number; value: number };
    approved: { count: number; value: number };
  };
  byType: Array<{ type: string; count: number; value: number }>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
}

// ─── Dubai Commission Rate Constants ────────────────────────────────────

/** Dubai standard commission rates */
export const DUBAI_COMMISSION_RATES = {
  sale: 2,      // 2% of sale price
  rental: 5,    // 5% of annual rent
  referral: 25, // 25% of agent commission (configurable)
} as const;

/** VAT rates by property type */
export const VAT_RATES = {
  residential: 0,   // 0% VAT on residential
  commercial: 5,    // 5% VAT on commercial
  commission: 5,    // 5% VAT on commission income
} as const;

/**
 * Calculate commission with Dubai standards.
 */
export function calculateCommission(
  price: number,
  type: CommissionType,
  customRate?: number,
): { amount: number; rate: number; vat: number; total: number } {
  const rate = customRate ?? DUBAI_COMMISSION_RATES[type];
  const amount = price * (rate / 100);
  const vat = amount * (VAT_RATES.commission / 100);
  return { amount, rate, vat, total: amount + vat };
}

// ─── API Functions ──────────────────────────────────────────────────────

/**
 * Fetch commissions with pagination and filtering.
 */
export async function fetchCommissions(
  params: CommissionListParams = {},
): Promise<PaginatedResponse<Commission>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.pageSize) query.set('pageSize', String(params.pageSize));
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.type && params.type !== 'all') query.set('type', params.type);
  if (params.agentId) query.set('agentId', params.agentId);
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortOrder) query.set('sortOrder', params.sortOrder);

  const url = `/api/finance/commissions${query.toString() ? `?${query}` : ''}`;
  log.info('Fetching commissions', { url });

  const response = await authFetch(url);
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to fetch commissions'));
  }
  return response.json();
}

/**
 * Fetch a single commission by ID.
 */
export async function fetchCommission(id: string): Promise<SingleResponse<Commission>> {
  const response = await authFetch(`/api/finance/commissions/${id}`);
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to fetch commission'));
  }
  return response.json();
}

/**
 * Create a new commission.
 */
export async function createCommission(data: {
  agentId: string;
  amount: number;
  percentage?: number;
  type?: CommissionType;
  notes?: string;
  leadId?: string;
  propertyId?: string;
}): Promise<SingleResponse<Commission>> {
  log.info('Creating commission', { agentId: data.agentId, amount: data.amount });
  const response = await authFetch('/api/finance/commissions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to create commission'));
  }
  return response.json();
}

/**
 * Update a commission (status, notes, amount).
 */
export async function updateCommission(
  id: string,
  data: { status?: CommissionStatus; amount?: number; notes?: string },
): Promise<SingleResponse<Commission>> {
  log.info('Updating commission', { id, ...data });
  const response = await authFetch(`/api/finance/commissions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to update commission'));
  }
  return response.json();
}

/**
 * Delete a commission.
 */
export async function deleteCommission(
  id: string,
): Promise<{ success: boolean; message: string }> {
  log.info('Deleting commission', { id });
  const response = await authFetch(`/api/finance/commissions/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to delete commission'));
  }
  return response.json();
}

/**
 * Fetch financial summary (revenue, expenses, commission breakdown).
 */
export async function fetchFinanceSummary(): Promise<SingleResponse<FinanceSummary>> {
  log.info('Fetching finance summary');
  const response = await authFetch('/api/finance/summary');
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to fetch finance summary'));
  }
  return response.json();
}

/**
 * Bulk-pay approved commissions.
 */
export async function bulkPayCommissions(
  commissionIds: string[],
): Promise<{ success: boolean; data: { paidCount: number } }> {
  log.info('Bulk paying commissions', { count: commissionIds.length });
  const response = await authFetch('/api/finance/payments', {
    method: 'POST',
    body: JSON.stringify({ commissionIds }),
  });
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to process payments'));
  }
  return response.json();
}

/**
 * Fetch agent-specific commission history (for agent self-service).
 */
export async function fetchAgentCommissions(
  agentId: string,
  params: { page?: number; status?: string } = {},
): Promise<PaginatedResponse<Commission>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.status && params.status !== 'all') query.set('status', params.status);

  const url = `/api/agents/${agentId}/commissions${query.toString() ? `?${query}` : ''}`;
  const response = await authFetch(url);
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to fetch agent commissions'));
  }
  return response.json();
}
