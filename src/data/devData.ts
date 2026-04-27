/**
 * Dev Data — Faker → CRM Redux Mapper
 * ======================================
 * Maps faker generator output to CRMItem field shapes
 * that the crmDataSlice selectors and UI components expect.
 *
 * Replaces hardcoded DUMMY_* imports in DEV mode,
 * giving us 50+ properties, 20+ agents, 100+ leads, etc.
 */

import {
  generateProperties,
  generateAgents,
  generateLeads,
  generateTransactions,
  generateActivities,
} from '../utils/faker';
import type {
  GeneratedProperty,
  GeneratedAgent,
  GeneratedLead,
  GeneratedCommission,
  GeneratedActivity,
} from '../utils/faker';

// ─── Agents → CRMItem (matches DUMMY_AGENTS shape) ──────────

function mapAgent(a: GeneratedAgent, idx: number) {
  const initials = `${a.firstName[0]}${a.lastName.split(' ').pop()?.[0] || ''}`;
  return {
    id: idx + 1, // numeric IDs to match old DUMMY_AGENTS
    name: a.name,
    avatar: initials,
    avatar_color: a.avatar_color,
    email: a.email,
    phone: a.phone,
    department: a.department,
    status: a.status,
    role: a.role,
    sales: a.deals_closed,
    roi: a.roi,
    performance: a.performance >= 90 ? 'Excellent'
               : a.performance >= 75 ? 'Very Good'
               : a.performance >= 60 ? 'Good'
               : 'Average',
    rating: a.rating,
    leads_assigned: a.leads_assigned,
    deals_closed: a.deals_closed,
    deals_in_progress: a.deals_in_progress,
    revenue_generated: a.revenue_generated,
    specialty: a.specialty,
    languages: a.languages,
    bio: a.bio,
    joined_date: a.joinedDate,
    last_active: a.lastActive,
    photoUrl: a.avatar,
  };
}

// ─── Leads → CRMItem (matches DUMMY_HOT_LEADS / DUMMY_ALL_LEADS shape) ──

const STAGES = ['inquiry', 'viewing', 'negotiation', 'proposal', 'closing', 'research', 'initial'];
const CONTACT_LABELS = ['Just now', '1 hour ago', '2 hours ago', '3 hours ago', 'Today', 'Yesterday', '2 days ago', '3 days ago', '1 week ago', '2 weeks ago', '1 month ago'];
const NEXT_ACTIONS = ['Send contract', 'Schedule site visit', 'Close deal', 'Send property catalog', 'Prepare offer', 'Follow up call', 'Send market report', 'Arrange second viewing', 'Negotiate terms', 'Submit documentation'];

function mapLead(l: GeneratedLead, idx: number, agents: ReturnType<typeof mapAgent>[]) {
  const agentNum = parseInt(l.assigned_agent.replace('agent-', ''), 10);
  const agent = agents[(agentNum - 1) % agents.length];
  const stageIdx = Math.abs(hashStr(l.id)) % STAGES.length;
  const contactIdx = Math.abs(hashStr(l.email)) % CONTACT_LABELS.length;
  const actionIdx = Math.abs(hashStr(l.name)) % NEXT_ACTIONS.length;

  return {
    id: idx + 1,
    name: l.name,
    email: l.email,
    phone: l.phone,
    status: l.status,
    priority: l.priority.toUpperCase(),
    amount: l.budget,
    stage: STAGES[stageIdx],
    agent_id: agent.id,
    agent_name: agent.name,
    last_contact: CONTACT_LABELS[contactIdx],
    next_action: NEXT_ACTIONS[actionIdx],
    notes: l.notes,
    property_interest: l.property_interest,
    source: l.source,
    score: l.score,
    nationality: l.nationality,
    tags: l.tags,
    budget_formatted: l.budgetFormatted,
    created_at: l.created_at,
  };
}

// ─── Properties → CRMItem ────────────────────────────────────

function mapProperty(p: GeneratedProperty) {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    location: p.location,
    type: p.type,
    purpose: p.purpose,
    price: p.price,
    priceFormatted: p.priceFormatted,
    beds: p.beds,
    bedrooms: p.beds,
    baths: p.baths,
    bathrooms: p.baths,
    sqft: p.sqft,
    amenities: p.amenities,
    images: p.images,
    image: p.image,
    featured: p.featured,
    yearBuilt: p.yearBuilt,
    status: p.status,
    agent: p.agent,
    views: p.views,
    inquiries: p.inquiries,
    listedDate: p.listedDate,
  };
}

// ─── Commissions → CRMItem ───────────────────────────────────

function mapCommission(c: GeneratedCommission, agents: ReturnType<typeof mapAgent>[]) {
  const agentNum = parseInt(c.agentId.replace('agent-', ''), 10);
  const agent = agents[(agentNum - 1) % agents.length];

  return {
    id: c.id,
    agent_id: agent.id,
    agentId: agent.id,
    agent_name: agent.name,
    transaction_id: c.transactionId,
    type: c.type,
    status: c.status,
    percentage: c.percentage,
    amount: c.amount,
    paid_to_agent: c.paidToAgent,
    paid_to_broker: c.paidToBroker,
    notes: c.notes,
    paid_at: c.paidAt,
    created_at: c.createdAt,
  };
}

