import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import type { RootState } from '../store/store';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isOwner,
  isAgent,
  canAccessFeature,
  getPermissionsForRole,
  PERMISSIONS,
  ROLES
} from '../utils/permissions';

interface UsePermissionsReturn {
  role: string | null;
  isOwner: boolean;
  isAgent: boolean;
  permissions: string[];
  can: (permission: string) => boolean;
  canAny: (permissions: string[]) => boolean;
  canAll: (permissions: string[]) => boolean;
  canAccess: (featureId: string) => boolean;
  canViewDashboard: boolean;
  canEditProfile: boolean;
  canViewProperties: boolean;
  canCreateProperty: boolean;
  canEditProperty: boolean;
  canDeleteProperty: boolean;
  canViewLeads: boolean;
  canManageLeads: boolean;
  canViewContracts: boolean;
  canCreateContracts: boolean;
  canSignContracts: boolean;
  canViewPayments: boolean;
  canProcessPayments: boolean;
  canViewAnalytics: boolean;
  canViewSystemHealth: boolean;
  canManageUsers: boolean;
  canManageAgents: boolean;
  canAccessWhatsApp: boolean;
  canConfigureChatbot: boolean;
  canViewAllReports: boolean;
  canModifySettings: boolean;
}

export function usePermissions(): UsePermissionsReturn {
  const activeRole = useSelector((state: RootState) => state.navigation?.activeRole);

  const permissions = useMemo(() => ({
    role: activeRole ?? null,
    isOwner: isOwner(activeRole ?? ''),
    isAgent: isAgent(activeRole ?? ''),
    permissions: getPermissionsForRole(activeRole ?? ''),
    
    can: (permission: string) => hasPermission(activeRole ?? null, permission),
    canAny: (permissions: string[]) => hasAnyPermission(activeRole ?? null, permissions),
    canAll: (permissions: string[]) => hasAllPermissions(activeRole ?? null, permissions),
    canAccess: (featureId: string) => canAccessFeature(activeRole ?? null, featureId),
    
    canViewDashboard: hasPermission(activeRole ?? null, PERMISSIONS.VIEW_DASHBOARD),
    canEditProfile: hasPermission(activeRole ?? null, PERMISSIONS.EDIT_PROFILE),
    canViewProperties: hasPermission(activeRole ?? null, PERMISSIONS.VIEW_PROPERTIES),
    canCreateProperty: hasPermission(activeRole ?? null, PERMISSIONS.CREATE_PROPERTY),
    canEditProperty: hasPermission(activeRole ?? null, PERMISSIONS.EDIT_PROPERTY),
    canDeleteProperty: hasPermission(activeRole ?? null, PERMISSIONS.DELETE_PROPERTY),
    canViewLeads: hasPermission(activeRole ?? null, PERMISSIONS.VIEW_LEADS),
    canManageLeads: hasPermission(activeRole ?? null, PERMISSIONS.MANAGE_LEADS),
    canViewContracts: hasPermission(activeRole ?? null, PERMISSIONS.VIEW_CONTRACTS),
    canCreateContracts: hasPermission(activeRole ?? null, PERMISSIONS.CREATE_CONTRACTS),
    canSignContracts: hasPermission(activeRole ?? null, PERMISSIONS.SIGN_CONTRACTS),
    canViewPayments: hasPermission(activeRole ?? null, PERMISSIONS.VIEW_PAYMENTS),
    canProcessPayments: hasPermission(activeRole ?? null, PERMISSIONS.PROCESS_PAYMENTS),
    canViewAnalytics: hasPermission(activeRole ?? null, PERMISSIONS.VIEW_ANALYTICS),
    canViewSystemHealth: hasPermission(activeRole ?? null, PERMISSIONS.VIEW_SYSTEM_HEALTH),
    canManageUsers: hasPermission(activeRole ?? null, PERMISSIONS.MANAGE_USERS),
    canManageAgents: hasPermission(activeRole ?? null, PERMISSIONS.MANAGE_AGENTS),
    canAccessWhatsApp: hasPermission(activeRole ?? null, PERMISSIONS.ACCESS_WHATSAPP_BUSINESS),
    canConfigureChatbot: hasPermission(activeRole ?? null, PERMISSIONS.CONFIGURE_CHATBOT),
    canViewAllReports: hasPermission(activeRole ?? null, PERMISSIONS.VIEW_ALL_REPORTS),
    canModifySettings: hasPermission(activeRole ?? null, PERMISSIONS.MODIFY_SETTINGS)
  }), [activeRole]);

  return permissions;
}

export function useCanAccess(permission: string) {
  const activeRole = useSelector((state: RootState) => state.navigation?.activeRole);
  return useMemo(() => hasPermission(activeRole ?? null, permission), [activeRole, permission]);
}

export function useIsOwner() {
  const activeRole = useSelector((state: RootState) => state.navigation?.activeRole);
  return useMemo(() => isOwner(activeRole ?? null), [activeRole]);
}

export function useIsAgent() {
  const activeRole = useSelector((state: RootState) => state.navigation?.activeRole);
  return useMemo(() => isAgent(activeRole ?? null), [activeRole]);
}

export { PERMISSIONS, ROLES };
