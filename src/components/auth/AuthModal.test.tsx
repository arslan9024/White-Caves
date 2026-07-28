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
    loading: false,
    error: null,
    copy: { title: 'Sign In', subtitle: 'Welcome back', google: 'Sign in with Google', facebook: 'Sign in with Facebook', apple: 'Sign in with Apple', email: 'Email Address' },
    isGoogleAuthAvailable: true,
    socialSyncRecovery: null,
    retryLimitReached: false,
    selectedCategory: null,
    selectedRole: null,
    twoFactorCode: '',
    setTwoFactorCode: vi.fn(),
    handleSocialAuth: vi.fn(),
    retrySocialAuth: vi.fn(),
    clearSocialRecovery: vi.fn(),
    proceedToRoleSelection: vi.fn(),
    setSelectedRole: vi.fn(),
    completeSignUp: vi.fn(),
    goBackToStep: vi.fn(),
    handleTwoFactorSubmit: vi.fn(),
    getRolesForCategory: () => [],
  }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children, to, className }: any) => <a href={to} className={className}>{children}</a>,
}));

vi.mock('../../context/WorkspaceContext', () => ({
  useWorkspace: () => ({
    user: null,
    setUser: vi.fn(),
  }),
}));

describe('AuthModal', () => {
  it('renders modal dialog correctly', () => {
    render(<AuthModal onClose={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('triggers onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<AuthModal onClose={handleClose} />);
    const closeBtn = screen.getByLabelText('Close authentication popup');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
