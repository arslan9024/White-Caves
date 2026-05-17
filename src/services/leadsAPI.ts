/**
 * Leads API Service Layer
 * ────────────────────────
 * Typed HTTP client for /api/leads endpoints.
 * Uses authFetch for automatic JWT injection + session handling.
 *
 * @module leadsAPI
 * @see server/routes/leads.ts — backend implementation
 */

import { authFetch, extractApiError } from '@/utils/authFetch';
import { createLogger } from '@/utils/logger';

const log = createLogger('leadsAPI');

// ─── Types ──────────────────────────────────────────────────────────────

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'hot'
  | 'warm'
  | 'cold'
  | 'won'
  | 'lost';

export type LeadSource =
  | 'whatsapp'
  | 'website'
  | 'phone'
  | 'referral'
  | 'marketing'
  | 'property_finder'
  | 'bayut'
  | 'dubizzle'
  | 'walk_in'
  | 'direct';

export type LeadStage =
  | 'initial_contact'
  | 'discovery'
  | 'proposal'
  | 'negotiation'
  | 'contract_review'
  | 'closed_won'
  | 'closed_lost';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  source: LeadSource;
  stage?: LeadStage;
  budget?: number;
  score: number;
  tags: string[];
  lastContact?: string;
  notes?: string;
  assignedToId?: string;
  assignedTo?: { id: string; name: string; email: string };
  propertyId?: string;
  property?: { id: string; title: string; price: number };
  createdAt: string;
  updatedAt: string;
}

export interface LeadInteraction {
  id: string;
  type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'note';
  description: string;
  createdAt: string;
  userId?: string;
}

export interface LeadsListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  source?: string;
  stage?: string;
  assignedToId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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

export interface LeadStats {
  total: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
  totalValue: number;
  averageScore: number;
}

// ─── API Functions ──────────────────────────────────────────────────────

/**
 * Fetch leads with pagination, filtering, and sorting.
 */
export async function fetchLeads(params: LeadsListParams = {}): Promise<PaginatedResponse<Lead>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.pageSize) query.set('pageSize', String(params.pageSize));
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.source && params.source !== 'all') query.set('source', params.source);
  if (params.stage && params.stage !== 'all') query.set('stage', params.stage);
  if (params.assignedToId) query.set('assignedToId', params.assignedToId);
  if (params.search) query.set('search', params.search);
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortOrder) query.set('sortOrder', params.sortOrder);

  const url = `/api/leads${query.toString() ? `?${query}` : ''}`;
  log.info('Fetching leads', { url });

  const response = await authFetch(url);
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to fetch leads'));
  }
  return response.json();
}

/**
 * Fetch a single lead by ID with full relation data.
 */
export async function fetchLead(id: string): Promise<SingleResponse<Lead>> {
  const response = await authFetch(`/api/leads/${id}`);
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to fetch lead'));
  }
  return response.json();
}

/**
 * Create a new lead.
 */
export async function createLead(data: Partial<Lead>): Promise<SingleResponse<Lead>> {
  log.info('Creating lead', { name: data.name });
  const response = await authFetch('/api/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to create lead'));
  }
  return response.json();
}

/**
 * Update an existing lead.
 */
export async function updateLead(id: string, data: Partial<Lead>): Promise<SingleResponse<Lead>> {
  log.info('Updating lead', { id });
  const response = await authFetch(`/api/leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to update lead'));
  }
  return response.json();
}

/**
 * Delete a lead.
 */
export async function deleteLead(id: string): Promise<{ success: boolean; message: string }> {
  log.info('Deleting lead', { id });
  const response = await authFetch(`/api/leads/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to delete lead'));
  }
  return response.json();
}

/**
 * Assign a lead to an agent.
 */
export async function assignLead(
  leadId: string,
  agentId: string,
  method: 'manual' | 'round_robin' = 'manual',
): Promise<SingleResponse<Lead>> {
  log.info('Assigning lead', { leadId, agentId, method });
  const response = await authFetch(`/api/leads/${leadId}/assign`, {
    method: 'POST',
    body: JSON.stringify({ agentId, method }),
  });
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to assign lead'));
  }
  return response.json();
}

/**
 * Log an interaction (call, email, WhatsApp, meeting, note) on a lead.
 */
export async function logInteraction(
  leadId: string,
  interaction: { type: LeadInteraction['type']; description: string },
): Promise<SingleResponse<LeadInteraction>> {
  log.info('Logging interaction', { leadId, type: interaction.type });
  const response = await authFetch(`/api/leads/${leadId}/interactions`, {
    method: 'POST',
    body: JSON.stringify(interaction),
  });
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to log interaction'));
  }
  return response.json();
}

/**
 * Fetch lead statistics.
 */
export async function fetchLeadStats(): Promise<SingleResponse<LeadStats>> {
  const response = await authFetch('/api/leads/stats');
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to fetch lead stats'));
  }
  return response.json();
}

/**
 * Bulk import leads.
 */
export async function bulkImportLeads(
  leads: Partial<Lead>[],
): Promise<{ success: boolean; data: { imported: number; total: number } }> {
  log.info('Bulk importing leads', { count: leads.length });
  const response = await authFetch('/api/leads/bulk-import', {
    method: 'POST',
    body: JSON.stringify({ leads }),
  });
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to import leads'));
  }
  return response.json();
}
