// FILE: src/context/UserRoleContext.data.ts
/**
 * White Caves Real Estate LLC - Sovereign Role Profiles, Permissions & Defaults
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 */

import { safeStorage } from '../utils/safeStorage';
import type { UserRole, AccessLevel, RoleTier, UserProfile } from './UserRoleContext.types';

export const ROLE_DEFAULT_LEVELS: Record<UserRole, AccessLevel> = {
  managing_director: 5,
  admin: 5,
  manager: 4,
  supervisor: 3,
  agent: 2,
  landlord: 2,
  developer: 2,
  conveyancer: 2,
  contractor: 2,
  intern: 1,
  tenant: 1,
  buyer: 1,
  seller: 1,
  offplan_buyer: 1,
  guest: 1,
};

export const ROLE_TIERS: Record<UserRole, RoleTier> = {
  managing_director: 'Tier 1: Internal Corporate',
  admin: 'Tier 1: Internal Corporate',
  manager: 'Tier 1: Internal Corporate',
  supervisor: 'Tier 1: Internal Corporate',
  agent: 'Tier 1: Internal Corporate',
  intern: 'Tier 1: Internal Corporate',
  tenant: 'Tier 2: Client Portals',
  landlord: 'Tier 2: Client Portals',
  buyer: 'Tier 2: Client Portals',
  seller: 'Tier 2: Client Portals',
  offplan_buyer: 'Tier 2: Client Portals',
  developer: 'Tier 2: Client Portals',
  conveyancer: 'Tier 3: Strategic Partners',
  contractor: 'Tier 3: Strategic Partners',
  guest: 'Tier 3: Strategic Partners',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  managing_director: 'Managing Director (L5 Sovereign)',
  admin: 'System Administrator (L5)',
  manager: 'Department Manager (L4)',
  supervisor: 'Team Supervisor (L3)',
  agent: 'Licensed Broker (L2)',
  intern: 'Corporate Intern (L1)',
  tenant: 'Leasing Tenant (Client)',
  landlord: 'Property Landlord (Asset Owner)',
  buyer: 'Secondary Buyer (Client)',
  seller: 'Property Seller (Mandate)',
  offplan_buyer: 'Off-Plan Purchaser (HNWI)',
  developer: 'Primary Developer Partner',
  conveyancer: 'DLD Conveyancer / Trustee',
  contractor: 'Maintenance Contractor',
  guest: 'Executive Guest (Unconfirmed)',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  managing_director:
    'Full unrestricted governance across all 12 departments, 35 AI hubs, and ghost session simulator.',
  admin: 'System administration, access provisioning, and platform security oversight.',
  manager:
    'Department P&L management, deal approvals, broker commission split review, and compliance gates.',
  supervisor:
    'Lead distribution, 15-minute portal response SLA oversight, and junior broker co-signing.',
  agent:
    'Active deal pipeline, personal assigned leads, verified Bayut/PropertyFinder webhooks, and contracts.',
  intern:
    'Trainee onboarding workspace. Read-only leads requiring supervisor sign-off on deal operations.',
  tenant:
    'Active Ejari contract repository, Form 7 rent matrices, and Henry AI 24/7 maintenance portal.',
  landlord:
    'Net rental yield analytics, multi-currency statements, and real-time maintenance invoice payouts.',
  buyer:
    'Curated luxury property pools, scheduled viewing calendars, and Form B digital signing sheets.',
  seller:
    'Marketing performance dashboard, Trakheesi advertising permit tracker, and Form A mandate logs.',
  offplan_buyer:
    'Construction milestone timeline, developer payment schedule reminders, and appreciation curves.',
  developer:
    'Bulk inventory management, developer NOC approval processing, and agency rebate tracking.',
  conveyancer:
    'DLD title deed registrations, transfer appointment verification, and corporate conveyancing.',
  contractor:
    'Villa service ticket dispatch (DAMAC Hills 2), on-site repair photo uploads, and invoice submissions.',
  guest:
    'Public cinematic showcase, interactive luxury map, and floating search & WhatsApp concierge.',
};

