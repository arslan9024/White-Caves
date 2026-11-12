import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import SuspenseLoader from '../common/SuspenseLoader';
import RouteErrorBoundary from '../RouteErrorBoundary';
import { CRMHubPage } from './App.pages';
import { useDashboardEntryRoute } from './DashboardEntryRoute.logic';

export function DashboardEntryRoute() {
  const decision = useDashboardEntryRoute();
  if (decision.kind === 'loading') return <SuspenseLoader />;
  if (decision.kind === 'redirect') {
    return (
      <Navigate
        to={decision.to}
        replace
        state={decision.from ? { from: decision.from } : undefined}
      />
    );
  }
  return (
    <RouteErrorBoundary section="Dashboard">
      <Suspense fallback={<SuspenseLoader />}>
        <CRMHubPage />
      </Suspense>
    </RouteErrorBoundary>
  );
}
