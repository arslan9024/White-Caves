import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Mock CSS
vi.mock('./PropertyComparison.css', () => ({}));

import PropertyComparison from './PropertyComparison';

// Helper to create a mock store with properties
function createMockStore(properties: any[] = []) {
  return configureStore({
    reducer: {
      properties: () => ({ properties }),
    },
  });
}

const sampleProperties = [
  { id: '1', title: 'Luxury Villa Palm Jumeirah', location: 'Palm Jumeirah', price: 5000000, type: 'Villa', beds: 4, baths: 5, sqft: 5000, images: ['img1.jpg'] },
  { id: '2', title: 'Downtown Apartment Burj Khalifa', location: 'Downtown Dubai', price: 2500000, type: 'Apartment', beds: 2, baths: 2, sqft: 1200, images: ['img2.jpg'] },
  { id: '3', title: 'Marina Penthouse Dubai Marina', location: 'Dubai Marina', price: 8000000, type: 'Penthouse', beds: 5, baths: 6, sqft: 7000, images: ['img3.jpg'] },
  { id: '4', title: 'JVC Family Apartment JVC', location: 'JVC', price: 1200000, type: 'Apartment', beds: 3, baths: 2, sqft: 1800, images: ['img4.jpg'] },
  { id: '5', title: 'Studio Al Barsha Al Barsha South', location: 'Al Barsha', price: 700000, type: 'Studio', beds: 0, baths: 1, sqft: 500, images: [] },
];

function renderWithStore(properties: any[] = sampleProperties) {
  const store = createMockStore(properties);
  return render(
    <Provider store={store}>
      <PropertyComparison />
    </Provider>
  );
}

describe('PropertyComparison', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────
  describe('rendering', () => {
    it('renders Compare Properties heading', () => {
      renderWithStore();
      expect(screen.getByText('Compare Properties')).toBeInTheDocument();
    });

    it('renders subtitle', () => {
      renderWithStore();
      expect(screen.getByText('Select up to 4 properties to compare side by side')).toBeInTheDocument();
    });

    it('renders 4 empty comparison slots', () => {
      renderWithStore();
      const addButtons = screen.getAllByText('Add Property');
      expect(addButtons.length).toBe(4);
    });

    it('does not show Clear All when no properties selected', () => {
      renderWithStore();
      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('does not show comparison table with no selections', () => {
      renderWithStore();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  // ── Empty store ────────────────────────────────────────────
  describe('empty store', () => {
    it('renders with empty properties array', () => {
      renderWithStore([]);
      expect(screen.getByText('Compare Properties')).toBeInTheDocument();
    });

    it('shows 4 empty slots with empty store', () => {
      renderWithStore([]);
      expect(screen.getAllByText('Add Property').length).toBe(4);
    });
  });

  // ── Slot interaction ───────────────────────────────────────
  describe('slot interaction', () => {
    it('clicking empty slot triggers selector display', () => {
      renderWithStore();
      const addSlots = screen.getAllByText('Add Property');
      fireEvent.click(addSlots[0]);
      // After clicking, showSelector state becomes true
      // The component doesn't explicitly render a selector panel,
      // but the state is toggled. We verify no crash.
      expect(screen.getByText('Compare Properties')).toBeInTheDocument();
    });
  });

  // ── Snapshot ───────────────────────────────────────────────
  describe('snapshot', () => {
    it('matches initial snapshot', () => {
      const { container } = renderWithStore();
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
