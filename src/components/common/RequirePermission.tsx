import React, { type ReactNode, type ComponentType } from 'react';
import { hasPermission, hasAnyPermission, hasAllPermissions, canAccessFeature, isOwner } from '../../utils/permissions';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

interface RequirePermissionProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  featureId?: string;
  ownerOnly?: boolean;
  roles?: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function RequirePermission({ 
  permission, 
  permissions,
  requireAll = false,
  featureId,
  ownerOnly = false,
  roles,
  fallback = null,
  children 
}: RequirePermissionProps): ReactNode {
  const activeRole = useSelector((state: RootState) => state.navigation?.activeRole) ?? '';
  
  if (ownerOnly && !isOwner(activeRole)) {
    return fallback;
  }
  
  if (roles && roles.length > 0 && !roles.includes(activeRole)) {
    return fallback;
  }
  
  if (featureId && !canAccessFeature(activeRole, featureId)) {
    return fallback;
  }
  
  if (permission && !hasPermission(activeRole, permission)) {
    return fallback;
  }
  
  if (permissions && permissions.length > 0) {
    const hasAccess = requireAll 
      ? hasAllPermissions(activeRole, permissions)
      : hasAnyPermission(activeRole, permissions);
    
    if (!hasAccess) {
      return fallback;
    }
  }

  return children;
}

interface OwnerOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function OwnerOnly({ children, fallback = null }: OwnerOnlyProps): ReactNode {
  return (
    <RequirePermission ownerOnly fallback={fallback}>
      {children}
    </RequirePermission>
  );
}

interface RoleOnlyProps {
  roles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleOnly({ roles, children, fallback = null }: RoleOnlyProps): ReactNode {
  return (
    <RequirePermission roles={roles} fallback={fallback}>
      {children}
    </RequirePermission>
  );
}

interface AgentOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AgentOnly({ children, fallback = null }: AgentOnlyProps): ReactNode {
  return (
    <RequirePermission roles={['leasing-agent', 'secondary-sales-agent']} fallback={fallback}>
      {children}
    </RequirePermission>
  );
}

interface FeatureGateProps {
  featureId: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGate({ featureId, children, fallback = null }: FeatureGateProps): ReactNode {
  return (
    <RequirePermission featureId={featureId} fallback={fallback}>
      {children}
    </RequirePermission>
  );
}

export function withPermission<P extends object>(
  WrappedComponent: ComponentType<P>, 
  options: Omit<RequirePermissionProps, 'children'> = {}
) {
  return function PermissionWrapper(props: P) {
    return (
      <RequirePermission {...options}>
        <WrappedComponent {...props} />
      </RequirePermission>
    );
  };
}

export default RequirePermission;
