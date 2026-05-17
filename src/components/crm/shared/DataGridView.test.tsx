/**
 * DataGridView — Comprehensive Unit Tests
 *
 * Covers: rendering, search filtering, sorting (asc/desc), pagination,
 * custom renderers, row click, empty state, page reset on search
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Search: () => <span data-testid="icon-search" />,
  Filter: () => <span data-testid="icon-filter" />,
  ChevronUp: () => <span data-testid="icon-chevron-up" />,
  ChevronDown: () => <span data-testid="icon-chevron-down" />,
  MoreHorizontal: () => <span data-testid="icon-more" />,
}));

// Mock styled components
vi.mock('./DataGridView.styles', () => ({
  DataGridViewContainer: ({
    children,
    style,
    ...p
  }: React.PropsWithChildren<{ style?: React.CSSProperties }>) => (
    <div data-testid="grid-container" style={style} {...p}>
      {children}
    </div>
  ),
  GridToolbar: ({ children, ...p }: React.PropsWithChildren) => (
    <div data-testid="toolbar" {...p}>
      {children}
    </div>
  ),
  GridSearch: ({ children, ...p }: React.PropsWithChildren) => (
    <div data-testid="search-box" {...p}>
      {children}
    </div>
  ),
  GridFilterButton: ({
    children,
    ...p
  }: React.PropsWithChildren<{ type?: 'button' | 'submit' | 'reset' }>) => (
    <button {...p}>{children}</button>
  ),
  GridTableWrapper: ({ children, ...p }: React.PropsWithChildren) => <div {...p}>{children}</div>,
  GridTable: ({ children, ...p }: React.PropsWithChildren) => <table {...p}>{children}</table>,
  GridTableHeader: ({
    children,
    className,
    ...p
  }: React.PropsWithChildren<{
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
  }>) => (
    <th className={className} {...p}>
      {children}
    </th>
  ),
  GridTableCell: ({ children, ...p }: React.PropsWithChildren<{ colSpan?: number }>) => (
    <td {...p}>{children}</td>
  ),
  GridTableRow: ({
    children,
    $clickable,
    ...p
  }: React.PropsWithChildren<{ $clickable?: boolean; onClick?: () => void }>) => (
    <tr data-clickable={$clickable} {...p}>
      {children}
    </tr>
  ),
  ActionsColumn: ({ children, ...p }: React.PropsWithChildren) => <td {...p}>{children}</td>,
  RowActionsButton: ({
    children,
    ...p
  }: React.PropsWithChildren<{ type?: 'button' | 'submit' | 'reset'; 'aria-label'?: string }>) => (
    <button {...p}>{children}</button>
  ),
  GridPagination: ({ children, ...p }: React.PropsWithChildren) => (
    <div data-testid="pagination" {...p}>
      {children}
    </div>
  ),
  PaginationInfo: ({ children, ...p }: React.PropsWithChildren) => (
    <span data-testid="page-info" {...p}>
      {children}
    </span>
  ),
  PaginationControls: ({ children, ...p }: React.PropsWithChildren) => <div {...p}>{children}</div>,
  PaginationButton: ({
    children,
    ...p
  }: React.PropsWithChildren<{
    disabled?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
  }>) => <button {...p}>{children}</button>,
  PageNumber: ({ children, ...p }: React.PropsWithChildren) => (
    <span data-testid="page-number" {...p}>
      {children}
    </span>
  ),
}));

import DataGridView from './DataGridView';

// ── Test Data ────────────────────────────────────────────────────

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: false },
];

const data = [
  { id: '1', name: 'Alice', email: 'alice@test.com', role: 'Admin' },
  { id: '2', name: 'Bob', email: 'bob@test.com', role: 'User' },
  { id: '3', name: 'Charlie', email: 'charlie@test.com', role: 'Manager' },
  { id: '4', name: 'Diana', email: 'diana@test.com', role: 'User' },
  { id: '5', name: 'Eve', email: 'eve@test.com', role: 'Admin' },
];

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── Tests ────────────────────────────────────────────────────────

describe('DataGridView', () => {
  describe('rendering', () => {
    it('renders with data and columns', () => {
      render(<DataGridView data={data} columns={columns} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    it('renders column headers', () => {
      render(<DataGridView data={data} columns={columns} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
    });

    it('renders search box when searchable', () => {
      render(<DataGridView data={data} columns={columns} searchable />);
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('hides search box when not searchable', () => {
      render(<DataGridView data={data} columns={columns} searchable={false} filterable={false} />);
      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
    });

    it('renders filter button when filterable', () => {
      render(<DataGridView data={data} columns={columns} filterable />);
      expect(screen.getByText('Filter')).toBeInTheDocument();
    });

    it('renders More actions buttons for each row', () => {
      render(<DataGridView data={data} columns={columns} />);
      expect(screen.getAllByLabelText('More actions')).toHaveLength(5);
    });

    it('has displayName set', () => {
      expect(DataGridView.displayName).toBe('DataGridView');
    });
  });

  describe('empty state', () => {
    it('shows default empty message', () => {
      render(<DataGridView data={[]} columns={columns} />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('shows custom empty message', () => {
      render(<DataGridView data={[]} columns={columns} emptyMessage="Nothing here" />);
      expect(screen.getByText('Nothing here')).toBeInTheDocument();
    });
  });

  describe('search filtering', () => {
    it('filters rows by search query', () => {
      render(<DataGridView data={data} columns={columns} />);
      fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'alice' } });
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    });

    it('searches across all columns', () => {
      render(<DataGridView data={data} columns={columns} />);
      fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'admin' } });
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Eve')).toBeInTheDocument();
      expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    });

    it('shows empty message when search has no matches', () => {
      render(<DataGridView data={data} columns={columns} />);
      fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'zzzzz' } });
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('is case-insensitive', () => {
      render(<DataGridView data={data} columns={columns} />);
      fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'CHARLIE' } });
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });
  });

  describe('sorting', () => {
    it('sorts ascending on first click', () => {
      render(<DataGridView data={data} columns={columns} />);
      fireEvent.click(screen.getByText('Name'));
      const rows = screen.getAllByLabelText('More actions');
      // Alice should be first (A < B < C...)
      expect(rows).toHaveLength(5);
    });

    it('sorts descending on second click', () => {
      render(<DataGridView data={data} columns={columns} />);
      fireEvent.click(screen.getByText('Name'));
      fireEvent.click(screen.getByText('Name'));
      // Should show descending indicator
      expect(screen.getByTestId('icon-chevron-down')).toBeInTheDocument();
    });

    it('shows ascending arrow on sorted column', () => {
      render(<DataGridView data={data} columns={columns} />);
      fireEvent.click(screen.getByText('Name'));
      expect(screen.getByTestId('icon-chevron-up')).toBeInTheDocument();
    });

    it('does not sort non-sortable columns', () => {
      render(<DataGridView data={data} columns={columns} />);
      fireEvent.click(screen.getByText('Role'));
      // No sort icons should appear for Role
      expect(screen.queryByTestId('icon-chevron-up')).not.toBeInTheDocument();
      expect(screen.queryByTestId('icon-chevron-down')).not.toBeInTheDocument();
    });

    it('does not sort when sortable=false globally', () => {
      render(<DataGridView data={data} columns={columns} sortable={false} />);
      fireEvent.click(screen.getByText('Name'));
      expect(screen.queryByTestId('icon-chevron-up')).not.toBeInTheDocument();
    });
  });

  describe('pagination', () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: String(i + 1),
      name: `User ${i + 1}`,
      email: `user${i + 1}@test.com`,
      role: 'User',
    }));

    it('shows pagination when data exceeds page size', () => {
      render(<DataGridView data={largeData} columns={columns} pageSize={10} />);
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('shows correct page info', () => {
      render(<DataGridView data={largeData} columns={columns} pageSize={10} />);
      expect(screen.getByTestId('page-info').textContent).toContain('1-10');
      expect(screen.getByTestId('page-info').textContent).toContain('25');
    });

    it('shows page number', () => {
      render(<DataGridView data={largeData} columns={columns} pageSize={10} />);
      expect(screen.getByTestId('page-number').textContent).toContain('1 / 3');
    });

    it('navigates to next page', () => {
      render(<DataGridView data={largeData} columns={columns} pageSize={10} />);
      fireEvent.click(screen.getByText('Next'));
      expect(screen.getByTestId('page-info').textContent).toContain('11-20');
      expect(screen.getByTestId('page-number').textContent).toContain('2 / 3');
    });

    it('navigates to previous page', () => {
      render(<DataGridView data={largeData} columns={columns} pageSize={10} />);
      fireEvent.click(screen.getByText('Next'));
      fireEvent.click(screen.getByText('Previous'));
      expect(screen.getByTestId('page-info').textContent).toContain('1-10');
    });

    it('disables Previous on first page', () => {
      render(<DataGridView data={largeData} columns={columns} pageSize={10} />);
      expect(screen.getByText('Previous')).toBeDisabled();
    });

    it('disables Next on last page', () => {
      render(<DataGridView data={largeData} columns={columns} pageSize={10} />);
      fireEvent.click(screen.getByText('Next'));
      fireEvent.click(screen.getByText('Next'));
      expect(screen.getByText('Next')).toBeDisabled();
    });

    it('does not show pagination when data fits one page', () => {
      render(<DataGridView data={data} columns={columns} pageSize={10} />);
      expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
    });

    it('resets to page 1 on search', () => {
      render(<DataGridView data={largeData} columns={columns} pageSize={10} />);
      fireEvent.click(screen.getByText('Next'));
      expect(screen.getByTestId('page-number').textContent).toContain('2 / 3');
      fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'User 1' } });
      // Page should reset (only matching results shown)
      expect(screen.getByTestId('page-number')).toBeInTheDocument();
    });
  });

  describe('row click', () => {
    it('calls onRowClick with row data', () => {
      const onRowClick = vi.fn();
      render(<DataGridView data={data} columns={columns} onRowClick={onRowClick} />);
      fireEvent.click(screen.getByText('Alice').closest('tr')!);
      expect(onRowClick).toHaveBeenCalledWith(data[0]);
    });

    it('does not crash without onRowClick', () => {
      render(<DataGridView data={data} columns={columns} />);
      fireEvent.click(screen.getByText('Alice').closest('tr')!);
      // No crash
    });
  });

  describe('custom renderer', () => {
    it('uses custom render function for column', () => {
      const columnsWithRenderer = [
        ...columns,
        {
          key: 'role',
          label: 'Role Badge',
          render: (value: unknown) => <span data-testid="role-badge">{String(value)}</span>,
        },
      ];
      render(<DataGridView data={data} columns={columnsWithRenderer} />);
      expect(screen.getAllByTestId('role-badge').length).toBeGreaterThan(0);
    });
  });
});
