/**
 * LandlordTenantsTab.test.tsx
 * Tests for Phase 2.3: Tenants Tab
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import LandlordTenantsTab from './LandlordTenantsTab';
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

describe('LandlordTenantsTab', () => {
  describe('Tenant List Display', () => {
    it('renders tenant list with mock data', () => {
      renderWithStore(<LandlordTenantsTab />);
      expect(screen.getByText(/Ahmed Al-Rashid/)).toBeInTheDocument();
      expect(screen.getByText(/Sarah Johnson/)).toBeInTheDocument();
    });

    it('displays tenant contact information', () => {
      renderWithStore(<LandlordTenantsTab />);
      expect(screen.getByText(/ahmed.rashid@email.ae/)).toBeInTheDocument();
      expect(screen.getByText(/971-50-123-4567/)).toBeInTheDocument();
    });

    it('displays tenant property assignments', () => {
      renderWithStore(<LandlordTenantsTab />);
      expect(screen.getByText(/Marina View 2BR Apartment/)).toBeInTheDocument();
      expect(screen.getByText(/Downtown Studio/)).toBeInTheDocument();
    });

    it('displays tenant status badges', () => {
      renderWithStore(<LandlordTenantsTab />);
      const activeBadges = screen.getAllByText('Active');
      const expiredBadges = screen.getAllByText('Expired');
      expect(activeBadges.length).toBeGreaterThan(0);
      expect(expiredBadges.length).toBeGreaterThan(0);
    });
  });

  describe('Search Functionality', () => {
    it('filters tenants by name search', async () => {
      renderWithStore(<LandlordTenantsTab />);
      const searchInput = screen.getByTestId('tenant-search');

      fireEvent.change(searchInput, { target: { value: 'Ahmed' } });

      await waitFor(() => {
        expect(screen.getByText(/Ahmed Al-Rashid/)).toBeInTheDocument();
        expect(screen.queryByText(/Sarah Johnson/)).not.toBeInTheDocument();
      });
    });

    it('filters tenants by email search', async () => {
      renderWithStore(<LandlordTenantsTab />);
      const searchInput = screen.getByTestId('tenant-search');

      fireEvent.change(searchInput, { target: { value: 'sarah.j' } });

      await waitFor(() => {
        expect(screen.getByText(/Sarah Johnson/)).toBeInTheDocument();
        expect(screen.queryByText(/Ahmed Al-Rashid/)).not.toBeInTheDocument();
      });
    });

    it('filters tenants by property search', async () => {
      renderWithStore(<LandlordTenantsTab />);
      const searchInput = screen.getByTestId('tenant-search');

      fireEvent.change(searchInput, { target: { value: 'Marina' } });

      await waitFor(() => {
        expect(screen.getByText(/Ahmed Al-Rashid/)).toBeInTheDocument();
        expect(screen.getByText(/Fatima Al-Mansoori/)).toBeInTheDocument();
        expect(screen.queryByText(/Sarah Johnson/)).not.toBeInTheDocument();
      });
    });

    it('shows no results message when search has no matches', async () => {
      renderWithStore(<LandlordTenantsTab />);
      const searchInput = screen.getByTestId('tenant-search');

      fireEvent.change(searchInput, { target: { value: 'XYZ123' } });

      await waitFor(() => {
        expect(screen.getByText('No tenants match your search.')).toBeInTheDocument();
      });
    });

    it('clears search and shows all tenants again', async () => {
      renderWithStore(<LandlordTenantsTab />);
      const searchInput = screen.getByTestId('tenant-search') as HTMLInputElement;

      fireEvent.change(searchInput, { target: { value: 'Ahmed' } });
      await waitFor(() => {
        expect(screen.queryByText(/Sarah Johnson/)).not.toBeInTheDocument();
      });

      fireEvent.change(searchInput, { target: { value: '' } });
      await waitFor(() => {
        expect(screen.getByText(/Sarah Johnson/)).toBeInTheDocument();
      });
    });
  });

  describe('Status Filtering', () => {
    it('filters to active tenants only', async () => {
      renderWithStore(<LandlordTenantsTab />);
      const filterSelect = screen.getByTestId('status-filter');

      fireEvent.change(filterSelect, { target: { value: 'active' } });

      await waitFor(() => {
        expect(screen.getByText(/Ahmed Al-Rashid/)).toBeInTheDocument();
        expect(screen.getByText(/Fatima Al-Mansoori/)).toBeInTheDocument();
        expect(screen.queryByText(/Sarah Johnson/)).not.toBeInTheDocument();
      });
    });

    it('filters to expired tenants only', async () => {
      renderWithStore(<LandlordTenantsTab />);
      const filterSelect = screen.getByTestId('status-filter');

      fireEvent.change(filterSelect, { target: { value: 'expired' } });

      await waitFor(() => {
        expect(screen.getByText(/Sarah Johnson/)).toBeInTheDocument();
        expect(screen.getByText(/Mohammed Hassan/)).toBeInTheDocument();
        expect(screen.queryByText(/Ahmed Al-Rashid/)).not.toBeInTheDocument();
      });
    });

    it('shows all tenants when filtering to "All Tenants"', async () => {
      renderWithStore(<LandlordTenantsTab />);
      const filterSelect = screen.getByTestId('status-filter');

      fireEvent.change(filterSelect, { target: { value: 'active' } });
      await waitFor(() => {
        expect(screen.queryByText(/Sarah Johnson/)).not.toBeInTheDocument();
      });

      fireEvent.change(filterSelect, { target: { value: 'all' } });
      await waitFor(() => {
        expect(screen.getByText(/Sarah Johnson/)).toBeInTheDocument();
      });
    });
  });

  describe('Tenant Detail Modal', () => {
    it('opens detail modal when tenant card is clicked', async () => {
      renderWithStore(<LandlordTenantsTab />);
      const tenantCard = screen.getByTestId('tenant-row-tenant-1');

      fireEvent.click(tenantCard);

      await waitFor(() => {
        expect(screen.getByTestId('tenant-detail-modal')).toBeInTheDocument();
        expect(screen.getByText(/Ahmed Al-Rashid/)).toBeInTheDocument();
      });
    });

    it('displays full tenant details in modal', async () => {
      renderWithStore(<LandlordTenantsTab />);
      const tenantCard = screen.getByTestId('tenant-row-tenant-1');

      fireEvent.click(tenantCard);

      await waitFor(() => {
        expect(screen.getByText(/ahmed.rashid@email.ae/)).toBeInTheDocument();
        expect(screen.getByText(/971-50-123-4567/)).toBeInTheDocument();
        expect(screen.getByText(/Marina View 2BR Apartment/)).toBeInTheDocument();
        expect(screen.getByText(/ART-1205/)).toBeInTheDocument();
        expect(screen.getByText(/Jan 1, 2024/)).toBeInTheDocument();
        expect(screen.getByText(/Dec 31, 2024/)).toBeInTheDocument();
      });
    });

    it('closes modal when close button is clicked', async () => {
      renderWithStore(<LandlordTenantsTab />);
      const tenantCard = screen.getByTestId('tenant-row-tenant-1');

      fireEvent.click(tenantCard);
      await waitFor(() => {
        expect(screen.getByTestId('tenant-detail-modal')).toBeInTheDocument();
      });

      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('tenant-detail-modal')).not.toBeInTheDocument();
      });
    });

    it('closes modal when overlay is clicked', async () => {
      renderWithStore(<LandlordTenantsTab />);
      const tenantCard = screen.getByTestId('tenant-row-tenant-1');

      fireEvent.click(tenantCard);
      await waitFor(() => {
        expect(screen.getByTestId('tenant-detail-modal')).toBeInTheDocument();
      });

      const modalOverlay = screen.getByTestId('tenant-detail-modal');
      fireEvent.click(modalOverlay);

      await waitFor(() => {
        expect(screen.queryByTestId('tenant-detail-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Authentication', () => {
    it('shows login message when user is not authenticated', () => {
      renderWithStore(<LandlordTenantsTab />, {
        user: {
          currentUser: null,
          isLoading: false,
          error: null,
        },
      });

      expect(screen.getByText(/You must be logged in/)).toBeInTheDocument();
    });
  });

  describe('Combined Search and Filter', () => {
    it('combines search and status filter', async () => {
      renderWithStore(<LandlordTenantsTab />);
      const searchInput = screen.getByTestId('tenant-search');
      const filterSelect = screen.getByTestId('status-filter');

      fireEvent.change(filterSelect, { target: { value: 'active' } });
      fireEvent.change(searchInput, { target: { value: 'Ahmed' } });

      await waitFor(() => {
        expect(screen.getByText(/Ahmed Al-Rashid/)).toBeInTheDocument();
        expect(screen.queryByText(/Sarah Johnson/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Mohammed Hassan/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Tab Header', () => {
    it('displays tab title and description', () => {
      renderWithStore(<LandlordTenantsTab />);
      expect(screen.getByText('Manage Tenants')).toBeInTheDocument();
      expect(screen.getByText(/View all current and past tenants/)).toBeInTheDocument();
    });
  });

  describe('Search and Filter Controls', () => {
    it('renders search input field', () => {
      renderWithStore(<LandlordTenantsTab />);
      const searchInput = screen.getByTestId('tenant-search') as HTMLInputElement;
      expect(searchInput.placeholder).toContain('Search');
    });

    it('renders status filter dropdown', () => {
      renderWithStore(<LandlordTenantsTab />);
      expect(screen.getByTestId('status-filter')).toBeInTheDocument();
      expect(screen.getByDisplayValue('All Tenants')).toBeInTheDocument();
    });
  });
});
