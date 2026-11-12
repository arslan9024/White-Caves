import { type ReactNode } from 'react';
export interface UserRoleData {
  role: string;
  selectedAt: string;
  locked: boolean;
  status?: string;
}
export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}
export interface PageTransitionProps {
  children: ReactNode;
}
export type RouteDecision =
  { kind: 'loading' } | { kind: 'redirect'; to: string; from?: string } | { kind: 'allow' };
