import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { resolveBackendRole } from '../../utils/permissions';
import { getPostLoginRoute } from '../../utils/routing';

interface RoleGuardProps {
  roles: string[];
  children: React.ReactNode;
  fallback?: string;
}

/**
 * Renders children only if the user's resolved role is in the allowed list.
 * Redirects to the user's appropriate landing page otherwise.
 *
 * @example
 *   // Owner/admin-only section
 *   <RoleGuard roles={['owner', 'admin']}>
 *     <UserManagementPanel />
 *   </RoleGuard>
 */
export default function RoleGuard({ roles, children, fallback }: RoleGuardProps) {
  const user = useSelector((state: RootState) => state.user.currentUser);

  if (!user) return <Navigate to="/signin" replace />;

  const resolved = resolveBackendRole(user.role ?? '');

  if (!roles.includes(resolved)) {
    return <Navigate to={fallback ?? getPostLoginRoute(user.role)} replace />;
  }

  return <>{children}</>;
}
