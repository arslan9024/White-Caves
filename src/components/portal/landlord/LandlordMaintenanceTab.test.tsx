/**
 * LandlordMaintenanceTab.test.tsx
 * Tests for Phase 2.5: Maintenance Requests tab
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import LandlordMaintenanceTab from './LandlordMaintenanceTab';
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

describe('LandlordMaintenanceTab', () => {
  describe('Header and Summary', () => {
    it('renders page header text', () => {
      renderWithStore(<LandlordMaintenanceTab />);

      expect(screen.getByText('Maintenance Requests')).toBeInTheDocument();
      expect(screen.getByText(/Track requests submitted by tenants/i)).toBeInTheDocument();
    });

    it('renders summary counts correctly', () => {
      renderWithStore(<LandlordMaintenanceTab />);

      expect(screen.getByTestId('summary-total-requests')).toHaveTextContent('4');
      expect(screen.getByTestId('summary-open-requests')).toHaveTextContent('2');
      expect(screen.getByTestId('summary-inprogress-requests')).toHaveTextContent('1');
      expect(screen.getByTestId('summary-closed-requests')).toHaveTextContent('1');
    });
  });

  describe('Request List', () => {
    it('renders all maintenance requests by default', () => {
      renderWithStore(<LandlordMaintenanceTab />);

      expect(screen.getByTestId('maintenance-row-req-001')).toBeInTheDocument();
      expect(screen.getByTestId('maintenance-row-req-002')).toBeInTheDocument();
      expect(screen.getByTestId('maintenance-row-req-003')).toBeInTheDocument();
      expect(screen.getByTestId('maintenance-row-req-004')).toBeInTheDocument();
    });

    it('renders request statuses and priorities', () => {
      renderWithStore(<LandlordMaintenanceTab />);

      expect(screen.getAllByText('open').length).toBeGreaterThan(0);
      expect(screen.getAllByText('in-progress').length).toBeGreaterThan(0);
      expect(screen.getAllByText('closed').length).toBeGreaterThan(0);
      expect(screen.getAllByText(/high priority/i).length).toBeGreaterThan(0);
    });
  });

  describe('Search and Filters', () => {
    it('filters by search query', async () => {
      renderWithStore(<LandlordMaintenanceTab />);

      fireEvent.change(screen.getByTestId('maintenance-search'), {
        target: { value: 'Kitchen sink leakage' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('maintenance-row-req-002')).toBeInTheDocument();
        expect(screen.queryByTestId('maintenance-row-req-001')).not.toBeInTheDocument();
      });
    });

    it('filters by status', async () => {
      renderWithStore(<LandlordMaintenanceTab />);

      fireEvent.change(screen.getByTestId('maintenance-status-filter'), {
        target: { value: 'closed' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('maintenance-row-req-003')).toBeInTheDocument();
        expect(screen.queryByTestId('maintenance-row-req-001')).not.toBeInTheDocument();
      });
    });

    it('filters by priority', async () => {
      renderWithStore(<LandlordMaintenanceTab />);

      fireEvent.change(screen.getByTestId('maintenance-priority-filter'), {
        target: { value: 'high' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('maintenance-row-req-001')).toBeInTheDocument();
        expect(screen.getByTestId('maintenance-row-req-004')).toBeInTheDocument();
        expect(screen.queryByTestId('maintenance-row-req-003')).not.toBeInTheDocument();
      });
    });

    it('supports combined status + search filters', async () => {
      renderWithStore(<LandlordMaintenanceTab />);

      fireEvent.change(screen.getByTestId('maintenance-status-filter'), {
        target: { value: 'open' },
      });
      fireEvent.change(screen.getByTestId('maintenance-search'), {
        target: { value: 'Water heater' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('maintenance-row-req-004')).toBeInTheDocument();
        expect(screen.queryByTestId('maintenance-row-req-001')).not.toBeInTheDocument();
      });
    });

    it('shows empty state for unmatched filters', async () => {
      renderWithStore(<LandlordMaintenanceTab />);

      fireEvent.change(screen.getByTestId('maintenance-search'), {
        target: { value: 'this text does not exist' },
      });

      await waitFor(() => {
        expect(screen.getByTestId('maintenance-empty-state')).toBeInTheDocument();
      });
    });
  });

  describe('Details Modal and Notes', () => {
    it('opens details modal when a request row is clicked', async () => {
      renderWithStore(<LandlordMaintenanceTab />);

      fireEvent.click(screen.getByTestId('maintenance-row-req-001'));

      await waitFor(() => {
        expect(screen.getByTestId('maintenance-detail-modal')).toBeInTheDocument();
      });
    });

    it('renders detailed maintenance request data in modal', async () => {
      renderWithStore(<LandlordMaintenanceTab />);

      fireEvent.click(screen.getByTestId('maintenance-row-req-002'));

      await waitFor(() => {
        const modal = screen.getByTestId('maintenance-detail-modal');
        expect(within(modal).getByText(/Maintenance Request Details/i)).toBeInTheDocument();
        expect(within(modal).getByText(/req-002/i)).toBeInTheDocument();
        expect(within(modal).getByText(/Kitchen sink leakage/i)).toBeInTheDocument();
        expect(within(modal).getByText(/Downtown Studio/i)).toBeInTheDocument();
      });
    });

    it('allows landlord to add note text', async () => {
      renderWithStore(<LandlordMaintenanceTab />);

      fireEvent.click(screen.getByTestId('maintenance-row-req-001'));

      await waitFor(() => {
        expect(screen.getByTestId('maintenance-note-input')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('maintenance-note-input'), {
        target: { value: 'Technician scheduled for tomorrow at 9 AM.' },
      });

      expect(
        screen.getByDisplayValue('Technician scheduled for tomorrow at 9 AM.')
      ).toBeInTheDocument();
    });

    it('closes modal when close button is clicked', async () => {
      renderWithStore(<LandlordMaintenanceTab />);

      fireEvent.click(screen.getByTestId('maintenance-row-req-001'));
      await waitFor(() => {
        expect(screen.getByTestId('maintenance-detail-modal')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByLabelText('Close maintenance details'));

      await waitFor(() => {
        expect(screen.queryByTestId('maintenance-detail-modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Authentication', () => {
    it('shows login required message for unauthenticated users', () => {
      renderWithStore(<LandlordMaintenanceTab />, {
        user: {
          currentUser: null,
          isLoading: false,
          error: null,
        },
      });

      expect(
        screen.getByText(/You must be logged in to view maintenance requests/i)
      ).toBeInTheDocument();
    });
  });
});
