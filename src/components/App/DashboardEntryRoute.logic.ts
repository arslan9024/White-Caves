import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { setActiveRole } from '../../store/navigationSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { selectSessionUser } from '../../store/selectors/sessionSelectors';
import { safeStorage } from '../../utils/safeStorage';
import { getCurrentPathWithQuery } from '../../utils/authSession';
import { useStatus } from '../common/StatusNotification';
import type { RouteDecision, UserRoleData } from './App.config';
import { resolveEffectiveRole } from './App.access.logic';

export function useDashboardEntryRoute(): RouteDecision {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const user = useAppSelector(selectSessionUser);
  const isAuthLoading = useAppSelector(state => state.user.isLoading);
  const currentActiveRole = useAppSelector(state => state.navigation?.activeRole);
  const { info } = useStatus();
  const hasShownSigninNotice = useRef(false);
  const effectiveRole = resolveEffectiveRole(user, safeStorage.getJSON<UserRoleData>('userRole'));

  useEffect(() => {
    if (!isAuthLoading && !user && !hasShownSigninNotice.current) {
      info('Please sign in to access CRM', {
        title: 'Authentication Required',
        duration: 4500,
      });
      hasShownSigninNotice.current = true;
    }
  }, [isAuthLoading, user, info]);

  useEffect(() => {
    if (effectiveRole && effectiveRole !== currentActiveRole) {
      dispatch(setActiveRole(effectiveRole));
      safeStorage.setJSON('userRole', {
        role: effectiveRole,
        selectedAt: new Date().toISOString(),
        locked: true,
      });
    }
  }, [effectiveRole, currentActiveRole, dispatch]);

  if (isAuthLoading) return { kind: 'loading' };
  if (!user) {
    return {
      kind: 'redirect',
      to: '/signin',
      from: getCurrentPathWithQuery(location.pathname, location.search, location.hash),
    };
  }
  if (effectiveRole === 'landlord' || effectiveRole === 'property-owner') {
    return { kind: 'redirect', to: '/landlord-portal' };
  }
  if (effectiveRole === 'tenant') return { kind: 'redirect', to: '/tenant-portal' };
  return { kind: 'allow' };
}
