// FILE: src/components/crm/RoleManager/RoleManager.data.ts
/**
 * White Caves Real Estate LLC - Role Manager Static Seeds & Role Registry (Tier 4)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import type { SovereignRoleDefinition } from './RoleManager.types';
import { ROLE_DEFAULT_PERMISSIONS } from '../../../context/UserRoleContext';

export const CANONICAL_SOVEREIGN_ROLES: SovereignRoleDefinition[] = [
  // ── Tier 1: Internal Corporate Machinery (The 1-12-108 Grid)
  {
    id: 'managing_director',
    code: 'MD-01',
    name: 'Managing Director (Founder)',
    tier: 'Tier 1: Internal Corporate',
    accessLevel: 5,
    department: 'Executive Directorate',
    description:
      'Sovereign founder clearance with absolute control over all 12 departments, escrow, and statutory filings.',
    permissions: ['*'],
    assignedCount: 1,
    isExecutive: true,
    canImpersonate: true,
  },
  {
    id: 'admin',
    code: 'SYS-ADMIN',
    name: 'Enterprise System Administrator',
    tier: 'Tier 1: Internal Corporate',
    accessLevel: 5,
    department: 'Information Technology',
    description: 'Full infrastructure and security operations authority.',
    permissions: ['*'],
    assignedCount: 2,
    isExecutive: true,
    canImpersonate: true,
  },
  {
    id: 'manager',
    code: 'MGR-01..12',
    name: 'Department Business Head',
    tier: 'Tier 1: Internal Corporate',
    accessLevel: 4,
    department: '12 Corporate Departments',
    description:
      'Directs functional divisions, approves high-value transactions, and monitors floor SLAs.',
    permissions: ROLE_DEFAULT_PERMISSIONS.manager,
    assignedCount: 12,
    isExecutive: true,
    canImpersonate: false,
  },
  {
    id: 'supervisor',
    code: 'SUP-001..108',
    name: 'Execution Team Lead',
    tier: 'Tier 1: Internal Corporate',
    accessLevel: 3,
    department: '108 Execution Squads',
    description:
      'Manages broker task assignments, RUP use case workflows, and document quality audits.',
    permissions: ROLE_DEFAULT_PERMISSIONS.supervisor,
    assignedCount: 108,
    isExecutive: false,
    canImpersonate: false,
  },
  {
    id: 'agent',
    code: 'BRK-LICENSED',
    name: 'Licensed Broker / Consultant',
    tier: 'Tier 1: Internal Corporate',
    accessLevel: 2,
    department: 'Sales & Leasing Operations',
    description:
      'RERA certified agent managing client deals, viewings, offers, and Form A/B submissions.',
    permissions: ROLE_DEFAULT_PERMISSIONS.agent,
    assignedCount: 45,
    isExecutive: false,
    canImpersonate: false,
  },
  {
    id: 'intern',
    code: 'TRN-BROKER',
    name: 'Trainee Broker / Evaluator',
    tier: 'Tier 1: Internal Corporate',
    accessLevel: 1,
    department: 'Broker Academy',
    description: 'Entry-level trainee conducting compliance verification and market research.',
    permissions: ROLE_DEFAULT_PERMISSIONS.intern,
    assignedCount: 8,
    isExecutive: false,
    canImpersonate: false,
  },

  // ── Tier 2: Paired Client Portal Channels
  {
    id: 'landlord',
    code: 'CLIENT-LL',
    name: 'Asset Owner (Landlord)',
    tier: 'Tier 2: Client Portals',
    accessLevel: 2,
    department: 'Asset Owner Portal',
    description:
      'Property investor managing owned assets, PDC cheque clearance, tenancy renewals, and net yield statements.',
    permissions: ROLE_DEFAULT_PERMISSIONS.landlord,
    assignedCount: 320,
    isExecutive: false,
    canImpersonate: false,
  },
  {
    id: 'tenant',
    code: 'CLIENT-TNT',
    name: 'Resident Tenant',
    tier: 'Tier 2: Client Portals',
    accessLevel: 1,
    department: 'Tenant Portal',
    description:
      'Residential or commercial tenant managing Ejari agreements, rent payments, and maintenance requests.',
    permissions: ROLE_DEFAULT_PERMISSIONS.tenant,
    assignedCount: 410,
    isExecutive: false,
    canImpersonate: false,
  },
  {
    id: 'buyer',
    code: 'CLIENT-BYR',
    name: 'Secondary Market Buyer',
    tier: 'Tier 2: Client Portals',
    accessLevel: 1,
    department: 'Acquisition Portal',
    description:
      'Investor or homebuyer viewing verified luxury listings, making offers, and tracking conveyancing.',
    permissions: ROLE_DEFAULT_PERMISSIONS.buyer,
    assignedCount: 195,
    isExecutive: false,
    canImpersonate: false,
  },
  {
    id: 'seller',
    code: 'CLIENT-SLR',
    name: 'Asset Offloader (Seller)',
    tier: 'Tier 2: Client Portals',
    accessLevel: 1,
    department: 'Listing Portal',
    description:
      'Property seller listing secondary market properties and managing Form A agency agreements.',
    permissions: ROLE_DEFAULT_PERMISSIONS.seller,
    assignedCount: 84,
    isExecutive: false,
    canImpersonate: false,
  },
  {
    id: 'offplan_buyer',
    code: 'CLIENT-OFP',
    name: 'Off-Plan Investor',
    tier: 'Tier 2: Client Portals',
    accessLevel: 1,
    department: 'Off-Plan Launch Portal',
    description:
      'International or local investor tracking stage payments, construction escrow, and developer milestones.',
    permissions: ROLE_DEFAULT_PERMISSIONS.offplan_buyer,
    assignedCount: 142,
    isExecutive: false,
    canImpersonate: false,
  },
  {
    id: 'developer',
    code: 'PARTNER-DEV',
    name: 'Primary Developer Representative',
    tier: 'Tier 2: Client Portals',
    accessLevel: 2,
    department: 'Developer Channel',
    description:
      'Developer focal point (e.g. Emaar, DAMAC) syncing off-plan unit allocations and commission claims.',
    permissions: ROLE_DEFAULT_PERMISSIONS.developer,
    assignedCount: 16,
    isExecutive: false,
    canImpersonate: false,
  },

  // ── Tier 3: External Strategic Partners & Public
  {
    id: 'conveyancer',
    code: 'PARTNER-CNV',
    name: 'DLD Registration Trustee',
    tier: 'Tier 3: Strategic Partners',
    accessLevel: 2,
    department: 'Conveyancing & Trustee Hub',
    description:
      'Authorized legal trustee facilitating title deed registrations and DLD portal escrow clearances.',
    permissions: ROLE_DEFAULT_PERMISSIONS.conveyancer,
    assignedCount: 6,
    isExecutive: false,
    canImpersonate: false,
  },
  {
    id: 'contractor',
    code: 'PARTNER-CTR',
    name: 'Maintenance Contractor',
    tier: 'Tier 3: Strategic Partners',
    accessLevel: 2,
    department: 'Facilities Maintenance Hub',
    description:
      'Field service provider fulfilling property snagging, fit-outs, and maintenance tickets.',
    permissions: ROLE_DEFAULT_PERMISSIONS.contractor,
    assignedCount: 22,
    isExecutive: false,
    canImpersonate: false,
  },
  {
    id: 'guest',
    code: 'PUBLIC-GUEST',
    name: 'Public Consumer (Guest)',
    tier: 'Tier 3: Strategic Partners',
    accessLevel: 1,
    department: 'Public Consumer Portal',
    description:
      'Unauthenticated or public consumer browsing public property listings and market insights.',
    permissions: ROLE_DEFAULT_PERMISSIONS.guest,
    assignedCount: 1200,
    isExecutive: false,
    canImpersonate: false,
  },
];
