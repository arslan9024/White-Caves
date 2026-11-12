import React from 'react';
import { Navigate } from 'react-router-dom';
import SuspenseLoader from '../common/SuspenseLoader';
import type { ProtectedRouteProps } from './App.config';
import { useProtectedRoute } from './ProtectedRoute.logic';

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const decision = useProtectedRoute(allowedRoles);
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
  return <>{children}</>;
}
