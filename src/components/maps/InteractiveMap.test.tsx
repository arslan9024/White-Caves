/**
 * InteractiveMap — Unit Tests
 * Tests: rendering, mobile toggle, loading state, map visibility
 * W18.1-P0-003: viewport persistence, Redux dispatch, new props
 */

import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from '../../store/propertySlice';
import propertySearchReducer, { setActivePropertyId } from '../../redux/slices/propertySlice';
import type { MapProperty } from './DubaiMap';

// ── Mock store module (useAppDispatch) ────────────────────────────

const mockDispatch = vi.fn();
vi.mock('../../store/store', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: vi.fn(),
  default: {},
}));

// ── Mock DubaiMap (lazy-loaded) ──────────────────────────────────

vi.mock('./DubaiMap', () => ({
  default: ({
    properties,
    activePropertyId,
    onPropertyClick,
    onViewportChange,
    defaultCenter,
    defaultZoom,
  }: Record<string, unknown>) => (
    <div
      data-testid="mock-dubai-map"
      data-count={(properties as MapProperty[]).length}
      data-active={activePropertyId as string}
      data-center={JSON.stringify(defaultCenter ?? null)}
      data-zoom={String(defaultZoom ?? '')}
      onClick={() => {
        const props = properties as MapProperty[];
        if (onViewportChange) {
          (onViewportChange as (bounds: Record<string, number>) => void)({
            north: 25.3,
            south: 25.1,
            east: 55.4,
            west: 55.2,
          });
        }
        if (props.length > 0 && onPropertyClick) {
          (onPropertyClick as (p: MapProperty) => void)(props[0]);
        }
      }}
    >
      Dubai Map Mock
    </div>
  ),
}));

import InteractiveMap from './InteractiveMap';

// ── Helpers ──────────────────────────────────────────────────────

const MOCK_PROPERTIES: MapProperty[] = [
  {
    id: 'p1',
    title: 'Test Property',
    location: 'Palm Jumeirah',
    type: 'Villa',
    purpose: 'buy',
    price: 5_000_000,
    beds: 3,
    baths: 2,
    sqft: 3000,
    image: 'img.jpg',
    featured: true,
  },
];

const createStore = () =>
  configureStore({
    reducer: { properties: propertyReducer, propertySearch: propertySearchReducer },
  });

const renderInteractiveMap = (props: Partial<React.ComponentProps<typeof InteractiveMap>> = {}) => {
  const store = createStore();
  return {
    store,
    ...render(
      <Provider store={store}>
        <InteractiveMap properties={MOCK_PROPERTIES} {...props} />
      </Provider>
    ),
  };
};

// ── Tests ────────────────────────────────────────────────────────

