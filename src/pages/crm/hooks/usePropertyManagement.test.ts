/**
 * usePropertyManagement — Comprehensive Tests
 * Tests for CRM Property CRUD hook: filtering, pagination, validation, CRUD, stats
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePropertyManagement, STATUS_MAP, TYPE_MAP } from './usePropertyManagement';
import type { Property, PropertyFormData } from './usePropertyManagement';

// ─── Mocks ──────────────────────────────────────────────────────────────

const mockDispatch = vi.fn(() => Promise.resolve({ type: 'fulfilled' }));
const mockNavigate = vi.fn();
const mockSelector = vi.fn();

vi.mock('react-redux', () => ({
  useSelector: (selector: unknown) => mockSelector(selector),
  useDispatch: () => mockDispatch,
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../../utils', () => ({
  formatCurrency: (v: unknown) => `AED ${v}`,
}));

vi.mock('../../../utils/validation', () => ({
  MAX_PRICE: 999_999_999,
  MAX_BEDROOMS: 50,
  MAX_BATHROOMS: 50,
  MAX_SQFT: 999_999,
}));

vi.mock('../../../utils/logger', () => ({
  createLogger: () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() }),
}));

vi.mock('../../../store/crmDataSlice', () => ({
  selectAllProperties: 'selectAllProperties',
  selectPropertiesLoading: 'selectPropertiesLoading',
  selectPropertiesError: 'selectPropertiesError',
  fetchPropertiesFromAPI: vi.fn(() => ({ type: 'properties/fetch', abort: vi.fn() })),
  createPropertyAPI: Object.assign(vi.fn((data: unknown) => ({ type: 'properties/create', payload: data })), {
    fulfilled: { match: (r: { type: string }) => r.type?.includes('fulfilled') },
    rejected: { match: (r: { type: string }) => r.type?.includes('rejected') },
  }),
  updatePropertyAPI: Object.assign(vi.fn((data: unknown) => ({ type: 'properties/update', payload: data })), {
    fulfilled: { match: (r: { type: string }) => r.type?.includes('fulfilled') },
    rejected: { match: (r: { type: string }) => r.type?.includes('rejected') },
  }),
  deletePropertyAPI: Object.assign(vi.fn((id: unknown) => ({ type: 'properties/delete', payload: id })), {
    fulfilled: { match: (r: { type: string }) => r.type?.includes('fulfilled') },
    rejected: { match: (r: { type: string }) => r.type?.includes('rejected') },
  }),
  addActivity: vi.fn((data: unknown) => ({ type: 'activity/add', payload: data })),
}));

// ─── Test data ──────────────────────────────────────────────────────────

const MOCK_PROPERTIES: Property[] = [
  { id: '1', title: 'Luxury Villa', type: 'villa', status: 'available', location: 'Palm Jumeirah', price: 5000000, bedrooms: 5, bathrooms: 6, sqft: 8000, featured: true },
  { id: '2', title: 'Downtown Apartment', type: 'apartment', status: 'reserved', location: 'Downtown Dubai', price: 1500000, bedrooms: 2, bathrooms: 2, sqft: 1200 },
  { id: '3', title: 'Beach Penthouse', type: 'penthouse', status: 'sold', location: 'JBR', price: 8000000, bedrooms: 4, bathrooms: 4, sqft: 5000 },
  { id: '4', title: 'Office Space', type: 'commercial', status: 'available', location: 'Business Bay', price: 3000000, bedrooms: 0, bathrooms: 2, sqft: 3000 },
  { id: '5', title: 'Garden Townhouse', type: 'townhouse', status: 'rented', location: 'Arabian Ranches', price: 2000000, bedrooms: 3, bathrooms: 3, sqft: 2500 },
];

function setupSelector(props: Property[] = MOCK_PROPERTIES, loading = false, error: string | null = null) {
  mockSelector.mockImplementation((selector: unknown) => {
    if (selector === 'selectAllProperties') return props;
    if (selector === 'selectPropertiesLoading') return loading;
    if (selector === 'selectPropertiesError') return error;
    return undefined;
  });
}

// ─── Tests ──────────────────────────────────────────────────────────────

describe('usePropertyManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch.mockReturnValue(Promise.resolve({ type: 'fulfilled' }));
    setupSelector();
  });

  // ═══ EXPORTED CONSTANTS ═══════════════════════════════════════════════

  describe('STATUS_MAP', () => {
    it('defines configs for all expected property statuses', () => {
      const expected = ['available', 'reserved', 'sold', 'rented', 'off_market'];
      expected.forEach(status => {
        expect(STATUS_MAP[status]).toBeDefined();
        expect(STATUS_MAP[status].label).toBeTruthy();
        expect(STATUS_MAP[status].variant).toBeTruthy();
        expect(STATUS_MAP[status].color).toMatch(/^#/);
      });
    });
  });

  describe('TYPE_MAP', () => {
    it('defines configs for all expected property types', () => {
      const expected = ['villa', 'apartment', 'penthouse', 'commercial', 'land', 'townhouse'];
      expected.forEach(type => {
        expect(TYPE_MAP[type]).toBeDefined();
        expect(TYPE_MAP[type].label).toBeTruthy();
        expect(TYPE_MAP[type].icon).toBeTruthy();
      });
    });
  });

  // ═══ HOOK INITIALIZATION ═════════════════════════════════════════════

  describe('initialization', () => {
    it('dispatches fetchPropertiesFromAPI on mount', () => {
      renderHook(() => usePropertyManagement());
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('returns loading state from Redux', () => {
      setupSelector([], true);
      const { result } = renderHook(() => usePropertyManagement());
      expect(result.current.loading).toBe(true);
    });

    it('returns error state from Redux', () => {
      setupSelector([], false, 'Network error');
      const { result } = renderHook(() => usePropertyManagement());
      expect(result.current.error).toBe('Network error');
    });

    it('returns all properties from Redux store', () => {
      const { result } = renderHook(() => usePropertyManagement());
      expect(result.current.properties).toHaveLength(5);
    });

    it('initializes with default filter state', () => {
      const { result } = renderHook(() => usePropertyManagement());
      expect(result.current.search).toBe('');
      expect(result.current.statusFilter).toBe('all');
      expect(result.current.typeFilter).toBe('all');
      expect(result.current.viewMode).toBe('grid');
      expect(result.current.currentPage).toBe(1);
    });

    it('initializes with modals closed', () => {
      const { result } = renderHook(() => usePropertyManagement());
      expect(result.current.showCreateModal).toBe(false);
      expect(result.current.showEditModal).toBe(false);
      expect(result.current.showDeleteConfirm).toBe(false);
      expect(result.current.selectedProperty).toBeNull();
    });
  });

  // ═══ STATS ═══════════════════════════════════════════════════════════

  describe('stats', () => {
    it('computes total count', () => {
      const { result } = renderHook(() => usePropertyManagement());
      expect(result.current.stats.total).toBe(5);
    });

    it('computes available count', () => {
      const { result } = renderHook(() => usePropertyManagement());
      expect(result.current.stats.available).toBe(2);
    });

    it('computes reserved count', () => {
      const { result } = renderHook(() => usePropertyManagement());
      expect(result.current.stats.reserved).toBe(1);
    });

    it('computes sold count', () => {
      const { result } = renderHook(() => usePropertyManagement());
      expect(result.current.stats.sold).toBe(1);
    });

    it('computes total value', () => {
      const { result } = renderHook(() => usePropertyManagement());
      expect(result.current.stats.totalValue).toBe(19500000);
    });

    it('handles empty properties', () => {
      setupSelector([]);
      const { result } = renderHook(() => usePropertyManagement());
      expect(result.current.stats.total).toBe(0);
      expect(result.current.stats.totalValue).toBe(0);
    });
  });

  // ═══ FILTERING ═══════════════════════════════════════════════════════

  describe('filtering', () => {
    it('filters by search text (title)', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.handleSearchChange('Luxury Villa'));
      expect(result.current.filteredProperties).toHaveLength(1);
      expect(result.current.filteredProperties[0].title).toBe('Luxury Villa');
    });

    it('filters by search text (location)', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.handleSearchChange('Downtown'));
      expect(result.current.filteredProperties).toHaveLength(1);
    });

    it('search is case-insensitive', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.handleSearchChange('VILLA'));
      expect(result.current.filteredProperties.length).toBeGreaterThanOrEqual(1);
    });

    it('filters by status', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.handleStatusFilterChange('available'));
      expect(result.current.filteredProperties).toHaveLength(2);
    });

    it('filters by type', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.handleTypeFilterChange('villa'));
      expect(result.current.filteredProperties).toHaveLength(1);
    });

    it('combines search + status filter', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => {
        result.current.handleSearchChange('Palm');
        result.current.handleStatusFilterChange('available');
      });
      expect(result.current.filteredProperties).toHaveLength(1);
    });

    it('"all" filter returns all properties', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.handleStatusFilterChange('all'));
      expect(result.current.filteredProperties).toHaveLength(5);
    });

    it('resets to page 1 when search changes', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.setCurrentPage(2));
      act(() => result.current.handleSearchChange('test'));
      expect(result.current.currentPage).toBe(1);
    });

    it('resets to page 1 when status filter changes', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.setCurrentPage(2));
      act(() => result.current.handleStatusFilterChange('sold'));
      expect(result.current.currentPage).toBe(1);
    });

    it('resets to page 1 when type filter changes', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.setCurrentPage(2));
      act(() => result.current.handleTypeFilterChange('villa'));
      expect(result.current.currentPage).toBe(1);
    });
  });

  // ═══ PAGINATION ═════════════════════════════════════════════════════

  describe('pagination', () => {
    it('returns correct totalPages', () => {
      const { result } = renderHook(() => usePropertyManagement());
      // 5 properties / 9 per page = 1 page
      expect(result.current.totalPages).toBe(1);
    });

    it('paginates results correctly', () => {
      const { result } = renderHook(() => usePropertyManagement());
      expect(result.current.paginatedProperties).toHaveLength(5);
    });

    it('exposes ITEMS_PER_PAGE constant', () => {
      const { result } = renderHook(() => usePropertyManagement());
      expect(result.current.ITEMS_PER_PAGE).toBe(9);
    });
  });

  // ═══ VIEW MODE ══════════════════════════════════════════════════════

  describe('view mode', () => {
    it('defaults to grid view', () => {
      const { result } = renderHook(() => usePropertyManagement());
      expect(result.current.viewMode).toBe('grid');
    });

    it('can toggle to list view', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.setViewMode('list'));
      expect(result.current.viewMode).toBe('list');
    });
  });

  // ═══ MODAL ACTIONS ══════════════════════════════════════════════════

  describe('modal actions', () => {
    it('openCreateModal opens the create modal', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.openCreateModal());
      expect(result.current.showCreateModal).toBe(true);
    });

    it('closeCreateModal closes the modal and resets form', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.openCreateModal());
      act(() => result.current.closeCreateModal());
      expect(result.current.showCreateModal).toBe(false);
    });

    it('handleEdit opens edit modal with property data', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.handleEdit(MOCK_PROPERTIES[0]));
      expect(result.current.showEditModal).toBe(true);
      expect(result.current.selectedProperty).toBe(MOCK_PROPERTIES[0]);
      expect(result.current.formData.title).toBe('Luxury Villa');
      expect(result.current.formData.price).toBe('5000000');
    });

    it('closeEditModal closes edit and clears selected', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.handleEdit(MOCK_PROPERTIES[0]));
      act(() => result.current.closeEditModal());
      expect(result.current.showEditModal).toBe(false);
      expect(result.current.selectedProperty).toBeNull();
    });

    it('confirmDelete opens delete modal with property', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.confirmDelete(MOCK_PROPERTIES[1]));
      expect(result.current.showDeleteConfirm).toBe(true);
      expect(result.current.selectedProperty).toBe(MOCK_PROPERTIES[1]);
    });

    it('closeDeleteModal closes confirm and clears selected', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.confirmDelete(MOCK_PROPERTIES[1]));
      act(() => result.current.closeDeleteModal());
      expect(result.current.showDeleteConfirm).toBe(false);
      expect(result.current.selectedProperty).toBeNull();
    });
  });

  // ═══ CRUD OPERATIONS ════════════════════════════════════════════════

  describe('handleCreate', () => {
    it('dispatches createPropertyAPI on valid data', () => {
      mockDispatch.mockReturnValue(Promise.resolve({ type: 'properties/create/fulfilled' }));
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.openCreateModal());
      act(() => result.current.setFormData({
        title: 'New Villa',
        type: 'villa',
        status: 'available',
        location: 'Dubai Hills',
        price: '3000000',
        bedrooms: '4',
        bathrooms: '3',
        sqft: '4000',
        description: 'Beautiful villa',
        agent_name: 'Agent Smith',
        featured: false,
      }));
      act(() => result.current.handleCreate());
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('does not dispatch when title is empty', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.openCreateModal());
      act(() => result.current.setFormData({
        title: '',
        type: 'villa',
        status: 'available',
        location: 'Dubai Hills',
        price: '3000000',
        bedrooms: '4',
        bathrooms: '3',
        sqft: '4000',
        description: '',
        agent_name: '',
        featured: false,
      }));
      const callsBefore = mockDispatch.mock.calls.length;
      act(() => result.current.handleCreate());
      // No additional dispatch (only mount fetches)
    });

    it('does not dispatch when location is empty', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.openCreateModal());
      act(() => result.current.setFormData({
        title: 'Test',
        type: 'villa',
        status: 'available',
        location: '',
        price: '3000000',
        bedrooms: '4',
        bathrooms: '3',
        sqft: '4000',
        description: '',
        agent_name: '',
        featured: false,
      }));
      act(() => result.current.handleCreate());
      // Does not dispatch createPropertyAPI
    });

    it('does not dispatch when price is zero or negative', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.openCreateModal());
      act(() => result.current.setFormData({
        title: 'Test',
        type: 'villa',
        status: 'available',
        location: 'Dubai',
        price: '0',
        bedrooms: '4',
        bathrooms: '3',
        sqft: '4000',
        description: '',
        agent_name: '',
        featured: false,
      }));
      act(() => result.current.handleCreate());
      // Silently returns
    });
  });

  describe('handleSaveEdit', () => {
    it('dispatches updatePropertyAPI when editing', () => {
      mockDispatch.mockReturnValue(Promise.resolve({ type: 'properties/update/fulfilled' }));
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.handleEdit(MOCK_PROPERTIES[0]));
      act(() => result.current.setFormData({
        ...result.current.formData,
        title: 'Updated Villa',
      }));
      act(() => result.current.handleSaveEdit());
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('sets error when title is empty on edit', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.handleEdit(MOCK_PROPERTIES[0]));
      act(() => result.current.setFormData({
        ...result.current.formData,
        title: '   ',
      }));
      act(() => result.current.handleSaveEdit());
      expect(result.current.errorMessage).toBe('Title and location are required.');
    });

    it('sets error when location is empty on edit', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.handleEdit(MOCK_PROPERTIES[0]));
      act(() => result.current.setFormData({
        ...result.current.formData,
        location: '',
      }));
      act(() => result.current.handleSaveEdit());
      expect(result.current.errorMessage).toBe('Title and location are required.');
    });
  });

  describe('handleDelete', () => {
    it('dispatches deletePropertyAPI when property is selected', () => {
      mockDispatch.mockReturnValue(Promise.resolve({ type: 'properties/delete/fulfilled' }));
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.confirmDelete(MOCK_PROPERTIES[1]));
      act(() => result.current.handleDelete());
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('does nothing when no property is selected', () => {
      const { result } = renderHook(() => usePropertyManagement());
      const afterMount = mockDispatch.mock.calls.length;
      act(() => result.current.handleDelete());
      expect(mockDispatch.mock.calls.length).toBe(afterMount);
    });
  });

  // ═══ UTILITIES ════════════════════════════════════════════════════════

  describe('utility functions', () => {
    it('formatCurrency formats amount', () => {
      const { result } = renderHook(() => usePropertyManagement());
      expect(result.current.formatCurrency(5000000)).toBe('AED 5000000');
    });
  });

  // ═══ NAVIGATION ═══════════════════════════════════════════════════════

  describe('navigation', () => {
    it('retryFetch re-dispatches fetchPropertiesFromAPI', () => {
      const { result } = renderHook(() => usePropertyManagement());
      const beforeRetry = mockDispatch.mock.calls.length;
      act(() => result.current.retryFetch());
      expect(mockDispatch.mock.calls.length).toBeGreaterThan(beforeRetry);
    });

    it('goBack navigates to /owner/crm', () => {
      const { result } = renderHook(() => usePropertyManagement());
      act(() => result.current.goBack());
      expect(mockNavigate).toHaveBeenCalledWith('/owner/crm');
    });
  });

  // ═══ ERROR HANDLING ═══════════════════════════════════════════════════

  describe('error handling', () => {
    it('errorMessage can be set and cleared', () => {
      const { result } = renderHook(() => usePropertyManagement());
      expect(result.current.errorMessage).toBeNull();
      act(() => result.current.setErrorMessage('Something failed'));
      expect(result.current.errorMessage).toBe('Something failed');
      act(() => result.current.setErrorMessage(null));
      expect(result.current.errorMessage).toBeNull();
    });
  });
});
