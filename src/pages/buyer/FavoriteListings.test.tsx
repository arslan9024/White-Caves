/**
 * FavoriteListings.test.tsx — Smoke tests for Favorite Listings page
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// Mock PropertyCard
vi.mock('../../components/common/PropertyCard', () => ({
  default: ({ title, location, price }: any) => (
    <div data-testid="property-card">
      <span>{title}</span>
      <span>{location}</span>
      <span>{price}</span>
    </div>
  ),
}));

import FavoriteListings from './FavoriteListings';

// ─── Store helpers ──────────────────────────────────────────────────

const mockFavorites = [
  {
    id: '1',
    title: 'Marina Tower 3BR',
    location: 'Dubai Marina',
    price: '2500000',
    image: '/test.jpg',
  },
  {
    id: '2',
    title: 'Palm Villa',
    location: 'Palm Jumeirah',
    price: '15000000',
    image: '/test2.jpg',
  },
];

function createTestStore(favorites: any[] = [], loading = false) {
  return configureStore({
    reducer: {
      dashboard: (state = { favorites, favoritesLoading: loading }, _action: any) => state,
    },
  });
}

function renderWithStore(favorites: any[] = [], loading = false) {
  const store = createTestStore(favorites, loading);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <FavoriteListings />
      </MemoryRouter>
    </Provider>
  );
}

describe('FavoriteListings', () => {
  it('renders page heading', () => {
    renderWithStore();
    expect(screen.getByText(/My Favorites/)).toBeTruthy();
  });

  it('renders subtitle', () => {
    renderWithStore();
    expect(screen.getByText(/saved for later review/)).toBeTruthy();
  });

  it('shows empty state when no favorites', () => {
    renderWithStore([]);
    expect(screen.getByText('No favorites yet')).toBeTruthy();
    expect(screen.getByText(/Browse properties and tap the heart icon/)).toBeTruthy();
  });

  it('shows loading state', () => {
    renderWithStore([], true);
    expect(screen.getByText(/Loading your favorites/)).toBeTruthy();
  });

  it('renders property cards when favorites exist', () => {
    renderWithStore(mockFavorites);
    expect(screen.getByText('Marina Tower 3BR')).toBeTruthy();
    expect(screen.getByText('Palm Villa')).toBeTruthy();
  });

  it('shows property count text', () => {
    renderWithStore(mockFavorites);
    expect(screen.getByText('2 saved properties')).toBeTruthy();
  });

  it('shows "1 saved property" for single item', () => {
    renderWithStore([mockFavorites[0]]);
    expect(screen.getByText('1 saved property')).toBeTruthy();
  });

  it('renders sort dropdown', () => {
    renderWithStore(mockFavorites);
    const select = screen.getByLabelText('Sort favorites');
    expect(select).toBeTruthy();
  });

  it('has sort options', () => {
    renderWithStore(mockFavorites);
    expect(screen.getByText('Recently Added')).toBeTruthy();
    expect(screen.getByText(/Price: Low/)).toBeTruthy();
    expect(screen.getByText(/Price: High/)).toBeTruthy();
  });

  it('renders remove buttons for each favorite', () => {
    renderWithStore(mockFavorites);
    const removeButtons = screen.getAllByTitle('Remove from favorites');
    expect(removeButtons.length).toBe(2);
  });
});
