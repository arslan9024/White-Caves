/**
 * InteractiveMap — Unit Tests
 * Tests: rendering, mobile toggle, loading state, map visibility
 */

import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from '../../store/propertySlice';
import type { MapProperty } from './DubaiMap';

// ── Mock DubaiMap (lazy-loaded) ──────────────────────────────────

vi.mock('./DubaiMap', () => ({
  default: ({ properties, activePropertyId, onPropertyClick }: Record<string, unknown>) => (
    <div
      data-testid="mock-dubai-map"
      data-count={(properties as MapProperty[]).length}
      data-active={activePropertyId as string}
      onClick={() => {
        const props = properties as MapProperty[];
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
    reducer: { properties: propertyReducer },
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
});
