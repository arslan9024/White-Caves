/**
 * White Caves Real Estate LLC - Entity & Relationship Management Types
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Types)
 * Single Purpose File Law: < 350 lines
 */

export type EntityCategory = 'ACTOR' | 'OBJECT';

export type EntityType =
  // ── ACTORS (Who exists / Human & AI Agents) ──────────────────────────────────
  | 'USER'
  | 'EMPLOYEE'
  | 'ROLE'
  | 'STAFF_PROFILE'
  | 'CLIENT'
  | 'LANDLORD'
  | 'TENANT'
  | 'BUYER'
  | 'SELLER'
  | 'BROKER_AGENT'
  | 'AI_ASSISTANT'
  | 'CONTRACTOR'
  | 'CANDIDATE'
  | 'DEVELOPER'
  | 'REGISTRATION_TRUSTEE'
  | 'MORTGAGE_LENDER'
  | 'CORPORATE_SPV'
  | 'MOLLAK_ASSOCIATION'
  // ── OBJECTS (What exists / Assets, Accounts, Contracts, Receipts) ────────────
  | 'COMPANY'
  | 'BRANCH'
  | 'BANK_ACCOUNT'
  | 'PROPERTY'
  | 'PROPERTY_UNIT'
  | 'TITLE_DEED'
  | 'TENANCY_CONTRACT'
  | 'LEASE_ADDENDUM'
  | 'DEAL'
  | 'DEAL_PIPELINE'
  | 'TAX_INVOICE'
  | 'CHEQUE'
  | 'ESCROW_DEPOSIT'
  | 'COMMISSION_RECORD'
  | 'COMMISSION_SPLIT'
  | 'KYC_RECORD'
  | 'TRAKHEESI_PERMIT'
  | 'NOC_CERTIFICATE'
  | 'VALUATION_REPORT'
  | 'MAINTENANCE_ORDER'
  | 'DOCUMENT'
  | 'AUDIT_LOG'
  | 'TASK'
  | 'REVENUE';

export type RelationshipTab = 'entities' | 'relationships' | 'erd';

export interface ERDAttribute {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  nullable?: boolean;
}

export interface ERDClassModel {
  name: string;
  stereotype: '«Entity»' | '«Control»' | '«Boundary»';
  domain: 'LEASING' | 'SALES' | 'GOVERNANCE' | 'FINANCE' | 'STATUTORY';
  attributes: ERDAttribute[];
  description?: string;
  x?: number;
  y?: number;
}

export interface ERDRelation {
  id: string;
  from: string;
  to: string;
  label: string;
  multiplicity: string; // e.g. "1 to 0..*"
  type: 'COMPOSITION' | 'AGGREGATION' | 'ASSOCIATION';
  foreignKey: string;
  actionVerb?: string; // Specific TMS Action Verb that established this link (TURING-SEPARATION-010)
  actionTaskId?: string; // Linked TMS Task Code (e.g. 'TSK-001', 'TSK-002')
  departmentCode?: string; // Governing Canonical Department Code ('DEPT-01' to 'DEPT-12')
}

export interface EntityNode {
  id: string; // e.g. 'user-001', 'emp-001', 'deal-001'
  name: string;
  type: EntityType;
  category?: EntityCategory; // 'ACTOR' vs 'OBJECT' (Strict Turing Law 010)
  badge: string;
  description: string;
  color: string;
  status?: string;
  deepRoute?: string;
  details: Record<string, string | number | boolean>;
}

export interface RelationshipEdge {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  type?: string;
}

export interface RelationshipChain {
  id: string; // e.g. 'REL-001'
  name: string;
  dealNumber: string;
  summary: string;
  nodes: EntityNode[];
  edges: RelationshipEdge[];
  grossRevenueAED: number;
  meritXPAwarded: number;
}
