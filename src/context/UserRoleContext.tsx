/**
 * UserRoleContext — 14-Role Sovereign Registry & Global RBAC Authority
 * Part of the White Caves Global Context Quartet:
 * (ThemeContext + LanguageContext + CurrencyContext + UserRoleContext)
 *
 * White Caves Real Estate LLC — Executive Security & RBAC Suite
 * License: DET 1388443 | RERA ORN 44483 | Ejari 0120250814005322
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  FC,
} from 'react';
import { safeStorage } from '../utils/safeStorage';

/**
 * The 14 Definitive Operational Sovereign Roles across 3 Tiers:
 *
 * Tier 1: Internal Corporate Machinery (The 1-12-108 Structure)
 * 1. managing_director (L5) — Founder & Executive MD (Arslan Malik)
 * 2. manager (L4)           — 12 Department Business Heads
 * 3. supervisor (L3)        — 108 Execution Team Leads
 * 4. agent (L2)             — Licensed Brokers / Sales & Leasing
 * 5. intern (L1)            — Trainee Brokers / Compliance Evaluators
 *
 * Tier 2: Paired Client Portal Channels
 * 6. tenant (L1)            — Leasing Channel / Ejari & Maintenance
 * 7. landlord (L2)          — Leasing Channel / Yields & Net Statements
 * 8. buyer (L1)             — Secondary Market / Secondary Asset Buyer & Form B
 * 9. seller (L1)            — Secondary Market / Asset Offloader & Form A
 * 10. offplan_buyer (L1)    — Off-Plan Market / Tier-1 Project Purchaser
 * 11. developer (L2)        — Off-Plan Market / Primary Developer Focal (Emaar, DAMAC)
 *
 * Tier 3: External Strategic & Operational Partners
 * 12. conveyancer (L2)      — DLD Registration Trustee / Title Deed Transfers
 * 13. contractor (L2)       — Third-Party Maintenance Contractor (DAMAC Hills 2)
 * 14. guest (L1)            — Public Consumer / Unauthenticated Guest
 */
export type UserRole =
  | 'managing_director'
  | 'manager'
  | 'supervisor'
  | 'agent'
  | 'intern'
  | 'tenant'
  | 'landlord'
  | 'buyer'
  | 'seller'
  | 'offplan_buyer'
  | 'developer'
  | 'conveyancer'
  | 'contractor'
  | 'guest'
  | 'admin';

export type AccessLevel = 1 | 2 | 3 | 4 | 5;

export type RoleTier = 'Tier 1: Internal Corporate' | 'Tier 2: Client Portals' | 'Tier 3: Strategic Partners';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  phone?: string;
  role: UserRole;
  accessLevel: AccessLevel;
  assignedDepartment?: string;
  isManagingDirector: boolean;
  isFounder: boolean;
  permissions: string[];
}

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
  guest: 'Executive Guest (Public)',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  managing_director: 'Full unrestricted governance across all 12 departments, 35 AI hubs, and ghost session simulator.',
  admin: 'System administration, access provisioning, and platform security oversight.',
  manager: 'Department P&L management, deal approvals, broker commission split review, and compliance gates.',
  supervisor: 'Lead distribution, 15-minute portal response SLA oversight, and junior broker co-signing.',
  agent: 'Active deal pipeline, personal assigned leads, verified Bayut/PropertyFinder webhooks, and contracts.',
  intern: 'Trainee onboarding workspace. Read-only leads requiring supervisor sign-off on deal operations.',
  tenant: 'Active Ejari contract repository, Form 7 rent matrices, and Henry AI 24/7 maintenance portal.',
  landlord: 'Net rental yield analytics, multi-currency statements, and real-time maintenance invoice payouts.',
  buyer: 'Curated luxury property pools, scheduled viewing calendars, and Form B digital signing sheets.',
  seller: 'Marketing performance dashboard, Trakheesi advertising permit tracker, and Form A mandate logs.',
  offplan_buyer: 'Construction milestone timeline, developer payment schedule reminders, and appreciation curves.',
  developer: 'Bulk inventory management, developer NOC approval processing, and agency rebate tracking.',
  conveyancer: 'DLD title deed registrations, transfer appointment verification, and corporate conveyancing.',
  contractor: 'Villa service ticket dispatch (DAMAC Hills 2), on-site repair photo uploads, and invoice submissions.',
  guest: 'Public cinematic showcase, interactive luxury map, and floating search & WhatsApp concierge.',
};

