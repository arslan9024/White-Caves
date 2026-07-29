/**
 * dubaiSearchConstants.ts — Shared Dubai property search filter constants
 * Used by FloatingSearchPill, PropertyFilterPanel, and other search-related components.
 * Previously co-located in HeroSearchBar.tsx; extracted for deduplication (AEGIS 2.0).
 */

/* ─── Dubai Communities ─────────────────────────────────────────────── */
export const DUBAI_LOCATIONS = [
  'All Locations',
  'Palm Jumeirah',
  'Downtown Dubai',
  'Dubai Marina',
  'Business Bay',
  'JBR',
  'DIFC',
  'Emirates Hills',
  'Jumeirah Village Circle',
  'Dubai Hills Estate',
  'Arabian Ranches',
  'Jumeirah Lake Towers',
  'Al Barsha',
  'Damac Hills',
  'Dubai Creek Harbour',
  'MBR City',
] as const;

/* ─── Property Types ────────────────────────────────────────────────── */
export const PROPERTY_TYPES = [
  'All Types',
  'Apartment',
  'Villa',
  'Townhouse',
  'Penthouse',
  'Studio',
  'Office',
  'Land',
] as const;

/* ─── Bedrooms ──────────────────────────────────────────────────────── */
export const BED_OPTIONS = [
  { label: 'Any Beds', value: 0 },
  { label: 'Studio', value: 0.5 },
  { label: '1 Bed', value: 1 },
  { label: '2 Beds', value: 2 },
  { label: '3 Beds', value: 3 },
  { label: '4 Beds', value: 4 },
  { label: '5+ Beds', value: 5 },
] as const;

/* ─── Price Ranges (AED) ────────────────────────────────────────────── */
export const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: 100_000_000 },
  { label: 'Under 1M', min: 0, max: 1_000_000 },
  { label: '1M – 3M', min: 1_000_000, max: 3_000_000 },
  { label: '3M – 5M', min: 3_000_000, max: 5_000_000 },
  { label: '5M – 10M', min: 5_000_000, max: 10_000_000 },
  { label: '10M – 25M', min: 10_000_000, max: 25_000_000 },
  { label: '25M – 50M', min: 25_000_000, max: 50_000_000 },
  { label: '50M+', min: 50_000_000, max: 100_000_000 },
] as const;
