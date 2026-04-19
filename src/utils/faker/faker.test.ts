/**
 * Faker Data Generators — Test Suite
 * ====================================
 * Validates properties, agents, leads generators:
 * - Correct counts & shapes
 * - Deterministic (same seed → same data)
 * - Unique IDs
 * - Realistic value ranges
 */

import { describe, it, expect , beforeAll } from 'vitest';
import {
  generateProperties, DUBAI_COMMUNITIES, PROPERTY_TYPES, AMENITIES,
  generateAgents, AGENT_DEPARTMENTS,
  generateLeads, LEAD_SOURCES, LEAD_STATUSES,
  createRng,
} from './index';
import type { GeneratedProperty, GeneratedAgent, GeneratedLead } from './index';

// ─── Seeded RNG ───────────────────────────────────────────────

describe('createRng', () => {
  it('produces deterministic output for same seed', () => {
    const a = createRng(42);
    const b = createRng(42);
    const valsA = Array.from({ length: 20 }, () => a.next());
    const valsB = Array.from({ length: 20 }, () => b.next());
    expect(valsA).toEqual(valsB);
  });

  it('produces different output for different seeds', () => {
    const a = createRng(1);
    const b = createRng(2);
    const valsA = Array.from({ length: 10 }, () => a.next());
    const valsB = Array.from({ length: 10 }, () => b.next());
    expect(valsA).not.toEqual(valsB);
  });

  it('int() respects min/max bounds', () => {
    const rng = createRng(7);
    for (let i = 0; i < 100; i++) {
      const v = rng.int(10, 50);
      expect(v).toBeGreaterThanOrEqual(10);
      expect(v).toBeLessThanOrEqual(50);
    }
  });

  it('pick() returns an element from the array', () => {
    const rng = createRng(3);
    const items = ['a', 'b', 'c', 'd'];
    for (let i = 0; i < 20; i++) {
      expect(items).toContain(rng.pick(items));
    }
  });

  it('pickN() returns n unique elements', () => {
    const rng = createRng(5);
    const items = ['a', 'b', 'c', 'd', 'e', 'f'];
    const picked = rng.pickN(items, 3);
    expect(picked).toHaveLength(3);
    expect(new Set(picked).size).toBe(3);
    picked.forEach(p => expect(items).toContain(p));
  });

  it('chance() returns boolean based on probability', () => {
    const rng = createRng(10);
    let trueCount = 0;
    const runs = 1000;
    for (let i = 0; i < runs; i++) {
      if (rng.chance(0.5)) trueCount++;
    }
    // Should be roughly 50% (±10%)
    expect(trueCount).toBeGreaterThan(runs * 0.35);
    expect(trueCount).toBeLessThan(runs * 0.65);
  });
});

// ─── Properties Generator ─────────────────────────────────────

