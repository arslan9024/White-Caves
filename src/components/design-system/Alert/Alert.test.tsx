import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { Alert } from './Alert';

describe('Alert', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // === RENDERING ===
  describe('rendering', () => {
    it('renders with title', () => {
      render(<Alert title="Success" />);
      expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('renders with message', () => {
      render(<Alert message="Operation completed." />);
      expect(screen.getByText('Operation completed.')).toBeInTheDocument();
    });

    it('renders with both title and message', () => {
      render(<Alert title="Error" message="Something went wrong." />);
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    });

    it('renders children as message content', () => {
      render(<Alert>Custom child content</Alert>);
      expect(screen.getByText('Custom child content')).toBeInTheDocument();
    });

    it('has role="alert"', () => {
      render(<Alert title="Alert" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<Alert title="Test" className="my-alert" />);
      expect(screen.getByRole('alert')).toHaveClass('my-alert');
    });

    it('supports ref forwarding', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Alert ref={ref} title="Ref" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // === VARIANTS ===
  describe('variants', () => {
    const variants = ['success', 'warning', 'error', 'info'] as const;
    variants.forEach((variant) => {
      it(`renders ${variant} variant`, () => {
        render(<Alert variant={variant} title={variant} />);
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });

    it('defaults to info variant', () => {
      render(<Alert title="Default" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  // === ICON ===
  describe('icon', () => {
    it('renders custom icon', () => {
      render(<Alert icon={<span data-testid="alert-icon">⚠️</span>} title="Warning" />);
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });

    it('renders without icon by default', () => {
      const { container } = render(<Alert title="No Icon" />);
      expect(container.querySelector('.alert-icon')).not.toBeInTheDocument();
    });
  });

  // === ACTION ===
  describe('action', () => {
    it('renders action element', () => {
      render(<Alert title="Action" action={<button>Retry</button>} />);
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });
  });

  // === DISMISSIBLE ===
  describe('dismissible', () => {
    it('does not show close button by default', () => {
      render(<Alert title="Not dismissible" />);
      expect(screen.queryByLabelText('Dismiss alert')).not.toBeInTheDocument();
    });

    it('shows close button when isDismissible', () => {
      render(<Alert title="Dismissible" isDismissible />);
      expect(screen.getByLabelText('Dismiss alert')).toBeInTheDocument();
    });

    it('hides alert on dismiss click', () => {
      render(<Alert title="Dismiss Me" isDismissible />);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      fireEvent.click(screen.getByLabelText('Dismiss alert'));
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('calls onDismiss callback', () => {
      const onDismiss = vi.fn();
      render(<Alert title="Callback" isDismissible onDismiss={onDismiss} />);
      fireEvent.click(screen.getByLabelText('Dismiss alert'));
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  // === DISPLAY NAME ===
  it('has correct displayName', () => {
    expect(Alert.displayName).toBe('Alert');
  });
});
