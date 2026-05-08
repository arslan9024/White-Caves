/**
 * LandlordPortalPage.test.tsx
 * Tests for Phase 2.1-2.6: Landlord Portal
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import LandlordPortalPage from './LandlordPortalPage';
import userReducer from '../../store/userSlice';

// Mock the tab components
vi.mock('../../components/portal/landlord/LandlordPortalHome', () => ({
  default: ({ onNavigate }: { onNavigate?: (key: string) => void }) => (
    <div data-testid="home-tab">
      Home Tab
      <button onClick={() => onNavigate?.('properties')} data-testid="home-nav-properties">
        Go Properties
      </button>
    </div>
  ),
}));
vi.mock('../../components/portal/landlord/LandlordPropertiesTab', () => ({
  default: () => <div data-testid="properties-tab">Properties Tab</div>,
}));
vi.mock('../../components/portal/landlord/LandlordTenantsTab', () => ({
  default: () => <div data-testid="tenants-tab">Tenants Tab</div>,
}));
vi.mock('../../components/portal/landlord/LandlordPaymentsTab', () => ({
  default: () => <div data-testid="payments-tab">Payments Tab</div>,
}));
vi.mock('../../components/portal/landlord/LandlordMaintenanceTab', () => ({
  default: () => <div data-testid="maintenance-tab">Maintenance Tab</div>,
}));
vi.mock('../../components/portal/landlord/LandlordDocumentsTab', () => ({
  default: () => <div data-testid="documents-tab">Documents Tab</div>,
}));
vi.mock('../../components/portal/landlord/LandlordOfferReviewTab', () => ({
  default: () => <div data-testid="offers-tab">Offer Review Tab</div>,
}));
vi.mock('../../components/portal/landlord/LandlordIncomeTab', () => ({
  default: () => <div data-testid="income-tab">Income Tab</div>,
}));

const mockUser = {
  id: 'landlord-1',
  email: 'landlord@test.ae',
  name: 'Ahmed Al-Mansouri',
  role: 'landlord',
  status: 'active',
  photoUrl: null,
};

type TestState = { user: ReturnType<typeof userReducer> };

const createMockStore = (preloadedState?: Partial<TestState>) => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState: {
      user: {
        currentUser: mockUser,
        isLoading: false,
        error: null,
      },
      ...preloadedState,
    },
  } as any);
};

const renderWithStore = (
  component: React.ReactElement,
  preloadedState?: Partial<TestState>
) => {
  const store = createMockStore(preloadedState);
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('LandlordPortalPage', () => {
  describe('Tab Navigation', () => {
    it('renders all tab buttons', () => {
      renderWithStore(<LandlordPortalPage />);

      expect(screen.getByTestId('tab-home')).toBeInTheDocument();
      expect(screen.getByTestId('tab-properties')).toBeInTheDocument();
      expect(screen.getByTestId('tab-tenants')).toBeInTheDocument();
      expect(screen.getByTestId('tab-payments')).toBeInTheDocument();
      expect(screen.getByTestId('tab-maintenance')).toBeInTheDocument();
      expect(screen.getByTestId('tab-documents')).toBeInTheDocument();
    });

    it('displays tab labels correctly', () => {
      renderWithStore(<LandlordPortalPage />);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('My Properties')).toBeInTheDocument();
      expect(screen.getByText('Tenants')).toBeInTheDocument();
      expect(screen.getByText('Rent Payments')).toBeInTheDocument();
      expect(screen.getByText('Maintenance')).toBeInTheDocument();
      expect(screen.getByText('Documents')).toBeInTheDocument();
    });

    it('renders home dashboard tab by default', () => {
      renderWithStore(<LandlordPortalPage />);

      expect(screen.getByTestId('tab-home')).toBeInTheDocument();
      expect(screen.getByTestId('home-tab')).toBeInTheDocument();
      expect(screen.getByTestId('tabpanel-home')).toBeInTheDocument();
    });

    it('has home tab marked as active initially', () => {
      renderWithStore(<LandlordPortalPage />);

      const homeTab = screen.getByTestId('tab-home');
      expect(homeTab).toHaveClass('active');
    });

    it('navigates to properties tab via home quick link', async () => {
      renderWithStore(<LandlordPortalPage />);

      fireEvent.click(screen.getByTestId('home-nav-properties'));

      await waitFor(() => {
        expect(screen.getByTestId('tab-properties')).toHaveClass('active');
      });
    });

    it('switches to payments tab when clicked', async () => {
      renderWithStore(<LandlordPortalPage />);

      const paymentsTab = screen.getByTestId('tab-payments');
      fireEvent.click(paymentsTab);

      await waitFor(() => {
        expect(paymentsTab).toHaveClass('active');
        expect(screen.getByTestId('tab-home')).not.toHaveClass('active');
      });
    });

    it('switches to maintenance tab when clicked', async () => {
      renderWithStore(<LandlordPortalPage />);

      const maintenanceTab = screen.getByTestId('tab-maintenance');
      fireEvent.click(maintenanceTab);

      await waitFor(() => {
        expect(maintenanceTab).toHaveClass('active');
        expect(screen.getByTestId('tab-home')).not.toHaveClass('active');
      });
    });

    it('switches to documents tab when clicked', async () => {
      renderWithStore(<LandlordPortalPage />);

      const documentsTab = screen.getByTestId('tab-documents');
      fireEvent.click(documentsTab);

      await waitFor(() => {
        expect(documentsTab).toHaveClass('active');
        expect(screen.getByTestId('tab-home')).not.toHaveClass('active');
      });
    });
  });

  describe('Page Header', () => {
    it('displays welcome message with user name', () => {
      renderWithStore(<LandlordPortalPage />);

      expect(screen.getByText('Landlord Portal')).toBeInTheDocument();
      expect(screen.getByText(/Welcome, Ahmed Al-Mansouri/)).toBeInTheDocument();
    });

    it('displays description text', () => {
      renderWithStore(<LandlordPortalPage />);

      expect(screen.getByText(/Manage your properties and tenants/)).toBeInTheDocument();
    });
  });

  describe('Unauthenticated Access', () => {
    it('displays error message when not logged in', () => {
      renderWithStore(<LandlordPortalPage />, {
        user: {
          currentUser: null,
          isLoading: false,
          error: null,
        },
      });

      expect(
        screen.getByText(/You must be logged in to access the Landlord Portal/)
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has tab list with proper ARIA roles', () => {
      renderWithStore(<LandlordPortalPage />);

      const tabList = screen.getByRole('tablist', {
        name: /Landlord Portal Navigation/i,
      });
      expect(tabList).toBeInTheDocument();
    });

    it('tab buttons have proper aria-selected attributes', () => {
      renderWithStore(<LandlordPortalPage />);

      const homeTab = screen.getByTestId('tab-home');
      expect(homeTab).toHaveAttribute('aria-selected', 'true');

      const tenantsTab = screen.getByTestId('tab-tenants');
      expect(tenantsTab).toHaveAttribute('aria-selected', 'false');
    });

    it('tab panels have proper role attributes', () => {
      renderWithStore(<LandlordPortalPage />);

      const tabpanel = screen.getByTestId('tabpanel-home');
      expect(tabpanel).toHaveAttribute('role', 'tabpanel');
    });

    it('keyboard navigation updates aria-selected', async () => {
      renderWithStore(<LandlordPortalPage />);

      const tenantsTab = screen.getByTestId('tab-tenants');
      fireEvent.click(tenantsTab);

      await waitFor(() => {
        expect(tenantsTab).toHaveAttribute('aria-selected', 'true');
        const propertiesTab = screen.getByTestId('tab-properties');
        expect(propertiesTab).toHaveAttribute('aria-selected', 'false');
      });
    });
  });

  describe('Tab Content Container', () => {
    it('renders tab content with proper id', () => {
      renderWithStore(<LandlordPortalPage />);

      const tabpanel = screen.getByTestId('tabpanel-home');
      expect(tabpanel).toHaveAttribute('id', 'tabpanel-home');
    });

    it('updates tabpanel id when tab changes', async () => {
      renderWithStore(<LandlordPortalPage />);

      const tenantsTab = screen.getByTestId('tab-tenants');
      fireEvent.click(tenantsTab);

      await waitFor(() => {
        const tabpanel = screen.getByTestId('tabpanel-tenants');
        expect(tabpanel).toHaveAttribute('id', 'tabpanel-tenants');
      });
    });
  });
});
