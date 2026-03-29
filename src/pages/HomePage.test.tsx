/**
 * HomePage — Unit Tests
 * Tests: rendering, lazy-loaded sections, Redux integration,
 * document title, AppLayout usage, property click handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

vi.mock('../components/ClickToChat', () => ({
  default: () => <div data-testid="click-to-chat">ClickToChat</div>,
}));

vi.mock('../components/RecentlyViewed', () => ({
  useRecentlyViewed: () => ({ addToRecent: vi.fn(), recentItems: [] }),
}));

// Mock all lazy-loaded sections
vi.mock('../components/homepage/Hero', () => ({
  default: () => <div data-testid="hero-section">Hero</div>,
}));
vi.mock('../components/homepage/Features', () => ({
  default: () => <div data-testid="features-section">Features</div>,
}));
vi.mock('../components/homepage/Locations', () => ({
  default: () => <div data-testid="locations-section">Locations</div>,
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
vi.mock('../components/InteractiveMap', () => ({
  default: () => <div data-testid="interactive-map">InteractiveMap</div>,
}));
vi.mock('../components/PropertyComparison', () => ({
  default: () => <div data-testid="property-comparison">PropertyComparison</div>,
}));
vi.mock('../components/OffPlanTracker', () => ({
  default: () => <div data-testid="off-plan-tracker">OffPlanTracker</div>,
}));
vi.mock('../components/NeighborhoodAnalyzer', () => ({
  default: () => <div data-testid="neighborhood-analyzer">NeighborhoodAnalyzer</div>,
}));
vi.mock('../components/RentVsBuyCalculator', () => ({
  default: () => <div data-testid="rent-vs-buy">RentVsBuyCalculator</div>,
}));
vi.mock('../components/VirtualTourGallery', () => ({
  default: () => <div data-testid="virtual-tour">VirtualTourGallery</div>,
}));
vi.mock('../components/DubaiMap', () => ({
  default: ({ onPropertySelect }: { onPropertySelect?: (p: { id: number }) => void }) => (
    <div data-testid="dubai-map" onClick={() => onPropertySelect?.({ id: 42 })}>DubaiMap</div>
  ),
}));
vi.mock('../components/CompanyProfile', () => ({
  default: () => <div data-testid="company-profile">CompanyProfile</div>,
}));
vi.mock('../components/BlogSection', () => ({
  default: () => <div data-testid="blog-section">BlogSection</div>,
}));
vi.mock('../components/NewsletterSubscription', () => ({
  default: () => <div data-testid="newsletter">Newsletter</div>,
}));
vi.mock('../components/OnboardingGateway', () => ({
  default: () => <div data-testid="onboarding">Onboarding</div>,
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

// ── Helpers ──────────────────────────────────────────────────────

const createMockStore = () => {
  return configureStore({
    reducer: {
      properties: propertyReducer,
      user: userReducer,
      navigation: navigationReducer,
    },
    preloadedState: {
      user: {
        currentUser: { id: 'u1', name: 'Ahmed', email: 'ahmed@wc.ae', role: 'buyer' },
        loading: false,
        error: null,
      } as ReturnType<typeof userReducer>,
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
    </Provider>,
  );
};

// ── Tests ────────────────────────────────────────────────────────

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ────────────────────────────────────────────────

  describe('Rendering', () => {
    it('should render inside AppLayout', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('app-layout')).toBeInTheDocument();
      });
    });

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

    it('should render DubaiMap section', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('dubai-map')).toBeInTheDocument();
      });
    });

    it('should render Locations section', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('locations-section')).toBeInTheDocument();
      });
    });

    it('should render InteractiveMap section', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('interactive-map')).toBeInTheDocument();
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

    it('should render OffPlanTracker section', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('off-plan-tracker')).toBeInTheDocument();
      });
    });

    it('should render NeighborhoodAnalyzer section', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('neighborhood-analyzer')).toBeInTheDocument();
      });
    });

    it('should render VirtualTourGallery section', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('virtual-tour')).toBeInTheDocument();
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

    it('should render NewsletterSubscription', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('newsletter')).toBeInTheDocument();
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
        </Provider>,
      );
      // Store should have properties set
      const state = store.getState();
      expect(state.properties.properties.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ── DubaiMap interaction ─────────────────────────────────────

  describe('Property Click', () => {
    it('should handle DubaiMap property click without errors', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByTestId('dubai-map')).toBeInTheDocument();
      });
      // Click the mocked map — calls addToRecent + scrollIntoView
      expect(() => {
        screen.getByTestId('dubai-map').click();
      }).not.toThrow();
    });
  });
});
