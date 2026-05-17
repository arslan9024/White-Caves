/**
 * LandlordPaymentsTab.test.tsx
 * Tests for Phase 2.4: Rent Payments tab
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import LandlordPaymentsTab from './LandlordPaymentsTab';
import userReducer from '../../../store/userSlice';
import type { RootState } from '../../../store/store';

const mockLandlord = {
  id: 'landlord-1',
  email: 'landlord@test.ae',
  name: 'Ahmed Al-Mansouri',
  role: 'landlord',
  status: 'active',
  photoUrl: null,
};

const createMockStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState: {
      user: {
        currentUser: mockLandlord,
        isLoading: false,
        error: null,
      },
      ...preloadedState,
    },
  });
};

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

describe('LandlordPaymentsTab', () => {
  describe('Header and Summary', () => {
    it('renders header content', () => {
      renderWithStore(<LandlordPaymentsTab />);

      expect(screen.getByText('Rent Payments')).toBeInTheDocument();
      expect(screen.getByText(/Track rent collection/i)).toBeInTheDocument();
    });

    it('renders summary cards with computed totals', () => {
      renderWithStore(<LandlordPaymentsTab />);

      expect(screen.getByTestId('summary-total-monthly-income')).toHaveTextContent('AED 32,500');
      expect(screen.getByTestId('summary-collected-this-month')).toHaveTextContent('AED 8,000');
      expect(screen.getByTestId('summary-outstanding-balance')).toHaveTextContent('AED 24,500');
    });
  });

  describe('Payment List', () => {
    it('renders all payment rows by default', () => {
      renderWithStore(<LandlordPaymentsTab />);

      expect(screen.getByTestId('payment-row-pay-001')).toBeInTheDocument();
      expect(screen.getByTestId('payment-row-pay-002')).toBeInTheDocument();
      expect(screen.getByTestId('payment-row-pay-003')).toBeInTheDocument();
      expect(screen.getByTestId('payment-row-pay-004')).toBeInTheDocument();
    });

    it('renders paid, pending, and overdue statuses', () => {
      renderWithStore(<LandlordPaymentsTab />);

      expect(screen.getAllByText('paid').length).toBeGreaterThan(0);
      expect(screen.getAllByText('pending').length).toBeGreaterThan(0);
      expect(screen.getAllByText('overdue').length).toBeGreaterThan(0);
    });
  });

  describe('Search Functionality', () => {
    it('filters by tenant name', async () => {
      renderWithStore(<LandlordPaymentsTab />);

      fireEvent.change(screen.getByTestId('payment-search'), {
        target: { value: 'Sarah Johnson' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('payment-row-pay-002')).toBeInTheDocument();
        expect(screen.queryByTestId('payment-row-pay-001')).not.toBeInTheDocument();
      });
    });

    it('filters by property name', async () => {
      renderWithStore(<LandlordPaymentsTab />);

      fireEvent.change(screen.getByTestId('payment-search'), {
        target: { value: 'JBR 3BR Villa' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('payment-row-pay-003')).toBeInTheDocument();
        expect(screen.queryByTestId('payment-row-pay-002')).not.toBeInTheDocument();
      });
    });

    it('filters by payment ID', async () => {
      renderWithStore(<LandlordPaymentsTab />);

      fireEvent.change(screen.getByTestId('payment-search'), {
        target: { value: 'pay-004' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('payment-row-pay-004')).toBeInTheDocument();
        expect(screen.queryByTestId('payment-row-pay-001')).not.toBeInTheDocument();
      });
    });

    it('shows empty state when no search results', async () => {
      renderWithStore(<LandlordPaymentsTab />);

      fireEvent.change(screen.getByTestId('payment-search'), {
        target: { value: 'non-existent payment' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('payments-empty-state')).toBeInTheDocument();
      });
    });
  });

  describe('Status Filter', () => {
    it('filters to paid only', async () => {
      renderWithStore(<LandlordPaymentsTab />);

      fireEvent.change(screen.getByTestId('payment-status-filter'), {
        target: { value: 'paid' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('payment-row-pay-001')).toBeInTheDocument();
        expect(screen.queryByTestId('payment-row-pay-002')).not.toBeInTheDocument();
      });
    });

    it('filters to pending only', async () => {
      renderWithStore(<LandlordPaymentsTab />);

      fireEvent.change(screen.getByTestId('payment-status-filter'), {
        target: { value: 'pending' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('payment-row-pay-002')).toBeInTheDocument();
        expect(screen.getByTestId('payment-row-pay-004')).toBeInTheDocument();
        expect(screen.queryByTestId('payment-row-pay-001')).not.toBeInTheDocument();
      });
    });

    it('filters to overdue only', async () => {
      renderWithStore(<LandlordPaymentsTab />);

      fireEvent.change(screen.getByTestId('payment-status-filter'), {
        target: { value: 'overdue' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('payment-row-pay-003')).toBeInTheDocument();
        expect(screen.queryByTestId('payment-row-pay-001')).not.toBeInTheDocument();
      });
    });
  });

  describe('Combined Search and Filter', () => {
    it('applies both search and status filter together', async () => {
      renderWithStore(<LandlordPaymentsTab />);

      fireEvent.change(screen.getByTestId('payment-status-filter'), {
        target: { value: 'pending' },
      });
      fireEvent.change(screen.getByTestId('payment-search'), {
        target: { value: 'Marina View' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('payment-row-pay-004')).toBeInTheDocument();
        expect(screen.queryByTestId('payment-row-pay-002')).not.toBeInTheDocument();
      });
    });
  });

  describe('Details Modal', () => {
    it('opens payment detail modal when row is clicked', async () => {
      renderWithStore(<LandlordPaymentsTab />);

      fireEvent.click(screen.getByTestId('payment-row-pay-001'));

      await waitFor(() => {
        expect(screen.getByTestId('payment-detail-modal')).toBeInTheDocument();
      });
    });

    it('shows payment detail values in modal', async () => {
      renderWithStore(<LandlordPaymentsTab />);

      fireEvent.click(screen.getByTestId('payment-row-pay-003'));

      await waitFor(() => {
        const modal = screen.getByTestId('payment-detail-modal');
        expect(within(modal).getByText(/Payment Details/i)).toBeInTheDocument();
        expect(within(modal).getByText(/pay-003/i)).toBeInTheDocument();
        expect(within(modal).getByText(/JBR 3BR Villa/i)).toBeInTheDocument();
        expect(within(modal).getByText(/AED 12,000/i)).toBeInTheDocument();
      });
    });

    it('closes modal on close button click', async () => {
      renderWithStore(<LandlordPaymentsTab />);

      fireEvent.click(screen.getByTestId('payment-row-pay-001'));
      await waitFor(() => {
        expect(screen.getByTestId('payment-detail-modal')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText('Close payment details'));

      await waitFor(() => {
        expect(screen.queryByTestId('payment-detail-modal')).not.toBeInTheDocument();
      });
    });

    it('closes modal on overlay click', async () => {
      renderWithStore(<LandlordPaymentsTab />);

      fireEvent.click(screen.getByTestId('payment-row-pay-002'));
      await waitFor(() => {
        expect(screen.getByTestId('payment-detail-modal')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('payment-detail-modal'));

      await waitFor(() => {
        expect(screen.queryByTestId('payment-detail-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Authentication', () => {
    it('shows login required message when not authenticated', () => {
      renderWithStore(<LandlordPaymentsTab />, {
        user: {
          currentUser: null,
          isLoading: false,
          error: null,
        },
      });

      expect(
        screen.getByText(/You must be logged in to view your payment schedule/i)
      ).toBeInTheDocument();
    });
  });
});
