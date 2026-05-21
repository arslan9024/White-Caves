import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';

const { dispatchMock, useSelectorMock, fetchPropertiesFromAPIMock } = vi.hoisted(() => ({
  dispatchMock: vi.fn(() => ({ abort: vi.fn() })),
  useSelectorMock: vi.fn(),
  fetchPropertiesFromAPIMock: vi.fn((params: Record<string, unknown>) => ({
    type: 'crmData/fetchProperties',
    payload: params,
  })),
}));

vi.mock('react-redux', () => ({
  useDispatch: () => dispatchMock,
  useSelector: (selector: (state: unknown) => unknown) => useSelectorMock(selector),
}));

vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(() => ({ search: '' })),
}));

vi.mock('../store/crmDataSlice', () => ({
  fetchPropertiesFromAPI: fetchPropertiesFromAPIMock,
  selectAllProperties: (state: { crmData: { properties: { items: unknown[] } } }) =>
    state.crmData.properties.items,
  selectPropertiesLoading: (state: { crmData: { properties: { loading: boolean } } }) =>
    state.crmData.properties.loading,
}));

vi.mock('../store/dashboardSlice', () => ({
  addToFavorites: vi.fn((payload: unknown) => ({ type: 'dashboard/addToFavorites', payload })),
  removeFromFavorites: vi.fn((payload: unknown) => ({
    type: 'dashboard/removeFromFavorites',
    payload,
  })),
  selectFavorites: (state: { dashboard: { favorites: unknown[] } }) => state.dashboard.favorites,
}));

import { useLocation } from 'react-router-dom';
import { usePropertyBrowser } from './usePropertyBrowser';

type MockState = {
  dashboard: { favorites: unknown[] };
  crmData: {
    properties: {
      items: unknown[];
      loading: boolean;
    };
  };
  properties: {
    filters: {
      search: string;
      locations: string[];
      propertyTypes: string[];
      beds: number;
      baths: number;
      minPrice: number;
      maxPrice: number;
      minSqft: number;
      maxSqft: number;
      amenities: string[];
      sortBy: string;
    };
  };
};

const makeState = (): MockState => ({
  dashboard: { favorites: [] },
  crmData: {
    properties: {
      items: [],
      loading: false,
    },
  },
  properties: {
    filters: {
      search: '',
      locations: [],
      propertyTypes: [],
      beds: 0,
      baths: 0,
      minPrice: 0,
      maxPrice: 100_000_000,
      minSqft: 0,
      maxSqft: 20_000,
      amenities: [],
      sortBy: 'featured',
    },
  },
});

const setMockLocation = (search: string, key: string) => {
  (
    useLocation as unknown as {
      mockReturnValue: (value: unknown) => void;
    }
  ).mockReturnValue({
    search,
    pathname: '/properties',
    hash: '',
    key,
    state: null,
    unstable_mask: undefined,
  });
};

