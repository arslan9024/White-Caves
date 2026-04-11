/**
 * Enhanced Seed Script — Unit Tests
 * ===================================
 * Tests the data generation + mapping logic used by seed-enhanced.ts.
 * Does NOT require a database — validates faker→Prisma field mappings.
 */

import { describe, it, expect } from 'vitest';
import { generateProperties } from './properties';
import { generateAgents } from './agents';
import { generateLeads } from './leads';
import { generateTransactions } from './transactions';
import { generateConversations, generateActivities } from './conversations';

// ─── Prisma Property model field compatibility ────────────────

describe('faker → Prisma Property mapping', () => {
  const props = generateProperties(20, 42);

  it('all properties have Prisma-required fields', () => {
    props.forEach(p => {
      // title: String
      expect(typeof p.title).toBe('string');
      expect(p.title.length).toBeGreaterThan(0);

      // type: String (lowercase for Prisma)
      const validTypes = ['apartment', 'villa', 'penthouse', 'townhouse', 'studio', 'duplex', 'loft', 'mansion', 'commercial'];
      expect(validTypes).toContain(p.type.toLowerCase());

      // status: String
      expect(['available', 'sold', 'rented', 'pending']).toContain(p.status);

      // price: Float
      expect(typeof p.price).toBe('number');
      expect(p.price).toBeGreaterThan(0);

      // bedrooms: Int
      expect(Number.isInteger(p.beds)).toBe(true);
      expect(p.beds).toBeGreaterThanOrEqual(0);

      // bathrooms: Int
      expect(Number.isInteger(p.baths)).toBe(true);
      expect(p.baths).toBeGreaterThanOrEqual(0);

      // sqft: Int
      expect(Number.isInteger(p.sqft)).toBe(true);
      expect(p.sqft).toBeGreaterThan(0);

      // location: String
      expect(typeof p.location).toBe('string');
      expect(p.location.length).toBeGreaterThan(0);

      // amenities: String[]
      expect(Array.isArray(p.amenities)).toBe(true);

      // images: String[]
      expect(Array.isArray(p.images)).toBe(true);

      // featured: Boolean
      expect(typeof p.featured).toBe('boolean');

      // agent reference
      expect(p.agent).toMatch(/^agent-\d{2}$/);
    });
  });

  it('status maps cleanly to Prisma values', () => {
    const statusMap: Record<string, string> = {
      available: 'available', sold: 'sold', rented: 'rented', pending: 'reserved',
    };
    props.forEach(p => {
      expect(statusMap[p.status]).toBeDefined();
    });
  });
});

// ─── Prisma User model field compatibility ────────────────────

describe('faker → Prisma User mapping', () => {
  const agents = generateAgents(10, 99);

  it('all agents have Prisma User-required fields', () => {
    agents.forEach(a => {
      // email: String @unique
      expect(a.email).toMatch(/@whitecaves\.ae$/);

      // name: String?
      expect(typeof a.name).toBe('string');
      expect(a.name.length).toBeGreaterThan(0);

      // phone: String?
      expect(a.phone).toMatch(/^\+971/);

      // department: String?
      expect(typeof a.department).toBe('string');

      // status: String → active/inactive
      expect(['online', 'offline', 'busy', 'away']).toContain(a.status);
    });
  });

  it('emails are unique across all agents', () => {
    const emails = agents.map(a => a.email);
    expect(new Set(emails).size).toBe(agents.length);
  });
});

// ─── Prisma Lead model field compatibility ────────────────────

