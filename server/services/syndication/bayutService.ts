/**
 * Bayut JSON Feed Generator & Cloudinary Image Optimizer
 * Wave 25 (W25-002, W25-003) - White Caves Real Estate LLC
 */

import { SyndicationProperty, validateTrakheesiPermit } from './propertyFinderService';

export interface BayutSyncLogEntry {
  timestamp: string;
  portal: 'BAYUT';
  totalScanned: number;
  syncedCount: number;
  failedCount: number;
  skippedCount: number;
  details: Array<{ id: string; reference: string; status: 'SYNCED' | 'FAILED' | 'SKIPPED'; reason?: string }>;
}

export function optimizeCloudinaryUrl(url: string, width = 1200, height = 800): string {
  if (!url) return url;
  if (url.includes('res.cloudinary.com')) {
    // Inject auto-format, auto-quality, and max size constraints
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/f_auto,q_auto,c_limit,w_${width},h_${height}/${parts[1]}`;
    }
  }
  return url;
}

export function generateBayutJsonFeed(properties: SyndicationProperty[]): {
  feed: object;
  syncLog: BayutSyncLogEntry;
} {
  const details: BayutSyncLogEntry['details'] = [];
  const validItems: Record<string, unknown>[] = [];

  let syncedCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  for (const prop of properties) {
    // 1. Required fields check
    if (!prop.id || !prop.reference || !prop.title || !prop.price || !prop.location) {
      skippedCount++;
      details.push({
        id: prop.id || 'unknown',
        reference: prop.reference || 'unknown',
        status: 'SKIPPED',
        reason: 'Missing required schema fields (id/title/price/location)',
      });
      continue;
    }

    // 2. Trakheesi permit check
    const permitVal = validateTrakheesiPermit(prop.permit);
    if (!permitVal.isValid) {
      failedCount++;
      details.push({
        id: prop.id,
        reference: prop.reference,
        status: 'FAILED',
        reason: permitVal.reason,
      });
      continue;
    }

    // 3. Image optimization
    const optimizedImages = (prop.images || []).map((imgUrl) => optimizeCloudinaryUrl(imgUrl));

    syncedCount++;
    details.push({
      id: prop.id,
      reference: prop.reference,
      status: 'SYNCED',
    });

    validItems.push({
      reference: prop.reference,
      permit_number: prop.permit?.permitNumber,
      purpose: prop.offeringType === 'SALE' ? 'for-sale' : 'for-rent',
      type: prop.propertyType.toLowerCase(),
      price: prop.price,
      currency: prop.currency || 'AED',
      beds: prop.bedrooms,
      baths: prop.bathrooms,
      size: prop.sizeSqFt,
      title: prop.title,
      title_ar: prop.titleAr || null,
      description: prop.description,
      location: {
        city: prop.location.city,
        community: prop.location.community,
        sub_community: prop.location.subCommunity || null,
        building: prop.location.building || null,
      },
      images: optimizedImages,
      amenities: prop.features || [],
      updated_at: prop.updatedAt || new Date().toISOString(),
    });
  }

  const syncLog: BayutSyncLogEntry = {
    timestamp: new Date().toISOString(),
    portal: 'BAYUT',
    totalScanned: properties.length,
    syncedCount,
    failedCount,
    skippedCount,
    details,
  };

  return {
    feed: {
      agency: 'White Caves Real Estate LLC',
      generated_at: new Date().toISOString(),
      total_count: validItems.length,
      properties: validItems,
    },
    syncLog,
  };
}
