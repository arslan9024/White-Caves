import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';

// Mock styled components
vi.mock('../PropertyCard/PropertyCard.styles', () => {
  const c = (tag: string, name: string) => {
    const Comp = ({ children, to, ...props }: any) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) clean[k] = v;
      }
      if (to) clean.href = to;
      return React.createElement(tag === 'a' ? 'a' : tag, { ...clean, 'data-testid': name }, children);
    };
    Comp.displayName = name;
    return Comp;
  };
  return {
    PropertyCardContainer: c('a', 'property-card-container'),
    PropertyCardDiv: c('div', 'property-card-div'),
    PropertyCardImage: c('div', 'property-card-image'),
    PropertyPlaceholder: c('div', 'property-placeholder'),
    PropertyStatusBadgeStyled: c('span', 'property-status-badge'),
    FavoriteButton: c('button', 'favorite-button'),
    PropertyCardContent: c('div', 'property-card-content'),
    PropertyTitle: c('h3', 'property-title'),
    PropertyLocation: c('p', 'property-location'),
    PropertyPrice: c('span', 'property-price'),
    PriceSuffix: c('span', 'price-suffix'),
    PropertySpecs: c('div', 'property-specs'),
  };
});

// Mock dashboardSlice
vi.mock('../../../store/dashboardSlice', () => ({
  addToFavorites: vi.fn((payload) => ({ type: 'dashboard/addToFavorites', payload })),
  removeFromFavorites: vi.fn((id) => ({ type: 'dashboard/removeFromFavorites', payload: id })),
  selectFavorites: (state: any) => state.dashboard?.favorites || [],
}));

import PropertyCard, { PropertyStatusBadge } from '../PropertyCard';

const createStore = (favorites: any[] = []) =>
  configureStore({
    reducer: {
      dashboard: () => ({ favorites }),
    },
  });

const renderPropertyCard = (props: Record<string, unknown> = {}, favorites: any[] = []) =>
  render(
    <Provider store={createStore(favorites)}>
      <MemoryRouter>
        <PropertyCard
          id="prop-1"
          title="Luxury Villa"
          location="Palm Jumeirah"
          price="AED 15,000,000"
          {...props}
        />
      </MemoryRouter>
    </Provider>
  );

