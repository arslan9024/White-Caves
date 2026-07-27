/**
 * companyCore.ts — White Caves Real Estate LLC Core Type Definitions
 * =================================================================
 * Defines the canonical TypeScript interfaces for the 10-department
 * corporate structure, 100-user personnel ledger, and 100-property
 * portfolio used for high-fidelity offline CRM demos.
 *
 * Brand Palette: #EF4444 | #FFFFFF | #1E293B
 * Founder Short-Circuit: arslanmalikgoraha@gmail.com → accessLevel: 5 (LEVEL_5_MASTER)
 */

// ── Access Level Enum ─────────────────────────────────────────────────────────

export type AccessLevel = 1 | 2 | 3 | 4 | 5;

export const ACCESS_LEVEL_LABELS: Record<AccessLevel, string> = {
  1: 'LEVEL_1_READ',
  2: 'LEVEL_2_RESTRICTED',
  3: 'LEVEL_3_POWER',
  4: 'LEVEL_4_DEPT_HEAD',
  5: 'LEVEL_5_MASTER',
};

// ── Department ────────────────────────────────────────────────────────────────

export type DepartmentId =
  | 'sales'
  | 'operations'
  | 'communications'
  | 'finance'
  | 'marketing'
  | 'executive'
  | 'compliance'
  | 'technology'
  | 'legal'
  | 'intelligence';

export interface Department {
  id: DepartmentId;
  name: string;
  icon: string;
  primaryApiEndpoint: string;
  headCount: number;
  activeLeads: number;
  monthlyRevenueAED: number;
  brandAccentHex: string;
  path: string;
}

// ── Personnel / User ──────────────────────────────────────────────────────────

export type PropertyStatus = 'Available' | 'Leased' | 'UnderMaintenance';

export interface CommissionRule {
  /** Agent's share of gross commission as decimal (0.5 = 50%) */
  agentSplit: number;
  /** Company's retention share */
  companySplit: number;
  /** Tier label */
  tierName: string;
}

export interface Personnel {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleTitle: string;
  assignedDepartment: DepartmentId;
  accessLevel: AccessLevel;
  phone: string;
  nationalityCode: string;
  commissionRule: CommissionRule;
  joinedDate: string;
  isActive: boolean;
  avatarUrl: string;
}

// ── Property ──────────────────────────────────────────────────────────────────

export interface Property {
  id: string;
  title: string;
  community: string;
  developer: string;
  priceAED: number;
  priceUSD: number;
  priceGBP: number;
  priceEUR: number;
  beds: number;
  baths: number;
  sqft: number;
  status: PropertyStatus;
  reraPermitNumber: string;
  imageUrl: string;
  lat: number;
  lng: number;
  listingDate: string;
}

// ── Master Ledger Root ────────────────────────────────────────────────────────

export interface CompanyMasterLedger {
  version: string;
  lastUpdated: string;
  departments: Department[];
  personnel: Personnel[];
  properties: Property[];
}
