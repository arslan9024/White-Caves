/**
 * Properties API Service Layer
 * ────────────────────────────
 * Typed HTTP client for /api/properties endpoints.
 * Uses authFetch for automatic JWT injection + session handling.
 *
 * @module propertiesAPI
 * @see server/routes/properties.ts — backend implementation
 */

import { authFetch, extractApiError } from '@/utils/authFetch';
import { createLogger } from '@/utils/logger';

const log = createLogger('propertiesAPI');

// ─── Types ──────────────────────────────────────────────────────────────

export type PropertyStatus =
  | 'draft'
  | 'listed'
  | 'under_offer'
  | 'sold'
  | 'leased'
  | 'withdrawn';

export type PropertyType =
  | 'apartment'
  | 'villa'
  | 'townhouse'
  | 'penthouse'
  | 'office'
  | 'retail'
  | 'warehouse'
  | 'land'
  | 'building';

export type ListingType = 'sale' | 'rent' | 'both';

export interface Property {
  id: string;
  title: string;
  description?: string;
  type: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  price: number;
  currency?: string;
  address?: string;
  area?: string;
  city?: string;
  community?: string;
  building?: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  amenities: string[];
  images: string[];
  trakheesiPermit?: string;
  titleDeedNumber?: string;
  dldFee?: number;
  ownerId?: string;
  owner?: { id: string; name: string; phone: string };
  assignedAgentId?: string;
  assignedAgent?: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface PropertiesListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  type?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  city?: string;
  community?: string;
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

export interface PropertyStats {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  averagePrice: number;
  totalValue: number;
}

// ─── DLD Fee Calculator ─────────────────────────────────────────────────

/**
 * Calculate Dubai Land Department (DLD) transfer fees.
 * - Sales: 4% of sale price + AED 580 admin
 * - Lease: 5% of annual rent + AED 500 admin
 */
export function calculateDLDFee(
  price: number,
  transactionType: 'sale' | 'lease',
): { fee: number; adminFee: number; total: number; percentage: number } {
  if (transactionType === 'sale') {
    const fee = price * 0.04;
    const adminFee = 580;
    return { fee, adminFee, total: fee + adminFee, percentage: 4 };
  } else {
    const fee = price * 0.05;
    const adminFee = 500;
    return { fee, adminFee, total: fee + adminFee, percentage: 5 };
  }
}

/**
 * Calculate commission based on Dubai standards.
 * - Sales: 2% of sale price
 * - Rental: 5% of annual rent
 */
export function calculateCommission(
  price: number,
  transactionType: 'sale' | 'rental',
  customRate?: number,
): { amount: number; rate: number } {
  const rate = customRate ?? (transactionType === 'sale' ? 2 : 5);
  return { amount: price * (rate / 100), rate };
}

// ─── API Functions ──────────────────────────────────────────────────────

/**
 * Fetch properties with pagination, filtering, and sorting.
 */
export async function fetchProperties(
  params: PropertiesListParams = {},
): Promise<PaginatedResponse<Property>> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.pageSize) query.set('pageSize', String(params.pageSize));
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.type && params.type !== 'all') query.set('type', params.type);
  if (params.listingType) query.set('listingType', params.listingType);
  if (params.minPrice) query.set('minPrice', String(params.minPrice));
  if (params.maxPrice) query.set('maxPrice', String(params.maxPrice));
  if (params.bedrooms) query.set('bedrooms', String(params.bedrooms));
  if (params.city) query.set('city', params.city);
  if (params.community) query.set('community', params.community);
  if (params.search) query.set('search', params.search);
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.sortOrder) query.set('sortOrder', params.sortOrder);

  const url = `/api/properties${query.toString() ? `?${query}` : ''}`;
  log.info('Fetching properties', { url });

  const response = await authFetch(url);
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to fetch properties'));
  }
  return response.json();
}

/**
 * Fetch a single property by ID.
 */
export async function fetchProperty(id: string): Promise<SingleResponse<Property>> {
  const response = await authFetch(`/api/properties/${id}`);
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to fetch property'));
  }
  return response.json();
}

/**
 * Create a new property listing.
 */
export async function createProperty(
  data: Partial<Property>,
): Promise<SingleResponse<Property>> {
  log.info('Creating property', { title: data.title });
  const response = await authFetch('/api/properties', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to create property'));
  }
  return response.json();
}

/**
 * Update an existing property.
 */
export async function updateProperty(
  id: string,
  data: Partial<Property>,
): Promise<SingleResponse<Property>> {
  log.info('Updating property', { id });
  const response = await authFetch(`/api/properties/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to update property'));
  }
  return response.json();
}

/**
 * Delete a property listing.
 */
export async function deleteProperty(
  id: string,
): Promise<{ success: boolean; message: string }> {
  log.info('Deleting property', { id });
  const response = await authFetch(`/api/properties/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to delete property'));
  }
  return response.json();
}

/**
 * Upload media (images/video/floorplan) for a property.
 * Uses FormData — authFetch auto-detects and skips Content-Type header.
 */
export async function uploadPropertyMedia(
  propertyId: string,
  files: File[],
  mediaType: 'image' | 'video' | 'floorplan' = 'image',
): Promise<SingleResponse<{ urls: string[] }>> {
  log.info('Uploading property media', { propertyId, count: files.length, mediaType });
  const formData = new FormData();
  files.forEach((file) => formData.append('media', file));
  formData.append('mediaType', mediaType);

  const response = await authFetch(`/api/properties/${propertyId}/media`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to upload media'));
  }
  return response.json();
}

/**
 * Assign an agent to a property.
 */
export async function assignPropertyAgent(
  propertyId: string,
  agentId: string,
): Promise<SingleResponse<Property>> {
  log.info('Assigning agent to property', { propertyId, agentId });
  const response = await authFetch(`/api/properties/${propertyId}/assign`, {
    method: 'POST',
    body: JSON.stringify({ agentId }),
  });
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to assign agent'));
  }
  return response.json();
}

/**
 * Fetch property statistics.
 */
export async function fetchPropertyStats(): Promise<SingleResponse<PropertyStats>> {
  const response = await authFetch('/api/properties/stats');
  if (!response.ok) {
    throw new Error(await extractApiError(response, 'Failed to fetch property stats'));
  }
  return response.json();
}
