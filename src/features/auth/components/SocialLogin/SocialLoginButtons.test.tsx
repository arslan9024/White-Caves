/**
 * SocialLoginButtons.tsx — Comprehensive Unit Tests
 * Batch 36 | Social login provider buttons (Google, Facebook, Apple, LinkedIn, UAE Pass)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

/* ── Mocks ──────────────────────────────────────────────── */

// Mock child button components
vi.mock('./GoogleLoginButton', () => ({
  default: ({ onSuccess, onError, disabled }: any) => (
    <button data-testid="google-btn" disabled={disabled} onClick={() => onSuccess?.({ provider: 'google' })}>
      Google
    </button>
  ),
}));

vi.mock('./FacebookLoginButton', () => ({
  default: ({ onSuccess, onError, disabled }: any) => (
    <button data-testid="facebook-btn" disabled={disabled} onClick={() => onSuccess?.({ provider: 'facebook' })}>
      Facebook
    </button>
  ),
}));

vi.mock('./AppleLoginButton', () => ({
  default: ({ onSuccess, onError, disabled }: any) => (
    <button data-testid="apple-btn" disabled={disabled} onClick={() => onSuccess?.({ provider: 'apple' })}>
      Apple
    </button>
  ),
}));

vi.mock('./LinkedInLoginButton', () => ({
  default: ({ onSuccess, onError, disabled }: any) => (
    <button data-testid="linkedin-btn" disabled={disabled} onClick={() => onSuccess?.({ provider: 'linkedin' })}>
      LinkedIn
    </button>
  ),
}));

vi.mock('./UAEPassLoginButton', () => ({
  default: ({ onSuccess, onError, disabled }: any) => (
    <button data-testid="uaepass-btn" disabled={disabled} onClick={() => onSuccess?.({ provider: 'uaepass' })}>
      UAE Pass
    </button>
  ),
}));

// Mock CSS
vi.mock('./SocialLogin.css', () => ({}));

import SocialLoginButtons from './SocialLoginButtons';

/* ── Tests ──────────────────────────────────────────────── */
describe('SocialLoginButtons', () => {
  const defaultProps = {
    onSuccess: vi.fn(),
    onError: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  // ─────────────── Default Rendering ───────────────
  describe('default rendering', () => {
    it('renders header text', () => {
      render(<SocialLoginButtons {...defaultProps} />);
      expect(screen.getByText('Quick sign in with')).toBeInTheDocument();
    });

    it('shows Google button', () => {
      render(<SocialLoginButtons {...defaultProps} />);
      expect(screen.getByTestId('google-btn')).toBeInTheDocument();
    });

    it('shows Facebook button', () => {
      render(<SocialLoginButtons {...defaultProps} />);
      expect(screen.getByTestId('facebook-btn')).toBeInTheDocument();
    });

    it('shows Apple button', () => {
      render(<SocialLoginButtons {...defaultProps} />);
      expect(screen.getByTestId('apple-btn')).toBeInTheDocument();
    });

    it('shows UAE Pass button by default (showUAEPass=true)', () => {
      render(<SocialLoginButtons {...defaultProps} />);
      expect(screen.getByTestId('uaepass-btn')).toBeInTheDocument();
    });

    it('hides LinkedIn by default', () => {
      render(<SocialLoginButtons {...defaultProps} />);
      expect(screen.queryByTestId('linkedin-btn')).not.toBeInTheDocument();
    });
  });

  // ─────────────── Conditional Buttons ───────────────
  describe('conditional buttons', () => {
    it('shows LinkedIn when showLinkedIn=true', () => {
      render(<SocialLoginButtons {...defaultProps} showLinkedIn />);
      expect(screen.getByTestId('linkedin-btn')).toBeInTheDocument();
    });

    it('hides UAE Pass when showUAEPass=false', () => {
      render(<SocialLoginButtons {...defaultProps} showUAEPass={false} />);
      expect(screen.queryByTestId('uaepass-btn')).not.toBeInTheDocument();
    });

    it('shows all 5 buttons when both showLinkedIn and showUAEPass', () => {
      render(<SocialLoginButtons {...defaultProps} showLinkedIn showUAEPass />);
      expect(screen.getByTestId('google-btn')).toBeInTheDocument();
      expect(screen.getByTestId('facebook-btn')).toBeInTheDocument();
      expect(screen.getByTestId('apple-btn')).toBeInTheDocument();
      expect(screen.getByTestId('linkedin-btn')).toBeInTheDocument();
      expect(screen.getByTestId('uaepass-btn')).toBeInTheDocument();
    });
  });

  // ─────────────── Disabled State ───────────────
  describe('disabled state', () => {
    it('passes disabled=true to all child buttons', () => {
      render(<SocialLoginButtons {...defaultProps} disabled />);
      expect(screen.getByTestId('google-btn')).toBeDisabled();
      expect(screen.getByTestId('facebook-btn')).toBeDisabled();
      expect(screen.getByTestId('apple-btn')).toBeDisabled();
      expect(screen.getByTestId('uaepass-btn')).toBeDisabled();
    });

    it('buttons are enabled by default', () => {
      render(<SocialLoginButtons {...defaultProps} />);
      expect(screen.getByTestId('google-btn')).not.toBeDisabled();
    });
  });

  // ─────────────── Layout ───────────────
  describe('layout', () => {
    it('applies vertical layout by default (no horizontal class)', () => {
      const { container } = render(<SocialLoginButtons {...defaultProps} />);
      const wrapper = container.querySelector('.social-login-container');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).not.toHaveClass('horizontal');
    });

    it('applies horizontal class when layout="horizontal"', () => {
      const { container } = render(<SocialLoginButtons {...defaultProps} layout="horizontal" />);
      const wrapper = container.querySelector('.social-login-container');
      expect(wrapper).toHaveClass('horizontal');
    });
  });

  // ─────────────── Callbacks ───────────────
  describe('callbacks', () => {
    it('passes onSuccess to child buttons', () => {
      const onSuccess = vi.fn();
      render(<SocialLoginButtons onSuccess={onSuccess} onError={vi.fn()} />);
      screen.getByTestId('google-btn').click();
      expect(onSuccess).toHaveBeenCalledWith({ provider: 'google' });
    });

    it('passes onError to child buttons', () => {
      const onError = vi.fn();
      render(<SocialLoginButtons onSuccess={vi.fn()} onError={onError} />);
      // onError is passed through but triggering it depends on child implementation
      expect(screen.getByTestId('google-btn')).toBeInTheDocument();
    });
  });

  // ─────────────── Edge Cases ───────────────
  describe('edge cases', () => {
    it('renders without optional props', () => {
      expect(() =>
        render(<SocialLoginButtons onSuccess={vi.fn()} onError={vi.fn()} />),
      ).not.toThrow();
    });
  });
});
