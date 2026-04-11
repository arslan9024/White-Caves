/**
 * Faker Data Generators — White Caves Dubai CRM
 * ===============================================
 * Realistic demo data for 50+ properties, 20+ agents, 100+ leads.
 * No external dependencies — pure TypeScript with seeded randomness.
 *
 * Usage:
 *   import { generateProperties, generateAgents, generateLeads } from '../utils/faker';
 *   const properties = generateProperties(50);
 *   const agents = generateAgents(20);
 *   const leads = generateLeads(100);
 */

export { generateProperties, DUBAI_COMMUNITIES, PROPERTY_TYPES, AMENITIES } from './properties';
export { generateAgents, AGENT_DEPARTMENTS } from './agents';
export { generateLeads, LEAD_SOURCES, LEAD_STATUSES } from './leads';
export { generateTransactions, TRANSACTION_TYPES, TRANSACTION_STATUSES, COMMISSION_TYPES, COMMISSION_STATUSES } from './transactions';
export { generateConversations, generateActivities, CONVERSATION_STATUSES, CONVERSATION_PRIORITIES, ACTIVITY_TYPES } from './conversations';

export type { GeneratedProperty } from './properties';
export type { GeneratedAgent } from './agents';
export type { GeneratedLead } from './leads';
export type { GeneratedTransaction, GeneratedCommission } from './transactions';
export type { GeneratedConversation, GeneratedMessage, GeneratedActivity } from './conversations';
export type { Rng } from './rng';
export { createRng } from './rng';
