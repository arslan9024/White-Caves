import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock CSS
vi.mock('./BiometricLogin.css', () => ({}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock Redux
const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

// Mock stores
vi.mock('../../../../store/userSlice', () => ({
  setUser: (payload: unknown) => ({ type: 'user/setUser', payload }),
}));

vi.mock('../../../../store/authSlice', () => ({
  loginStart: () => ({ type: 'auth/loginStart' }),
  loginSuccess: (payload: unknown) => ({ type: 'auth/loginSuccess', payload }),
  loginFailure: (msg: unknown) => ({ type: 'auth/loginFailure', payload: msg }),
}));

// Mock logger
vi.mock('../../../../utils/logger', () => ({
  createLogger: () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn() }),
}));

// Mock safeStorage
vi.mock('../../../../utils/safeStorage', () => ({
  safeStorage: {
    get: vi.fn().mockReturnValue('jwt-token-123'),
    set: vi.fn(),
    getJSON: vi.fn().mockReturnValue(null),
    setJSON: vi.fn(),
    remove: vi.fn(),
  },
}));

// Mock webAuthnService — authenticateWithBiometric now returns user + token directly
const mockIsPlatformAuthenticatorAvailable = vi.fn().mockResolvedValue(true);
const mockAuthenticateWithBiometric = vi.fn().mockResolvedValue({
  success: true,
  user: { id: 'u1', email: 'test@test.com', name: 'Test User' },
  token: 'jwt-token-123',
});
const mockHasBiometricCredentials = vi.fn().mockReturnValue(true);

vi.mock('../../../../services/webAuthnService', () => ({
  isPlatformAuthenticatorAvailable: () => mockIsPlatformAuthenticatorAvailable(),
  authenticateWithBiometric: () => mockAuthenticateWithBiometric(),
  hasBiometricCredentials: () => mockHasBiometricCredentials(),
}));

import BiometricLoginButton from './BiometricLoginButton';

describe('BiometricLoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockIsPlatformAuthenticatorAvailable.mockResolvedValue(true);
    mockHasBiometricCredentials.mockReturnValue(true);
    mockAuthenticateWithBiometric.mockResolvedValue({
      success: true,
      user: { id: 'u1', email: 'test@test.com', name: 'Test User' },
      token: 'jwt-token-123',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('availability', () => {
    it('renders button when biometrics available and credentials exist', async () => {
      render(<BiometricLoginButton />);
      await waitFor(() => {
        expect(screen.getByLabelText('Sign in with Face ID or Touch ID')).toBeInTheDocument();
      });
    });

    it('renders null when platform authenticator not available', async () => {
      mockIsPlatformAuthenticatorAvailable.mockResolvedValue(false);
      const { container } = render(<BiometricLoginButton />);
      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });

    it('renders null when no biometric credentials', async () => {
      mockHasBiometricCredentials.mockReturnValue(false);
      const { container } = render(<BiometricLoginButton />);
      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('rendering', () => {
    it('shows correct button text', async () => {
      render(<BiometricLoginButton />);
      await waitFor(() => {
        expect(screen.getByText('Sign in with Face ID / Touch ID')).toBeInTheDocument();
      });
    });

    it('has correct aria-label', async () => {
      render(<BiometricLoginButton />);
      await waitFor(() => {
        expect(screen.getByLabelText('Sign in with Face ID or Touch ID')).toBeInTheDocument();
      });
    });
  });

  describe('authentication flow', () => {
    it('dispatches loginStart on click', async () => {
      render(<BiometricLoginButton />);
      await waitFor(() => {
        expect(screen.getByLabelText('Sign in with Face ID or Touch ID')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByLabelText('Sign in with Face ID or Touch ID'));
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/loginStart' });
      });
    });

    it('dispatches setUser and loginSuccess on successful auth', async () => {
      render(<BiometricLoginButton />);
      await waitFor(() => {
        expect(screen.getByLabelText('Sign in with Face ID or Touch ID')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByLabelText('Sign in with Face ID or Touch ID'));
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'user/setUser' })
        );
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'auth/loginSuccess' })
        );
      });
    });

    it('calls onSuccess callback on successful auth', async () => {
      const onSuccess = vi.fn();
      render(<BiometricLoginButton onSuccess={onSuccess} />);
      await waitFor(() => {
        expect(screen.getByLabelText('Sign in with Face ID or Touch ID')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByLabelText('Sign in with Face ID or Touch ID'));
      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining({ id: 'u1' }));
      });
    });

    it('navigates to /select-role when user has no assigned role', async () => {
      render(<BiometricLoginButton />);
      await waitFor(() => {
        expect(screen.getByLabelText('Sign in with Face ID or Touch ID')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByLabelText('Sign in with Face ID or Touch ID'));
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/select-role', { replace: true });
      });
    });

    it('navigates to /crm when biometric user has admin role', async () => {
      mockAuthenticateWithBiometric.mockResolvedValue({
        success: true,
        user: { id: 'u1', email: 'admin@test.com', name: 'Admin User', role: 'admin' },
        token: 'jwt-token-123',
      });
      render(<BiometricLoginButton />);
      await waitFor(() => {
        expect(screen.getByLabelText('Sign in with Face ID or Touch ID')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByLabelText('Sign in with Face ID or Touch ID'));
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/crm', { replace: true });
      });
    });
  });

  describe('error handling', () => {
    it('dispatches loginFailure on auth error', async () => {
      mockAuthenticateWithBiometric.mockRejectedValue(new Error('Auth cancelled'));
      render(<BiometricLoginButton />);
      await waitFor(() => {
        expect(screen.getByLabelText('Sign in with Face ID or Touch ID')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByLabelText('Sign in with Face ID or Touch ID'));
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          type: 'auth/loginFailure',
          payload: 'Auth cancelled',
        });
      });
    });

    it('calls onError on auth failure', async () => {
      const onError = vi.fn();
      mockAuthenticateWithBiometric.mockRejectedValue(new Error('Biometric failed'));
      render(<BiometricLoginButton onError={onError} />);
      await waitFor(() => {
        expect(screen.getByLabelText('Sign in with Face ID or Touch ID')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByLabelText('Sign in with Face ID or Touch ID'));
      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });

    it('handles missing user/token in server response', async () => {
      // Server returns success:true but no user data — treated as an error
      mockAuthenticateWithBiometric.mockResolvedValue({ success: true });
      const onError = vi.fn();
      render(<BiometricLoginButton onError={onError} />);
      await waitFor(() => {
        expect(screen.getByLabelText('Sign in with Face ID or Touch ID')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByLabelText('Sign in with Face ID or Touch ID'));
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'auth/loginFailure' })
        );
      });
    });
  });

  describe('disabled state', () => {
    it('disables button when disabled prop is true', async () => {
      render(<BiometricLoginButton disabled />);
      await waitFor(() => {
        expect(screen.getByLabelText('Sign in with Face ID or Touch ID')).toBeDisabled();
      });
    });
  });
});
