/**
 * Dubai Real Estate — Sample Property & Area Data
 *
 * Extracted from DubaiMap component for reusability across
 * components (map, search, property listings, analytics).
 */

// ─── Types ────────────────────────────────────────────────────────────────

export interface DubaiProperty {
  id: number;
  title: string;
  area: string;
  price: number;
  beds: number;
  type: 'luxury' | 'residential' | 'commercial';
  image: string;
}

export interface DubaiArea {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'luxury' | 'residential' | 'commercial';
}

// ─── Dubai Areas ──────────────────────────────────────────────────────────

export const DUBAI_AREAS: DubaiArea[] = [
  { id: 'palm', name: 'Palm Jumeirah', lat: 25.1124, lng: 55.139, type: 'luxury' },
  { id: 'downtown', name: 'Downtown Dubai', lat: 25.1972, lng: 55.2744, type: 'luxury' },
  { id: 'marina', name: 'Dubai Marina', lat: 25.0805, lng: 55.1403, type: 'residential' },
  { id: 'business-bay', name: 'Business Bay', lat: 25.185, lng: 55.2642, type: 'commercial' },
  { id: 'jvc', name: 'Jumeirah Village Circle', lat: 25.0552, lng: 55.21, type: 'residential' },
  { id: 'hills', name: 'Dubai Hills', lat: 25.12, lng: 55.22, type: 'residential' },
  { id: 'creek', name: 'Dubai Creek Harbour', lat: 25.2, lng: 55.33, type: 'luxury' },
  { id: 'emirates', name: 'Emirates Hills', lat: 25.0657, lng: 55.1489, type: 'luxury' },
  { id: 'jbr', name: 'JBR', lat: 25.0784, lng: 55.1337, type: 'residential' },
  { id: 'mbr', name: 'MBR City', lat: 25.17, lng: 55.31, type: 'luxury' },
];

// ─── Sample Properties (Demo / Fallback Data) ────────────────────────────

export const SAMPLE_DUBAI_PROPERTIES: DubaiProperty[] = [
  {
    id: 1,
    title: 'Luxury Villa',
    area: 'palm',
    price: 15_000_000,
    beds: 5,
    type: 'luxury',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
  },
  {
    id: 2,
    title: 'Penthouse Suite',
    area: 'downtown',
    price: 12_000_000,
    beds: 4,
    type: 'luxury',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
  },
  {
    id: 3,
    title: 'Marina Apartment',
    area: 'marina',
    price: 2_500_000,
    beds: 2,
    type: 'residential',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
  },
  {
    id: 4,
    title: 'Office Tower',
    area: 'business-bay',
    price: 8_000_000,
    beds: 0,
    type: 'commercial',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
  },
  {
    id: 5,
    title: 'Family Villa',
    area: 'hills',
    price: 5_500_000,
    beds: 4,
    type: 'residential',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
  },
  {
    id: 6,
    title: 'Beachfront Villa',
    area: 'palm',
    price: 45_000_000,
    beds: 6,
    type: 'luxury',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400',
  },
];

// ─── Map marker colors ────────────────────────────────────────────────────

const AREA_TYPE_COLORS: Record<string, string> = {
  luxury: '#C9A84C',
  commercial: '#10B981',
  residential: '#10B981',
  default: '#C9A84C',
};

export const getMarkerColor = (type: string): string => {
  return AREA_TYPE_COLORS[type] || AREA_TYPE_COLORS.default;
};
