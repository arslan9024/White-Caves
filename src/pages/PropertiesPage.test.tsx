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

// Mock PropertyFilterPanel to simplify PropertiesPage tests
vi.mock('./properties/PropertyFilterPanel', () => ({
  default: ({ resultCount, totalCount }: { resultCount: number; totalCount: number }) => (
    <div data-testid="filter-panel">
      <span data-testid="result-count">{resultCount}</span>
      <span data-testid="total-count">{totalCount}</span>
    </div>
  ),
}));

// Mock InteractiveMap (lazy-loaded)
vi.mock('../components/maps/InteractiveMap', () => ({
  default: () => <div data-testid="interactive-map-mock">Map</div>,
}));

// Mock leaflet CSS import
vi.mock('leaflet/dist/leaflet.css', () => ({}));

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
import propertyReducer from '../store/propertySlice';

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
      properties: propertyReducer,
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
      } as unknown as ReturnType<typeof userReducer>,
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
      expect(screen.getByText('Discover Luxury Properties')).toBeInTheDocument();
      expect(screen.getByText(/Browse our exclusive collection/)).toBeInTheDocument();
    });

    it('should render filter panel', () => {
      renderPage();
      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    it('should render view toggle buttons', () => {
      renderPage();
      const buttons = document.querySelectorAll('.view-btn');
      expect(buttons.length).toBe(3); // grid, list, map
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

  describe('Filter Panel Integration', () => {
    it('should pass result counts to filter panel', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Palm Villa')).toBeInTheDocument();
      });
      expect(screen.getByTestId('result-count')).toBeInTheDocument();
      expect(screen.getByTestId('total-count')).toBeInTheDocument();
    });
  });

  // ── Loading / Empty States ───────────────────────────────────

  describe('Loading & Empty States', () => {
    it('should show loading state when loading is true', () => {
      // Use a never-resolving promise so loading stays true
      mockAuthFetchForProperties.mockReturnValue(new Promise(() => {}));
      renderPage({
        properties: { items: [], selected: null, loading: true, error: null },
      });
      expect(screen.getByText(/Loading properties/)).toBeInTheDocument();
    });

    it('should show empty state when no properties exist after loading completes', async () => {
      mockAuthFetchForProperties.mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      });
      renderPage({
        properties: { items: [], selected: null, loading: false, error: null },
      });
      await waitFor(() => {
        expect(screen.getByText('No Properties Found')).toBeInTheDocument();
      });
      expect(screen.getByText('Try adjusting your filters or search criteria.')).toBeInTheDocument();
    });
  });

  // ── Property Detail Modal ────────────────────────────────────

  describe('Property Detail Modal', () => {
    it('should open modal when property is clicked', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Palm Villa')).toBeInTheDocument();
      });
      const propertyCard = screen.getByText('Palm Villa').closest('.property-card-enhanced');
      fireEvent.click(propertyCard!);
      expect(screen.getByTestId('property-modal')).toBeInTheDocument();
    });

    it('should close modal when close button is clicked', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Palm Villa')).toBeInTheDocument();
      });
      const propertyCard = screen.getByText('Palm Villa').closest('.property-card-enhanced');
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

    it('should switch to map view', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Palm Villa')).toBeInTheDocument();
      });
      const mapBtn = document.querySelectorAll('.view-btn')[2];
      fireEvent.click(mapBtn!);
      // Map view hides the grid
      const grid = document.querySelector('.properties-grid');
      expect(grid?.getAttribute('style')).toContain('display: none');
    });
  });
});
