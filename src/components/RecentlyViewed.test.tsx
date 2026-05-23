/**
 * RecentlyViewed.tsx — Comprehensive Unit Tests
 * Batch 37 | Recently viewed properties hook + component
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

/* ── Mocks ──────────────────────────────────────────────── */

// Mock safeStorage
const mockStorage: Record<string, unknown> = {};
vi.mock('../utils/safeStorage', () => ({
  safeStorage: {
    getJSON: vi.fn((key: string, fallback: unknown) => mockStorage[key] ?? fallback),
    setJSON: vi.fn((key: string, value: unknown) => { mockStorage[key] = value; }),
    remove: vi.fn((key: string) => { delete mockStorage[key]; }),
    get: vi.fn((key: string) => mockStorage[key] as string | null),
    set: vi.fn((key: string, value: string) => { mockStorage[key] = value; }),
  },
}));

// Mock formatPrice
vi.mock('../utils', () => ({
  formatPrice: (price: number) => `AED ${price.toLocaleString()}`,
}));

// Mock styles
vi.mock('./RecentlyViewed.styles', () => ({
  RecentlyViewedSection: ({ children }: any) => <section data-testid="rv-section">{children}</section>,
  RecentlyViewedHeader: ({ children }: any) => <div data-testid="rv-header">{children}</div>,
  HeaderLeft: ({ children }: any) => <div>{children}</div>,
  SectionTitle: ({ children }: any) => <h2 data-testid="rv-title">{children}</h2>,
  ItemCount: ({ children }: any) => <span data-testid="item-count">{children}</span>,
  ClearButton: ({ children, onClick, ...p }: any) => <button data-testid="clear-btn" onClick={onClick} {...p}>{children}</button>,
  RecentlyViewedScroll: ({ children }: any) => <div>{children}</div>,
  RecentlyViewedTrack: ({ children }: any) => <div data-testid="rv-track">{children}</div>,
  RecentPropertyCard: ({ children, onClick, ...p }: any) => (
    <div data-testid="property-card" onClick={onClick} role="button" tabIndex={0}>{children}</div>
  ),
  RecentPropertyImage: ({ children }: any) => <div>{children}</div>,
  PropertyTypeBadge: ({ children }: any) => <span data-testid="type-badge">{children}</span>,
  RecentPropertyInfo: ({ children }: any) => <div>{children}</div>,
  PropertyTitle: ({ children }: any) => <h3 data-testid="prop-title">{children}</h3>,
  PropertyLocationText: ({ children }: any) => <span data-testid="prop-location">{children}</span>,
  PropertySpecs: ({ children }: any) => <div data-testid="prop-specs">{children}</div>,
  SpecDot: () => <span>·</span>,
  PropertyPrice: ({ children }: any) => <span data-testid="prop-price">{children}</span>,
  ScrollIndicators: ({ children }: any) => <div data-testid="scroll-indicators">{children}</div>,
  ScrollButton: ({ children, ...p }: any) => <button {...p}>{children}</button>,
}));

// Mock react-redux
const mockProperties = [
  { id: 'p1', title: 'Palm Villa', type: 'Villa', location: 'Palm Jumeirah', beds: 4, baths: 3, sqft: 3500, price: 5000000, images: ['img1.jpg'] },
  { id: 'p2', title: 'Marina Apt', type: 'Apartment', location: 'Dubai Marina', beds: 2, baths: 2, sqft: 1200, price: 2000000, images: [] },
  { id: 'p3', title: 'Downtown Penthouse', type: 'Penthouse', location: 'Downtown Dubai', beds: 3, baths: 3, sqft: 2800, price: 8000000 },
];

vi.mock('react-redux', () => ({
  useSelector: (selector: any) =>
    selector({ properties: { properties: mockProperties } }),
}));

import RecentlyViewed, { useRecentlyViewed } from './RecentlyViewed';

