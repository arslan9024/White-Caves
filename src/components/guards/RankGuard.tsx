import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { getRank, resolveBackendRole } from '../../utils/permissions';
import { getPostLoginRoute } from '../../utils/routing';

interface RankGuardProps {
  minRank: number;
  children: React.ReactNode;
  fallback?: string;
}

/**
 * Renders children only if the authenticated user's rank >= minRank.
 * Redirects to the user's appropriate landing page otherwise.
 *
 * Rank 1 = general users, Rank 2 = staff/CRM, Rank 3 = customers/portal
 *
 * @example
 *   // Staff-only route — redirects non-staff to their portal
 *   <RankGuard minRank={2}>
 *     <CRMDashboard />
 *   </RankGuard>
 */
export default function RankGuard({ minRank, children, fallback }: RankGuardProps) {
  const user = useSelector((state: RootState) => state.user.currentUser);

  if (!user) return <Navigate to="/signin" replace />;

  const rank = getRank(resolveBackendRole(user.role ?? ''));

  if (rank < minRank) {
    return <Navigate to={fallback ?? getPostLoginRoute(user.role)} replace />;
  }

  return <>{children}</>;
}