describe('usePropertyBrowser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dispatchMock.mockReturnValue({ abort: vi.fn() });
  });

  it('dispatches API fetch with URL query filters when present', () => {
    const state = makeState();
    state.properties.filters.sortBy = 'price_asc';

    useSelectorMock.mockImplementation((selector: (s: MockState) => unknown) => selector(state));

    setMockLocation(
      '?search=marina&type=apartment&location=Dubai%20Marina&beds=3&minPrice=1000000&maxPrice=3000000',
      'k1'
    );

    renderHook(() => usePropertyBrowser());

    expect(fetchPropertiesFromAPIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        search: 'marina',
        type: 'apartment',
        location: 'Dubai Marina',
        beds: 3,
        minPrice: 1_000_000,
        maxPrice: 3_000_000,
        sortBy: 'price_asc',
        sortOrder: 'asc',
      })
    );
    expect(dispatchMock).toHaveBeenCalled();
  });

  it('falls back to Redux filters when URL query is empty', () => {
    const state = makeState();
    state.properties.filters.search = 'palm';
    state.properties.filters.locations = ['Palm Jumeirah'];
    state.properties.filters.propertyTypes = ['Villa'];
    state.properties.filters.beds = 4;
    state.properties.filters.baths = 3;
    state.properties.filters.minPrice = 5_000_000;
    state.properties.filters.maxPrice = 10_000_000;

    useSelectorMock.mockImplementation((selector: (s: MockState) => unknown) => selector(state));

    setMockLocation('', 'k2');

    renderHook(() => usePropertyBrowser());

    expect(fetchPropertiesFromAPIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        search: 'palm',
        location: 'Palm Jumeirah',
        type: 'Villa',
        beds: 4,
        baths: 3,
        minPrice: 5_000_000,
        maxPrice: 10_000_000,
      })
    );
  });

  it('prefers URL query filters over Redux filters when both exist', () => {
    const state = makeState();
    state.properties.filters.search = 'redux-search';
    state.properties.filters.locations = ['Redux Location'];
    state.properties.filters.propertyTypes = ['Townhouse'];
    state.properties.filters.beds = 5;
    state.properties.filters.minPrice = 9_000_000;
    state.properties.filters.maxPrice = 12_000_000;

    useSelectorMock.mockImplementation((selector: (s: MockState) => unknown) => selector(state));

    setMockLocation(
      '?search=url-search&type=Apartment&location=URL%20Location&beds=2&minPrice=1000000&maxPrice=3000000',
      'k4'
    );

    renderHook(() => usePropertyBrowser());

    expect(fetchPropertiesFromAPIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        search: 'url-search',
        location: 'URL Location',
        type: 'Apartment',
        beds: 2,
        minPrice: 1_000_000,
        maxPrice: 3_000_000,
      })
    );
  });

  it('aborts in-flight fetch on unmount', () => {
    const state = makeState();
    const abortMock = vi.fn();

    useSelectorMock.mockImplementation((selector: (s: MockState) => unknown) => selector(state));
    dispatchMock.mockReturnValue({ abort: abortMock });

    setMockLocation('', 'k3');

    const { unmount } = renderHook(() => usePropertyBrowser());
    unmount();

    expect(abortMock).toHaveBeenCalled();
  });

  // ─── Phase 34: ?mode=rent/buy purpose filter ─────────────────────────────────

  it('filters to rental properties when mode=rent is in the URL', () => {
    const rentProp = {
      id: '1',
      title: 'Rent Unit',
      purpose: 'rent' as const,
      price: 100_000,
      location: 'Dubai Marina',
      type: 'Apartment',
      beds: 2,
      baths: 1,
      sqft: 900,
      status: 'available',
      amenities: [],
    };
    const buyProp = {
      id: '2',
      title: 'Buy Unit',
      purpose: 'buy' as const,
      price: 2_000_000,
      location: 'Dubai Marina',
      type: 'Villa',
      beds: 3,
      baths: 2,
      sqft: 1800,
      status: 'available',
      amenities: [],
    };

    const state = makeState();
    (state.crmData.properties.items as unknown[]).push(rentProp, buyProp);

    useSelectorMock.mockImplementation((selector: (s: MockState) => unknown) => selector(state));
    setMockLocation('?mode=rent', 'k-mode-rent');

    const { result } = renderHook(() => usePropertyBrowser());

    const ids = result.current.filteredProperties.map((p: { id: string }) => p.id);
    expect(ids).toContain('1');
    expect(ids).not.toContain('2');
  });

  it('filters to sale properties when mode=buy is in the URL', () => {
    const rentProp = {
      id: '1',
      title: 'Rent Unit',
      purpose: 'rent' as const,
      price: 100_000,
      location: 'Downtown',
      type: 'Apartment',
      beds: 1,
      baths: 1,
      sqft: 700,
      status: 'available',
      amenities: [],
    };
    const buyProp = {
      id: '2',
      title: 'Buy Unit',
      purpose: 'buy' as const,
      price: 3_000_000,
      location: 'Downtown',
      type: 'Villa',
      beds: 4,
      baths: 3,
      sqft: 2200,
      status: 'available',
      amenities: [],
    };

    const state = makeState();
    (state.crmData.properties.items as unknown[]).push(rentProp, buyProp);

    useSelectorMock.mockImplementation((selector: (s: MockState) => unknown) => selector(state));
    setMockLocation('?mode=buy', 'k-mode-buy');

    const { result } = renderHook(() => usePropertyBrowser());

    const ids = result.current.filteredProperties.map((p: { id: string }) => p.id);
    expect(ids).toContain('2');
    expect(ids).not.toContain('1');
  });

  it('returns all properties when no mode param is present (existing behaviour preserved)', () => {
    const rentProp = {
      id: '1',
      title: 'Rent Unit',
      purpose: 'rent' as const,
      price: 100_000,
      location: 'JVC',
      type: 'Apartment',
      beds: 1,
      baths: 1,
      sqft: 600,
      status: 'available',
      amenities: [],
    };
    const buyProp = {
      id: '2',
      title: 'Buy Unit',
      purpose: 'buy' as const,
      price: 1_500_000,
      location: 'JVC',
      type: 'Apartment',
      beds: 2,
      baths: 1,
      sqft: 1000,
      status: 'available',
      amenities: [],
    };

    const state = makeState();
    (state.crmData.properties.items as unknown[]).push(rentProp, buyProp);

    useSelectorMock.mockImplementation((selector: (s: MockState) => unknown) => selector(state));
    setMockLocation('', 'k-no-mode');

    const { result } = renderHook(() => usePropertyBrowser());

    const ids = result.current.filteredProperties.map((p: { id: string }) => p.id);
    expect(ids).toContain('1');
    expect(ids).toContain('2');
  });
});