/* ── Tests ──────────────────────────────────────────────── */
describe('RecentlyViewed Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
  });

  // ─────────────── Null render (no matches) ───────────────
  describe('empty state', () => {
    it('returns null when recentIds is empty', () => {
      const { container } = render(<RecentlyViewed recentIds={[]} />);
      expect(container.innerHTML).toBe('');
    });

    it('returns null when no matching properties found', () => {
      const { container } = render(<RecentlyViewed recentIds={['nonexistent']} />);
      expect(container.innerHTML).toBe('');
    });

    it('returns null with default props (no recentIds)', () => {
      const { container } = render(<RecentlyViewed />);
      expect(container.innerHTML).toBe('');
    });
  });

  // ─────────────── Rendering with data ───────────────
  describe('rendering', () => {
    it('renders section when properties match', () => {
      render(<RecentlyViewed recentIds={['p1', 'p2']} />);
      expect(screen.getByTestId('rv-section')).toBeInTheDocument();
    });

    it('shows "Recently Viewed" title', () => {
      render(<RecentlyViewed recentIds={['p1']} />);
      expect(screen.getByText('Recently Viewed')).toBeInTheDocument();
    });

    it('shows item count', () => {
      render(<RecentlyViewed recentIds={['p1', 'p2']} />);
      expect(screen.getByTestId('item-count')).toHaveTextContent('2 properties');
    });

    it('renders property cards', () => {
      render(<RecentlyViewed recentIds={['p1', 'p2']} />);
      expect(screen.getAllByTestId('property-card')).toHaveLength(2);
    });

    it('shows property titles', () => {
      render(<RecentlyViewed recentIds={['p1', 'p2']} />);
      expect(screen.getByText('Palm Villa')).toBeInTheDocument();
      expect(screen.getByText('Marina Apt')).toBeInTheDocument();
    });

    it('shows property type badges', () => {
      render(<RecentlyViewed recentIds={['p1']} />);
      expect(screen.getByText('Villa')).toBeInTheDocument();
    });

    it('shows property specs', () => {
      render(<RecentlyViewed recentIds={['p1']} />);
      expect(screen.getByText('4 beds')).toBeInTheDocument();
      expect(screen.getByText('3 baths')).toBeInTheDocument();
      expect(screen.getByText('3,500 sqft')).toBeInTheDocument();
    });

    it('shows formatted price', () => {
      render(<RecentlyViewed recentIds={['p1']} />);
      expect(screen.getByText('AED 5,000,000')).toBeInTheDocument();
    });

    it('shows property location', () => {
      render(<RecentlyViewed recentIds={['p1']} />);
      expect(screen.getByText('Palm Jumeirah')).toBeInTheDocument();
    });

    it('shows scroll buttons', () => {
      render(<RecentlyViewed recentIds={['p1']} />);
      expect(screen.getByLabelText('Scroll left')).toBeInTheDocument();
      expect(screen.getByLabelText('Scroll right')).toBeInTheDocument();
    });
  });

  // ─────────────── Callbacks ───────────────
  describe('callbacks', () => {
    it('calls onClear when Clear All clicked', () => {
      const onClear = vi.fn();
      render(<RecentlyViewed recentIds={['p1']} onClear={onClear} />);
      fireEvent.click(screen.getByTestId('clear-btn'));
      expect(onClear).toHaveBeenCalledOnce();
    });

    it('calls onPropertyClick with property id', () => {
      const onClick = vi.fn();
      render(<RecentlyViewed recentIds={['p1', 'p2']} onPropertyClick={onClick} />);
      const cards = screen.getAllByTestId('property-card');
      fireEvent.click(cards[0]);
      expect(onClick).toHaveBeenCalledWith('p1');
    });

    it('does not crash without onPropertyClick', () => {
      render(<RecentlyViewed recentIds={['p1']} />);
      expect(() => fireEvent.click(screen.getByTestId('property-card'))).not.toThrow();
    });
  });

  // ─────────────── Image Fallback ───────────────
  describe('images', () => {
    it('uses first image when available', () => {
      render(<RecentlyViewed recentIds={['p1']} />);
      const img = screen.getByAltText('Palm Villa');
      expect(img).toHaveAttribute('src', 'img1.jpg');
    });

    it('uses fallback image when no images', () => {
      render(<RecentlyViewed recentIds={['p3']} />);
      const img = screen.getByAltText('Downtown Penthouse');
      expect(img.getAttribute('src')).toContain('unsplash.com');
    });
  });
});

/* ── Hook Tests ─────────────────────────────────────────── */
describe('useRecentlyViewed hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
  });

  it('initializes with empty array', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    expect(result.current.recentIds).toEqual([]);
  });

  it('loads stored IDs from localStorage', () => {
    mockStorage['whitecaves_recently_viewed'] = ['p1', 'p2'];
    const { result } = renderHook(() => useRecentlyViewed());
    expect(result.current.recentIds).toEqual(['p1', 'p2']);
  });

  it('adds property to front of list', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    act(() => result.current.addToRecent('p1'));
    expect(result.current.recentIds[0]).toBe('p1');
  });

  it('moves duplicate to front', () => {
    mockStorage['whitecaves_recently_viewed'] = ['p1', 'p2', 'p3'];
    const { result } = renderHook(() => useRecentlyViewed());
    act(() => result.current.addToRecent('p3'));
    expect(result.current.recentIds[0]).toBe('p3');
    expect(result.current.recentIds).not.toContain(undefined);
  });

  it('limits to 6 items', () => {
    mockStorage['whitecaves_recently_viewed'] = ['a', 'b', 'c', 'd', 'e', 'f'];
    const { result } = renderHook(() => useRecentlyViewed());
    act(() => result.current.addToRecent('g'));
    expect(result.current.recentIds.length).toBeLessThanOrEqual(6);
    expect(result.current.recentIds[0]).toBe('g');
  });

  it('clears all recent IDs', () => {
    mockStorage['whitecaves_recently_viewed'] = ['p1', 'p2'];
    const { result } = renderHook(() => useRecentlyViewed());
    act(() => result.current.clearRecent());
    expect(result.current.recentIds).toEqual([]);
  });
});