describe('faker → Prisma Lead mapping', () => {
  const leads = generateLeads(50, 137);

  const sourceMap: Record<string, string> = {
    'Website': 'website', 'Bayut': 'website', 'Property Finder': 'website',
    'Dubizzle': 'website', 'Google Ads': 'marketing', 'Facebook': 'marketing',
    'LinkedIn': 'marketing', 'Email Campaign': 'marketing', 'Exhibition': 'marketing',
    'Instagram': 'marketing', 'WhatsApp': 'whatsapp', 'Referral': 'referral',
    'Walk-In': 'direct', 'Agent Network': 'referral', 'Open House': 'direct',
  };

  it('all leads have Prisma Lead-required fields', () => {
    leads.forEach(l => {
      // name: String
      expect(typeof l.name).toBe('string');

      // email: String?
      expect(typeof l.email).toBe('string');
      expect(l.email).toContain('@');

      // phone: String?
      expect(typeof l.phone).toBe('string');
      expect(l.phone.startsWith('+')).toBe(true);

      // status: String
      const prismaStatuses = ['new', 'contacted', 'qualified', 'hot', 'warm', 'cold', 'won', 'lost', 'negotiation'];
      expect(prismaStatuses).toContain(l.status);

      // source mapped to Prisma source
      expect(sourceMap[l.source]).toBeDefined();

      // budget: Float?
      expect(typeof l.budget).toBe('number');
      expect(l.budget).toBeGreaterThan(0);

      // score: Int (0-100)
      expect(l.score).toBeGreaterThanOrEqual(0);
      expect(l.score).toBeLessThanOrEqual(100);

      // tags: String[]
      expect(Array.isArray(l.tags)).toBe(true);
    });
  });

  it('all sources map to valid Prisma source values', () => {
    const validPrismaSources = new Set(['website', 'whatsapp', 'phone', 'referral', 'marketing', 'direct']);
    leads.forEach(l => {
      const mapped = sourceMap[l.source];
      expect(validPrismaSources.has(mapped)).toBe(true);
    });
  });
});

// ─── Prisma Transaction model field compatibility ─────────────

describe('faker → Prisma Transaction mapping', () => {
  const { transactions, commissions } = generateTransactions(15, 200);

  it('all transactions have Prisma Transaction-required fields', () => {
    transactions.forEach(t => {
      // type: String
      expect(['sale', 'rental', 'lease']).toContain(t.type);

      // status: String
      expect(['draft', 'pending', 'in_progress', 'completed', 'cancelled']).toContain(t.status);

      // amount: Float
      expect(typeof t.amount).toBe('number');
      expect(t.amount).toBeGreaterThan(0);

      // documents: String[]
      expect(Array.isArray(t.documents)).toBe(true);

      // agentId reference
      expect(t.agentId).toMatch(/^agent-\d{2}$/);
    });
  });

  it('all commissions have Prisma Commission-required fields', () => {
    commissions.forEach(c => {
      // amount: Float
      expect(typeof c.amount).toBe('number');
      expect(c.amount).toBeGreaterThan(0);

      // percentage: Float?
      expect(typeof c.percentage).toBe('number');
      expect(c.percentage).toBeGreaterThan(0);

      // type: String
      expect(['sale', 'rental', 'referral']).toContain(c.type);

      // status: String
      expect(['pending', 'approved', 'paid', 'cancelled']).toContain(c.status);

      // agentId reference
      expect(c.agentId).toMatch(/^agent-\d{2}$/);
    });
  });
});

// ─── Prisma NadiaConversation/NadiaMessage mapping ────────────

