// FILE: src/context/UserRoleContext.data.ts
/**
 * White Caves Real Estate LLC - Sovereign Role Profiles, Permissions & Defaults
 * Standard: Dual-Track 6x6 RBAC (6 Levels Internal Staff + 6 Categories External Clients)
 * Single Purpose File Law: < 350 lines
 */

import { safeStorage } from '../utils/safeStorage';
import type { UserRole, AccessLevel, RoleTier, UserProfile } from './UserRoleContext.types';

export const ROLE_DEFAULT_LEVELS: Record<UserRole, AccessLevel> = {
  // Track A: Internal Staff (6 Levels)
  managing_director: 6,
  director: 5,
  manager: 4,
  supervisor: 3,
  team_leader: 2,
  employee: 1,

  // Track B: External Clients & Partners (Scoped to Level 1-2 equivalents)
  landlord: 2,
  external_company: 2,
  external_agent: 2,
  seller: 2,
  buyer: 1,
  tenant: 1,

  // Legacy mappings
  admin: 6,
  agent: 1,
  intern: 1,
  developer: 2,
  conveyancer: 2,
  contractor: 2,
  offplan_buyer: 1,
  guest: 1,
};

export const ROLE_TIERS: Record<UserRole, RoleTier> = {
  // Track A: Internal Staff
  managing_director: 'Tier 1: Internal Corporate Staff',
  director: 'Tier 1: Internal Corporate Staff',
  manager: 'Tier 1: Internal Corporate Staff',
  supervisor: 'Tier 1: Internal Corporate Staff',
  team_leader: 'Tier 1: Internal Corporate Staff',
  employee: 'Tier 1: Internal Corporate Staff',

  // Track B: External Clients & Partners
  landlord: 'Tier 2: External Client Portals',
  tenant: 'Tier 2: External Client Portals',
  buyer: 'Tier 2: External Client Portals',
  seller: 'Tier 2: External Client Portals',
  external_agent: 'Tier 3: Strategic Partners & Unconfirmed',
  external_company: 'Tier 3: Strategic Partners & Unconfirmed',

  // Legacy mappings
  admin: 'Tier 1: Internal Corporate Staff',
  agent: 'Tier 1: Internal Corporate Staff',
  intern: 'Tier 1: Internal Corporate Staff',
  developer: 'Tier 3: Strategic Partners & Unconfirmed',
  conveyancer: 'Tier 3: Strategic Partners & Unconfirmed',
  contractor: 'Tier 3: Strategic Partners & Unconfirmed',
  offplan_buyer: 'Tier 2: External Client Portals',
  guest: 'Tier 3: Strategic Partners & Unconfirmed',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  // Track A: Internal Staff
  managing_director: 'Managing Director (Level 6 Sovereign)',
  director: 'Department Director (Level 5)',
  manager: 'Division Manager (Level 4)',
  supervisor: 'Task Supervisor (Level 3)',
  team_leader: 'Squad Team Leader (Level 2)',
  employee: 'Corporate Employee / Broker (Level 1)',

  // Track B: External Clients & Partners
  landlord: 'Landlord (Property Owner)',
  tenant: 'Tenant (Lease Signatory)',
  buyer: 'Buyer (Luxury Investor)',
  seller: 'Seller (Property Mandate)',
  external_agent: 'External Agent (RERA Co-Broker)',
  external_company: 'External Company (Developer / Bank / Partner)',

  // Legacy
  admin: 'System Administrator (Level 6)',
  agent: 'Licensed Broker (Level 1)',
  intern: 'Corporate Intern (Level 1)',
  offplan_buyer: 'Off-Plan Purchaser (HNWI)',
  developer: 'Master Developer Partner',
  conveyancer: 'DLD Conveyancer / Trustee',
  contractor: 'Facility Maintenance Contractor',
  guest: 'Executive Guest (Unconfirmed)',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  managing_director: 'Full sovereign governance across all corporate departments, financial ledgers, and executive decisions.',
  director: 'Strategic governance of corporate departments, P&L allocations, and departmental approvals.',
  manager: 'Division tactical management, deal verification, commission authorization, and operational workflows.',
  supervisor: 'Supervises operational squads, lead distribution SLAs, and squad execution metrics.',
  team_leader: 'Direct squad leadership, day-to-day task dispatch, and mentoring frontline employees.',
  employee: 'Frontline operations, client consultations, listing creation, and daily task execution.',

  landlord: 'Property asset owner portal. Net rental yields, tenancy agreements, and maintenance approvals.',
  tenant: 'Active tenant portal. Ejari documents, rental payment schedule, and maintenance requests.',
  buyer: 'Verified buyer portal. Luxury catalog viewing, Form B agreements, and private viewings.',
  seller: 'Mandated seller portal. Listing traction, marketing campaign stats, and Form A digital agreements.',
  external_agent: 'External RERA co-broker portal. Co-brokerage deal submissions, Form I agreements, and commission claims.',
  external_company: 'Corporate alliance portal. Master developer allocations, escrow bank updates, and legal conveyancing.',

  admin: 'Platform infrastructure administration, access provisioning, and system configuration.',
  agent: 'Frontline real estate broker operations.',
  intern: 'Trainee associate learning real estate operations.',
  offplan_buyer: 'Off-plan construction milestone tracker and payment reminders.',
  developer: 'Bulk property allocation and developer NOC issuance.',
  conveyancer: 'DLD title deed registrations and trustee transfers.',
  contractor: 'Maintenance work order dispatch and invoice uploads.',
  guest: 'Public visitor access to public showcase listings.',
};