export const ROLE_DEFAULT_DEPARTMENTS: Record<UserRole, string> = {
  managing_director: 'Executive Directorate',
  admin: 'Information Technology',
  manager: 'Luxury Residential Sales',
  supervisor: 'Downtown & Marina Squad',
  agent: 'Palm Jumeirah & Hills Luxury',
  intern: 'Broker Academy',
  tenant: 'Client Leasing Portal',
  landlord: 'Asset Owner Portal',
  buyer: 'Secondary Acquisition',
  seller: 'Secondary Listings',
  offplan_buyer: 'Off-Plan Investment Portal',
  developer: 'Primary Developer Network',
  conveyancer: 'DLD Conveyancing & Title Office',
  contractor: 'Field Maintenance Contractor Pool',
  guest: 'Public Portal',
};

export const ROLE_DEFAULT_PERMISSIONS: Record<UserRole, string[]> = {
  managing_director: ['*'],
  admin: ['*'],
  manager: [
    'can_approve_deals',
    'can_view_department_ledger',
    'can_manage_team',
    'can_create_contracts',
  ],
  supervisor: [
    'can_assign_leads',
    'can_override_sla',
    'can_approve_intern_deals',
    'can_create_contracts',
  ],
  agent: [
    'can_read_assigned_leads',
    'can_create_contracts',
    'can_view_properties',
    'can_use_calculators',
  ],
  intern: ['can_read_assigned_leads', 'can_view_properties', 'can_use_calculators'],
  tenant: ['can_view_my_ejari', 'can_create_maintenance_ticket', 'can_view_properties'],
  landlord: ['can_view_my_yields', 'can_view_my_statements', 'can_approve_maintenance_quotes'],
  buyer: ['can_view_properties', 'can_schedule_viewings', 'can_sign_form_b', 'can_use_calculators'],
  seller: ['can_view_marketing_metrics', 'can_sign_form_a', 'can_view_offers'],
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
  'managing_director',
  'manager',
  'supervisor',
  'agent',
  'intern',
  'tenant',
  'landlord',
  'buyer',
  'seller',
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
  isFounder = false
): UserProfile {
  return {
    id,
    name,
    email,
    phone,
    role,
    accessLevel: ROLE_DEFAULT_LEVELS[role],
    assignedDepartment: ROLE_DEFAULT_DEPARTMENTS[role],
    isManagingDirector: isFounder || role === 'managing_director' || role === 'admin',
    isFounder,
    isRoleConfirmed: role !== 'guest',
    permissions: ROLE_DEFAULT_PERMISSIONS[role],
  };
}

const DEMO_SEED_SPEC: string[] = [
  'managing_director|md_arslan_malik|Arslan Malik Bashir Ahmad|arslanmalikgoraha@gmail.com|+971505110636|1',
  'admin|admin_sys_1|Elena Vance (System Admin)|admin@whitecaves.com|+971501234560',
  'manager|mgr_victoria|Victoria Sterling (Sales Director)|victoria@whitecaves.com|+971501234561',
  'supervisor|sup_nadia|Nadia Al-Mansoor (Team Lead)|nadia@whitecaves.com|+971501234562',
  'agent|agent_sarah|Sarah Broker (Licensed Agent)|sarah.broker@whitecaves.com|+971501234563',
  'intern|intern_tariq|Tariq Mansour (Trainee)|tariq.intern@whitecaves.com|+971501234564',
  'tenant|client_tenant_omar|Omar Farooq (DAMAC Hills 2 Tenant)|omar.tenant@gmail.com|+971509988771',
  'landlord|client_landlord_khalid|Sheikh Khalid (Portfolio Landlord)|khalid.landlord@gmail.com|+971509988772',
  'buyer|client_buyer_alex|Alexander Volkov (Luxury Buyer)|alex.buyer@investor.com|+971509988773',
  'seller|client_seller_fatima|Fatima Al Mansoori (Villa Seller)|fatima.seller@gmail.com|+971509988774',
  'offplan_buyer|client_offplan_pierre|Pierre Dubois (Off-Plan Investor)|pierre.offplan@pariswealth.fr|+33612345678',
  'developer|dev_emaar_focal|Emaar Properties Representative|partners@emaar.ae|+97143673333',
  'conveyancer|convey_dld_trustee|Al Twar Registration Trustee Office|trustee@al-twar-dld.ae|+97142630000',
  'contractor|cont_apex_maint|Apex Engineering & Facilities (DH2)|support@apex-maint.ae|+97148899000',
  'guest|guest_user|Executive Guest|guest@whitecaves.com|+971505110636',
];