describe('InteractiveMap', () => {
  beforeAll(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render wrapper element', () => {
      renderInteractiveMap();
      expect(screen.getByTestId('interactive-map')).toBeInTheDocument();
    });

    it('should render toggle button', () => {
      renderInteractiveMap();
      expect(screen.getByRole('button', { name: /show map/i })).toBeInTheDocument();
    });

    it('should render DubaiMap when mapVisible is true', () => {
      renderInteractiveMap({ mapVisible: true });
      expect(screen.getByTestId('mock-dubai-map')).toBeInTheDocument();
    });

    it('should pass properties to DubaiMap', () => {
      renderInteractiveMap({ mapVisible: true });
      const map = screen.getByTestId('mock-dubai-map');
      expect(map.dataset.count).toBe('1');
    });

    it('should pass activePropertyId to DubaiMap', () => {
      renderInteractiveMap({ mapVisible: true, activePropertyId: 'p1' });
      const map = screen.getByTestId('mock-dubai-map');
      expect(map.dataset.active).toBe('p1');
    });
  });

  describe('Mobile Toggle', () => {
    it('should toggle map visibility when button is clicked', () => {
      renderInteractiveMap();
      const toggle = screen.getByRole('button', { name: /show map/i });
      fireEvent.click(toggle);
      // After click, label should change to "Hide Map"
      expect(screen.getByRole('button', { name: /hide map/i })).toBeInTheDocument();
    });

    it('should hide map when toggle is clicked again', () => {
      renderInteractiveMap();
      const toggle = screen.getByRole('button', { name: /show map/i });
      fireEvent.click(toggle); // show
      fireEvent.click(screen.getByRole('button', { name: /hide map/i })); // hide
      expect(screen.getByRole('button', { name: /show map/i })).toBeInTheDocument();
    });
  });

  describe('Property Click', () => {
    it('should call onPropertyClick when map marker is clicked', () => {
      const onClick = vi.fn();
      renderInteractiveMap({ mapVisible: true, onPropertyClick: onClick });
      fireEvent.click(screen.getByTestId('mock-dubai-map'));
      expect(onClick).toHaveBeenCalledWith(MOCK_PROPERTIES[0]);
    });
  });

  // W18.1-P0-003 — Viewport persistence + Redux dispatch
  describe('W18.1 — URL param handling', () => {
    it('passes parsed lat/lng/zoom params to DubaiMap', () => {
      window.history.replaceState(null, '', '?lat=25.2048&lng=55.2708&zoom=12');
      renderInteractiveMap({ mapVisible: true });
      const map = screen.getByTestId('mock-dubai-map');
      expect(map.dataset.center).toBe('[25.2048,55.2708]');
      expect(map.dataset.zoom).toBe('12');
      window.history.replaceState(null, '', '?');
    });

    it('renders without crashing when URL has non-numeric lat/lng', () => {
      window.history.replaceState(null, '', '?lat=notanumber&zoom=bad');
      expect(() => renderInteractiveMap()).not.toThrow();
      window.history.replaceState(null, '', '?');
    });
  });

  describe('W18.1 — Map toggle button', () => {
    it('renders map toggle button with aria-label', () => {
      renderInteractiveMap();
      expect(screen.getByRole('button', { name: /show map/i })).toHaveAttribute('aria-label');
    });
  });

  describe('W18.1 — onPropertyClick callback', () => {
    it('onPropertyClick callback is called when map is clicked', () => {
      const onPropertyClick = vi.fn();
      renderInteractiveMap({ mapVisible: true, onPropertyClick });
      fireEvent.click(screen.getByTestId('mock-dubai-map'));
      expect(onPropertyClick).toHaveBeenCalledOnce();
      expect(onPropertyClick).toHaveBeenCalledWith(MOCK_PROPERTIES[0]);
    });
  });

  describe('W18.1 — activePropertyId prop', () => {
    it('activePropertyId prop is accepted without error', () => {
      expect(() =>
        renderInteractiveMap({ activePropertyId: 'prop-xyz', mapVisible: true })
      ).not.toThrow();
    });

    it('activePropertyId null is accepted without error', () => {
      expect(() => renderInteractiveMap({ activePropertyId: null })).not.toThrow();
    });
  });

  describe('W18.1 — onViewportChange prop', () => {
    it('persists viewport changes and calls the callback', () => {
      const onViewportChange = vi.fn();
      renderInteractiveMap({ mapVisible: true, onViewportChange });
      fireEvent.click(screen.getByTestId('mock-dubai-map'));
      expect(onViewportChange).toHaveBeenCalledWith({
        north: 25.3,
        south: 25.1,
        east: 55.4,
        west: 55.2,
      });
      expect(window.location.search).toContain('lat=25.200000');
      expect(window.location.search).toContain('lng=55.300000');
      expect(window.location.search).toContain('zoom=12');
    });
  });

  describe('W18.1 — Redux dispatch', () => {
    it('dispatches setActivePropertyId to Redux when property clicked', () => {
      mockDispatch.mockClear();
      renderInteractiveMap({ mapVisible: true });
      fireEvent.click(screen.getByTestId('mock-dubai-map'));
      expect(mockDispatch).toHaveBeenCalledWith(setActivePropertyId('p1'));
    });

    it('does not dispatch before any click', () => {
      mockDispatch.mockClear();
      renderInteractiveMap();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });
});
