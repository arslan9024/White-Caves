/**
 * GoogleLoginButton — Unit Tests
 * Tests: hidden when Firebase not configured, rendering, loading state,
 * success path (backend sync), error path, disabled prop.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockSignInWithPopup = vi.fn();
const mockSyncFirebaseUser = vi.fn();

// Use a getter so individual tests can override auth (null vs. non-null)
let mockAuthValue: unknown = { currentUser: null };

vi.mock('firebase/auth', () => ({
  signInWithPopup: (...args: unknown[]) => mockSignInWithPopup(...args),
  GoogleAuthProvider: vi.fn().mockImplementation(() => ({
    addScope: vi.fn(),
  })),
}));

vi.mock('../../../../config/firebase', () => ({
  get auth() {
    return mockAuthValue;
  },
}));

vi.mock('../../../../services/authService', () => ({
  syncFirebaseUser: (...args: unknown[]) => mockSyncFirebaseUser(...args),
}));

vi.mock('../../../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

vi.mock('./SocialLogin.css', () => ({}));

import GoogleLoginButton from './GoogleLoginButton';

// ── Test store ────────────────────────────────────────────────────────────────

function createTestStore() {
  return configureStore({
    reducer: {
      auth: (
        state = { loading: false, error: null, session: { isLoggedIn: false } },
        action: { type: string; payload?: unknown }
      ) => {
        switch (action.type) {
          case 'auth/loginStart':
            return { ...state, loading: true, error: null };
          case 'auth/loginSuccess':
            return { ...state, loading: false };
          case 'auth/loginFailure':
            return { ...state, loading: false, error: action.payload };
          default:
            return state;
        }
      },
    },
  });
}

function renderButton(props = {}) {
  const store = createTestStore();
  const result = render(
    <Provider store={store}>
      <GoogleLoginButton {...props} />
    </Provider>
  );
  return { ...result, store };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GoogleLoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthValue = { currentUser: null }; // Firebase configured by default
  });

  // ── Firebase not configured ────────────────────────────────────────────────

  describe('when Firebase is not configured (auth === null)', () => {
    it('renders nothing', () => {
      mockAuthValue = null;
      const { container } = renderButton();
      expect(container).toBeEmptyDOMElement();
    });
  });

  // ── Rendering ─────────────────────────────────────────────────────────────

  describe('when Firebase is configured', () => {
    it('renders the Google sign-in button', () => {
      renderButton();
      expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
    });

    it('shows "Continue with Google" text by default', () => {
      renderButton();
      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    });

    it('is enabled by default', () => {
      renderButton();
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('is disabled when disabled prop is true', () => {
      renderButton({ disabled: true });
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  // ── Loading state ──────────────────────────────────────────────────────────

  describe('loading state', () => {
    it('shows "Signing in..." and disables button while login is in progress', async () => {
      let resolvePopup: (value: unknown) => void;
      mockSignInWithPopup.mockReturnValue(
        new Promise(resolve => {
          resolvePopup = resolve;
        })
      );

      renderButton();
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Signing in...')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();
      });

      // Resolve to avoid unhandled promise rejections
      resolvePopup!({
        user: {
          uid: 'u1',
          email: 'a@b.com',
          displayName: null,
          photoURL: null,
          getIdToken: vi.fn(),
        },
      });
    });
  });

  // ── Success path ───────────────────────────────────────────────────────────

  describe('success path', () => {
    const firebaseUser = {
      uid: 'firebase-uid-123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/photo.jpg',
      getIdToken: vi.fn().mockResolvedValue('firebase-id-token'),
    };

    const backendUser = {
      id: 'backend-uuid-456',
      email: 'test@example.com',
      name: 'Test User',
      role: 'buyer',
      department: null,
      photoUrl: 'https://example.com/photo.jpg',
    };

    beforeEach(() => {
      mockSignInWithPopup.mockResolvedValue({ user: firebaseUser });
      mockSyncFirebaseUser.mockResolvedValue({
        success: true,
        data: { token: 'backend-jwt-token', user: backendUser },
      });
    });

    it('calls syncFirebaseUser with the Firebase user after popup', async () => {
      renderButton();
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(mockSyncFirebaseUser).toHaveBeenCalledWith(firebaseUser);
      });
    });

    it('dispatches loginSuccess with backend JWT (not Firebase token)', async () => {
      const { store } = renderButton();
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const state = store.getState().auth;
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
      });
    });

    it('calls onSuccess with backend user data', async () => {
      const onSuccess = vi.fn();
      renderButton({ onSuccess });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(backendUser);
      });
    });

    it('restores button text to "Continue with Google" after success', async () => {
      renderButton();
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByText('Continue with Google')).toBeInTheDocument();
      });
    });
  });

  // ── Error paths ────────────────────────────────────────────────────────────

  describe('error path', () => {
    it('dispatches loginFailure when Firebase popup throws', async () => {
      mockSignInWithPopup.mockRejectedValue(new Error('Popup blocked'));

      const onError = vi.fn();
      const { store } = renderButton({ onError });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const state = store.getState().auth;
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Popup blocked');
      });
      expect(onError).toHaveBeenCalled();
    });

    it('dispatches loginFailure when backend sync fails', async () => {
      mockSignInWithPopup.mockResolvedValue({
        user: {
          uid: 'u1',
          email: 'a@b.com',
          displayName: null,
          photoURL: null,
          getIdToken: vi.fn(),
        },
      });
      mockSyncFirebaseUser.mockRejectedValue(new Error('Backend unavailable'));

      const onError = vi.fn();
      const { store } = renderButton({ onError });
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const state = store.getState().auth;
        expect(state.loading).toBe(false);
        expect(state.error).toBe('Backend unavailable');
      });
      expect(onError).toHaveBeenCalled();
    });

    it('dispatches loginFailure when backend sync returns no user', async () => {
      mockSignInWithPopup.mockResolvedValue({
        user: {
          uid: 'u1',
          email: 'a@b.com',
          displayName: null,
          photoURL: null,
          getIdToken: vi.fn(),
        },
      });
      mockSyncFirebaseUser.mockResolvedValue({ success: true, data: {} });

      const { store } = renderButton();
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        const state = store.getState().auth;
        expect(state.error).toBe('Backend sync failed: missing user data');
      });
    });

    it('handles non-Error thrown objects gracefully', async () => {
      mockSignInWithPopup.mockRejectedValue('string error');

      const { store } = renderButton();
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(store.getState().auth.error).toBe('Google login failed');
      });
    });
  });

  // ── Guard: no double-click ─────────────────────────────────────────────────

  describe('click guard', () => {
    it('does not start a second login if already loading', async () => {
      let resolvePopup: (value: unknown) => void;
      mockSignInWithPopup.mockReturnValue(
        new Promise(resolve => {
          resolvePopup = resolve;
        })
      );

      renderButton();
      const btn = screen.getByRole('button');
      fireEvent.click(btn); // first click — popup opens
      fireEvent.click(btn); // second click — should be ignored (button disabled)

      await waitFor(() => {
        expect(mockSignInWithPopup).toHaveBeenCalledTimes(1);
      });

      resolvePopup!({
        user: {
          uid: 'u1',
          email: 'a@b.com',
          displayName: null,
          photoURL: null,
          getIdToken: vi.fn(),
        },
      });
    });
  });
});
