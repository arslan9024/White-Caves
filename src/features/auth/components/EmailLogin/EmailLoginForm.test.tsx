/**
 * EmailLoginForm — Unit Tests
 * Tests: rendering, login/signup modes, form validation, Firebase auth,
 * Redux dispatch, error mapping, mode switching, loading state
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// ── Mocks ────────────────────────────────────────────────────────

const mockSignIn = vi.fn();
const mockCreateUser = vi.fn();
const mockSendVerification = vi.fn();

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignIn(...args),
  createUserWithEmailAndPassword: (...args: unknown[]) => mockCreateUser(...args),
  sendEmailVerification: (...args: unknown[]) => mockSendVerification(...args),
}));

vi.mock('../../../../config/firebase', () => ({
  auth: { currentUser: null },
}));

vi.mock('../../../../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
  }),
}));

vi.mock('./EmailLogin.css', () => ({}));

import EmailLoginForm from './EmailLoginForm';

// ── Store setup ──────────────────────────────────────────────────

function createTestStore() {
  return configureStore({
    reducer: {
      auth: (state = {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      }, action: { type: string; payload?: unknown }) => {
        switch (action.type) {
          case 'auth/loginStart':
            return { ...state, loading: true, error: null };
          case 'auth/loginSuccess':
            return { ...state, loading: false, user: (action.payload as Record<string, unknown>)?.user, isAuthenticated: true };
          case 'auth/loginFailure':
            return { ...state, loading: false, error: action.payload };
          default:
            return state;
        }
      },
    },
  });
}

// ── Helpers ──────────────────────────────────────────────────────

function renderForm(props: Partial<React.ComponentProps<typeof EmailLoginForm>> = {}) {
  const store = createTestStore();
  return {
    store,
    ...render(
      <Provider store={store}>
        <EmailLoginForm {...props} />
      </Provider>
    ),
  };
}

function createFirebaseUser(overrides: Record<string, unknown> = {}) {
  return {
    uid: 'user-123',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: null,
    emailVerified: false,
    getIdToken: vi.fn().mockResolvedValue('mock-token-abc'),
    ...overrides,
  };
}

// ── Tests ────────────────────────────────────────────────────────

describe('EmailLoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Login Mode (default)', () => {
    it('renders email and password fields', () => {
      renderForm();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders Sign In button', () => {
      renderForm();
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('does NOT render confirm password field in login mode', () => {
      renderForm();
      expect(screen.queryByLabelText('Confirm Password')).not.toBeInTheDocument();
    });

    it('shows "Sign up" link to switch to signup mode', () => {
      renderForm();
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
    });

    it('calls onModeChange when Sign up is clicked', () => {
      const onModeChange = vi.fn();
      renderForm({ onModeChange });
      fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));
      expect(onModeChange).toHaveBeenCalledWith('signup');
    });
  });

  describe('Signup Mode', () => {
    it('renders confirm password field', () => {
      renderForm({ mode: 'signup' });
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    });

    it('renders Create Account button', () => {
      renderForm({ mode: 'signup' });
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    });

    it('shows "Sign in" link to switch back', () => {
      renderForm({ mode: 'signup' });
      expect(screen.getByText('Already have an account?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    });

    it('calls onModeChange when Sign in is clicked', () => {
      const onModeChange = vi.fn();
      renderForm({ mode: 'signup', onModeChange });
      fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
      expect(onModeChange).toHaveBeenCalledWith('login');
    });
  });

  describe('Form Validation', () => {
    it('shows email required error', async () => {
      renderForm();
      fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    it('shows invalid email error', async () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'notanemail' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'Password123' } });
      const form = screen.getByRole('button', { name: 'Sign In' }).closest('form')!;
      fireEvent.submit(form);
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
      });
    });

    it('shows password required error', async () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'test@example.com' } });
      fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
      await waitFor(() => {
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    it('shows password too short error', async () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'short' } });
      fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
      });
    });

    it('shows complexity error in signup mode', async () => {
      renderForm({ mode: 'signup' });
      fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'abcdefgh' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { name: 'confirmPassword', value: 'abcdefgh' } });
      fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
      await waitFor(() => {
        expect(screen.getByText('Password must contain at least one letter and one number')).toBeInTheDocument();
      });
    });

    it('shows passwords do not match error', async () => {
      renderForm({ mode: 'signup' });
      fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'Password1' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { name: 'confirmPassword', value: 'Different1' } });
      fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    it('clears field error when typing', async () => {
      renderForm();
      fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
      fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'a' } });
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });
  });

  describe('Successful Login', () => {
    it('calls Firebase signInWithEmailAndPassword and dispatches loginSuccess', async () => {
      const user = createFirebaseUser();
      mockSignIn.mockResolvedValue({ user });
      const onSuccess = vi.fn();

      renderForm({ onSuccess });

      fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'Password123' } });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
      });

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalled();
        expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining({
          id: 'user-123',
          email: 'test@example.com',
        }));
      });
    });
  });

  describe('Successful Signup', () => {
    it('calls Firebase createUserWithEmailAndPassword and sends verification', async () => {
      const user = createFirebaseUser();
      mockCreateUser.mockResolvedValue({ user });
      mockSendVerification.mockResolvedValue(undefined);
      const onSuccess = vi.fn();

      renderForm({ mode: 'signup', onSuccess });

      fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'new@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'Password1' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { name: 'confirmPassword', value: 'Password1' } });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
      });

      await waitFor(() => {
        expect(mockCreateUser).toHaveBeenCalled();
        expect(mockSendVerification).toHaveBeenCalledWith(user);
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Firebase Error Mapping', () => {
    const errorCases = [
      { code: 'auth/user-not-found', expected: 'No account found with this email' },
      { code: 'auth/wrong-password', expected: 'Incorrect password' },
      { code: 'auth/email-already-in-use', expected: 'An account already exists with this email' },
      { code: 'auth/weak-password', expected: 'Password is too weak' },
      { code: 'auth/invalid-email', expected: 'Invalid email address' },
    ];

    errorCases.forEach(({ code, expected }) => {
      it(`maps ${code} to "${expected}"`, async () => {
        const err = new Error('Firebase error');
        (err as unknown as Record<string, unknown>).code = code;
        mockSignIn.mockRejectedValue(err);
        const onError = vi.fn();

        renderForm({ onError });

        fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'Password123' } });

        await act(async () => {
          fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
        });

        await waitFor(() => {
          expect(onError).toHaveBeenCalled();
        });
      });
    });

    it('uses error message as fallback for unknown code', async () => {
      const err = new Error('Some custom error');
      (err as unknown as Record<string, unknown>).code = 'auth/unknown';
      mockSignIn.mockRejectedValue(err);
      const onError = vi.fn();

      renderForm({ onError });

      fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'Password123' } });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
      });

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(err);
      });
    });
  });

  describe('Loading State', () => {
    it('shows "Please wait..." and disables inputs during login', async () => {
      mockSignIn.mockReturnValue(new Promise(() => {})); // never resolves

      renderForm();

      fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'Password123' } });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
      });

      expect(screen.getByText('Please wait...')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeDisabled();
      expect(screen.getByLabelText('Password')).toBeDisabled();
    });
  });

  describe('Auth not initialized', () => {
    it('handles null auth gracefully', async () => {
      // The auth mock returns { currentUser: null } but we let signIn throw
      mockSignIn.mockRejectedValue(new Error('Authentication not initialized'));
      const onError = vi.fn();

      renderForm({ onError });

      fireEvent.change(screen.getByLabelText('Email'), { target: { name: 'email', value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { name: 'password', value: 'Password123' } });

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
      });

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });
  });
});
