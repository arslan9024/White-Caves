/**
 * Agent Data Generator — 20+ realistic Dubai real-estate agents
 * Matches DUMMY_AGENTS shape from dummyLeads.ts.
 */

import { createRng } from './rng';

// ─── Constants ────────────────────────────────────────────────

export const AGENT_DEPARTMENTS = [
  'Sales',
  'Leasing',
  'Operations',
  'Finance',
  'Marketing',
  'Customer Relations',
  'Property Management',
] as const;

const FIRST_NAMES = [
  'Ahmed',
  'Fatima',
  'Omar',
  'Sara',
  'Khalid',
  'Noor',
  'Youssef',
  'Layla',
  'Mohammed',
  'Aisha',
  'Hassan',
  'Mariam',
  'Ali',
  'Huda',
  'Rashed',
  'Dina',
  'Ibrahim',
  'Samira',
  'Tariq',
  'Lina',
  'Saif',
  'Jasmine',
  'Zayd',
  'Rania',
  'Faisal',
  'Amira',
  'Hamdan',
  'Salma',
  'Bilal',
  'Ghada',
];

const LAST_NAMES = [
  'Al Maktoum',
  'Al Rashid',
  'Al Nahyan',
  'Al Habtoor',
  'Al Ghurair',
  'Al Falasi',
  'Al Mansouri',
  'Al Suwaidi',
  'Al Mheiri',
  'Al Shamsi',
  'Al Ketbi',
  'Al Zaabi',
  'Al Mazrouei',
  'Al Dhaheri',
  'Al Nuaimi',
  'Kapoor',
  'Sharma',
  'Patel',
  'Khan',
  'Malik',
  'Johnson',
  'Williams',
  'Davies',
  'Mitchell',
  'Thompson',
];

const AVATAR_COLORS = [
  '#E31E24',
  '#2E5A4F',
  '#E67E22',
  '#3498DB',
  '#9B59B6',
  '#1ABC9C',
  '#E74C3C',
  '#F39C12',
  '#2ECC71',
  '#34495E',
];

const SPECIALTIES = [
  'Luxury Villas',
  'Off-Plan Projects',
  'Commercial Spaces',
  'Waterfront Properties',
  'Investment Portfolios',
  'Short-Term Rentals',
  'New Developments',
  'Relocation Services',
  'High-Net-Worth Clients',
  'Resort Living',
  'Ready Properties',
  'Distressed Sales',
];

const LANGUAGES = [
  'English',
  'Arabic',
  'Hindi',
  'Urdu',
  'French',
  'Mandarin',
  'Russian',
  'Spanish',
  'Portuguese',
  'German',
  'Turkish',
];

// ─── Generator ────────────────────────────────────────────────

export interface GeneratedAgent {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar: string;
  avatar_color: string;
  email: string;
  phone: string;
  department: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  role: string;
  sales: number;
  roi: number;
  performance: number;
  rating: number;
  leads_assigned: number;
  deals_closed: number;
  deals_in_progress: number;
  revenue_generated: number;
  specialty: string;
  languages: string[];
  bio: string;
  joinedDate: string;
  lastActive: string;
}

export function generateAgents(count = 20, seed = 99): GeneratedAgent[] {
  const rng = createRng(seed);
  const agents: GeneratedAgent[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    // Ensure unique names
    let firstName: string;
    let lastName: string;
    let fullName: string;
    do {
      firstName = rng.pick(FIRST_NAMES);
      lastName = rng.pick(LAST_NAMES);
      fullName = `${firstName} ${lastName}`;
    } while (usedNames.has(fullName));
    usedNames.add(fullName);

    const department = rng.pick(AGENT_DEPARTMENTS);
    const emailSlug = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}`;
    const dealsC = rng.int(5, 120);
    const dealsIP = rng.int(1, 15);
    const revPerDeal = rng.int(80_000, 600_000);
    const revenue = dealsC * revPerDeal;

    const status: GeneratedAgent['status'] = rng.pick([
      'online',
      'online',
      'online',
      'offline',
      'busy',
      'away',
    ]);

    const roles: Record<string, string[]> = {
      Sales: ['Senior Sales Agent', 'Sales Director', 'Sales Consultant', 'Junior Sales Agent'],
      Leasing: ['Leasing Manager', 'Leasing Consultant', 'Senior Leasing Agent'],
      Operations: ['Operations Manager', 'Operations Coordinator', 'Property Coordinator'],
      Finance: ['Finance Analyst', 'Revenue Manager'],
      Marketing: ['Marketing Lead', 'Digital Marketing Specialist'],
      'Customer Relations': ['Client Relations Manager', 'Client Success Lead'],
      'Property Management': ['Property Manager', 'Asset Manager', 'Facilities Coordinator'],
    };

    // Joined date: 1-5 years ago
    const yearsAgo = rng.int(1, 5);
    const daysOffset = rng.int(0, 365);
    const joinedDate = new Date(Date.now() - (yearsAgo * 365 + daysOffset) * 86400000)
      .toISOString()
      .split('T')[0];

    // Last active: 0-7 days ago
    const lastActiveDays = status === 'online' ? 0 : rng.int(0, 7);
    const lastActive = new Date(Date.now() - lastActiveDays * 86400000).toISOString();

    agents.push({
      id: `agent-${String(i + 1).padStart(2, '0')}`,
      name: fullName,
      firstName,
      lastName,
      avatar: `https://i.pravatar.cc/150?u=${emailSlug}`,
      avatar_color: rng.pick(AVATAR_COLORS),
      email: `${emailSlug}@whitecaves.ae`,
      phone: `+971 ${rng.int(50, 58)} ${rng.int(100, 999)} ${rng.int(1000, 9999)}`,
      department,
      status,
      // eslint-disable-next-line security/detect-object-injection
      role: rng.pick(roles[department] ?? ['Agent']),
      sales: rng.int(500_000, 25_000_000),
      roi: parseFloat((rng.int(50, 350) / 10).toFixed(1)),
      performance: rng.int(60, 100),
      rating: parseFloat((rng.int(35, 50) / 10).toFixed(1)),
      leads_assigned: rng.int(10, 80),
      deals_closed: dealsC,
      deals_in_progress: dealsIP,
      revenue_generated: revenue,
      specialty: rng.pick(SPECIALTIES),
      languages: rng.pickN([...LANGUAGES], rng.int(2, 4)),
      bio: `${firstName} is a seasoned real-estate professional specializing in Dubai's most exclusive properties. With ${yearsAgo}+ years at White Caves, ${firstName} has closed over ${dealsC} deals.`,
      joinedDate,
      lastActive,
    });
  }

  return agents;
}
