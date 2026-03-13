import { useSelector } from 'react-redux';
import { useMemo } from 'react';
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

interface RootState {
  navigation?: { activeRole?: string };
  auth?: { user?: any };
}

export function usePermissions() {
  const activeRole = useSelector((state: RootState) => state.navigation?.activeRole);
  const user = useSelector((state: RootState) => state.auth?.user);

  const permissions = useMemo(() => ({
    role: activeRole,
    isOwner: isOwner(activeRole),
    isAgent: isAgent(activeRole),
    permissions: getPermissionsForRole(activeRole),
    
    can: (permission: string) => hasPermission(activeRole ?? null, permission),
    canAny: (permissions: string[]) => hasAnyPermission(activeRole ?? null, permissions),
    canAll: (permissions: string[]) => hasAllPermissions(activeRole ?? null, permissions),
    canAccess: (featureId: string) => canAccessFeature(activeRole ?? null, featureId),
    
    canViewDashboard: hasPermission(activeRole, PERMISSIONS.VIEW_DASHBOARD),
    canEditProfile: hasPermission(activeRole, PERMISSIONS.EDIT_PROFILE),
    canViewProperties: hasPermission(activeRole, PERMISSIONS.VIEW_PROPERTIES),
    canCreateProperty: hasPermission(activeRole, PERMISSIONS.CREATE_PROPERTY),
    canEditProperty: hasPermission(activeRole, PERMISSIONS.EDIT_PROPERTY),
    canDeleteProperty: hasPermission(activeRole, PERMISSIONS.DELETE_PROPERTY),
    canViewLeads: hasPermission(activeRole, PERMISSIONS.VIEW_LEADS),
    canManageLeads: hasPermission(activeRole, PERMISSIONS.MANAGE_LEADS),
    canViewContracts: hasPermission(activeRole, PERMISSIONS.VIEW_CONTRACTS),
    canCreateContracts: hasPermission(activeRole, PERMISSIONS.CREATE_CONTRACTS),
    canSignContracts: hasPermission(activeRole, PERMISSIONS.SIGN_CONTRACTS),
    canViewPayments: hasPermission(activeRole, PERMISSIONS.VIEW_PAYMENTS),
    canProcessPayments: hasPermission(activeRole, PERMISSIONS.PROCESS_PAYMENTS),
    canViewAnalytics: hasPermission(activeRole, PERMISSIONS.VIEW_ANALYTICS),
    canViewSystemHealth: hasPermission(activeRole, PERMISSIONS.VIEW_SYSTEM_HEALTH),
    canManageUsers: hasPermission(activeRole, PERMISSIONS.MANAGE_USERS),
    canManageAgents: hasPermission(activeRole, PERMISSIONS.MANAGE_AGENTS),
    canAccessWhatsApp: hasPermission(activeRole, PERMISSIONS.ACCESS_WHATSAPP_BUSINESS),
    canConfigureChatbot: hasPermission(activeRole, PERMISSIONS.CONFIGURE_CHATBOT),
    canViewAllReports: hasPermission(activeRole, PERMISSIONS.VIEW_ALL_REPORTS),
    canModifySettings: hasPermission(activeRole, PERMISSIONS.MODIFY_SETTINGS)
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
