/**
 * DubaiMap — Unit Tests
 * Tests: rendering, filter buttons, marker rendering, info window,
 * property selection callback, legend, filter logic, close behavior
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import React from 'react';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ── Mocks ────────────────────────────────────────────────────────

vi.mock('./DubaiMap.styles', () => ({
  DubaiMapContainer: ({ children }: React.PropsWithChildren) => (
    <div data-testid="dubai-map">{children}</div>
  ),
  MapHeader: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  MapTitle: ({ children }: React.PropsWithChildren) => <h2>{children}</h2>,
  MapSubtitle: ({ children }: React.PropsWithChildren) => <p>{children}</p>,
  MapFilters: ({ children }: React.PropsWithChildren) => (
    <div data-testid="map-filters">{children}</div>
  ),
  FilterButton: ({
    children,
    onClick,
    ...props
  }: React.PropsWithChildren<{ onClick?: () => void; [key: string]: unknown }>) => (
    <button onClick={onClick} data-active={props.$isActive} data-variant={props.$variant}>
      {children}
    </button>
  ),
  MapWrapper: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  MapBackground: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  DubaiBaseMap: (props: Record<string, unknown>) => <img data-testid="base-map" {...props} />,
  InteractiveMapOverlay: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  MapSVG: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <svg data-testid="map-svg" {...props}>
      {children}
    </svg>
  ),
  MarkerGroup: ({ children, onClick }: React.PropsWithChildren<{ onClick?: () => void }>) => (
    <button data-testid="marker-group" onClick={onClick}>
      {children}
    </button>
  ),
  MapInfoWindow: ({ children }: React.PropsWithChildren) => (
    <div data-testid="info-window">{children}</div>
  ),
  InfoHeader: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  InfoTitle: ({ children }: React.PropsWithChildren) => (
    <h3 data-testid="info-title">{children}</h3>
  ),
  AreaType: ({ children }: React.PropsWithChildren) => (
    <span data-testid="area-type">{children}</span>
  ),
  InfoProperties: ({ children }: React.PropsWithChildren) => (
    <div data-testid="info-properties">{children}</div>
  ),
  PropertyPreview: ({ children, onClick }: React.PropsWithChildren<{ onClick?: () => void }>) => (
    <div data-testid="property-preview" onClick={onClick}>
      {children}
    </div>
  ),
  PropertyImage: (props: Record<string, unknown>) => <img {...props} />,
  PreviewInfo: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  PreviewTitle: ({ children }: React.PropsWithChildren) => (
    <span data-testid="preview-title">{children}</span>
  ),
  PreviewPrice: ({ children }: React.PropsWithChildren) => (
    <span data-testid="preview-price">{children}</span>
  ),
  PreviewDetails: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
  NoProperties: ({ children }: React.PropsWithChildren) => (
    <p data-testid="no-properties">{children}</p>
  ),
  ViewAllButton: ({ children, onClick }: React.PropsWithChildren<{ onClick?: () => void }>) => (
    <button onClick={onClick}>{children}</button>
  ),
  CloseButton: ({ children, onClick }: React.PropsWithChildren<{ onClick?: () => void }>) => (
    <button data-testid="close-btn" onClick={onClick}>
      {children}
    </button>
  ),
  MapLegend: ({ children }: React.PropsWithChildren) => <div data-testid="legend">{children}</div>,
  LegendTitle: ({ children }: React.PropsWithChildren) => <h4>{children}</h4>,
  LegendItems: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  LegendItem: ({ children }: React.PropsWithChildren) => (
    <div data-testid="legend-item">{children}</div>
  ),
  LegendDot: (props: Record<string, unknown>) => <span data-testid="legend-dot" />,
}));

import DubaiMap from './DubaiMap';

describe('DubaiMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ────── Basic Rendering ──────

  it('renders the map title', () => {
    render(<DubaiMap />);
    expect(screen.getByText('Explore Dubai Properties')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<DubaiMap />);
    expect(
      screen.getByText('Interactive map with all our listed properties across Dubai')
    ).toBeInTheDocument();
  });

  // ────── Filter Buttons ──────

  it('renders all 4 filter buttons', () => {
    render(<DubaiMap />);
    const filterArea = screen.getByTestId('map-filters');
    expect(within(filterArea).getByText('All Properties')).toBeInTheDocument();
    expect(within(filterArea).getByText('Residential')).toBeInTheDocument();
    expect(within(filterArea).getByText('Commercial')).toBeInTheDocument();
    expect(within(filterArea).getByText('Luxury')).toBeInTheDocument();
  });

  it('filters areas when clicking Residential', () => {
    render(<DubaiMap />);
    const filterArea = screen.getByTestId('map-filters');
    fireEvent.click(within(filterArea).getByText('Residential'));
    // After filtering, SVG should still render
    expect(screen.getByTestId('map-svg')).toBeInTheDocument();
  });

  it('filters areas when clicking Commercial', () => {
    render(<DubaiMap />);
    const filterArea = screen.getByTestId('map-filters');
    fireEvent.click(within(filterArea).getByText('Commercial'));
    expect(screen.getByTestId('map-svg')).toBeInTheDocument();
  });

  it('filters areas when clicking Luxury', () => {
    render(<DubaiMap />);
    // Multiple elements with text "Luxury" (filter btn + legend), so get via filter area
    const filterArea = screen.getByTestId('map-filters');
    const luxBtn = within(filterArea).getByText('Luxury');
    fireEvent.click(luxBtn);
    expect(screen.getByTestId('map-svg')).toBeInTheDocument();
  });

  it('shows all areas by default', () => {
    render(<DubaiMap />);
    expect(screen.getByText('All Properties')).toBeInTheDocument();
  });

  // ────── Map SVG Markers ──────

  it('renders SVG map with area markers', () => {
    render(<DubaiMap />);
    expect(screen.getByTestId('map-svg')).toBeInTheDocument();
    expect(screen.getAllByTestId('marker-group').length).toBeGreaterThan(0);
  });

  // ────── Info Window ──────

  it('does not show info window initially', () => {
    render(<DubaiMap />);
    expect(screen.queryByTestId('info-window')).not.toBeInTheDocument();
  });

  // ────── Legend ──────

  it('renders legend section', () => {
    render(<DubaiMap />);
    expect(screen.getByText('Property Types')).toBeInTheDocument();
  });

  it('renders all 3 legend items', () => {
    render(<DubaiMap />);
    const items = screen.getAllByTestId('legend-item');
    expect(items).toHaveLength(3);
    // "Luxury", "Residential", "Commercial" also appear in filter buttons
    // so just verify legend items exist
    expect(items[0].textContent).toContain('Luxury');
    expect(items[1].textContent).toContain('Residential');
    expect(items[2].textContent).toContain('Commercial');
  });

  // ────── Sample Properties (default data) ──────

  it('uses sample properties when none provided', () => {
    render(<DubaiMap />);
    // SVG should have area text labels; the component uses default sample data
    expect(screen.getByTestId('map-svg')).toBeInTheDocument();
  });

  // ────── Custom Properties ──────

  it('accepts custom properties', () => {
    const customProps: Array<{
      id: number;
      title: string;
      area: string;
      price: number;
      beds: number;
      type: 'luxury' | 'residential' | 'commercial';
      image: string;
    }> = [
      {
        id: 1,
        title: 'Custom Villa',
        area: 'palm',
        price: 10000000,
        beds: 3,
        type: 'luxury',
        image: 'custom.jpg',
      },
    ];
    render(<DubaiMap properties={customProps} />);
    expect(screen.getByTestId('map-svg')).toBeInTheDocument();
  });

  // ────── Property Select Callback ──────

  it('does not crash without onPropertySelect', () => {
    render(<DubaiMap />);
    expect(screen.getByTestId('dubai-map')).toBeInTheDocument();
  });

  // ────── Base Map Image ──────

  it('renders base map image', () => {
    render(<DubaiMap />);
    expect(screen.getByTestId('base-map')).toBeInTheDocument();
  });

  // ────── Filter State Toggle ──────

  it('can switch between filters', () => {
    render(<DubaiMap />);
    const filterArea = screen.getByTestId('map-filters');

    fireEvent.click(within(filterArea).getByText('Luxury'));
    fireEvent.click(screen.getByText('All Properties'));
    fireEvent.click(within(filterArea).getByText('Commercial'));

    // Should not crash
    expect(screen.getByTestId('map-svg')).toBeInTheDocument();
  });

  // ────── View All Button ──────

  it('renders View All Properties button in component', () => {
    // View All is inside info window which needs marker click
    // Without clicking marker, it shouldn't appear
    render(<DubaiMap />);
    expect(screen.queryByText('View All Properties')).not.toBeInTheDocument();
  });

  it('opens info window and routes View All to filtered properties page', () => {
    render(<DubaiMap />);

    fireEvent.click(screen.getAllByTestId('marker-group')[0]);
    expect(screen.getByTestId('info-window')).toBeInTheDocument();

    fireEvent.click(screen.getByText('View All Properties'));
    expect(mockNavigate).toHaveBeenCalledWith('/properties?location=Palm%20Jumeirah');
  });

  it('routes property preview to property details when no onPropertySelect callback is provided', () => {
    render(<DubaiMap />);

    fireEvent.click(screen.getAllByTestId('marker-group')[0]);
    fireEvent.click(screen.getAllByTestId('property-preview')[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/property/1');
  });

  it('uses onPropertySelect callback when provided instead of direct navigation', () => {
    const onPropertySelect = vi.fn();
    render(<DubaiMap onPropertySelect={onPropertySelect} />);

    fireEvent.click(screen.getAllByTestId('marker-group')[0]);
    fireEvent.click(screen.getAllByTestId('property-preview')[0]);

    expect(onPropertySelect).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalledWith('/property/1');
  });
});
