/**
 * PermissionGate — Declarative RBAC Component
 * ─────────────────────────────────────────────
 * Conditionally renders children based on the current user's permissions.
 * Supports single permission, any-of, all-of, and role-based checks.
 *
 * Usage:
 *   <PermissionGate permission="manage_leads">
 *     <DeleteButton />
 *   </PermissionGate>
 *
 *   <PermissionGate anyOf={['view_leads', 'manage_leads']}>
 *     <LeadsList />
 *   </PermissionGate>
 *
 *   <PermissionGate allOf={['create_contracts', 'view_payments']}>
 *     <ContractWizard />
 *   </PermissionGate>
 *
 *   <PermissionGate roles={['owner', 'admin']} fallback={<UpgradePrompt />}>
 *     <AdminPanel />
 *   </PermissionGate>
 */

import { type ReactNode } from 'react';
import { usePermissions } from '../../hooks/usePermissions';

export interface PermissionGateProps {
  /** Single permission to check */
  permission?: string;
  /** Pass if user has ANY of these permissions */
  anyOf?: string[];
  /** Pass if user has ALL of these permissions */
  allOf?: string[];
  /** Pass if user has one of these roles */
  roles?: string[];
  /** Rendered when permission check fails (default: null) */
  fallback?: ReactNode;
  /** Content to show when permission check passes */
  children: ReactNode;
}

export function PermissionGate({
  permission,
  anyOf,
  allOf,
  roles,
  fallback = null,
  children,
}: PermissionGateProps): ReactNode {
  const { can, canAny, canAll, role } = usePermissions();

  let allowed = false;

  if (permission) {
    allowed = can(permission);
  } else if (anyOf && anyOf.length > 0) {
    allowed = canAny(anyOf);
  } else if (allOf && allOf.length > 0) {
    allowed = canAll(allOf);
  } else if (roles && roles.length > 0) {
    allowed = role != null && roles.includes(role);
  } else {
    // No check specified — allow by default
    allowed = true;
  }

  return allowed ? children : fallback;
}

export default PermissionGate;
