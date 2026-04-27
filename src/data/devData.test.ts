/**
 * Dev Data Preloader — Test Suite
 * =================================
 * Validates faker→CRMItem mappings used by crmDataSlice initialState.
 * Ensures field shapes match what UI components and selectors expect.
 */

import { describe, it, expect } from 'vitest';
import {
  DEV_AGENTS,
  DEV_LEADS,
  DEV_PROPERTIES,
  DEV_COMMISSIONS,
  DEV_ACTIVITIES,
  DEV_CLIENTS,
  DEV_OVERVIEW,
} from './devData';

// ─── Agents ────────────────────────────────────────────────────

describe('DEV_AGENTS', () => {
  it('has 20 agents', () => {
    expect(DEV_AGENTS).toHaveLength(20);
  });

  it('uses numeric IDs matching old DUMMY_AGENTS', () => {
    expect(DEV_AGENTS[0].id).toBe(1);
    expect(DEV_AGENTS[19].id).toBe(20);
  });

  it('has all fields UI components expect', () => {
    DEV_AGENTS.forEach(a => {
      expect(typeof a.name).toBe('string');
      expect(typeof a.avatar).toBe('string'); // initials
      expect(typeof a.avatar_color).toBe('string');
      expect(typeof a.email).toBe('string');
      expect(typeof a.phone).toBe('string');
      expect(typeof a.department).toBe('string');
      expect(['online', 'offline', 'busy', 'away']).toContain(a.status);
      expect(typeof a.sales).toBe('number');
      expect(typeof a.roi).toBe('number');
      expect(['Excellent', 'Very Good', 'Good', 'Average']).toContain(a.performance);
      expect(typeof a.rating).toBe('number');
      expect(typeof a.leads_assigned).toBe('number');
      expect(typeof a.deals_closed).toBe('number');
    });
  });

  it('avatar is 2-letter initials', () => {
    DEV_AGENTS.forEach(a => {
      expect(a.avatar).toMatch(/^[A-Z]{2}$/);
    });
  });
});

// ─── Leads ─────────────────────────────────────────────────────

describe('DEV_LEADS', () => {
  it('has 100 leads', () => {
    expect(DEV_LEADS).toHaveLength(100);
  });

  it('uses numeric IDs', () => {
    expect(DEV_LEADS[0].id).toBe(1);
    expect(DEV_LEADS[99].id).toBe(100);
  });

  it('has all fields UI components expect', () => {
    DEV_LEADS.forEach(l => {
      expect(typeof l.name).toBe('string');
      expect(typeof l.email).toBe('string');
      expect(typeof l.phone).toBe('string');
      expect(typeof l.status).toBe('string');
      expect(typeof l.priority).toBe('string');
      expect(typeof l.amount).toBe('number');
      expect(typeof l.stage).toBe('string');
      expect(typeof l.agent_id).toBe('number');
      expect(typeof l.agent_name).toBe('string');
      expect(typeof l.last_contact).toBe('string');
      expect(typeof l.next_action).toBe('string');
      expect(typeof l.notes).toBe('string');
      expect(typeof l.property_interest).toBe('string');
    });
  });

  it('agent_id references a valid DEV_AGENT', () => {
    const validIds = new Set(DEV_AGENTS.map(a => a.id));
    DEV_LEADS.forEach(l => {
      expect(validIds.has(l.agent_id)).toBe(true);
    });
  });

  it('agent_name matches the referenced agent', () => {
    DEV_LEADS.forEach(l => {
      const agent = DEV_AGENTS.find(a => a.id === l.agent_id);
      expect(agent).toBeDefined();
      expect(l.agent_name).toBe(agent!.name);
    });
  });

  it('has a good mix of statuses', () => {
    const statuses = new Set(DEV_LEADS.map(l => l.status));
    expect(statuses.size).toBeGreaterThanOrEqual(5);
  });

  it('priority is uppercase', () => {
    DEV_LEADS.forEach(l => {
      expect(['HIGH', 'MEDIUM', 'LOW']).toContain(l.priority);
    });
  });
});

// ─── Properties ────────────────────────────────────────────────

describe('DEV_PROPERTIES', () => {
  it('has 50 properties', () => {
    expect(DEV_PROPERTIES).toHaveLength(50);
  });

  it('has all fields UI components expect', () => {
    DEV_PROPERTIES.forEach(p => {
      expect(typeof p.id).toBe('string');
      expect(typeof p.title).toBe('string');
      expect(typeof p.location).toBe('string');
      expect(typeof p.type).toBe('string');
      expect(typeof p.price).toBe('number');
      expect(typeof p.beds).toBe('number');
      expect(typeof p.baths).toBe('number');
      expect(typeof p.sqft).toBe('number');
      expect(Array.isArray(p.amenities)).toBe(true);
      expect(Array.isArray(p.images)).toBe(true);
      expect(typeof p.image).toBe('string');
      expect(typeof p.featured).toBe('boolean');
      expect(['available', 'sold', 'rented', 'pending']).toContain(p.status);
    });
  });

  it('has both beds and bedrooms fields', () => {
    DEV_PROPERTIES.forEach(p => {
      expect(p.beds).toBe(p.bedrooms);
      expect(p.baths).toBe(p.bathrooms);
    });
  });
});

