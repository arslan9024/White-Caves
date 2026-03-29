/**
 * PropertiesPage — Unit Tests
 * Tests: rendering, search, view toggle, loading/empty states,
 * property cards, favorites, modal, API integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks ────────────────────────────────────────────────────────

vi.mock('../components/layout/AppLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-layout">{children}</div>
  ),
}));

vi.mock('../components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('../components/WhatsAppButton', () => ({
  default: () => <div data-testid="whatsapp-btn">WhatsApp</div>,
}));

// Mock the async thunk so it resolves immediately without hitting the network
const mockAuthFetchForProperties = vi.fn();
vi.mock('../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetchForProperties(...args),
}));

vi.mock('../shared/components/property', () => ({
  PropertyImageSlider: ({ images }: { images: string[] }) => (
    <div data-testid="image-slider">{images?.length ?? 0} images</div>
  ),
  PropertyDetailModal: ({ property, onClose, isFavorite, onFavorite }: Record<string, unknown>) => (
    <div data-testid="property-modal">
      <span>{(property as Record<string, unknown>)?.title as string}</span>
      <button onClick={onClose as () => void} data-testid="modal-close">Close</button>
      <button onClick={onFavorite as () => void} data-testid="modal-favorite">
        {isFavorite ? 'Unfavorite' : 'Favorite'}
      </button>
    </div>
  ),
}));

import PropertiesPage from './PropertiesPage';
import crmDataReducer from '../store/crmDataSlice';
import dashboardReducer from '../store/dashboardSlice';
import userReducer from '../store/userSlice';
import navigationReducer from '../store/navigationSlice';
import authReducer from '../store/authSlice';

// ── Helpers ──────────────────────────────────────────────────────

const MOCK_PROPERTIES = [
  { id: 'p1', title: 'Palm Villa', location: 'Palm Jumeirah', type: 'Villa', purpose: 'buy', bedrooms: 4, bathrooms: 3, sqft: 5000, price: 8000000, images: ['img1.jpg'], featured: true },
  { id: 'p2', title: 'Marina Apartment', location: 'Dubai Marina', type: 'Apartment', purpose: 'rent', bedrooms: 2, bathrooms: 2, sqft: 1200, price: 150000, images: ['img2.jpg'], featured: false },
  { id: 'p3', title: 'Downtown Penthouse', location: 'Downtown Dubai', type: 'Penthouse', purpose: 'buy', bedrooms: 3, bathrooms: 3, sqft: 3500, price: 12000000, images: [], featured: true },
];

const createMockStore = (crmOverrides: Record<string, unknown> = {}) => {
  return configureStore({
    reducer: {
      crmData: crmDataReducer,
      dashboard: dashboardReducer,
      user: userReducer,
      navigation: navigationReducer,
      auth: authReducer,
    },
    preloadedState: {
      crmData: {
        leads: { items: [], selected: null, loading: false, error: null },
        clients: { items: [], selected: null, loading: false, error: null },
        agents: { items: [], selected: null, loading: false, error: null },
        properties: {
          items: MOCK_PROPERTIES,
          selected: null,
          loading: false,
          error: null,
        },
        commissions: { items: [], loading: false, error: null },
        activities: { items: [], loading: false, error: null },
        overview: null,
        lastUpdated: new Date().toISOString(),
        ...crmOverrides,
      } as ReturnType<typeof crmDataReducer>,
      user: {
        currentUser: null,
        loading: false,
        error: null,
      } as ReturnType<typeof userReducer>,
      auth: {
        user: null,
        token: 'tok',
        refreshToken: null,
        session: { isLoggedIn: false, lastActive: null, sessions: [], expiresAt: null, activeSessionId: null },
        loginMethods: { social: false, email: false, mobile: false },
        loginProvider: null,
        rememberMe: false,
        sessionTimeout: 30,
        loading: false,
        error: null,
      } as ReturnType<typeof authReducer>,
    },
  });
};

const renderPage = (crmOverrides: Record<string, unknown> = {}) => {
  const store = createMockStore(crmOverrides);
  return { store, ...render(
    <Provider store={store}>
      <MemoryRouter>
        <PropertiesPage />
      </MemoryRouter>
    </Provider>,
  )};
};

// ── Tests ────────────────────────────────────────────────────────

describe('PropertiesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: API returns the mock properties
    mockAuthFetchForProperties.mockResolvedValue({
      ok: true,
      json: async () => ({ data: MOCK_PROPERTIES }),
    });
  });

  // ── Rendering ────────────────────────────────────────────────

  describe('Rendering', () => {
    it('should render inside AppLayout', () => {
      renderPage();
      expect(screen.getByTestId('app-layout')).toBeInTheDocument();
    });

    it('should render hero section', () => {
      renderPage();
      expect(screen.getByText('Find Your Dream Property')).toBeInTheDocument();
      expect(screen.getByText('Browse our exclusive collection of properties across Dubai')).toBeInTheDocument();
    });

    it('should render search bar', () => {
      renderPage();
      expect(screen.getByPlaceholderText('Search properties by location, type, or price...')).toBeInTheDocument();
    });

    it('should render view toggle buttons', () => {
      renderPage();
      const buttons = document.querySelectorAll('.view-btn');
      expect(buttons.length).toBe(2);
    });

    it('should render Footer', () => {
      renderPage();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  // ── Property Cards ───────────────────────────────────────────

  describe('Property Cards', () => {
    it('should render property titles', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Palm Villa')).toBeInTheDocument();
      });
      expect(screen.getByText('Marina Apartment')).toBeInTheDocument();
      expect(screen.getByText('Downtown Penthouse')).toBeInTheDocument();
    });

    it('should render property locations', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Palm Jumeirah')).toBeInTheDocument();
      });
      expect(screen.getByText('Dubai Marina')).toBeInTheDocument();
      expect(screen.getByText('Downtown Dubai')).toBeInTheDocument();
    });

    it('should render bed counts', async () => {
      renderPage();
      await waitFor(() => {
        const beds = screen.getAllByText(/Beds/);
        expect(beds.length).toBe(3);
      });
    });

    it('should render bath counts', async () => {
      renderPage();
      await waitFor(() => {
        const baths = screen.getAllByText(/Baths/);
        expect(baths.length).toBe(3);
      });
    });

    it('should render sqft', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText(/5,000 sqft/)).toBeInTheDocument();
      });
      expect(screen.getByText(/1,200 sqft/)).toBeInTheDocument();
    });
  });

  // ── Search ───────────────────────────────────────────────────

  describe('Search', () => {
    it('should filter properties by search term', async () => {
      renderPage();
      // Wait for loading to finish
      await waitFor(() => {
        expect(screen.getByText('Palm Villa')).toBeInTheDocument();
      });
      const input = screen.getByPlaceholderText('Search properties by location, type, or price...');
      fireEvent.change(input, { target: { value: 'Palm' } });

      expect(screen.getByText('Palm Villa')).toBeInTheDocument();
      expect(screen.queryByText('Marina Apartment')).not.toBeInTheDocument();
      expect(screen.queryByText('Downtown Penthouse')).not.toBeInTheDocument();
    });

    it('should filter by location', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Marina Apartment')).toBeInTheDocument();
      });
      const input = screen.getByPlaceholderText('Search properties by location, type, or price...');
      fireEvent.change(input, { target: { value: 'Marina' } });

      expect(screen.getByText('Marina Apartment')).toBeInTheDocument();
      expect(screen.queryByText('Palm Villa')).not.toBeInTheDocument();
    });

    it('should filter by type', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Downtown Penthouse')).toBeInTheDocument();
      });
      const input = screen.getByPlaceholderText('Search properties by location, type, or price...');
      fireEvent.change(input, { target: { value: 'Penthouse' } });

      expect(screen.getByText('Downtown Penthouse')).toBeInTheDocument();
      expect(screen.queryByText('Palm Villa')).not.toBeInTheDocument();
    });

    it('should show empty state when no properties match', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Palm Villa')).toBeInTheDocument();
      });
      const input = screen.getByPlaceholderText('Search properties by location, type, or price...');
      fireEvent.change(input, { target: { value: 'nonexistent xyz' } });

      expect(screen.getByText('No Properties Found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search terms.')).toBeInTheDocument();
    });

    it('should be case-insensitive', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Palm Villa')).toBeInTheDocument();
      });
      const input = screen.getByPlaceholderText('Search properties by location, type, or price...');
      fireEvent.change(input, { target: { value: 'palm villa' } });

      expect(screen.getByText('Palm Villa')).toBeInTheDocument();
    });
  });

  // ── Loading / Empty States ───────────────────────────────────

  describe('Loading & Empty States', () => {
    it('should show loading state initially before API resolves', () => {
      renderPage({
        properties: { items: [], selected: null, loading: false, error: null },
      });
      // The dispatch of fetchPropertiesFromAPI triggers pending → loading=true
      expect(screen.getByText(/Loading properties/)).toBeInTheDocument();
    });

    it('should show empty state when no properties exist after loading completes', async () => {
      // Mock API to return empty
      mockAuthFetchForProperties.mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      });
      renderPage({
        properties: { items: [], selected: null, loading: false, error: null },
      });
      // Wait for fetchPropertiesFromAPI to resolve (mocked to return empty data)
      await waitFor(() => {
        expect(screen.getByText('No Properties Found')).toBeInTheDocument();
      });
      expect(screen.getByText('Properties will appear here once they are listed.')).toBeInTheDocument();
    });
  });

  // ── Property Detail Modal ────────────────────────────────────

  describe('Property Detail Modal', () => {
    it('should open modal when property is clicked', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Palm Villa')).toBeInTheDocument();
      });
      const propertyCard = screen.getByText('Palm Villa').closest('.property-item');
      fireEvent.click(propertyCard!);
      expect(screen.getByTestId('property-modal')).toBeInTheDocument();
    });

    it('should close modal when close button is clicked', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Palm Villa')).toBeInTheDocument();
      });
      const propertyCard = screen.getByText('Palm Villa').closest('.property-item');
      fireEvent.click(propertyCard!);
      fireEvent.click(screen.getByTestId('modal-close'));
      expect(screen.queryByTestId('property-modal')).not.toBeInTheDocument();
    });
  });

  // ── View Toggle ──────────────────────────────────────────────

  describe('View Toggle', () => {
    it('should default to grid view', async () => {
      renderPage();
      await waitFor(() => {
        const gridContainer = document.querySelector('.properties-grid.grid');
        expect(gridContainer).toBeTruthy();
      });
    });

    it('should switch to list view', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Palm Villa')).toBeInTheDocument();
      });
      const listBtn = document.querySelectorAll('.view-btn')[1];
      fireEvent.click(listBtn!);
      const listContainer = document.querySelector('.properties-grid.list');
      expect(listContainer).toBeTruthy();
    });
  });
});
