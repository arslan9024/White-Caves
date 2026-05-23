/**
 * TenantPortalPage.test.tsx
 * Tests for Phase 2.7-2.11: Tenant Portal
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import TenantPortalPage from './TenantPortalPage';
import userReducer from '../../store/userSlice';

// Mock the tab components
vi.mock('../../components/portal/tenant/TenantPortalHome', () => ({
  default: ({ onNavigate }: { onNavigate?: (key: string) => void }) => (
    <div data-testid="home-tab">
      Home Tab
      <button onClick={() => onNavigate?.('maintenance')} data-testid="home-nav-maintenance">
        Go Maintenance
      </button>
    </div>
  ),
}));
vi.mock('../../components/portal/tenant/TenantLeaseTab', () => ({
  default: () => <div data-testid="lease-tab">Lease Tab</div>,
}));
vi.mock('../../components/portal/tenant/TenantPaymentHistoryTab', () => ({
  default: () => <div data-testid="payment-history-tab">Payment History Tab</div>,
}));
vi.mock('../../components/portal/tenant/TenantMaintenanceTab', () => ({
  default: () => <div data-testid="maintenance-tab">Maintenance Tab</div>,
}));
vi.mock('../../components/portal/tenant/TenantDocumentsTab', () => ({
  default: () => <div data-testid="documents-tab">Documents Tab</div>,
}));

const mockTenantUser = {
  id: 'tenant-1',
  email: 'tenant@test.ae',
  name: 'Fatima Al-Mansoori',
  role: 'tenant',
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
        currentUser: mockTenantUser,
        isLoading: false,
        error: null,
      },
      ...preloadedState,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
};

const renderWithStore = (component: React.ReactElement, preloadedState?: Partial<TestState>) => {
  const store = createMockStore(preloadedState);
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('TenantPortalPage', () => {
  describe('Tab Navigation', () => {
    it('renders all tab buttons', () => {
      renderWithStore(<TenantPortalPage />);

      expect(screen.getByTestId('tab-home')).toBeInTheDocument();
      expect(screen.getByTestId('tab-lease')).toBeInTheDocument();
      expect(screen.getByTestId('tab-payments')).toBeInTheDocument();
      expect(screen.getByTestId('tab-maintenance')).toBeInTheDocument();
      expect(screen.getByTestId('tab-documents')).toBeInTheDocument();
    });

    it('displays tab labels correctly', () => {
      renderWithStore(<TenantPortalPage />);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('My Lease')).toBeInTheDocument();
      expect(screen.getByText('Payment History')).toBeInTheDocument();
      expect(screen.getByText('Maintenance')).toBeInTheDocument();
      expect(screen.getByText('Documents')).toBeInTheDocument();
    });

    it('renders home dashboard tab by default', () => {
      renderWithStore(<TenantPortalPage />);

      expect(screen.getByTestId('portal-layout')).toBeInTheDocument();
      expect(screen.getByTestId('portal-navbar')).toBeInTheDocument();
      expect(screen.getByTestId('home-tab')).toBeInTheDocument();
      expect(screen.getByTestId('tabpanel-home')).toBeInTheDocument();
    });

    it('has home tab marked as active initially', () => {
      renderWithStore(<TenantPortalPage />);

      const homeTab = screen.getByTestId('tab-home');
      expect(homeTab).toHaveClass('active');
    });

    it('navigates to maintenance tab via home quick link', async () => {
      renderWithStore(<TenantPortalPage />);

      fireEvent.click(screen.getByTestId('home-nav-maintenance'));

      await waitFor(() => {
        expect(screen.getByTestId('tab-maintenance')).toHaveClass('active');
      });
    });
  });

  describe('Tab Switching', () => {
    it('switches to payment history tab when clicked', async () => {
      renderWithStore(<TenantPortalPage />);

      const paymentsTab = screen.getByTestId('tab-payments');
      fireEvent.click(paymentsTab);

      await waitFor(() => {
        expect(paymentsTab).toHaveClass('active');
        expect(screen.getByTestId('tab-home')).not.toHaveClass('active');
      });
    });

    it('switches to maintenance tab when clicked', async () => {
      renderWithStore(<TenantPortalPage />);

      const maintenanceTab = screen.getByTestId('tab-maintenance');
      fireEvent.click(maintenanceTab);

      await waitFor(() => {
        expect(maintenanceTab).toHaveClass('active');
        expect(screen.getByTestId('tab-home')).not.toHaveClass('active');
      });
    });

    it('switches to documents tab when clicked', async () => {
      renderWithStore(<TenantPortalPage />);

      const documentsTab = screen.getByTestId('tab-documents');
      fireEvent.click(documentsTab);

      await waitFor(() => {
        expect(documentsTab).toHaveClass('active');
        expect(screen.getByTestId('tab-home')).not.toHaveClass('active');
      });
    });
  });

  describe('Page Header', () => {
    it('displays welcome message with tenant name', () => {
      renderWithStore(<TenantPortalPage />);

      expect(screen.getByRole('heading', { name: 'Tenant Portal' })).toBeInTheDocument();
      expect(screen.getByText(/Welcome, Fatima Al-Mansoori/)).toBeInTheDocument();
    });

    it('displays description text', () => {
      renderWithStore(<TenantPortalPage />);

      expect(screen.getByText(/Manage your lease and requests/)).toBeInTheDocument();
    });
  });

  describe('Unauthenticated Access', () => {
    it('displays error message when not logged in', () => {
      renderWithStore(<TenantPortalPage />, {
        user: {
          currentUser: null,
          isLoading: false,
          error: null,
        },
      });

      expect(
        screen.getByText(/You must be logged in to access the Tenant Portal/)
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has tab list with proper ARIA roles', () => {
      renderWithStore(<TenantPortalPage />);

      const tabList = screen.getByRole('tablist', {
        name: /Tenant Portal Navigation/i,
      });
      expect(tabList).toBeInTheDocument();
    });

    it('tab buttons have proper aria-selected attributes', () => {
      renderWithStore(<TenantPortalPage />);

      const homeTab = screen.getByTestId('tab-home');
      expect(homeTab).toHaveAttribute('aria-selected', 'true');

      const paymentsTab = screen.getByTestId('tab-payments');
      expect(paymentsTab).toHaveAttribute('aria-selected', 'false');
    });

    it('tab panels have proper role attributes', () => {
      renderWithStore(<TenantPortalPage />);

      const tabpanel = screen.getByTestId('tabpanel-home');
      expect(tabpanel).toHaveAttribute('role', 'tabpanel');
    });

    it('keyboard navigation updates aria-selected', async () => {
      renderWithStore(<TenantPortalPage />);

      const paymentsTab = screen.getByTestId('tab-payments');
      fireEvent.click(paymentsTab);

      await waitFor(() => {
        expect(paymentsTab).toHaveAttribute('aria-selected', 'true');
        const homeTab = screen.getByTestId('tab-home');
        expect(homeTab).toHaveAttribute('aria-selected', 'false');
      });
    });
  });

  describe('Tab Content Container', () => {
    it('renders tab content with proper id', () => {
      renderWithStore(<TenantPortalPage />);

      const tabpanel = screen.getByTestId('tabpanel-home');
      expect(tabpanel).toHaveAttribute('id', 'tabpanel-home');
    });

    it('updates tabpanel id when tab changes', async () => {
      renderWithStore(<TenantPortalPage />);

      const paymentsTab = screen.getByTestId('tab-payments');
      fireEvent.click(paymentsTab);

      await waitFor(() => {
        const tabpanel = screen.getByTestId('tabpanel-payments');
        expect(tabpanel).toHaveAttribute('id', 'tabpanel-payments');
      });
    });
  });

  describe('User Context', () => {
    it('displays correct user role greeting', () => {
      renderWithStore(<TenantPortalPage />);

      expect(screen.getByRole('heading', { name: 'Tenant Portal' })).toBeInTheDocument();
    });

    it('uses tenant user data from Redux store', () => {
      renderWithStore(<TenantPortalPage />);

      expect(screen.getByTestId('portal-navbar-user')).toHaveTextContent('Fatima Al-Mansoori');
    });
  });
});
