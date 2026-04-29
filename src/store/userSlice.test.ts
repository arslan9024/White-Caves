import { describe, it, expect } from 'vitest';
import reducer, {
  setUser,
  setLoading,
  setError,
  clearUser,
  selectCurrentUser,
  selectUserLoading,
  type AppUser,
} from './userSlice';
import { logout } from './authSlice';
import type { RootState } from './store';

// ─── Helpers ───────────────────────────────────────────────────────
const makeUser = (overrides: Partial<AppUser> = {}): AppUser => ({
  id: 'user-1',
  email: 'test@whitecaves.com',
  name: 'Test User',
  role: 'admin',
  status: 'active',
  ...overrides,
});

const initialState = () => reducer(undefined, { type: '@@INIT' });

const stateWith = (user: Partial<ReturnType<typeof initialState>> = {}) =>
  ({ user: { ...initialState(), ...user } }) as unknown as RootState;

// ─── Initial state ────────────────────────────────────────────────
describe('userSlice', () => {
  describe('initial state', () => {
    it('starts with null user, not loading, no error', () => {
      const state = initialState();
      expect(state).toEqual({
        currentUser: null,
        isLoading: false,
        error: null,
      });
    });
  });

  // ─── setUser ──────────────────────────────────────────────────────
  describe('setUser', () => {
    it('sets the currentUser and clears loading/error', () => {
      const user = makeUser();
      const prev = { ...initialState(), isLoading: true, error: 'old error' };
      const state = reducer(prev, setUser(user));

      expect(state.currentUser).toEqual(user);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('can set user to null', () => {
      const prev = { ...initialState(), currentUser: makeUser() };
      const state = reducer(prev, setUser(null));

      expect(state.currentUser).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it('replaces existing user with new user', () => {
      const prev = { ...initialState(), currentUser: makeUser({ id: 'old' }) };
      const newUser = makeUser({ id: 'new', email: 'new@test.com' });
      const state = reducer(prev, setUser(newUser));

      expect(state.currentUser?.id).toBe('new');
      expect(state.currentUser?.email).toBe('new@test.com');
    });

    it('preserves extra fields (Firebase-style)', () => {
      const user = makeUser({ customField: 'extra-value' } as Partial<AppUser>);
      const state = reducer(initialState(), setUser(user));

      expect((state.currentUser as AppUser & { customField: string }).customField).toBe('extra-value');
    });
  });

  // ─── setLoading ───────────────────────────────────────────────────
  describe('setLoading', () => {
    it('sets isLoading to true', () => {
      const state = reducer(initialState(), setLoading(true));
      expect(state.isLoading).toBe(true);
    });

    it('sets isLoading to false', () => {
      const prev = { ...initialState(), isLoading: true };
      const state = reducer(prev, setLoading(false));
      expect(state.isLoading).toBe(false);
    });

    it('does not modify currentUser or error', () => {
      const user = makeUser();
      const prev = { currentUser: user, isLoading: false, error: 'some error' };
      const state = reducer(prev, setLoading(true));

      expect(state.currentUser).toEqual(user);
      expect(state.error).toBe('some error');
    });
  });

  // ─── setError ─────────────────────────────────────────────────────
  describe('setError', () => {
    it('sets error and stops loading', () => {
      const prev = { ...initialState(), isLoading: true };
      const state = reducer(prev, setError('Something failed'));

      expect(state.error).toBe('Something failed');
      expect(state.isLoading).toBe(false);
    });

    it('clears error with null', () => {
      const prev = { ...initialState(), error: 'old error' };
      const state = reducer(prev, setError(null));

      expect(state.error).toBeNull();
    });

    it('does not modify currentUser', () => {
      const user = makeUser();
      const prev = { ...initialState(), currentUser: user };
      const state = reducer(prev, setError('fail'));

      expect(state.currentUser).toEqual(user);
    });
  });

  // ─── clearUser ────────────────────────────────────────────────────
  describe('clearUser', () => {
    it('resets everything to initial state', () => {
      const prev = {
        currentUser: makeUser(),
        isLoading: true,
        error: 'something',
      };
      const state = reducer(prev, clearUser());

      expect(state).toEqual({
        currentUser: null,
        isLoading: false,
        error: null,
      });
    });

    it('is idempotent on initial state', () => {
      const state = reducer(initialState(), clearUser());
      expect(state).toEqual(initialState());
    });
  });

  // ─── logout (extraReducer) ───────────────────────────────────────
  describe('logout (extraReducer)', () => {
    it('resets state to initial when logout dispatched', () => {
      const prev = {
        currentUser: makeUser(),
        isLoading: true,
        error: 'something',
      };
      const state = reducer(prev, logout());

      expect(state).toEqual({
        currentUser: null,
        isLoading: false,
        error: null,
      });
    });

    it('handles logout when already in initial state', () => {
      const state = reducer(initialState(), logout());
      expect(state).toEqual(initialState());
    });
  });

  // ─── Selectors ────────────────────────────────────────────────────
  describe('selectors', () => {
    describe('selectCurrentUser', () => {
      it('returns null when no user', () => {
        expect(selectCurrentUser(stateWith())).toBeNull();
      });

      it('returns the current user', () => {
        const user = makeUser();
        expect(selectCurrentUser(stateWith({ currentUser: user }))).toEqual(user);
      });
    });

    describe('selectUserLoading', () => {
      it('returns false by default', () => {
        expect(selectUserLoading(stateWith())).toBe(false);
      });

      it('returns true when loading', () => {
        expect(selectUserLoading(stateWith({ isLoading: true }))).toBe(true);
      });
    });
  });

  // ─── Action sequence tests ───────────────────────────────────────
  describe('action sequences', () => {
    it('loading → setUser flow', () => {
      let state = initialState();
      state = reducer(state, setLoading(true));
      expect(state.isLoading).toBe(true);

      const user = makeUser();
      state = reducer(state, setUser(user));
      expect(state.isLoading).toBe(false);
      expect(state.currentUser).toEqual(user);
    });

    it('loading → error flow', () => {
      let state = initialState();
      state = reducer(state, setLoading(true));
      state = reducer(state, setError('Network error'));

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.currentUser).toBeNull();
    });

    it('setUser → clearUser flow', () => {
      let state = initialState();
      state = reducer(state, setUser(makeUser()));
      expect(state.currentUser).not.toBeNull();

      state = reducer(state, clearUser());
      expect(state.currentUser).toBeNull();
    });

    it('setUser → logout flow', () => {
      let state = initialState();
      state = reducer(state, setUser(makeUser()));
      state = reducer(state, logout());

      expect(state).toEqual(initialState());
    });

    it('error → retry → success flow', () => {
      let state = initialState();
      state = reducer(state, setLoading(true));
      state = reducer(state, setError('Failed'));
      state = reducer(state, setLoading(true));
      state = reducer(state, setUser(makeUser()));

      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.currentUser).not.toBeNull();
    });
  });

  // ─── AppUser interface tests ──────────────────────────────────────
  describe('AppUser shape', () => {
    it('supports all optional fields', () => {
      const fullUser = makeUser({
        uid: 'firebase-uid',
        displayName: 'Display Name',
        photoURL: 'https://photo.url',
        phone: '+1234567890',
        createdAt: '2025-01-01T00:00:00Z',
        lastLogin: '2025-06-01T00:00:00Z',
        status: 'pending',
        permissions: ['read', 'write'],
      });

      const state = reducer(initialState(), setUser(fullUser));
      const user = state.currentUser!;

      expect(user.uid).toBe('firebase-uid');
      expect(user.displayName).toBe('Display Name');
      expect(user.photoURL).toBe('https://photo.url');
      expect(user.phone).toBe('+1234567890');
      expect(user.status).toBe('pending');
      expect(user.permissions).toEqual(['read', 'write']);
    });

    it('supports minimal required fields only', () => {
      const minUser: AppUser = { id: 'min', email: 'min@test.com' };
      const state = reducer(initialState(), setUser(minUser));

      expect(state.currentUser?.id).toBe('min');
      expect(state.currentUser?.email).toBe('min@test.com');
      expect(state.currentUser?.name).toBeUndefined();
    });
  });
});
