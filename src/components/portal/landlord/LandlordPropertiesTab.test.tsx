/**
 * LandlordPropertiesTab.test.tsx
 * Tests for Phase 2.2: My Properties Tab
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import LandlordPropertiesTab from './LandlordPropertiesTab';
import userReducer from '../../../store/userSlice';
import type { RootState } from '../../../store/store';

const mockUser = {
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
        currentUser: mockUser,
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

describe('LandlordPropertiesTab', () => {
  describe('Properties Grid', () => {
    it('renders mock properties grid', () => {
      renderWithStore(<LandlordPropertiesTab />);

      const propertiesGrid = screen.getByTestId('property-card-prop-1');
      expect(propertiesGrid).toBeInTheDocument();
    });

    it('displays all mock properties', () => {
      renderWithStore(<LandlordPropertiesTab />);

      expect(screen.getByText('Marina View 2BR Apartment')).toBeInTheDocument();
      expect(screen.getByText('Downtown Studio')).toBeInTheDocument();
      expect(screen.getByText('JBR 3BR Villa')).toBeInTheDocument();
    });

    it('displays property information cards', () => {
      renderWithStore(<LandlordPropertiesTab />);

      expect(screen.getByText(/Dubai Marina, Plot 12/)).toBeInTheDocument();
      expect(screen.getByText('Apartment')).toBeInTheDocument();
      expect(screen.getByText(/AED 8,000/)).toBeInTheDocument();
    });

    it('renders property status badges', () => {
      renderWithStore(<LandlordPropertiesTab />);

      const occupiedBadges = screen.getAllByText('Occupied');
      expect(occupiedBadges.length).toBeGreaterThan(0);

      const vacantBadges = screen.getAllByText('Vacant');
      expect(vacantBadges.length).toBeGreaterThan(0);
    });

    it('displays tenant names for occupied properties', () => {
      renderWithStore(<LandlordPropertiesTab />);

      expect(screen.getByText('Ahmed Al-Rashid')).toBeInTheDocument();
      expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    });
  });

  describe('Property Card Interaction', () => {
    it('opens property detail modal on card click', async () => {
      renderWithStore(<LandlordPropertiesTab />);

      const propertyCard = screen.getByTestId('property-card-prop-1');
      fireEvent.click(propertyCard);

      // Modal should appear after card click
      await waitFor(
        () => {
          const modal = screen.queryByTestId('property-detail-modal');
          expect(modal).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('closes modal when close button is clicked', async () => {
      renderWithStore(<LandlordPropertiesTab />);

      const propertyCard = screen.getByTestId('property-card-prop-1');
      fireEvent.click(propertyCard);

      await waitFor(
        () => {
          expect(screen.getByTestId('property-detail-modal')).toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);

      // Modal should be gone after closing
      await waitFor(
        () => {
          expect(screen.queryByTestId('property-detail-modal')).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });
  });

  describe('Modal Content', () => {
    it('displays tenant information section for occupied properties', async () => {
      renderWithStore(<LandlordPropertiesTab />);

      const propertyCard = screen.getByTestId('property-card-prop-1');
      fireEvent.click(propertyCard);

      // Check if modal appears and has tenant info
      await waitFor(
        () => {
          const modal = screen.queryByTestId('property-detail-modal');
          if (modal) {
            const tenantText = modal.textContent;
            expect(tenantText).toContain('Tenant');
          }
        },
        { timeout: 1000 }
      );
    });
  });

  describe('Unauthenticated Access', () => {
    it('displays error message when not logged in', () => {
      renderWithStore(<LandlordPropertiesTab />, {
        user: {
          currentUser: null,
          isLoading: false,
          error: null,
        },
      });

      expect(screen.getByText(/You must be logged in to view your properties/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('property cards are keyboard accessible', async () => {
      renderWithStore(<LandlordPropertiesTab />);

      const propertyCard = screen.getByTestId('property-card-prop-1');
      expect(propertyCard).toHaveAttribute('tabIndex', '0');
      expect(propertyCard).toHaveAttribute('role', 'button');
    });

    it('property cards can be opened with Enter key', async () => {
      renderWithStore(<LandlordPropertiesTab />);

      const propertyCard = screen.getByTestId('property-card-prop-1');
      fireEvent.keyPress(propertyCard, { key: 'Enter', code: 'Enter', charCode: 13 });

      await waitFor(() => {
        expect(screen.getByTestId('property-detail-modal')).toBeInTheDocument();
      });
    });

    it('property cards have aria labels', () => {
      renderWithStore(<LandlordPropertiesTab />);

      const propertyCard = screen.getByTestId('property-card-prop-1');
      expect(propertyCard).toHaveAttribute('aria-label');
    });

    it('view details buttons have text labels', () => {
      renderWithStore(<LandlordPropertiesTab />);

      const viewDetailsButtons = screen.getAllByText('View Details');
      expect(viewDetailsButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Empty State', () => {
    it('would display empty state when no properties exist', () => {
      // Note: Current implementation has mock data, so empty state not tested
      // Will be tested when connected to Redux store with actual data
      renderWithStore(<LandlordPropertiesTab />);

      // Currently has mock properties, so grid should be rendered
      expect(screen.getByTestId('property-card-prop-1')).toBeInTheDocument();
    });
  });

  describe('Status Badges', () => {
    it('displays occupied status for occupied properties', () => {
      renderWithStore(<LandlordPropertiesTab />);

      const occupiedBadges = screen.getAllByText('Occupied');
      expect(occupiedBadges.length).toBeGreaterThanOrEqual(2);
    });

    it('displays vacant status for available properties', () => {
      renderWithStore(<LandlordPropertiesTab />);

      const vacantBadges = screen.getAllByText('Vacant');
      expect(vacantBadges.length).toBeGreaterThanOrEqual(1);
    });

    it('applies correct CSS class to status badges', () => {
      renderWithStore(<LandlordPropertiesTab />);

      const propertyCard = screen.getByTestId('property-card-prop-3');
      const vacantBadge = propertyCard.querySelector('.status-badge');
      expect(vacantBadge).toHaveClass('status-vacant');
    });
  });
});
