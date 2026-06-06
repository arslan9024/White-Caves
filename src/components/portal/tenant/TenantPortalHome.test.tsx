/**
 * TenantPortalHome.test.tsx
 * Tests for Phase 2.13 — Tenant home dashboard
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import TenantPortalHome from './TenantPortalHome';
import userReducer from '../../../store/userSlice';
import type { RootState } from '../../../store/store';
import { authFetch } from '../../../utils/authFetch';

vi.mock('../../../utils/authFetch', () => ({
  authFetch: vi.fn(),
}));

const mockTenant = {
  id: 'tenant-1',
  email: 'tenant@whitecaves.ae',
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

describe('TenantPortalHome', () => {
  beforeEach(() => {
    vi.mocked(authFetch).mockReset();
    vi.mocked(authFetch).mockResolvedValue({
      json: async () => ({ data: [], pagination: { total: 0 } }),
    } as Response);
  });

  it('loads dashboard metrics from APIs', async () => {
    vi.mocked(authFetch).mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/leases')) {
        return Promise.resolve({
          json: async () => ({
            data: [
              {
                id: 'lease-1',
                startDate: '2026-01-01T00:00:00.000Z',
                endDate: '2027-01-01T00:00:00.000Z',
                monthlyRent: 8000,
                status: 'active',
                nextPaymentDue: '2026-06-01T00:00:00.000Z',
                property: { title: 'Apt 12', location: 'Dubai Marina' },
              },
            ],
          }),
        } as Response);
      }

      return Promise.resolve({
        json: async () => ({
          data: [],
          pagination: { total: 2 },
        }),
      } as Response);
    });

    renderWithStore(<TenantPortalHome />);
    await screen.findByTestId('tenant-metric-next-payment');
    expect(screen.getByTestId('tenant-metric-payment-value')).toHaveTextContent('AED 8,000');
  });

  it('renders welcome banner with user name', () => {
    renderWithStore(<TenantPortalHome />);

    expect(screen.getByTestId('tenant-welcome-banner')).toHaveTextContent('Fatima Al-Mansoori');
  });

  it('renders expanded lifecycle metric cards', async () => {
    vi.mocked(authFetch).mockResolvedValue({
      json: async () => ({ data: [], pagination: { total: 0 } }),
    } as Response);

    renderWithStore(<TenantPortalHome />);
    await screen.findByTestId('tenant-metric-next-payment');

    expect(screen.getByTestId('tenant-metric-next-payment')).toBeInTheDocument();
    expect(screen.getByTestId('tenant-metric-lease')).toBeInTheDocument();
    expect(screen.getByTestId('tenant-metric-maintenance')).toBeInTheDocument();
    expect(screen.getByTestId('tenant-metric-renewal')).toBeInTheDocument();
    expect(screen.getByTestId('tenant-metric-sla')).toBeInTheDocument();
  });

  it('shows next payment amount', async () => {
    vi.mocked(authFetch).mockImplementation((input: RequestInfo | URL) =>
      Promise.resolve({
        json: async () => {
          const url = String(input);
          if (url.includes('/api/leases')) {
            return {
              data: [
                {
                  id: 'lease-2',
                  startDate: '2026-01-01T00:00:00.000Z',
                  endDate: '2027-01-01T00:00:00.000Z',
                  monthlyRent: 8000,
                  status: 'active',
                  nextPaymentDue: '2026-06-01T00:00:00.000Z',
                  property: { title: 'Apt 12', location: 'Dubai Marina' },
                },
              ],
            };
          }
          return { data: [], pagination: { total: 0 } };
        },
      } as Response)
    );

    renderWithStore(<TenantPortalHome />);
    await screen.findByTestId('tenant-metric-payment-value');

    expect(screen.getByTestId('tenant-metric-payment-value')).toHaveTextContent('AED 8,000');
  });

  it('renders all quick link tiles', () => {
    renderWithStore(<TenantPortalHome />);

    expect(screen.getByTestId('tenant-quick-link-lease')).toBeInTheDocument();
    expect(screen.getByTestId('tenant-quick-link-payments')).toBeInTheDocument();
    expect(screen.getByTestId('tenant-quick-link-maintenance')).toBeInTheDocument();
    expect(screen.getByTestId('tenant-quick-link-documents')).toBeInTheDocument();
  });

  it('shows renewal status based on remaining days', async () => {
    vi.mocked(authFetch).mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/leases')) {
        return Promise.resolve({
          json: async () => ({
            data: [
              {
                id: 'lease-3',
                startDate: '2026-01-01T00:00:00.000Z',
                endDate: new Date(Date.now() + 20 * 24 * 3600_000).toISOString(),
                monthlyRent: 9000,
                status: 'active',
                nextPaymentDue: '2026-06-20T00:00:00.000Z',
              },
            ],
          }),
        } as Response);
      }
      return Promise.resolve({
        json: async () => ({ data: [{ id: 'm-1', status: 'open' }], pagination: { total: 1 } }),
      } as Response);
    });

    renderWithStore(<TenantPortalHome />);
    await screen.findByTestId('tenant-metric-renewal-value');
    expect(screen.getByTestId('tenant-metric-renewal-value')).toHaveTextContent(/Renewal urgent/i);
  });

  it('calls onNavigate when a quick link is clicked', () => {
    const onNavigate = vi.fn();
    renderWithStore(<TenantPortalHome onNavigate={onNavigate} />);

    fireEvent.click(screen.getByTestId('tenant-quick-link-maintenance'));
    expect(onNavigate).toHaveBeenCalledWith('maintenance');

    fireEvent.click(screen.getByTestId('tenant-quick-link-payments'));
    expect(onNavigate).toHaveBeenCalledWith('payments');
  });

  it('shows login message when unauthenticated', () => {
    renderWithStore(<TenantPortalHome />, {
      user: { currentUser: null, isLoading: false, error: null },
    });

    expect(
      screen.getByText(/You must be logged in to view the Tenant Portal/i)
    ).toBeInTheDocument();
  });
});
