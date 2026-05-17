/**
 * TenantLeaseTab.test.tsx
 * Tests for Phase 2.8: My Lease tab
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import TenantLeaseTab from './TenantLeaseTab';
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

describe('TenantLeaseTab', () => {
  it('renders lease summary cards', () => {
    renderWithStore(<TenantLeaseTab />);

    expect(screen.getByTestId('lease-status-card')).toBeInTheDocument();
    expect(screen.getByTestId('lease-days-remaining-card')).toBeInTheDocument();
    expect(screen.getByTestId('lease-monthly-rent-card')).toHaveTextContent('AED 8,000');
    expect(screen.getByTestId('lease-deposit-card')).toHaveTextContent('AED 16,000');
  });

  it('renders lease property details', () => {
    renderWithStore(<TenantLeaseTab />);

    expect(screen.getByText(/Marina View 2BR Apartment/i)).toBeInTheDocument();
    expect(screen.getByText(/Dubai Marina, Tower A, Unit 1205/i)).toBeInTheDocument();
    expect(screen.getByText(/2026-01-01/i)).toBeInTheDocument();
    expect(screen.getByText(/2026-12-31/i)).toBeInTheDocument();
  });

  it('renders agreement and ejari download links', () => {
    renderWithStore(<TenantLeaseTab />);

    expect(screen.getByTestId('lease-agreement-download')).toHaveAttribute(
      'href',
      'https://example.com/docs/tenant-agreement.pdf'
    );
    expect(screen.getByTestId('lease-ejari-download')).toHaveAttribute(
      'href',
      'https://example.com/docs/tenant-ejari.pdf'
    );
  });

  it('opens lease breakdown modal and shows scoped details', async () => {
    renderWithStore(<TenantLeaseTab />);

    fireEvent.click(screen.getByTestId('lease-view-details'));

    await waitFor(() => {
      const modal = screen.getByTestId('lease-details-modal');
      expect(within(modal).getByText(/Lease Breakdown/i)).toBeInTheDocument();
      expect(within(modal).getByText(/Days Remaining/i)).toBeInTheDocument();
    });
  });

  it('closes modal with close button', async () => {
    renderWithStore(<TenantLeaseTab />);

    fireEvent.click(screen.getByTestId('lease-view-details'));
    await waitFor(() => {
      expect(screen.getByTestId('lease-details-modal')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('Close lease details'));

    await waitFor(() => {
      expect(screen.queryByTestId('lease-details-modal')).not.toBeInTheDocument();
    });
  });

  it('shows login-required state when unauthenticated', () => {
    renderWithStore(<TenantLeaseTab />, {
      user: {
        currentUser: null,
        isLoading: false,
        error: null,
      },
    });

    expect(
      screen.getByText(/You must be logged in to view your lease details/i)
    ).toBeInTheDocument();
  });
});
