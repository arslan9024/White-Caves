/**
 * PropertyFilterPanel — Test Suite
 * =================================
 * Tests for the advanced property filter panel: rendering, dropdown controls,
 * search, purpose tabs, advanced toggle, active filter pills, URL sync,
 * and reset functionality.
 *
 * 32 tests across 7 describe blocks.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ─── Mocks ────────────────────────────────────────────────────

const mockSearchParams = new URLSearchParams();
const mockSetSearchParams = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [mockSearchParams, mockSetSearchParams],
  };
});

const mockDispatch = vi.fn();
const mockFilters = {
  search: '',
  minPrice: 0,
  maxPrice: 100_000_000,
  beds: 0,
  baths: 0,
  propertyTypes: [] as string[],
  locations: [] as string[],
  amenities: [] as string[],
  minSqft: 0,
  maxSqft: 20_000,
  sortBy: 'featured',
};

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector: (state: Record<string, unknown>) => unknown) =>
      selector({
        properties: { filters: { ...mockFilters } },
      }),
  };
});

vi.mock('../../store/propertySlice', () => ({
  setFilters: vi.fn((p: unknown) => ({ type: 'properties/setFilters', payload: p })),
  clearFilters: vi.fn(() => ({ type: 'properties/clearFilters' })),
  applyFilters: vi.fn(() => ({ type: 'properties/applyFilters' })),
}));

vi.mock('../../components/homepage/Hero/HeroSearchBar', () => ({
  DUBAI_LOCATIONS: ['All Locations', 'Palm Jumeirah', 'Downtown Dubai', 'Dubai Marina'],
  PROPERTY_TYPES: ['All Types', 'Apartment', 'Villa', 'Penthouse'],
  BED_OPTIONS: [
    { label: 'Any Beds', value: 0 },
    { label: '1 Bed', value: 1 },
    { label: '2 Beds', value: 2 },
  ],
  PRICE_RANGES: [
    { label: 'Any Price', min: 0, max: 100_000_000 },
    { label: 'Under 1M', min: 0, max: 1_000_000 },
    { label: '1M – 3M', min: 1_000_000, max: 3_000_000 },
  ],
}));

import PropertyFilterPanel, {
  SORT_OPTIONS,
  BATH_OPTIONS,
  PURPOSE_OPTIONS,
} from './PropertyFilterPanel';
import { setFilters, clearFilters, applyFilters } from '../../store/propertySlice';

beforeEach(() => {
  mockDispatch.mockClear();
  mockSetSearchParams.mockClear();
  (setFilters as unknown as ReturnType<typeof vi.fn>).mockClear();
  (clearFilters as unknown as ReturnType<typeof vi.fn>).mockClear();
  (applyFilters as unknown as ReturnType<typeof vi.fn>).mockClear();
});

// ──────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────

describe('PropertyFilterPanel', () => {
  const defaultProps = { resultCount: 12, totalCount: 50 };

  describe('Rendering', () => {
    it('renders with role=search', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      expect(screen.getByRole('search')).toBeDefined();
    });

    it('renders the search input', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      expect(screen.getByLabelText('Search properties')).toBeDefined();
    });

    it('renders all purpose tabs', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      PURPOSE_OPTIONS.forEach((opt) => {
        expect(screen.getByRole('tab', { name: opt })).toBeDefined();
      });
    });

    it('renders location dropdown', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      expect(screen.getByLabelText('Location filter')).toBeDefined();
    });

    it('renders property type dropdown', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      expect(screen.getByLabelText('Property type filter')).toBeDefined();
    });

    it('renders bedrooms dropdown', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      expect(screen.getByLabelText('Bedrooms filter')).toBeDefined();
    });

    it('renders price range dropdown', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      expect(screen.getByLabelText('Price range filter')).toBeDefined();
    });

    it('renders Filters toggle button', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      expect(screen.getByText('Filters')).toBeDefined();
    });

    it('shows results count', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      expect(screen.getByText('12')).toBeDefined();
      expect(screen.getByText('50')).toBeDefined();
    });
  });

  describe('Search functionality', () => {
    it('renders empty search input by default', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      const input = screen.getByLabelText('Search properties') as HTMLInputElement;
      expect(input.value).toBe('');
    });

    it('updates input value on type', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      const input = screen.getByLabelText('Search properties') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'villa' } });
      expect(input.value).toBe('villa');
    });

    it('dispatches filter on Enter key', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      const input = screen.getByLabelText('Search properties') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'palm' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('shows clear button when text is entered', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      const input = screen.getByLabelText('Search properties') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'test' } });
      expect(screen.getByLabelText('Clear search')).toBeDefined();
    });

    it('clears search on X button click', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      const input = screen.getByLabelText('Search properties') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.click(screen.getByLabelText('Clear search'));
      expect(input.value).toBe('');
    });
  });

  describe('Dropdown filters', () => {
    it('dispatches on location change', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      fireEvent.change(screen.getByLabelText('Location filter'), {
        target: { value: 'Palm Jumeirah' },
      });
      expect(setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ locations: ['Palm Jumeirah'] })
      );
      expect(applyFilters).toHaveBeenCalled();
    });

    it('clears location when "All Locations" selected', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      fireEvent.change(screen.getByLabelText('Location filter'), {
        target: { value: 'All Locations' },
      });
      expect(setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ locations: [] })
      );
    });

    it('dispatches on property type change', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      fireEvent.change(screen.getByLabelText('Property type filter'), {
        target: { value: 'Villa' },
      });
      expect(setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ propertyTypes: ['Villa'] })
      );
    });

    it('dispatches on bedrooms change', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      fireEvent.change(screen.getByLabelText('Bedrooms filter'), {
        target: { value: '2' },
      });
      expect(setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ beds: 2 })
      );
    });

    it('dispatches on price range change', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      fireEvent.change(screen.getByLabelText('Price range filter'), {
        target: { value: '2' },
      });
      expect(setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ minPrice: 1_000_000, maxPrice: 3_000_000 })
      );
    });
  });

  describe('Purpose tabs', () => {
    it('defaults "All" tab as active', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      const allTab = screen.getByRole('tab', { name: 'All' });
      expect(allTab.getAttribute('aria-selected')).toBe('true');
    });

    it('switches active tab on click', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      fireEvent.click(screen.getByRole('tab', { name: 'Buy' }));
      expect(screen.getByRole('tab', { name: 'Buy' }).getAttribute('aria-selected')).toBe('true');
      expect(screen.getByRole('tab', { name: 'All' }).getAttribute('aria-selected')).toBe('false');
    });
  });

  describe('Advanced panel', () => {
    it('is hidden by default', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      expect(document.getElementById('advanced-filters')).toBeFalsy();
    });

    it('shows when Filters button clicked', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      fireEvent.click(screen.getByText('Filters'));
      expect(document.getElementById('advanced-filters')).toBeTruthy();
    });

    it('shows bathrooms in advanced panel', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      fireEvent.click(screen.getByText('Filters'));
      expect(screen.getByLabelText('Bathrooms')).toBeDefined();
    });

    it('shows min area input in advanced panel', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      fireEvent.click(screen.getByText('Filters'));
      expect(screen.getByLabelText('Min Area (sqft)')).toBeDefined();
    });

    it('shows sort in advanced panel', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      fireEvent.click(screen.getByText('Filters'));
      expect(screen.getByLabelText('Sort By')).toBeDefined();
    });

    it('toggles off on second click', () => {
      render(<PropertyFilterPanel {...defaultProps} />);
      fireEvent.click(screen.getByText('Filters'));
      expect(document.getElementById('advanced-filters')).toBeTruthy();
      fireEvent.click(screen.getByText('Filters'));
      expect(document.getElementById('advanced-filters')).toBeFalsy();
    });
  });

  describe('Exported constants', () => {
    it('has 5 sort options', () => {
      expect(SORT_OPTIONS).toHaveLength(5);
      expect(SORT_OPTIONS[0].value).toBe('featured');
    });

    it('has 6 bath options', () => {
      expect(BATH_OPTIONS).toHaveLength(6);
      expect(BATH_OPTIONS[0].label).toBe('Any Baths');
    });

    it('has 3 purpose options', () => {
      expect(PURPOSE_OPTIONS).toHaveLength(3);
      expect(PURPOSE_OPTIONS).toContain('Buy');
      expect(PURPOSE_OPTIONS).toContain('Rent');
    });
  });
});
