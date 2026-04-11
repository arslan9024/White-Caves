/**
 * UserManagementPage — Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// ── Mock data ───────────────────────────────────────────────────
const MOCK_USERS = [
  { id: '1', name: 'Ahmed Admin', email: 'ahmed@co.ae', role: 'admin', department: 'IT', status: 'active', last_active: '2025-01-15T10:00:00Z' },
  { id: '2', name: 'Sarah Agent', email: 'sarah@co.ae', role: 'agent', department: 'Sales', status: 'active', last_active: '2025-01-10T10:00:00Z' },
];

let hookOverrides: Record<string, unknown> = {};

vi.mock('./hooks/useUserManagement', () => ({
  useUserManagement: () => ({
    filteredUsers: MOCK_USERS,
    paginatedUsers: MOCK_USERS,
    stats: { total: 2, active: 2, roleCounts: { admin: 1, agent: 1, owner: 0, manager: 0, finance: 0, operations: 0 } },
    roleCounts: { all: 2, admin: 1, agent: 1, owner: 0, manager: 0, finance: 0, operations: 0 },
    loading: false,
    error: null,
    search: '',
    roleFilter: 'all',
    statusFilter: 'all',
    currentPage: 1,
    ITEMS_PER_PAGE: 10,
    handleChangeRole: vi.fn(),
    handleToggleStatus: vi.fn(),
    handleSearchChange: vi.fn(),
    handleRoleFilterChange: vi.fn(),
    handleStatusFilterChange: vi.fn(),
    setCurrentPage: vi.fn(),
    retryFetch: vi.fn(),
    goBack: vi.fn(),
    getRoleBadgeVariant: (r: string) => r === 'admin' ? 'error' : 'success',
    getStatusBadgeVariant: (s: string) => s === 'active' ? 'success' : 'secondary',
    formatDate: (v: string | undefined) => v ? new Date(v).toLocaleDateString() : 'N/A',
    ...hookOverrides,
  }),
  ROLE_CONFIG: {
    owner: { label: 'Owner', color: '#8B5CF6', badgeVariant: 'primary' },
    manager: { label: 'Manager', color: '#3B82F6', badgeVariant: 'info' },
    admin: { label: 'Admin', color: '#EC4899', badgeVariant: 'error' },
    agent: { label: 'Agent', color: '#10B981', badgeVariant: 'success' },
    finance: { label: 'Finance', color: '#F59E0B', badgeVariant: 'warning' },
    operations: { label: 'Operations', color: '#6B7280', badgeVariant: 'secondary' },
  },
  STATUS_CONFIG: {
    active: { label: 'Active', badgeVariant: 'success' },
    inactive: { label: 'Inactive', badgeVariant: 'secondary' },
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

import UserManagementPage from './UserManagementPage';

describe('UserManagementPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hookOverrides = {};
  });

  it('renders page title "User Management"', () => {
    render(<UserManagementPage />);
    expect(screen.getByText(/User Management/)).toBeDefined();
  });

  it('renders role filter tabs', () => {
    render(<UserManagementPage />);
    expect(screen.getByText(/All \(2\)/)).toBeDefined();
    // Role tabs render labels from ROLE_CONFIG
    expect(screen.getAllByText(/Owner/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Manager/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Admin/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Agent/).length).toBeGreaterThan(0);
  });

  it('renders table headers', () => {
    render(<UserManagementPage />);
    expect(screen.getByText('Name')).toBeDefined();
    expect(screen.getByText('Email')).toBeDefined();
    expect(screen.getByText('Role')).toBeDefined();
    expect(screen.getByText('Department')).toBeDefined();
    expect(screen.getByText('Status')).toBeDefined();
    expect(screen.getByText('Last Active')).toBeDefined();
    expect(screen.getByText('Actions')).toBeDefined();
  });

  it('shows empty state when no users', () => {
    hookOverrides = { paginatedUsers: [], filteredUsers: [] };
    render(<UserManagementPage />);
    expect(screen.getByText('No users found')).toBeDefined();
  });
});
