/**
 * InteractiveMap — Unit Tests
 * Tests: rendering, property grouping by location, location click,
 * property click callbacks, featured properties, empty state
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ── Mocks ────────────────────────────────────────────────────────

const mockProperties = [
  {
    id: '1',
    title: 'Palm Villa A',
    location: 'Palm Jumeirah',
    type: 'villa',
    price: 15000000,
    beds: 5,
    baths: 4,
    sqft: 8000,
    amenities: ['pool'],
    images: ['img1.jpg'],
  },
  {
    id: '2',
    title: 'Palm Villa B',
    location: 'Palm Jumeirah',
    type: 'villa',
    price: 20000000,
    beds: 6,
    baths: 5,
    sqft: 10000,
    amenities: ['pool'],
    images: ['img2.jpg'],
  },
  {
    id: '3',
    title: 'Downtown Apt',
    location: 'Downtown Dubai',
    type: 'apartment',
    price: 3500000,
    beds: 2,
    baths: 2,
    sqft: 1500,
    amenities: ['gym'],
    images: ['img3.jpg'],
  },
  {
    id: '4',
    title: 'Marina Studio',
    location: 'Dubai Marina',
    type: 'apartment',
    price: 1200000,
    beds: 1,
    baths: 1,
    sqft: 800,
    amenities: [],
    images: ['img4.jpg'],
  },
];

let mockFilteredProperties = [...mockProperties];

vi.mock('react-redux', () => {
  const mockDispatch = vi.fn();
  return {
    useSelector: (fn: (s: unknown) => unknown) =>
      fn({
        properties: { filteredProperties: mockFilteredProperties },
        propertySearch: { viewportBounds: null, activePropertyId: null },
      }),
    useDispatch: () => mockDispatch,
  };
});

vi.mock('../utils', () => ({
  formatPrice: (price: number) => `AED ${(price / 1000000).toFixed(1)}M`,
}));

vi.mock('./InteractiveMap.styles', () => ({
  InteractiveMapContainer: ({ children }: React.PropsWithChildren) => (
    <div data-testid="map-container">{children}</div>
  ),
  MapHeader: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  MapTitle: ({ children }: React.PropsWithChildren) => <h2>{children}</h2>,
  MapSubtitle: ({ children }: React.PropsWithChildren) => (
    <p data-testid="map-subtitle">{children}</p>
  ),
  MapVisualContainer: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  DubaiMapVisual: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  MapBackground: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  DubaiOutlineSVG: ({ children }: React.PropsWithChildren<Record<string, unknown>>) => (
    <svg>{children}</svg>
  ),
  LocationMarkers: ({ children }: React.PropsWithChildren) => (
    <div data-testid="markers">{children}</div>
  ),
  LocationMarker: ({
    children,
    onClick,
  }: React.PropsWithChildren<{ onClick?: () => void; [key: string]: unknown }>) => (
    <button data-testid="location-marker" onClick={onClick}>
      {children}
    </button>
  ),
  MarkerCount: ({ children }: React.PropsWithChildren) => (
    <span data-testid="marker-count">{children}</span>
  ),
  SidePanel: ({ children }: React.PropsWithChildren) => (
    <div data-testid="side-panel">{children}</div>
  ),
  SectionTitleSmall: ({ children }: React.PropsWithChildren) => <h4>{children}</h4>,
  ResultsSection: ({ children }: React.PropsWithChildren) => <section>{children}</section>,
  ResultsHeader: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  ResultsTitle: ({ children }: React.PropsWithChildren) => <h3>{children}</h3>,
  ResultsMeta: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
  PropertyLocation: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
  LocationList: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  LocationItem: ({
    children,
    onClick,
  }: React.PropsWithChildren<{ onClick?: () => void; [key: string]: unknown }>) => (
    <div data-testid="location-item" onClick={onClick}>
      {children}
    </div>
  ),
  LocationName: ({ children }: React.PropsWithChildren) => (
    <span data-testid="location-name">{children}</span>
  ),
  PropertyCount: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
  PropertiesGrid: ({ children }: React.PropsWithChildren) => (
    <div data-testid="properties-grid">{children}</div>
  ),
  PropertyCard: ({ children, onClick }: React.PropsWithChildren<{ onClick?: () => void }>) => (
    <div data-testid="property-card" onClick={onClick}>
      {children}
    </div>
  ),
  PropertyImage: (props: { src: string; alt: string }) => <img {...props} />,
  PropertyInfo: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  PropertyTitle: ({ children }: React.PropsWithChildren) => (
    <span data-testid="property-title">{children}</span>
  ),
  PropertyPrice: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
  PropertyDetails: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  DetailBadge: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
}));

import InteractiveMap from './InteractiveMap';

describe('InteractiveMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFilteredProperties = [...mockProperties];
  });

  // ────── Basic Rendering ──────

  it('renders the map title', () => {
    render(<InteractiveMap />);
    expect(screen.getByText('Explore Properties by Location')).toBeInTheDocument();
  });

  it('shows properties count and areas count in subtitle', () => {
    render(<InteractiveMap />);
    const subtitle = screen.getByTestId('map-subtitle');
    expect(subtitle.textContent).toContain('4 properties');
    expect(subtitle.textContent).toContain('3 areas');
  });

  // ────── Location Markers ──────

  it('renders location markers for each area', () => {
    render(<InteractiveMap />);
    const markers = screen.getAllByTestId('location-marker');
    expect(markers).toHaveLength(3); // Palm Jumeirah, Downtown Dubai, Dubai Marina
  });

  it('shows correct property counts in markers', () => {
    render(<InteractiveMap />);
    const counts = screen.getAllByTestId('marker-count');
    // Palm: 2, Downtown: 1, Marina: 1
    const values = counts.map(c => c.textContent);
    expect(values).toContain('2');
    expect(values).toContain('1');
  });

  // ────── Side Panel ──────

  it('renders side panel with location items', () => {
    render(<InteractiveMap />);
    const sidePanel = screen.getByTestId('side-panel');
    expect(sidePanel).toBeInTheDocument();

    const locationNames = screen.getAllByTestId('location-name');
    const names = locationNames.map(n => n.textContent);
    expect(names).toContain('Palm Jumeirah');
    expect(names).toContain('Downtown Dubai');
    expect(names).toContain('Dubai Marina');
  });

  it('shows property count per location', () => {
    render(<InteractiveMap />);
    expect(screen.getByText('2 properties')).toBeInTheDocument();
    expect(screen.getAllByText('1 property')).toHaveLength(2);
  });

  // ────── Featured Properties (no selection) ──────

  it('shows featured properties when no location selected', () => {
    render(<InteractiveMap />);
    expect(screen.getByText('Featured Properties')).toBeInTheDocument();
  });

  // ────── Location Click ──────

  it('shows properties for selected location', () => {
    render(<InteractiveMap />);
    const locationItems = screen.getAllByTestId('location-item');
    // Click Palm Jumeirah
    const palmItem = locationItems.find(item => item.textContent?.includes('Palm Jumeirah'));
    fireEvent.click(palmItem!);

    expect(screen.getByText(/Properties in Palm Jumeirah/)).toBeInTheDocument();
    expect(screen.getByText('2 listings')).toBeInTheDocument();
  });

  it('deselects location when clicking same location again', () => {
    render(<InteractiveMap />);
    const locationItems = screen.getAllByTestId('location-item');
    const palmItem = locationItems.find(item => item.textContent?.includes('Palm Jumeirah'));

    // Select
    fireEvent.click(palmItem!);
    expect(screen.getByText(/Properties in Palm Jumeirah/)).toBeInTheDocument();

    // Deselect
    fireEvent.click(palmItem!);
    expect(screen.queryByText(/Properties in Palm Jumeirah/)).not.toBeInTheDocument();
    expect(screen.getByText('Featured Properties')).toBeInTheDocument();
  });

  // ────── Property Selection Callback ──────

  it('calls onPropertySelect when property card clicked', () => {
    const onSelect = vi.fn();
    render(<InteractiveMap onPropertySelect={onSelect} />);

    // Click a featured property card
    const cards = screen.getAllByTestId('property-card');
    fireEvent.click(cards[0]);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
  });

  // ────── Empty State ──────

  it('handles no properties gracefully', () => {
    mockFilteredProperties = [];
    render(<InteractiveMap />);

    expect(screen.getByText('Explore Properties by Location')).toBeInTheDocument();
    expect(screen.getByTestId('map-subtitle').textContent).toContain('0 properties');
    expect(screen.queryByTestId('location-marker')).not.toBeInTheDocument();
  });

  // ────── Price Formatting ──────

  it('displays formatted prices for locations', () => {
    render(<InteractiveMap />);
    // Average price for Palm: (15M + 20M)/2 = 17.5M
    expect(screen.getByText('Avg. AED 17.5M')).toBeInTheDocument();
    // Downtown: 3.5M
    expect(screen.getByText('Avg. AED 3.5M')).toBeInTheDocument();
  });
});
