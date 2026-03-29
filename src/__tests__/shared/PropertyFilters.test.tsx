/**
 * PropertyFilters.test.tsx — Batch 27
 * Tests for PropertyFilters component
 * Covers: rendering, filter changes, apply/reset, advanced toggle, compact mode
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock child components
vi.mock('../../shared/components/ui/Input', () => ({
  default: ({ label, placeholder, value, onChange, size, icon, fullWidth, type, ...rest }: any) => (
    <div data-testid={`input-${placeholder?.replace(/\s+/g, '-').toLowerCase() || 'unknown'}`}>
      {label && <label>{label}</label>}
      <input
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        type={type || 'text'}
        data-size={size}
        {...rest}
      />
    </div>
  ),
}));

vi.mock('../../shared/components/ui/Select', () => ({
  default: ({ label, placeholder, options, value, onChange, size, fullWidth, ...rest }: any) => (
    <div data-testid={`select-${placeholder?.replace(/\s+/g, '-').toLowerCase() || 'unknown'}`}>
      {label && <label>{label}</label>}
      <select value={value || ''} onChange={onChange} data-size={size} aria-label={placeholder} {...rest}>
        <option value="">{placeholder}</option>
        {(options || []).map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  ),
}));

vi.mock('../../shared/components/ui/Button', () => ({
  default: ({ children, variant, size, onClick, ...rest }: any) => (
    <button onClick={onClick} data-variant={variant} data-size={size} {...rest}>
      {children}
    </button>
  ),
}));

vi.mock('../../shared/components/layout/Flex', () => ({
  default: ({ children, ...rest }: any) => <div data-testid="flex" {...rest}>{children}</div>,
}));

vi.mock('../../shared/components/layout/Grid', () => ({
  default: ({ children, ...rest }: any) => <div data-testid="grid" {...rest}>{children}</div>,
}));

vi.mock('../../shared/components/properties/PropertyFilters/PropertyFilters.css', () => ({}));

import PropertyFilters, { PropertyFilterValues } from '../../shared/components/properties/PropertyFilters/PropertyFilters';

describe('PropertyFilters', () => {
  const defaultProps = {
    onFilterChange: vi.fn(),
    onApply: vi.fn(),
    onReset: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── RENDERING ───────────────────────────────────────────────
  describe('Rendering', () => {
    it('renders without crashing with default props', () => {
      render(<PropertyFilters />);
      expect(screen.getByText('Apply Filters')).toBeInTheDocument();
    });

    it('renders all basic filter selects', () => {
      render(<PropertyFilters {...defaultProps} />);
      expect(screen.getByTestId('select-property-type')).toBeInTheDocument();
      expect(screen.getByTestId('select-bedrooms')).toBeInTheDocument();
      expect(screen.getByTestId('select-price-range')).toBeInTheDocument();
      expect(screen.getByTestId('input-search-location...')).toBeInTheDocument();
    });

    it('renders "More Filters" button by default', () => {
      render(<PropertyFilters {...defaultProps} />);
      expect(screen.getByText('More Filters')).toBeInTheDocument();
    });

    it('renders Reset and Apply Filters buttons', () => {
      render(<PropertyFilters {...defaultProps} />);
      expect(screen.getByText('Reset')).toBeInTheDocument();
      expect(screen.getByText('Apply Filters')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(<PropertyFilters className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  // ─── PROPERTY TYPE OPTIONS ───────────────────────────────────
  describe('Property Type Options', () => {
    it('renders all property type options', () => {
      render(<PropertyFilters {...defaultProps} />);
      const select = screen.getByTestId('select-property-type').querySelector('select')!;
      const options = select.querySelectorAll('option');
      // placeholder + 7 types
      expect(options.length).toBe(8);
    });

    it('includes Apartment, Villa, Townhouse, etc.', () => {
      render(<PropertyFilters {...defaultProps} />);
      const select = screen.getByTestId('select-property-type').querySelector('select')!;
      expect(select).toHaveTextContent('Apartment');
      expect(select).toHaveTextContent('Villa');
      expect(select).toHaveTextContent('Townhouse');
      expect(select).toHaveTextContent('Commercial');
    });
  });

  // ─── BEDROOM OPTIONS ─────────────────────────────────────────
  describe('Bedroom Options', () => {
    it('renders all bedroom options', () => {
      render(<PropertyFilters {...defaultProps} />);
      const select = screen.getByTestId('select-bedrooms').querySelector('select')!;
      const options = select.querySelectorAll('option');
      // placeholder + 6 bedroom options
      expect(options.length).toBe(7);
    });

    it('includes Studio and numbered bedrooms', () => {
      render(<PropertyFilters {...defaultProps} />);
      const select = screen.getByTestId('select-bedrooms').querySelector('select')!;
      expect(select).toHaveTextContent('Studio');
      expect(select).toHaveTextContent('5+ Bedrooms');
    });
  });

  // ─── PRICE RANGE OPTIONS ─────────────────────────────────────
  describe('Price Range Options', () => {
    it('renders all price range options', () => {
      render(<PropertyFilters {...defaultProps} />);
      const select = screen.getByTestId('select-price-range').querySelector('select')!;
      const options = select.querySelectorAll('option');
      // placeholder + 6 price ranges
      expect(options.length).toBe(7);
    });

    it('shows AED-based price ranges', () => {
      render(<PropertyFilters {...defaultProps} />);
      const select = screen.getByTestId('select-price-range').querySelector('select')!;
      expect(select).toHaveTextContent('Up to 500K AED');
      expect(select).toHaveTextContent('10M+ AED');
    });
  });

  // ─── FILTER CHANGES ──────────────────────────────────────────
  describe('Filter Changes', () => {
    it('calls onFilterChange when property type changes', () => {
      render(<PropertyFilters {...defaultProps} />);
      const select = screen.getByTestId('select-property-type').querySelector('select')!;
      fireEvent.change(select, { target: { value: 'villa' } });
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ propertyType: 'villa' })
      );
    });

    it('calls onFilterChange when bedrooms changes', () => {
      render(<PropertyFilters {...defaultProps} />);
      const select = screen.getByTestId('select-bedrooms').querySelector('select')!;
      fireEvent.change(select, { target: { value: '3' } });
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ bedrooms: '3' })
      );
    });

    it('calls onFilterChange when location changes', () => {
      render(<PropertyFilters {...defaultProps} />);
      const input = screen.getByTestId('input-search-location...').querySelector('input')!;
      fireEvent.change(input, { target: { value: 'Dubai Marina' } });
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ location: 'Dubai Marina' })
      );
    });

    it('calls onFilterChange when price range changes', () => {
      render(<PropertyFilters {...defaultProps} />);
      const select = screen.getByTestId('select-price-range').querySelector('select')!;
      fireEvent.change(select, { target: { value: '1000000-2000000' } });
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ priceRange: '1000000-2000000' })
      );
    });
  });

  // ─── APPLY / RESET ───────────────────────────────────────────
  describe('Apply / Reset', () => {
    it('calls onApply with current filters when Apply clicked', () => {
      render(<PropertyFilters {...defaultProps} filters={{ propertyType: 'villa' }} />);
      fireEvent.click(screen.getByText('Apply Filters'));
      expect(defaultProps.onApply).toHaveBeenCalledWith(
        expect.objectContaining({ propertyType: 'villa' })
      );
    });

    it('calls onReset and onFilterChange when Reset clicked', () => {
      render(<PropertyFilters {...defaultProps} filters={{ propertyType: 'apartment', bedrooms: '2' }} />);
      fireEvent.click(screen.getByText('Reset'));
      expect(defaultProps.onReset).toHaveBeenCalled();
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith({});
    });

    it('works without any callbacks', () => {
      render(<PropertyFilters />);
      // Should not throw
      fireEvent.click(screen.getByText('Apply Filters'));
      fireEvent.click(screen.getByText('Reset'));
    });
  });

  // ─── ADVANCED FILTERS ────────────────────────────────────────
  describe('Advanced Filters', () => {
    it('does not show advanced filters by default', () => {
      render(<PropertyFilters {...defaultProps} />);
      expect(screen.queryByTestId('input-min-sqft')).not.toBeInTheDocument();
    });

    it('toggles advanced filters when "More Filters" clicked', () => {
      render(<PropertyFilters {...defaultProps} />);
      fireEvent.click(screen.getByText('More Filters'));
      expect(screen.getByTestId('input-min-sqft')).toBeInTheDocument();
      expect(screen.getByTestId('input-max-sqft')).toBeInTheDocument();
      expect(screen.getByTestId('select-furnishing')).toBeInTheDocument();
      expect(screen.getByTestId('select-availability')).toBeInTheDocument();
      expect(screen.getByText('Less Filters')).toBeInTheDocument();
    });

    it('hides advanced filters when "Less Filters" clicked', () => {
      render(<PropertyFilters {...defaultProps} />);
      fireEvent.click(screen.getByText('More Filters'));
      expect(screen.getByTestId('input-min-sqft')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Less Filters'));
      expect(screen.queryByTestId('input-min-sqft')).not.toBeInTheDocument();
    });

    it('starts with advanced filters visible when showAdvanced=true', () => {
      render(<PropertyFilters {...defaultProps} showAdvanced={true} />);
      expect(screen.getByTestId('input-min-sqft')).toBeInTheDocument();
      expect(screen.getByText('Less Filters')).toBeInTheDocument();
    });

    it('calls onFilterChange when furnishing changes in advanced', () => {
      render(<PropertyFilters {...defaultProps} showAdvanced={true} />);
      const select = screen.getByTestId('select-furnishing').querySelector('select')!;
      fireEvent.change(select, { target: { value: 'furnished' } });
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ furnishing: 'furnished' })
      );
    });

    it('calls onFilterChange when availability changes', () => {
      render(<PropertyFilters {...defaultProps} showAdvanced={true} />);
      const select = screen.getByTestId('select-availability').querySelector('select')!;
      fireEvent.change(select, { target: { value: 'available' } });
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ availability: 'available' })
      );
    });

    it('calls onFilterChange when min/max area changes', () => {
      render(<PropertyFilters {...defaultProps} showAdvanced={true} />);
      const minInput = screen.getByTestId('input-min-sqft').querySelector('input')!;
      fireEvent.change(minInput, { target: { value: '500' } });
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({ minArea: '500' })
      );
    });
  });

  // ─── COMPACT MODE ─────────────────────────────────────────────
  describe('Compact Mode', () => {
    it('applies compact class when compact=true', () => {
      const { container } = render(<PropertyFilters compact={true} />);
      expect(container.firstChild).toHaveClass('wc-property-filters--compact');
    });

    it('does not apply compact class when compact=false', () => {
      const { container } = render(<PropertyFilters compact={false} />);
      expect(container.firstChild).not.toHaveClass('wc-property-filters--compact');
    });

    it('passes small size to children when compact', () => {
      render(<PropertyFilters compact={true} {...defaultProps} />);
      // Compact mode passes 'small' size
      const select = screen.getByTestId('select-property-type').querySelector('select')!;
      expect(select).toHaveAttribute('data-size', 'small');
    });

    it('hides labels when compact', () => {
      render(<PropertyFilters compact={true} {...defaultProps} />);
      // In compact mode, labels are not passed (undefined)
      const container = screen.getByTestId('select-property-type');
      expect(container.querySelector('label')).not.toBeInTheDocument();
    });
  });

  // ─── INITIAL FILTERS ─────────────────────────────────────────
  describe('Initial Filters', () => {
    it('initializes with provided filter values', () => {
      render(
        <PropertyFilters
          {...defaultProps}
          filters={{ propertyType: 'villa', bedrooms: '3', location: 'JBR' }}
        />
      );
      const propertySelect = screen.getByTestId('select-property-type').querySelector('select')!;
      expect(propertySelect.value).toBe('villa');

      const bedroomSelect = screen.getByTestId('select-bedrooms').querySelector('select')!;
      expect(bedroomSelect.value).toBe('3');

      const locationInput = screen.getByTestId('input-search-location...').querySelector('input')!;
      expect(locationInput.value).toBe('JBR');
    });

    it('initializes with empty filters if none provided', () => {
      render(<PropertyFilters {...defaultProps} />);
      const propertySelect = screen.getByTestId('select-property-type').querySelector('select')!;
      expect(propertySelect.value).toBe('');
    });
  });

  // ─── DISPLAY NAME ─────────────────────────────────────────────
  describe('Component Metadata', () => {
    it('has correct displayName', () => {
      expect(PropertyFilters.displayName).toBe('PropertyFilters');
    });
  });
});
