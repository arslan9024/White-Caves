/**
 * FloatingHeroSearchPill.data.ts — Content & Data Variables
 */

export const SEARCH_TABS = [
  { id: 'all', label: 'All Inventory' },
  { id: 'primary', label: 'Primary Off-Plan' },
  { id: 'secondary', label: 'Secondary Villas' },
  { id: 'commercial', label: 'Commercial' },
];

export const PROPERTY_TYPES = [
  { id: 'all', label: 'All Types' },
  { id: 'villa', label: 'Luxury Villa' },
  { id: 'penthouse', label: 'Sky Penthouse' },
  { id: 'apartment', label: 'Waterfront Apartment' },
  { id: 'townhouse', label: 'Townhouse' },
];

export const PRICE_RANGES = [
  { id: 'any', label: 'Any Budget' },
  { id: '1m-3m', label: 'AED 1M – 3M' },
  { id: '3m-7m', label: 'AED 3M – 7M' },
  { id: '7m-15m', label: 'AED 7M – 15M' },
  { id: '15m+', label: 'AED 15M+ Ultra Prime' },
];

export const SEARCH_PILL_TEXT = {
  locationLabel: 'Location or Community',
  locationPlaceholder: 'e.g. Palm Jumeirah, DAMAC Hills 2, Downtown...',
  typeLabel: 'Property Type',
  budgetLabel: 'Budget Range',
  searchButton: 'Search',
  quickSuggestion: 'Popular: DAMAC Hills 2 (85 Live Villas) · Palm Jumeirah (42 Mansions)',
};
