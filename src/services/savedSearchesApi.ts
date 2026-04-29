/**
 * Saved Searches API Service
 * ──────────────────────────
 * Client-side wrapper for /api/saved-searches backend routes.
 * Uses authFetch for automatic JWT handling.
 */

import { authFetch } from '../utils/authFetch';

// ─── Types ───────────────────────────────────────────────────────────

export interface SearchFilters {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  location?: string;
  minArea?: number;
  maxArea?: number;
  status?: string;
  [key: string]: unknown;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  alertEnabled: boolean;
  matchCount: number;
  lastChecked: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchCheckResult {
  matchCount: number;
  previousCount: number;
  newMatches: number;
}

// ─── API Functions ───────────────────────────────────────────────────

/** List all saved searches for the current user */
export async function fetchSavedSearches(): Promise<SavedSearch[]> {
  const res = await authFetch('/api/saved-searches');
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch saved searches');
  return json.data;
}

/** Create a new saved search */
export async function createSavedSearch(
  name: string,
  filters: SearchFilters,
  alertEnabled = false,
): Promise<SavedSearch> {
  const res = await authFetch('/api/saved-searches', {
    method: 'POST',
    body: JSON.stringify({ name, filters, alertEnabled }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to create saved search');
  return json.data;
}

/** Update an existing saved search */
export async function updateSavedSearch(
  id: string,
  updates: Partial<Pick<SavedSearch, 'name' | 'filters' | 'alertEnabled'>>,
): Promise<SavedSearch> {
  const res = await authFetch(`/api/saved-searches/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to update saved search');
  return json.data;
}

/** Delete a saved search */
export async function deleteSavedSearch(id: string): Promise<void> {
  const res = await authFetch(`/api/saved-searches/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to delete saved search');
}

/** Check for new matches on a saved search */
export async function checkSavedSearchMatches(id: string): Promise<MatchCheckResult> {
  const res = await authFetch(`/api/saved-searches/${id}/check`, {
    method: 'POST',
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to check matches');
  return json.data;
}
