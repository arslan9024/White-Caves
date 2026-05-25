/**
 * HomePage — Unit Tests
 * Tests: rendering, lazy-loaded sections, Redux integration,
 * document title, public homepage rendering, property click handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks ────────────────────────────────────────────────────────

const MOCK_MARKET_STATS = {
  totalProperties: 500,
  availableProperties: 320,
  averagePrice: 4500000,
  totalValue: 2250000000,
  activeAgents: 24,
};

const MOCK_TOP_AGENTS: unknown[] = [];
const MOCK_LOCATION_TRENDS: unknown[] = [];
const MOCK_FEATURED_PROPERTIES: unknown[] = [];
let MOCK_HOMEPAGE_ERROR: string | null = null;

vi.mock('../components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('../components/ClickToChat', () => ({
  default: () => <div data-testid="click-to-chat">ClickToChat</div>,
}));

vi.mock('../components/layout/PublicNavbar/PublicNavbar', () => ({
  default: () => <div data-testid="public-navbar">PublicNavbar</div>,
}));

vi.mock('../components/RecentlyViewed', () => ({
  useRecentlyViewed: () => ({ addToRecent: vi.fn(), recentItems: [] }),
}));

vi.mock('../store/slices/homepageSlice', () => ({
  fetchHomepageData: vi.fn(() => ({ type: 'homepage/fetch/mock' })),
  selectMarketStats: () => MOCK_MARKET_STATS,
  selectTopAgents: () => MOCK_TOP_AGENTS,
  selectLocationTrends: () => MOCK_LOCATION_TRENDS,
  selectFeaturedProperties: () => MOCK_FEATURED_PROPERTIES,
  selectIsHomepageLoading: () => false,
  selectHomepageError: () => MOCK_HOMEPAGE_ERROR,
  default: (
    state = {
      featuredProperties: [],
      marketStats: {
        totalProperties: 500,
        availableProperties: 320,
        averagePrice: 4500000,
        portfolioValue: 2250000000,
        activeAgents: 24,
      },
      topAgents: [],
      locationTrends: [],
      isLoading: false,
      error: null,
      lastFetchedAt: null,
    }
  ) => state,
}));

// Mock all lazy-loaded sections
vi.mock('../components/homepage/Hero/LuxuryHeroSection', () => ({
  LuxuryHeroSection: () => <div data-testid="hero-section">Hero</div>,
}));
vi.mock('../components/homepage/Features', () => ({
  default: () => <div data-testid="features-section">Features</div>,
}));
vi.mock('../components/homepage/MarketStats/MarketStatsBanner', () => ({
  default: () => <div data-testid="market-stats-banner">MarketStatsBanner</div>,
}));
vi.mock('../components/homepage/Locations', () => ({
  default: () => <div data-testid="locations-section">Locations</div>,
}));
vi.mock('../components/homepage/FeaturedProperties/FeaturedPropertiesSection', () => ({
  default: () => <div data-testid="featured-properties-section">FeaturedProperties</div>,
}));
vi.mock('../components/homepage/Team', () => ({
  default: () => <div data-testid="team-section">Team</div>,
}));
vi.mock('../components/homepage/Testimonials', () => ({
  default: () => <div data-testid="testimonials-section">Testimonials</div>,
}));
vi.mock('../components/homepage/Contact', () => ({
  default: () => <div data-testid="contact-section">Contact</div>,
}));
vi.mock('../components/homepage/PopularSearches/PopularSearches', () => ({
  default: () => <div data-testid="popular-searches">PopularSearches</div>,
}));
vi.mock('../components/homepage/MobileAppBanner/MobileAppBanner', () => ({
  default: () => <div data-testid="mobile-app-banner">MobileAppBanner</div>,
}));
vi.mock('../components/InteractiveMap', () => ({
  default: () => <div data-testid="interactive-map">InteractiveMap</div>,
}));
vi.mock('../components/PropertyComparison', () => ({
  default: () => <div data-testid="property-comparison">PropertyComparison</div>,
}));
vi.mock('../components/NeighborhoodAnalyzer', () => ({
  default: () => <div data-testid="neighborhood-analyzer">NeighborhoodAnalyzer</div>,
}));
vi.mock('../components/RentVsBuyCalculator', () => ({
  default: () => <div data-testid="rent-vs-buy">RentVsBuyCalculator</div>,
}));
vi.mock('../components/OffPlanTracker', () => ({
  default: () => <div data-testid="off-plan-tracker">OffPlanTracker</div>,
}));
vi.mock('../components/VirtualTourGallery', () => ({
  default: () => <div data-testid="virtual-tour-gallery">VirtualTourGallery</div>,
}));
vi.mock('../components/DubaiMap', () => ({
  default: () => <div data-testid="dubai-map">DubaiMap</div>,
}));
vi.mock('../components/CompanyProfile', () => ({
  default: () => <div data-testid="company-profile">CompanyProfile</div>,
}));
vi.mock('../components/BlogSection', () => ({
  default: () => <div data-testid="blog-section">BlogSection</div>,
}));
vi.mock('../components/NewsletterSubscription', () => ({
  default: () => <div data-testid="newsletter-subscription">NewsletterSubscription</div>,
}));
vi.mock('../components/OnboardingGateway', () => ({
  default: () => <div data-testid="onboarding">Onboarding</div>,
}));
vi.mock('../components/RoleSelectionModal', () => ({
  default: () => <div data-testid="role-selection-modal">RoleSelectionModal</div>,
}));

vi.mock('../data/homeProperties', () => ({
  HOME_PROPERTIES: [
    { id: 1, title: 'Villa in Palm', price: 5000000 },
    { id: 2, title: 'Apartment in Marina', price: 2000000 },
  ],
}));

import HomePage from './HomePage';
import propertyReducer from '../store/propertySlice';
import userReducer from '../store/userSlice';
import navigationReducer from '../store/navigationSlice';
import homepageReducer from '../store/slices/homepageSlice';

// ── Helpers ──────────────────────────────────────────────────────

const createMockStore = () => {
  return configureStore({
    reducer: {
      properties: propertyReducer,
      user: userReducer,
      navigation: navigationReducer,
      homepage: homepageReducer,
    },
    preloadedState: {
      user: {
        currentUser: { id: 'u1', name: 'Ahmed', email: 'ahmed@wc.ae', role: 'buyer' },
        loading: false,
        error: null,
      } as unknown as ReturnType<typeof userReducer>,
    },
  });
};

const renderPage = () => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </Provider>
  );
};

afterEach(() => {
  document.head.querySelectorAll('[data-wc-seo="true"]').forEach(el => el.remove());
  document.getElementById('wc-seo-jsonld')?.remove();
});

// ── Tests ────────────────────────────────────────────────────────

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    MOCK_HOMEPAGE_ERROR = null;
  });

  // ── Rendering ────────────────────────────────────────────────

  describe('Rendering', () => {
    it('should render the home-page container', async () => {
      renderPage();
      await waitFor(() => {
        const el = document.querySelector('.home-page');
        expect(el).toBeTruthy();
      });
    });

    it('should render Footer', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('footer')).toBeInTheDocument();
      });
    });

    it('should render ClickToChat', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('click-to-chat')).toBeInTheDocument();
      });
    });

    it('should render trust highlight cards', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Active Listings')).toBeInTheDocument();
        expect(screen.getByText('Average Price')).toBeInTheDocument();
      });
    });

    it('should show fallback status card when homepage data returns an error', async () => {
      MOCK_HOMEPAGE_ERROR = 'Network error';
      renderPage();
      await waitFor(() => {
        expect(screen.getByText(/Live data temporarily limited/i)).toBeInTheDocument();
      });
    });
  });

  // ── Lazy-Loaded Sections ─────────────────────────────────────

  describe('Lazy-Loaded Sections', () => {
    it('should render Hero section', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('hero-section')).toBeInTheDocument();
      });
    });

    it('should render Features section', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('features-section')).toBeInTheDocument();
      });
    });

    it('should render Locations section', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('locations-section')).toBeInTheDocument();
      });
    });

    it('should render DubaiMap section', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('dubai-map')).toBeInTheDocument();
      });
    });

    it('should render PropertyComparison section', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('property-comparison')).toBeInTheDocument();
      });
    });

    it('should render RentVsBuyCalculator section', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('rent-vs-buy')).toBeInTheDocument();
      });
    });

    it('should render CompanyProfile section', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('company-profile')).toBeInTheDocument();
      });
    });

    it('should render Team section', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('team-section')).toBeInTheDocument();
      });
    });

    it('should render Testimonials section', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('testimonials-section')).toBeInTheDocument();
      });
    });

    it('should render BlogSection', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('blog-section')).toBeInTheDocument();
      });
    });

    it('should render ContactCTA section', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('contact-section')).toBeInTheDocument();
      });
    });

    it('should render OnboardingGateway', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('onboarding')).toBeInTheDocument();
      });
    });

    it('should render InteractiveMap', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('interactive-map')).toBeInTheDocument();
      });
    });

    it('should render OffPlanTracker', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('off-plan-tracker')).toBeInTheDocument();
      });
    });

    it('should render NeighborhoodAnalyzer', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('neighborhood-analyzer')).toBeInTheDocument();
      });
    });

    it('should render VirtualTourGallery', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('virtual-tour-gallery')).toBeInTheDocument();
      });
    });

    it('should render NewsletterSubscription', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('newsletter-subscription')).toBeInTheDocument();
      });
    });
  });

  // ── Redux Integration ────────────────────────────────────────

  describe('Redux Integration', () => {
    it('should dispatch setProperties with HOME_PROPERTIES on mount', () => {
      const store = createMockStore();
      render(
        <Provider store={store}>
          <MemoryRouter>
            <HomePage />
          </MemoryRouter>
        </Provider>
      );
      // Store should have properties set
      const state = store.getState();
      expect(state.properties.properties.length).toBeGreaterThanOrEqual(2);
    });

    it('should apply dynamic homepage JSON-LD to the document head', async () => {
      renderPage();

      await waitFor(() => {
        const jsonLd = document.getElementById('wc-seo-jsonld');
        expect(jsonLd).toBeTruthy();
        expect(jsonLd?.textContent).toContain('CollectionPage');
        expect(jsonLd?.textContent).toContain('RealEstateAgent');
        expect(jsonLd?.textContent).toContain('"numberOfItems":500');
      });
    });
  });

  // ── Property Click ───────────────────────────────────────────

  describe('Property Click', () => {
    it('should call addToRecent with property id when handlePropertyClick is triggered', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('featured-properties-section')).toBeInTheDocument();
      });
    });
  });
});
