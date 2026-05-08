/**
 * PermissionGuard — Declarative RBAC gating for JSX trees
 * ─────────────────────────────────────────────────────────
 * Renders children only when the current user satisfies the permission /
 * role requirements. Optionally renders a fallback instead of nothing.
 *
 * Usage:
 *   <PermissionGuard require="approve_commissions">
 *     <ApproveButton />
 *   </PermissionGuard>
 *
 *   <PermissionGuard roles={['owner', 'manager']} fallback={<AccessDenied />}>
 *     <FinancialReport />
 *   </PermissionGuard>
 *
 *   <PermissionGuard minLevel={80}>
 *     <AdminPanel />
 *   </PermissionGuard>
 */

import React, { type ReactNode } from 'react';
import { usePermission, useRole, useRoleLevel } from '../../hooks/usePermission';

interface PermissionGuardProps {
  /** A single permission string the user must have. */
  require?: string;
  /** One or more canonical or alias roles — user must match ANY of them. */
  roles?: string[];
  /** Numeric role level minimum (owner=100, manager=90, admin=80 …). */
  minLevel?: number;
  /** Rendered when access is denied. Defaults to `null` (renders nothing). */
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Declarative permission gate.
 * All supplied conditions must pass simultaneously (AND logic).
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  require,
  roles,
  minLevel,
  fallback = null,
  children,
}) => {
  const hasPerm = usePermission(require ?? '');
  const hasRole = useRole(...(roles ?? []));
  const level = useRoleLevel();

  // If no conditions supplied, always render children
  if (!require && !roles?.length && minLevel === undefined) return <>{children}</>;

  const permOk = require ? hasPerm : true;
  const roleOk = roles?.length ? hasRole : true;
  const levelOk = minLevel !== undefined ? level >= minLevel : true;

  if (permOk && roleOk && levelOk) return <>{children}</>;
  return <>{fallback}</>;
};
