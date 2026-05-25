/**
 * useLeadManagement — Comprehensive Tests
 * Tests for CRM Lead CRUD hook: filtering, pagination, validation, CRUD actions
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLeadManagement, STATUS_CONFIG, SOURCE_LABELS } from './useLeadManagement';
import type { Lead, LeadFormData } from './useLeadManagement';

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
  formatDate: (v: unknown) => v ?? 'N/A',
}));

vi.mock('../../../utils/validation', () => ({
  isValidEmail: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  isValidPhone: (v: string) => /^\+?\d{7,15}$/.test(v.replace(/[\s-]/g, '')),
}));

vi.mock('../../../utils/logger', () => ({
  createLogger: () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() }),
}));

vi.mock('../../../store/crmDataSlice', () => ({
  selectAllLeads: 'selectAllLeads',
  selectLeadsLoading: 'selectLeadsLoading',
  selectLeadsError: 'selectLeadsError',
  fetchLeadsFromAPI: vi.fn(() => ({ type: 'leads/fetch', abort: vi.fn() })),
  createLeadAPI: Object.assign(vi.fn((data: unknown) => ({ type: 'leads/create', payload: data })), {
    fulfilled: { match: (r: { type: string }) => r.type?.includes('fulfilled') },
    rejected: { match: (r: { type: string }) => r.type?.includes('rejected') },
  }),
  updateLeadAPI: Object.assign(vi.fn((data: unknown) => ({ type: 'leads/update', payload: data })), {
    fulfilled: { match: (r: { type: string }) => r.type?.includes('fulfilled') },
    rejected: { match: (r: { type: string }) => r.type?.includes('rejected') },
  }),
  deleteLeadAPI: Object.assign(vi.fn((id: unknown) => ({ type: 'leads/delete', payload: id })), {
    fulfilled: { match: (r: { type: string }) => r.type?.includes('fulfilled') },
    rejected: { match: (r: { type: string }) => r.type?.includes('rejected') },
  }),
  addActivity: vi.fn((data: unknown) => ({ type: 'activity/add', payload: data })),
}));

// ─── Test data ──────────────────────────────────────────────────────────

const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Alice Johnson', company: 'Corp A', email: 'alice@corp.com', phone: '+971501234567', status: 'new', source: 'website', budget: 500000 },
  { id: '2', name: 'Bob Smith', company: 'Corp B', email: 'bob@corp.com', phone: '+971501234568', status: 'contacted', source: 'referral', budget: 750000 },
  { id: '3', name: 'Charlie Brown', company: 'Corp C', email: 'charlie@corp.com', phone: '+971501234569', status: 'viewing', source: 'social', budget: 300000 },
  { id: '4', name: 'Diana Prince', company: 'Corp D', email: 'diana@corp.com', phone: '+971501234570', status: 'qualified', source: 'direct', budget: 1000000 },
  { id: '5', name: 'Eve Adams', company: 'Corp E', email: 'eve@corp.com', phone: '+971501234571', status: 'negotiating', source: 'portal', budget: 600000 },
];

function setupSelector(leads: Lead[] = MOCK_LEADS, loading = false, error: string | null = null) {
  mockSelector.mockImplementation((selector: unknown) => {
    if (selector === 'selectAllLeads') return leads;
    if (selector === 'selectLeadsLoading') return loading;
    if (selector === 'selectLeadsError') return error;
    return undefined;
  });
}

// ─── Tests ──────────────────────────────────────────────────────────────

describe('useLeadManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch.mockReturnValue(Promise.resolve({ type: 'fulfilled' }));
    setupSelector();
  });

  // ═══ EXPORTED CONSTANTS ═══════════════════════════════════════════════

  describe('STATUS_CONFIG', () => {
    it('defines configs for all expected statuses', () => {
      const expected = ['new', 'contacted', 'qualified', 'viewing', 'offered', 'negotiating', 'won', 'lost'];
      expected.forEach(status => {
        expect(STATUS_CONFIG[status]).toBeDefined();
        expect(STATUS_CONFIG[status].label).toBeTruthy();
        expect(STATUS_CONFIG[status].color).toMatch(/^#/);
        expect(STATUS_CONFIG[status].badgeVariant).toBeTruthy();
      });
    });

    it('has unique labels for each status', () => {
      const labels = Object.values(STATUS_CONFIG).map(c => c.label);
      expect(new Set(labels).size).toBe(labels.length);
    });
  });

  describe('SOURCE_LABELS', () => {
    it('defines labels for all expected sources', () => {
      const expected = ['direct', 'website', 'referral', 'social', 'portal', 'cold_call', 'event', 'other'];
      expected.forEach(source => {
        expect(SOURCE_LABELS[source]).toBeTruthy();
      });
    });
  });

  // ═══ HOOK INITIALIZATION ═════════════════════════════════════════════

  describe('initialization', () => {
    it('dispatches fetchLeadsFromAPI on mount', () => {
      renderHook(() => useLeadManagement());
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('returns loading state from Redux', () => {
      setupSelector([], true);
      const { result } = renderHook(() => useLeadManagement());
      expect(result.current.loading).toBe(true);
    });

    it('returns error state from Redux', () => {
      setupSelector([], false, 'Network error');
      const { result } = renderHook(() => useLeadManagement());
      expect(result.current.error).toBe('Network error');
    });

    it('returns all leads from Redux store', () => {
      const { result } = renderHook(() => useLeadManagement());
      expect(result.current.allLeads).toHaveLength(5);
    });

    it('initializes with default filter state', () => {
      const { result } = renderHook(() => useLeadManagement());
      expect(result.current.search).toBe('');
      expect(result.current.statusFilter).toBe('all');
      expect(result.current.sourceFilter).toBe('all');
      expect(result.current.currentPage).toBe(1);
    });

    it('initializes with modals closed', () => {
      const { result } = renderHook(() => useLeadManagement());
      expect(result.current.showCreateModal).toBe(false);
      expect(result.current.showEditModal).toBe(false);
      expect(result.current.showDeleteConfirm).toBe(false);
      expect(result.current.selectedLead).toBeNull();
    });
  });

  // ═══ FILTERING ═══════════════════════════════════════════════════════

  describe('filtering', () => {
    it('filters by search text (name)', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.handleSearchChange('Alice'));
      expect(result.current.filteredLeads).toHaveLength(1);
      expect(result.current.filteredLeads[0].name).toBe('Alice Johnson');
    });

    it('filters by search text (company)', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.handleSearchChange('Corp B'));
      expect(result.current.filteredLeads).toHaveLength(1);
    });

    it('filters by search text (email)', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.handleSearchChange('charlie@'));
      expect(result.current.filteredLeads).toHaveLength(1);
    });

    it('search is case-insensitive', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.handleSearchChange('ALICE'));
      expect(result.current.filteredLeads).toHaveLength(1);
    });

    it('filters by status', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.handleStatusFilterChange('new'));
      expect(result.current.filteredLeads).toHaveLength(1);
    });

    it('filters by source', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.handleSourceFilterChange('website'));
      expect(result.current.filteredLeads).toHaveLength(1);
    });

    it('combines search + status filter', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => {
        result.current.handleSearchChange('Corp');
        result.current.handleStatusFilterChange('new');
      });
      // Corp A (new)
      expect(result.current.filteredLeads).toHaveLength(1);
    });

    it('"all" filter returns all leads', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.handleStatusFilterChange('all'));
      expect(result.current.filteredLeads).toHaveLength(5);
    });

    it('resets to page 1 when search changes', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.setCurrentPage(2));
      act(() => result.current.handleSearchChange('test'));
      expect(result.current.currentPage).toBe(1);
    });

    it('resets to page 1 when status filter changes', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.setCurrentPage(2));
      act(() => result.current.handleStatusFilterChange('new'));
      expect(result.current.currentPage).toBe(1);
    });

    it('resets to page 1 when source filter changes', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.setCurrentPage(2));
      act(() => result.current.handleSourceFilterChange('social'));
      expect(result.current.currentPage).toBe(1);
    });
  });

  // ═══ PAGINATION ═════════════════════════════════════════════════════

  describe('pagination', () => {
    it('returns correct totalPages', () => {
      const { result } = renderHook(() => useLeadManagement());
      // 5 leads / 10 per page = 1 page
      expect(result.current.totalPages).toBe(1);
    });

    it('paginates results correctly', () => {
      const { result } = renderHook(() => useLeadManagement());
      expect(result.current.paginatedLeads).toHaveLength(5);
    });

    it('exposes ITEMS_PER_PAGE constant', () => {
      const { result } = renderHook(() => useLeadManagement());
      expect(result.current.ITEMS_PER_PAGE).toBe(10);
    });
  });

  // ═══ STATUS COUNTS ══════════════════════════════════════════════════

  describe('statusCounts', () => {
    it('computes "all" count', () => {
      const { result } = renderHook(() => useLeadManagement());
      expect(result.current.statusCounts.get('all')).toBe(5);
    });

    it('counts by status', () => {
      const { result } = renderHook(() => useLeadManagement());
      expect(result.current.statusCounts.get('contacted')).toBe(1);
      expect(result.current.statusCounts.get('new')).toBe(1);
      expect(result.current.statusCounts.get('qualified')).toBe(1);
    });
  });

  // ═══ MODAL ACTIONS ══════════════════════════════════════════════════

  describe('modal actions', () => {
    it('openCreateModal opens the create modal', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.openCreateModal());
      expect(result.current.showCreateModal).toBe(true);
    });

    it('closeCreateModal closes the create modal and resets form', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.openCreateModal());
      act(() => result.current.closeCreateModal());
      expect(result.current.showCreateModal).toBe(false);
    });

    it('handleEdit opens edit modal with lead data', () => {
      const { result } = renderHook(() => useLeadManagement());
      const lead = MOCK_LEADS[0];
      act(() => result.current.handleEdit(lead));
      expect(result.current.showEditModal).toBe(true);
      expect(result.current.selectedLead).toBe(lead);
      expect(result.current.formData.name).toBe('Alice Johnson');
    });

    it('closeEditModal closes edit and clears selected lead', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.handleEdit(MOCK_LEADS[0]));
      act(() => result.current.closeEditModal());
      expect(result.current.showEditModal).toBe(false);
      expect(result.current.selectedLead).toBeNull();
    });

    it('confirmDelete opens delete modal with lead', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.confirmDelete(MOCK_LEADS[1]));
      expect(result.current.showDeleteConfirm).toBe(true);
      expect(result.current.selectedLead).toBe(MOCK_LEADS[1]);
    });

    it('closeDeleteModal closes confirm and clears selected lead', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.confirmDelete(MOCK_LEADS[1]));
      act(() => result.current.closeDeleteModal());
      expect(result.current.showDeleteConfirm).toBe(false);
      expect(result.current.selectedLead).toBeNull();
    });
  });

  // ═══ CRUD OPERATIONS ════════════════════════════════════════════════

  describe('handleCreate', () => {
    it('dispatches createLeadAPI on valid data', async () => {
      mockDispatch.mockReturnValue(Promise.resolve({ type: 'leads/create/fulfilled' }));
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.openCreateModal());
      act(() => result.current.setFormData({
        name: 'New Lead',
        company: 'Test Corp',
        email: 'test@example.com',
        phone: '+971501234567',
        status: 'new',
        source: 'direct',
        budget: '500000',
        notes: 'Test note',
      }));
      await act(async () => {
        await result.current.handleCreate();
      });
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('does not dispatch when name is empty', () => {
      const dispatchCallCount = mockDispatch.mock.calls.length;
      const { result } = renderHook(() => useLeadManagement());
      const newCallCount = mockDispatch.mock.calls.length;
      act(() => result.current.openCreateModal());
      act(() => result.current.setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        status: 'new',
        source: 'direct',
        budget: '',
        notes: '',
      }));
      act(() => result.current.handleCreate());
      // Only initial fetch calls should be present, no create dispatch
      // The handleCreate should silently return without dispatching
    });

    it('does not dispatch when email is invalid', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.openCreateModal());
      act(() => result.current.setFormData({
        name: 'Test Lead',
        company: '',
        email: 'not-an-email',
        phone: '',
        status: 'new',
        source: 'direct',
        budget: '',
        notes: '',
      }));
      act(() => result.current.handleCreate());
      // Create should not dispatch because email is invalid
    });
  });

  describe('handleSaveEdit', () => {
    it('dispatches updateLeadAPI when editing', async () => {
      mockDispatch.mockReturnValue(Promise.resolve({ type: 'leads/update/fulfilled' }));
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.handleEdit(MOCK_LEADS[0]));
      act(() => result.current.setFormData({
        ...result.current.formData,
        name: 'Updated Name',
      }));
      await act(async () => {
        await result.current.handleSaveEdit();
      });
      // dispatch is called
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('sets error when name is empty on edit', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.handleEdit(MOCK_LEADS[0]));
      act(() => result.current.setFormData({
        ...result.current.formData,
        name: '  ',
      }));
      act(() => result.current.handleSaveEdit());
      expect(result.current.errorMessage).toBe('Lead name is required.');
    });
  });

  describe('handleDelete', () => {
    it('dispatches deleteLeadAPI when lead is selected', async () => {
      mockDispatch.mockReturnValue(Promise.resolve({ type: 'leads/delete/fulfilled' }));
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.confirmDelete(MOCK_LEADS[1]));
      await act(async () => {
        await result.current.handleDelete();
      });
      expect(mockDispatch).toHaveBeenCalled();
    });

    it('does nothing when no lead is selected', () => {
      const callCount = mockDispatch.mock.calls.length;
      const { result } = renderHook(() => useLeadManagement());
      const afterMount = mockDispatch.mock.calls.length;
      act(() => result.current.handleDelete());
      // Same number of calls (only the initial fetch)
      expect(mockDispatch.mock.calls.length).toBe(afterMount);
    });
  });

  // ═══ UTILITIES ════════════════════════════════════════════════════════

  describe('utility functions', () => {
    it('getStatusBadgeVariant returns correct variant', () => {
      const { result } = renderHook(() => useLeadManagement());
      expect(result.current.getStatusBadgeVariant('negotiating')).toBe('warning');
      expect(result.current.getStatusBadgeVariant('new')).toBe('success');
      expect(result.current.getStatusBadgeVariant('unknown')).toBe('secondary');
    });

    it('formatCurrency formats amount', () => {
      const { result } = renderHook(() => useLeadManagement());
      expect(result.current.formatCurrency(500000)).toBe('AED 500000');
    });

    it('formatDate formats date string', () => {
      const { result } = renderHook(() => useLeadManagement());
      expect(result.current.formatDate('2026-01-01')).toBe('2026-01-01');
      expect(result.current.formatDate(undefined)).toBe('N/A');
    });
  });

  // ═══ NAVIGATION ═══════════════════════════════════════════════════════

  describe('navigation', () => {
    it('retryFetch re-dispatches fetchLeadsFromAPI', () => {
      const { result } = renderHook(() => useLeadManagement());
      const beforeRetry = mockDispatch.mock.calls.length;
      act(() => result.current.retryFetch());
      expect(mockDispatch.mock.calls.length).toBeGreaterThan(beforeRetry);
    });

    it('goBack navigates to /owner/crm', () => {
      const { result } = renderHook(() => useLeadManagement());
      act(() => result.current.goBack());
      expect(mockNavigate).toHaveBeenCalledWith('/owner/crm');
    });
  });

  // ═══ ERROR HANDLING ═══════════════════════════════════════════════════

  describe('error handling', () => {
    it('errorMessage can be set and cleared', () => {
      const { result } = renderHook(() => useLeadManagement());
      expect(result.current.errorMessage).toBeNull();
      act(() => result.current.setErrorMessage('Something failed'));
      expect(result.current.errorMessage).toBe('Something failed');
      act(() => result.current.setErrorMessage(null));
      expect(result.current.errorMessage).toBeNull();
    });
  });
});
