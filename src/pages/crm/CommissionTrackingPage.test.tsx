/**
 * CommissionTrackingPage — Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// ── Mock data ───────────────────────────────────────────────────
const MOCK_COMMISSIONS = [
  { id: '1', agent_name: 'Ahmed Al Rashid', property_title: 'Palm Villa', amount: 50000, percentage: 2.5, type: 'sale', status: 'pending', created_at: '2025-01-15T10:00:00Z', notes: '' },
  { id: '2', agent_name: 'Sarah Khan', property_title: 'Marina Tower', amount: 30000, percentage: 2, type: 'rental', status: 'paid', created_at: '2025-01-10T10:00:00Z', notes: '' },
];

const defaultFormData = {
  agent_name: '', amount: '', percentage: '', type: 'sale',
  status: 'pending', property_title: '', notes: '',
};

const mockOpenCreateModal = vi.fn();
const mockGoBack = vi.fn();

let hookOverrides: Record<string, unknown> = {};

vi.mock('./hooks/useCommissionTracking', () => ({
  useCommissionTracking: () => ({
    commissions: MOCK_COMMISSIONS,
    filteredCommissions: MOCK_COMMISSIONS,
    paginatedCommissions: MOCK_COMMISSIONS,
    summaryStats: { pending: 50000, approved: 0, paid: 30000 },
    loading: false,
    error: null,
    search: '',
    statusFilter: 'all',
    typeFilter: 'all',
    currentPage: 1,
    showCreateModal: false,
    showEditModal: false,
    showDeleteConfirm: false,
    selectedCommission: null,
    formData: defaultFormData,
    setFormData: vi.fn(),
    ITEMS_PER_PAGE: 10,
    openCreateModal: mockOpenCreateModal,
    closeCreateModal: vi.fn(),
    closeEditModal: vi.fn(),
    closeDeleteModal: vi.fn(),
    handleCreate: vi.fn(),
    handleEdit: vi.fn(),
    handleSaveEdit: vi.fn(),
    handleDelete: vi.fn(),
    confirmDelete: vi.fn(),
    handleSearchChange: vi.fn(),
    handleStatusFilterChange: vi.fn(),
    handleTypeFilterChange: vi.fn(),
    setCurrentPage: vi.fn(),
    retryFetch: vi.fn(),
    goBack: mockGoBack,
    getStatusBadgeVariant: (s: string) => s === 'paid' ? 'success' : 'warning',
    formatCurrency: (v: number | undefined) => v ? `AED ${v.toLocaleString()}` : '—',
    formatDate: (v: string | undefined) => v ? new Date(v).toLocaleDateString() : 'N/A',
    ...hookOverrides,
  }),
  STATUS_CONFIG: {
    pending: { label: 'Pending', color: '#F59E0B', badgeVariant: 'warning' },
    approved: { label: 'Approved', color: '#3B82F6', badgeVariant: 'info' },
    paid: { label: 'Paid', color: '#10B981', badgeVariant: 'success' },
    cancelled: { label: 'Cancelled', color: '#6B7280', badgeVariant: 'secondary' },
  },
  TYPE_LABELS: {
    sale: '🏠 Sale',
    rental: '🔑 Rental',
    referral: '🤝 Referral',
  },
}));

vi.mock('../../hooks/useDocumentTitle', () => ({
  useDocumentTitle: vi.fn(),
}));

vi.mock('../../components/ui', () => ({
  Badge: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
    <span data-testid="badge" data-variant={variant}>{children}</span>
  ),
  Pagination: ({ currentPage, onPageChange }: any) => (
    <div data-testid="pagination">
      <span>Page {currentPage}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
}));

vi.mock('../../shared/components/ui/Modal', () => ({
  Modal: ({ children, title, isOpen, onClose }: any) => isOpen ? (
    <div data-testid="modal" role="dialog">
      <h2>{title}</h2>
      <button onClick={onClose} data-testid="modal-close">Close</button>
      {children}
    </div>
  ) : null,
}));

import CommissionTrackingPage from './CommissionTrackingPage';

describe('CommissionTrackingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookOverrides = {};
  });

  it('renders page title "Commission Tracking"', () => {
    render(<CommissionTrackingPage />);
    expect(screen.getByText(/Commission Tracking/)).toBeDefined();
  });

  it('renders summary stat cards', () => {
    render(<CommissionTrackingPage />);
    // "Pending", "Approved", "Paid" appear both in stat labels and filter options
    expect(screen.getAllByText('Pending').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Approved').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Paid').length).toBeGreaterThanOrEqual(1);
  });

  it('renders search input and filter selects', () => {
    render(<CommissionTrackingPage />);
    expect(screen.getByPlaceholderText(/Search by agent name/)).toBeDefined();
    expect(screen.getByText('All Status')).toBeDefined();
    expect(screen.getByText('All Types')).toBeDefined();
  });

  it('renders table headers', () => {
    render(<CommissionTrackingPage />);
    expect(screen.getByText('Agent')).toBeDefined();
    expect(screen.getByText('Amount')).toBeDefined();
    expect(screen.getByText('Type')).toBeDefined();
    expect(screen.getByText('Status')).toBeDefined();
    expect(screen.getByText('Property')).toBeDefined();
    expect(screen.getByText('Created')).toBeDefined();
    expect(screen.getByText('Actions')).toBeDefined();
  });

  it('shows empty state when no commissions', () => {
    hookOverrides = { paginatedCommissions: [], filteredCommissions: [] };
    render(<CommissionTrackingPage />);
    expect(screen.getByText('No commissions yet — create your first one!')).toBeDefined();
  });

  it('shows loading banner when loading=true', () => {
    hookOverrides = { loading: true };
    render(<CommissionTrackingPage />);
    expect(screen.getByText(/Loading commissions/)).toBeDefined();
  });

  it('calls openCreateModal on button click', () => {
    render(<CommissionTrackingPage />);
    fireEvent.click(screen.getByText(/New Commission/));
    expect(mockOpenCreateModal).toHaveBeenCalled();
  });
});
