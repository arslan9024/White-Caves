import { describe, it, expect, vi, beforeEach } from 'vitest';
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
  setUser: (payload: any) => ({ type: 'user/setUser', payload }),
}));

vi.mock('../../../../store/authSlice', () => ({
  loginStart: () => ({ type: 'auth/loginStart' }),
  loginSuccess: (payload: any) => ({ type: 'auth/loginSuccess', payload }),
  loginFailure: (msg: any) => ({ type: 'auth/loginFailure', payload: msg }),
}));

// Mock logger
vi.mock('../../../../utils/logger', () => ({
  createLogger: () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn() }),
}));

// Mock safeStorage
vi.mock('../../../../utils/safeStorage', () => ({
  safeStorage: {
    getJSON: vi.fn().mockReturnValue(null),
  },
}));

// Mock webAuthnService
const mockIsPlatformAuthenticatorAvailable = vi.fn().mockResolvedValue(true);
const mockAuthenticateWithBiometric = vi.fn().mockResolvedValue({ success: true });
const mockHasBiometricCredentials = vi.fn().mockReturnValue(true);
const mockGetBiometricSession = vi.fn().mockReturnValue({
  user: { id: 'u1', email: 'test@test.com', name: 'Test User' },
  token: 'jwt-token-123',
});

vi.mock('../../../../services/webAuthnService', () => ({
  isPlatformAuthenticatorAvailable: () => mockIsPlatformAuthenticatorAvailable(),
  authenticateWithBiometric: () => mockAuthenticateWithBiometric(),
  hasBiometricCredentials: () => mockHasBiometricCredentials(),
  getBiometricSession: () => mockGetBiometricSession(),
}));

import BiometricLoginButton from './BiometricLoginButton';
import { safeStorage } from '../../../../utils/safeStorage';

describe('BiometricLoginButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsPlatformAuthenticatorAvailable.mockResolvedValue(true);
    mockHasBiometricCredentials.mockReturnValue(true);
    mockAuthenticateWithBiometric.mockResolvedValue({ success: true });
    mockGetBiometricSession.mockReturnValue({
      user: { id: 'u1', email: 'test@test.com', name: 'Test User' },
      token: 'jwt-token-123',
    });
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
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/loginStart' });
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

    it('navigates to /select-role when no existing role', async () => {
      render(<BiometricLoginButton />);
      await waitFor(() => {
        expect(screen.getByLabelText('Sign in with Face ID or Touch ID')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByLabelText('Sign in with Face ID or Touch ID'));
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/select-role');
      });
    });

    it('navigates to role dashboard when existing role found', async () => {
      (safeStorage.getJSON as ReturnType<typeof vi.fn>).mockReturnValue({ role: 'admin' });
      render(<BiometricLoginButton />);
      await waitFor(() => {
        expect(screen.getByLabelText('Sign in with Face ID or Touch ID')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByLabelText('Sign in with Face ID or Touch ID'));
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
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
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/loginFailure', payload: 'Auth cancelled' });
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

    it('handles missing session data', async () => {
      mockGetBiometricSession.mockReturnValue(null);
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
