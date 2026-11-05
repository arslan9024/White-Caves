/**
 * White Caves Real Estate LLC - Entity & Relationship Management Types
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Types)
 * Single Purpose File Law: < 350 lines
 */

export type EntityType =
  | 'USER'
  | 'EMPLOYEE'
  | 'ROLE'
  | 'PROPERTY'
  | 'CLIENT'
  | 'TENANT'
  | 'LANDLORD'
  | 'CONTRACT'
  | 'TASK'
  | 'DOCUMENT'
  | 'DEAL'
  | 'INVOICE'
  | 'CHEQUE'
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
}

export interface ERDRelation {
  id: string;
  from: string;
  to: string;
  label: string;
  multiplicity: string; // e.g. "1 to 0..*"
  type: 'COMPOSITION' | 'AGGREGATION' | 'ASSOCIATION';
  foreignKey: string;
}

export interface EntityNode {
  id: string; // e.g. 'user-001', 'emp-001', 'deal-001'
  name: string;
  type: EntityType;
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
