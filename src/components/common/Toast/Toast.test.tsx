/**
 * Toast Component Tests
 * Tests: rendering, notification types, auto-dismiss, close button,
 *        Redux integration, empty state, aria roles
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Toast from './Toast';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Check: (props: any) => <svg data-testid="icon-check" {...props} />,
  AlertCircle: (props: any) => <svg data-testid="icon-alert-circle" {...props} />,
  AlertTriangle: (props: any) => <svg data-testid="icon-alert-triangle" {...props} />,
  Info: (props: any) => <svg data-testid="icon-info" {...props} />,
  X: (props: any) => <svg data-testid="icon-x" {...props} />,
}));

// Mock styled components
vi.mock('./styles', () => ({
  ToastContainer: ({ children, ...props }: any) => <div data-testid="toast-container" {...props}>{children}</div>,
  ToastWrapper: ({ children, ...props }: any) => <div data-testid="toast-wrapper" role={props.role} aria-live={props['aria-live']}>{children}</div>,
  ToastIcon: ({ children }: any) => <div data-testid="toast-icon">{children}</div>,
  ToastContent: ({ children }: any) => <div data-testid="toast-content">{children}</div>,
  ToastTitle: ({ children }: any) => <div data-testid="toast-title">{children}</div>,
  ToastMessage: ({ children }: any) => <div data-testid="toast-message">{children}</div>,
  ToastClose: ({ children, onClick, ...props }: any) => <button data-testid="toast-close" onClick={onClick} aria-label={props['aria-label']}>{children}</button>,
}));

const createStore = (notifications: any[] = []) =>
  configureStore({
    reducer: {
      notifications: (state = { notifications }, action) => {
        if (action.type === 'notifications/removeNotification') {
          return {
            ...state,
            notifications: state.notifications.filter((n: any) => n.id !== action.payload),
          };
        }
        return state;
      },
    },
  });

const renderToast = (notifications: any[] = []) => {
  const store = createStore(notifications);
  return { ...render(<Provider store={store}><Toast /></Provider>), store };
};

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  // ─── Empty State ──────────────────────────────────────
  describe('empty state', () => {
    it('returns null when no notifications', () => {
      const { container } = renderToast([]);
      expect(container.querySelector('[data-testid="toast-container"]')).not.toBeInTheDocument();
    });
  });

  // ─── Success Notification ────────────────────────────
  describe('success notification', () => {
    it('renders success notification', () => {
      renderToast([{ id: 1, type: 'success', title: 'Done!', message: 'Saved successfully' }]);
      expect(screen.getByText('Done!')).toBeInTheDocument();
      expect(screen.getByText('Saved successfully')).toBeInTheDocument();
    });

    it('shows check icon for success', () => {
      renderToast([{ id: 1, type: 'success', message: 'OK' }]);
      expect(screen.getByTestId('icon-check')).toBeInTheDocument();
    });
  });

  // ─── Error Notification ──────────────────────────────
  describe('error notification', () => {
    it('renders error notification', () => {
      renderToast([{ id: 1, type: 'error', title: 'Error', message: 'Something failed' }]);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Something failed')).toBeInTheDocument();
    });

    it('shows alert-circle icon for error', () => {
      renderToast([{ id: 1, type: 'error', message: 'fail' }]);
      expect(screen.getByTestId('icon-alert-circle')).toBeInTheDocument();
    });
  });

  // ─── Warning Notification ────────────────────────────
  describe('warning notification', () => {
    it('renders warning notification', () => {
      renderToast([{ id: 1, type: 'warning', message: 'Caution!' }]);
      expect(screen.getByText('Caution!')).toBeInTheDocument();
    });

    it('shows alert-triangle icon for warning', () => {
      renderToast([{ id: 1, type: 'warning', message: 'warn' }]);
      expect(screen.getByTestId('icon-alert-triangle')).toBeInTheDocument();
    });
  });

  // ─── Info Notification ───────────────────────────────
  describe('info notification', () => {
    it('renders info notification', () => {
      renderToast([{ id: 1, type: 'info', message: 'FYI' }]);
      expect(screen.getByText('FYI')).toBeInTheDocument();
    });

    it('shows info icon', () => {
      renderToast([{ id: 1, type: 'info', message: 'info' }]);
      expect(screen.getByTestId('icon-info')).toBeInTheDocument();
    });
  });

  // ─── Multiple Notifications ──────────────────────────
  describe('multiple notifications', () => {
    it('renders multiple notifications', () => {
      renderToast([
        { id: 1, type: 'success', message: 'First' },
        { id: 2, type: 'error', message: 'Second' },
        { id: 3, type: 'info', message: 'Third' },
      ]);
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });

    it('renders correct number of toast wrappers', () => {
      renderToast([
        { id: 1, type: 'success', message: 'A' },
        { id: 2, type: 'error', message: 'B' },
      ]);
      expect(screen.getAllByTestId('toast-wrapper')).toHaveLength(2);
    });
  });

  // ─── Close Button ────────────────────────────────────
  describe('close button', () => {
    it('renders close button for each notification', () => {
      renderToast([{ id: 1, type: 'success', message: 'Test' }]);
      expect(screen.getByTestId('toast-close')).toBeInTheDocument();
    });

    it('has close aria-label', () => {
      renderToast([{ id: 1, type: 'success', message: 'Test' }]);
      expect(screen.getByLabelText('Close notification')).toBeInTheDocument();
    });

    it('dispatches removeNotification on close click', () => {
      const { store } = renderToast([
        { id: 42, type: 'success', message: 'Closable' },
      ]);
      fireEvent.click(screen.getByTestId('toast-close'));
      const state = store.getState();
      expect(state.notifications.notifications).toHaveLength(0);
    });
  });

  // ─── Auto-Dismiss ────────────────────────────────────
  describe('auto-dismiss', () => {
    it('auto-removes notification after default 3000ms', () => {
      const { store } = renderToast([
        { id: 1, type: 'info', message: 'Auto' },
      ]);
      act(() => { vi.advanceTimersByTime(3000); });
      const state = store.getState();
      expect(state.notifications.notifications).toHaveLength(0);
    });

    it('uses custom duration when provided', () => {
      const { store } = renderToast([
        { id: 1, type: 'info', message: 'Custom', duration: 5000 },
      ]);
      act(() => { vi.advanceTimersByTime(3000); });
      let state = store.getState();
      expect(state.notifications.notifications).toHaveLength(1); // still there
      act(() => { vi.advanceTimersByTime(2000); });
      state = store.getState();
      expect(state.notifications.notifications).toHaveLength(0);
    });
  });

  // ─── Accessibility ───────────────────────────────────
  describe('accessibility', () => {
    it('has role=alert on toast wrapper', () => {
      renderToast([{ id: 1, type: 'success', message: 'Test' }]);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('has aria-live=polite', () => {
      renderToast([{ id: 1, type: 'success', message: 'Test' }]);
      const wrapper = screen.getByTestId('toast-wrapper');
      expect(wrapper).toHaveAttribute('aria-live', 'polite');
    });
  });

  // ─── Title Optional ─────────────────────────────────
  describe('optional title', () => {
    it('renders without title', () => {
      renderToast([{ id: 1, type: 'success', message: 'No title' }]);
      expect(screen.queryByTestId('toast-title')).not.toBeInTheDocument();
      expect(screen.getByText('No title')).toBeInTheDocument();
    });

    it('renders with title', () => {
      renderToast([{ id: 1, type: 'success', title: 'My Title', message: 'Body' }]);
      expect(screen.getByText('My Title')).toBeInTheDocument();
    });
  });
});
