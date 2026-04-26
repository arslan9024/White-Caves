/**
 * Toast.test.tsx — Smoke tests for Toast notification system
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { ToastProvider, useToast } from './Toast';

// Helper component to trigger toasts
function ToastTrigger() {
  const toast = useToast();
  return (
    <div>
      <button onClick={() => toast.success('Success!')}>Show Success</button>
      <button onClick={() => toast.error('Error!')}>Show Error</button>
      <button onClick={() => toast.warning('Warning!')}>Show Warning</button>
      <button onClick={() => toast.info('Info!')}>Show Info</button>
    </div>
  );
}

describe('Toast system', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders children without toasts by default', () => {
    render(
      <ToastProvider>
        <div>App Content</div>
      </ToastProvider>,
    );
    expect(screen.getByText('App Content')).toBeTruthy();
  });

  it('shows toast when triggered via context', () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Show Success'));
    expect(screen.getByText('Success!')).toBeTruthy();
  });

  it('shows error toast', () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Show Error'));
    expect(screen.getByText('Error!')).toBeTruthy();
  });

  it('shows warning toast', () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Show Warning'));
    expect(screen.getByText('Warning!')).toBeTruthy();
  });

  it('shows info toast', () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Show Info'));
    expect(screen.getByText('Info!')).toBeTruthy();
  });

  it('can show multiple toasts', () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Show Success'));
    fireEvent.click(screen.getByText('Show Error'));

    expect(screen.getByText('Success!')).toBeTruthy();
    expect(screen.getByText('Error!')).toBeTruthy();
  });

  it('auto-removes toast after duration', () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Show Info'));
    expect(screen.getByText('Info!')).toBeTruthy();

    // Default duration is 5000ms
    act(() => { vi.advanceTimersByTime(6000); });
    expect(screen.queryByText('Info!')).toBeNull();
  });

  it('useToast throws if used outside provider', () => {
    function BadComponent() {
      try {
        useToast();
        return <div>No error</div>;
      } catch (e: any) {
        return <div>{e.message}</div>;
      }
    }

    render(<BadComponent />);
    expect(screen.getByText(/useToast must be used within ToastProvider/)).toBeTruthy();
  });

  it('toast container has correct ARIA attributes', () => {
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Show Success'));
    const container = screen.getByRole('status');
    expect(container).toBeTruthy();
    expect(container.getAttribute('aria-live')).toBe('polite');
  });
});
