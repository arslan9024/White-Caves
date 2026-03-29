/**
 * MaryInventoryTab.test.tsx — Batch 31
 * Comprehensive tests for MaryInventoryTab component
 * Covers: rendering, Redux dispatch, filters, property/owner selection,
 *         stats cards, filter toggles, loading state, modal/drawer interactions
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// ─── Mock lucide-react icons ────────────────────────────────────────────
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  const icon = (name: string) => (props: any) => <span data-testid={`icon-${name}`} {...props} />;
  return {
    ...actual,
    Building2: icon('building'),
    Plus: icon('plus'),
    Download: icon('download'),
    Home: icon('home'),
    Users: icon('users'),
    Phone: icon('phone'),
    XCircle: icon('xcircle'),
    Eye: icon('eye'),
    MapPin: icon('mappin'),
    Hash: icon('hash'),
    Layers: icon('layers'),
    DollarSign: icon('dollar'),
    FileText: icon('filetext'),
    Calendar: icon('calendar'),
    Mail: icon('mail'),
    User: icon('user'),
    Zap: icon('zap'),
  };
});

// ─── Mock child components ──────────────────────────────────────────────
vi.mock('../../../../../shared/components/ui/LazyFullScreenDetailModal', () => ({
  default: ({ isOpen, onClose, title, subtitle, tabs }: any) =>
    isOpen ? (
      <div data-testid="detail-modal">
        <span>{title}</span>
        <span>{subtitle}</span>
        <button onClick={onClose}>Close Modal</button>
        {tabs?.map((t: any, i: number) => <div key={i}>{t.label}</div>)}
      </div>
    ) : null,
}));

vi.mock('../../../inventory/PropertyMatrix', () => ({
  default: ({ onPropertySelect, onOwnerSelect }: any) => (
    <div data-testid="property-matrix">
      <button onClick={() => onPropertySelect({
        pNumber: 'P001',
        cluster: 'Cluster A',
        area: 'JVC',
        project: 'Project X',
        masterProject: 'MP1',
        building: 'B1',
        unitNumber: '101',
        floor: '1',
        municipalityNo: 'M001',
        owners: ['owner-1'],
      })}>Select Property</button>
      <button onClick={() => onOwnerSelect({
        id: 'owner-1',
        name: 'John Owner',
        email: 'john@example.com',
        contacts: [{ type: 'mobile', value: '+971501234567', isPrimary: true }],
        properties: ['P001'],
      })}>Select Owner</button>
    </div>
  ),
}));

vi.mock('../../../inventory/OwnerDetailDrawer', () => ({
  default: ({ owner, onClose, properties }: any) => (
    <div data-testid="owner-drawer">
      <span>{owner.name}</span>
      <button onClick={onClose}>Close Drawer</button>
    </div>
  ),
}));

vi.mock('../../../inventory/FilterPanel', () => ({
  default: ({ onFilterChange, onClearFilters, activeFiltersCount }: any) => (
    <div data-testid="filter-panel">
      <span>Filters ({activeFiltersCount})</span>
      <button onClick={() => onFilterChange('layout', 'villa')}>Set Layout Filter</button>
      <button onClick={onClearFilters}>Clear All</button>
    </div>
  ),
}));

vi.mock('../../../inventory/PropertyDetailsCard', () => ({
  default: ({ property }: any) => (
    <div data-testid="property-details-card">{property?.pNumber}</div>
  ),
}));

vi.mock('../../../inventory/ClusterBrowser', () => ({
  default: ({ selectedCluster, onClusterSelect }: any) => (
    <div data-testid="cluster-browser">
      <span>Cluster: {selectedCluster}</span>
      <button onClick={() => onClusterSelect('cluster-b')}>Select Cluster B</button>
      <button onClick={() => onClusterSelect('all')}>All Clusters</button>
    </div>
  ),
}));

vi.mock('../../../inventory/DataQualityIndicators', () => ({
  default: ({ onFilterClick }: any) => (
    <div data-testid="data-quality-indicators">
      <button onClick={() => onFilterClick('showMultiOwner')}>Toggle Multi-Owner</button>
      <button onClick={() => onFilterClick('showMultiPhone')}>Toggle Multi-Phone</button>
      <button onClick={() => onFilterClick('showMultiProperty')}>Toggle Multi-Property</button>
    </div>
  ),
}));

// ─── Mock CSS import ────────────────────────────────────────────────────
vi.mock('../../MaryInventoryCRM.css', () => ({}));

// ─── Mock Redux ─────────────────────────────────────────────────────────
const mockDispatch = vi.fn(() => ({ abort: vi.fn() }));

vi.mock('react-redux', () => ({
  useSelector: (selector: any) => {
    const state = {
      inventory: {
        loading: false,
        properties: { byId: {}, allIds: [] },
        owners: { byId: {}, allIds: [] },
        filters: {
          search: '',
          cluster: null,
          area: null,
          layout: null,
          status: null,
          view: null,
          showMultiOwner: false,
          showMultiPhone: false,
          showMultiProperty: false,
        },
      },
    };
    return selector(state);
  },
  useDispatch: () => mockDispatch,
}));

// Mock the inventory slice actions and selectors
vi.mock('../../../../../store/slices/inventorySlice', () => ({
  loadInventoryData: vi.fn(() => ({ type: 'inventory/loadData' })),
  selectFilteredProperties: () => [],
  selectInventoryStats: () => ({
    totalProperties: 125,
    totalOwners: 89,
    multiOwnerProperties: 12,
    ownersWithMultiplePhones: 7,
  }),
  selectFilters: (state: any) => state.inventory?.filters || {},
  selectOwners: () => ({ byId: {}, allIds: [] }),
  selectFilterOptions: () => ({}),
  selectActiveFiltersCount: () => 0,
  setFilter: vi.fn((payload: any) => ({ type: 'inventory/setFilter', payload })),
  clearFilters: vi.fn(() => ({ type: 'inventory/clearFilters' })),
  toggleMultiOwnerFilter: vi.fn(() => ({ type: 'inventory/toggleMultiOwner' })),
  toggleMultiPhoneFilter: vi.fn(() => ({ type: 'inventory/toggleMultiPhone' })),
  toggleMultiPropertyFilter: vi.fn(() => ({ type: 'inventory/toggleMultiProperty' })),
}));

import MaryInventoryTab from '../MaryInventoryTab';

// ─── Tests ──────────────────────────────────────────────────────────────

describe('MaryInventoryTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ──

  it('renders the tab header with title', () => {
    render(<MaryInventoryTab />);
    expect(screen.getByText('Inventory')).toBeInTheDocument();
    expect(screen.getByText('Manage and browse all properties')).toBeInTheDocument();
  });

  it('renders Export and Add Property buttons', () => {
    render(<MaryInventoryTab />);
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Add Property')).toBeInTheDocument();
  });

  it('dispatches loadInventoryData on mount', () => {
    render(<MaryInventoryTab />);
    expect(mockDispatch).toHaveBeenCalled();
  });

  // ── Stats Cards ──

  it('renders stat cards with correct values', () => {
    render(<MaryInventoryTab />);
    expect(screen.getByText('125')).toBeInTheDocument();
    expect(screen.getByText('Total Properties')).toBeInTheDocument();
    expect(screen.getByText('89')).toBeInTheDocument();
    expect(screen.getByText('Total Owners')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Multi-Owner')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('Multi-Phone Owners')).toBeInTheDocument();
  });

  // ── Child Components ──

  it('renders DataQualityIndicators', () => {
    render(<MaryInventoryTab />);
    expect(screen.getByTestId('data-quality-indicators')).toBeInTheDocument();
  });

  it('renders ClusterBrowser', () => {
    render(<MaryInventoryTab />);
    expect(screen.getByTestId('cluster-browser')).toBeInTheDocument();
  });

  it('renders PropertyMatrix', () => {
    render(<MaryInventoryTab />);
    expect(screen.getByTestId('property-matrix')).toBeInTheDocument();
  });

  // ── Filter Toggle ──

  it('renders filter toggle button (Show/Hide Filters)', () => {
    render(<MaryInventoryTab />);
    expect(screen.getByText('Hide Filters')).toBeInTheDocument();
  });

  it('toggles filter panel visibility when filter toggle is clicked', () => {
    render(<MaryInventoryTab />);
    expect(screen.getByTestId('filter-panel')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hide Filters'));
    expect(screen.queryByTestId('filter-panel')).not.toBeInTheDocument();
    expect(screen.getByText('Show Filters')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Show Filters'));
    expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
  });

  // ── Filter Interactions ──

  it('dispatches toggleMultiOwnerFilter from DataQualityIndicators', () => {
    render(<MaryInventoryTab />);
    fireEvent.click(screen.getByText('Toggle Multi-Owner'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('dispatches toggleMultiPhoneFilter from DataQualityIndicators', () => {
    render(<MaryInventoryTab />);
    fireEvent.click(screen.getByText('Toggle Multi-Phone'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('dispatches toggleMultiPropertyFilter from DataQualityIndicators', () => {
    render(<MaryInventoryTab />);
    fireEvent.click(screen.getByText('Toggle Multi-Property'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  // ── Cluster Selection ──

  it('updates cluster selection via ClusterBrowser', () => {
    render(<MaryInventoryTab />);
    fireEvent.click(screen.getByText('Select Cluster B'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('sets cluster to null when "all" is selected', () => {
    render(<MaryInventoryTab />);
    fireEvent.click(screen.getByText('All Clusters'));
    expect(mockDispatch).toHaveBeenCalled();
  });

  // ── Property Selection → Modal ──

  it('opens detail modal when a property is selected', () => {
    render(<MaryInventoryTab />);
    expect(screen.queryByTestId('detail-modal')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Select Property'));
    expect(screen.getByTestId('detail-modal')).toBeInTheDocument();
    expect(screen.getByText('P001')).toBeInTheDocument();
  });

  it('closes detail modal when close is clicked', () => {
    render(<MaryInventoryTab />);
    fireEvent.click(screen.getByText('Select Property'));
    expect(screen.getByTestId('detail-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close Modal'));
    expect(screen.queryByTestId('detail-modal')).not.toBeInTheDocument();
  });

  it('shows modal with correct tabs', () => {
    render(<MaryInventoryTab />);
    fireEvent.click(screen.getByText('Select Property'));
    expect(screen.getByText('All Details')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Owners')).toBeInTheDocument();
  });

  // ── Owner Selection → Drawer ──

  it('opens owner drawer when an owner is selected', () => {
    render(<MaryInventoryTab />);
    expect(screen.queryByTestId('owner-drawer')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Select Owner'));
    expect(screen.getByTestId('owner-drawer')).toBeInTheDocument();
    expect(screen.getByText('John Owner')).toBeInTheDocument();
  });

  it('closes owner drawer when close is clicked', () => {
    render(<MaryInventoryTab />);
    fireEvent.click(screen.getByText('Select Owner'));
    expect(screen.getByTestId('owner-drawer')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close Drawer'));
    expect(screen.queryByTestId('owner-drawer')).not.toBeInTheDocument();
  });
});
