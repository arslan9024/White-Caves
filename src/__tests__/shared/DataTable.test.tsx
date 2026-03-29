/**
 * DataTable.test.tsx — Batch 27
 * Tests for DataTable component
 * Covers: rendering, loading, empty state, sorting, pagination, selection, row clicks
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

// Mock styled-components
vi.mock('../../shared/components/data/DataTable.styles', () => ({
  DataTableWrapper: ({ children, ...props }: any) => <div data-testid="dt-wrapper" {...props}>{children}</div>,
  DataTableContainer: ({ children, ...props }: any) => <div data-testid="dt-container" {...props}>{children}</div>,
  StyledTable: ({ children, ...props }: any) => <table data-testid="dt-table" {...props}>{children}</table>,
  TableHead: ({ children, ...props }: any) => <thead {...props}>{children}</thead>,
  TableHeader: ({ children, onClick, ...props }: any) => <th onClick={onClick} {...props}>{children}</th>,
  TableBody: ({ children, ...props }: any) => <tbody {...props}>{children}</tbody>,
  TableRow: ({ children, onClick, ...props }: any) => <tr onClick={onClick} data-testid="dt-row" {...props}>{children}</tr>,
  TableCell: ({ children, ...props }: any) => <td {...props}>{children}</td>,
  EmptyState: ({ children, ...props }: any) => <div data-testid="dt-empty" {...props}>{children}</div>,
  PaginationContainer: ({ children, ...props }: any) => <div data-testid="dt-pagination" {...props}>{children}</div>,
  PaginationInfo: ({ children, ...props }: any) => <span data-testid="dt-page-info" {...props}>{children}</span>,
  SkeletonWrapper: ({ children, ...props }: any) => <div data-testid="dt-skeleton-wrapper" {...props}>{children}</div>,
  SkeletonRow: ({ children, ...props }: any) => <div data-testid="dt-skeleton-row" {...props}>{children}</div>,
  SkeletonCell: (props: any) => <div data-testid="dt-skeleton-cell" {...props} />,
  SortIcon: ({ children, ...props }: any) => <span data-testid="dt-sort-icon" {...props}>{children}</span>,
}));

vi.mock('../../shared/components/ui/Button', () => ({
  default: ({ children, onClick, disabled, variant, size, ...rest }: any) => (
    <button onClick={onClick} disabled={disabled} data-variant={variant} data-size={size} {...rest}>
      {children}
    </button>
  ),
}));

vi.mock('../../shared/components/layout/Flex', () => ({
  default: ({ children, ...rest }: any) => <div data-testid="flex" {...rest}>{children}</div>,
}));

import DataTable from '../../shared/components/data/DataTable';

// Test data
const mockColumns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'status', header: 'Status' },
];

const mockData = [
  { id: 1, name: 'Alice', email: 'alice@test.com', status: 'Active' },
  { id: 2, name: 'Bob', email: 'bob@test.com', status: 'Inactive' },
  { id: 3, name: 'Charlie', email: 'charlie@test.com', status: 'Active' },
];

describe('DataTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── RENDERING ─────────────────────────────────────────────
  describe('Rendering', () => {
    it('renders without crashing with default props', () => {
      render(<DataTable />);
      // With no data, shows empty state
      expect(screen.getByTestId('dt-empty')).toBeInTheDocument();
    });

    it('renders table with data and columns', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);
      expect(screen.getByTestId('dt-table')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders all data rows', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    it('renders cell values for each column', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);
      expect(screen.getByText('alice@test.com')).toBeInTheDocument();
      expect(screen.getByText('bob@test.com')).toBeInTheDocument();
    });
  });

  // ─── LOADING STATE ─────────────────────────────────────────
  describe('Loading State', () => {
    it('shows skeleton loading when loading=true', () => {
      render(<DataTable columns={mockColumns} data={mockData} loading={true} />);
      expect(screen.getByTestId('dt-skeleton-wrapper')).toBeInTheDocument();
    });

    it('renders 5 skeleton rows', () => {
      render(<DataTable columns={mockColumns} data={mockData} loading={true} />);
      const skeletonRows = screen.getAllByTestId('dt-skeleton-row');
      expect(skeletonRows).toHaveLength(5);
    });

    it('does not show table content when loading', () => {
      render(<DataTable columns={mockColumns} data={mockData} loading={true} />);
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });
  });

  // ─── EMPTY STATE ───────────────────────────────────────────
  describe('Empty State', () => {
    it('shows default empty message when no data', () => {
      render(<DataTable columns={mockColumns} data={[]} />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('shows custom empty message', () => {
      render(<DataTable columns={mockColumns} data={[]} emptyMessage="No properties found" />);
      expect(screen.getByText('No properties found')).toBeInTheDocument();
    });

    it('shows empty state when data is undefined', () => {
      render(<DataTable columns={mockColumns} />);
      expect(screen.getByTestId('dt-empty')).toBeInTheDocument();
    });
  });

  // ─── SORTING ───────────────────────────────────────────────
  describe('Sorting', () => {
    it('sorts by column when header clicked', () => {
      render(<DataTable columns={mockColumns} data={mockData} sortable={true} />);
      const nameHeader = screen.getByText('Name').closest('th')!;
      fireEvent.click(nameHeader);
      // After clicking, sort icon should appear
      expect(screen.getByTestId('dt-sort-icon')).toBeInTheDocument();
    });

    it('toggles sort direction on second click', () => {
      render(<DataTable columns={mockColumns} data={mockData} sortable={true} />);
      const nameHeader = screen.getByText('Name').closest('th')!;
      fireEvent.click(nameHeader);
      expect(screen.getByTestId('dt-sort-icon')).toHaveTextContent('↑');
      fireEvent.click(nameHeader);
      expect(screen.getByTestId('dt-sort-icon')).toHaveTextContent('↓');
    });

    it('does not sort when sortable=false', () => {
      render(<DataTable columns={mockColumns} data={mockData} sortable={false} />);
      const nameHeader = screen.getByText('Name').closest('th')!;
      fireEvent.click(nameHeader);
      expect(screen.queryByTestId('dt-sort-icon')).not.toBeInTheDocument();
    });
  });

  // ─── PAGINATION ────────────────────────────────────────────
  describe('Pagination', () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@test.com`,
      status: 'Active',
    }));

    it('shows pagination controls when paginated=true and data exceeds pageSize', () => {
      render(<DataTable columns={mockColumns} data={largeData} paginated={true} pageSize={10} />);
      expect(screen.getByTestId('dt-pagination')).toBeInTheDocument();
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    });

    it('does not show pagination when paginated=false', () => {
      render(<DataTable columns={mockColumns} data={largeData} paginated={false} />);
      expect(screen.queryByTestId('dt-pagination')).not.toBeInTheDocument();
    });

    it('shows only first page of data', () => {
      render(<DataTable columns={mockColumns} data={largeData} paginated={true} pageSize={10} />);
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 10')).toBeInTheDocument();
      expect(screen.queryByText('User 11')).not.toBeInTheDocument();
    });

    it('navigates to next page', () => {
      render(<DataTable columns={mockColumns} data={largeData} paginated={true} pageSize={10} />);
      fireEvent.click(screen.getByText('Next'));
      expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
      expect(screen.getByText('User 11')).toBeInTheDocument();
      expect(screen.queryByText('User 1')).not.toBeInTheDocument();
    });

    it('navigates to previous page', () => {
      render(<DataTable columns={mockColumns} data={largeData} paginated={true} pageSize={10} />);
      fireEvent.click(screen.getByText('Next'));
      fireEvent.click(screen.getByText('Previous'));
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    });

    it('disables Previous on first page', () => {
      render(<DataTable columns={mockColumns} data={largeData} paginated={true} pageSize={10} />);
      expect(screen.getByText('Previous')).toBeDisabled();
    });

    it('disables Next on last page', () => {
      render(<DataTable columns={mockColumns} data={largeData} paginated={true} pageSize={10} />);
      fireEvent.click(screen.getByText('Next'));
      fireEvent.click(screen.getByText('Next'));
      expect(screen.getByText('Next')).toBeDisabled();
    });

    it('does not show pagination when data fits in one page', () => {
      render(<DataTable columns={mockColumns} data={mockData} paginated={true} pageSize={10} />);
      expect(screen.queryByTestId('dt-pagination')).not.toBeInTheDocument();
    });
  });

  // ─── SELECTION ─────────────────────────────────────────────
  describe('Selection', () => {
    it('shows checkboxes when selectable=true', () => {
      render(<DataTable columns={mockColumns} data={mockData} selectable={true} selectedRows={[]} />);
      expect(screen.getByLabelText('Select all rows')).toBeInTheDocument();
      expect(screen.getByLabelText('Select row 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Select row 2')).toBeInTheDocument();
    });

    it('does not show checkboxes when selectable=false', () => {
      render(<DataTable columns={mockColumns} data={mockData} selectable={false} />);
      expect(screen.queryByLabelText('Select all rows')).not.toBeInTheDocument();
    });

    it('calls onSelectionChange when a row checkbox is changed', () => {
      const onSelectionChange = vi.fn();
      render(
        <DataTable
          columns={mockColumns}
          data={mockData}
          selectable={true}
          selectedRows={[]}
          onSelectionChange={onSelectionChange}
        />
      );
      // The row checkbox uses onChange={() => handleSelectRow(...)}
      // Must dispatch a native change event on the input
      const checkbox = screen.getByLabelText('Select row 1');
      // Simulate the onChange handler directly by clicking the checkbox
      fireEvent.click(checkbox);
      expect(onSelectionChange).toHaveBeenCalledWith([1]);
    });

    it('calls onSelectionChange with all IDs when select-all is changed', () => {
      const onSelectionChange = vi.fn();
      render(
        <DataTable
          columns={mockColumns}
          data={mockData}
          selectable={true}
          selectedRows={[]}
          onSelectionChange={onSelectionChange}
        />
      );
      // checkbox starts unchecked (selectedRows=[] != data.length)
      // click toggles to checked, onChange fires with e.target.checked=true
      const selectAll = screen.getByLabelText('Select all rows') as HTMLInputElement;
      fireEvent.click(selectAll);
      expect(onSelectionChange).toHaveBeenCalledWith([1, 2, 3]);
    });

    it('deselects all when select-all unchecked', () => {
      const onSelectionChange = vi.fn();
      render(
        <DataTable
          columns={mockColumns}
          data={mockData}
          selectable={true}
          selectedRows={[1, 2, 3]}
          onSelectionChange={onSelectionChange}
        />
      );
      const selectAll = screen.getByLabelText('Select all rows') as HTMLInputElement;
      // Already checked since selectedRows.length === data.length
      fireEvent.click(selectAll);
      expect(onSelectionChange).toHaveBeenCalledWith([]);
    });

    it('deselects a row when clicking an already-selected row checkbox', () => {
      const onSelectionChange = vi.fn();
      render(
        <DataTable
          columns={mockColumns}
          data={mockData}
          selectable={true}
          selectedRows={[1, 2]}
          onSelectionChange={onSelectionChange}
        />
      );
      const checkbox = screen.getByLabelText('Select row 1');
      fireEvent.click(checkbox);
      expect(onSelectionChange).toHaveBeenCalledWith([2]);
    });
  });

  // ─── ROW CLICK ─────────────────────────────────────────────
  describe('Row Click', () => {
    it('calls onRowClick when a row is clicked', () => {
      const onRowClick = vi.fn();
      render(<DataTable columns={mockColumns} data={mockData} onRowClick={onRowClick} />);
      const rows = screen.getAllByTestId('dt-row');
      fireEvent.click(rows[0]);
      expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
    });

    it('does not fail when onRowClick is not provided', () => {
      render(<DataTable columns={mockColumns} data={mockData} />);
      const rows = screen.getAllByTestId('dt-row');
      expect(() => fireEvent.click(rows[0])).not.toThrow();
    });
  });

  // ─── CUSTOM RENDER ─────────────────────────────────────────
  describe('Custom Render', () => {
    it('uses custom render function for columns', () => {
      const columnsWithRender = [
        ...mockColumns.slice(0, 2),
        {
          key: 'status',
          header: 'Status',
          render: (value: unknown) => <span data-testid="custom-status">{String(value)}</span>,
        },
      ];
      render(<DataTable columns={columnsWithRender} data={mockData} />);
      const customStatuses = screen.getAllByTestId('custom-status');
      expect(customStatuses).toHaveLength(3);
      expect(customStatuses[0]).toHaveTextContent('Active');
    });
  });

  // ─── COMPONENT METADATA ────────────────────────────────────
  describe('Component Metadata', () => {
    it('has correct displayName', () => {
      expect(DataTable.displayName).toBe('DataTable');
    });
  });
});
