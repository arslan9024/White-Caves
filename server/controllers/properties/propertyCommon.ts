/**
 * propertyCommon.ts
 * Shared constants, interfaces, and validation rules for properties controller.
 */

import { AppError } from '../../middleware/errorHandler.js';

// Cache TTLs (seconds)
export const CACHE_TTL_LIST = 60; // property list: 1 minute
export const CACHE_TTL_DETAIL = 300; // property detail: 5 minutes

/** Shape of a property as returned by findUnique for completeness analysis */
export interface CompletenessProperty {
  id: string;
  title: string;
  description: string | null;
  price: number;
  type: string;
  status: string;
  location: string;
  area: string | null;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];
  amenities: string[];
  buildingPermitNumber: string | null;
  municipalityNumber: string | null;
  userId: string;
}

export interface CompletenessCriterion {
  key: string;
  label: string;
  check: (p: CompletenessProperty) => boolean;
  hint: string;
}

export const COMPLETENESS_CRITERIA: CompletenessCriterion[] = [
  {
    key: 'title',
    label: 'Title',
    check: p => Boolean(p.title?.trim()),
    hint: 'Add a descriptive property title',
  },
  {
    key: 'description',
    label: 'Description',
    check: p => (p.description?.length ?? 0) > 50,
    hint: 'Write a description of at least 50 characters',
  },
  { key: 'price', label: 'Price', check: p => p.price > 0, hint: 'Set a non-zero listing price' },
  {
    key: 'type',
    label: 'Property Type',
    check: p => Boolean(p.type?.trim()),
    hint: 'Specify the property type',
  },
  {
    key: 'status',
    label: 'Status',
    check: p => Boolean(p.status?.trim()),
    hint: 'Set the availability status',
  },
  {
    key: 'location',
    label: 'Location',
    check: p => Boolean(p.location?.trim()),
    hint: 'Add a street/building location',
  },
  {
    key: 'area',
    label: 'Area / Community',
    check: p => Boolean(p.area?.trim()),
    hint: 'Specify the Dubai community or area',
  },
  { key: 'bedrooms', label: 'Bedrooms', check: p => p.bedrooms > 0, hint: 'Add bedroom count' },
  { key: 'bathrooms', label: 'Bathrooms', check: p => p.bathrooms > 0, hint: 'Add bathroom count' },
  {
    key: 'sqft',
    label: 'Square Footage',
    check: p => p.sqft > 0,
    hint: 'Add the property area in sq ft',
  },
  {
    key: 'images',
    label: 'Photos (≥ 3)',
    check: p => p.images.length > 2,
    hint: 'Upload at least 3 property photos',
  },
  {
    key: 'amenities',
    label: 'Amenities',
    check: p => p.amenities.length > 0,
    hint: 'List at least one amenity',
  },
  {
    key: 'buildingPermitNumber',
    label: 'Building Permit',
    check: p => Boolean(p.buildingPermitNumber?.trim()),
    hint: 'Add the DM building permit number',
  },
  {
    key: 'municipalityNumber',
    label: 'Municipality Number',
    check: p => Boolean(p.municipalityNumber?.trim()),
    hint: 'Add the Dubai municipality plot/unit number',
  },
  {
    key: 'contactInfo',
    label: 'Agent Assigned',
    check: p => Boolean(p.userId),
    hint: 'Assign a responsible agent',
  },
];

export function computeCompletenessScore(property: CompletenessProperty): {
  score: number;
  passed: string[];
  failed: { key: string; label: string; hint: string }[];
} {
  const passed: string[] = [];
  const failed: { key: string; label: string; hint: string }[] = [];

  for (const criterion of COMPLETENESS_CRITERIA) {
    if (criterion.check(property)) {
      passed.push(criterion.key);
    } else {
      failed.push({ key: criterion.key, label: criterion.label, hint: criterion.hint });
    }
  }

  const score = Math.round((passed.length / COMPLETENESS_CRITERIA.length) * 100);
  return { score, passed, failed };
}

export function assertAvailabilityCompliance(params: {
  currentStatus: string | null | undefined;
  nextStatus: string | null | undefined;
  nextMunicipalityNumber: string | null | undefined;
  nextBuildingPermitNumber: string | null | undefined;
}): void {
  const { currentStatus, nextStatus, nextMunicipalityNumber, nextBuildingPermitNumber } = params;

  const movingToAvailable = nextStatus === 'available' && currentStatus !== 'available';
  if (!movingToAvailable) {
    return;
  }

  if (!nextMunicipalityNumber?.trim() || !nextBuildingPermitNumber?.trim()) {
    throw new AppError(
      'RERA compliance: municipalityNumber and buildingPermitNumber are required before setting status to available',
      400
    );
  }
}