export const ROLE_DEFAULT_DEPARTMENTS: Record<UserRole, string> = {
  managing_director: 'Corporate Executive Governance',
  director: 'Corporate Executive Governance',
  manager: 'Luxury Sales Operations',
  supervisor: 'Master Inventory Portfolio',
  team_leader: 'Luxury Sales Operations',
  employee: 'Luxury Sales Operations',

  landlord: 'Master Inventory Portfolio',
  tenant: 'VIP Client Hospitality',
  buyer: 'Luxury Sales Operations',
  seller: 'Master Inventory Portfolio',
  external_agent: 'Strategic Capital Alliances',
  external_company: 'Strategic Capital Alliances',

  admin: 'Cloud Systems Engineering',
  agent: 'Luxury Sales Operations',
  intern: 'VIP Client Hospitality',
  offplan_buyer: 'Strategic Capital Alliances',
  developer: 'Strategic Capital Alliances',
  conveyancer: 'Legal Statutory Compliance',
  contractor: 'Master Inventory Portfolio',
  guest: 'VIP Client Hospitality',
};

export const ROLE_DEFAULT_PERMISSIONS: Record<UserRole, string[]> = {
  managing_director: ['*'],
  admin: ['*'],
  director: [
    'can_approve_deals',
    'can_view_department_ledger',
    'can_manage_team',
    'can_create_contracts',
    'can_override_sla',
    'can_manage_budgets',
  ],
  manager: [
    'can_approve_deals',
    'can_view_department_ledger',
    'can_manage_team',
    'can_create_contracts',
    'can_override_sla',
  ],
  supervisor: [
    'can_assign_leads',
    'can_override_sla',
    'can_approve_intern_deals',
    'can_create_contracts',
  ],
  team_leader: [
    'can_read_assigned_leads',
    'can_create_contracts',
    'can_view_properties',
    'can_assign_leads',
  ],
  employee: [
    'can_read_assigned_leads',
    'can_create_contracts',
    'can_view_properties',
    'can_use_calculators',
  ],

  landlord: ['can_view_my_yields', 'can_view_my_statements', 'can_approve_maintenance_quotes'],
  tenant: ['can_view_my_ejari', 'can_create_maintenance_ticket', 'can_view_properties'],
  buyer: ['can_view_properties', 'can_schedule_viewings', 'can_sign_form_b', 'can_use_calculators'],
  seller: ['can_view_marketing_metrics', 'can_sign_form_a', 'can_view_offers'],
  external_agent: ['can_view_co_broker_listings', 'can_submit_offers', 'can_sign_form_i'],
  external_company: ['can_manage_bulk_allocations', 'can_issue_developer_noc', 'can_view_escrow_records'],

  agent: ['can_read_assigned_leads', 'can_create_contracts', 'can_view_properties', 'can_use_calculators'],
  intern: ['can_read_assigned_leads', 'can_view_properties', 'can_use_calculators'],
  offplan_buyer: ['can_track_construction', 'can_view_payment_schedule', 'can_view_properties'],
  developer: ['can_manage_inventory', 'can_issue_developer_noc', 'can_view_rebate_claims'],
  conveyancer: ['can_upload_title_deeds', 'can_verify_trustee_cheques', 'can_execute_transfers'],
  contractor: ['can_claim_service_tickets', 'can_upload_repair_photos', 'can_submit_invoices'],
  guest: ['can_view_properties', 'can_use_calculators'],
};

