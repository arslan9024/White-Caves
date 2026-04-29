import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock CSS
vi.mock('./AuthLayout.css', () => ({}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock child components
vi.mock('../SocialLogin', () => ({
  SocialLoginButtons: ({ onSuccess, onError }: any) => (
    <div data-testid="social-login">
      <button onClick={() => onSuccess({ id: '1', name: 'Test User' })}>Social Login Success</button>
      <button onClick={() => onError(new Error('Social login failed'))}>Social Login Error</button>
    </div>
  ),
}));

vi.mock('../EmailLogin', () => ({
  EmailLoginForm: ({ mode, onSuccess, onError, onModeChange }: any) => (
    <div data-testid="email-login-form">
      <span>Mode: {mode}</span>
      <button onClick={() => onSuccess({ id: '2', email: 'test@test.com' })}>Email Submit</button>
      <button onClick={() => onError(new Error('Email auth failed'))}>Email Error</button>
      <button onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}>Toggle Mode</button>
    </div>
  ),
}));

vi.mock('../MobileLogin', () => ({
  MobileLoginForm: ({ onSuccess, onError }: any) => (
    <div data-testid="mobile-login-form">
      <button onClick={() => onSuccess({ id: '3', phone: '+971' })}>Phone Submit</button>
      <button onClick={() => onError({ message: 'Phone auth failed' })}>Phone Error</button>
    </div>
  ),
}));

import AuthPage from './AuthPage';

describe('AuthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders login header by default', () => {
      render(<AuthPage />);
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to access your account')).toBeInTheDocument();
    });

    it('renders signup header when defaultMode is signup', () => {
      render(<AuthPage defaultMode="signup" />);
      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByText('Join White Caves Real Estate today')).toBeInTheDocument();
    });

    it('renders social login buttons', () => {
      render(<AuthPage />);
      expect(screen.getByTestId('social-login')).toBeInTheDocument();
    });

    it('renders email and phone tabs', () => {
      render(<AuthPage />);
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
    });

    it('renders footer with terms and privacy links', () => {
      render(<AuthPage />);
      expect(screen.getByText('Terms of Service')).toHaveAttribute('href', '/terms');
      expect(screen.getByText('Privacy Policy')).toHaveAttribute('href', '/privacy');
    });
  });

  describe('tab switching', () => {
    it('shows email form by default', () => {
      render(<AuthPage />);
      expect(screen.getByTestId('email-login-form')).toBeInTheDocument();
    });

    it('switches to phone form when phone tab is clicked', () => {
      render(<AuthPage />);
      fireEvent.click(screen.getByText('Phone'));
      expect(screen.getByTestId('mobile-login-form')).toBeInTheDocument();
    });

    it('switches back to email form', () => {
      render(<AuthPage />);
      fireEvent.click(screen.getByText('Phone'));
      fireEvent.click(screen.getByText('Email'));
      expect(screen.getByTestId('email-login-form')).toBeInTheDocument();
    });

    it('starts with phone tab when defaultTab is phone', () => {
      render(<AuthPage defaultTab="phone" />);
      expect(screen.getByTestId('mobile-login-form')).toBeInTheDocument();
    });
  });

  describe('auth success', () => {
    it('navigates to / on social login success (no onSuccess prop)', () => {
      render(<AuthPage />);
      fireEvent.click(screen.getByText('Social Login Success'));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('calls onSuccess callback when provided', () => {
      const onSuccess = vi.fn();
      render(<AuthPage onSuccess={onSuccess} />);
      fireEvent.click(screen.getByText('Social Login Success'));
      expect(onSuccess).toHaveBeenCalledWith({ id: '1', name: 'Test User' });
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('navigates to / on email login success', () => {
      render(<AuthPage />);
      fireEvent.click(screen.getByText('Email Submit'));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('error handling', () => {
    it('displays error message on social login error', () => {
      render(<AuthPage />);
      fireEvent.click(screen.getByText('Social Login Error'));
      expect(screen.getByText('Social login failed')).toBeInTheDocument();
    });

    it('displays error message on email auth error', () => {
      render(<AuthPage />);
      fireEvent.click(screen.getByText('Email Error'));
      expect(screen.getByText('Email auth failed')).toBeInTheDocument();
    });

    it('displays object error message on phone auth error', () => {
      render(<AuthPage />);
      fireEvent.click(screen.getByText('Phone'));
      fireEvent.click(screen.getByText('Phone Error'));
      expect(screen.getByText('Phone auth failed')).toBeInTheDocument();
    });

    it('dismisses error when dismiss button is clicked', () => {
      render(<AuthPage />);
      fireEvent.click(screen.getByText('Social Login Error'));
      expect(screen.getByText('Social login failed')).toBeInTheDocument();
      fireEvent.click(screen.getByLabelText('Dismiss error'));
      expect(screen.queryByText('Social login failed')).not.toBeInTheDocument();
    });

    it('clears error on successful auth', () => {
      render(<AuthPage />);
      fireEvent.click(screen.getByText('Social Login Error'));
      expect(screen.getByText('Social login failed')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Social Login Success'));
      expect(screen.queryByText('Social login failed')).not.toBeInTheDocument();
    });
  });

  describe('mode switching', () => {
    it('passes current mode to EmailLoginForm', () => {
      render(<AuthPage />);
      expect(screen.getByText('Mode: login')).toBeInTheDocument();
    });

    it('switches mode via EmailLoginForm onModeChange', () => {
      render(<AuthPage />);
      fireEvent.click(screen.getByText('Toggle Mode'));
      expect(screen.getByText('Create Account')).toBeInTheDocument();
    });
  });
});
