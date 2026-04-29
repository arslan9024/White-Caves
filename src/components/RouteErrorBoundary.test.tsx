/**
 * RouteErrorBoundary — Comprehensive Unit Tests
 *
 * Covers: error catching, inline error display, retry reset, section labels,
 * dev-mode error details, Go Home button, children rendering, componentDidCatch logging
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

import RouteErrorBoundary from './RouteErrorBoundary';

// ── Helpers ──────────────────────────────────────────────────────

/** A child that throws on render */
function Bomb({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) throw new Error('BOOM!');
  return <div>Safe content</div>;
}

// Suppress console.error noise from React error boundaries
const originalError = console.error;
beforeEach(() => {
  vi.clearAllMocks();
  console.error = vi.fn();
});
afterEach(() => {
  console.error = originalError;
});

// ── Tests ────────────────────────────────────────────────────────

describe('RouteErrorBoundary', () => {
  describe('normal rendering', () => {
    it('renders children when no error', () => {
      render(
        <RouteErrorBoundary>
          <div>Hello World</div>
        </RouteErrorBoundary>,
      );
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <RouteErrorBoundary>
          <div>Child 1</div>
          <div>Child 2</div>
        </RouteErrorBoundary>,
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('catches error and shows fallback UI', () => {
      render(
        <RouteErrorBoundary>
          <Bomb />
        </RouteErrorBoundary>,
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('shows default section label when none provided', () => {
      render(
        <RouteErrorBoundary>
          <Bomb />
        </RouteErrorBoundary>,
      );
      expect(screen.getByText('This section encountered an error')).toBeInTheDocument();
    });

    it('shows custom section name in heading', () => {
      render(
        <RouteErrorBoundary section="CRM Dashboard">
          <Bomb />
        </RouteErrorBoundary>,
      );
      expect(screen.getByText('CRM Dashboard encountered an error')).toBeInTheDocument();
    });

    it('shows helpful message about data safety', () => {
      render(
        <RouteErrorBoundary>
          <Bomb />
        </RouteErrorBoundary>,
      );
      expect(screen.getByText(/Your data is safe/)).toBeInTheDocument();
    });

    it('shows warning icon', () => {
      render(
        <RouteErrorBoundary>
          <Bomb />
        </RouteErrorBoundary>,
      );
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('does NOT show children when in error state', () => {
      render(
        <RouteErrorBoundary>
          <Bomb />
        </RouteErrorBoundary>,
      );
      expect(screen.queryByText('Safe content')).not.toBeInTheDocument();
    });
  });

  describe('Try Again button', () => {
    it('renders a Try Again button', () => {
      render(
        <RouteErrorBoundary>
          <Bomb />
        </RouteErrorBoundary>,
      );
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('resets error state when clicked', () => {
      const { rerender } = render(
        <RouteErrorBoundary>
          <Bomb shouldThrow />
        </RouteErrorBoundary>,
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Re-render with non-throwing child so reset works
      rerender(
        <RouteErrorBoundary>
          <Bomb shouldThrow={false} />
        </RouteErrorBoundary>,
      );

      fireEvent.click(screen.getByText('Try Again'));
      expect(screen.getByText('Safe content')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Go Home button', () => {
    it('renders a Go Home button', () => {
      render(
        <RouteErrorBoundary>
          <Bomb />
        </RouteErrorBoundary>,
      );
      expect(screen.getByText('Go Home')).toBeInTheDocument();
    });

    it('calls safeRedirect to / on click', () => {
      render(
        <RouteErrorBoundary>
          <Bomb />
        </RouteErrorBoundary>,
      );
      fireEvent.click(screen.getByText('Go Home'));
      expect(mockSafeRedirect).toHaveBeenCalledWith('/');
    });
  });

  describe('logging', () => {
    it('logs error via createLogger on componentDidCatch', () => {
      render(
        <RouteErrorBoundary section="Properties">
          <Bomb />
        </RouteErrorBoundary>,
      );
      expect(mockLogError).toHaveBeenCalled();
      expect(mockLogError).toHaveBeenCalledWith(
        'Caught error',
        expect.any(Error),
        expect.objectContaining({ componentStack: expect.any(String) }),
      );
    });
  });

  describe('dev-mode error details', () => {
    it('shows error message in development mode', () => {
      // import.meta.env.DEV is true in test/dev environment
      render(
        <RouteErrorBoundary>
          <Bomb />
        </RouteErrorBoundary>,
      );
      expect(screen.getByText('BOOM!')).toBeInTheDocument();
    });
  });
});
