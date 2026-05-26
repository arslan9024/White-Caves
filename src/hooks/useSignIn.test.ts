/**
 * useSignIn — Integration Tests (Plan Item 6)
 * Tests: handleSocialAuth success/error paths for Google, Facebook, Apple.
 * Verifies that syncFirebaseUser is called, state is updated, and navigation
 * happens correctly for both signin and signup modes.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
const mockSyncFirebaseUser = vi.fn();
const mockCompleteSocialRegistration = vi.fn();
const mockSignInWithGoogle = vi.fn();
const mockSignInWithFacebook = vi.fn();
const mockSignInWithApple = vi.fn();
const mockResetPassword = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...(actual as object),
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/signin' }),
  };
});

vi.mock('../config/firebase', () => ({
  auth: null,
  isFirebaseAuthConfigured: true,
  signInWithGoogle: (...args: unknown[]) => mockSignInWithGoogle(...args),
  signInWithFacebook: (...args: unknown[]) => mockSignInWithFacebook(...args),
  signInWithApple: (...args: unknown[]) => mockSignInWithApple(...args),
  resetPassword: (...args: unknown[]) => mockResetPassword(...args),
  signOut: vi.fn().mockResolvedValue(undefined),
  signInWithPhone: vi.fn(),
  createRecaptchaVerifier: vi.fn(),
}));

vi.mock('../services/authService', () => ({
  loginWithEmail: vi.fn(),
  registerWithEmail: vi.fn(),
  syncFirebaseUser: (...args: unknown[]) => mockSyncFirebaseUser(...args),
  completeSocialRegistration: (...args: unknown[]) => mockCompleteSocialRegistration(...args),
}));

vi.mock('../utils/safeStorage', () => ({
  safeStorage: {
    setJSON: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock('../constants', () => ({
  TIMING: { NAVIGATION_DELAY: 0, SIMULATED_API_DELAY: 0 },
}));

import { useSignIn } from './useSignIn';

// ── Store + wrapper ───────────────────────────────────────────────────────────

function createStore() {
  return configureStore({
    reducer: {
      user: (
        state: { currentUser: unknown; isLoading: boolean; error: string | null } = {
          currentUser: null,
          isLoading: false,
          error: null,
        },
        action: { type: string; payload?: unknown }
      ) => {
        if (action.type === 'user/setUser') return { ...state, currentUser: action.payload };
        return state;
      },
    },
  });
}

function createWrapper(store: ReturnType<typeof createStore>) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      Provider,
      { store },
      React.createElement(MemoryRouter, null, children)
    );
  };
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const firebaseUser = {
  uid: 'firebase-uid-abc',
  email: 'user@example.com',
  displayName: 'Test User',
  photoURL: null,
  getIdToken: vi.fn().mockResolvedValue('firebase-token'),
};

const backendBuyerUser = {
  id: 'backend-uuid-1',
  email: 'user@example.com',
  name: 'Test User',
  role: 'buyer',
  department: null,
  photoUrl: null,
};

const backendTenantUser = { ...backendBuyerUser, id: 'backend-uuid-2', role: 'tenant' };
const backendLandlordUser = { ...backendBuyerUser, id: 'backend-uuid-3', role: 'landlord' };
const backendPendingStaffUser = {
  ...backendBuyerUser,
  id: 'backend-uuid-4',
  role: 'agent',
  status: 'pending',
};
const backendSuperuser = {
  ...backendBuyerUser,
  id: 'backend-uuid-super',
  email: 'arslanmalikgoraha@gmail.com',
  role: 'agent',
};

const successResponse = (user = backendBuyerUser) => ({
  success: true,
  data: { token: 'backend-jwt', user },
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('useSignIn — handleSocialAuth (integration)', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = createStore();
  });

  // ── Google success (signin mode) ───────────────────────────────────────────

  describe('google signin success', () => {
    beforeEach(() => {
      mockSignInWithGoogle.mockResolvedValue({ user: firebaseUser });
      mockSyncFirebaseUser.mockResolvedValue(successResponse());
    });

    it('calls syncFirebaseUser with the Firebase user', async () => {
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      expect(mockSyncFirebaseUser).toHaveBeenCalledWith(firebaseUser);
    });

    it('clears error state after success', async () => {
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      expect(result.current.error).toBe('');
    });

    it('dispatches setUser with backend user data', async () => {
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      const currentUser = store.getState().user.currentUser as typeof backendBuyerUser | null;
      expect(currentUser?.id).toBe(backendBuyerUser.id);
      expect(currentUser?.email).toBe(backendBuyerUser.email);
    });

    it('navigates to /crm for a buyer role', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });
      act(() => vi.runAllTimers());

      expect(mockNavigate).toHaveBeenCalledWith('/crm');
      vi.useRealTimers();
    });

    it('navigates to /tenant-portal for a tenant role', async () => {
      vi.useFakeTimers();
      mockSyncFirebaseUser.mockResolvedValue(successResponse(backendTenantUser));
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });
      act(() => vi.runAllTimers());

      expect(mockNavigate).toHaveBeenCalledWith('/tenant-portal');
      vi.useRealTimers();
    });

    it('navigates to /landlord-portal for a landlord role', async () => {
      vi.useFakeTimers();
      mockSyncFirebaseUser.mockResolvedValue(successResponse(backendLandlordUser));
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });
      act(() => vi.runAllTimers());

      expect(mockNavigate).toHaveBeenCalledWith('/landlord-portal');
      vi.useRealTimers();
    });

    it('navigates to /pending-approval for pending staff status', async () => {
      vi.useFakeTimers();
      mockSyncFirebaseUser.mockResolvedValue(successResponse(backendPendingStaffUser));
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });
      act(() => vi.runAllTimers());

      expect(mockNavigate).toHaveBeenCalledWith('/pending-approval');
      vi.useRealTimers();
    });

    it('forces managing_director route behavior for superuser email', async () => {
      vi.useFakeTimers();
      mockSyncFirebaseUser.mockResolvedValue(successResponse(backendSuperuser));
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });
      act(() => vi.runAllTimers());

      const currentUser = store.getState().user.currentUser as {
        role?: string;
        email?: string;
      } | null;
      expect(currentUser?.email).toBe('arslanmalikgoraha@gmail.com');
      expect(currentUser?.role).toBe('managing_director');
      expect(mockNavigate).toHaveBeenCalledWith('/crm');
      vi.useRealTimers();
    });

    it('navigates creator email to /crm for deterministic superuser landing', async () => {
      vi.useFakeTimers();
      mockSyncFirebaseUser.mockResolvedValue(successResponse(backendSuperuser));
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });
      act(() => vi.runAllTimers());

      expect(mockNavigate).toHaveBeenCalledWith('/crm');
      vi.useRealTimers();
    });
  });

  // ── Google success (signup mode) ───────────────────────────────────────────

  describe('google signup success', () => {
    beforeEach(() => {
      mockSignInWithGoogle.mockResolvedValue({ user: firebaseUser });
      mockSyncFirebaseUser.mockResolvedValue(successResponse());
    });

    it('advances to step 2 (category selection) instead of navigating', async () => {
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      // Switch to signup mode
      act(() => result.current.switchMode());

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      expect(result.current.step).toBe(2);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('stores fromSocialProvider in pendingUser', async () => {
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      act(() => result.current.switchMode());

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      expect(result.current.pendingUser?.fromSocialProvider).toBe('google');
    });

    it('stores the backend user email in pendingUser', async () => {
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      act(() => result.current.switchMode());

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      expect(result.current.pendingUser?.email).toBe(backendBuyerUser.email);
    });

    it('does not ask role selection for superuser signup and signs in immediately', async () => {
      vi.useFakeTimers();
      mockSyncFirebaseUser.mockResolvedValue(successResponse(backendSuperuser));
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      act(() => result.current.switchMode());

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      act(() => vi.runAllTimers());

      expect(result.current.step).toBe(1);
      expect(result.current.pendingUser).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/crm');
      vi.useRealTimers();
    });
  });

  // ── Firebase popup error ───────────────────────────────────────────────────

  describe('firebase popup error', () => {
    it('sets error state when Firebase popup throws', async () => {
      mockSignInWithGoogle.mockRejectedValue(new Error('Popup closed by user'));
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      expect(result.current.error).toBe('Popup closed by user');
    });

    it('does not navigate when Firebase popup throws', async () => {
      mockSignInWithGoogle.mockRejectedValue(new Error('Popup closed by user'));
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('resets loading state to false after error', async () => {
      mockSignInWithGoogle.mockRejectedValue(new Error('Network error'));
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      expect(result.current.loading).toBe(false);
    });
  });

  // ── Backend sync error (signin mode) ──────────────────────────────────────

  describe('backend sync error in signin mode', () => {
    it('shows backend sync error and does not navigate', async () => {
      mockSignInWithGoogle.mockResolvedValue({ user: firebaseUser });
      mockSyncFirebaseUser.mockRejectedValue(new Error('Backend unreachable'));
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      expect(result.current.error).toContain('backend session setup failed');
      expect(result.current.error).toContain('Backend unreachable');
      expect(mockNavigate).not.toHaveBeenCalled();

      const currentUser = store.getState().user.currentUser;
      expect(currentUser).toBeNull();
    });

    it('stores recovery metadata so UI can offer a retry CTA', async () => {
      mockSignInWithGoogle.mockResolvedValue({ user: firebaseUser });
      mockSyncFirebaseUser.mockRejectedValue(new Error('Backend unreachable'));
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });
      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      expect(result.current.socialSyncRecovery).toEqual({
        provider: 'google',
        reason: 'Backend unreachable',
      });
    });

    it('retries the same social provider via retrySocialAuth', async () => {
      mockSignInWithGoogle.mockResolvedValue({ user: firebaseUser });
      mockSyncFirebaseUser
        .mockRejectedValueOnce(new Error('Backend unreachable'))
        .mockResolvedValueOnce(successResponse());
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      await act(async () => {
        await result.current.retrySocialAuth();
      });

      expect(mockSignInWithGoogle).toHaveBeenCalledTimes(2);
      expect(mockSyncFirebaseUser).toHaveBeenCalledTimes(2);
    });

    it('clearSocialRecovery clears recovery metadata and sync error', async () => {
      mockSignInWithGoogle.mockResolvedValue({ user: firebaseUser });
      mockSyncFirebaseUser.mockRejectedValue(new Error('Backend unreachable'));
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      expect(result.current.socialSyncRecovery).toEqual({
        provider: 'google',
        reason: 'Backend unreachable',
      });
      expect(result.current.error).toContain('backend session setup failed');

      act(() => {
        result.current.clearSocialRecovery();
      });

      expect(result.current.socialSyncRecovery).toBeNull();
      expect(result.current.error).toBe('');
    });

    it('enforces a retry limit and stops additional sync calls after max retries', async () => {
      mockSignInWithGoogle.mockResolvedValue({ user: firebaseUser });
      mockSyncFirebaseUser.mockRejectedValue(new Error('Backend unreachable'));
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      await act(async () => {
        await result.current.retrySocialAuth();
      });
      await act(async () => {
        await result.current.retrySocialAuth();
      });
      await act(async () => {
        await result.current.retrySocialAuth();
      });

      expect(mockSyncFirebaseUser).toHaveBeenCalledTimes(4);

      await act(async () => {
        await result.current.retrySocialAuth();
      });

      expect(mockSyncFirebaseUser).toHaveBeenCalledTimes(4);
      expect(result.current.error).toContain('Retry limit reached');
    });

    it('updates remainingSocialRetries after each failed retry attempt', async () => {
      mockSignInWithGoogle.mockResolvedValue({ user: firebaseUser });
      mockSyncFirebaseUser.mockRejectedValue(new Error('Backend unreachable'));
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      expect(result.current.remainingSocialRetries).toBe(3);

      await act(async () => {
        await result.current.retrySocialAuth();
      });
      expect(result.current.remainingSocialRetries).toBe(2);

      await act(async () => {
        await result.current.retrySocialAuth();
      });
      expect(result.current.remainingSocialRetries).toBe(1);

      await act(async () => {
        await result.current.retrySocialAuth();
      });
      expect(result.current.remainingSocialRetries).toBe(0);
    });
  });

  describe('social signup completion', () => {
    it('uses completeSocialRegistration after role selection', async () => {
      mockSignInWithGoogle.mockResolvedValue({ user: firebaseUser });
      mockSyncFirebaseUser.mockResolvedValue(successResponse(backendBuyerUser));
      mockCompleteSocialRegistration.mockResolvedValue(successResponse(backendTenantUser));
      vi.useFakeTimers();

      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      act(() => result.current.switchMode());

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      expect(result.current.step).toBe(2);
      expect(result.current.pendingUser?.fromSocialProvider).toBe('google');

      act(() => {
        result.current.setSelectedCategory('client');
      });
      act(() => {
        result.current.proceedToRoleSelection();
      });
      act(() => {
        result.current.setSelectedRole('tenant');
      });

      await act(async () => {
        await result.current.completeSignUp();
      });

      act(() => vi.runAllTimers());

      expect(mockCompleteSocialRegistration).toHaveBeenCalledWith('client', 'tenant');
      expect(mockNavigate).toHaveBeenCalledWith('/tenant-portal');
      vi.useRealTimers();
    });

    it('retries the same social provider via retrySocialAuth after initial sync failure', async () => {
      mockSignInWithGoogle.mockResolvedValue({ user: firebaseUser });
      mockSyncFirebaseUser
        .mockRejectedValueOnce(new Error('Backend unreachable'))
        .mockResolvedValueOnce(successResponse());
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      act(() => result.current.switchMode());

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      await act(async () => {
        await result.current.retrySocialAuth();
      });

      expect(mockSignInWithGoogle).toHaveBeenCalledTimes(2);
      expect(mockSyncFirebaseUser).toHaveBeenCalledTimes(2);
      expect(result.current.socialSyncRecovery).toBeNull();
      expect(result.current.step).toBe(2);
      expect(result.current.pendingUser?.fromSocialProvider).toBe('google');
    });
  });

  // ── Backend sync error (signup mode — fallback) ────────────────────────────

  describe('backend sync error in signup mode', () => {
    it('does not advance signup and surfaces sync error', async () => {
      mockSignInWithGoogle.mockResolvedValue({ user: firebaseUser });
      mockSyncFirebaseUser.mockRejectedValue(new Error('Backend unreachable'));
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      act(() => result.current.switchMode());

      await act(async () => {
        await result.current.handleSocialAuth('google');
      });

      expect(result.current.step).toBe(1);
      expect(result.current.pendingUser).toBeNull();
      expect(result.current.error).toContain('backend session setup failed');
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  // ── Facebook + Apple providers ─────────────────────────────────────────────

  describe('facebook provider', () => {
    it('calls signInWithFacebook and syncFirebaseUser', async () => {
      mockSignInWithFacebook.mockResolvedValue({ user: firebaseUser });
      mockSyncFirebaseUser.mockResolvedValue(successResponse());
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('facebook');
      });

      expect(mockSignInWithFacebook).toHaveBeenCalledTimes(1);
      expect(mockSyncFirebaseUser).toHaveBeenCalledWith(firebaseUser);
    });
  });

  describe('apple provider', () => {
    it('calls signInWithApple and syncFirebaseUser', async () => {
      mockSignInWithApple.mockResolvedValue({ user: firebaseUser });
      mockSyncFirebaseUser.mockResolvedValue(successResponse());
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('apple');
      });

      expect(mockSignInWithApple).toHaveBeenCalledTimes(1);
      expect(mockSyncFirebaseUser).toHaveBeenCalledWith(firebaseUser);
    });
  });

  // ── Invalid provider ──────────────────────────────────────────────────────

  describe('invalid provider', () => {
    it('sets error state for unknown provider', async () => {
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleSocialAuth('twitter');
      });

      expect(result.current.error).toBe('Invalid provider');
    });
  });

  describe('forgot password flow', () => {
    it('shows validation error when email is empty', async () => {
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      await act(async () => {
        await result.current.handleForgotPassword();
      });

      expect(result.current.error).toContain('Please enter your email address first');
      expect(mockResetPassword).not.toHaveBeenCalled();
    });

    it('calls resetPassword and sets success message with valid email', async () => {
      mockResetPassword.mockResolvedValue(undefined);
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      act(() => {
        result.current.setEmail('arslanmalikgoraha@gmail.com');
      });

      await act(async () => {
        await result.current.handleForgotPassword();
      });

      expect(mockResetPassword).toHaveBeenCalledWith('arslanmalikgoraha@gmail.com');
      expect(result.current.success).toContain('Password reset email sent');
    });

    it('surfaces firebase reset error', async () => {
      mockResetPassword.mockRejectedValue(new Error('User not found'));
      const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper(store) });

      act(() => {
        result.current.setEmail('missing@example.com');
      });

      await act(async () => {
        await result.current.handleForgotPassword();
      });

      expect(result.current.error).toBe('User not found');
    });
  });
});
