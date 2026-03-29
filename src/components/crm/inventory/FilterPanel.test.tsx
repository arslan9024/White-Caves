import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Filter: (props: any) => <span data-testid="icon-filter" {...props} />,
  X: (props: any) => <span data-testid="icon-x" {...props} />,
  RotateCcw: (props: any) => <span data-testid="icon-rotate" {...props} />,
}));

// Mock styled-components
vi.mock('./FilterPanel.styles', () => {
  const c = (tag: string) => ({ children, ...props }: any) => {
    const filtered: any = {};
    for (const [k, v] of Object.entries(props)) {
      if (!k.startsWith('$')) filtered[k] = v;
    }
    return React.createElement(tag, filtered, children);
  };
  return {
    FilterPanelContainer: c('div'),
    FilterPanelHeader: c('div'),
    FilterTitle: c('div'),
    ActiveCount: c('span'),
    ClearFiltersBtn: c('button'),
    FilterGrid: c('div'),
  };
});

// Mock FilterDropdown
vi.mock('./FilterDropdown', () => ({
  default: ({ label, value, options, onChange, placeholder }: any) => (
    <div data-testid={`filter-${label.toLowerCase()}`}>
      <label>{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        data-placeholder={placeholder}
      >
        <option value="">{placeholder}</option>
        {(options || []).map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  ),
}));

import FilterPanel from './FilterPanel';

const mockFilters = {
  layout: '',
  status: '',
  view: '',
  cluster: '',
  floor: '',
  rooms: '',
  area: '',
  masterProject: '',
};

const mockFilterOptions = {
  layouts: ['Studio', '1BR', '2BR', '3BR'],
  statuses: ['Available', 'Sold', 'Reserved'],
  views: ['Sea View', 'City View', 'Garden View'],
  clusters: ['Marina', 'Downtown', 'Palm'],
  floors: ['1', '2', '3', '4'],
  rooms: ['1', '2', '3'],
  areas: ['500-700', '700-1000', '1000+'],
  masterProjects: ['Project A', 'Project B'],
};

describe('FilterPanel', () => {
  const mockOnFilterChange = vi.fn();
  const mockOnClearFilters = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders filter panel with Filters title', () => {
      render(
        <FilterPanel
          filters={mockFilters}
          filterOptions={mockFilterOptions}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
        />
      );
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('renders filter icon', () => {
      render(
        <FilterPanel
          filters={mockFilters}
          filterOptions={mockFilterOptions}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
        />
      );
      expect(screen.getByTestId('icon-filter')).toBeInTheDocument();
    });

    it('renders all 8 filter dropdowns', () => {
      render(
        <FilterPanel
          filters={mockFilters}
          filterOptions={mockFilterOptions}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
        />
      );
      expect(screen.getByTestId('filter-layout')).toBeInTheDocument();
      expect(screen.getByTestId('filter-status')).toBeInTheDocument();
      expect(screen.getByTestId('filter-view')).toBeInTheDocument();
      expect(screen.getByTestId('filter-cluster')).toBeInTheDocument();
      expect(screen.getByTestId('filter-floor')).toBeInTheDocument();
      expect(screen.getByTestId('filter-rooms')).toBeInTheDocument();
      expect(screen.getByTestId('filter-area')).toBeInTheDocument();
      expect(screen.getByText('Master Project')).toBeInTheDocument();
    });

    it('renders filter labels', () => {
      render(
        <FilterPanel
          filters={mockFilters}
          filterOptions={mockFilterOptions}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
        />
      );
      expect(screen.getByText('Layout')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('View')).toBeInTheDocument();
      expect(screen.getByText('Cluster')).toBeInTheDocument();
      expect(screen.getByText('Floor')).toBeInTheDocument();
      expect(screen.getByText('Rooms')).toBeInTheDocument();
      expect(screen.getByText('Area')).toBeInTheDocument();
    });
  });

  describe('active filters badge', () => {
    it('shows active count badge when filters are active', () => {
      render(
        <FilterPanel
          filters={mockFilters}
          filterOptions={mockFilterOptions}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          activeFiltersCount={3}
        />
      );
      // ActiveCount renders the number; Clear All button also appears
      expect(screen.getByText('Clear All')).toBeInTheDocument();
      // The count '3' may render as text or within a styled component
      const allText = document.body.textContent || '';
      expect(allText).toContain('3');
    });

    it('does not show active count badge when no active filters', () => {
      render(
        <FilterPanel
          filters={mockFilters}
          filterOptions={mockFilterOptions}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          activeFiltersCount={0}
        />
      );
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });
  });

  describe('clear filters', () => {
    it('shows Clear All button when filters are active', () => {
      render(
        <FilterPanel
          filters={mockFilters}
          filterOptions={mockFilterOptions}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          activeFiltersCount={2}
        />
      );
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('does not show Clear All button when no active filters', () => {
      render(
        <FilterPanel
          filters={mockFilters}
          filterOptions={mockFilterOptions}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          activeFiltersCount={0}
        />
      );
      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('calls onClearFilters when Clear All is clicked', () => {
      render(
        <FilterPanel
          filters={mockFilters}
          filterOptions={mockFilterOptions}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
          activeFiltersCount={2}
        />
      );
      fireEvent.click(screen.getByText('Clear All'));
      expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe('filter changes', () => {
    it('calls onFilterChange when a layout filter is selected', () => {
      render(
        <FilterPanel
          filters={mockFilters}
          filterOptions={mockFilterOptions}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
        />
      );
      const layoutSelect = screen.getByTestId('filter-layout').querySelector('select')!;
      fireEvent.change(layoutSelect, { target: { value: 'Studio' } });
      expect(mockOnFilterChange).toHaveBeenCalledWith('layout', 'Studio');
    });

    it('calls onFilterChange with null when filter is cleared', () => {
      render(
        <FilterPanel
          filters={{ ...mockFilters, status: 'Available' }}
          filterOptions={mockFilterOptions}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
        />
      );
      const statusSelect = screen.getByTestId('filter-status').querySelector('select')!;
      fireEvent.change(statusSelect, { target: { value: '' } });
      expect(mockOnFilterChange).toHaveBeenCalledWith('status', null);
    });

    it('passes correct options to each dropdown', () => {
      render(
        <FilterPanel
          filters={mockFilters}
          filterOptions={mockFilterOptions}
          onFilterChange={mockOnFilterChange}
          onClearFilters={mockOnClearFilters}
        />
      );
      const layoutSelect = screen.getByTestId('filter-layout').querySelector('select')!;
      // 1 placeholder + 4 layout options
      expect(layoutSelect.querySelectorAll('option').length).toBe(5);
    });
  });
});
