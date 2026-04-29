/**
 * Property Data Generator — 50+ realistic Dubai properties
 * Covers all major communities with AED pricing, specs, and images.
 */

import { createRng, type Rng } from './rng';

// ─── Constants ────────────────────────────────────────────────

export const DUBAI_COMMUNITIES = [
  'Palm Jumeirah', 'Downtown Dubai', 'Dubai Marina', 'Business Bay',
  'JBR', 'DIFC', 'Emirates Hills', 'Jumeirah Village Circle',
  'Dubai Hills Estate', 'Arabian Ranches', 'JLT', 'Al Barsha',
  'Damac Hills', 'Dubai Creek Harbour', 'MBR City', 'City Walk',
  'Bluewaters Island', 'Dubai South', 'Motor City', 'Silicon Oasis',
] as const;

export const PROPERTY_TYPES = [
  'Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Studio',
  'Duplex', 'Loft', 'Mansion',
] as const;

export const AMENITIES = [
  'Pool', 'Gym', 'Parking', 'Balcony', 'Sea View', 'Concierge',
  'Security', 'Spa', 'Sauna', 'Rooftop Terrace', 'Private Beach',
  'Kids Play Area', 'BBQ Area', 'Tennis Court', 'Squash Court',
  'Pet Friendly', 'Smart Home', 'Maid Room', 'Walk-in Closet',
  'Home Office', 'Jacuzzi', 'Garden', 'Marina View', 'Burj View',
] as const;

const PROPERTY_TITLES: Record<string, readonly string[]> = {
  Apartment: [
    'Luxury Waterfront Residence', 'Modern City Apartment', 'Premium High-Rise Suite',
    'Contemporary Urban Living', 'Skyline Tower Residence', 'Harbour Lights Apartment',
    'Boulevard View Flat', 'Crystal Tower Unit', 'Panorama Heights Residence',
  ],
  Villa: [
    'Grand Palm Villa', 'Luxury Garden Estate', 'Mediterranean Masterpiece',
    'Executive Family Villa', 'Beachfront Paradise Villa', 'Contemporary Villa',
    'Royal Hills Estate', 'Lagoon View Villa', 'Desert Oasis Retreat',
  ],
  Townhouse: [
    'Modern Family Townhouse', 'Garden View Townhome', 'Contemporary Row House',
    'Terrace Living Townhouse', 'Park Side Townhome', 'Village Walk Townhouse',
  ],
  Penthouse: [
    'Sky Palace Penthouse', 'Panoramic Duplex Penthouse', 'Ultra-Luxury Crown Suite',
    'Cloud Nine Penthouse', 'Presidential Sky Residence', 'Rooftop Penthouse Estate',
  ],
  Studio: [
    'Compact Studio Retreat', 'Urban Studio Suite', 'Marina Studio Living',
    'Smart Studio Apartment', 'City View Studio', 'Premium Studio Space',
  ],
  Duplex: [
    'Spacious Duplex Living', 'Dual-Level Designer Home', 'Premium Duplex Residence',
  ],
  Loft: [
    'Industrial Chic Loft', 'Double-Height Designer Loft', 'Creative Living Loft',
  ],
  Mansion: [
    'Royal Frond Mansion', 'The Great Gatsby Estate', 'Signature Mega Mansion',
  ],
};

const UNSPLASH_PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
];

const DESCRIPTIONS = [
  'Experience luxurious living in this stunning property featuring premium finishes and breathtaking views of the Dubai skyline.',
  'Perfectly positioned in one of Dubai\'s most sought-after communities, this residence offers an unparalleled lifestyle.',
  'A rare opportunity to own a meticulously designed property with world-class amenities and stunning architecture.',
  'This exceptional home combines modern design with spacious living areas, offering the very best of Dubai living.',
  'Welcome to your dream home — featuring floor-to-ceiling windows, designer interiors, and resort-style amenities.',
  'An architectural masterpiece offering panoramic views, smart home technology, and exclusive community facilities.',
];

// ─── Price ranges per type/community ──────────────────────────

function getPriceRange(type: string, community: string): [number, number] {
  const luxury = ['Palm Jumeirah', 'Emirates Hills', 'Bluewaters Island', 'DIFC', 'Downtown Dubai'];
  const mid = ['Dubai Marina', 'Business Bay', 'JBR', 'Dubai Hills Estate', 'City Walk', 'Dubai Creek Harbour', 'MBR City'];
  const isLuxury = luxury.includes(community);
  const isMid = mid.includes(community);

  switch (type) {
    case 'Mansion':  return isLuxury ? [30_000_000, 120_000_000] : [15_000_000, 50_000_000];
    case 'Penthouse': return isLuxury ? [8_000_000, 45_000_000] : isMid ? [4_000_000, 15_000_000] : [2_500_000, 8_000_000];
    case 'Villa':     return isLuxury ? [5_000_000, 35_000_000] : isMid ? [3_000_000, 12_000_000] : [1_500_000, 6_000_000];
    case 'Duplex':    return isLuxury ? [4_000_000, 18_000_000] : isMid ? [2_000_000, 8_000_000] : [1_200_000, 4_000_000];
    case 'Townhouse': return isLuxury ? [3_000_000, 10_000_000] : isMid ? [1_500_000, 5_000_000] : [900_000, 3_000_000];
    case 'Apartment': return isLuxury ? [2_000_000, 12_000_000] : isMid ? [1_000_000, 5_000_000] : [500_000, 2_500_000];
    case 'Loft':      return isMid ? [1_200_000, 4_000_000] : [700_000, 2_000_000];
    case 'Studio':    return isLuxury ? [800_000, 3_000_000] : isMid ? [400_000, 1_200_000] : [250_000, 800_000];
    default:          return [500_000, 3_000_000];
  }
}

