/**
 * HeroSearchBar — Test Suite
 * ==========================
 * Tests for the Hero inline search bar: rendering, dropdowns, navigation,
 * Redux filter dispatch, popular tag clicks, keyboard support, and a11y.
 *
 * 28 tests across 6 describe blocks.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ─── Mocks ────────────────────────────────────────────────────

// Mock framer-motion — render plain elements
vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop: string) => {
        return React.forwardRef(function MotionProxy(
          props: Record<string, unknown>,
          ref: React.Ref<HTMLElement>
        ) {
          const { variants, initial, animate, whileHover, whileTap, transition, style, ...rest } =
            props;
          return React.createElement(prop, { ...rest, style, ref });
        });
      },
    }
  ),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector: (state: Record<string, unknown>) => unknown) =>
      selector({
        homepage: {
          locationTrends: [],
        },
      }),
  };
});

// Mock propertySlice actions
vi.mock('../../../store/propertySlice', () => ({
  setFilters: vi.fn((payload: unknown) => ({ type: 'properties/setFilters', payload })),
  clearFilters: vi.fn(() => ({ type: 'properties/clearFilters' })),
}));

// Import after mocks
import HeroSearchBar, {
  DUBAI_LOCATIONS,
  PROPERTY_TYPES,
  BED_OPTIONS,
  PRICE_RANGES,
} from './HeroSearchBar';
import { setFilters, clearFilters } from '../../../store/propertySlice';

beforeEach(() => {
  mockNavigate.mockClear();
  mockDispatch.mockClear();
  (setFilters as unknown as ReturnType<typeof vi.fn>).mockClear();
  (clearFilters as unknown as ReturnType<typeof vi.fn>).mockClear();
});

// ──────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────

describe('HeroSearchBar', () => {
  describe('Rendering', () => {
    it('renders the search container with role=search', () => {
      render(<HeroSearchBar />);
      expect(screen.getByRole('search')).toBeDefined();
    });

    it('renders all four dropdown selects', () => {
      render(<HeroSearchBar />);
      expect(screen.getByLabelText('Select location')).toBeDefined();
      expect(screen.getByLabelText('Select property type')).toBeDefined();
      expect(screen.getByLabelText('Select bedrooms')).toBeDefined();
      expect(screen.getByLabelText('Select price range')).toBeDefined();
    });

    it('renders the "Find Now" search button', () => {
      render(<HeroSearchBar />);
      expect(screen.getByLabelText('Search properties')).toBeDefined();
      expect(screen.getByText('Find Now')).toBeDefined();
    });

    it('renders popular tag buttons', () => {
      render(<HeroSearchBar />);
      expect(screen.getByText('Popular:')).toBeDefined();
      // Tags also appear as select options, so query by role=button
      const tagButtons = screen
        .getAllByRole('button')
        .filter(btn => btn.classList.contains('hero-search-tag'));
      const tagTexts = tagButtons.map(btn => btn.textContent);
      expect(tagTexts).toContain('Palm Jumeirah');
      expect(tagTexts).toContain('Downtown Dubai');
      expect(tagTexts).toContain('Dubai Marina');
      expect(tagTexts).toContain('Penthouse');
    });
  });

  describe('Location dropdown', () => {
    it('shows all Dubai locations as options', () => {
      render(<HeroSearchBar />);
      const select = screen.getByLabelText('Select location') as HTMLSelectElement;
      const options = Array.from(select.options).map(o => o.text);
      DUBAI_LOCATIONS.forEach(loc => {
        expect(options).toContain(loc);
      });
    });

    it('defaults to "All Locations"', () => {
      render(<HeroSearchBar />);
      const select = screen.getByLabelText('Select location') as HTMLSelectElement;
      expect(select.value).toBe('All Locations');
    });

    it('updates value when changed', () => {
      render(<HeroSearchBar />);
      const select = screen.getByLabelText('Select location') as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'Palm Jumeirah' } });
      expect(select.value).toBe('Palm Jumeirah');
    });
  });

  describe('Property type dropdown', () => {
    it('shows all property types', () => {
      render(<HeroSearchBar />);
      const select = screen.getByLabelText('Select property type') as HTMLSelectElement;
      const options = Array.from(select.options).map(o => o.text);
      PROPERTY_TYPES.forEach(type => {
        expect(options).toContain(type);
      });
    });

    it('defaults to "All Types"', () => {
      render(<HeroSearchBar />);
      const select = screen.getByLabelText('Select property type') as HTMLSelectElement;
      expect(select.value).toBe('All Types');
    });
  });

  describe('Bedrooms dropdown', () => {
    it('shows all bed options', () => {
      render(<HeroSearchBar />);
      const select = screen.getByLabelText('Select bedrooms') as HTMLSelectElement;
      const options = Array.from(select.options).map(o => o.text);
      BED_OPTIONS.forEach(opt => {
        expect(options).toContain(opt.label);
      });
    });

    it('defaults to "Any Beds"', () => {
      render(<HeroSearchBar />);
      const select = screen.getByLabelText('Select bedrooms') as HTMLSelectElement;
      expect(select.value).toBe('0');
    });
  });

  describe('Price range dropdown', () => {
    it('shows all price ranges', () => {
      render(<HeroSearchBar />);
      const select = screen.getByLabelText('Select price range') as HTMLSelectElement;
      const options = Array.from(select.options).map(o => o.text);
      PRICE_RANGES.forEach(range => {
        expect(options).toContain(range.label);
      });
    });

    it('defaults to "Any Price"', () => {
      render(<HeroSearchBar />);
      const select = screen.getByLabelText('Select price range') as HTMLSelectElement;
      expect(select.value).toBe('0');
    });
  });

  describe('Search navigation', () => {
    it('navigates to /properties with mode=buy when defaults are kept', () => {
      render(<HeroSearchBar />);
      fireEvent.click(screen.getByLabelText('Search properties'));
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/properties?mode=buy');
    });

    it('dispatches clearFilters before every search', () => {
      render(<HeroSearchBar />);
      fireEvent.click(screen.getByLabelText('Search properties'));
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'properties/clearFilters' });
    });

    it('navigates with location param when a community is selected', () => {
      render(<HeroSearchBar />);
      fireEvent.change(screen.getByLabelText('Select location'), {
        target: { value: 'Dubai Marina' },
      });
      fireEvent.click(screen.getByLabelText('Search properties'));
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('location=Dubai+Marina'));
    });

    it('navigates with type param when a property type is selected', () => {
      render(<HeroSearchBar />);
      fireEvent.change(screen.getByLabelText('Select property type'), {
        target: { value: 'Villa' },
      });
      fireEvent.click(screen.getByLabelText('Search properties'));
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('type=Villa'));
    });

    it('navigates with beds param when bedrooms are selected', () => {
      render(<HeroSearchBar />);
      fireEvent.change(screen.getByLabelText('Select bedrooms'), {
        target: { value: '3' },
      });
      fireEvent.click(screen.getByLabelText('Search properties'));
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('beds=3'));
    });

    it('navigates with price params when a price range is selected', () => {
      render(<HeroSearchBar />);
      fireEvent.change(screen.getByLabelText('Select price range'), {
        target: { value: '3' }, // 3M – 5M
      });
      fireEvent.click(screen.getByLabelText('Search properties'));
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('minPrice=3000000'));
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('maxPrice=5000000'));
    });

    it('dispatches setFilters with location when one is selected', () => {
      render(<HeroSearchBar />);
      fireEvent.change(screen.getByLabelText('Select location'), {
        target: { value: 'DIFC' },
      });
      fireEvent.click(screen.getByLabelText('Search properties'));
      // Second dispatch call is setFilters (first is clearFilters)
      expect(setFilters).toHaveBeenCalledWith(expect.objectContaining({ locations: ['DIFC'] }));
    });

    it('dispatches setFilters with propertyTypes when one is selected', () => {
      render(<HeroSearchBar />);
      fireEvent.change(screen.getByLabelText('Select property type'), {
        target: { value: 'Penthouse' },
      });
      fireEvent.click(screen.getByLabelText('Search properties'));
      expect(setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ propertyTypes: ['Penthouse'] })
      );
    });

    it('builds combined query params when multiple filters are selected', () => {
      render(<HeroSearchBar />);
      fireEvent.change(screen.getByLabelText('Select location'), {
        target: { value: 'Emirates Hills' },
      });
      fireEvent.change(screen.getByLabelText('Select property type'), {
        target: { value: 'Villa' },
      });
      fireEvent.change(screen.getByLabelText('Select bedrooms'), {
        target: { value: '5' },
      });
      fireEvent.click(screen.getByLabelText('Search properties'));

      const url = mockNavigate.mock.calls[0][0] as string;
      expect(url).toContain('location=Emirates+Hills');
      expect(url).toContain('type=Villa');
      expect(url).toContain('beds=5');
    });

    it('handles Enter key to trigger search', () => {
      render(<HeroSearchBar />);
      fireEvent.change(screen.getByLabelText('Select location'), {
        target: { value: 'JBR' },
      });
      fireEvent.keyDown(screen.getByRole('search'), { key: 'Enter' });
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('location=JBR'));
    });
  });

  describe('Popular tags', () => {
    /** Helper: get tag button by text (avoids matching select options) */
    const getTagButton = (text: string) => {
      const buttons = screen
        .getAllByRole('button')
        .filter(btn => btn.classList.contains('hero-search-tag') && btn.textContent === text);
      return buttons[0];
    };

    it('sets location when a location tag is clicked', () => {
      render(<HeroSearchBar />);
      fireEvent.click(getTagButton('Palm Jumeirah'));
      const select = screen.getByLabelText('Select location') as HTMLSelectElement;
      expect(select.value).toBe('Palm Jumeirah');
    });

    it('sets property type when a type tag is clicked', () => {
      render(<HeroSearchBar />);
      fireEvent.click(getTagButton('Penthouse'));
      const select = screen.getByLabelText('Select property type') as HTMLSelectElement;
      expect(select.value).toBe('Penthouse');
    });

    it('tag click does not auto-navigate', () => {
      render(<HeroSearchBar />);
      fireEvent.click(getTagButton('Downtown Dubai'));
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Exported constants', () => {
    it('exports 16 Dubai locations including All Locations', () => {
      expect(DUBAI_LOCATIONS).toHaveLength(16);
      expect(DUBAI_LOCATIONS[0]).toBe('All Locations');
    });

    it('exports 8 property types including All Types', () => {
      expect(PROPERTY_TYPES).toHaveLength(8);
      expect(PROPERTY_TYPES[0]).toBe('All Types');
    });

    it('exports 7 bed options', () => {
      expect(BED_OPTIONS).toHaveLength(7);
    });

    it('exports 8 price ranges from Any Price to 50M+', () => {
      expect(PRICE_RANGES).toHaveLength(8);
      expect(PRICE_RANGES[0].label).toBe('Any Price');
      expect(PRICE_RANGES[PRICE_RANGES.length - 1].label).toBe('50M+');
    });
  });
});
