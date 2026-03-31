/**
 * SavedSearches.test.tsx — Smoke tests for Saved Searches page
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';

// Mock the savedSearchesSlice — use importOriginal to preserve the default export (reducer)
vi.mock('../../store/slices/savedSearchesSlice', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../store/slices/savedSearchesSlice')>();
  return {
    ...actual,
    fetchSavedSearches: vi.fn(() => ({ type: 'savedSearches/fetchSavedSearches' })),
    createSavedSearch: vi.fn(() => ({ type: 'savedSearches/createSavedSearch' })),
    updateSavedSearch: vi.fn(() => ({ type: 'savedSearches/updateSavedSearch' })),
    deleteSavedSearch: vi.fn(() => ({ type: 'savedSearches/deleteSavedSearch' })),
    checkSearchMatches: vi.fn(() => ({ type: 'savedSearches/checkSearchMatches' })),
    clearError: vi.fn(() => ({ type: 'savedSearches/clearError' })),
    selectSavedSearches: (state: any) => state.savedSearches?.searches ?? [],
    selectSavedSearchesLoading: (state: any) => state.savedSearches?.loading ?? false,
    selectSavedSearchesError: (state: any) => state.savedSearches?.error ?? null,
    selectMatchResults: (state: any) => state.savedSearches?.matchResults ?? {},
  };
});

import SavedSearchesPage from './SavedSearches';

// ─── Store helpers ──────────────────────────────────────────────────

const mockSearches = [
  {
    id: 'ss-1',
    name: '3BR in JBR',
    filters: { type: 'apartment', bedrooms: 3, location: 'JBR' },
    alertEnabled: true,
    matchCount: 12,
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'ss-2',
    name: 'Villas under 5M',
    filters: { type: 'villa', maxPrice: 5000000 },
    alertEnabled: false,
    matchCount: 5,
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-12T00:00:00Z',
  },
];

function createTestStore(searches: any[] = [], loading = false, error: string | null = null) {
  return configureStore({
    reducer: {
      savedSearches: (
        state = { searches, loading, error, matchResults: {} },
        _action: any,
      ) => state,
    },
  });
}

function renderWithStore(searches: any[] = [], loading = false, error: string | null = null) {
  const store = createTestStore(searches, loading, error);
  return render(
    <Provider store={store}>
      <SavedSearchesPage />
    </Provider>,
  );
}

describe('SavedSearchesPage', () => {
  it('renders page heading', () => {
    renderWithStore();
    expect(screen.getByText(/Saved Searches/)).toBeTruthy();
  });

  it('renders page description', () => {
    renderWithStore();
    expect(screen.getByText(/Save your search criteria/)).toBeTruthy();
  });

  it('renders "New Search" button', () => {
    renderWithStore();
    expect(screen.getByText('+ New Search')).toBeTruthy();
  });

  it('shows empty state when no searches', () => {
    renderWithStore([]);
    expect(screen.getByText('No saved searches yet')).toBeTruthy();
    expect(screen.getByText('Create Your First Search')).toBeTruthy();
  });

  it('shows loading state', () => {
    renderWithStore([], true);
    expect(screen.getByText(/Loading saved searches/)).toBeTruthy();
  });

  it('shows error message', () => {
    renderWithStore([], false, 'Failed to load searches');
    expect(screen.getByText('Failed to load searches')).toBeTruthy();
    expect(screen.getByText('Dismiss')).toBeTruthy();
  });

  it('renders search cards when searches exist', () => {
    renderWithStore(mockSearches);
    expect(screen.getByText('3BR in JBR')).toBeTruthy();
    expect(screen.getByText('Villas under 5M')).toBeTruthy();
  });

  it('renders filter summary for searches', () => {
    renderWithStore(mockSearches);
    // "apartment · 3BR · JBR" - use getAllByText since multiple matches possible
    expect(screen.getAllByText(/apartment/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/3BR/).length).toBeGreaterThanOrEqual(1);
  });

  it('shows match count badges', () => {
    renderWithStore(mockSearches);
    expect(screen.getByText('12 matches')).toBeTruthy();
    expect(screen.getByText('5 matches')).toBeTruthy();
  });

  it('shows alert badge for searches with alerts enabled', () => {
    renderWithStore(mockSearches);
    expect(screen.getByText(/Alerts ON/)).toBeTruthy();
  });

  it('renders action buttons for each search', () => {
    renderWithStore(mockSearches);
    const checkBtns = screen.getAllByText(/Check Matches/);
    const editBtns = screen.getAllByText(/Edit/);
    const deleteBtns = screen.getAllByText(/Delete/);
    expect(checkBtns.length).toBe(2);
    expect(editBtns.length).toBe(2);
    expect(deleteBtns.length).toBe(2);
  });

  it('opens create form when clicking "New Search"', () => {
    renderWithStore(mockSearches);
    fireEvent.click(screen.getByText('+ New Search'));
    expect(screen.getByText('🔍 New Saved Search')).toBeTruthy();
    expect(screen.getByText('Create Search')).toBeTruthy();
  });

  it('create form has all fields', () => {
    renderWithStore(mockSearches);
    fireEvent.click(screen.getByText('+ New Search'));
    expect(screen.getByText('Search Name *')).toBeTruthy();
    expect(screen.getByText('Property Type')).toBeTruthy();
    expect(screen.getByText('Location')).toBeTruthy();
    expect(screen.getByText('Min Price (AED)')).toBeTruthy();
    expect(screen.getByText('Max Price (AED)')).toBeTruthy();
    expect(screen.getByText('Bedrooms')).toBeTruthy();
  });

  it('opens edit form when clicking Edit', () => {
    renderWithStore(mockSearches);
    const editBtns = screen.getAllByText(/Edit/);
    fireEvent.click(editBtns[0]);
    expect(screen.getByText('✏️ Edit Search')).toBeTruthy();
    expect(screen.getByText('Save Changes')).toBeTruthy();
  });

  it('form cancel button closes the form', () => {
    renderWithStore(mockSearches);
    fireEvent.click(screen.getByText('+ New Search'));
    expect(screen.getByText('🔍 New Saved Search')).toBeTruthy();

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('🔍 New Saved Search')).toBeNull();
  });
});
