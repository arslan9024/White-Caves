/**
 * PropertiesTab Component Tests
 * Tests: rendering, loading/error states, search, status/type filters,
 *        pagination, action callbacks, table content, status badges
 */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PropertiesTab from './PropertiesTab';
import type { PropertiesData } from './types';

// Mock child components
vi.mock('../../../components/ui', () => ({
  Badge: ({ children, variant }: any) => <span data-testid={`badge-${variant}`}>{children}</span>,
  Pagination: ({ page, total, onChange }: any) => (
    <div data-testid="pagination">
      <button onClick={() => onChange(page - 1)}>Prev</button>
      <span>{page}/{total}</span>
      <button onClick={() => onChange(page + 1)}>Next</button>
    </div>
  ),
}));

const sampleProperties = [
  { id: 1, code: 'WC-001', title: 'Luxury Villa', type: 'Villa', location: 'Palm Jumeirah', price: 15000000, status: 'available', agent: 'Ahmed Ali', beds: 5, baths: 6, area: 8500, image: null },
  { id: 2, code: 'WC-002', title: 'Downtown Apt', type: 'Apartment', location: 'Downtown Dubai', price: 8500000, status: 'reserved', agent: 'Sara Khan', beds: 4, baths: 5, area: 4200, image: null },
  { id: 3, code: 'WC-003', title: 'Marina View', type: 'Apartment', location: 'Dubai Marina', price: 3200000, status: 'sold', agent: null, beds: 2, baths: 3, area: 1800, image: null },
];

const defaultData: PropertiesData = { properties: sampleProperties };