export const SOVEREIGN_FOUNDER_EMAILS: string[] = [
  'arslanmalikgoraha@gmail.com',
  'the.white.caves@gmail.com',
  'arslan@whitecaves.com',
];

export const ALL_SOVEREIGN_ROLES: UserRole[] = [
  // Track A: Internal Staff
  'managing_director',
  'director',
  'manager',
  'supervisor',
  'team_leader',
  'employee',

  // Track B: External Clients & Partners
  'landlord',
  'tenant',
  'buyer',
  'seller',
  'external_agent',
  'external_company',

  // Legacy mappings for backward compatibility
  'admin',
  'agent',
  'intern',
  'offplan_buyer',
  'developer',
  'conveyancer',
  'contractor',
  'guest',
];

function createDemoRoleProfile(
  role: UserRole,
  id: string,
  name: string,
  email: string,
  phone: string,
  isFounder: boolean
): UserProfile {
  const isMd = isFounder || role === 'managing_director' || role === 'admin';
  return {
    id,
    name,
    email,
    phone,
    role,
    accessLevel: isMd ? 6 : ROLE_DEFAULT_LEVELS[role] || 1,
    assignedDepartment: ROLE_DEFAULT_DEPARTMENTS[role] || 'Corporate Executive Governance',
    isManagingDirector: isMd,
    isFounder,
    isRoleConfirmed: role !== 'guest',
    permissions: isMd ? ['*'] : ROLE_DEFAULT_PERMISSIONS[role] || ['can_view_properties'],
  };
}

