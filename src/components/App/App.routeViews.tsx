import { Suspense, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { UnifiedWorkspaceLayout } from '../../layouts/UnifiedWorkspaceLayout';
import PortalLayout from '../../components/portal/PortalLayout';
import SuspenseLoader from '../../components/common/SuspenseLoader';
import RouteErrorBoundary from '../../components/RouteErrorBoundary';
import { isCreatorSuperUserEmail } from '../../utils/superUserAccess';
import React from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { useAppRuntime } from './App.logic';
export function createRouteRenderers(user: ReturnType<typeof useAppRuntime>['user']) {
  const renderProtectedAppPage = (
    page: ReactNode,
    section: string,
    allowedRoles?: string[]
  ): ReactNode => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <UnifiedWorkspaceLayout>
        <RouteErrorBoundary section={section}>
          <Suspense fallback={<SuspenseLoader />}>{page}</Suspense>
        </RouteErrorBoundary>
      </UnifiedWorkspaceLayout>
    </ProtectedRoute>
  );
  const renderPublicPage = (page: ReactNode, section: string): ReactNode => (
    <RouteErrorBoundary section={section}>
      <Suspense fallback={<SuspenseLoader />}>{page}</Suspense>
    </RouteErrorBoundary>
  );
  const renderSignedInPage = (page: ReactNode, section: string): ReactNode =>
    user ? renderPublicPage(page, section) : <Navigate to="/signin" replace />;
  const renderGuestOnlyPage = (page: ReactNode, section: string): ReactNode => {
    if (!user) return renderPublicPage(page, section);
    const roleKey = (user.role || '').toLowerCase().trim();
    const goDashboard =
      isCreatorSuperUserEmail(user.email) ||
      roleKey === 'managing_director' ||
      roleKey === 'lion' ||
      roleKey === 'owner' ||
      roleKey === 'guest' ||
      roleKey === 'landlord' ||
      roleKey === 'tenant' ||
      roleKey === 'agent';
    return <Navigate to={goDashboard ? '/dashboard' : '/profile'} replace />;
  };
  const renderProtectedPortalPage = (
    page: ReactNode,
    section: string,
    portalType: 'landlord' | 'tenant',
    allowedRoles: string[]
  ): ReactNode => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <PortalLayout portalType={portalType}>
        <RouteErrorBoundary section={section}>
          <Suspense fallback={<SuspenseLoader />}>{page}</Suspense>
        </RouteErrorBoundary>
      </PortalLayout>
    </ProtectedRoute>
  );
  const renderProtectedRedirect = (to: string, allowedRoles?: string[]): ReactNode => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Navigate to={to} replace />
    </ProtectedRoute>
  );
  return {
    renderProtectedAppPage,
    renderPublicPage,
    renderSignedInPage,
    renderGuestOnlyPage,
    renderProtectedPortalPage,
    renderProtectedRedirect,
  };
}
