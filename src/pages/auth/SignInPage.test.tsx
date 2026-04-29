/**
 * SignInPage — Unit Tests
 * Tests: rendering, mode switching, form validation, email/phone tabs,
 * role selection flow, success/error states, social auth
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks ────────────────────────────────────────────────────────

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../config/firebase', () => ({
  signInWithGoogle: vi.fn(),
  signInWithFacebook: vi.fn(),
  signInWithApple: vi.fn(),
  signInWithPhone: vi.fn(),
  createRecaptchaVerifier: vi.fn(),
}));

const mockBackendLogin = vi.fn();
const mockBackendRegister = vi.fn();
const mockSyncFirebaseUser = vi.fn();
vi.mock('../../services/authService', () => ({
  loginWithEmail: (...args: unknown[]) => mockBackendLogin(...args),
  registerWithEmail: (...args: unknown[]) => mockBackendRegister(...args),
  syncFirebaseUser: (...args: unknown[]) => mockSyncFirebaseUser(...args),
}));

vi.mock('../../features/auth/components/BiometricLogin', () => ({
  BiometricLoginButton: ({ onSuccess, onError }: Record<string, unknown>) => (
    <button data-testid="biometric-btn" onClick={() => (onSuccess as Function)?.({ uid: 'bio1', email: 'bio@test.com', displayName: 'Bio User' })}>
      Biometric
    </button>
  ),
}));

vi.mock('../../utils/safeStorage', () => ({
  safeStorage: {
    setJSON: vi.fn(),
    getJSON: vi.fn(),
    remove: vi.fn(),
  },
}));

import SignInPage from './SignInPage';
import userReducer from '../../store/userSlice';

// ── Helpers ──────────────────────────────────────────────────────

const createStore = () =>
  configureStore({
    reducer: { user: userReducer },
    preloadedState: {
      user: { currentUser: null, loading: false, error: null } as unknown as ReturnType<typeof userReducer>,
    },
  });

const renderPage = () => {
  const store = createStore();
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <SignInPage />
        </MemoryRouter>
      </Provider>,
    ),
  };
};

// ── Tests ────────────────────────────────────────────────────────

describe('SignInPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Rendering ────────────────────────────────────────────────

  describe('Rendering', () => {
    it('should render sign-in page', () => {
      renderPage();
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('should render sign-in subtitle', () => {
      renderPage();
      expect(screen.getByText('Sign in to access your personalized dashboard')).toBeInTheDocument();
    });

    it('should render White Caves logo', () => {
      renderPage();
      expect(screen.getByText('White Caves')).toBeInTheDocument();
    });

    it('should render email tab by default', () => {
      renderPage();
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    });

    it('should render social auth buttons', () => {
      renderPage();
      expect(screen.getByText(/Google/)).toBeInTheDocument();
      expect(screen.getByText(/Facebook/)).toBeInTheDocument();
      expect(screen.getByText(/Apple/)).toBeInTheDocument();
    });

    it('should render biometric login button', () => {
      renderPage();
      expect(screen.getByTestId('biometric-btn')).toBeInTheDocument();
    });
  });

  // ── Mode Switching ───────────────────────────────────────────

  describe('Mode Switching', () => {
    it('should switch to signup mode', () => {
      renderPage();
      const switchBtn = screen.getByText(/Don't have an account\? Sign Up/i);
      fireEvent.click(switchBtn);
      expect(screen.getByText('Create Account')).toBeInTheDocument();
    });

    it('should show signup subtitle when in signup mode', () => {
      renderPage();
      const switchBtn = screen.getByText(/Don't have an account\? Sign Up/i);
      fireEvent.click(switchBtn);
      expect(screen.getByText('Join White Caves to explore luxury properties in Dubai')).toBeInTheDocument();
    });

    it('should switch back to signin mode', () => {
      renderPage();
      // Switch to signup
      const toSignup = screen.getByText(/Don't have an account\? Sign Up/i);
      fireEvent.click(toSignup);
      expect(screen.getByText('Create Account')).toBeInTheDocument();

      // Switch back to signin
      const toSignin = screen.getByText(/Already have an account\? Sign In/i);
      fireEvent.click(toSignin);
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });
  });

  // ── Email Tab ────────────────────────────────────────────────

  describe('Email Tab', () => {
    it('should render email and password fields', () => {
      renderPage();
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    });

    it('should update email field on input', () => {
      renderPage();
      const emailInput = screen.getByPlaceholderText('Enter your email') as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      expect(emailInput.value).toBe('test@example.com');
    });

    it('should update password field on input', () => {
      renderPage();
      const passInput = screen.getByPlaceholderText('Enter your password') as HTMLInputElement;
      fireEvent.change(passInput, { target: { value: 'password123' } });
      expect(passInput.value).toBe('password123');
    });

    it('should call backend login on email form submit', async () => {
      mockBackendLogin.mockResolvedValue({
        data: { user: { id: 'u1', email: 'test@test.com', name: 'Test', role: 'agent' } },
      });
      renderPage();
      fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'pass1234' } });
      
      const form = screen.getByPlaceholderText('Enter your email').closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockBackendLogin).toHaveBeenCalledWith('test@test.com', 'pass1234');
      });
    });

    it('should show success message on successful sign in', async () => {
      mockBackendLogin.mockResolvedValue({
        data: { user: { id: 'u1', email: 'test@test.com', name: 'Test', role: 'agent' } },
      });
      renderPage();
      fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'pass1234' } });
      
      const form = screen.getByPlaceholderText('Enter your email').closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Sign in successful!')).toBeInTheDocument();
      });
    });

    it('should show error on failed login', async () => {
      mockBackendLogin.mockRejectedValue(new Error('Invalid credentials'));
      renderPage();
      fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'bad@test.com' } });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'wrong' } });
      
      const form = screen.getByPlaceholderText('Enter your email').closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });
  });

  // ── Signup Validation ────────────────────────────────────────

  describe('Signup Validation', () => {
    const switchToSignup = () => {
      const switchBtn = screen.getByText(/Don't have an account\? Sign Up/i);
      fireEvent.click(switchBtn);
    };

    it('should show error when passwords do not match in signup', async () => {
      renderPage();
      switchToSignup();

      // Fill form
      fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'new@test.com' } });
      const passwordInputs = screen.getAllByPlaceholderText(/password/i);
      fireEvent.change(passwordInputs[0], { target: { value: 'pass1234' } });
      fireEvent.change(passwordInputs[1], { target: { value: 'different' } });

      const form = screen.getByPlaceholderText('Enter your email').closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    it('should show error when password is too short', async () => {
      renderPage();
      switchToSignup();

      fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'new@test.com' } });
      const passwordInputs = screen.getAllByPlaceholderText(/password/i);
      fireEvent.change(passwordInputs[0], { target: { value: 'abc' } });
      fireEvent.change(passwordInputs[1], { target: { value: 'abc' } });

      const form = screen.getByPlaceholderText('Enter your email').closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
      });
    });

    it('should show error when password lacks letter or number', async () => {
      renderPage();
      switchToSignup();

      fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'new@test.com' } });
      const passwordInputs = screen.getAllByPlaceholderText(/password/i);
      fireEvent.change(passwordInputs[0], { target: { value: '12345678' } });
      fireEvent.change(passwordInputs[1], { target: { value: '12345678' } });

      const form = screen.getByPlaceholderText('Enter your email').closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Password must contain at least one letter and one number')).toBeInTheDocument();
      });
    });
  });

  // ── Phone Tab ────────────────────────────────────────────────

  describe('Phone Tab', () => {
    it('should switch to phone tab', () => {
      renderPage();
      const phoneTab = screen.getByText('Phone');
      fireEvent.click(phoneTab);
      expect(screen.getByPlaceholderText('+971 50 123 4567')).toBeInTheDocument();
    });

    it('should render phone input field', () => {
      renderPage();
      fireEvent.click(screen.getByText('Phone'));
      const phoneInput = screen.getByPlaceholderText('+971 50 123 4567') as HTMLInputElement;
      fireEvent.change(phoneInput, { target: { value: '+971501234567' } });
      expect(phoneInput.value).toBe('+971501234567');
    });
  });

  // ── Role Selection (Signup Step 2 & 3) ───────────────────────

  describe('Role Selection Flow', () => {
    it('should show category selection after signup success', async () => {
      mockBackendRegister.mockResolvedValue({
        data: { user: { id: 'u1', email: 'new@test.com', name: 'New User' } },
      });
      renderPage();
      // Switch to signup
      const switchBtn = screen.getByText(/Don't have an account\? Sign Up/i);
      fireEvent.click(switchBtn);

      // Fill and submit
      fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'new@test.com' } });
      const passwordInputs = screen.getAllByPlaceholderText(/password/i);
      fireEvent.change(passwordInputs[0], { target: { value: 'password1' } });
      fireEvent.change(passwordInputs[1], { target: { value: 'password1' } });

      const form = screen.getByPlaceholderText('Enter your email').closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        // Should now be on step 2 — category selection
        expect(screen.getByText('Client')).toBeInTheDocument();
        expect(screen.getByText('Staff Member')).toBeInTheDocument();
      });
    });

    it('should show error when no category selected', async () => {
      mockBackendRegister.mockResolvedValue({
        data: { user: { id: 'u1', email: 'new@test.com', name: 'New User' } },
      });
      renderPage();
      const switchBtn = screen.getByText(/Don't have an account\? Sign Up/i);
      fireEvent.click(switchBtn);

      fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'new@test.com' } });
      const passwordInputs = screen.getAllByPlaceholderText(/password/i);
      fireEvent.change(passwordInputs[0], { target: { value: 'password1' } });
      fireEvent.change(passwordInputs[1], { target: { value: 'password1' } });

      const form = screen.getByPlaceholderText('Enter your email').closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Client')).toBeInTheDocument();
      });

      // Continue button should be disabled when no category selected
      const continueBtn = screen.getByText('Continue');
      expect(continueBtn).toBeDisabled();
    });
  });

  // ── Error/Success States ─────────────────────────────────────

  describe('Error/Success States', () => {
    it('should show auth error class when error exists', async () => {
      mockBackendLogin.mockRejectedValue(new Error('Server error'));
      renderPage();
      fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'pass1234' } });
      
      const form = screen.getByPlaceholderText('Enter your email').closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        const errorDiv = document.querySelector('.auth-error');
        expect(errorDiv).toBeTruthy();
        expect(errorDiv?.textContent).toBe('Server error');
      });
    });
  });
});