// ─── Activities → CRMItem (matches DUMMY_ACTIVITIES shape) ───

function mapActivity(a: GeneratedActivity) {
  return {
    id: a.id,
    timestamp: a.timestamp,
    action: a.action,
    description: a.description,
    user: a.user,
    type: a.type,
    icon: a.icon,
  };
}

// ─── Overview data (computed from generated data) ─────────────

function buildOverview(
  agents: ReturnType<typeof mapAgent>[],
  leads: ReturnType<typeof mapLead>[],
  activities: ReturnType<typeof mapActivity>[],
) {
  const hotLeads = leads.filter(l => l.status === 'hot');
  const warmLeads = leads.filter(l => l.status === 'warm');
  const coldLeads = leads.filter(l => l.status === 'cold');
  const onlineAgents = agents.filter(a => a.status === 'online');

  return {
    metrics: {
      totalLeads: leads.length,
      hotLeads: hotLeads.length,
      warmLeads: warmLeads.length,
      coldLeads: coldLeads.length,
      agentsOnline: onlineAgents.length,
      agentsTotal: agents.length,
      conversionsThisMonth: Math.round(hotLeads.length * 0.4),
      revenuethisMonth: agents.reduce((s, a) => s + (a.revenue_generated / 12), 0),
      activeClients: Math.round(leads.length * 0.3),
      activeDeals: hotLeads.length + warmLeads.length,
      pendingPayments: Math.round(hotLeads.length * 0.2),
    },
    topAgents: agents.slice(0, 5),
    hotLeads: hotLeads.slice(0, 5),
    recentActivity: activities,
    performance: {
      thisMonth: {
        deals_closed: Math.round(hotLeads.length * 0.5),
        revenue: agents.reduce((s, a) => s + (a.revenue_generated / 12), 0),
        new_clients: Math.round(leads.length * 0.05),
        conversion_rate: hotLeads.length > 0 ? parseFloat(((hotLeads.length / leads.length) * 100).toFixed(1)) : 0,
      },
      lastMonth: {
        deals_closed: Math.round(hotLeads.length * 0.4),
        revenue: agents.reduce((s, a) => s + (a.revenue_generated / 14), 0),
        new_clients: Math.round(leads.length * 0.04),
        conversion_rate: hotLeads.length > 0 ? parseFloat(((hotLeads.length / leads.length) * 90).toFixed(1)) : 0,
      },
    },
  };
}

// ─── Simple string hash for deterministic mapping ─────────────

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return h;
}

// ─── Generate all dev data (called once at module load) ───────

function createDevData() {
  const fakerAgents = generateAgents(20, 99);
  const fakerLeads = generateLeads(100, 137);
  const fakerProperties = generateProperties(50, 42);
  const { commissions: fakerCommissions } = generateTransactions(30, 200);
  const fakerActivities = generateActivities(50, 400);

  const agents = fakerAgents.map((a, i) => mapAgent(a, i));
  const leads = fakerLeads.map((l, i) => mapLead(l, i, agents));
  const properties = fakerProperties.map(mapProperty);
  const commissions = fakerCommissions.map(c => mapCommission(c, agents));
  const activities = fakerActivities.map(mapActivity);
  const overview = buildOverview(agents, leads, activities);

  return { agents, leads, properties, commissions, activities, overview };
}

// Single generation — deterministic & cached
const DEV_DATA = createDevData();

export const DEV_AGENTS = DEV_DATA.agents;
export const DEV_LEADS = DEV_DATA.leads;
export const DEV_PROPERTIES = DEV_DATA.properties;
export const DEV_COMMISSIONS = DEV_DATA.commissions;
export const DEV_ACTIVITIES = DEV_DATA.activities;
export const DEV_OVERVIEW = DEV_DATA.overview;

// Also export clients derived from warm+ leads (matches DUMMY_CLIENTS shape)
export const DEV_CLIENTS = DEV_DATA.leads
  .filter(l => ['hot', 'warm', 'qualified', 'negotiation'].includes(l.status))
  .slice(0, 30)
  .map((l, i) => ({
    id: i + 1,
    name: l.name,
    email: l.email,
    phone: l.phone,
    type: l.tags.includes('Corporate') ? 'Corporate' : l.tags.includes('Investor') ? 'Investment Firm' : 'Individual',
    status: 'active',
    total_value: l.amount,
    last_contact: l.last_contact,
    agent_id: l.agent_id,
    agent_name: l.agent_name,
    properties_owned: Math.abs(hashStr(l.email)) % 8,
    deals_count: Math.abs(hashStr(l.name)) % 12 + 1,
    avatar_color: DEV_DATA.agents[(l.agent_id - 1) % DEV_DATA.agents.length]?.avatar_color || '#D4AF37',
  }));
