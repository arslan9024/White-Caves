/**
 * ToastContext — Unit Tests
 * Tests: provider rendering, show/dismiss/dismissAll, auto-dismiss,
 * toast queue, timer cleanup, action buttons, positions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React, { useContext } from 'react';
import { ToastProvider, ToastContext, ToastContextType } from './ToastContext';

// ── Test Helper ──────────────────────────────────────────────────

let capturedCtx: ToastContextType | undefined;

const TestConsumer: React.FC = () => {
  const ctx = useContext(ToastContext);
  capturedCtx = ctx;
  return (
    <div>
      <span data-testid="toast-count">{ctx?.toasts.length ?? 0}</span>
      {ctx?.toasts.map(t => (
        <div key={t.id} data-testid={`toast-${t.id}`} data-type={t.type} data-position={t.position}>
          <span>{t.message}</span>
          {t.action && (
            <button data-testid={`action-${t.id}`} onClick={t.action.onClick}>{t.action.label}</button>
          )}
        </div>
      ))}
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <ToastProvider>
      <TestConsumer />
    </ToastProvider>,
  );
};

// ── Tests ────────────────────────────────────────────────────────

describe('ToastContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    capturedCtx = undefined;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Provider ─────────────────────────────────────────────────

  describe('Provider', () => {
    it('should render children', () => {
      renderWithProvider();
      expect(screen.getByTestId('toast-count')).toBeInTheDocument();
    });

    it('should provide context with toasts array', () => {
      renderWithProvider();
      expect(capturedCtx).toBeDefined();
      expect(capturedCtx!.toasts).toEqual([]);
    });

    it('should provide show, dismiss, dismissAll functions', () => {
      renderWithProvider();
      expect(typeof capturedCtx!.show).toBe('function');
      expect(typeof capturedCtx!.dismiss).toBe('function');
      expect(typeof capturedCtx!.dismissAll).toBe('function');
    });
  });

  // ── Show Toast ───────────────────────────────────────────────

  describe('Show Toast', () => {
    it('should add a toast to the queue', () => {
      renderWithProvider();
      act(() => {
        capturedCtx!.show({ message: 'Hello', type: 'info', position: 'top-right' });
      });
      expect(screen.getByTestId('toast-count').textContent).toBe('1');
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('should return a toast ID', () => {
      renderWithProvider();
      let id: string = '';
      act(() => {
        id = capturedCtx!.show({ message: 'Test', type: 'success', position: 'top-right' });
      });
      expect(id).toMatch(/^toast-/);
    });

    it('should add multiple toasts', () => {
      renderWithProvider();
      act(() => {
        capturedCtx!.show({ message: 'First', type: 'info', position: 'top-right' });
        capturedCtx!.show({ message: 'Second', type: 'warning', position: 'top-right' });
        capturedCtx!.show({ message: 'Third', type: 'error', position: 'top-right' });
      });
      expect(screen.getByTestId('toast-count').textContent).toBe('3');
    });

    it('should set correct type on toast', () => {
      renderWithProvider();
      let id: string = '';
      act(() => {
        id = capturedCtx!.show({ message: 'Error!', type: 'error', position: 'top-center' });
      });
      expect(screen.getByTestId(`toast-${id}`).getAttribute('data-type')).toBe('error');
    });

    it('should set correct position on toast', () => {
      renderWithProvider();
      let id: string = '';
      act(() => {
        id = capturedCtx!.show({ message: 'Bottom', type: 'info', position: 'bottom-left' });
      });
      expect(screen.getByTestId(`toast-${id}`).getAttribute('data-position')).toBe('bottom-left');
    });
  });

  // ── Dismiss ──────────────────────────────────────────────────

  describe('Dismiss', () => {
    it('should dismiss a specific toast by ID', () => {
      renderWithProvider();
      let id: string = '';
      act(() => {
        id = capturedCtx!.show({ message: 'Will dismiss', type: 'info', position: 'top-right' });
      });
      expect(screen.getByTestId('toast-count').textContent).toBe('1');

      act(() => {
        capturedCtx!.dismiss(id);
      });
      expect(screen.getByTestId('toast-count').textContent).toBe('0');
    });

    it('should only dismiss the targeted toast', () => {
      renderWithProvider();
      let id1: string = '', id2: string = '';
      act(() => {
        id1 = capturedCtx!.show({ message: 'Keep', type: 'info', position: 'top-right' });
        id2 = capturedCtx!.show({ message: 'Remove', type: 'warning', position: 'top-right' });
      });
      expect(screen.getByTestId('toast-count').textContent).toBe('2');

      act(() => {
        capturedCtx!.dismiss(id2);
      });
      expect(screen.getByTestId('toast-count').textContent).toBe('1');
      expect(screen.getByText('Keep')).toBeInTheDocument();
    });

    it('should handle dismissing non-existent ID gracefully', () => {
      renderWithProvider();
      act(() => {
        capturedCtx!.show({ message: 'Exists', type: 'info', position: 'top-right' });
      });
      act(() => {
        capturedCtx!.dismiss('non-existent-id');
      });
      expect(screen.getByTestId('toast-count').textContent).toBe('1');
    });
  });

  // ── Dismiss All ──────────────────────────────────────────────

  describe('Dismiss All', () => {
    it('should dismiss all toasts', () => {
      renderWithProvider();
      act(() => {
        capturedCtx!.show({ message: 'One', type: 'info', position: 'top-right' });
        capturedCtx!.show({ message: 'Two', type: 'warning', position: 'top-right' });
        capturedCtx!.show({ message: 'Three', type: 'error', position: 'top-right' });
      });
      expect(screen.getByTestId('toast-count').textContent).toBe('3');

      act(() => {
        capturedCtx!.dismissAll();
      });
      expect(screen.getByTestId('toast-count').textContent).toBe('0');
    });
  });

  // ── Auto-Dismiss ─────────────────────────────────────────────

  describe('Auto-Dismiss', () => {
    it('should auto-dismiss toast after specified duration', () => {
      renderWithProvider();
      act(() => {
        capturedCtx!.show({ message: 'Auto', type: 'info', position: 'top-right', duration: 3000 });
      });
      expect(screen.getByTestId('toast-count').textContent).toBe('1');

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(screen.getByTestId('toast-count').textContent).toBe('0');
    });

    it('should NOT auto-dismiss toast without duration', () => {
      renderWithProvider();
      act(() => {
        capturedCtx!.show({ message: 'Persistent', type: 'info', position: 'top-right' });
      });
      act(() => {
        vi.advanceTimersByTime(60000); // 60 seconds
      });
      expect(screen.getByTestId('toast-count').textContent).toBe('1');
    });

    it('should NOT auto-dismiss toast with duration=0', () => {
      renderWithProvider();
      act(() => {
        capturedCtx!.show({ message: 'Zero', type: 'info', position: 'top-right', duration: 0 });
      });
      act(() => {
        vi.advanceTimersByTime(60000);
      });
      expect(screen.getByTestId('toast-count').textContent).toBe('1');
    });

    it('should auto-dismiss each toast at its own duration', () => {
      renderWithProvider();
      act(() => {
        capturedCtx!.show({ message: 'Fast', type: 'info', position: 'top-right', duration: 1000 });
        capturedCtx!.show({ message: 'Slow', type: 'info', position: 'top-right', duration: 5000 });
      });
      expect(screen.getByTestId('toast-count').textContent).toBe('2');

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByTestId('toast-count').textContent).toBe('1');
      expect(screen.getByText('Slow')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(screen.getByTestId('toast-count').textContent).toBe('0');
    });

    it('should clear auto-dismiss timer when manually dismissed', () => {
      renderWithProvider();
      let id: string = '';
      act(() => {
        id = capturedCtx!.show({ message: 'Manual', type: 'info', position: 'top-right', duration: 5000 });
      });
      act(() => {
        capturedCtx!.dismiss(id); // manual dismiss clears timer
      });
      expect(screen.getByTestId('toast-count').textContent).toBe('0');
    });
  });

  // ── Action Buttons ───────────────────────────────────────────

  describe('Action Buttons', () => {
    it('should render action button when provided', () => {
      const actionFn = vi.fn();
      renderWithProvider();
      let id: string = '';
      act(() => {
        id = capturedCtx!.show({
          message: 'With action',
          type: 'info',
          position: 'top-right',
          action: { label: 'Undo', onClick: actionFn },
        });
      });
      expect(screen.getByTestId(`action-${id}`)).toBeInTheDocument();
      expect(screen.getByText('Undo')).toBeInTheDocument();
    });

    it('should call action onClick when clicked', () => {
      const actionFn = vi.fn();
      renderWithProvider();
      let id: string = '';
      act(() => {
        id = capturedCtx!.show({
          message: 'Click me',
          type: 'warning',
          position: 'top-right',
          action: { label: 'Retry', onClick: actionFn },
        });
      });
      screen.getByTestId(`action-${id}`).click();
      expect(actionFn).toHaveBeenCalledTimes(1);
    });
  });

  // ── All Positions ────────────────────────────────────────────

  describe('Positions', () => {
    const positions = [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right',
    ] as const;

    positions.forEach(pos => {
      it(`should accept position "${pos}"`, () => {
        renderWithProvider();
        let id: string = '';
        act(() => {
          id = capturedCtx!.show({ message: `Pos ${pos}`, type: 'info', position: pos });
        });
        expect(screen.getByTestId(`toast-${id}`).getAttribute('data-position')).toBe(pos);
      });
    });
  });

  // ── All Types ────────────────────────────────────────────────

  describe('Types', () => {
    const types = ['info', 'success', 'warning', 'error'] as const;

    types.forEach(type => {
      it(`should accept type "${type}"`, () => {
        renderWithProvider();
        let id: string = '';
        act(() => {
          id = capturedCtx!.show({ message: `Type ${type}`, type, position: 'top-right' });
        });
        expect(screen.getByTestId(`toast-${id}`).getAttribute('data-type')).toBe(type);
      });
    });
  });
});
