import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock Button
vi.mock('../ui/Button', () => ({
  default: React.memo(({ children, ...props }: any) =>
    React.createElement('button', { ...props, 'data-testid': `btn-${children?.toString().toLowerCase().replace(/\s/g, '-')}` }, children)
  ),
}));

// Mock Flex
vi.mock('../layout/Flex', () => ({
  default: ({ children, ...props }: any) =>
    React.createElement('div', { 'data-testid': 'flex', ...props }, children),
}));

// Mock styled components
vi.mock('./DataTable.styles', () => {
  const c = (tag: string, name: string) => {
    const Comp = ({ children, ...props }: any) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) clean[k] = v;
      }
      return React.createElement(tag, { ...clean, 'data-testid': name }, children);
    };
    Comp.displayName = name;
    return Comp;
  };
  return {
    DataTableWrapper: c('div', 'data-table-wrapper'),
    DataTableContainer: c('div', 'data-table-container'),
    StyledTable: c('table', 'styled-table'),
    TableHead: c('thead', 'table-head'),
    TableHeader: c('th', 'table-header'),
    SortIcon: c('span', 'sort-icon'),
    TableBody: c('tbody', 'table-body'),
    TableRow: c('tr', 'table-row'),
    TableCell: c('td', 'table-cell'),
    EmptyState: c('div', 'empty-state'),
    SkeletonWrapper: c('div', 'skeleton-wrapper'),
    SkeletonRow: c('div', 'skeleton-row'),
    SkeletonCell: c('div', 'skeleton-cell'),
    PaginationContainer: c('div', 'pagination-container'),
    PaginationInfo: c('span', 'pagination-info'),
  };
});

import DataTable from './DataTable';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'status', header: 'Status' },
];

