import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// Mock CSS
vi.mock('./MobileLogin.css', () => ({}));

// Mock Firebase
const mockSignInWithPhoneNumber = vi.fn();
const mockRecaptchaVerifierInstance = { clear: vi.fn() };

vi.mock('firebase/auth', () => ({
  RecaptchaVerifier: vi.fn().mockImplementation(() => mockRecaptchaVerifierInstance),
  signInWithPhoneNumber: (...args: any[]) => mockSignInWithPhoneNumber(...args),
}));

vi.mock('../../../../config/firebase', () => ({
  auth: { currentUser: null },
}));

// Mock Redux
const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock('../../../../store/authSlice', () => ({
  loginStart: () => ({ type: 'auth/loginStart' }),
  loginSuccess: (p: any) => ({ type: 'auth/loginSuccess', payload: p }),
  loginFailure: (p: any) => ({ type: 'auth/loginFailure', payload: p }),
}));

vi.mock('../../../../utils/logger', () => ({
  createLogger: () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn() }),
}));

// Mock OTPVerification
vi.mock('./OTPVerification', () => ({
  default: ({ onVerify, onResend, phone }: any) => (
    <div data-testid="otp-verification">
      <span>OTP for {phone}</span>
      <button onClick={() => onVerify('123456')}>Verify OTP</button>
      <button onClick={() => onResend()}>Resend OTP</button>
    </div>
  ),
}));

import MobileLoginForm from './MobileLoginForm';

describe('MobileLoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    window.recaptchaVerifier = { clear: vi.fn() } as unknown as typeof window.recaptchaVerifier;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('phone step rendering', () => {
    it('renders phone input', () => {
      render(<MobileLoginForm />);
      expect(screen.getByPlaceholderText(/phone/i)).toBeInTheDocument();
    });

    it('renders country code selector', () => {
      render(<MobileLoginForm />);
      const select = screen.getByDisplayValue('+971 UAE');
      expect(select).toBeInTheDocument();
    });

    it('renders send OTP button', () => {
      render(<MobileLoginForm />);
      expect(screen.getByText(/send.*otp|get.*code|verify/i)).toBeInTheDocument();
    });

    it('renders recaptcha container', () => {
      const { container } = render(<MobileLoginForm />);
      expect(container.querySelector('#recaptcha-container')).toBeInTheDocument();
    });
  });

  describe('country code selection', () => {
    it('shows UAE as default country', () => {
      render(<MobileLoginForm />);
      expect(screen.getByDisplayValue('+971 UAE')).toBeInTheDocument();
    });
  });

  describe('phone validation', () => {
    it('shows error for short phone number', async () => {
      render(<MobileLoginForm />);
      const input = screen.getByPlaceholderText(/phone/i);
      fireEvent.change(input, { target: { value: '12345' } });
      
      const form = input.closest('form')!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByText(/valid phone/i)).toBeInTheDocument();
      });
    });

    it('shows error for empty phone number', async () => {
      render(<MobileLoginForm />);
      const input = screen.getByPlaceholderText(/phone/i);
      const form = input.closest('form')!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByText(/valid phone/i)).toBeInTheDocument();
      });
    });
  });

  describe('OTP send flow', () => {
    it('dispatches loginStart on form submit', async () => {
      mockSignInWithPhoneNumber.mockResolvedValue({ confirm: vi.fn() });
      render(<MobileLoginForm />);
      
      const input = screen.getByPlaceholderText(/phone/i);
      fireEvent.change(input, { target: { value: '501234567' } });
      
      const form = input.closest('form')!;
      fireEvent.submit(form);
      
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/loginStart' });
    });

    it('transitions to OTP step on success', async () => {
      mockSignInWithPhoneNumber.mockResolvedValue({ confirm: vi.fn() });
      render(<MobileLoginForm />);
      
      const input = screen.getByPlaceholderText(/phone/i);
      fireEvent.change(input, { target: { value: '501234567' } });
      
      const form = input.closest('form')!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByTestId('otp-verification')).toBeInTheDocument();
      });
    });

    it('shows error on OTP send failure', async () => {
      mockSignInWithPhoneNumber.mockRejectedValue(new Error('SMS quota exceeded'));
      render(<MobileLoginForm />);
      
      const input = screen.getByPlaceholderText(/phone/i);
      fireEvent.change(input, { target: { value: '501234567' } });
      
      const form = input.closest('form')!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByText(/SMS quota exceeded/i)).toBeInTheDocument();
      });
    });

    it('dispatches loginFailure on error', async () => {
      mockSignInWithPhoneNumber.mockRejectedValue(new Error('Network error'));
      render(<MobileLoginForm />);
      
      const input = screen.getByPlaceholderText(/phone/i);
      fireEvent.change(input, { target: { value: '501234567' } });
      
      const form = input.closest('form')!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'auth/loginFailure', payload: 'Network error' });
      });
    });
  });

  describe('OTP verification', () => {
    it('shows OTP component after successful send', async () => {
      const mockConfirm = vi.fn().mockResolvedValue({
        user: { uid: 'u1', phoneNumber: '+971501234567', displayName: 'Test' },
      });
      mockSignInWithPhoneNumber.mockResolvedValue({ confirm: mockConfirm });
      
      render(<MobileLoginForm />);
      const input = screen.getByPlaceholderText(/phone/i);
      fireEvent.change(input, { target: { value: '501234567' } });
      const form = input.closest('form')!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(screen.getByTestId('otp-verification')).toBeInTheDocument();
      });
    });
  });

  describe('callbacks', () => {
    it('calls onError when OTP send fails', async () => {
      const onError = vi.fn();
      mockSignInWithPhoneNumber.mockRejectedValue(new Error('Auth failed'));
      
      render(<MobileLoginForm onError={onError} />);
      const input = screen.getByPlaceholderText(/phone/i);
      fireEvent.change(input, { target: { value: '501234567' } });
      const form = input.closest('form')!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });
  });
});
