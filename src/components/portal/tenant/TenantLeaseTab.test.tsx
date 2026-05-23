/**
 * TenantLeaseTab.test.tsx
 * Tests for Phase 2.8: My Lease tab
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import TenantLeaseTab from './TenantLeaseTab';
import userReducer from '../../../store/userSlice';
import type { RootState } from '../../../store/store';

// ── Mock authFetch ───────────────────────────────────────────────────────────
const mockAuthFetch = vi.fn();
vi.mock('../../../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

const MOCK_LEASE = {
  id: 'lease-tenant-001',
  leaseNumber: 'TL-2026-001',
  startDate: '2026-01-01T00:00:00.000Z',
  endDate: '2026-12-31T00:00:00.000Z',
  monthlyRent: 8000,
  depositAmount: 16000,
  status: 'active',
  ejariNumber: 'EJARI-2026-8891',
  ejariStatus: 'registered',
  documents: [
    'https://example.com/docs/tenant-agreement.pdf',
    'https://example.com/docs/tenant-ejari.pdf',
  ],
  property: {
    id: 'prop-1205',
    title: 'Marina View 2BR Apartment',
    location: 'Dubai Marina, Tower A, Unit 1205',
    type: 'Apartment',
  },
  tenant: { id: 'tenant-1', name: 'Fatima Al-Mansoori', email: 'tenant@test.ae' },
  landlord: { id: 'landlord-1', name: 'Khalid Al-Sayegh', email: 'landlord@test.ae' },
};

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
  beforeEach(() => {
    mockAuthFetch.mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: MOCK_LEASE }),
    });
  });

  it('renders lease summary cards', async () => {
    renderWithStore(<TenantLeaseTab />);

    await waitFor(() => {
      expect(screen.getByTestId('lease-status-card')).toBeInTheDocument();
    });
    expect(screen.getByTestId('lease-days-remaining-card')).toBeInTheDocument();
    expect(screen.getByTestId('lease-monthly-rent-card')).toHaveTextContent('AED 8,000');
    expect(screen.getByTestId('lease-deposit-card')).toHaveTextContent('AED 16,000');
  });

  it('renders lease property details', async () => {
    renderWithStore(<TenantLeaseTab />);

    await waitFor(() => {
      expect(screen.getByText(/Marina View 2BR Apartment/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Dubai Marina, Tower A, Unit 1205/i)).toBeInTheDocument();
    expect(screen.getByText(/2026-01-01/i)).toBeInTheDocument();
    expect(screen.getByText(/2026-12-31/i)).toBeInTheDocument();
  });

  it('renders agreement and ejari download links', async () => {
    renderWithStore(<TenantLeaseTab />);

    await waitFor(() => {
      expect(screen.getByTestId('lease-agreement-download')).toHaveAttribute(
        'href',
        'https://example.com/docs/tenant-agreement.pdf'
      );
    });
    expect(screen.getByTestId('lease-ejari-download')).toHaveAttribute(
      'href',
      'https://example.com/docs/tenant-ejari.pdf'
    );
  });

  it('opens lease breakdown modal and shows scoped details', async () => {
    renderWithStore(<TenantLeaseTab />);

    await waitFor(() => expect(screen.getByTestId('lease-view-details')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('lease-view-details'));

    await waitFor(() => {
      const modal = screen.getByTestId('lease-details-modal');
      expect(within(modal).getByText(/Lease Breakdown/i)).toBeInTheDocument();
      expect(within(modal).getByText(/Days Remaining/i)).toBeInTheDocument();
    });
  });

  it('closes modal with close button', async () => {
    renderWithStore(<TenantLeaseTab />);

    await waitFor(() => expect(screen.getByTestId('lease-view-details')).toBeInTheDocument());
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

  it('shows error message when API fails', async () => {
    mockAuthFetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithStore(<TenantLeaseTab />);

    await waitFor(() => {
      expect(screen.getByTestId('lease-error')).toBeInTheDocument();
    });
  });

  it('calls the dedicated portal endpoint', async () => {
    renderWithStore(<TenantLeaseTab />);

    await waitFor(() => expect(mockAuthFetch).toHaveBeenCalled());
    expect(mockAuthFetch).toHaveBeenCalledWith('/api/portal/tenant/lease');
  });
});
