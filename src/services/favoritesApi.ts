/**
 * Favorites API Service
 * ─────────────────────
 * Client-side wrapper for /api/favorites backend routes.
 * Uses authFetch for automatic JWT handling.
 */

import { authFetch } from '../utils/authFetch';

// ─── Types ───────────────────────────────────────────────────────────

export interface FavoriteProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  area: string;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];
  featured: boolean;
  agentName: string;
}

export interface FavoriteRecord {
  id: string;
  userId: string;
  propertyId: string;
  property: FavoriteProperty;
  createdAt: string;
}

export interface PaginatedFavorites {
  data: FavoriteRecord[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// ─── API Functions ───────────────────────────────────────────────────

/** Fetch paginated list of favorites with full property data */
export async function fetchFavorites(
  page = 1,
  pageSize = 20,
): Promise<PaginatedFavorites> {
  const res = await authFetch(`/api/favorites?page=${page}&pageSize=${pageSize}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch favorites');
  return { data: json.data, pagination: json.pagination };
}

/** Get all favorited property IDs (lightweight — no property data) */
export async function fetchFavoriteIds(): Promise<string[]> {
  const res = await authFetch('/api/favorites/ids');
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch favorite IDs');
  return json.data;
}

/** Check if a specific property is favorited */
export async function checkIsFavorited(propertyId: string): Promise<boolean> {
  const res = await authFetch(`/api/favorites/check/${propertyId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to check favorite');
  return json.data.isFavorited;
}

/** Add a property to favorites */
export async function addFavorite(propertyId: string): Promise<FavoriteRecord> {
  const res = await authFetch('/api/favorites', {
    method: 'POST',
    body: JSON.stringify({ propertyId }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to add favorite');
  return json.data;
}

/** Remove a property from favorites */
export async function removeFavorite(propertyId: string): Promise<void> {
  const res = await authFetch(`/api/favorites/${propertyId}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to remove favorite');
}