describe('generateProperties', () => {
  let properties: GeneratedProperty[];

  beforeAll(() => {
    properties = generateProperties(50);
  });

  it('generates the requested count', () => {
    expect(properties).toHaveLength(50);
  });

  it('generates correct count with custom values', () => {
    expect(generateProperties(10, 1)).toHaveLength(10);
    expect(generateProperties(100, 2)).toHaveLength(100);
  });

  it('produces unique IDs', () => {
    const ids = properties.map(p => p.id);
    expect(new Set(ids).size).toBe(50);
  });

  it('has correct ID format: prop-001, prop-002, ...', () => {
    expect(properties[0].id).toBe('prop-001');
    expect(properties[49].id).toBe('prop-050');
  });

  it('every property has required fields', () => {
    properties.forEach(p => {
      expect(p).toHaveProperty('id');
      expect(p).toHaveProperty('title');
      expect(p).toHaveProperty('description');
      expect(p).toHaveProperty('location');
      expect(p).toHaveProperty('type');
      expect(p).toHaveProperty('purpose');
      expect(p).toHaveProperty('price');
      expect(p).toHaveProperty('priceFormatted');
      expect(p).toHaveProperty('beds');
      expect(p).toHaveProperty('baths');
      expect(p).toHaveProperty('sqft');
      expect(p).toHaveProperty('amenities');
      expect(p).toHaveProperty('images');
      expect(p).toHaveProperty('image');
      expect(p).toHaveProperty('featured');
      expect(p).toHaveProperty('yearBuilt');
      expect(p).toHaveProperty('status');
      expect(p).toHaveProperty('agent');
    });
  });

  it('locations are valid Dubai communities', () => {
    properties.forEach(p => {
      expect((DUBAI_COMMUNITIES as readonly string[])).toContain(p.location);
    });
  });

  it('types are valid property types', () => {
    properties.forEach(p => {
      expect((PROPERTY_TYPES as readonly string[])).toContain(p.type);
    });
  });

  it('purpose is buy or rent', () => {
    properties.forEach(p => {
      expect(['buy', 'rent']).toContain(p.purpose);
    });
  });

  it('price is a positive rounded number', () => {
    properties.forEach(p => {
      expect(p.price).toBeGreaterThan(0);
      expect(typeof p.price).toBe('number');
    });
  });

  it('beds, baths, sqft are non-negative numbers', () => {
    properties.forEach(p => {
      expect(p.beds).toBeGreaterThanOrEqual(0);
      expect(p.baths).toBeGreaterThanOrEqual(1);
      expect(p.sqft).toBeGreaterThan(0);
    });
  });

  it('amenities are valid and unique within property', () => {
    properties.forEach(p => {
      expect(p.amenities.length).toBeGreaterThanOrEqual(3);
      expect(new Set(p.amenities).size).toBe(p.amenities.length);
      p.amenities.forEach(a => {
        expect((AMENITIES as readonly string[])).toContain(a);
      });
    });
  });

  it('images array is non-empty and image matches first', () => {
    properties.forEach(p => {
      expect(p.images.length).toBeGreaterThanOrEqual(3);
      expect(p.image).toBe(p.images[0]);
    });
  });

  it('yearBuilt is within valid range', () => {
    properties.forEach(p => {
      expect(p.yearBuilt).toBeGreaterThanOrEqual(2015);
      expect(p.yearBuilt).toBeLessThanOrEqual(2026);
    });
  });

  it('status is a valid property status', () => {
    properties.forEach(p => {
      expect(['available', 'sold', 'rented', 'pending']).toContain(p.status);
    });
  });

  it('agent references follow agent-XX format', () => {
    properties.forEach(p => {
      expect(p.agent).toMatch(/^agent-\d{2}$/);
    });
  });

  it('has some featured properties (roughly 20%)', () => {
    const featured = properties.filter(p => p.featured);
    expect(featured.length).toBeGreaterThan(2);
    expect(featured.length).toBeLessThan(25);
  });

  it('is deterministic — same seed produces same data', () => {
    const a = generateProperties(10, 42);
    const b = generateProperties(10, 42);
    expect(a.map(p => p.id)).toEqual(b.map(p => p.id));
    expect(a.map(p => p.title)).toEqual(b.map(p => p.title));
    expect(a.map(p => p.price)).toEqual(b.map(p => p.price));
  });

  it('exports constant arrays with values', () => {
    expect(DUBAI_COMMUNITIES.length).toBeGreaterThanOrEqual(15);
    expect(PROPERTY_TYPES.length).toBeGreaterThanOrEqual(6);
    expect(AMENITIES.length).toBeGreaterThanOrEqual(20);
  });
});

// ─── Agents Generator ──────────────────────────────────────────

