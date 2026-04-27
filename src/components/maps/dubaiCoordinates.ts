/**
 * Dubai Community Coordinates
 * Real lat/lng centers for 16 major Dubai communities.
 * Used by DubaiMap to position property markers and community overlays.
 */

export interface CommunityCoords {
  name: string;
  lat: number;
  lng: number;
  /** Approximate radius in meters for cluster/boundary rendering */
  radius: number;
  /** Short description shown in community tooltips */
  description: string;
}

/** Dubai city center — default map position */
export const DUBAI_CENTER: [number, number] = [25.2048, 55.2708];
export const DEFAULT_ZOOM = 11;

export const COMMUNITY_COORDS: CommunityCoords[] = [
  { name: 'Palm Jumeirah',          lat: 25.1124, lng: 55.1390, radius: 2200, description: 'Iconic palm-shaped island with luxury villas & hotels' },
  { name: 'Downtown Dubai',         lat: 25.1972, lng: 55.2744, radius: 1200, description: 'Home of Burj Khalifa & Dubai Mall' },
  { name: 'Dubai Marina',           lat: 25.0804, lng: 55.1403, radius: 1400, description: 'Waterfront high-rise living with marina promenade' },
  { name: 'Business Bay',           lat: 25.1860, lng: 55.2648, radius: 1500, description: 'Central business district with canal views' },
  { name: 'JBR',                    lat: 25.0792, lng: 55.1325, radius: 800,  description: 'Jumeirah Beach Residence — beachfront apartments' },
  { name: 'DIFC',                   lat: 25.2100, lng: 55.2790, radius: 600,  description: 'Dubai International Financial Centre' },
  { name: 'Emirates Hills',         lat: 25.0722, lng: 55.1680, radius: 1800, description: 'Ultra-luxury gated community with golf course' },
  { name: 'Jumeirah Village Circle', lat: 25.0655, lng: 55.2094, radius: 2000, description: 'Affordable family community with parks' },
  { name: 'Dubai Hills Estate',     lat: 25.1039, lng: 55.2381, radius: 2500, description: 'Premium community with championship golf course' },
  { name: 'Arabian Ranches',        lat: 25.0572, lng: 55.2651, radius: 2200, description: 'Desert-themed luxury villa community' },
  { name: 'Jumeirah Lake Towers',   lat: 25.0750, lng: 55.1500, radius: 1200, description: 'Lakeside cluster towers near Dubai Marina' },
  { name: 'Al Barsha',              lat: 25.1130, lng: 55.2010, radius: 1500, description: 'Central residential area near Mall of the Emirates' },
  { name: 'Damac Hills',            lat: 25.0340, lng: 55.2310, radius: 2000, description: 'Luxury community with Trump International Golf Club' },
  { name: 'Dubai Creek Harbour',    lat: 25.2050, lng: 55.3430, radius: 1600, description: 'Waterfront mega-project at historic Dubai Creek' },
  { name: 'MBR City',               lat: 25.1650, lng: 55.3050, radius: 3000, description: 'Mohammed Bin Rashid City — new luxury destination' },
];

/**
 * Look up coordinates for a location name.  
 * Falls back to DUBAI_CENTER if location not found.
 */
export function getCommunityCoords(locationName: string): CommunityCoords | undefined {
  return COMMUNITY_COORDS.find(
    (c) => c.name.toLowerCase() === locationName.toLowerCase()
  );
}

/**
 * Add slight random offset to avoid marker overlap for
 * multiple properties at the same community center.
 */
export function jitterCoords(lat: number, lng: number, index: number): [number, number] {
  const angle = (index * 137.5) * (Math.PI / 180); // golden angle for even distribution
  const r = 0.003 + (index % 5) * 0.001; // ~300-800m spread
  return [
    lat + r * Math.cos(angle),
    lng + r * Math.sin(angle),
  ];
}