function getSpecsRange(type: string): { beds: [number, number]; baths: [number, number]; sqft: [number, number] } {
  switch (type) {
    case 'Mansion':   return { beds: [5, 10], baths: [6, 14], sqft: [8000, 25000] };
    case 'Penthouse': return { beds: [3, 6],  baths: [3, 8],  sqft: [3000, 12000] };
    case 'Villa':     return { beds: [3, 7],  baths: [3, 8],  sqft: [2500, 10000] };
    case 'Duplex':    return { beds: [2, 5],  baths: [2, 5],  sqft: [1800, 5000] };
    case 'Townhouse': return { beds: [2, 5],  baths: [2, 4],  sqft: [1500, 4000] };
    case 'Apartment': return { beds: [1, 4],  baths: [1, 3],  sqft: [600, 3000] };
    case 'Loft':      return { beds: [1, 2],  baths: [1, 2],  sqft: [800, 2000] };
    case 'Studio':    return { beds: [0, 0],  baths: [1, 1],  sqft: [350, 800] };
    default:          return { beds: [1, 3],  baths: [1, 2],  sqft: [500, 2000] };
  }
}

// ─── Generator ────────────────────────────────────────────────

export interface GeneratedProperty {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  purpose: 'buy' | 'rent';
  price: number;
  priceFormatted: string;
  beds: number;
  baths: number;
  sqft: number;
  amenities: string[];
  images: string[];
  image: string;
  featured: boolean;
  yearBuilt: number;
  status: 'available' | 'sold' | 'rented' | 'pending';
  agent: string;
  views: number;
  inquiries: number;
  listedDate: string;
}

export function generateProperties(count = 50, seed = 42): GeneratedProperty[] {
  const rng = createRng(seed);
  const properties: GeneratedProperty[] = [];

  for (let i = 0; i < count; i++) {
    const type = rng.pick(PROPERTY_TYPES);
    const community = rng.pick(DUBAI_COMMUNITIES);
    const titles = PROPERTY_TITLES[type] || PROPERTY_TITLES['Apartment'];
    const [minPrice, maxPrice] = getPriceRange(type, community);
    const specs = getSpecsRange(type);
    const purpose = rng.chance(0.75) ? 'buy' as const : 'rent' as const;
    
    let price = rng.int(minPrice, maxPrice);
    // Round to nearest 10,000
    price = Math.round(price / 10_000) * 10_000;
    
    // For rent, convert to annual rent (~5-8% of sale price)
    if (purpose === 'rent') {
      price = Math.round((price * rng.int(5, 8)) / 100 / 1000) * 1000;
    }

    const beds = rng.int(specs.beds[0], specs.beds[1]);
    const baths = rng.int(specs.baths[0], specs.baths[1]);
    const sqft = rng.int(specs.sqft[0], specs.sqft[1]);
    const amenityCount = rng.int(3, 8);
    const imageCount = rng.int(3, 6);
    const images = rng.pickN(UNSPLASH_PROPERTY_IMAGES, imageCount);
    const yearBuilt = rng.int(2015, 2026);
    const featured = rng.chance(0.2);
    const status: GeneratedProperty['status'] = rng.pick(['available', 'available', 'available', 'sold', 'rented', 'pending']);

    // Listed date: random date in past 180 days
    const daysAgo = rng.int(1, 180);
    const listedDate = new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0];

    properties.push({
      id: `prop-${String(i + 1).padStart(3, '0')}`,
      title: rng.pick(titles),
      description: rng.pick(DESCRIPTIONS),
      location: community,
      type,
      purpose,
      price,
      priceFormatted: `AED ${price.toLocaleString('en-US')}${purpose === 'rent' ? '/yr' : ''}`,
      beds,
      baths,
      sqft,
      amenities: rng.pickN([...AMENITIES], amenityCount),
      images,
      image: images[0],
      featured,
      yearBuilt,
      status,
      agent: `agent-${String(rng.int(1, 20)).padStart(2, '0')}`,
      views: rng.int(50, 5000),
      inquiries: rng.int(0, 50),
      listedDate,
    });
  }

  return properties;
}