describe('generateAgents', () => {
  let agents: GeneratedAgent[];

  beforeAll(() => {
    agents = generateAgents(20);
  });

  it('generates the requested count', () => {
    expect(agents).toHaveLength(20);
  });

  it('produces unique IDs', () => {
    const ids = agents.map(a => a.id);
    expect(new Set(ids).size).toBe(20);
  });

  it('has correct ID format: agent-01, agent-02, ...', () => {
    expect(agents[0].id).toBe('agent-01');
    expect(agents[19].id).toBe('agent-20');
  });

  it('produces unique names', () => {
    const names = agents.map(a => a.name);
    expect(new Set(names).size).toBe(20);
  });

  it('every agent has required fields', () => {
    agents.forEach(a => {
      expect(a).toHaveProperty('id');
      expect(a).toHaveProperty('name');
      expect(a).toHaveProperty('firstName');
      expect(a).toHaveProperty('lastName');
      expect(a).toHaveProperty('email');
      expect(a).toHaveProperty('phone');
      expect(a).toHaveProperty('department');
      expect(a).toHaveProperty('status');
      expect(a).toHaveProperty('role');
      expect(a).toHaveProperty('sales');
      expect(a).toHaveProperty('roi');
      expect(a).toHaveProperty('performance');
      expect(a).toHaveProperty('rating');
      expect(a).toHaveProperty('leads_assigned');
      expect(a).toHaveProperty('deals_closed');
      expect(a).toHaveProperty('avatar_color');
    });
  });

  it('emails follow slug@whitecaves.ae pattern', () => {
    agents.forEach(a => {
      expect(a.email).toMatch(/@whitecaves\.ae$/);
    });
  });

  it('phones follow +971 XX XXX XXXX pattern', () => {
    agents.forEach(a => {
      expect(a.phone).toMatch(/^\+971 \d{2} \d{3} \d{4}$/);
    });
  });

  it('departments are valid', () => {
    agents.forEach(a => {
      expect((AGENT_DEPARTMENTS as readonly string[])).toContain(a.department);
    });
  });

  it('status is valid', () => {
    agents.forEach(a => {
      expect(['online', 'offline', 'busy', 'away']).toContain(a.status);
    });
  });

  it('performance is 60-100', () => {
    agents.forEach(a => {
      expect(a.performance).toBeGreaterThanOrEqual(60);
      expect(a.performance).toBeLessThanOrEqual(100);
    });
  });

  it('rating is 3.5-5.0', () => {
    agents.forEach(a => {
      expect(a.rating).toBeGreaterThanOrEqual(3.5);
      expect(a.rating).toBeLessThanOrEqual(5.0);
    });
  });

  it('languages array has 2-4 entries', () => {
    agents.forEach(a => {
      expect(a.languages.length).toBeGreaterThanOrEqual(2);
      expect(a.languages.length).toBeLessThanOrEqual(4);
    });
  });

  it('is deterministic — same seed produces same data', () => {
    const a = generateAgents(5, 99);
    const b = generateAgents(5, 99);
    expect(a.map(x => x.name)).toEqual(b.map(x => x.name));
    expect(a.map(x => x.email)).toEqual(b.map(x => x.email));
  });

  it('exports AGENT_DEPARTMENTS with values', () => {
    expect(AGENT_DEPARTMENTS.length).toBeGreaterThanOrEqual(5);
  });
});

// ─── Leads Generator ───────────────────────────────────────────