export const DEMO_ROLE_PROFILES = Object.fromEntries(
  DEMO_SEED_SPEC.map(spec => {
    const [role, id, name, email, phone, founderFlag] = spec.split('|');
    return [
      role,
      createDemoRoleProfile(role as UserRole, id, name, email, phone, founderFlag === '1'),
    ];
  })
) as Record<UserRole, UserProfile>;

export const DEFAULT_GUEST_USER: UserProfile = DEMO_ROLE_PROFILES.guest;

export function buildSovereignProfile(data: Partial<UserProfile> & { email: string }): UserProfile {
  const isFounderUser = SOVEREIGN_FOUNDER_EMAILS.some(
    e => e.toLowerCase() === data.email.toLowerCase()
  );
  const effectiveRole: UserRole = isFounderUser ? 'managing_director' : data.role || 'guest';
  const effectiveLevel: AccessLevel = isFounderUser
    ? 5
    : data.accessLevel || ROLE_DEFAULT_LEVELS[effectiveRole] || 1;
  const isConfirmed = isFounderUser ? true : (data.isRoleConfirmed ?? effectiveRole !== 'guest');

  return {
    id: data.id || `user_${Date.now()}`,
    name: data.name || (isFounderUser ? 'Arslan Malik Bashir Ahmad' : 'White Caves User'),
    email: data.email,
    photoURL:
      data.photoURL ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        data.name || 'User'
      )}&background=EF4444&color=fff`,
    phone: data.phone || '+971505110636',
    role: effectiveRole,
    accessLevel: effectiveLevel,
    assignedDepartment: data.assignedDepartment || ROLE_DEFAULT_DEPARTMENTS[effectiveRole],
    isManagingDirector:
      isFounderUser || effectiveRole === 'managing_director' || effectiveRole === 'admin',
    isFounder: isFounderUser,
    isRoleConfirmed: isConfirmed,
    permissions: isFounderUser
      ? ['*']
      : data.permissions || ROLE_DEFAULT_PERMISSIONS[effectiveRole] || ['can_view_properties'],
  };
}

export function syncUserToSafeStorage(user: UserProfile | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    safeStorage.setJSON('whitecaves_user', user);
    safeStorage.set('whitecaves_role', user.role);
    safeStorage.set('whitecaves_access_level', String(user.accessLevel));
    safeStorage.setJSON('userRole', {
      category: ROLE_TIERS[user.role],
      role: user.role,
      status: 'active',
      locked: true,
    });
    try {
      localStorage.setItem('white-caves-user', JSON.stringify(user));
      localStorage.setItem('whitecaves_user', JSON.stringify(user));
    } catch {
      // ignore storage quota errors
    }
  } else {
    safeStorage.remove('whitecaves_user');
    safeStorage.remove('whitecaves_role');
    safeStorage.remove('whitecaves_access_level');
    safeStorage.remove('userRole');
    try {
      localStorage.removeItem('white-caves-user');
      localStorage.removeItem('whitecaves_user');
    } catch {
      // ignore
    }
  }
}