describe('PropertiesTab', () => {
  const onAction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Loading ─────────────────────────────────────────────
  describe('loading state', () => {
    it('renders loading spinner when loading=true', () => {
      render(<PropertiesTab data={{}} loading={true} onAction={onAction} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading properties...')).toBeInTheDocument();
    });
  });

  // ─── Error ───────────────────────────────────────────────
  describe('error state', () => {
    it('renders error message', () => {
      render(<PropertiesTab data={{}} error="Network error" onAction={onAction} />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Failed to load properties/)).toBeInTheDocument();
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });

    it('calls onAction retryFetch on retry click', () => {
      render(<PropertiesTab data={{}} error="fail" onAction={onAction} />);
      fireEvent.click(screen.getByText('Retry'));
      expect(onAction).toHaveBeenCalledWith('retryFetch');
    });
  });

  // ─── Rendering ───────────────────────────────────────────
  describe('rendering', () => {
    it('renders header with title', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('Property Management')).toBeInTheDocument();
    });

    it('renders Add Property button', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText(/Add Property/)).toBeInTheDocument();
    });

    it('renders table with correct column headers', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      const table = screen.getByRole('table', { name: /properties list/i });
      expect(within(table).getByText('Property')).toBeInTheDocument();
      expect(within(table).getByText('Type')).toBeInTheDocument();
      expect(within(table).getByText('Location')).toBeInTheDocument();
      expect(within(table).getByText('Status')).toBeInTheDocument();
    });

    it('renders property codes', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('WC-001')).toBeInTheDocument();
      expect(screen.getByText('WC-002')).toBeInTheDocument();
    });

    it('renders property titles', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('Luxury Villa')).toBeInTheDocument();
      expect(screen.getByText('Downtown Apt')).toBeInTheDocument();
    });

    it('renders formatted prices', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText(/15,000,000/)).toBeInTheDocument();
    });

    it('shows Unassigned for null agents', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText('Unassigned')).toBeInTheDocument();
    });

    it('uses fallback data when no properties provided', () => {
      render(<PropertiesTab data={{}} onAction={onAction} />);
      // Should show default hardcoded properties
      expect(screen.getByText('WC-PAL-001')).toBeInTheDocument();
    });
  });

  // ─── Search ──────────────────────────────────────────────
  describe('search', () => {
    it('renders search input', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      expect(screen.getByPlaceholderText('Search properties...')).toBeInTheDocument();
    });

    it('filters by title', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      fireEvent.change(screen.getByPlaceholderText('Search properties...'), { target: { value: 'Marina' } });
      expect(screen.getByText('Marina View')).toBeInTheDocument();
      expect(screen.queryByText('Luxury Villa')).not.toBeInTheDocument();
    });

    it('filters by code', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      fireEvent.change(screen.getByPlaceholderText('Search properties...'), { target: { value: 'WC-001' } });
      expect(screen.getByText('WC-001')).toBeInTheDocument();
      expect(screen.queryByText('WC-002')).not.toBeInTheDocument();
    });

    it('filters by location', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      fireEvent.change(screen.getByPlaceholderText('Search properties...'), { target: { value: 'Downtown' } });
      expect(screen.getByText('Downtown Apt')).toBeInTheDocument();
      expect(screen.queryByText('Marina View')).not.toBeInTheDocument();
    });
  });

  // ─── Status Filter ───────────────────────────────────────
  describe('status filter', () => {
    it('renders status filter dropdown', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      const selects = screen.getAllByRole('combobox');
      expect(selects.length).toBeGreaterThanOrEqual(2);
    });

    it('filters by available status', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      const selects = screen.getAllByRole('combobox');
      fireEvent.change(selects[0], { target: { value: 'available' } });
      expect(screen.getByText('Luxury Villa')).toBeInTheDocument();
      expect(screen.queryByText('Downtown Apt')).not.toBeInTheDocument();
    });

    it('filters by sold status', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      const selects = screen.getAllByRole('combobox');
      fireEvent.change(selects[0], { target: { value: 'sold' } });
      expect(screen.getByText('Marina View')).toBeInTheDocument();
      expect(screen.queryByText('Luxury Villa')).not.toBeInTheDocument();
    });
  });

  // ─── Type Filter ─────────────────────────────────────────
  describe('type filter', () => {
    it('filters by Villa type', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      const selects = screen.getAllByRole('combobox');
      fireEvent.change(selects[1], { target: { value: 'Villa' } });
      expect(screen.getByText('Luxury Villa')).toBeInTheDocument();
      expect(screen.queryByText('Downtown Apt')).not.toBeInTheDocument();
    });
  });

  // ─── Actions ─────────────────────────────────────────────
  describe('actions', () => {
    it('calls onAction with addProperty on Add button click', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      fireEvent.click(screen.getByText(/Add Property/));
      expect(onAction).toHaveBeenCalledWith('addProperty');
    });

    it('calls onAction with viewProperty on view button', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      const viewBtns = screen.getAllByTitle('View');
      fireEvent.click(viewBtns[0]);
      expect(onAction).toHaveBeenCalledWith('viewProperty', 1);
    });

    it('calls onAction with editProperty on edit button', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      const editBtns = screen.getAllByTitle('Edit');
      fireEvent.click(editBtns[0]);
      expect(onAction).toHaveBeenCalledWith('editProperty', 1);
    });

    it('calls onAction with deleteProperty on delete button', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      const deleteBtns = screen.getAllByTitle('Delete');
      fireEvent.click(deleteBtns[0]);
      expect(onAction).toHaveBeenCalledWith('deleteProperty', 1);
    });
  });

  // ─── Status Badges ───────────────────────────────────────
  describe('status badges', () => {
    it('renders Available badge', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      expect(screen.getByTestId('badge-success')).toHaveTextContent('Available');
    });

    it('renders Reserved badge', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      expect(screen.getByTestId('badge-warning')).toHaveTextContent('Reserved');
    });

    it('renders Sold badge', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      expect(screen.getByTestId('badge-error')).toHaveTextContent('Sold');
    });
  });

  // ─── Footer ──────────────────────────────────────────────
  describe('table footer', () => {
    it('shows count of displayed properties', () => {
      render(<PropertiesTab data={defaultData} onAction={onAction} />);
      expect(screen.getByText(/Showing 3 of 3 properties/)).toBeInTheDocument();
    });
  });
});
