import { useState, useEffect } from 'react';
import { setLoading } from '../../store/userSlice';
import { setTheme } from '../../store/navigationSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { selectSessionUser } from '../../store/selectors/sessionSelectors';
import { safeStorage } from '../../utils/safeStorage';
import { authFetch } from '../../utils/authFetch';
import { completeClientLogout, finalizeAuthenticatedSession } from '../../utils/authSession';
import { createLogger } from '../../utils/logger';
import { useSocket } from '../../hooks/useSocket';
const log = createLogger('App');
export function useAppRuntime() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectSessionUser);
  const [consentGranted, setConsentGranted] = useState(false);
  useSocket();
  useEffect(() => {
    if (localStorage.getItem('wc_cookie_consent') === 'accepted') {
      setConsentGranted(true);
    }

    const handleConsent = (): void => setConsentGranted(true);
    window.addEventListener('consent_granted', handleConsent);
    return () => window.removeEventListener('consent_granted', handleConsent);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    // Mark auth as loading before async check begins
    dispatch(setLoading(true));
    const checkAuth = async () => {
      try {
        const token = safeStorage.get('token');
        if (token) {
          const response = await authFetch('/api/auth/profile', { signal: controller.signal });
          if (controller.signal.aborted) return;
          if (response.ok) {
            const result = await response.json();
            finalizeAuthenticatedSession({
              dispatch,
              user: result.data,
              token,
              provider: 'bootstrap',
            });
          } else if (response.status === 401 || response.status === 403) {
            safeStorage.remove('token');
            dispatch(setLoading(false));
          } else {
            dispatch(setLoading(false));
          }
        } else {
          dispatch(setLoading(false));
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // Avoid indefinite loading states during navigation/StrictMode aborts in development
          dispatch(setLoading(false));
          return;
        }
        // Auth check failed — user stays logged out
        log.warn('Auth check failed:', err instanceof Error ? err.message : 'Unknown error');
        safeStorage.remove('token');
        dispatch(setLoading(false));
      }
    };
    checkAuth();
    return () => controller.abort();
  }, [dispatch]);
  useEffect(() => {
    const savedTheme = safeStorage.get('theme', 'light');
    const themeValue = savedTheme ?? 'light';
    document.documentElement.setAttribute('data-theme', themeValue);
    dispatch(setTheme(themeValue));
  }, [dispatch]);
  useEffect(() => {
    const handleLogoutEvent = (): void => {
      completeClientLogout(dispatch);
    };
    window.addEventListener('whitecaves-logout', handleLogoutEvent);
    return () => window.removeEventListener('whitecaves-logout', handleLogoutEvent);
  }, [dispatch]);
  const handleRoleSelect = (role: string): void => {
    safeStorage.setJSON('userRole', {
      role,
      selectedAt: new Date().toISOString(),
      locked: true,
    });
  };
  return { user, consentGranted, handleRoleSelect };
}
