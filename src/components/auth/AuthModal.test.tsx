/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AuthModal from './AuthModal';

// Mock dependencies
vi.mock('../../hooks/useSignIn', () => ({
  useSignIn: () => ({
    mode: 'signin',
    step: 1,
    activeTab: 'email',
    setActiveTab: vi.fn(),
    loading: false,
    forgotPasswordLoading: false,
    verifyResetLoading: false,
    completeResetLoading: false,
    error: null,
    setError: vi.fn(),
    success: '',
    resetStage: 'request',
    setResetStage: vi.fn(),
    resetToken: '',
    setResetToken: vi.fn(),
    newPassword: '',
    setNewPassword: vi.fn(),
    confirmNewPassword: '',
    setConfirmNewPassword: vi.fn(),
    copy: {
      title: 'Sign In',
      subtitle: 'Welcome back',
      google: 'Sign in with Google',
      facebook: 'Sign in with Facebook',
      apple: 'Sign in with Apple',
      email: 'Email Address',
    },
    isGoogleAuthAvailable: true,
    googleAuthUnavailableMessage: '',
    socialSyncRecovery: null,
    socialRetryAttempts: 0,
    remainingSocialRetries: 3,
    switchMode: vi.fn(),
    email: '',
    setEmail: vi.fn(),
    password: '',
    setPassword: vi.fn(),
    confirmPassword: '',
    setConfirmPassword: vi.fn(),
    fullName: '',
    setFullName: vi.fn(),
    selectedCategory: null,
    setSelectedCategory: vi.fn(),
    selectedRole: null,
    setSelectedRole: vi.fn(),
    phone: '',
    setPhone: vi.fn(),
    otp: '',
    setOtp: vi.fn(),
    showOtpInput: false,
    resetOtp: vi.fn(),
    twoFactorCode: '',
    setTwoFactorCode: vi.fn(),
    handleEmailSubmit: vi.fn(),
    handleForgotPassword: vi.fn(),
    handleVerifyResetToken: vi.fn(),
    handleCompletePasswordReset: vi.fn(),
    handlePhoneSubmit: vi.fn(),
    handleOtpVerify: vi.fn(),
    handleSignInSuccess: vi.fn(),
    handleSocialAuth: vi.fn(),
    retrySocialAuth: vi.fn(),
    clearSocialRecovery: vi.fn(),
    proceedToRoleSelection: vi.fn(),
    completeSignUp: vi.fn(),
    goBackToStep: vi.fn(),
    handleTwoFactorSubmit: vi.fn(),
    getRolesForCategory: () => [],
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('../../context/WorkspaceContext', () => ({
  useWorkspace: () => ({
    user: null,
    setUser: vi.fn(),
  }),
}));

vi.mock('../../features/auth/components/BiometricLogin', () => ({
  BiometricLoginButton: () => null,
}));

describe('AuthModal', () => {
  it('renders modal dialog correctly', () => {
    render(<AuthModal onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute(
      'href',
      '/privacy-policy'
    );
  });

  it('triggers onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<AuthModal onClose={handleClose} />);
    const closeBtn = screen.getByLabelText('Close authentication popup');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
