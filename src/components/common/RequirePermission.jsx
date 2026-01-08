import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { hasPermission, hasAnyPermission, hasAllPermissions, canAccessFeature, isOwner } from '../../utils/permissions';
import { useSelector } from 'react-redux';

export function RequirePermission({ 
  permission, 
  permissions,
  requireAll = false,
  featureId,
  ownerOnly = false,
  roles,
  fallback = null,
  children 
}) {
  const activeRole = useSelector(state => state.navigation?.activeRole);
  
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

export function OwnerOnly({ children, fallback = null }) {
  return (
    <RequirePermission ownerOnly fallback={fallback}>
      {children}
    </RequirePermission>
  );
}

export function RoleOnly({ roles, children, fallback = null }) {
  return (
    <RequirePermission roles={roles} fallback={fallback}>
      {children}
    </RequirePermission>
  );
}

export function AgentOnly({ children, fallback = null }) {
  return (
    <RequirePermission roles={['leasing-agent', 'secondary-sales-agent']} fallback={fallback}>
      {children}
    </RequirePermission>
  );
}

export function FeatureGate({ featureId, children, fallback = null }) {
  return (
    <RequirePermission featureId={featureId} fallback={fallback}>
      {children}
    </RequirePermission>
  );
}

export function withPermission(WrappedComponent, options = {}) {
  return function PermissionWrapper(props) {
    return (
      <RequirePermission {...options}>
        <WrappedComponent {...props} />
      </RequirePermission>
    );
  };
}

export default RequirePermission;