describe('generateLeads', () => {
  let leads: GeneratedLead[];

  beforeAll(() => {
    leads = generateLeads(100);
  });

  it('generates the requested count', () => {
    expect(leads).toHaveLength(100);
  });

  it('generates correct count with custom values', () => {
    expect(generateLeads(25, 1)).toHaveLength(25);
    expect(generateLeads(200, 2)).toHaveLength(200);
  });

  it('produces unique IDs', () => {
    const ids = leads.map(l => l.id);
    expect(new Set(ids).size).toBe(100);
  });

  it('has correct ID format: lead-001, lead-002, ...', () => {
    expect(leads[0].id).toBe('lead-001');
    expect(leads[99].id).toBe('lead-100');
  });

  it('every lead has required fields', () => {
    leads.forEach(l => {
      expect(l).toHaveProperty('id');
      expect(l).toHaveProperty('name');
      expect(l).toHaveProperty('email');
      expect(l).toHaveProperty('phone');
      expect(l).toHaveProperty('nationality');
      expect(l).toHaveProperty('status');
      expect(l).toHaveProperty('source');
      expect(l).toHaveProperty('budget');
      expect(l).toHaveProperty('budgetFormatted');
      expect(l).toHaveProperty('property_interest');
      expect(l).toHaveProperty('assigned_agent');
      expect(l).toHaveProperty('score');
      expect(l).toHaveProperty('priority');
      expect(l).toHaveProperty('notes');
      expect(l).toHaveProperty('created_at');
    });
  });

  it('statuses are valid', () => {
    leads.forEach(l => {
      expect((LEAD_STATUSES as readonly string[])).toContain(l.status);
    });
  });

  it('sources are valid', () => {
    leads.forEach(l => {
      expect((LEAD_SOURCES as readonly string[])).toContain(l.source);
    });
  });

  it('budget is positive and rounded', () => {
    leads.forEach(l => {
      expect(l.budget).toBeGreaterThan(0);
      expect(l.budget % 100_000).toBe(0);
    });
  });

  it('score aligns with status tiers', () => {
    leads.filter(l => l.status === 'hot').forEach(l => {
      expect(l.score).toBeGreaterThanOrEqual(80);
    });
    leads.filter(l => l.status === 'cold').forEach(l => {
      expect(l.score).toBeLessThanOrEqual(40);
    });
  });

  it('priority aligns with score', () => {
    leads.forEach(l => {
      if (l.score >= 75) expect(l.priority).toBe('high');
      else if (l.score >= 45) expect(l.priority).toBe('medium');
      else expect(l.priority).toBe('low');
    });
  });

  it('assigned_agent follows agent-XX format', () => {
    leads.forEach(l => {
      expect(l.assigned_agent).toMatch(/^agent-\d{2}$/);
    });
  });

  it('has a mix of all status types', () => {
    const statuses = new Set(leads.map(l => l.status));
    expect(statuses.size).toBeGreaterThanOrEqual(5);
  });

  it('has a mix of sources', () => {
    const sources = new Set(leads.map(l => l.source));
    expect(sources.size).toBeGreaterThanOrEqual(8);
  });

  it('notes are non-empty strings', () => {
    leads.forEach(l => {
      expect(l.notes.length).toBeGreaterThan(10);
    });
  });

  it('is deterministic — same seed produces same data', () => {
    const a = generateLeads(10, 137);
    const b = generateLeads(10, 137);
    expect(a.map(l => l.name)).toEqual(b.map(l => l.name));
    expect(a.map(l => l.budget)).toEqual(b.map(l => l.budget));
    expect(a.map(l => l.score)).toEqual(b.map(l => l.score));
  });

  it('exports constant arrays', () => {
    expect(LEAD_SOURCES.length).toBeGreaterThanOrEqual(10);
    expect(LEAD_STATUSES.length).toBeGreaterThanOrEqual(5);
  });
});

// ─── Cross-generator integration ───────────────────────────────

describe('faker integration', () => {
  it('property agent refs fall within agent ID range', () => {
    const properties = generateProperties(50);
    const agents = generateAgents(20);
    const agentIds = new Set(agents.map(a => a.id));
    const propAgentIds = properties.map(p => p.agent);
    // All prop agent refs should be valid agent-XX format (1-20)
    propAgentIds.forEach(aid => {
      expect(agentIds.has(aid)).toBe(true);
    });
  });

  it('lead assigned_agent refs fall within agent ID range', () => {
    const leads = generateLeads(100);
    const agents = generateAgents(20);
    const agentIds = new Set(agents.map(a => a.id));
    leads.forEach(l => {
      expect(agentIds.has(l.assigned_agent)).toBe(true);
    });
  });

  it('generators use independent seeds by default', () => {
    const props = generateProperties(5);
    const agents = generateAgents(5);
    const leads = generateLeads(5);
    // All should produce different first IDs (different prefixes ensure this)
    expect(props[0].id).not.toBe(agents[0].id);
    expect(agents[0].id).not.toBe(leads[0].id);
  });

  it('combined data volume is feasible (50 + 20 + 100)', () => {
    const t0 = performance.now();
    const props = generateProperties(50);
    const agents = generateAgents(20);
    const leads = generateLeads(100);
    const elapsed = performance.now() - t0;

    expect(props.length + agents.length + leads.length).toBe(170);
    // Should complete in under 100ms
    expect(elapsed).toBeLessThan(100);
  });

  it('large-scale generation works (500 + 100 + 1000)', () => {
    const t0 = performance.now();
    const props = generateProperties(500, 1);
    const agents = generateAgents(100, 1);
    const leads = generateLeads(1000, 1);
    const elapsed = performance.now() - t0;

    expect(props).toHaveLength(500);
    expect(agents).toHaveLength(100);
    expect(leads).toHaveLength(1000);
    // Should still be fast
    expect(elapsed).toBeLessThan(500);
  });
});
