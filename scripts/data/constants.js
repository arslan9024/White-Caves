export const DUBAI_COMMUNITIES = [
  'Palm Jumeirah',
  'Downtown Dubai',
  'Dubai Marina',
  'Emirates Hills',
  'DAMAC Hills',
  'DAMAC Hills 2',
  'Jumeirah Village Circle',
  'Business Bay',
  'Al Barsha',
  'Jumeirah Beach Residence',
  'Dubai Hills Estate',
  'Arabian Ranches',
  'The Springs',
  'The Meadows',
  'Jumeirah Golf Estates',
  'Motor City',
  'Sports City',
  'Dubai Silicon Oasis',
  'Al Furjan',
  'Town Square'
];

export const DAMAC_HILLS_2_CLUSTERS = [
  'Amazonia',
  'Akoya Oxygen',
  'Centaury',
  'Claret',
  'Dahlia',
  'Edelweiss',
  'Fern',
  'Gerbera',
  'Hazel',
  'Ivy',
  'Jasmine',
  'Zinnia',
  'Mulberry',
  'Orchid',
  'Primrose',
  'Queenland',
  'Reem',
  'Sundream'
];

export const PROPERTY_TYPES = [
  { type: 'studio', minPrice: 300000, maxPrice: 800000 },
  { type: 'apartment', minPrice: 800000, maxPrice: 3000000 },
  { type: 'townhouse', minPrice: 1500000, maxPrice: 5000000 },
  { type: 'villa', minPrice: 2000000, maxPrice: 15000000 },
  { type: 'penthouse', minPrice: 5000000, maxPrice: 50000000 },
  { type: 'duplex', minPrice: 2500000, maxPrice: 8000000 },
  { type: 'plot', minPrice: 1000000, maxPrice: 20000000 }
];

export const PROPERTY_STATUSES = ['available', 'rented', 'sold', 'reserved', 'off_market'];

export const PROPERTY_PURPOSES = ['sale', 'rent', 'both'];

export const VIEW_TYPES = [
  'Sea View',
  'Golf View',
  'Garden View',
  'Pool View',
  'City View',
  'Marina View',
  'Park View',
  'Community View',
  'Lake View',
  'Desert View'
];

export const AMENITIES = [
  'Swimming Pool',
  'Gym',
  'Concierge',
  'Parking',
  'Balcony',
  'Private Garden',
  'Maid Room',
  'Study Room',
  'Walk-in Closet',
  'Smart Home System',
  'Private Pool',
  'Jacuzzi',
  'BBQ Area',
  'Kids Play Area',
  'Tennis Court',
  'Golf Course Access',
  'Beach Access',
  'Central AC',
  'Security 24/7',
  'CCTV'
];

export const AGENT_FIRST_NAMES = [
  'Ahmed', 'Mohammed', 'Khalid', 'Omar', 'Youssef',
  'Sara', 'Fatima', 'Mariam', 'Aisha', 'Layla',
  'Hassan', 'Ali', 'Rashid', 'Salem', 'Majed',
  'Noor', 'Hana', 'Dina', 'Rania', 'Maha'
];

export const AGENT_LAST_NAMES = [
  'Al Maktoum', 'Al Nahyan', 'Al Rashid', 'Al Falasi', 'Al Mazrouei',
  'Khan', 'Ahmad', 'Hassan', 'Ibrahim', 'Mahmoud',
  'Sharma', 'Patel', 'Singh', 'Gupta', 'Kapoor'
];

export const OWNER_FIRST_NAMES = [
  'Abdullah', 'Hamdan', 'Sultan', 'Mansour', 'Saeed',
  'Amina', 'Sheikha', 'Moza', 'Hessa', 'Shamsa',
  'James', 'William', 'Michael', 'David', 'Robert',
  'Emma', 'Sophia', 'Isabella', 'Olivia', 'Victoria'
];

export const OWNER_LAST_NAMES = [
  'Al Qassimi', 'Al Sharqi', 'Al Nuaimi', 'Al Mualla', 'Al Thani',
  'Johnson', 'Williams', 'Brown', 'Taylor', 'Anderson',
  'Kumar', 'Reddy', 'Rao', 'Nair', 'Menon'
];

export const NATIONALITIES = [
  'UAE', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Bahrain', 'Oman',
  'India', 'Pakistan', 'Bangladesh', 'Philippines',
  'UK', 'USA', 'Canada', 'Australia', 'Germany', 'France',
  'Russia', 'China', 'Iran', 'Egypt', 'Lebanon', 'Jordan'
];

export const LEAD_SOURCES = [
  'website',
  'whatsapp',
  'referral',
  'walk-in',
  'social-media',
  'property-finder',
  'bayut',
  'dubizzle'
];

export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'negotiating', 'converted', 'lost'];

export const LEAD_STAGES = [
  'inquiry',
  'viewing-scheduled',
  'viewing-completed',
  'offer-made',
  'negotiation',
  'documentation',
  'closed'
];

export const INTERACTION_TYPES = ['call', 'email', 'whatsapp', 'meeting', 'viewing', 'note'];

export const COMPANY_NAMES = [
  'White Caves Real Estate LLC',
  'Dubai Luxury Properties',
  'Emirates Prime Realty',
  'Golden Sands Properties',
  'Palm Real Estate Group',
  'Marina Vista Properties',
  'Desert Rose Realty',
  'Gulf Coast Properties',
  'Skyline Dubai Real Estate',
  'Oasis Property Management'
];

export const TAGS = [
  'VIP',
  'Investor',
  'First-time Buyer',
  'Relocating',
  'Corporate',
  'Family',
  'Urgent',
  'Cash Buyer',
  'Mortgage Required',
  'Furnished Only',
  'Sea View Required',
  'Pet Friendly'
];

export const UAE_AREA_CODES = ['+971 50', '+971 52', '+971 54', '+971 55', '+971 56', '+971 58'];

export function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomElements(arr, min = 1, max = 3) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
}

export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomPrice(min, max) {
  const price = Math.floor(Math.random() * (max - min + 1)) + min;
  return Math.round(price / 1000) * 1000;
}

export function generateUAEPhone() {
  const areaCode = randomElement(UAE_AREA_CODES);
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `${areaCode} ${number}`;
}

export function generateEmail(firstName, lastName) {
  const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'icloud.com'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}@${randomElement(domains)}`;
}

export function generatePNumber() {
  const prefix = randomElement(['P', 'DH', 'DM', 'JVC', 'BB']);
  const number = randomBetween(1000, 99999);
  return `${prefix}-${number}`;
}

export function generateReraNumber() {
  return `RN-${randomBetween(100000, 999999)}`;
}

export function generateEmiratesId() {
  const year = randomBetween(1970, 2000);
  const sequence = randomBetween(1000000, 9999999);
  return `784-${year}-${sequence}-1`;
}

export function generateDate(daysAgo = 365) {
  const date = new Date();
  date.setDate(date.getDate() - randomBetween(0, daysAgo));
  return date;
}
