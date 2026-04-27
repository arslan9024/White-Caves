/**
 * ToastContainer — Test Suite
 * ===========================
 * Tests for toast rendering, positions, types, auto-dismiss,
 * close button, action buttons, and accessibility.
 *
 * 14 tests across 5 describe blocks.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import type { Toast, ToastContextType } from '../../context/ToastContext';

// ─── Mock useToast ────────────────────────────────────────────
const mockDismiss = vi.fn();
let mockToasts: Toast[] = [];

vi.mock('../../context/useToast', () => ({
  useToast: (): ToastContextType => ({
    toasts: mockToasts,
    dismiss: mockDismiss,
    show: vi.fn(() => 'mock-id'),
    dismissAll: vi.fn(),
  }),
}));

// Must import AFTER mock
import { ToastContainer } from './ToastContainer';

// ─── Helpers ──────────────────────────────────────────────────
function makeToast(overrides: Partial<Toast> = {}): Toast {
  return {
    id: `toast-${Math.random().toString(36).slice(2)}`,
    message: 'Test notification',
    type: 'info',
    position: 'top-right',
    duration: 3000,
    ...overrides,
  };
}

beforeEach(() => {
  mockToasts = [];
  mockDismiss.mockClear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ──────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────

describe('ToastContainer', () => {
  describe('Rendering', () => {
    it('renders nothing when there are no toasts', () => {
      const { container } = render(<ToastContainer />);
      // No toast wrappers rendered
      expect(container.innerHTML).toBe('');
    });

    it('renders a single toast message', () => {
      mockToasts = [makeToast({ message: 'Hello World' })];
      render(<ToastContainer />);
      expect(screen.getByText('Hello World')).toBeTruthy();
    });

    it('renders multiple toasts', () => {
      mockToasts = [
        makeToast({ id: '1', message: 'First toast' }),
        makeToast({ id: '2', message: 'Second toast' }),
      ];
      render(<ToastContainer />);
      expect(screen.getByText('First toast')).toBeTruthy();
      expect(screen.getByText('Second toast')).toBeTruthy();
    });
  });

  describe('Toast types', () => {
    it.each(['info', 'success', 'warning', 'error'] as const)(
      'renders %s toast with role="alert"',
      (type) => {
        mockToasts = [makeToast({ type, message: `A ${type} message` })];
        render(<ToastContainer />);
        const alert = screen.getByRole('alert');
        expect(alert).toBeTruthy();
        expect(screen.getByText(`A ${type} message`)).toBeTruthy();
      },
    );
  });

  describe('Positions', () => {
    it('groups toasts by their position', () => {
      mockToasts = [
        makeToast({ id: '1', message: 'Top right', position: 'top-right' }),
        makeToast({ id: '2', message: 'Bottom left', position: 'bottom-left' }),
      ];
      render(<ToastContainer />);
      expect(screen.getByText('Top right')).toBeTruthy();
      expect(screen.getByText('Bottom left')).toBeTruthy();
    });
  });

  describe('Close & dismiss', () => {
    it('calls dismiss when close button is clicked', () => {
      const toast = makeToast({ id: 'close-test' });
      mockToasts = [toast];
      render(<ToastContainer />);

      const closeBtn = screen.getByLabelText('Close notification');
      // Allow exit animation timer to flush
      fireEvent.click(closeBtn);
      act(() => { vi.advanceTimersByTime(500); });

      expect(mockDismiss).toHaveBeenCalledWith('close-test');
    });

    it('calls toast.onClose callback when dismissed', () => {
      const onClose = vi.fn();
      const toast = makeToast({ id: 'cb-test', onClose });
      mockToasts = [toast];
      render(<ToastContainer />);

      fireEvent.click(screen.getByLabelText('Close notification'));
      act(() => { vi.advanceTimersByTime(500); });

      expect(onClose).toHaveBeenCalled();
    });

    it('auto-dismisses after duration elapses', () => {
      const toast = makeToast({ id: 'auto-dismiss', duration: 2000 });
      mockToasts = [toast];
      render(<ToastContainer />);

      // Advance past duration
      act(() => { vi.advanceTimersByTime(2000); });
      // Then past exit animation
      act(() => { vi.advanceTimersByTime(500); });

      expect(mockDismiss).toHaveBeenCalledWith('auto-dismiss');
    });
  });

  describe('Action button', () => {
    it('renders action button and fires callback on click', () => {
      const actionClick = vi.fn();
      const toast = makeToast({
        action: { label: 'Undo', onClick: actionClick },
      });
      mockToasts = [toast];
      render(<ToastContainer />);

      const btn = screen.getByText('Undo');
      expect(btn).toBeTruthy();
      fireEvent.click(btn);
      expect(actionClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('toast items have role="alert" and aria-live="polite"', () => {
      mockToasts = [makeToast()];
      render(<ToastContainer />);

      const alert = screen.getByRole('alert');
      expect(alert.getAttribute('aria-live')).toBe('polite');
    });

    it('close button has accessible label', () => {
      mockToasts = [makeToast()];
      render(<ToastContainer />);

      const btn = screen.getByLabelText('Close notification');
      expect(btn.tagName.toLowerCase()).toBe('button');
    });
  });
});