describe('PropertyCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── PropertyStatusBadge ────────────────────────────────────
  describe('PropertyStatusBadge', () => {
    it('renders status text', () => {
      render(<PropertyStatusBadge status="Available" />);
      expect(screen.getByText('Available')).toBeInTheDocument();
    });

    it('renders different statuses', () => {
      const { rerender } = render(<PropertyStatusBadge status="Sold" />);
      expect(screen.getByText('Sold')).toBeInTheDocument();
      rerender(<PropertyStatusBadge status="Under Offer" />);
      expect(screen.getByText('Under Offer')).toBeInTheDocument();
    });
  });

  // ── Basic Rendering ────────────────────────────────────────
  describe('rendering', () => {
    it('renders property title', () => {
      renderPropertyCard();
      expect(screen.getByText('Luxury Villa')).toBeInTheDocument();
    });

    it('renders property location with pin emoji', () => {
      renderPropertyCard();
      expect(screen.getByText(/Palm Jumeirah/)).toBeInTheDocument();
    });

    it('renders property price', () => {
      renderPropertyCard();
      expect(screen.getByText(/AED 15,000,000/)).toBeInTheDocument();
    });

    it('renders property image when provided', () => {
      renderPropertyCard({ image: '/villa.jpg' });
      expect(screen.getByAltText('Luxury Villa')).toBeInTheDocument();
    });

    it('renders placeholder when no image', () => {
      renderPropertyCard();
      expect(screen.getByTestId('property-placeholder')).toBeInTheDocument();
    });

    it('uses lazy loading for images', () => {
      renderPropertyCard({ image: '/villa.jpg' });
      expect(screen.getByAltText('Luxury Villa')).toHaveAttribute('loading', 'lazy');
    });
  });

  // ── Status Badge ───────────────────────────────────────────
  describe('status', () => {
    it('renders status badge when provided', () => {
      renderPropertyCard({ status: 'New' });
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('does not render badge when no status', () => {
      renderPropertyCard();
      expect(screen.queryByTestId('property-status-badge')).not.toBeInTheDocument();
    });
  });

  // ── Property Specs ─────────────────────────────────────────
  describe('specs', () => {
    it('renders bedrooms count', () => {
      renderPropertyCard({ beds: 5 });
      const specs = screen.getByTestId('property-specs');
      expect(specs.textContent).toMatch(/5/);
    });

    it('renders bathrooms count', () => {
      renderPropertyCard({ baths: 6 });
      expect(screen.getByText(/6/)).toBeInTheDocument();
    });

    it('renders area', () => {
      renderPropertyCard({ area: '12,000 sqft' });
      expect(screen.getByText(/12,000 sqft/)).toBeInTheDocument();
    });

    it('does not render specs section when no specs provided', () => {
      renderPropertyCard({ beds: 0, baths: 0, area: undefined });
      expect(screen.queryByTestId('property-specs')).not.toBeInTheDocument();
    });
  });

  // ── Rent Type ──────────────────────────────────────────────
  describe('rent type', () => {
    it('shows /year suffix for rental properties', () => {
      renderPropertyCard({ type: 'rent' });
      expect(screen.getByText('/year')).toBeInTheDocument();
    });

    it('does not show /year suffix for sale properties', () => {
      renderPropertyCard({ type: 'sale' });
      expect(screen.queryByText('/year')).not.toBeInTheDocument();
    });
  });

  // ── Favorites ──────────────────────────────────────────────
  describe('favorites', () => {
    it('renders favorite button by default', () => {
      renderPropertyCard();
      expect(screen.getByTestId('favorite-button')).toBeInTheDocument();
    });

    it('shows empty heart when not favorited', () => {
      renderPropertyCard();
      expect(screen.getByText('🤍')).toBeInTheDocument();
    });

    it('shows filled heart when favorited', () => {
      renderPropertyCard({}, [{ id: 'prop-1', title: 'Luxury Villa' }]);
      expect(screen.getByText('❤️')).toBeInTheDocument();
    });

    it('has correct aria-label when not favorited', () => {
      renderPropertyCard();
      expect(screen.getByLabelText('Add to favorites')).toBeInTheDocument();
    });

    it('has correct aria-label when favorited', () => {
      renderPropertyCard({}, [{ id: 'prop-1', title: 'Luxury Villa' }]);
      expect(screen.getByLabelText('Remove from favorites')).toBeInTheDocument();
    });

    it('hides favorite button when showFavorite is false', () => {
      renderPropertyCard({ showFavorite: false });
      expect(screen.queryByTestId('favorite-button')).not.toBeInTheDocument();
    });

    it('dispatches addToFavorites on click when not favorited', () => {
      const store = createStore([]);
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      render(
        <Provider store={store}>
          <MemoryRouter>
            <PropertyCard id="prop-1" title="Luxury Villa" location="Palm Jumeirah" price="AED 15M" />
          </MemoryRouter>
        </Provider>
      );
      fireEvent.click(screen.getByTestId('favorite-button'));
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  // ── Link Rendering ─────────────────────────────────────────
  describe('link vs div', () => {
    it('renders as link when `to` prop is provided', () => {
      renderPropertyCard({ to: '/properties/prop-1' });
      expect(screen.getByTestId('property-card-container')).toBeInTheDocument();
    });

    it('renders as div when `to` is not provided', () => {
      renderPropertyCard();
      expect(screen.getByTestId('property-card-div')).toBeInTheDocument();
    });

    it('calls onClick when div card is clicked', () => {
      const onClick = vi.fn();
      renderPropertyCard({ onClick });
      fireEvent.click(screen.getByTestId('property-card-div'));
      expect(onClick).toHaveBeenCalled();
    });
  });
});
