/**
 * ErrorBoundary — Comprehensive Unit Tests
 *
 * Covers: error catching, countdown redirect, Try Again reset,
 * Go to Home Now, custom fallback, dev-mode error details, timer cleanup
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';

// ── Mocks ────────────────────────────────────────────────────────

const mockLogError = vi.fn();
vi.mock('../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(), warn: vi.fn(), error: mockLogError, debug: vi.fn(),
  }),
}));

const mockSafeRedirect = vi.fn();
vi.mock('../utils/safeRedirect', () => ({
  safeRedirect: (url: string) => mockSafeRedirect(url),
}));

// Mock the styled components import
vi.mock('./ErrorBoundary.styles', () => ({
  ErrorBoundaryContainer: ({ children, ...p }: React.PropsWithChildren) => <div data-testid="eb-container" {...p}>{children}</div>,
  ErrorBoundaryContent: ({ children, ...p }: React.PropsWithChildren) => <div {...p}>{children}</div>,
  ErrorIconBoundary: ({ children, ...p }: React.PropsWithChildren) => <span {...p}>{children}</span>,
  ErrorTitle: ({ children, ...p }: React.PropsWithChildren) => <h1 {...p}>{children}</h1>,
  ErrorMessage: ({ children, ...p }: React.PropsWithChildren) => <p {...p}>{children}</p>,
  RedirectNotice: ({ children, ...p }: React.PropsWithChildren) => <p {...p}>{children}</p>,
  Countdown: ({ children, ...p }: React.PropsWithChildren) => <span data-testid="countdown" {...p}>{children}</span>,
  ErrorActions: ({ children, ...p }: React.PropsWithChildren) => <div {...p}>{children}</div>,
  ErrorButton: ({ children, $variant, ...p }: React.PropsWithChildren<{ $variant?: string; onClick?: () => void }>) => (
    <button data-variant={$variant} {...p}>{children}</button>
  ),
  ErrorDetails: ({ children, ...p }: React.PropsWithChildren) => <details {...p}>{children}</details>,
  ErrorStack: ({ children, ...p }: React.PropsWithChildren) => <pre {...p}>{children}</pre>,
}));

import ErrorBoundary from './ErrorBoundary';

// ── Helpers ──────────────────────────────────────────────────────

function Bomb({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) throw new Error('Test error');
  return <div>Safe children</div>;
}

const originalError = console.error;
beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  console.error = vi.fn();
});
afterEach(() => {
  vi.useRealTimers();
  console.error = originalError;
});

// ── Tests ────────────────────────────────────────────────────────

describe('ErrorBoundary', () => {
  describe('normal rendering', () => {
    it('renders children when no error', () => {
      render(
        <ErrorBoundary>
          <div>Hello</div>
        </ErrorBoundary>,
      );
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <ErrorBoundary>
          <span>A</span>
          <span>B</span>
        </ErrorBoundary>,
      );
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('catches error and shows fallback UI', () => {
      render(
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>,
      );
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });

    it('shows apology message', () => {
      render(
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>,
      );
      expect(screen.getByText(/unexpected error has occurred/)).toBeInTheDocument();
    });

    it('shows warning icon', () => {
      render(
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>,
      );
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('shows initial countdown of 5', () => {
      render(
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>,
      );
      expect(screen.getByTestId('countdown').textContent).toBe('5');
    });

    it('shows redirect notice', () => {
      render(
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>,
      );
      expect(screen.getByText(/Redirecting to home page in/)).toBeInTheDocument();
    });
  });

  describe('countdown timer', () => {
    it('decrements countdown each second', () => {
      render(
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>,
      );
      expect(screen.getByTestId('countdown').textContent).toBe('5');

      act(() => { vi.advanceTimersByTime(1000); });
      expect(screen.getByTestId('countdown').textContent).toBe('4');

      act(() => { vi.advanceTimersByTime(1000); });
      expect(screen.getByTestId('countdown').textContent).toBe('3');
    });

    it('calls safeRedirect after countdown reaches 0', () => {
      render(
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>,
      );

      // Advance through full countdown (5 seconds)
      act(() => { vi.advanceTimersByTime(5000); });

      expect(mockSafeRedirect).toHaveBeenCalledWith('/');
    });

    it('does not redirect before countdown completes', () => {
      render(
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>,
      );

      act(() => { vi.advanceTimersByTime(3000); });
      expect(mockSafeRedirect).not.toHaveBeenCalled();
    });
  });

  describe('Try Again button', () => {
    it('renders Try Again button', () => {
      render(
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>,
      );
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('resets error state on click', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <Bomb shouldThrow />
        </ErrorBoundary>,
      );
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

      rerender(
        <ErrorBoundary>
          <Bomb shouldThrow={false} />
        </ErrorBoundary>,
      );

      fireEvent.click(screen.getByText('Try Again'));
      expect(screen.getByText('Safe children')).toBeInTheDocument();
    });

    it('calls onReset prop when provided', () => {
      const onReset = vi.fn();
      const { rerender } = render(
        <ErrorBoundary onReset={onReset}>
          <Bomb shouldThrow />
        </ErrorBoundary>,
      );

      rerender(
        <ErrorBoundary onReset={onReset}>
          <Bomb shouldThrow={false} />
        </ErrorBoundary>,
      );

      fireEvent.click(screen.getByText('Try Again'));
      expect(onReset).toHaveBeenCalledTimes(1);
    });

    it('clears countdown timer on reset', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <Bomb shouldThrow />
        </ErrorBoundary>,
      );

      // Advance a bit
      act(() => { vi.advanceTimersByTime(2000); });

      // Swap to non-throwing child before reset
      rerender(
        <ErrorBoundary>
          <Bomb shouldThrow={false} />
        </ErrorBoundary>,
      );

      // Click reset
      fireEvent.click(screen.getByText('Try Again'));

      // Advance more - should NOT redirect since timer was cleared
      act(() => { vi.advanceTimersByTime(5000); });
      expect(mockSafeRedirect).not.toHaveBeenCalled();
    });
  });

  describe('Go to Home Now button', () => {
    it('renders Go to Home Now button', () => {
      render(
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>,
      );
      expect(screen.getByText('Go to Home Now')).toBeInTheDocument();
    });

    it('calls safeRedirect immediately on click', () => {
      render(
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>,
      );
      fireEvent.click(screen.getByText('Go to Home Now'));
      expect(mockSafeRedirect).toHaveBeenCalledWith('/');
    });
  });

  describe('custom fallback', () => {
    it('renders custom fallback when provided', () => {
      render(
        <ErrorBoundary fallback={<div>Custom fallback</div>}>
          <Bomb />
        </ErrorBoundary>,
      );
      expect(screen.getByText('Custom fallback')).toBeInTheDocument();
      expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument();
    });
  });

  describe('logging', () => {
    it('logs error via createLogger', () => {
      render(
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>,
      );
      expect(mockLogError).toHaveBeenCalledWith(
        'Caught an error:',
        expect.any(Error),
        expect.objectContaining({ componentStack: expect.any(String) }),
      );
    });
  });

  describe('dev-mode error details', () => {
    it('shows error details in dev mode', () => {
      render(
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>,
      );
      expect(screen.getByText(/Error Details/)).toBeInTheDocument();
      expect(screen.getByText(/Test error/)).toBeInTheDocument();
    });
  });

  describe('cleanup', () => {
    it('clears timer on unmount', () => {
      const { unmount } = render(
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>,
      );

      unmount();

      // Advance time — should NOT redirect since timer was cleared
      act(() => { vi.advanceTimersByTime(10000); });
      expect(mockSafeRedirect).not.toHaveBeenCalled();
    });
  });
});
