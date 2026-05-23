/**
 * LiveAnnouncer — Unit Tests
 *
 * Tests the LiveAnnouncer component, AnnounceProvider, and useAnnounce hook.
 * Verifies ARIA live-region behavior for screen reader announcements.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { LiveAnnouncer, AnnounceProvider, useAnnounce } from './LiveAnnouncer';

/* ──────────────────────────── LiveAnnouncer Component ──────────── */

describe('LiveAnnouncer', () => {
  it('renders an aria-live region with polite politeness by default', () => {
    render(<LiveAnnouncer message="Hello" />);
    const el = screen.getByTestId('live-announcer');
    expect(el).toHaveAttribute('aria-live', 'polite');
    expect(el).toHaveTextContent('Hello');
  });

  it('supports assertive politeness', () => {
    render(<LiveAnnouncer message="Error!" politeness="assertive" />);
    const el = screen.getByTestId('live-announcer');
    expect(el).toHaveAttribute('aria-live', 'assertive');
  });

  it('supports custom role attribute', () => {
    render(<LiveAnnouncer message="Alert" role="alert" />);
    const el = screen.getByTestId('live-announcer');
    expect(el).toHaveAttribute('role', 'alert');
  });

  it('renders with default role="status"', () => {
    render(<LiveAnnouncer message="Status update" />);
    const el = screen.getByTestId('live-announcer');
    expect(el).toHaveAttribute('role', 'status');
  });

  it('is visually hidden but accessible to screen readers', () => {
    render(<LiveAnnouncer message="Hidden text" />);
    const el = screen.getByTestId('live-announcer');
    const style = el.style;
    expect(style.position).toBe('absolute');
    expect(style.width).toBe('1px');
    expect(style.height).toBe('1px');
  });

  it('renders empty when no message is provided', () => {
    render(<LiveAnnouncer message="" />);
    const el = screen.getByTestId('live-announcer');
    expect(el).toHaveTextContent('');
  });
});

/* ──────────────────────────── AnnounceProvider + useAnnounce ───── */

// Helper component that uses the useAnnounce hook
function TestConsumer() {
  const announce = useAnnounce();
  return (
    <div>
      <button onClick={() => announce('Polite message')}>Polite</button>
      <button onClick={() => announce('Assertive message', 'assertive')}>Assertive</button>
    </div>
  );
}

describe('AnnounceProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders both polite and assertive live regions', () => {
    render(
      <AnnounceProvider>
        <div>Child</div>
      </AnnounceProvider>
    );
    expect(screen.getByTestId('announce-polite')).toBeInTheDocument();
    expect(screen.getByTestId('announce-assertive')).toBeInTheDocument();
  });

  it('announces a polite message via useAnnounce', () => {
    render(
      <AnnounceProvider>
        <TestConsumer />
      </AnnounceProvider>
    );

    act(() => {
      screen.getByText('Polite').click();
    });

    const politeRegion = screen.getByTestId('announce-polite');
    expect(politeRegion).toHaveTextContent('Polite message');
  });

  it('announces an assertive message via useAnnounce', () => {
    render(
      <AnnounceProvider>
        <TestConsumer />
      </AnnounceProvider>
    );

    act(() => {
      screen.getByText('Assertive').click();
    });

    const assertiveRegion = screen.getByTestId('announce-assertive');
    expect(assertiveRegion).toHaveTextContent('Assertive message');
  });

  it('auto-clears messages after timeout', () => {
    render(
      <AnnounceProvider>
        <TestConsumer />
      </AnnounceProvider>
    );

    act(() => {
      screen.getByText('Polite').click();
    });

    expect(screen.getByTestId('announce-polite')).toHaveTextContent('Polite message');

    // Advance past the 5-second auto-clear
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(screen.getByTestId('announce-polite')).toHaveTextContent('');
  });

  it('renders children correctly', () => {
    render(
      <AnnounceProvider>
        <span data-testid="child">Hello World</span>
      </AnnounceProvider>
    );
    expect(screen.getByTestId('child')).toHaveTextContent('Hello World');
  });
});

/* ──────────────────────────── useAnnounce error boundary ───────── */

describe('useAnnounce', () => {
  it('throws when used outside AnnounceProvider', () => {
    // Suppress React error logging for expected throw
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    function Broken() {
      useAnnounce();
      return null;
    }

    // React 18 wraps component-level throws — check via error boundary pattern
    let caughtError: Error | null = null;

    class ErrorBoundary extends React.Component<
      { children: React.ReactNode },
      { hasError: boolean }
    > {
      state = { hasError: false };
      static getDerivedStateFromError() {
        return { hasError: true };
      }
      componentDidCatch(error: Error) {
        caughtError = error;
      }
      render() {
        return this.state.hasError ? null : this.props.children;
      }
    }

    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>
    );

    expect(caughtError).not.toBeNull();
    expect(caughtError!.message).toMatch(/useAnnounce must be used within an AnnounceProvider/);

    consoleSpy.mockRestore();
  });
});
