/**
 * LandlordPortalHome.test.tsx
 * Tests for Phase 2.13 — Landlord home dashboard
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import LandlordPortalHome from './LandlordPortalHome';
import userReducer from '../../../store/userSlice';
import type { RootState } from '../../../store/store';
import { authFetch } from '../../../utils/authFetch';

vi.mock('../../../utils/authFetch', () => ({
  authFetch: vi.fn(),
}));

const mockLandlord = {
  id: 'landlord-1',
  email: 'landlord@whitecaves.ae',
  name: 'Khalid Al-Rashid',
  role: 'landlord',
  status: 'active',
  photoUrl: null,
};

const createMockStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: { user: userReducer },
    preloadedState: {
      user: {
        currentUser: mockLandlord,
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

const mockAuthFetch = vi.mocked(authFetch);

async function waitForDashboardEffectsToSettle() {
  await waitFor(() => {
    expect(mockAuthFetch).toHaveBeenCalledTimes(3);
  });
}

describe('LandlordPortalHome', () => {
  beforeEach(() => {
    mockAuthFetch.mockReset();
    mockAuthFetch.mockResolvedValue({
      json: async () => ({ data: [], pagination: { total: 0 } }),
    } as Response);
  });

  it('renders welcome banner with user name', async () => {
    renderWithStore(<LandlordPortalHome />);
    await waitForDashboardEffectsToSettle();

    expect(screen.getByTestId('landlord-welcome-banner')).toHaveTextContent('Khalid Al-Rashid');
  });

  it('renders expanded portfolio metric cards', async () => {
    renderWithStore(<LandlordPortalHome />);
    await waitForDashboardEffectsToSettle();

    expect(screen.getByTestId('landlord-metric-properties')).toBeInTheDocument();
    expect(screen.getByTestId('landlord-metric-tenants')).toBeInTheDocument();
    expect(screen.getByTestId('landlord-metric-rent')).toBeInTheDocument();
    expect(screen.getByTestId('landlord-metric-maintenance')).toBeInTheDocument();
    expect(screen.getByTestId('landlord-metric-hotspot')).toBeInTheDocument();
    expect(screen.getByTestId('landlord-metric-risk')).toBeInTheDocument();
  });

  it('renders quick link tiles', async () => {
    renderWithStore(<LandlordPortalHome />);
    await waitForDashboardEffectsToSettle();

    expect(screen.getByTestId('landlord-quick-link-properties')).toBeInTheDocument();
    expect(screen.getByTestId('landlord-quick-link-tenants')).toBeInTheDocument();
    expect(screen.getByTestId('landlord-quick-link-payments')).toBeInTheDocument();
    expect(screen.getByTestId('landlord-quick-link-maintenance')).toBeInTheDocument();
    expect(screen.getByTestId('landlord-quick-link-documents')).toBeInTheDocument();
  });

  it('calls onNavigate when a quick link is clicked', async () => {
    const onNavigate = vi.fn();
    renderWithStore(<LandlordPortalHome onNavigate={onNavigate} />);
    await waitForDashboardEffectsToSettle();

    fireEvent.click(screen.getByTestId('landlord-quick-link-properties'));
    expect(onNavigate).toHaveBeenCalledWith('properties');

    fireEvent.click(screen.getByTestId('landlord-quick-link-maintenance'));
    expect(onNavigate).toHaveBeenCalledWith('maintenance');
  });

  it('shows login message when unauthenticated', () => {
    renderWithStore(<LandlordPortalHome />, {
      user: { currentUser: null, isLoading: false, error: null },
    });

    expect(
      screen.getByText(/You must be logged in to view the Landlord Portal/i)
    ).toBeInTheDocument();
  });

  it('surfaces hotspot and occupancy risk insights', async () => {
    mockAuthFetch.mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/leases')) {
        return Promise.resolve({
          json: async () => ({
            data: [
              {
                id: 'lease-1',
                propertyId: 'prop-1',
                monthlyRent: 12000,
                status: 'expiring',
                nextPaymentDue: '2026-05-01T00:00:00.000Z',
              },
            ],
          }),
        } as Response);
      }
      if (url.includes('/api/properties')) {
        return Promise.resolve({
          json: async () => ({ data: [{ id: 'prop-1' }] }),
        } as Response);
      }
      return Promise.resolve({
        json: async () => ({
          data: [
            {
              id: 'maint-1',
              priority: 'high',
              property: { id: 'prop-1', location: 'Dubai Marina' },
            },
          ],
          pagination: { total: 1 },
        }),
      } as Response);
    });

    renderWithStore(<LandlordPortalHome />);
    await waitForDashboardEffectsToSettle();
    expect(screen.getByTestId('landlord-metric-hotspot-value')).toHaveTextContent('Dubai Marina');
    expect(screen.getByTestId('landlord-metric-risk-value')).toHaveTextContent('1');
  });

  it('aggregates hotspot data across paginated maintenance results', async () => {
    mockAuthFetch.mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/leases')) {
        return Promise.resolve({
          json: async () => ({ data: [] }),
        } as Response);
      }
      if (url.includes('/api/properties')) {
        return Promise.resolve({
          json: async () => ({ data: [{ id: 'prop-1' }, { id: 'prop-2' }] }),
        } as Response);
      }
      if (url.includes('/api/maintenance?page=2')) {
        return Promise.resolve({
          json: async () => ({
            data: [
              { id: 'maint-2', property: { id: 'prop-2', location: 'Downtown Dubai' } },
              { id: 'maint-3', property: { id: 'prop-2', location: 'Downtown Dubai' } },
            ],
          }),
        } as Response);
      }
      return Promise.resolve({
        json: async () => ({
          data: [{ id: 'maint-1', property: { id: 'prop-1', location: 'Dubai Marina' } }],
          pagination: { total: 3, totalPages: 2 },
        }),
      } as Response);
    });

    renderWithStore(<LandlordPortalHome />);
    await waitFor(() => {
      expect(mockAuthFetch).toHaveBeenCalledTimes(4);
    });

    expect(screen.getByTestId('landlord-metric-hotspot-value')).toHaveTextContent('Downtown Dubai');
    expect(screen.getByTestId('landlord-metric-maintenance-value')).toHaveTextContent('3');
  });
});
