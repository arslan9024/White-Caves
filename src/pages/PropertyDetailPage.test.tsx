/**
 * PropertyDetailPage — Unit Tests
 * Tests: rendering, loading, not-found, breadcrumb, gallery,
 * specs, contact CTA, share/favorite buttons, similar properties
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// ── Mocks ────────────────────────────────────────────────────────

vi.mock('../components/layout/PublicLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-layout">
      {children}
      <div data-testid="footer">Footer</div>
    </div>
  ),
}));

vi.mock('../components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('../shared/components/property', () => ({
  PropertyImageSlider: ({ images, title }: { images: string[]; title: string }) => (
    <div data-testid="image-slider" data-count={images?.length ?? 0}>
      {title}
    </div>
  ),
  PropertyDetailModal: () => null,
}));

vi.mock('../components/maps/DubaiMap', () => ({
  default: () => <div data-testid="detail-map">Map</div>,
}));

vi.mock('leaflet/dist/leaflet.css', () => ({}));

const mockAuthFetch = vi.fn();
vi.mock('../utils/authFetch', () => ({
  authFetch: (...args: unknown[]) => mockAuthFetch(...args),
}));

import PropertyDetailPage from './PropertyDetailPage';
import crmDataReducer from '../store/crmDataSlice';
import dashboardReducer from '../store/dashboardSlice';
import userReducer from '../store/userSlice';
import navigationReducer from '../store/navigationSlice';
import authReducer from '../store/authSlice';
import propertyReducer from '../store/propertySlice';

// ── Helpers ──────────────────────────────────────────────────────

const MOCK_PROPERTIES = [
  { id: 'p1', title: 'Palm Villa', location: 'Palm Jumeirah', type: 'Villa', purpose: 'buy', bedrooms: 4, bathrooms: 3, sqft: 5000, price: 8000000, images: ['img1.jpg', 'img2.jpg'], featured: true, amenities: ['Pool', 'Gym', 'Garden'] },
  { id: 'p2', title: 'Marina Apartment', location: 'Dubai Marina', type: 'Apartment', purpose: 'rent', bedrooms: 2, bathrooms: 2, sqft: 1200, price: 150000, images: ['img3.jpg'], featured: false, amenities: [] },
  { id: 'p3', title: 'Marina Penthouse', location: 'Dubai Marina', type: 'Penthouse', purpose: 'buy', bedrooms: 3, bathrooms: 3, sqft: 3500, price: 12000000, images: [], featured: true, amenities: ['Private Elevator'] },
];

const createStore = () =>
  configureStore({
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
        properties: { items: MOCK_PROPERTIES, selected: null, loading: false, error: null },
        commissions: { items: [], loading: false, error: null },
        activities: { items: [], loading: false, error: null },
        overview: null,
        lastUpdated: new Date().toISOString(),
      } as unknown as ReturnType<typeof crmDataReducer>,
      user: { currentUser: null, loading: false, error: null } as unknown as ReturnType<typeof userReducer>,
      auth: {
        user: null,
        token: null,
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

const renderPage = (propertyId: string = 'p1') => {
  const store = createStore();
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/property/${propertyId}`]}>
          <Routes>
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/properties" element={<div>Listings Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    ),
  };
};

// ── Tests ────────────────────────────────────────────────────────

describe('PropertyDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    try { window.localStorage.removeItem('white-caves-favorites'); } catch { /* noop */ }
    mockAuthFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: MOCK_PROPERTIES }),
    });
  });

  // ── Rendering ──────────────────────────────────────────────────

  describe('Rendering', () => {
    it('should render inside AppLayout', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('app-layout')).toBeInTheDocument();
      });
    });

    it('should render property title', async () => {
      renderPage('p1');
      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Palm Villa');
      });
    });

    it('should render breadcrumb with location', async () => {
      renderPage('p1');
      await waitFor(() => {
        const breadcrumb = screen.getByRole('navigation', { name: /breadcrumb/i });
        expect(breadcrumb).toHaveTextContent('Palm Jumeirah');
      });
    });

    it('should render formatted price', async () => {
      renderPage('p1');
      await waitFor(() => {
        expect(screen.getByText('AED 8,000,000')).toBeInTheDocument();
      });
    });

    it('should render footer', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('footer')).toBeInTheDocument();
      });
    });

    it('should opt into the Dubai Luxury theme cascade', async () => {
      renderPage('p1');
      await waitFor(() => {
        expect(screen.getByTestId('property-detail-page')).toHaveClass('dubai-luxury-theme');
      });
    });
  });

  // ── Specs ──────────────────────────────────────────────────────

  describe('Property Specs', () => {
    it('should render bedroom count', async () => {
      renderPage('p1');
      await waitFor(() => {
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('Bedrooms')).toBeInTheDocument();
      });
    });

    it('should render bathroom count', async () => {
      renderPage('p1');
      await waitFor(() => {
        expect(screen.getByText('Bathrooms')).toBeInTheDocument();
      });
    });

    it('should render sqft', async () => {
      renderPage('p1');
      await waitFor(() => {
        expect(screen.getByText('5,000')).toBeInTheDocument();
        expect(screen.getByText('Sq Ft')).toBeInTheDocument();
      });
    });

    it('should render property type', async () => {
      renderPage('p1');
      await waitFor(() => {
        // Villa appears in type badge and specs
        const villas = screen.getAllByText('Villa');
        expect(villas.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  // ── Badges ─────────────────────────────────────────────────────

  describe('Badges', () => {
    it('should show Featured badge for featured property', async () => {
      renderPage('p1');
      await waitFor(() => {
        expect(screen.getByText('Featured')).toBeInTheDocument();
      });
    });

    it('should show For Sale badge for buy purpose', async () => {
      renderPage('p1');
      await waitFor(() => {
        expect(screen.getByText('For Sale')).toBeInTheDocument();
      });
    });

    it('should show For Rent badge for rent purpose', async () => {
      renderPage('p2');
      await waitFor(() => {
        expect(screen.getByText('For Rent')).toBeInTheDocument();
      });
    });
  });

  // ── Amenities ──────────────────────────────────────────────────

  describe('Amenities', () => {
    it('should render amenities for property with amenities', async () => {
      renderPage('p1');
      await waitFor(() => {
        expect(screen.getByText('Pool')).toBeInTheDocument();
        expect(screen.getByText('Gym')).toBeInTheDocument();
        expect(screen.getByText('Garden')).toBeInTheDocument();
      });
    });

    it('should not render amenities section if none', async () => {
      renderPage('p2');
      await waitFor(() => {
        // p2 has no amenities but should still render
        const title = screen.getByRole('heading', { level: 1 });
        expect(title).toHaveTextContent('Marina Apartment');
      });
      expect(screen.queryByText('Amenities & Features')).not.toBeInTheDocument();
    });
  });

  // ── Contact ────────────────────────────────────────────────────

  describe('Contact Agent', () => {
    it('should render contact buttons', async () => {
      renderPage('p1');
      await waitFor(() => {
        expect(screen.getByText('WhatsApp')).toBeInTheDocument();
        expect(screen.getByText('Call Agent')).toBeInTheDocument();
        expect(screen.getByText('Send Email')).toBeInTheDocument();
      });
    });
  });

  // ── Action Buttons ─────────────────────────────────────────────

  describe('Action Buttons', () => {
    it('should render save, share, copy, print buttons', async () => {
      renderPage('p1');
      await waitFor(() => {
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('Share')).toBeInTheDocument();
        expect(screen.getByText('Copy Link')).toBeInTheDocument();
        expect(screen.getByText('Print')).toBeInTheDocument();
      });
    });

    it('should render back to listings button', async () => {
      renderPage('p1');
      await waitFor(() => {
        expect(screen.getByText('Back to Listings')).toBeInTheDocument();
      });
    });
  });

  // ── Not Found ──────────────────────────────────────────────────

  describe('Not Found', () => {
    it('should show not found for non-existent property', async () => {
      renderPage('nonexistent-id');
      await waitFor(() => {
        expect(screen.getByText('Property Not Found')).toBeInTheDocument();
      });
    });
  });

  // ── Similar Properties ─────────────────────────────────────────

  describe('Similar Properties', () => {
    it('should show similar properties from same location', async () => {
      // p2 and p3 are both in Dubai Marina — p2 should show p3 as similar
      renderPage('p2');
      await waitFor(() => {
        expect(screen.getByText('Similar Properties')).toBeInTheDocument();
        expect(screen.getByText('Marina Penthouse')).toBeInTheDocument();
      });
    });
  });

  // ── Gallery ────────────────────────────────────────────────────

  describe('Gallery', () => {
    it('should render PropertyImageSlider with images', async () => {
      renderPage('p1');
      await waitFor(() => {
        const slider = screen.getByTestId('image-slider');
        expect(slider).toBeInTheDocument();
        expect(slider.dataset.count).toBe('2'); // p1 has 2 images
      });
    });
  });
});
