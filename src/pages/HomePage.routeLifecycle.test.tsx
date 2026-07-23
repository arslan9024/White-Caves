import { describe, it, expect, afterEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import propertyReducer from '../store/propertySlice';
import userReducer from '../store/userSlice';
import navigationReducer from '../store/navigationSlice';
import homepageReducer from '../store/slices/homepageSlice';
import sidebarReducer from '../store/slices/sidebarSlice';
import nadiaReducer from '../store/slices/nadiaSlice';
import { vi } from 'vitest';

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

/**
 * HomePage Route Lifecycle — Integration Test
 * Validates that the hero preload link is properly cleaned up when navigating away from homepage.
 */

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
  clearError: vi.fn(() => ({ type: 'homepage/clearError/mock' })),
  fetchHomepageData: vi.fn(() => ({ type: 'homepage/fetch/mock' })),
  selectMarketStats: () => MOCK_MARKET_STATS,
  selectTopAgents: () => MOCK_TOP_AGENTS,
  selectLocationTrends: () => MOCK_LOCATION_TRENDS,
  selectFeaturedProperties: () => MOCK_FEATURED_PROPERTIES,
  selectIsHomepageLoading: () => false,
  selectHomepageError: () => null,
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
    {
      id: 1,
      title: 'Villa in Palm',
      type: 'Villa',
      location: 'Palm Jumeirah',
      price: 5000000,
      beds: 5,
      baths: 6,
      sqft: 4500,
      amenities: ['Pool', 'Parking'],
    },
  ],
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      properties: propertyReducer,
      user: userReducer,
      navigation: navigationReducer,
      homepage: homepageReducer,
      sidebar: sidebarReducer,
      nadia: nadiaReducer,
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

const renderPageWithRoutes = () => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/']}>
        <Link to="/about" data-testid="link-to-about">
          Go to about
        </Link>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<div>About route</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

afterEach(() => {
  document.head.querySelectorAll('[data-wc-seo="true"]').forEach(el => el.remove());
  document.getElementById('wc-seo-jsonld')?.remove();
});

describe('HomePage route lifecycle', () => {
  it('should remove homepage hero preload when navigating away from homepage route', async () => {
    renderPageWithRoutes();

    await waitFor(() => {
      expect(document.head.querySelector('link#homepage-hero-preload')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('link-to-about'));

    await waitFor(() => {
      expect(screen.getByText('About route')).toBeInTheDocument();
      expect(document.head.querySelector('link#homepage-hero-preload')).toBeNull();
    });
  });
});