const sampleData = [
  { id: '1', name: 'Alice Johnson', email: 'alice@test.com', status: 'Active' },
  { id: '2', name: 'Bob Smith', email: 'bob@test.com', status: 'Inactive' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@test.com', status: 'Active' },
];

describe('DataTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Loading State ──────────────────────────────────────────
  describe('loading', () => {
    it('renders skeleton rows when loading', () => {
      render(<DataTable loading columns={columns} />);
      expect(screen.getByTestId('skeleton-wrapper')).toBeInTheDocument();
    });

    it('renders 5 skeleton rows', () => {
      render(<DataTable loading columns={columns} />);
      const skeletonRows = screen.getAllByTestId('skeleton-row');
      expect(skeletonRows.length).toBe(5);
    });
  });

  // ── Empty State ────────────────────────────────────────────
  describe('empty state', () => {
    it('renders default empty message when no data', () => {
      render(<DataTable columns={columns} data={[]} />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('renders custom empty message', () => {
      render(<DataTable columns={columns} data={[]} emptyMessage="No records found" />);
      expect(screen.getByText('No records found')).toBeInTheDocument();
    });
  });

  // ── Data Rendering ─────────────────────────────────────────
  describe('data rendering', () => {
    it('renders table with column headers', () => {
      render(<DataTable columns={columns} data={sampleData} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders all data rows', () => {
      render(<DataTable columns={columns} data={sampleData} />);
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      expect(screen.getByText('Charlie Brown')).toBeInTheDocument();
    });

    it('renders cell values correctly', () => {
      render(<DataTable columns={columns} data={sampleData} />);
      expect(screen.getByText('alice@test.com')).toBeInTheDocument();
      expect(screen.getAllByText('Active').length).toBe(2);
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });

    it('uses custom render function for columns', () => {
      const customColumns = [
        ...columns.slice(0, 2),
        {
          key: 'status',
          header: 'Status',
          render: (value: unknown) => React.createElement('strong', null, String(value)),
        },
      ];
      render(<DataTable columns={customColumns} data={sampleData} />);
      const strongs = document.querySelectorAll('strong');
      expect(strongs.length).toBe(3);
    });
  });

  // ── Sorting ────────────────────────────────────────────────
  describe('sorting', () => {
    it('sorts ascending on header click', () => {
      render(<DataTable columns={columns} data={sampleData} sortable />);
      fireEvent.click(screen.getByText('Name'));
      const rows = screen.getAllByTestId('table-row');
      expect(rows.length).toBe(3);
    });

    it('toggles sort direction on second click', () => {
      render(<DataTable columns={columns} data={sampleData} sortable />);
      fireEvent.click(screen.getByText('Name'));
      // Ascending first
      expect(screen.getByText('↑')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Name'));
      // Descending
      expect(screen.getByText('↓')).toBeInTheDocument();
    });

    it('does not sort when sortable is false', () => {
      render(<DataTable columns={columns} data={sampleData} sortable={false} />);
      fireEvent.click(screen.getByText('Name'));
      expect(screen.queryByText('↑')).not.toBeInTheDocument();
    });
  });

  // ── Pagination ─────────────────────────────────────────────
  describe('pagination', () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: String(i + 1),
      name: `User ${i + 1}`,
      email: `user${i + 1}@test.com`,
      status: 'Active',
    }));

    it('renders pagination when paginated is true', () => {
      render(<DataTable columns={columns} data={largeData} paginated pageSize={10} />);
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    });

    it('renders only pageSize rows per page', () => {
      render(<DataTable columns={columns} data={largeData} paginated pageSize={10} />);
      const rows = screen.getAllByTestId('table-row');
      expect(rows.length).toBe(10);
    });

    it('navigates to next page', () => {
      render(<DataTable columns={columns} data={largeData} paginated pageSize={10} />);
      fireEvent.click(screen.getByText('Next'));
      expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    });

    it('navigates to previous page', () => {
      render(<DataTable columns={columns} data={largeData} paginated pageSize={10} />);
      fireEvent.click(screen.getByText('Next'));
      fireEvent.click(screen.getByText('Previous'));
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    });

    it('disables Previous on first page', () => {
      render(<DataTable columns={columns} data={largeData} paginated pageSize={10} />);
      const prevBtn = screen.getByTestId('btn-previous');
      expect(prevBtn).toBeDisabled();
    });

    it('disables Next on last page', () => {
      render(<DataTable columns={columns} data={largeData} paginated pageSize={10} />);
      fireEvent.click(screen.getByTestId('btn-next'));
      fireEvent.click(screen.getByTestId('btn-next'));
      expect(screen.getByTestId('btn-next')).toBeDisabled();
    });

    it('does not show pagination when data fits on one page', () => {
      render(<DataTable columns={columns} data={sampleData} paginated pageSize={10} />);
      expect(screen.queryByText(/Page/)).not.toBeInTheDocument();
    });
  });

  // ── Selection ──────────────────────────────────────────────
  describe('selection', () => {
    it('renders checkboxes when selectable', () => {
      render(<DataTable columns={columns} data={sampleData} selectable onSelectionChange={vi.fn()} />);
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBe(4); // 1 select-all + 3 row checkboxes
    });

    it('selects all rows on select-all checkbox click', () => {
      const onSelectionChange = vi.fn();
      render(<DataTable columns={columns} data={sampleData} selectable onSelectionChange={onSelectionChange} selectedRows={[]} />);
      const selectAllCheckbox = screen.getByLabelText('Select all rows');
      fireEvent.click(selectAllCheckbox);
      expect(onSelectionChange).toHaveBeenCalledWith(['1', '2', '3']);
    });

    it('deselects all rows on select-all uncheck', () => {
      const onSelectionChange = vi.fn();
      render(<DataTable columns={columns} data={sampleData} selectable onSelectionChange={onSelectionChange} selectedRows={['1', '2', '3']} />);
      const selectAllCheckbox = screen.getByLabelText('Select all rows');
      fireEvent.click(selectAllCheckbox);
      expect(onSelectionChange).toHaveBeenCalledWith([]);
    });

    it('calls onSelectionChange when individual row is selected', () => {
      const onSelectionChange = vi.fn();
      render(<DataTable columns={columns} data={sampleData} selectable onSelectionChange={onSelectionChange} selectedRows={[]} />);
      const rowCheckbox = screen.getByLabelText('Select row 1');
      fireEvent.click(rowCheckbox);
      expect(onSelectionChange).toHaveBeenCalledWith(['1']);
    });

    it('deselects row when already selected', () => {
      const onSelectionChange = vi.fn();
      render(<DataTable columns={columns} data={sampleData} selectable onSelectionChange={onSelectionChange} selectedRows={['1']} />);
      const rowCheckbox = screen.getByLabelText('Select row 1');
      fireEvent.click(rowCheckbox);
      expect(onSelectionChange).toHaveBeenCalledWith([]);
    });
  });

  // ── Row Click ──────────────────────────────────────────────
  describe('row click', () => {
    it('calls onRowClick with row data', () => {
      const onRowClick = vi.fn();
      render(<DataTable columns={columns} data={sampleData} onRowClick={onRowClick} />);
      fireEvent.click(screen.getByText('Alice Johnson'));
      expect(onRowClick).toHaveBeenCalledWith(sampleData[0]);
    });
  });

  // ── Defaults ───────────────────────────────────────────────
  describe('defaults', () => {
    it('renders without crashing with no props', () => {
      render(<DataTable />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });
});