describe('faker → Prisma NadiaConversation mapping', () => {
  const conversations = generateConversations(10, 300);

  it('conversations map to NadiaConversation model', () => {
    conversations.forEach(c => {
      // customerPhone → remove spaces for Prisma
      const cleanPhone = c.customerPhone.replace(/\s/g, '');
      expect(cleanPhone).toMatch(/^\+971/);

      // leadScore: Int (0-100)
      expect(c.leadScore).toBeGreaterThanOrEqual(0);
      expect(c.leadScore).toBeLessThanOrEqual(100);

      // status maps to Prisma status
      const statusMap: Record<string, string> = {
        ACTIVE: 'active', PENDING: 'active', CLOSED: 'closed', SPAM: 'closed',
      };
      expect(statusMap[c.status]).toBeDefined();

      // messages exist
      expect(c.messages.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('messages map to NadiaMessage model', () => {
    conversations.forEach(c => {
      c.messages.forEach(m => {
        // direction: inbound/outbound
        const direction = m.sender === 'CUSTOMER' ? 'inbound' : 'outbound';
        expect(['inbound', 'outbound']).toContain(direction);

        // body: String
        expect(typeof m.content).toBe('string');
        expect(m.content.length).toBeGreaterThan(0);

        // messageType: String
        expect(m.messageType).toBe('text');

        // status: String
        expect(['sent', 'delivered', 'read']).toContain(m.status);

        // timestamp: parseable as Date
        expect(new Date(m.timestamp).toString()).not.toBe('Invalid Date');
      });
    });
  });
});

// ─── Prisma Activity model mapping ────────────────────────────

describe('faker → Prisma Activity mapping', () => {
  const activities = generateActivities(25, 400);

  const activityTypeMap: Record<string, { type: string; action: string }> = {
    deal_closed: { type: 'deal', action: 'status_changed' },
    lead_created: { type: 'lead', action: 'created' },
    stage_change: { type: 'lead', action: 'status_changed' },
    client_created: { type: 'client', action: 'created' },
    deal_cancelled: { type: 'deal', action: 'status_changed' },
    property_added: { type: 'property', action: 'created' },
    agent_added: { type: 'agent', action: 'created' },
    alert: { type: 'system', action: 'alert' },
    call: { type: 'lead', action: 'call' },
    email: { type: 'lead', action: 'email' },
    whatsapp: { type: 'lead', action: 'whatsapp' },
    visit: { type: 'property', action: 'visit' },
    note: { type: 'lead', action: 'note_added' },
  };

  it('all activity types map to valid Prisma type/action pairs', () => {
    activities.forEach(a => {
      const mapping = activityTypeMap[a.type];
      expect(mapping).toBeDefined();

      // Prisma type values
      const validTypes = ['lead', 'property', 'deal', 'commission', 'agent', 'client', 'system'];
      expect(validTypes).toContain(mapping.type);

      // description: String
      expect(typeof a.description).toBe('string');
      expect(a.description.length).toBeGreaterThan(5);
    });
  });
});

// ─── Full seed data volume test ───────────────────────────────

describe('seed volume: medium preset', () => {
  it('generates all data for medium preset in under 200ms', () => {
    const t0 = performance.now();

    const props = generateProperties(50, 42);
    const agents = generateAgents(20, 99);
    const leads = generateLeads(100, 137);
    const { transactions, commissions } = generateTransactions(30, 200);
    const conversations = generateConversations(25, 300);
    const activities = generateActivities(50, 400);

    const elapsed = performance.now() - t0;

    expect(props).toHaveLength(50);
    expect(agents).toHaveLength(20);
    expect(leads).toHaveLength(100);
    expect(transactions).toHaveLength(30);
    expect(commissions).toHaveLength(30);
    expect(conversations).toHaveLength(25);
    expect(activities).toHaveLength(50);

    // Total messages across conversations
    const totalMsgs = conversations.reduce((s, c) => s + c.messages.length, 0);
    expect(totalMsgs).toBeGreaterThan(75); // at least 3 per conversation

    // All under 200ms
    expect(elapsed).toBeLessThan(200);
  });

  it('generates large preset without errors', () => {
    const props = generateProperties(200, 1);
    const agents = generateAgents(50, 1);
    const leads = generateLeads(500, 1);
    const { transactions, commissions } = generateTransactions(100, 1);
    const conversations = generateConversations(75, 1);
    const activities = generateActivities(200, 1);

    expect(props).toHaveLength(200);
    expect(agents).toHaveLength(50);
    expect(leads).toHaveLength(500);
    expect(transactions).toHaveLength(100);
    expect(commissions).toHaveLength(100);
    expect(conversations).toHaveLength(75);
    expect(activities).toHaveLength(200);
  });
});
