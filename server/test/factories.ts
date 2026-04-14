/**
 * Test Data Factories — White Caves CRM
 * ======================================
 * Type-safe factory functions for all 17 Prisma models.
 * Use in Vitest unit/integration tests for deterministic, realistic test data.
 *
 * Pattern: Each factory returns a plain object matching the Prisma model shape.
 * Use `build()` for in-memory objects, `overrides` for partial customization.
 *
 * Usage:
 *   import { UserFactory, LeadFactory, PropertyFactory } from '../test/factories';
 *   const user = UserFactory.build();
 *   const lead = LeadFactory.build({ status: 'hot', score: 95 });
 *   const users = UserFactory.buildList(10);
 */

// ── Helpers ─────────────────────────────────────────────────────────────

let _seq = 0;
/** Auto-incrementing sequence for unique values */
function seq(): number { return ++_seq; }

/** Reset sequence counter (call in beforeEach) */
export function resetFactories(): void { _seq = 0; }

/** Generate a fake MongoDB ObjectId (24-char hex) */
function objectId(): string {
  const hex = () => Math.floor(Math.random() * 16).toString(16);
  return Array.from({ length: 24 }, hex).join('');
}

/** Random element from array */
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/** Random integer between min and max (inclusive) */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Random float between min and max */
function randFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/** ISO date string offset from now by N days */
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

// ── Constants ───────────────────────────────────────────────────────────

