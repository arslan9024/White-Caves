/**
 * Lead Data Generator — 100+ realistic Dubai property leads
 * Covers all statuses, sources, budgets, and property interests.
 */

import { createRng } from './rng';

// ─── Constants ────────────────────────────────────────────────

export const LEAD_STATUSES = ['hot', 'warm', 'cold', 'new', 'contacted', 'qualified', 'negotiation', 'lost'] as const;

export const LEAD_SOURCES = [
  'Website', 'Bayut', 'Property Finder', 'Dubizzle', 'Instagram',
  'WhatsApp', 'Referral', 'Walk-In', 'Google Ads', 'Facebook',
  'LinkedIn', 'Email Campaign', 'Open House', 'Exhibition', 'Agent Network',
] as const;

const LEAD_FIRST_NAMES = [
  'James', 'Alexander', 'Chen', 'Viktor', 'Nikolai', 'Pierre', 'Giovanni',
  'Raj', 'Sanjay', 'David', 'Michael', 'Sophie', 'Elena', 'Natasha',
  'Wei', 'Yuki', 'Hans', 'Carlos', 'Abdul', 'Rashid', 'Priya',
  'Anna', 'Maria', 'Oliver', 'Lucas', 'Emma', 'Olivia', 'Charlotte',
  'Amir', 'Pavel', 'Dmitri', 'Sergei', 'Andrei', 'Leo', 'Hugo',
  'Thomas', 'William', 'Ethan', 'Noah', 'Liam', 'Isabella', 'Sophia',
];

const LEAD_LAST_NAMES = [
  'Anderson', 'Williams', 'Petrov', 'Ivanov', 'Mueller', 'Schmidt',
  'Tanaka', 'Li', 'Wang', 'Kim', 'O\'Brien', 'Murphy', 'Singh',
  'Kumar', 'Rossi', 'Garcia', 'Martinez', 'Johansson', 'Eriksson',
  'Dubois', 'Laurent', 'Fischer', 'Becker', 'Novak', 'Hassan',
  'Volkov', 'Kuznetsov', 'Chen', 'Zhang', 'Yamamoto', 'Park',
];

const NATIONALITIES = [
  'Russian', 'Indian', 'British', 'Chinese', 'German', 'French',
  'Italian', 'Pakistani', 'Canadian', 'American', 'Japanese', 'Korean',
  'Swedish', 'Norwegian', 'Brazilian', 'South African', 'Australian',
  'Emirati', 'Saudi', 'Jordanian', 'Egyptian', 'Lebanese', 'Turkish',
];

const PROPERTY_INTERESTS = [
  'Luxury Villa', 'Waterfront Apartment', 'Off-Plan Investment',
  'Penthouse with Burj Khalifa View', 'Family Townhouse', 'Studio for Airbnb',
  'Commercial Office Space', 'Ready Move-In Apartment', 'Beachfront Villa',
  'Golf Course Villa', 'Smart Home Apartment', '2BR Marina View',
  'High-Rise 3BR', 'Serviced Apartment', 'Retail Space', 'Warehouse',
  'Duplex Apartment', 'Plot for Development', 'Holiday Home',
];

const NOTES_TEMPLATES = [
  'Looking for a property in {} — budget flexible, wants quick closing.',
  'Referred by existing client. Very interested in {} area. Follow up ASAP.',
  'Has been searching on Bayut for 3 months. Wants to view {} properties this week.',
  'HNW investor from overseas. Interested in portfolio of 3-5 units in {}.',
  'First-time buyer. Needs guidance on mortgage options. Preferred area: {}.',
  'Relocating from abroad with family. Needs 3BR+ in a family-friendly community near {}.',
  'Cash buyer. Ready to close immediately. Looking at {} and surrounding areas.',
  'Currently renting. Wants to transition to ownership. Budget-conscious, eyeing {}.',
  'Corporate relocation budget. Employer covering costs. Shortlisted {}.',
  'Previous White Caves client returning for second investment. Focus on {}.',
];

// ─── Generator ────────────────────────────────────────────────

