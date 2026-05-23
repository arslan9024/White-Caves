/**
 * StatusNotification — Comprehensive Unit Tests
 *
 * Covers: StatusProvider context, useStatus hook, notification types
 * (success/error/warning/info), auto-dismiss, manual dismiss,
 * clear all, custom title, custom duration, fallback error
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

// ── Mock styled-components ──────────────────────────────────────

vi.mock('./StatusNotification.styles', () => {
  const c = (tag: string, testId: string) => {
    const Comp = React.forwardRef(({ children, ...props }: Record<string, unknown>, ref) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) clean[k] = v;
      }
      return React.createElement(tag, { 'data-testid': testId, ref, ...clean }, children as React.ReactNode);
    });
    Comp.displayName = testId;
    return Comp;
  };
  return {
    StatusNotificationContainer: c('div', 'notification-container'),
    StatusNotificationItem: c('div', 'notification-item'),
    StatusIcon: c('div', 'status-icon'),
    StatusContent: c('div', 'status-content'),
    StatusTitle: c('span', 'status-title'),
    StatusMessage: c('span', 'status-message'),
    StatusDismiss: c('button', 'status-dismiss'),
    StatusProgress: c('div', 'status-progress'),
  };
});

import { StatusProvider, useStatus } from './StatusNotification';

// ── Test consumer component ─────────────────────────────────────

function TestConsumer() {
  const { success, error, warning, info, clear, notifications } = useStatus();
  return (
    <div>
      <span data-testid="count">{notifications.length}</span>
      <button onClick={() => success('Operation successful')}>Success</button>
      <button onClick={() => error('Something failed')}>Error</button>
      <button onClick={() => warning('Be careful')}>Warning</button>
      <button onClick={() => info('FYI', { title: 'Info Title' })}>Info</button>
      <button onClick={() => success('Long one', { duration: 10000 })}>Long</button>
      <button onClick={() => success('No auto', { autoClose: false })}>NoAuto</button>
      <button onClick={clear}>Clear</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <StatusProvider>
      <TestConsumer />
    </StatusProvider>
  );
}

describe('StatusNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ────── Provider Rendering ──────

  describe('StatusProvider', () => {
    it('renders children', () => {
      renderWithProvider();
      expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('starts with zero notifications', () => {
      renderWithProvider();
      expect(screen.getByTestId('count').textContent).toBe('0');
    });

    it('renders notification container', () => {
      renderWithProvider();
      expect(screen.getByTestId('notification-container')).toBeInTheDocument();
    });
  });

  // ────── Adding Notifications ──────

  describe('adding notifications', () => {
    it('adds a success notification', () => {
      renderWithProvider();
      act(() => { fireEvent.click(screen.getByText('Success')); });
      expect(screen.getByText('Operation successful')).toBeInTheDocument();
    });

    it('adds an error notification', () => {
      renderWithProvider();
      act(() => { fireEvent.click(screen.getByText('Error')); });
      expect(screen.getByText('Something failed')).toBeInTheDocument();
    });

    it('adds a warning notification', () => {
      renderWithProvider();
      act(() => { fireEvent.click(screen.getByText('Warning')); });
      expect(screen.getByText('Be careful')).toBeInTheDocument();
    });

    it('adds an info notification with title', () => {
      renderWithProvider();
      act(() => { fireEvent.click(screen.getByText('Info')); });
      expect(screen.getByText('FYI')).toBeInTheDocument();
      expect(screen.getByText('Info Title')).toBeInTheDocument();
    });

    it('increments notification count', () => {
      renderWithProvider();
      act(() => { fireEvent.click(screen.getByText('Success')); });
      act(() => { fireEvent.click(screen.getByText('Error')); });
      expect(screen.getByTestId('count').textContent).toBe('2');
    });
  });

  // ────── Auto-Dismiss ──────

  describe('auto-dismiss', () => {
    it('auto-dismisses after default 5s', () => {
      renderWithProvider();
      act(() => { fireEvent.click(screen.getByText('Success')); });
      expect(screen.getByText('Operation successful')).toBeInTheDocument();

      act(() => { vi.advanceTimersByTime(5100); });
      expect(screen.queryByText('Operation successful')).not.toBeInTheDocument();
    });

    it('respects custom duration', () => {
      renderWithProvider();
      act(() => { fireEvent.click(screen.getByText('Long')); });
      expect(screen.getByText('Long one')).toBeInTheDocument();

      act(() => { vi.advanceTimersByTime(5100); });
      // Still present after 5s (duration is 10s)
      expect(screen.getByText('Long one')).toBeInTheDocument();

      act(() => { vi.advanceTimersByTime(5100); });
      // Gone after 10s
      expect(screen.queryByText('Long one')).not.toBeInTheDocument();
    });

    it('does not auto-dismiss when autoClose is false', () => {
      renderWithProvider();
      act(() => { fireEvent.click(screen.getByText('NoAuto')); });
      expect(screen.getByText('No auto')).toBeInTheDocument();

      act(() => { vi.advanceTimersByTime(15000); });
      expect(screen.getByText('No auto')).toBeInTheDocument();
    });
  });

  // ────── Manual Dismiss ──────

  describe('manual dismiss', () => {
    it('dismisses on X button click', () => {
      renderWithProvider();
      act(() => { fireEvent.click(screen.getByText('Success')); });
      expect(screen.getByText('Operation successful')).toBeInTheDocument();

      const dismissBtn = screen.getByLabelText('Dismiss');
      act(() => { fireEvent.click(dismissBtn); });
      expect(screen.queryByText('Operation successful')).not.toBeInTheDocument();
    });
  });

  // ────── Clear All ──────

  describe('clear all', () => {
    it('clears all notifications', () => {
      renderWithProvider();
      act(() => { fireEvent.click(screen.getByText('Success')); });
      act(() => { fireEvent.click(screen.getByText('Error')); });
      act(() => { fireEvent.click(screen.getByText('Warning')); });
      expect(screen.getByTestId('count').textContent).toBe('3');

      act(() => { fireEvent.click(screen.getByText('Clear')); });
      expect(screen.getByTestId('count').textContent).toBe('0');
    });
  });

  // ────── useStatus Hook Error ──────

  describe('useStatus outside provider', () => {
    it('throws when used outside StatusProvider', () => {
      // Suppress console.error for expected error boundary throw
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<TestConsumer />);
      }).toThrow('useStatus must be used within a StatusProvider');
      spy.mockRestore();
    });
  });
});
