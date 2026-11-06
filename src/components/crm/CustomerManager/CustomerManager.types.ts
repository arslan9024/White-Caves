// FILE: src/components/crm/CustomerManager/CustomerManager.types.ts
/**
 * White Caves Real Estate LLC - Customer Relationship Management Types
 * Standard: AEGIS Canonical 12-Way Architecture Standard (Types - Tier 5)
 * Single Purpose File Law: < 350 lines
 */

export type CustomerType = 'LEAD' | 'TENANT' | 'BUYER' | 'LANDLORD' | 'INVESTOR';

export type LeadSource =
  | 'WHATSAPP'
  | 'PROPERTY_FINDER'
  | 'BAYUT'
  | 'DUBIZZLE'
  | 'REFERRAL'
  | 'DIRECT';

export interface CustomerInteraction {
  id: string;
  date: string;
  channel: 'WHATSAPP' | 'CALL' | 'EMAIL' | 'MEETING';
  notes: string;
  agentName: string;
}

export interface CustomerItem {
  id: string; // e.g. 'CUST-001'
  _id: string;
  customerCode: string; // e.g. 'WC-CUST-001'
  fullName: string;
  email: string;
  phone: string;
  customerType: CustomerType;
  source: LeadSource;
  currentStep: number; // 1 to 18
  stepName: string;
  preferredCommunity: string;
  budgetAED: number;
  assignedAgentId: string;
  assignedAgentName: string;
  activeDealId?: string;
  activePropertyId?: string;
  interactions: CustomerInteraction[];
  kycVerified: boolean;
  createdAt: string;
}
