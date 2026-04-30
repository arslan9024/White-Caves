/**
 * TenantPaymentHistoryTab.test.tsx
 * Tests for Phase 2.9
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import TenantPaymentHistoryTab from './TenantPaymentHistoryTab';
import userReducer from '../../../store/userSlice';
import type { RootState } from '../../../store/store';

const mockTenant = {
  id: 'tenant-1',
  email: 'tenant@test.ae',
  name: 'Fatima Al-Mansoori',
  role: 'tenant',
  status: 'active',
  photoUrl: null,
};

const createMockStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: { user: userReducer },
    preloadedState: {
      user: {
        currentUser: mockTenant,
        isLoading: false,
        error: null,
      },
      ...preloadedState,
    },
  });

const renderWithStore = (
  component: React.ReactElement,
  preloadedState?: PreloadedState<RootState>
) => {
  const store = createMockStore(preloadedState);
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('TenantPaymentHistoryTab', () => {
  it('renders summary cards', () => {
    renderWithStore(<TenantPaymentHistoryTab />);

    expect(screen.getByTestId('tenant-total-paid-card')).toHaveTextContent('AED 16,000');
    expect(screen.getByTestId('tenant-outstanding-card')).toHaveTextContent('AED 16,000');
  });

  it('renders next payment due card with pending month', () => {
    renderWithStore(<TenantPaymentHistoryTab />);

    expect(screen.getByTestId('tenant-next-payment-card')).toBeInTheDocument();
    // March 2026 is the first pending payment
    expect(screen.getByTestId('tenant-next-payment-month')).toHaveTextContent('March 2026');
  });

  it('renders disabled Pay Now button with tooltip', () => {
    renderWithStore(<TenantPaymentHistoryTab />);

    const btn = screen.getByTestId('tenant-pay-now-btn');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('title', 'Online payments coming in Phase 5');
  });

  it('renders all payment rows', () => {
    renderWithStore(<TenantPaymentHistoryTab />);

    expect(screen.getByTestId('tenant-payment-row-tp-001')).toBeInTheDocument();
    expect(screen.getByTestId('tenant-payment-row-tp-004')).toBeInTheDocument();
  });

  it('filters by search query', async () => {
    renderWithStore(<TenantPaymentHistoryTab />);

    fireEvent.change(screen.getByTestId('tenant-payment-search'), {
      target: { value: 'April' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('tenant-payment-row-tp-004')).toBeInTheDocument();
      expect(screen.queryByTestId('tenant-payment-row-tp-001')).not.toBeInTheDocument();
    });
  });

  it('filters by status', async () => {
    renderWithStore(<TenantPaymentHistoryTab />);

    fireEvent.change(screen.getByTestId('tenant-payment-status-filter'), {
      target: { value: 'paid' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('tenant-payment-row-tp-001')).toBeInTheDocument();
      expect(screen.getByTestId('tenant-payment-row-tp-002')).toBeInTheDocument();
      expect(screen.queryByTestId('tenant-payment-row-tp-003')).not.toBeInTheDocument();
    });
  });

  it('shows empty state for unmatched filters', async () => {
    renderWithStore(<TenantPaymentHistoryTab />);

    fireEvent.change(screen.getByTestId('tenant-payment-search'), {
      target: { value: 'NoMonth' },
    });

    await waitFor(() => {
      expect(screen.getByTestId('tenant-payment-empty-state')).toBeInTheDocument();
    });
  });

  it('shows login message when unauthenticated', () => {
    renderWithStore(<TenantPaymentHistoryTab />, {
      user: {
        currentUser: null,
        isLoading: false,
        error: null,
      },
    });

    expect(
      screen.getByText(/You must be logged in to view your payment history/i)
    ).toBeInTheDocument();
  });
});

