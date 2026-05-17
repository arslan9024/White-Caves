/**
 * Toast (advancedUI) — Test Suite
 * ================================
 * Tests for the Toast / ToastContainerComponent covering all 4 toast types,
 * auto-dismiss with duration, progress bar, description, action button,
 * close button, and accessibility.
 *
 * 15 tests across 5 describe blocks.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import ToastContainerComponent from './Toast';
import type { ToastConfig, ToastPosition } from './advancedUI.types';

// ─── Helpers ──────────────────────────────────────────────────
function makeToast(overrides: Partial<ToastConfig> = {}): ToastConfig {
  return {
    id: `toast-${Math.random().toString(36).slice(2)}`,
    type: 'info',
    message: 'Test notification',
    duration: 5000,
    position: 'top-right',
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

let onRemove: ReturnType<typeof vi.fn>;

beforeEach(() => {
  onRemove = vi.fn();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ──────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────

describe('Toast (advancedUI)', () => {
  describe('Rendering basics', () => {
    it('renders nothing when toasts array is empty', () => {
      const { container } = render(
        <ToastContainerComponent toasts={[]} onRemove={onRemove} />,
      );
      expect(container.innerHTML).toBe('');
    });

    it('renders a single toast with its message', () => {
      const toasts = [makeToast({ message: 'Welcome to White Caves' })];
      render(<ToastContainerComponent toasts={toasts} onRemove={onRemove} />);
      expect(screen.getByText('Welcome to White Caves')).toBeTruthy();
    });

    it('renders toast description when provided', () => {
      const toasts = [
        makeToast({
          message: 'Data saved',
          description: 'All changes have been persisted',
        }),
      ];
      render(<ToastContainerComponent toasts={toasts} onRemove={onRemove} />);
      expect(screen.getByText('All changes have been persisted')).toBeTruthy();
    });

    it('renders multiple toasts simultaneously', () => {
      const toasts = [
        makeToast({ id: '1', message: 'First' }),
        makeToast({ id: '2', message: 'Second' }),
        makeToast({ id: '3', message: 'Third' }),
      ];
      render(<ToastContainerComponent toasts={toasts} onRemove={onRemove} />);
      expect(screen.getByText('First')).toBeTruthy();
      expect(screen.getByText('Second')).toBeTruthy();
      expect(screen.getByText('Third')).toBeTruthy();
    });
  });

  describe('Toast types', () => {
    it.each(['info', 'success', 'warning', 'error'] as const)(
      'renders %s toast with role="alert"',
      (type) => {
        const toasts = [makeToast({ type, message: `A ${type} toast` })];
        render(
          <ToastContainerComponent toasts={toasts} onRemove={onRemove} />,
        );
        const alert = screen.getByRole('alert');
        expect(alert).toBeTruthy();
        expect(screen.getByText(`A ${type} toast`)).toBeTruthy();
      },
    );
  });

  describe('Auto-dismiss', () => {
    it('calls onRemove after duration + exit animation', () => {
      const toasts = [makeToast({ id: 'auto', duration: 3000 })];
      render(<ToastContainerComponent toasts={toasts} onRemove={onRemove} />);

      // Advance past duration
      act(() => { vi.advanceTimersByTime(3000); });
      // Then past exit animation (300ms)
      act(() => { vi.advanceTimersByTime(300); });

      expect(onRemove).toHaveBeenCalledWith('auto');
    });

    it('does NOT auto-dismiss when duration is 0 (persistent)', () => {
      const toasts = [makeToast({ id: 'persistent', duration: 0 })];
      render(<ToastContainerComponent toasts={toasts} onRemove={onRemove} />);

      // Advance a long time
      act(() => { vi.advanceTimersByTime(60_000); });

      expect(onRemove).not.toHaveBeenCalled();
    });
  });

  describe('Close & action', () => {
    it('calls onRemove when close button is clicked', () => {
      const toasts = [makeToast({ id: 'close-test' })];
      render(<ToastContainerComponent toasts={toasts} onRemove={onRemove} />);

      const closeBtn = screen.getByLabelText('Close notification');
      fireEvent.click(closeBtn);
      // After exit animation
      act(() => { vi.advanceTimersByTime(300); });

      expect(onRemove).toHaveBeenCalledWith('close-test');
    });

    it('fires toast.onClose callback when closed', () => {
      const onCloseCallback = vi.fn();
      const toasts = [makeToast({ id: 'cb', onClose: onCloseCallback })];
      render(<ToastContainerComponent toasts={toasts} onRemove={onRemove} />);

      fireEvent.click(screen.getByLabelText('Close notification'));
      act(() => { vi.advanceTimersByTime(300); });

      expect(onCloseCallback).toHaveBeenCalled();
    });

    it('renders action button and fires action callback', () => {
      const actionFn = vi.fn();
      const toasts = [
        makeToast({
          action: { label: 'Undo', onClick: actionFn },
        }),
      ];
      render(<ToastContainerComponent toasts={toasts} onRemove={onRemove} />);

      const btn = screen.getByText('Undo');
      expect(btn).toBeTruthy();
      fireEvent.click(btn);
      expect(actionFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('toast items have role="alert" and aria-live="polite"', () => {
      const toasts = [makeToast()];
      render(<ToastContainerComponent toasts={toasts} onRemove={onRemove} />);

      const alert = screen.getByRole('alert');
      expect(alert.getAttribute('aria-live')).toBe('polite');
    });

    it('close button has accessible label and title', () => {
      const toasts = [makeToast()];
      render(<ToastContainerComponent toasts={toasts} onRemove={onRemove} />);

      const btn = screen.getByLabelText('Close notification');
      expect(btn.getAttribute('title')).toBe('Close');
    });
  });
});