const ROLES = ['owner', 'admin', 'manager', 'senior_agent', 'agent', 'junior_agent', 'marketing_manager', 'finance_manager', 'compliance_officer', 'viewer', 'tenant', 'buyer'] as const;
const DEPARTMENTS = ['Sales', 'Leasing', 'Marketing', 'Finance', 'Compliance', 'Operations', 'IT', 'Management'] as const;
const PROPERTY_TYPES = ['villa', 'apartment', 'penthouse', 'commercial', 'land', 'townhouse'] as const;
const PROPERTY_STATUSES = ['available', 'reserved', 'sold', 'rented', 'off_market'] as const;
const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'hot', 'warm', 'cold', 'won', 'lost'] as const;
const LEAD_SOURCES = ['whatsapp', 'website', 'phone', 'referral', 'marketing', 'direct'] as const;
const TRANSACTION_TYPES = ['sale', 'rental', 'lease'] as const;
const TRANSACTION_STATUSES = ['draft', 'pending', 'in_progress', 'completed', 'cancelled'] as const;
const COMMISSION_TYPES = ['sale', 'rental', 'referral'] as const;
const COMMISSION_STATUSES = ['pending', 'approved', 'paid', 'cancelled'] as const;
const TENANT_STATUSES = ['active', 'inactive', 'pending'] as const;
const VIEWING_STATUSES = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'] as const;
const VIEWING_TYPES = ['in_person', 'virtual', 'open_house'] as const;
const OFFER_STATUSES = ['pending', 'accepted', 'rejected', 'countered', 'expired', 'withdrawn'] as const;
const LEASE_STATUSES = ['draft', 'active', 'expiring', 'expired', 'terminated', 'renewed'] as const;
const MAINTENANCE_CATEGORIES = ['plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'general'] as const;
const MAINTENANCE_PRIORITIES = ['low', 'medium', 'high', 'emergency'] as const;
const MAINTENANCE_STATUSES = ['open', 'in_progress', 'scheduled', 'completed', 'cancelled'] as const;
const NADIA_STATUSES = ['active', 'assigned_to_agent', 'in_bot_flow', 'closed'] as const;
const MESSAGE_TYPES = ['text', 'image', 'document', 'audio', 'video'] as const;
const MESSAGE_STATUSES = ['sent', 'delivered', 'read', 'failed'] as const;
const QUEUE_STATUSES = ['waiting', 'assigned', 'completed'] as const;
const JOB_STATUSES = ['received', 'reviewed', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'] as const;
const ACTIVITY_TYPES = ['lead', 'property', 'deal', 'commission', 'agent', 'client', 'system'] as const;
const ACTIVITY_ACTIONS = ['created', 'updated', 'deleted', 'status_changed', 'note_added', 'call', 'email', 'visit'] as const;

const DUBAI_AREAS = ['Dubai Marina', 'JBR', 'Downtown', 'Palm Jumeirah', 'Business Bay', 'JLT', 'DIFC', 'City Walk', 'Dubai Hills', 'Arabian Ranches'] as const;
const AMENITIES = ['Pool', 'Gym', 'Parking', 'Balcony', 'Sea View', 'Concierge', 'Maid Room', 'Smart Home', 'Garden', 'BBQ Area'] as const;
const FIRST_NAMES = ['Ahmed', 'Fatima', 'Omar', 'Sara', 'Khalid', 'Layla', 'Hassan', 'Nadia', 'Youssef', 'Maryam'] as const;
const LAST_NAMES = ['Al-Rashid', 'Khan', 'Patel', 'Singh', 'Wilson', 'Johnson', 'Al-Maktoum', 'Ibrahim', 'Chen', 'Kim'] as const;

// ── Factory Helper Type ─────────────────────────────────────────────────

interface Factory<T> {
  build(overrides?: Partial<T>): T;
  buildList(count: number, overrides?: Partial<T>): T[];
}

function createFactory<T>(defaults: () => T): Factory<T> {
  return {
    build(overrides?: Partial<T>): T {
      return { ...defaults(), ...overrides };
    },
    buildList(count: number, overrides?: Partial<T>): T[] {
      return Array.from({ length: count }, () => ({ ...defaults(), ...overrides }));
    },
  };
}

// ── Model Types (match Prisma schema) ───────────────────────────────────

export interface TestUser {
  id: string;
  email: string;
  name: string | null;
  photoUrl: string | null;
  role: string;
  phone: string | null;
  department: string | null;
  status: string;
  passwordHash: string | null;
  firebaseUid: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestProperty {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  location: string;
  area: string | null;
  amenities: string[];
  images: string[];
  featured: boolean;
  agentName: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestLead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  source: string;
  budget: number | null;
  score: number;
  notes: string | null;
  tags: string[];
  lastContact: Date | null;
  assignedToId: string | null;
  createdById: string | null;
  propertyId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestActivity {
  id: string;
  type: string;
  action: string;
  description: string;
  metadata: Record<string, unknown> | null;
  userId: string | null;
  leadId: string | null;
  createdAt: Date;
}

export interface TestTransaction {
  id: string;
  type: string;
  status: string;
  amount: number;
  closingDate: Date | null;
  notes: string | null;
  documents: string[];
  propertyId: string | null;
  leadId: string | null;
  agentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestTenant {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  emiratesId: string | null;
  status: string;
  moveInDate: Date | null;
  moveOutDate: Date | null;
  monthlyRent: number | null;
  deposit: number | null;
  notes: string | null;
  propertyId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestCommission {
  id: string;
  amount: number;
  percentage: number | null;
  type: string;
  status: string;
  notes: string | null;
  paidAt: Date | null;
  agentId: string;
  leadId: string | null;
  propertyId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestFavorite {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: Date;
}

export interface TestSavedSearch {
  id: string;
  name: string;
  filters: Record<string, unknown>;
  alertEnabled: boolean;
  lastChecked: Date | null;
  matchCount: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestViewing {
  id: string;
  scheduledAt: Date;
  duration: number;
  status: string;
  type: string;
  notes: string | null;
  feedback: string | null;
  rating: number | null;
  location: string | null;
  userId: string;
  propertyId: string;
  leadId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestOffer {
  id: string;
  amount: number;
  status: string;
  expiresAt: Date | null;
  terms: string | null;
  counterAmount: number | null;
  notes: string | null;
  buyerId: string;
  propertyId: string;
  leadId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestLease {
  id: string;
  leaseNumber: string | null;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  depositAmount: number;
  status: string;
  terms: string | null;
  documents: string[];
  nextPaymentDue: Date | null;
  tenantId: string;
  landlordId: string;
  propertyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestMaintenance {
  id: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  status: string;
  scheduledDate: Date | null;
  completedAt: Date | null;
  cost: number | null;
  images: string[];
  notes: string | null;
  requesterId: string;
  propertyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestNadiaConversation {
  id: string;
  wabaId: string;
  customerPhone: string;
  agentPhone: string | null;
  intent: string | null;
  leadScore: number;
  timeline: string | null;
  status: string;
  routedAt: Date | null;
  closedAt: Date | null;
  closedReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestNadiaMessage {
  id: string;
  conversationId: string;
  waMessageId: string;
  direction: string;
  body: string;
  messageType: string;
  status: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestNadiaConversationQueue {
  id: string;
  conversationId: string;
  priority: number;
  status: string;
  assignedTo: string | null;
  assignedAt: Date | null;
  queuedAt: Date;
  completedAt: Date | null;
  responseTime: number | null;
}

export interface TestJobApplication {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string;
  experience: string | null;
  resumeUrl: string | null;
  coverLetter: string | null;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ── Factories ───────────────────────────────────────────────────────────

export const UserFactory = createFactory<TestUser>(() => {
  const n = seq();
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  const now = new Date();
  return {
    id: objectId(),
    email: `user${n}@whitecaves.test`,
    name: `${firstName} ${lastName}`,
    photoUrl: null,
    role: pick(ROLES),
    phone: `+9715${randInt(10000000, 99999999)}`,
    department: pick(DEPARTMENTS),
    status: 'active',
    passwordHash: '$2b$10$fakehashfakehashfakehashfakehashfakehashfakehash',
    firebaseUid: null,
    createdAt: daysAgo(randInt(30, 365)),
    updatedAt: now,
  };
});

export const PropertyFactory = createFactory<TestProperty>(() => {
  const n = seq();
  const area = pick(DUBAI_AREAS);
  const type = pick(PROPERTY_TYPES);
  const bedrooms = type === 'land' ? 0 : randInt(1, 6);
  const now = new Date();
  return {
    id: objectId(),
    title: `${bedrooms}BR ${type.charAt(0).toUpperCase() + type.slice(1)} in ${area}`,
    description: `Beautiful ${type} located in the heart of ${area}, Dubai.`,
    type,
    status: pick(PROPERTY_STATUSES),
    price: randFloat(500_000, 25_000_000),
    bedrooms,
    bathrooms: Math.max(1, bedrooms - 1),
    sqft: randInt(500, 10_000),
    location: `${area}, Dubai, UAE`,
    area,
    amenities: Array.from({ length: randInt(2, 6) }, () => pick(AMENITIES)),
    images: [`https://images.whitecaves.test/prop-${n}-1.jpg`, `https://images.whitecaves.test/prop-${n}-2.jpg`],
    featured: Math.random() > 0.8,
    agentName: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    userId: objectId(),
    createdAt: daysAgo(randInt(1, 180)),
    updatedAt: now,
  };
});

export const LeadFactory = createFactory<TestLead>(() => {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  const now = new Date();
  return {
    id: objectId(),
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    phone: `+9715${randInt(10000000, 99999999)}`,
    company: Math.random() > 0.5 ? `${lastName} Holdings` : null,
    status: pick(LEAD_STATUSES),
    source: pick(LEAD_SOURCES),
    budget: Math.random() > 0.3 ? randFloat(500_000, 20_000_000) : null,
    score: randInt(0, 100),
    notes: null,
    tags: ['dubai', pick(['investor', 'end-user', 'relocating', 'first-time-buyer'])],
    lastContact: Math.random() > 0.4 ? daysAgo(randInt(0, 30)) : null,
    assignedToId: Math.random() > 0.3 ? objectId() : null,
    createdById: objectId(),
    propertyId: Math.random() > 0.5 ? objectId() : null,
    createdAt: daysAgo(randInt(1, 90)),
    updatedAt: now,
  };
});

export const ActivityFactory = createFactory<TestActivity>(() => ({
  id: objectId(),
  type: pick(ACTIVITY_TYPES),
  action: pick(ACTIVITY_ACTIONS),
  description: `Test activity ${seq()}`,
  metadata: null,
  userId: objectId(),
  leadId: Math.random() > 0.5 ? objectId() : null,
  createdAt: daysAgo(randInt(0, 30)),
}));

export const TransactionFactory = createFactory<TestTransaction>(() => {
  const now = new Date();
  return {
    id: objectId(),
    type: pick(TRANSACTION_TYPES),
    status: pick(TRANSACTION_STATUSES),
    amount: randFloat(100_000, 50_000_000),
    closingDate: Math.random() > 0.5 ? daysFromNow(randInt(7, 90)) : null,
    notes: null,
    documents: [],
    propertyId: objectId(),
    leadId: objectId(),
    agentId: objectId(),
    createdAt: daysAgo(randInt(1, 60)),
    updatedAt: now,
  };
});

export const TenantFactory = createFactory<TestTenant>(() => {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  const now = new Date();
  return {
    id: objectId(),
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}@tenant.test`,
    phone: `+9715${randInt(10000000, 99999999)}`,
    nationality: pick(['UAE', 'India', 'Pakistan', 'UK', 'USA', 'Philippines', 'Egypt']),
    emiratesId: `784-${randInt(1990, 2005)}-${randInt(1000000, 9999999)}-${randInt(1, 9)}`,
    status: pick(TENANT_STATUSES),
    moveInDate: daysAgo(randInt(30, 365)),
    moveOutDate: null,
    monthlyRent: randFloat(5_000, 50_000),
    deposit: randFloat(5_000, 50_000),
    notes: null,
    propertyId: objectId(),
    createdAt: daysAgo(randInt(30, 365)),
    updatedAt: now,
  };
});

export const CommissionFactory = createFactory<TestCommission>(() => {
  const now = new Date();
  return {
    id: objectId(),
    amount: randFloat(5_000, 500_000),
    percentage: Math.random() > 0.3 ? randFloat(1, 5) : null,
    type: pick(COMMISSION_TYPES),
    status: pick(COMMISSION_STATUSES),
    notes: null,
    paidAt: null,
    agentId: objectId(),
    leadId: Math.random() > 0.5 ? objectId() : null,
    propertyId: Math.random() > 0.3 ? objectId() : null,
    createdAt: daysAgo(randInt(1, 90)),
    updatedAt: now,
  };
});

export const FavoriteFactory = createFactory<TestFavorite>(() => ({
  id: objectId(),
  userId: objectId(),
  propertyId: objectId(),
  createdAt: daysAgo(randInt(0, 60)),
}));

export const SavedSearchFactory = createFactory<TestSavedSearch>(() => {
  const now = new Date();
  return {
    id: objectId(),
    name: `${pick(PROPERTY_TYPES)} in ${pick(DUBAI_AREAS)} under ${randInt(1, 10)}M`,
    filters: { type: pick(PROPERTY_TYPES), area: pick(DUBAI_AREAS), maxPrice: randInt(1_000_000, 10_000_000) },
    alertEnabled: Math.random() > 0.5,
    lastChecked: Math.random() > 0.5 ? daysAgo(randInt(0, 7)) : null,
    matchCount: randInt(0, 50),
    userId: objectId(),
    createdAt: daysAgo(randInt(1, 60)),
    updatedAt: now,
  };
});

export const ViewingFactory = createFactory<TestViewing>(() => {
  const now = new Date();
  return {
    id: objectId(),
    scheduledAt: daysFromNow(randInt(1, 30)),
    duration: pick([30, 45, 60]),
    status: pick(VIEWING_STATUSES),
    type: pick(VIEWING_TYPES),
    notes: null,
    feedback: null,
    rating: null,
    location: `${pick(DUBAI_AREAS)}, Dubai`,
    userId: objectId(),
    propertyId: objectId(),
    leadId: Math.random() > 0.5 ? objectId() : null,
    createdAt: daysAgo(randInt(0, 14)),
    updatedAt: now,
  };
});

export const OfferFactory = createFactory<TestOffer>(() => {
  const now = new Date();
  return {
    id: objectId(),
    amount: randFloat(500_000, 20_000_000),
    status: pick(OFFER_STATUSES),
    expiresAt: daysFromNow(randInt(7, 30)),
    terms: Math.random() > 0.5 ? 'Standard payment plan: 20% down, 80% on handover' : null,
    counterAmount: null,
    notes: null,
    buyerId: objectId(),
    propertyId: objectId(),
    leadId: Math.random() > 0.5 ? objectId() : null,
    createdAt: daysAgo(randInt(0, 30)),
    updatedAt: now,
  };
});

export const LeaseFactory = createFactory<TestLease>(() => {
  const now = new Date();
  const startDate = daysAgo(randInt(30, 365));
  return {
    id: objectId(),
    leaseNumber: `LSE-${new Date().getFullYear()}-${String(seq()).padStart(4, '0')}`,
    startDate,
    endDate: daysFromNow(randInt(30, 365)),
    monthlyRent: randFloat(5_000, 80_000),
    depositAmount: randFloat(5_000, 80_000),
    status: pick(LEASE_STATUSES),
    terms: null,
    documents: [],
    nextPaymentDue: daysFromNow(randInt(1, 30)),
    tenantId: objectId(),
    landlordId: objectId(),
    propertyId: objectId(),
    createdAt: startDate,
    updatedAt: now,
  };
});

export const MaintenanceFactory = createFactory<TestMaintenance>(() => {
  const now = new Date();
  return {
    id: objectId(),
    title: `${pick(MAINTENANCE_CATEGORIES)} issue - Unit ${randInt(100, 9999)}`,
    description: `Maintenance request for unit in ${pick(DUBAI_AREAS)}`,
    category: pick(MAINTENANCE_CATEGORIES),
    priority: pick(MAINTENANCE_PRIORITIES),
    status: pick(MAINTENANCE_STATUSES),
    scheduledDate: Math.random() > 0.5 ? daysFromNow(randInt(1, 14)) : null,
    completedAt: null,
    cost: Math.random() > 0.5 ? randFloat(100, 10_000) : null,
    images: [],
    notes: null,
    requesterId: objectId(),
    propertyId: objectId(),
    createdAt: daysAgo(randInt(0, 30)),
    updatedAt: now,
  };
});

export const NadiaConversationFactory = createFactory<TestNadiaConversation>(() => {
  const now = new Date();
  return {
    id: objectId(),
    wabaId: `waba_${randInt(100000, 999999)}`,
    customerPhone: `+9715${randInt(10000000, 99999999)}`,
    agentPhone: Math.random() > 0.5 ? `+9715${randInt(10000000, 99999999)}` : null,
    intent: Math.random() > 0.3 ? pick(['property_search', 'schedule_tour', 'price_inquiry', 'general_question']) : null,
    leadScore: randInt(0, 100),
    timeline: Math.random() > 0.5 ? pick(['ASAP', '1-3mo', '3-6mo', '6-12mo']) : null,
    status: pick(NADIA_STATUSES),
    routedAt: null,
    closedAt: null,
    closedReason: null,
    createdAt: daysAgo(randInt(0, 30)),
    updatedAt: now,
  };
});

export const NadiaMessageFactory = createFactory<TestNadiaMessage>(() => {
  const now = new Date();
  return {
    id: objectId(),
    conversationId: objectId(),
    waMessageId: `wamid.${objectId()}`,
    direction: pick(['inbound', 'outbound']),
    body: `Test message ${seq()}`,
    messageType: pick(MESSAGE_TYPES),
    status: pick(MESSAGE_STATUSES),
    timestamp: daysAgo(randInt(0, 7)),
    createdAt: daysAgo(randInt(0, 7)),
    updatedAt: now,
  };
});

export const NadiaConversationQueueFactory = createFactory<TestNadiaConversationQueue>(() => ({
  id: objectId(),
  conversationId: objectId(),
  priority: randInt(1, 10),
  status: pick(QUEUE_STATUSES),
  assignedTo: null,
  assignedAt: null,
  queuedAt: daysAgo(randInt(0, 3)),
  completedAt: null,
  responseTime: Math.random() > 0.5 ? randInt(1000, 60000) : null,
}));

export const JobApplicationFactory = createFactory<TestJobApplication>(() => {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  const now = new Date();
  return {
    id: objectId(),
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@apply.test`,
    phone: `+9715${randInt(10000000, 99999999)}`,
    position: pick(['Senior Agent', 'Marketing Manager', 'Finance Analyst', 'IT Specialist', 'Junior Agent']),
    experience: `${randInt(1, 15)} years in ${pick(['real estate', 'sales', 'finance', 'marketing'])}`,
    resumeUrl: null,
    coverLetter: null,
    status: pick(JOB_STATUSES),
    notes: null,
    createdAt: daysAgo(randInt(1, 60)),
    updatedAt: now,
  };
});
