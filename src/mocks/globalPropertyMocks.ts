export interface GlobalPropertyMock {
  id: string;
  title: string;
  community: string;
  priceAED: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: 'Villa' | 'Townhouse' | 'Apartment' | 'Penthouse';
  status: 'Available' | 'Leased' | 'UnderMaintenance' | 'Sold' | 'Pending';
  stockImageCdnUrl: string;
  features: string[];
}

const STOCK_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
];

const COMMUNITIES = [
  'DAMAC Hills 2',
  'Downtown Dubai',
  'Dubai Marina',
  'Palm Jumeirah',
  'Business Bay',
  'Jumeirah Village Circle',
  'Dubai Hills Estate',
  'Arabian Ranches',
  'Dubai Creek Harbour',
  'Bluewaters Island',
];

const PROPERTY_TYPES: Array<'Villa' | 'Townhouse' | 'Apartment' | 'Penthouse'> = [
  'Villa',
  'Townhouse',
  'Apartment',
  'Penthouse',
];

const STATUSES: Array<'Available' | 'Leased' | 'UnderMaintenance' | 'Sold' | 'Pending'> = [
  'Available',
  'Leased',
  'UnderMaintenance',
  'Sold',
  'Pending',
];

// Initial seeded list matching csvMockSeedingPayload exactly
const SEEDED_INITIAL_PROPERTIES: GlobalPropertyMock[] = [
  {
    id: 'wc_dh2_001',
    title: '3BR Luxury Townhouse in Vardon',
    community: 'DAMAC Hills 2',
    priceAED: 1450000,
    beds: 3,
    baths: 3,
    sqft: 2100,
    propertyType: 'Townhouse',
    status: 'Available',
    stockImageCdnUrl: STOCK_IMAGES[0],
    features: ['Private Garden', 'Community Pool', 'Covered Parking', 'Built-in Wardrobes'],
  },
  {
    id: 'wc_dh2_002',
    title: '4BR Standalone Villa in Camelia',
    community: 'DAMAC Hills 2',
    priceAED: 1850000,
    beds: 4,
    baths: 4,
    sqft: 2800,
    propertyType: 'Villa',
    status: 'Available',
    stockImageCdnUrl: STOCK_IMAGES[1],
    features: ['Rooftop Terrace', 'Maids Room', 'Smart Home System', 'Golf Course View'],
  },
  {
    id: 'wc_dt_003',
    title: '2BR Boulevard View Suite',
    community: 'Downtown Dubai',
    priceAED: 3200000,
    beds: 2,
    baths: 3,
    sqft: 1450,
    propertyType: 'Apartment',
    status: 'Leased',
    stockImageCdnUrl: STOCK_IMAGES[2],
    features: ['Burj Khalifa View', 'Balcony', 'Concierge Service', 'Infinity Pool'],
  },
  {
    id: 'wc_dm_004',
    title: '2BR Waterfront Apartment',
    community: 'Dubai Marina',
    priceAED: 2600000,
    beds: 2,
    baths: 2,
    sqft: 1320,
    propertyType: 'Apartment',
    status: 'UnderMaintenance',
    stockImageCdnUrl: STOCK_IMAGES[3],
    features: ['Marina View', 'Gym & Spa', 'Valet Parking', 'High Floor'],
  },
];

// Dynamically generate the remaining 96 properties to complete 100 seeded properties
function generateSeededProperties(): GlobalPropertyMock[] {
  const list: GlobalPropertyMock[] = [...SEEDED_INITIAL_PROPERTIES];

  for (let i = 5; i <= 100; i++) {
    const id = `wc_${String(i).padStart(3, '0')}`;
    const community = COMMUNITIES[i % COMMUNITIES.length];
    const propertyType = PROPERTY_TYPES[i % PROPERTY_TYPES.length];
    const beds = (i % 5) + 1;
    const baths = Math.min(beds, (i % 4) + 1);
    const sqft = 800 + beds * 450 + (i * 35) % 1200;
    
    // Realistic price scaling in AED
    let basePrice = 1200000;
    if (community === 'Palm Jumeirah' || propertyType === 'Penthouse') basePrice = 7500000;
    else if (community === 'Downtown Dubai') basePrice = 3800000;
    else if (community === 'Dubai Marina') basePrice = 2900000;
    else if (community === 'DAMAC Hills 2') basePrice = 1500000;

    const priceAED = basePrice + ((i * 175000) % 4500000);
    const status = STATUSES[i % STATUSES.length];
    const stockImageCdnUrl = STOCK_IMAGES[i % STOCK_IMAGES.length];

    list.push({
      id,
      title: `${beds}BR Luxury ${propertyType} in ${community}`,
      community,
      priceAED,
      beds,
      baths,
      sqft,
      propertyType,
      status,
      stockImageCdnUrl,
      features: [
        'Central A/C',
        'Built-in Kitchen Appliances',
        '24/7 Security',
        i % 2 === 0 ? 'Private Pool' : 'Balcony',
      ],
    });
  }

  return list;
}

export const GLOBAL_PROPERTY_MOCKS: GlobalPropertyMock[] = generateSeededProperties();
