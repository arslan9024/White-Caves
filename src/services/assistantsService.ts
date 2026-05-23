/**
 * Assistants Service — Phase 0.8
 *
 * Communicates with /api/assistants to fetch assistant metadata and
 * markdown plans. Mutations (create/update/delete) are restricted to
 * super-user callers.
 */

import { apiClient } from '../utils/apiClient';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AssistantMeta {
  id: string;
  name: string;
  title: string;
  department: string;
  icon: string;
  colorScheme: string;
  avatar: string;
}

export interface AssistantPlanResponse {
  id: string;
  plan: string | null;
  exists: boolean;
}

export interface AssistantsListResponse {
  success: boolean;
  data: AssistantMeta[];
  total: number;
}

// ─── Service ─────────────────────────────────────────────────────────────────

const BASE = '/assistants';

export const assistantsService = {
  /**
   * List all AI assistants (metadata only, no plan content).
   * Public — no auth required.
   */
  async listAll(): Promise<AssistantMeta[]> {
    const res = (await apiClient.get(BASE)) as AssistantsListResponse;
    return res.data;
  },

  /**
   * Fetch the markdown plan for a specific assistant.
   * Requires authentication.
   */
  async getPlan(id: string): Promise<AssistantPlanResponse> {
    const res = (await apiClient.get(`${BASE}/${encodeURIComponent(id)}/plan`)) as {
      success: boolean;
      data: AssistantPlanResponse;
    };
    return res.data;
  },

  /**
   * Create a new assistant plan.
   * Super-user only.
   */
  async createPlan(id: string, plan: string): Promise<void> {
    await apiClient.post(BASE, { id, plan });
  },

  /**
   * Update an existing assistant's plan.
   * Super-user only.
   */
  async updatePlan(id: string, plan: string): Promise<void> {
    await apiClient.put(`${BASE}/${encodeURIComponent(id)}`, { plan });
  },

  /**
   * Delete an assistant's plan.
   * Super-user only.
   */
  async deletePlan(id: string): Promise<void> {
    await apiClient.delete(`${BASE}/${encodeURIComponent(id)}`);
  },
};