export const ROLE_DEFAULT_PERMISSIONS: Record<UserRole, string[]> = {
  managing_director: ['*'],
  admin: ['*'],
  manager: ['can_approve_deals', 'can_view_department_ledger', 'can_manage_team', 'can_create_contracts'],
  supervisor: ['can_assign_leads', 'can_override_sla', 'can_approve_intern_deals', 'can_create_contracts'],
  agent: ['can_read_assigned_leads', 'can_create_contracts', 'can_view_properties', 'can_use_calculators'],
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

/** Pre-configured demo identity profiles for 1-click role testing */
export const DEMO_ROLE_PROFILES: Record<UserRole, UserProfile> = {
  managing_director: {
    id: 'md_arslan_malik',
    name: 'Arslan Malik Bashir Ahmad',
    email: 'arslanmalikgoraha@gmail.com',
    phone: '+971505110636',
    role: 'managing_director',
    accessLevel: 5,
    assignedDepartment: 'Executive Directorate',
    isManagingDirector: true,
    isFounder: true,
    permissions: ['*'],
  },
  admin: {
    id: 'admin_sys',
    name: 'White Caves Admin',
    email: 'admin@whitecaves.com',
    phone: '+97148888888',
    role: 'admin',
    accessLevel: 5,
    assignedDepartment: 'Information Technology',
    isManagingDirector: true,
    isFounder: false,
    permissions: ['*'],
  },
  manager: {
    id: 'mgr_diana',
    name: 'Diana Prince (Sales Head)',
    email: 'diana.prince@whitecaves.com',
    phone: '+971501234561',
    role: 'manager',
    accessLevel: 4,
    assignedDepartment: 'Luxury Residential Sales',
    isManagingDirector: false,
    isFounder: false,
    permissions: ROLE_DEFAULT_PERMISSIONS.manager,
  },
  supervisor: {
    id: 'sup_rashid',
    name: 'Rashid Al Nuaimi (Team Lead)',
    email: 'rashid.lead@whitecaves.com',
    phone: '+971501234562',
    role: 'supervisor',
    accessLevel: 3,
    assignedDepartment: 'Downtown & Marina Squad',
    isManagingDirector: false,
    isFounder: false,
    permissions: ROLE_DEFAULT_PERMISSIONS.supervisor,
  },
  agent: {
    id: 'agent_sarah',
    name: 'Sarah Broker (Licensed Agent)',
    email: 'sarah.broker@whitecaves.com',
    phone: '+971501234563',
    role: 'agent',
    accessLevel: 2,
    assignedDepartment: 'Palm Jumeirah & Hills Luxury',
    isManagingDirector: false,
    isFounder: false,
    permissions: ROLE_DEFAULT_PERMISSIONS.agent,
  },
  intern: {
    id: 'intern_tariq',
    name: 'Tariq Mansour (Trainee)',
    email: 'tariq.intern@whitecaves.com',
    phone: '+971501234564',
    role: 'intern',
    accessLevel: 1,
    assignedDepartment: 'Broker Academy',
    isManagingDirector: false,
    isFounder: false,
    permissions: ROLE_DEFAULT_PERMISSIONS.intern,
  },
  tenant: {
    id: 'client_tenant_omar',
    name: 'Omar Farooq (DAMAC Hills 2 Tenant)',
    email: 'omar.tenant@gmail.com',
    phone: '+971509988771',
    role: 'tenant',
    accessLevel: 1,
    assignedDepartment: 'Client Leasing Portal',
    isManagingDirector: false,
    isFounder: false,
    permissions: ROLE_DEFAULT_PERMISSIONS.tenant,
  },
  landlord: {
    id: 'client_landlord_khalid',
    name: 'Sheikh Khalid (Portfolio Landlord)',
    email: 'khalid.landlord@gmail.com',
    phone: '+971509988772',
    role: 'landlord',
    accessLevel: 2,
    assignedDepartment: 'Asset Owner Portal',
    isManagingDirector: false,
    isFounder: false,
    permissions: ROLE_DEFAULT_PERMISSIONS.landlord,
  },
  buyer: {
    id: 'client_buyer_alex',
    name: 'Alexander Volkov (Luxury Buyer)',
    email: 'alex.buyer@investor.com',
    phone: '+971509988773',
    role: 'buyer',
    accessLevel: 1,
    assignedDepartment: 'Secondary Acquisition',
    isManagingDirector: false,
    isFounder: false,
    permissions: ROLE_DEFAULT_PERMISSIONS.buyer,
  },
  seller: {
    id: 'client_seller_fatima',
    name: 'Fatima Al Mansoori (Villa Seller)',
    email: 'fatima.seller@gmail.com',
    phone: '+971509988774',
    role: 'seller',
    accessLevel: 1,
    assignedDepartment: 'Secondary Listings',
    isManagingDirector: false,
    isFounder: false,
    permissions: ROLE_DEFAULT_PERMISSIONS.seller,
  },
  offplan_buyer: {
    id: 'client_offplan_pierre',
    name: 'Pierre Dubois (Off-Plan Investor)',
    email: 'pierre.offplan@pariswealth.fr',
    phone: '+33612345678',
    role: 'offplan_buyer',
    accessLevel: 1,
    assignedDepartment: 'Off-Plan Investment Portal',
    isManagingDirector: false,
    isFounder: false,
    permissions: ROLE_DEFAULT_PERMISSIONS.offplan_buyer,
  },
  developer: {
    id: 'dev_emaar_focal',
    name: 'Emaar Properties Representative',
    email: 'partners@emaar.ae',
    phone: '+97143673333',
    role: 'developer',
    accessLevel: 2,
    assignedDepartment: 'Primary Developer Network',
    isManagingDirector: false,
    isFounder: false,
    permissions: ROLE_DEFAULT_PERMISSIONS.developer,
  },
  conveyancer: {
    id: 'convey_dld_trustee',
    name: 'Al Twar Registration Trustee Office',
    email: 'trustee@al-twar-dld.ae',
    phone: '+97142630000',
    role: 'conveyancer',
    accessLevel: 2,
    assignedDepartment: 'DLD Conveyancing & Title Office',
    isManagingDirector: false,
    isFounder: false,
    permissions: ROLE_DEFAULT_PERMISSIONS.conveyancer,
  },
  contractor: {
    id: 'cont_apex_maint',
    name: 'Apex Engineering & Facilities (DH2)',
    email: 'support@apex-maint.ae',
    phone: '+97148899000',
    role: 'contractor',
    accessLevel: 2,
    assignedDepartment: 'Field Maintenance Contractor Pool',
    isManagingDirector: false,
    isFounder: false,
    permissions: ROLE_DEFAULT_PERMISSIONS.contractor,
  },
  guest: {
    id: 'guest_user',
    name: 'Executive Guest',
    email: 'guest@whitecaves.com',
    phone: '+971505110636',
    role: 'guest',
    accessLevel: 1,
    assignedDepartment: 'Public Portal',
    isManagingDirector: false,
    isFounder: false,
    permissions: ROLE_DEFAULT_PERMISSIONS.guest,
  },
};

export interface UserRoleContextType {
  user: UserProfile | null;
  role: UserRole;
  accessLevel: AccessLevel;
  isAuthenticated: boolean;
  isManagingDirector: boolean;
  isFounder: boolean;
  assignedDepartment: string;
  allRoles: UserRole[];
  hasPermission: (permission: string) => boolean;
  hasMinAccessLevel: (minLevel: AccessLevel) => boolean;
  login: (userData: Partial<UserProfile> & { email: string }, token?: string) => void;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  setAccessLevel: (level: AccessLevel) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

const SOVEREIGN_FOUNDER_EMAILS = [
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

const DEFAULT_GUEST_USER: UserProfile = DEMO_ROLE_PROFILES.guest;

interface UserRoleProviderProps {
  children: ReactNode;
  initialUser?: UserProfile | null;
}

export const UserRoleProvider: FC<UserRoleProviderProps> = ({ children, initialUser }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (initialUser !== undefined) return initialUser;

    if (typeof window !== 'undefined') {
      const stored = safeStorage.getJSON<UserProfile>('whitecaves_user');
      if (stored && stored.email) {
        const isFounder = SOVEREIGN_FOUNDER_EMAILS.some(
          e => e.toLowerCase() === stored.email.toLowerCase()
        );
        return {
          ...stored,
          accessLevel: isFounder ? 5 : stored.accessLevel || ROLE_DEFAULT_LEVELS[stored.role] || 1,
          isManagingDirector: isFounder || stored.role === 'managing_director' || stored.role === 'admin',
          isFounder,
          permissions: isFounder ? ['*'] : stored.permissions || ROLE_DEFAULT_PERMISSIONS[stored.role] || [],
        };
      }
    }
    return DEFAULT_GUEST_USER;
  });

  // Sync state to safe storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        safeStorage.setJSON('whitecaves_user', user);
        safeStorage.set('whitecaves_role', user.role);
        safeStorage.set('whitecaves_access_level', String(user.accessLevel));
      } else {
        safeStorage.remove('whitecaves_user');
        safeStorage.remove('whitecaves_role');
        safeStorage.remove('whitecaves_access_level');
      }
    }
  }, [user]);

  const isAuthenticated = useMemo(() => {
    return Boolean(user && user.role !== 'guest' && user.id !== 'guest_user');
  }, [user]);

  const isManagingDirector = useMemo(() => {
    if (!user) return false;
    return (
      user.isManagingDirector ||
      user.isFounder ||
      user.accessLevel === 5 ||
      SOVEREIGN_FOUNDER_EMAILS.some(e => e.toLowerCase() === user.email.toLowerCase())
    );
  }, [user]);

  const isFounder = useMemo(() => {
    if (!user) return false;
    return (
      user.isFounder ||
      SOVEREIGN_FOUNDER_EMAILS.some(e => e.toLowerCase() === user.email.toLowerCase())
    );
  }, [user]);

  const role = user?.role || 'guest';
  const accessLevel = user?.accessLevel || 1;
  const assignedDepartment = user?.assignedDepartment || 'General';

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      if (isManagingDirector || isFounder || user.permissions.includes('*')) return true;
      return user.permissions.includes(permission);
    },
    [user, isManagingDirector, isFounder]
  );

  const hasMinAccessLevel = useCallback(
    (minLevel: AccessLevel): boolean => {
      if (!user) return false;
      if (isManagingDirector || isFounder) return true;
      return user.accessLevel >= minLevel;
    },
    [user, isManagingDirector, isFounder]
  );

  const login = useCallback(
    (userData: Partial<UserProfile> & { email: string }, token?: string) => {
      const isFounderUser = SOVEREIGN_FOUNDER_EMAILS.some(
        e => e.toLowerCase() === userData.email.toLowerCase()
      );
      const defaultRole = isFounderUser ? 'managing_director' : userData.role || 'buyer';
      const defaultLevel = isFounderUser ? 5 : userData.accessLevel || ROLE_DEFAULT_LEVELS[defaultRole] || 2;

      const newUser: UserProfile = {
        id: userData.id || `user_${Date.now()}`,
        name: userData.name || (isFounderUser ? 'Arslan Malik Bashir Ahmad' : 'White Caves User'),
        email: userData.email,
        photoURL:
          userData.photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            userData.name || 'User'
          )}&background=EF4444&color=fff`,
        phone: userData.phone || '+971505110636',
        role: defaultRole,
        accessLevel: defaultLevel,
        assignedDepartment: userData.assignedDepartment || (isFounderUser ? 'Executive Directorate' : 'Client Services'),
        isManagingDirector: isFounderUser || defaultRole === 'managing_director' || defaultRole === 'admin',
        isFounder: isFounderUser,
        permissions: isFounderUser
          ? ['*']
          : userData.permissions || ROLE_DEFAULT_PERMISSIONS[defaultRole] || ['can_view_properties'],
      };

      setUser(newUser);
      if (token) {
        safeStorage.set('whitecaves_token', token);
      }
    },
    []
  );

  /** Fast 1-click login as any of the 14 Sovereign roles */
  const loginAsRole = useCallback((targetRole: UserRole) => {
    const demoProfile = DEMO_ROLE_PROFILES[targetRole] || DEMO_ROLE_PROFILES.guest;
    setUser(demoProfile);
    safeStorage.setJSON('whitecaves_user', demoProfile);
    safeStorage.set('whitecaves_role', demoProfile.role);
    safeStorage.set('whitecaves_access_level', String(demoProfile.accessLevel));
  }, []);

  const logout = useCallback(() => {
    setUser(DEFAULT_GUEST_USER);
    safeStorage.remove('whitecaves_token');
    safeStorage.remove('whitecaves_user');
    safeStorage.set('whitecaves_role', 'guest');
    safeStorage.set('whitecaves_access_level', '1');
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    setUser(prev => {
      if (!prev) return DEMO_ROLE_PROFILES[newRole];
      const isFounderUser = SOVEREIGN_FOUNDER_EMAILS.some(
        e => e.toLowerCase() === prev.email.toLowerCase()
      );
      const newLevel = isFounderUser ? 5 : ROLE_DEFAULT_LEVELS[newRole] || 1;
      return {
        ...prev,
        role: newRole,
        accessLevel: newLevel,
        isManagingDirector: isFounderUser || newRole === 'managing_director' || newRole === 'admin',
        permissions: isFounderUser ? ['*'] : ROLE_DEFAULT_PERMISSIONS[newRole] || ['can_view_properties'],
      };
    });
  }, []);

  const setAccessLevel = useCallback((level: AccessLevel) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        accessLevel: level,
      };
    });
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...updates,
      };
    });
  }, []);

  const value = useMemo<UserRoleContextType>(
    () => ({
      user,
      role,
      accessLevel,
      isAuthenticated,
      isManagingDirector,
      isFounder,
      assignedDepartment,
      allRoles: ALL_SOVEREIGN_ROLES,
      hasPermission,
      hasMinAccessLevel,
      login,
      loginAsRole,
      logout,
      switchRole,
      setAccessLevel,
      updateProfile,
    }),
    [
      user,
      role,
      accessLevel,
      isAuthenticated,
      isManagingDirector,
      isFounder,
      assignedDepartment,
      hasPermission,
      hasMinAccessLevel,
      login,
      loginAsRole,
      logout,
      switchRole,
      setAccessLevel,
      updateProfile,
    ]
  );

  return <UserRoleContext.Provider value={value}>{children}</UserRoleContext.Provider>;
};

export const useUserRole = (): UserRoleContextType => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};

export default UserRoleContext;
