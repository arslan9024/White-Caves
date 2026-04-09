/**
 * DubaiMap — Unit Tests
 * Tests: rendering, property markers, community overlays, legend,
 * click handlers, price formatting, responsive behavior
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from '../../store/propertySlice';

// ── Mock react-leaflet entirely ──────────────────────────────────

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children, className, style, ...props }: Record<string, unknown>) => (
    <div
      data-testid="leaflet-map"
      className={className as string}
      style={style as React.CSSProperties}
      data-center={JSON.stringify(props.center)}
      data-zoom={props.zoom}
    >
      {children as React.ReactNode}
    </div>
  ),
  TileLayer: ({ url }: { url: string }) => (
    <div data-testid="tile-layer" data-url={url} />
  ),
  Marker: ({ children, position, eventHandlers }: Record<string, unknown>) => (
    <div
      data-testid="map-marker"
      data-position={JSON.stringify(position)}
      onClick={() => (eventHandlers as Record<string, () => void>)?.click?.()}
    >
      {children as React.ReactNode}
    </div>
  ),
  Popup: ({ children, className }: Record<string, unknown>) => (
    <div data-testid="map-popup" className={className as string}>
      {children as React.ReactNode}
    </div>
  ),
  Circle: ({ children, center, radius, eventHandlers }: Record<string, unknown>) => (
    <div
      data-testid="map-circle"
      data-center={JSON.stringify(center)}
      data-radius={radius}
      onClick={() => (eventHandlers as Record<string, () => void>)?.click?.()}
    >
      {children as React.ReactNode}
    </div>
  ),
  useMap: () => ({
    setView: vi.fn(),
    fitBounds: vi.fn(),
  }),
}));

// Mock Leaflet itself
vi.mock('leaflet', () => ({
  default: {
    Icon: { Default: { prototype: { _getIconUrl: null }, mergeOptions: vi.fn() } },
    divIcon: vi.fn(() => ({})),
    latLngBounds: vi.fn(() => ({})),
  },
  Icon: { Default: { prototype: { _getIconUrl: null }, mergeOptions: vi.fn() } },
  divIcon: vi.fn(() => ({})),
  latLngBounds: vi.fn(() => ({})),
}));

// Mock Leaflet image imports
vi.mock('leaflet/dist/images/marker-icon-2x.png', () => ({ default: 'marker-2x.png' }));
vi.mock('leaflet/dist/images/marker-icon.png', () => ({ default: 'marker.png' }));
vi.mock('leaflet/dist/images/marker-shadow.png', () => ({ default: 'marker-shadow.png' }));

import DubaiMap, { type MapProperty } from './DubaiMap';

// ── Helpers ──────────────────────────────────────────────────────

const MOCK_PROPERTIES: MapProperty[] = [
  { id: 'p1', title: 'Palm Villa', location: 'Palm Jumeirah', type: 'Villa', purpose: 'buy', price: 8_000_000, beds: 4, baths: 3, sqft: 5000, image: 'img1.jpg', featured: true },
  { id: 'p2', title: 'Marina Apartment', location: 'Dubai Marina', type: 'Apartment', purpose: 'rent', price: 150_000, beds: 2, baths: 2, sqft: 1200, image: 'img2.jpg', featured: false },
  { id: 'p3', title: 'Downtown Penthouse', location: 'Downtown Dubai', type: 'Penthouse', purpose: 'buy', price: 12_000_000, beds: 3, baths: 3, sqft: 3500, image: 'img3.jpg', featured: true },
];

const createStore = () =>
  configureStore({
    reducer: { properties: propertyReducer },
  });

const renderMap = (props: Partial<React.ComponentProps<typeof DubaiMap>> = {}) => {
  const store = createStore();
  return {
    store,
    ...render(
      <Provider store={store}>
        <DubaiMap properties={MOCK_PROPERTIES} {...props} />
      </Provider>
    ),
  };
};

// ── Tests ────────────────────────────────────────────────────────

describe('DubaiMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────

  describe('Rendering', () => {
    it('should render map container', () => {
      renderMap();
      expect(screen.getByTestId('dubai-map')).toBeInTheDocument();
    });

    it('should render Leaflet MapContainer', () => {
      renderMap();
      expect(screen.getByTestId('leaflet-map')).toBeInTheDocument();
    });

    it('should render tile layer with OSM URL', () => {
      renderMap();
      const tile = screen.getByTestId('tile-layer');
      expect(tile.dataset.url).toContain('openstreetmap');
    });

    it('should apply custom height', () => {
      renderMap({ height: '400px' });
      const container = screen.getByTestId('dubai-map');
      expect(container.style.height).toBe('400px');
    });

    it('should apply custom className', () => {
      renderMap({ className: 'my-custom-map' });
      const container = screen.getByTestId('dubai-map');
      expect(container.classList.contains('my-custom-map')).toBe(true);
    });
  });

  // ── Property Markers ──────────────────────────────────────────

  describe('Property Markers', () => {
    it('should render one marker per property', () => {
      renderMap();
      const markers = screen.getAllByTestId('map-marker');
      expect(markers).toHaveLength(3);
    });

    it('should render property titles in popups', () => {
      renderMap();
      expect(screen.getByText('Palm Villa')).toBeInTheDocument();
      expect(screen.getByText('Marina Apartment')).toBeInTheDocument();
      expect(screen.getByText('Downtown Penthouse')).toBeInTheDocument();
    });

    it('should render property types in popups', () => {
      renderMap();
      expect(screen.getByText('Villa')).toBeInTheDocument();
      expect(screen.getByText('Apartment')).toBeInTheDocument();
      expect(screen.getByText('Penthouse')).toBeInTheDocument();
    });

    it('should render property locations in popups', () => {
      renderMap();
      // Locations appear in both property popups and community popups
      // Just verify they exist somewhere in the rendered output
      const palmTexts = screen.getAllByText('Palm Jumeirah');
      const marinaTexts = screen.getAllByText('Dubai Marina');
      const downtownTexts = screen.getAllByText('Downtown Dubai');
      expect(palmTexts.length).toBeGreaterThanOrEqual(1);
      expect(marinaTexts.length).toBeGreaterThanOrEqual(1);
      expect(downtownTexts.length).toBeGreaterThanOrEqual(1);
    });

    it('should render formatted prices in popups', () => {
      renderMap();
      expect(screen.getByText('AED 8.0M')).toBeInTheDocument();
      expect(screen.getByText('AED 150K')).toBeInTheDocument();
      expect(screen.getByText('AED 12.0M')).toBeInTheDocument();
    });

    it('should render specs (beds, baths, sqft) in popups', () => {
      renderMap();
      // "4 BD" is unique to Palm Villa
      expect(screen.getByText('4 BD')).toBeInTheDocument();
      // "3 BA" appears in both p1 and p3
      const bathTexts = screen.getAllByText('3 BA');
      expect(bathTexts.length).toBe(2);
      expect(screen.getByText('5,000 sqft')).toBeInTheDocument();
    });

    it('should show featured badges on featured properties', () => {
      renderMap();
      const featuredBadges = screen.getAllByText('★ Featured');
      expect(featuredBadges).toHaveLength(2); // p1 and p3 are featured
    });

    it('should call onPropertyClick when marker is clicked', () => {
      const onClick = vi.fn();
      renderMap({ onPropertyClick: onClick });
      const markers = screen.getAllByTestId('map-marker');
      fireEvent.click(markers[0]);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should render no markers when properties is empty', () => {
      renderMap({ properties: [] });
      expect(screen.queryAllByTestId('map-marker')).toHaveLength(0);
    });
  });

  // ── Community Overlays ─────────────────────────────────────────

  describe('Community Overlays', () => {
    it('should render community circles when showCommunities is true', () => {
      renderMap({ showCommunities: true });
      const circles = screen.getAllByTestId('map-circle');
      expect(circles.length).toBeGreaterThan(0);
    });

    it('should render 15 community circles', () => {
      renderMap();
      const circles = screen.getAllByTestId('map-circle');
      expect(circles).toHaveLength(15);
    });

    it('should hide community circles when showCommunities is false', () => {
      renderMap({ showCommunities: false });
      expect(screen.queryAllByTestId('map-circle')).toHaveLength(0);
    });

    it('should show community stats for communities with properties', () => {
      renderMap();
      // 3 communities each have 1 property → "1 property" appears 3 times
      const propertyTexts = screen.getAllByText('1 property');
      expect(propertyTexts).toHaveLength(3);
    });

    it('should show View Properties button in community popups', () => {
      renderMap();
      const buttons = screen.getAllByText('View Properties →');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  // ── Legend ─────────────────────────────────────────────────────

  describe('Legend', () => {
    it('should render map legend', () => {
      renderMap();
      expect(screen.getByText('Featured')).toBeInTheDocument();
      expect(screen.getByText('Standard')).toBeInTheDocument();
      expect(screen.getByText('Community')).toBeInTheDocument();
    });
  });

  // ── Active Property ────────────────────────────────────────────

  describe('Active Property Highlight', () => {
    it('should apply active class to active property popup', () => {
      renderMap({ activePropertyId: 'p1' });
      const popupCards = document.querySelectorAll('.property-popup-card');
      const activeCard = Array.from(popupCards).find((c) =>
        c.classList.contains('active')
      );
      expect(activeCard).toBeTruthy();
    });

    it('should not apply active class when no activePropertyId', () => {
      renderMap({ activePropertyId: null });
      const activeCards = document.querySelectorAll('.property-popup-card.active');
      expect(activeCards).toHaveLength(0);
    });
  });
});
