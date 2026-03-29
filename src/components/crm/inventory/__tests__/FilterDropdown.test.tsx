import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  ChevronDown: (props: any) => <svg data-testid="icon-chevron" {...props} />,
}));

// Mock styled components
vi.mock('../FilterDropdown.styles', () => ({
  FilterDropdownContainer: ({ children, ...props }: any) => <div data-testid="filter-container" {...props}>{children}</div>,
  FilterLabel: ({ children, ...props }: any) => <label data-testid="filter-label" {...props}>{children}</label>,
  SelectWrapper: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Select: React.forwardRef(({ children, ...props }: any, ref: any) => <select data-testid="filter-select" ref={ref} {...props}>{children}</select>),
  DropdownIcon: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

import FilterDropdown from '../FilterDropdown';

describe('FilterDropdown', () => {
  const defaultProps = {
    label: 'Status',
    value: null as string | null,
    options: ['Active', 'Sold', 'Reserved'] as (string | { value: string; label: string; count?: number })[],
    onChange: vi.fn(),
  };

  describe('Basic Rendering', () => {
    it('should render with label', () => {
      render(<FilterDropdown {...defaultProps} />);
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('should render placeholder option', () => {
      render(<FilterDropdown {...defaultProps} />);
      expect(screen.getByText('All')).toBeInTheDocument();
    });

    it('should render custom placeholder', () => {
      render(<FilterDropdown {...defaultProps} placeholder="Select..." />);
      expect(screen.getByText('Select...')).toBeInTheDocument();
    });

    it('should render string options', () => {
      render(<FilterDropdown {...defaultProps} />);
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Sold')).toBeInTheDocument();
      expect(screen.getByText('Reserved')).toBeInTheDocument();
    });

    it('should render chevron icon', () => {
      render(<FilterDropdown {...defaultProps} />);
      expect(screen.getByTestId('icon-chevron')).toBeInTheDocument();
    });
  });

  describe('Object Options', () => {
    const objectOptions = [
      { value: 'active', label: 'Active', count: 15 },
      { value: 'sold', label: 'Sold', count: 8 },
      { value: 'reserved', label: 'Reserved', count: 3 },
    ];

    it('should render object option labels', () => {
      render(<FilterDropdown {...defaultProps} options={objectOptions} />);
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Sold')).toBeInTheDocument();
      expect(screen.getByText('Reserved')).toBeInTheDocument();
    });

    it('should show count when showCount is true', () => {
      render(<FilterDropdown {...defaultProps} options={objectOptions} showCount={true} />);
      expect(screen.getByText('Active (15)')).toBeInTheDocument();
      expect(screen.getByText('Sold (8)')).toBeInTheDocument();
      expect(screen.getByText('Reserved (3)')).toBeInTheDocument();
    });

    it('should not show count when showCount is false', () => {
      render(<FilterDropdown {...defaultProps} options={objectOptions} showCount={false} />);
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.queryByText('Active (15)')).not.toBeInTheDocument();
    });

    it('should not show count for options without count property', () => {
      const noCountOptions = [
        { value: 'active', label: 'Active' },
        { value: 'sold', label: 'Sold' },
      ];
      render(<FilterDropdown {...defaultProps} options={noCountOptions} showCount={true} />);
      // No count to show, so just label
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.queryByText(/Active \(/)).not.toBeInTheDocument();
    });
  });

  describe('Selection & onChange', () => {
    it('should call onChange with selected value', () => {
      const onChange = vi.fn();
      render(<FilterDropdown {...defaultProps} onChange={onChange} />);

      const select = screen.getByTestId('filter-select');
      fireEvent.change(select, { target: { value: 'Active' } });
      expect(onChange).toHaveBeenCalledWith('Active');
    });

    it('should call onChange with null when "All" selected', () => {
      const onChange = vi.fn();
      render(<FilterDropdown {...defaultProps} value="Active" onChange={onChange} />);

      const select = screen.getByTestId('filter-select');
      fireEvent.change(select, { target: { value: '' } });
      expect(onChange).toHaveBeenCalledWith(null);
    });

    it('should show current value as selected', () => {
      render(<FilterDropdown {...defaultProps} value="Active" />);

      const select = screen.getByTestId('filter-select') as HTMLSelectElement;
      expect(select.value).toBe('Active');
    });

    it('should show empty value when value is null', () => {
      render(<FilterDropdown {...defaultProps} value={null} />);

      const select = screen.getByTestId('filter-select') as HTMLSelectElement;
      expect(select.value).toBe('');
    });
  });

  describe('Disabled State', () => {
    it('should disable the select when disabled prop is true', () => {
      render(<FilterDropdown {...defaultProps} disabled={true} />);

      const select = screen.getByTestId('filter-select') as HTMLSelectElement;
      expect(select.disabled).toBe(true);
    });

    it('should not disable the select by default', () => {
      render(<FilterDropdown {...defaultProps} />);

      const select = screen.getByTestId('filter-select') as HTMLSelectElement;
      expect(select.disabled).toBe(false);
    });
  });

  describe('Object Option Values', () => {
    it('should use object value attribute for option value', () => {
      const objectOptions = [
        { value: 'active_status', label: 'Active Properties' },
      ];
      const onChange = vi.fn();
      render(<FilterDropdown {...defaultProps} options={objectOptions} onChange={onChange} />);

      const select = screen.getByTestId('filter-select');
      fireEvent.change(select, { target: { value: 'active_status' } });
      expect(onChange).toHaveBeenCalledWith('active_status');
    });
  });
});