export interface GeneratedLead {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  status: string;
  source: string;
  budget: number;
  budgetFormatted: string;
  property_interest: string;
  assigned_agent: string;
  score: number;
  priority: 'high' | 'medium' | 'low';
  notes: string;
  tags: string[];
  lastContacted: string;
  nextFollowUp: string;
  created_at: string;
  updated_at: string;
}

export function generateLeads(count = 100, seed = 137): GeneratedLead[] {
  const rng = createRng(seed);
  const leads: GeneratedLead[] = [];

  const TAG_OPTIONS = ['VIP', 'Cash Buyer', 'First-Time Buyer', 'Investor', 'Relocating', 'Corporate', 'Returning Client', 'High Budget', 'Urgent'];

  for (let i = 0; i < count; i++) {
    const firstName = rng.pick(LEAD_FIRST_NAMES);
    const lastName = rng.pick(LEAD_LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    const emailSlug = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/'/g, '')}`;
    const status = rng.pick(LEAD_STATUSES);
    const score = status === 'hot' ? rng.int(80, 100)
               : status === 'warm' ? rng.int(50, 79)
               : status === 'new' ? rng.int(40, 70)
               : status === 'qualified' ? rng.int(60, 90)
               : status === 'negotiation' ? rng.int(70, 95)
               : status === 'contacted' ? rng.int(30, 60)
               : status === 'lost' ? rng.int(5, 30)
               : rng.int(10, 40);  // cold

    const priority: GeneratedLead['priority'] = score >= 75 ? 'high' : score >= 45 ? 'medium' : 'low';

    // Budget: 500K to 50M AED
    const budgetTier = rng.int(1, 10);
    let budget: number;
    if (budgetTier <= 3) {
      budget = rng.int(500_000, 2_000_000);
    } else if (budgetTier <= 6) {
      budget = rng.int(2_000_000, 8_000_000);
    } else if (budgetTier <= 8) {
      budget = rng.int(8_000_000, 20_000_000);
    } else {
      budget = rng.int(20_000_000, 80_000_000);
    }
    budget = Math.round(budget / 100_000) * 100_000;

    const interest = rng.pick(PROPERTY_INTERESTS);
    const noteTemplate = rng.pick(NOTES_TEMPLATES);
    const interestArea = interest.split(' ').pop() ?? 'Dubai';
    const notes = noteTemplate.replace('{}', interestArea);

    const tags = rng.pickN([...TAG_OPTIONS], rng.int(0, 3));

    // Created: 1-365 days ago
    const daysAgo = rng.int(1, 365);
    const created_at = new Date(Date.now() - daysAgo * 86400000).toISOString();
    const updated_at = new Date(Date.now() - rng.int(0, Math.min(daysAgo, 30)) * 86400000).toISOString();
    const lastContacted = status === 'new' ? '' : new Date(Date.now() - rng.int(0, 14) * 86400000).toISOString().split('T')[0];
    const nextFollowUp = status === 'lost' ? '' : new Date(Date.now() + rng.int(1, 14) * 86400000).toISOString().split('T')[0];

    leads.push({
      id: `lead-${String(i + 1).padStart(3, '0')}`,
      name,
      firstName,
      lastName,
      email: `${emailSlug}@${rng.pick(['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'protonmail.com', 'icloud.com'])}`,
      phone: `+${rng.pick(['971', '44', '1', '7', '49', '33', '91', '86', '81', '82'])} ${rng.int(100, 999)} ${rng.int(100, 999)} ${rng.int(1000, 9999)}`,
      nationality: rng.pick(NATIONALITIES),
      status,
      source: rng.pick(LEAD_SOURCES),
      budget,
      budgetFormatted: `AED ${budget.toLocaleString('en-US')}`,
      property_interest: interest,
      assigned_agent: `agent-${String(rng.int(1, 20)).padStart(2, '0')}`,
      score,
      priority,
      notes,
      tags,
      lastContacted,
      nextFollowUp,
      created_at,
      updated_at,
    });
  }

  return leads;
}
