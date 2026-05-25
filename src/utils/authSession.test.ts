import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loginSuccess, logout as logoutAuthState } from '../store/authSlice';
import { setActiveRole } from '../store/navigationSlice';
import { setUser, type AppUser } from '../store/userSlice';
import {
  completeClientLogout,
  finalizeAuthenticatedSession,
  getCurrentPathWithQuery,
  getPrivilegedRoleFromUser,
  getReturnToFromLocationState,
  navigateToPostLoginDestination,
  resolvePostLoginDestination,
  sanitizeReturnToPath,
} from './authSession';

const { mockGet, mockGetJSON, mockSet, mockSetJSON, mockRemove } = vi.hoisted(() => ({
  mockGet: vi.fn<(key: string, fallback?: string) => string | null>(),
  mockGetJSON: vi.fn<(key: string) => unknown>(),
  mockSet: vi.fn<(key: string, value: string) => void>(),
  mockSetJSON: vi.fn<(key: string, value: unknown) => void>(),
  mockRemove: vi.fn<(key: string) => boolean>(),
}));

vi.mock('./safeStorage', () => ({
  safeStorage: {
    get: (...args: [string, string?]) => mockGet(...args),
    getJSON: (...args: [string]) => mockGetJSON(...args),
    set: (...args: [string, string]) => mockSet(...args),
    setJSON: (...args: [string, unknown]) => mockSetJSON(...args),
    remove: (...args: [string]) => mockRemove(...args),
  },
}));

describe('authSession utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sanitizeReturnToPath', () => {
    it('accepts internal app paths', () => {
      expect(sanitizeReturnToPath('/crm?tab=overview')).toBe('/crm?tab=overview');
    });

    it('blocks non-internal and auth-loop paths', () => {
      expect(sanitizeReturnToPath('https://evil.example')).toBeNull();
      expect(sanitizeReturnToPath('//evil.example')).toBeNull();
      expect(sanitizeReturnToPath('/signin')).toBeNull();
      expect(sanitizeReturnToPath('/auth/signin?returnTo=/crm')).toBeNull();
    });
  });

  describe('resolvePostLoginDestination', () => {
    it('prefers validated returnTo', () => {
      expect(
        resolvePostLoginDestination({
          user: { role: 'tenant', status: 'active' },
          returnTo: '/crm/custom',
        })
      ).toBe('/crm/custom');
    });

    it('routes pending users to pending approval page', () => {
      expect(
        resolvePostLoginDestination({
          user: { role: 'tenant', status: 'pending' },
        })
      ).toBe('/pending-approval');
    });

    it('routes tenant and landlord users to dedicated portals', () => {
      expect(
        resolvePostLoginDestination({
          user: { role: 'tenant', status: 'active' },
        })
      ).toBe('/tenant-portal');

      expect(
        resolvePostLoginDestination({
          user: { role: 'landlord', status: 'active' },
        })
      ).toBe('/landlord-portal');
    });

    it('routes users without roles to select-role and all others to crm', () => {
      expect(
        resolvePostLoginDestination({
          user: { role: '', status: 'active' },
        })
      ).toBe('/select-role');

      expect(
        resolvePostLoginDestination({
          user: { role: 'buyer', status: 'active' },
        })
      ).toBe('/crm');
    });
  });

  describe('finalizeAuthenticatedSession', () => {
    const createUser = (overrides: Partial<AppUser> = {}): AppUser => ({
      id: 'u-1',
      email: 'user@example.com',
      role: 'buyer',
      status: 'active',
      ...overrides,
    });

    it('dispatches user/auth state, persists normalized role, and returns destination', () => {
      const dispatch = vi.fn();
      const user = createUser({ role: 'owner', email: 'arslanmalikgoraha@gmail.com' });

      const destination = finalizeAuthenticatedSession({
        dispatch: dispatch as never,
        user,
        token: 'jwt-123',
        provider: 'backend',
        rememberMe: true,
        returnTo: '/crm/priority',
      });

      expect(destination).toBe('/crm/priority');
      expect(dispatch).toHaveBeenCalledWith(setUser(expect.objectContaining({ role: 'lion' })));
      expect(dispatch).toHaveBeenCalledWith(setActiveRole('lion'));

      const loginAction = dispatch.mock.calls
        .map(call => call[0])
        .find((action: { type: string }) => action.type === loginSuccess.type);
      expect(loginAction?.payload).toEqual(
        expect.objectContaining({
          token: 'jwt-123',
          provider: 'backend',
          rememberMe: true,
        })
      );
      expect(mockSetJSON).toHaveBeenCalledWith(
        'userRole',
        expect.objectContaining({
          role: 'lion',
          locked: true,
          status: 'active',
        })
      );
    });

    it('uses stored token fallback and skips role persistence when role is absent', () => {
      mockGet.mockReturnValue('stored-token');
      const dispatch = vi.fn();
      const user = createUser({ role: undefined });

      const destination = finalizeAuthenticatedSession({
        dispatch: dispatch as never,
        user,
      });

      expect(destination).toBe('/select-role');
      const loginAction = dispatch.mock.calls
        .map(call => call[0])
        .find((action: { type: string }) => action.type === loginSuccess.type);
      expect(loginAction?.payload.token).toBe('stored-token');
      expect(mockSetJSON).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalledWith(setActiveRole(expect.anything()));
    });
  });

  describe('logout and navigation helpers', () => {
    it('clears session artifacts and dispatches logout actions', () => {
      const dispatch = vi.fn();
      completeClientLogout(dispatch as never);

      expect(mockRemove).toHaveBeenCalledWith('token');
      expect(mockRemove).toHaveBeenCalledWith('userRole');
      expect(dispatch).toHaveBeenNthCalledWith(1, setUser(null));
      expect(dispatch).toHaveBeenNthCalledWith(2, logoutAuthState(undefined));
    });

    it('navigates with replace by default and supports explicit override', () => {
      const navigate = vi.fn();
      navigateToPostLoginDestination(navigate as never, '/crm');
      navigateToPostLoginDestination(navigate as never, '/tenant-portal', false);

      expect(navigate).toHaveBeenNthCalledWith(1, '/crm', { replace: true });
      expect(navigate).toHaveBeenNthCalledWith(2, '/tenant-portal', { replace: false });
    });
  });

  describe('misc helpers', () => {
    it('builds pathname + search + hash correctly', () => {
      expect(getCurrentPathWithQuery('/crm', '?tab=insights', '#section')).toBe('/crm?tab=insights#section');
    });

    it('extracts and sanitizes returnTo value from location state', () => {
      expect(getReturnToFromLocationState({ from: '/crm/lead/42' })).toBe('/crm/lead/42');
      expect(getReturnToFromLocationState({ from: 'https://evil.example' })).toBeNull();
      expect(getReturnToFromLocationState(null)).toBeNull();
    });

    it('resolves privileged role for creator and admin users only', () => {
      expect(getPrivilegedRoleFromUser({ email: 'arslanmalikgoraha@gmail.com', role: 'owner' })).toBe('lion');
      expect(getPrivilegedRoleFromUser({ email: 'admin@example.com', role: 'admin' })).toBe('admin');
      expect(getPrivilegedRoleFromUser({ email: 'buyer@example.com', role: 'buyer' })).toBeNull();
    });
  });
});
