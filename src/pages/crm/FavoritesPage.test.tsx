/**
 * FavoritesPage — Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// ── Mock data ───────────────────────────────────────────────────
const MOCK_FAVORITES = [
  { id: '1', property_id: 'p1', title: 'Palm Jumeirah Villa', location: 'Palm Jumeirah', price: 5000000, type: 'villa', bedrooms: 4, bathrooms: 3, sqft: 4500 },
  { id: '2', property_id: 'p2', title: 'Marina Apartment', location: 'Dubai Marina', price: 1200000, type: 'apartment', bedrooms: 2, bathrooms: 2, sqft: 1200 },
];

let hookOverrides: Record<string, unknown> = {};

vi.mock('./hooks/useFavorites', () => ({
  useFavorites: () => ({
    filteredFavorites: MOCK_FAVORITES,
    paginatedFavorites: MOCK_FAVORITES,
    loading: false,
    error: null,
    search: '',
    currentPage: 1,
    ITEMS_PER_PAGE: 10,
    handleRemoveFavorite: vi.fn(),
    handleSearchChange: vi.fn(),
    setCurrentPage: vi.fn(),
    retryFetch: vi.fn(),
    goBack: vi.fn(),
    formatCurrency: (v: number | undefined) => v ? `AED ${v.toLocaleString()}` : '—',
    ...hookOverrides,
  }),
}));

vi.mock('../../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock('../../components/ui', () => ({
  Pagination: ({ currentPage, onPageChange }: any) => (
    <div data-testid="pagination">
      <span>Page {currentPage}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
  EmptyState: ({ title, description }: any) => (
    <div data-testid="empty-state">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  ),
}));

import FavoritesPage from './FavoritesPage';

describe('FavoritesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookOverrides = {};
  });

  it('renders page title "Favorites"', () => {
    render(<FavoritesPage />);
    expect(screen.getByText(/Favorites/)).toBeDefined();
  });

  it('shows empty state when no favorites', () => {
    hookOverrides = { paginatedFavorites: [], filteredFavorites: [] };
    render(<FavoritesPage />);
    expect(screen.getByText(/No favorites yet/)).toBeDefined();
  });

  it('renders property cards when favorites exist', () => {
    render(<FavoritesPage />);
    expect(screen.getByText('Palm Jumeirah Villa')).toBeDefined();
    expect(screen.getByText('Marina Apartment')).toBeDefined();
  });
});
