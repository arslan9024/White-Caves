import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

// Mock styled-components for Table
vi.mock('styled-components', async () => {
  const actual = await vi.importActual<any>('styled-components');
  return actual;
});

// Mock the Checkbox sub-component
vi.mock('../Checkbox', () => ({
  Checkbox: React.forwardRef(({ label, error, onChange, onClick, ...rest }: any, ref: any) => (
    <input type="checkbox" ref={ref} onChange={onChange} onClick={onClick} {...rest} data-testid="checkbox" />
  )),
  default: React.forwardRef(({ label, error, onChange, onClick, ...rest }: any, ref: any) => (
    <input type="checkbox" ref={ref} onChange={onChange} onClick={onClick} {...rest} data-testid="checkbox" />
  )),
}));

// Mock theme
vi.mock('../../../styles/theme', () => ({
  theme: {
    spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px' },
    colors: {
      border: '#e0e0e0',
      background: { secondary: '#f5f5f5', tertiary: '#eee' },
      text: { primary: '#222', secondary: '#666' },
      primary: '#D4AF37',
    },
    typography: {
      sizes: { sm: '13px', base: '14px' },
      weights: { semibold: 600 },
    },
    transitions: { all: 'all 0.2s ease' },
  },
}));

import { Table, TableColumn, TableRow as TRow } from './Table';

const mockColumns: TableColumn[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' },
];

const mockData: TRow[] = [
  { id: '1', name: 'Alice', email: 'alice@test.com', role: 'Admin' },
  { id: '2', name: 'Bob', email: 'bob@test.com', role: 'User' },
  { id: '3', name: 'Charlie', email: 'charlie@test.com', role: 'Editor' },
];

describe('Table', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // === RENDERING ===
  describe('rendering', () => {
    it('renders a table element', () => {
      const { container } = render(<Table columns={mockColumns} data={mockData} />);
      expect(container.querySelector('table')).toBeInTheDocument();
    });

    it('renders column headers', () => {
      render(<Table columns={mockColumns} data={mockData} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
    });

    it('renders all data rows', () => {
      render(<Table columns={mockColumns} data={mockData} />);
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    it('renders cell values from data', () => {
      render(<Table columns={mockColumns} data={mockData} />);
      expect(screen.getByText('alice@test.com')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('renders empty table with no data', () => {
      const { container } = render(<Table columns={mockColumns} data={[]} />);
      const tbody = container.querySelector('tbody');
      expect(tbody?.children.length).toBe(0);
    });

    it('handles undefined cell values gracefully', () => {
      const data: TRow[] = [{ id: '1', name: 'Test' }];
      render(<Table columns={mockColumns} data={data} />);
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  // === CUSTOM RENDER ===
  describe('custom render', () => {
    it('uses custom render function for columns', () => {
      const columnsWithRender: TableColumn[] = [
        {
          key: 'name',
          header: 'Name',
          render: (value) => React.createElement('strong', null, String(value)),
        },
        { key: 'email', header: 'Email' },
      ];
      render(<Table columns={columnsWithRender} data={mockData} />);
      const strongElements = screen.getAllByText('Alice');
      expect(strongElements.length).toBeGreaterThan(0);
    });
  });

  // === SELECTION ===
  describe('selection', () => {
    it('renders checkboxes when selectable is true', () => {
      render(<Table columns={mockColumns} data={mockData} selectable />);
      const checkboxes = screen.getAllByTestId('checkbox');
      // 1 header + 3 rows
      expect(checkboxes.length).toBe(4);
    });

    it('does not render checkboxes when selectable is false', () => {
      render(<Table columns={mockColumns} data={mockData} />);
      expect(screen.queryByTestId('checkbox')).not.toBeInTheDocument();
    });

    it('selects all rows when header checkbox is clicked', () => {
      const onSelectChange = vi.fn();
      render(
        <Table columns={mockColumns} data={mockData} selectable onSelectChange={onSelectChange} />
      );
      const checkboxes = screen.getAllByTestId('checkbox');
      // click header checkbox (first one)
      fireEvent.click(checkboxes[0]);
      expect(onSelectChange).toHaveBeenCalledWith(mockData);
    });

    it('deselects all rows when header checkbox is unchecked', () => {
      const onSelectChange = vi.fn();
      render(
        <Table columns={mockColumns} data={mockData} selectable onSelectChange={onSelectChange} />
      );
      const checkboxes = screen.getAllByTestId('checkbox');
      // Select all first
      fireEvent.click(checkboxes[0]);
      // Then deselect all
      fireEvent.click(checkboxes[0]);
      expect(onSelectChange).toHaveBeenLastCalledWith([]);
    });

    it('selects individual rows', () => {
      const onSelectChange = vi.fn();
      render(
        <Table columns={mockColumns} data={mockData} selectable onSelectChange={onSelectChange} />
      );
      const checkboxes = screen.getAllByTestId('checkbox');
      // click first row checkbox
      fireEvent.click(checkboxes[1]);
      expect(onSelectChange).toHaveBeenCalledWith([mockData[0]]);
    });

    it('deselects individual rows', () => {
      const onSelectChange = vi.fn();
      render(
        <Table columns={mockColumns} data={mockData} selectable onSelectChange={onSelectChange} />
      );
      const checkboxes = screen.getAllByTestId('checkbox');
      // Select first row
      fireEvent.click(checkboxes[1]);
      // Deselect first row
      fireEvent.click(checkboxes[1]);
      expect(onSelectChange).toHaveBeenLastCalledWith([]);
    });
  });

  // === ROW CLICK ===
  describe('row click', () => {
    it('calls onRowClick when a row is clicked', () => {
      const onRowClick = vi.fn();
      render(<Table columns={mockColumns} data={mockData} onRowClick={onRowClick} />);
      fireEvent.click(screen.getByText('Alice'));
      expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
    });

    it('calls onRowClick with correct row data', () => {
      const onRowClick = vi.fn();
      render(<Table columns={mockColumns} data={mockData} onRowClick={onRowClick} />);
      fireEvent.click(screen.getByText('Bob'));
      expect(onRowClick).toHaveBeenCalledWith(mockData[1]);
    });
  });

  // === REF FORWARDING ===
  describe('ref forwarding', () => {
    it('forwards ref to the table element', () => {
      const ref = React.createRef<HTMLTableElement>();
      render(<Table ref={ref} columns={mockColumns} data={mockData} />);
      expect(ref.current).toBeInstanceOf(HTMLTableElement);
    });
  });

  // === DISPLAY NAME ===
  describe('displayName', () => {
    it('has correct display name', () => {
      expect(Table.displayName).toBe('Table');
    });
  });
});