// ─── Commissions ───────────────────────────────────────────────

describe('DEV_COMMISSIONS', () => {
  it('has 30 commissions', () => {
    expect(DEV_COMMISSIONS).toHaveLength(30);
  });

  it('has both agent_id and agentId fields', () => {
    DEV_COMMISSIONS.forEach(c => {
      expect(c.agent_id).toBeDefined();
      expect(c.agentId).toBeDefined();
      expect(c.agent_id).toBe(c.agentId);
    });
  });

  it('status is valid', () => {
    DEV_COMMISSIONS.forEach(c => {
      expect(['pending', 'approved', 'paid', 'cancelled']).toContain(c.status);
    });
  });

  it('amount is positive', () => {
    DEV_COMMISSIONS.forEach(c => {
      expect(c.amount).toBeGreaterThan(0);
    });
  });
});

// ─── Activities ────────────────────────────────────────────────

describe('DEV_ACTIVITIES', () => {
  it('has 50 activities', () => {
    expect(DEV_ACTIVITIES).toHaveLength(50);
  });

  it('matches DUMMY_ACTIVITIES field shape', () => {
    DEV_ACTIVITIES.forEach(a => {
      expect(typeof a.id).toBe('number');
      expect(typeof a.timestamp).toBe('string');
      expect(typeof a.action).toBe('string');
      expect(typeof a.description).toBe('string');
      expect(typeof a.user).toBe('string');
      expect(typeof a.type).toBe('string');
      expect(typeof a.icon).toBe('string');
    });
  });
});

// ─── Clients ───────────────────────────────────────────────────

describe('DEV_CLIENTS', () => {
  it('has clients derived from qualified/hot leads', () => {
    expect(DEV_CLIENTS.length).toBeGreaterThan(0);
    expect(DEV_CLIENTS.length).toBeLessThanOrEqual(30);
  });

  it('matches DUMMY_CLIENTS field shape', () => {
    DEV_CLIENTS.forEach(c => {
      expect(typeof c.id).toBe('number');
      expect(typeof c.name).toBe('string');
      expect(typeof c.email).toBe('string');
      expect(typeof c.type).toBe('string');
      expect(c.status).toBe('active');
      expect(typeof c.total_value).toBe('number');
      expect(typeof c.agent_id).toBe('number');
      expect(typeof c.agent_name).toBe('string');
      expect(typeof c.avatar_color).toBe('string');
    });
  });
});

// ─── Overview ──────────────────────────────────────────────────

describe('DEV_OVERVIEW', () => {
  it('has all expected metric fields', () => {
    expect(DEV_OVERVIEW.metrics).toBeDefined();
    const m = DEV_OVERVIEW.metrics;
    expect(typeof m.totalLeads).toBe('number');
    expect(typeof m.hotLeads).toBe('number');
    expect(typeof m.warmLeads).toBe('number');
    expect(typeof m.coldLeads).toBe('number');
    expect(typeof m.agentsOnline).toBe('number');
    expect(typeof m.agentsTotal).toBe('number');
    expect(typeof m.activeDeals).toBe('number');
  });

  it('metrics are consistent with generated data', () => {
    expect(DEV_OVERVIEW.metrics.totalLeads).toBe(100);
    expect(DEV_OVERVIEW.metrics.agentsTotal).toBe(20);
    expect(DEV_OVERVIEW.metrics.hotLeads + DEV_OVERVIEW.metrics.warmLeads + DEV_OVERVIEW.metrics.coldLeads).toBeLessThanOrEqual(100);
  });

  it('has topAgents array', () => {
    expect(DEV_OVERVIEW.topAgents).toHaveLength(5);
  });

  it('has hotLeads array', () => {
    expect(DEV_OVERVIEW.hotLeads.length).toBeGreaterThan(0);
    expect(DEV_OVERVIEW.hotLeads.length).toBeLessThanOrEqual(5);
  });

  it('has performance comparison data', () => {
    expect(DEV_OVERVIEW.performance.thisMonth).toBeDefined();
    expect(DEV_OVERVIEW.performance.lastMonth).toBeDefined();
    expect(typeof DEV_OVERVIEW.performance.thisMonth.deals_closed).toBe('number');
    expect(typeof DEV_OVERVIEW.performance.thisMonth.revenue).toBe('number');
  });
});