export const DEMO_ROLE_PROFILES: Record<UserRole, UserProfile> = {
  managing_director: createDemoRoleProfile('managing_director', 'EMP-001', 'Arslan Malik', 'arslanmalikgoraha@gmail.com', '+971505760056', true),
  director: createDemoRoleProfile('director', 'EMP-002', 'Layla Al-Maktoum', 'layla.dir@whitecaves.ae', '+971501112233', false),
  manager: createDemoRoleProfile('manager', 'EMP-003', 'Rashid Al-Nuaimi', 'rashid.mgr@whitecaves.ae', '+971502223344', false),
  supervisor: createDemoRoleProfile('supervisor', 'EMP-004', 'Mariam Al-Hashemi', 'mariam.sup@whitecaves.ae', '+971503334455', false),
  team_leader: createDemoRoleProfile('team_leader', 'EMP-005', 'Tariq Mansoor', 'tariq.lead@whitecaves.ae', '+971504445566', false),
  employee: createDemoRoleProfile('employee', 'EMP-006', 'Kareem Zaid', 'kareem.emp@whitecaves.ae', '+971505556677', false),

  landlord: createDemoRoleProfile('landlord', 'CLI-LL-001', 'Sheikh Mansoor Al-Nahyan', 'mansoor@alnahyan-holdings.ae', '+971507778899', false),
  tenant: createDemoRoleProfile('tenant', 'CLI-TN-001', 'Alexander Wright', 'alex.wright@techventures.ae', '+971508889900', false),
  buyer: createDemoRoleProfile('buyer', 'CLI-BY-001', 'Vikramaditya Singhania', 'vikram@singhaniacapital.ae', '+971509990011', false),
  seller: createDemoRoleProfile('seller', 'CLI-SL-001', 'Elena Rostova', 'elena.rostova@monacotrust.ch', '+971501234567', false),
  external_agent: createDemoRoleProfile('external_agent', 'PART-AG-001', 'David Gold (BetterHomes RERA #4912)', 'david.gold@partneragency.ae', '+971509876543', false),
  external_company: createDemoRoleProfile('external_company', 'PART-CO-001', 'Emaar Properties PJSC (Institutional)', 'institutional.relations@emaar.ae', '+971506543210', false),

  // Legacy mappings
  admin: createDemoRoleProfile('admin', 'SYS-001', 'System Administrator', 'admin@whitecaves.ae', '+971500000001', true),
  agent: createDemoRoleProfile('agent', 'EMP-006', 'Kareem Zaid', 'kareem.emp@whitecaves.ae', '+971505556677', false),
  intern: createDemoRoleProfile('intern', 'INT-001', 'Zayd Al-Nuaimi', 'zayd.intern@whitecaves.ae', '+971501231234', false),
  offplan_buyer: createDemoRoleProfile('offplan_buyer', 'CLI-BY-001', 'Vikramaditya Singhania', 'vikram@singhaniacapital.ae', '+971509990011', false),
  developer: createDemoRoleProfile('developer', 'PART-CO-001', 'Emaar Properties PJSC', 'institutional.relations@emaar.ae', '+971506543210', false),
  conveyancer: createDemoRoleProfile('conveyancer', 'PART-CV-001', 'Al Tamimi & Company', 'conveyancing@tamimi.ae', '+971501119999', false),
  contractor: createDemoRoleProfile('contractor', 'VND-001', 'Emirates Facilities Management', 'dispatch@efm-uae.ae', '+971504448888', false),
  guest: createDemoRoleProfile('guest', 'GST-001', 'Executive Guest', 'guest@whitecaves.ae', '+971500000000', false),
};

export function normalizeSovereignRole(rawRole?: string | null, isFounder = false): UserRole {
  if (isFounder) return 'managing_director';
  const r = String(rawRole || '').toLowerCase().trim();
  if (r === 'owner') return 'managing_director';
  if (r === 'lead' || r === 'squad_leader') return 'team_leader';
  if (r === 'staff') return 'employee';
  return (r in ROLE_DEFAULT_LEVELS) ? (r as UserRole) : 'guest';
}

export function loadStoredRoleProfile(isFounderUser = false): UserProfile {
  const data = safeStorage.getJSON<Partial<UserProfile>>('userRole', {});
  const effectiveRole: UserRole = normalizeSovereignRole(data.role, isFounderUser);
  const isMdRole = isFounderUser || effectiveRole === 'managing_director' || effectiveRole === 'admin';
  const effectiveLevel: AccessLevel = isMdRole
    ? 6
    : (data.accessLevel as AccessLevel) || ROLE_DEFAULT_LEVELS[effectiveRole] || 1;
  const isConfirmed = isMdRole ? true : (data.isRoleConfirmed ?? effectiveRole !== 'guest');

  return {
    id: data.id || (isMdRole ? 'EMP-001' : 'GST-001'),
    name: data.name || (isMdRole ? 'Arslan Malik' : 'Executive Guest'),
    email: data.email || (isMdRole ? 'arslanmalikgoraha@gmail.com' : 'guest@whitecaves.ae'),
    phone: data.phone || '+971505760056',
    role: effectiveRole,
    accessLevel: effectiveLevel,
    assignedDepartment: data.assignedDepartment || ROLE_DEFAULT_DEPARTMENTS[effectiveRole],
    isManagingDirector: isMdRole,
    isFounder: isFounderUser,
    isRoleConfirmed: isConfirmed,
    permissions: isMdRole
      ? ['*']
      : data.permissions || ROLE_DEFAULT_PERMISSIONS[effectiveRole] || ['can_view_properties'],
  };
}

export function persistRoleProfile(user: UserProfile): void {
  safeStorage.setJSON('userRole', user);
}
