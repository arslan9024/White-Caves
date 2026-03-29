/**
 * Checkout — Unit Tests
 * Tests: loading state, API error handling, payment form,
 * submit/cancel, invalid server response, amount validation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';

// ── Mocks ────────────────────────────────────────────────────────

const { mockAuthFetch, mockConfirmPayment } = vi.hoisted(() => ({
  mockAuthFetch: vi.fn(),
  mockConfirmPayment: vi.fn(),
}));

vi.mock('../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

vi.mock('../utils/logger', () => ({
  createLogger: () => ({
    info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
  }),
}));

vi.mock('@stripe/react-stripe-js', () => ({
  useStripe: () => ({ confirmPayment: mockConfirmPayment }),
  useElements: () => ({}),
  Elements: ({ children }: { children: React.ReactNode }) => <div data-testid="stripe-elements">{children}</div>,
  PaymentElement: () => <div data-testid="payment-element">Payment Element</div>,
}));

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({ confirmPayment: mockConfirmPayment })),
}));

vi.mock('./Checkout.styles', () => ({
  CheckoutContainerStyled: ({ children }: React.PropsWithChildren) => <div data-testid="checkout-container">{children}</div>,
  CheckoutFormStyled: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <form data-testid="checkout-form" {...props}>{children}</form>,
  PaymentDetailsSection: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  PropertySummary: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  ErrorMessage: ({ children }: React.PropsWithChildren) => <div data-testid="error-message">{children}</div>,
  CheckoutActions: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  SubmitBtn: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <button {...props}>{children}</button>,
  CancelBtn: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <button {...props}>{children}</button>,
  CheckoutLoadingContainer: ({ children }: React.PropsWithChildren) => <div data-testid="loading-container">{children}</div>,
  SpinnerStyled: () => <div data-testid="spinner" />,
  LoadingText: ({ children }: React.PropsWithChildren) => <p>{children}</p>,
  CheckoutErrorContainer: ({ children }: React.PropsWithChildren) => <div data-testid="error-container">{children}</div>,
  ConfigErrorText: ({ children }: React.PropsWithChildren) => <p>{children}</p>,
}));

// ── Helpers ──────────────────────────────────────────────────────

function makeJsonResponse(data: Record<string, unknown>, status = 200, ok = true) {
  return Promise.resolve({
    ok,
    status,
    headers: { get: (h: string) => h === 'content-type' ? 'application/json' : null },
    json: () => Promise.resolve(data),
  });
}

function makeHtmlResponse(status = 500) {
  return Promise.resolve({
    ok: false,
    status,
    headers: { get: () => 'text/html' },
    json: () => { throw new Error('Not JSON'); },
  });
}

import Checkout from './Checkout';

// ── Tests ────────────────────────────────────────────────────────

describe('Checkout', () => {
  const defaultProps = {
    property: { id: 'prop-1', title: 'Palm Jumeirah Villa' },
    amount: 50000,
    onSuccess: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('shows loading spinner while fetching payment intent', () => {
      mockAuthFetch.mockReturnValue(new Promise(() => {}));
      render(<Checkout {...defaultProps} />);
      expect(screen.getByText('Initializing payment...')).toBeInTheDocument();
    });
  });

  describe('API Error Handling', () => {
    it('shows error when API returns non-ok JSON response', async () => {
      mockAuthFetch.mockReturnValue(makeJsonResponse({ error: 'Insufficient funds' }, 400, false));
      render(<Checkout {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByText('Insufficient funds')).toBeInTheDocument();
      });
    });

    it('shows fallback error for non-ok HTML responses', async () => {
      mockAuthFetch.mockReturnValue(makeHtmlResponse(500));
      render(<Checkout {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByText(/Payment initialization failed \(HTTP 500\)/i)).toBeInTheDocument();
      });
    });

    it('shows error when response has error field in body', async () => {
      mockAuthFetch.mockReturnValue(makeJsonResponse({ error: 'Card declined' }));
      render(<Checkout {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByText('Card declined')).toBeInTheDocument();
      });
    });

    it('shows error for invalid clientSecret', async () => {
      mockAuthFetch.mockReturnValue(makeJsonResponse({ clientSecret: 123 }));
      render(<Checkout {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByText('Invalid payment configuration from server')).toBeInTheDocument();
      });
    });

    it('shows error for missing clientSecret', async () => {
      mockAuthFetch.mockReturnValue(makeJsonResponse({ data: 'no secret' }));
      render(<Checkout {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByText('Invalid payment configuration from server')).toBeInTheDocument();
      });
    });

    it('shows generic error when fetch rejects', async () => {
      mockAuthFetch.mockRejectedValue(new Error('Network error'));
      render(<Checkout {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByText('Failed to initialize payment. Please try again.')).toBeInTheDocument();
      });
    });

    it('displays Close button in error state that calls onCancel', async () => {
      mockAuthFetch.mockRejectedValue(new Error('Network error'));
      render(<Checkout {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Close'));
      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });

  describe('Payment Form (successful initialization)', () => {
    beforeEach(() => {
      mockAuthFetch.mockReturnValue(makeJsonResponse({ clientSecret: 'pi_secret_abc' }));
    });

    it('renders Stripe Elements with payment form once loaded', async () => {
      render(<Checkout {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
      });
      expect(screen.getByText('Payment Details')).toBeInTheDocument();
      expect(screen.getByText(/Palm Jumeirah Villa/)).toBeInTheDocument();
      expect(screen.getAllByText(/AED 50,000/).length).toBeGreaterThanOrEqual(1);
    });

    it('renders Cancel and Pay buttons', async () => {
      render(<Checkout {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
      });
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText(/Pay AED/)).toBeInTheDocument();
    });

    it('Cancel button calls onCancel', async () => {
      render(<Checkout {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Cancel'));
      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });

  describe('Payment submission', () => {
    beforeEach(() => {
      mockAuthFetch.mockReturnValue(makeJsonResponse({ clientSecret: 'pi_secret_abc' }));
    });

    it('calls stripe.confirmPayment on form submit', async () => {
      mockConfirmPayment.mockResolvedValue({ error: null });
      render(<Checkout {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
      });
      await act(async () => {
        fireEvent.submit(screen.getByTestId('checkout-form'));
      });
      expect(mockConfirmPayment).toHaveBeenCalled();
    });

    it('shows processing state during payment', async () => {
      mockConfirmPayment.mockReturnValue(new Promise(() => {}));
      render(<Checkout {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
      });
      await act(async () => {
        fireEvent.submit(screen.getByTestId('checkout-form'));
      });
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('calls onSuccess when payment succeeds', async () => {
      mockConfirmPayment.mockResolvedValue({});
      render(<Checkout {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
      });
      await act(async () => {
        fireEvent.submit(screen.getByTestId('checkout-form'));
      });
      await waitFor(() => {
        expect(defaultProps.onSuccess).toHaveBeenCalled();
      });
    });

    it('shows error when payment fails with stripe error', async () => {
      mockConfirmPayment.mockResolvedValue({ error: { message: 'Card was declined' } });
      render(<Checkout {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
      });
      await act(async () => {
        fireEvent.submit(screen.getByTestId('checkout-form'));
      });
      await waitFor(() => {
        expect(screen.getByText('Card was declined')).toBeInTheDocument();
      });
    });

    it('shows generic error when confirmPayment throws', async () => {
      mockConfirmPayment.mockRejectedValue(new Error('Network interruption'));
      render(<Checkout {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByTestId('stripe-elements')).toBeInTheDocument();
      });
      await act(async () => {
        fireEvent.submit(screen.getByTestId('checkout-form'));
      });
      await waitFor(() => {
        expect(screen.getByText('Network interruption')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('does not call API when amount is 0', () => {
      render(<Checkout {...defaultProps} amount={0} />);
      expect(mockAuthFetch).not.toHaveBeenCalled();
    });

    it('does not call API when amount is undefined', () => {
      render(<Checkout {...defaultProps} amount={undefined} />);
      expect(mockAuthFetch).not.toHaveBeenCalled();
    });

    it('shows loading when amount is 0 (fetch never fires)', () => {
      render(<Checkout {...defaultProps} amount={0} />);
      expect(screen.getByText('Initializing payment...')).toBeInTheDocument();
    });
  });
});
