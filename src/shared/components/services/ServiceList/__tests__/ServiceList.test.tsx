import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock CSS
vi.mock('../ServiceList.css', () => ({}));

// Mock Grid component
vi.mock('../../../layout/Grid', () => ({
  default: ({ children, columns, gap, ...props }: any) => (
    <div data-testid="grid" data-columns={JSON.stringify(columns)} data-gap={gap} {...props}>
      {children}
    </div>
  ),
}));

// Mock ServiceCard component
vi.mock('../../ServiceCard', () => ({
  default: ({ service, variant, onBook, onLearnMore, showPrice, showBooking }: any) => (
    <div data-testid={`service-card-${service.id}`}>
      <span>{service.title}</span>
      {onBook && <button onClick={() => onBook(service)}>Book</button>}
      {onLearnMore && <button onClick={() => onLearnMore(service)}>Learn More</button>}
    </div>
  ),
}));

import ServiceList from '../ServiceList';

const mockServices = [
  { id: 's1', title: 'Property Valuation', description: 'Expert valuation', price: 500, category: 'Valuation' },
  { id: 's2', title: 'Home Staging', description: 'Professional staging', price: 1200, category: 'Staging' },
  { id: 's3', title: 'Interior Design', description: 'Custom design', price: 3000, category: 'Design' },
];

describe('ServiceList', () => {
  describe('Loading State', () => {
    it('should render skeletons when loading', () => {
      const { container } = render(<ServiceList loading={true} />);
      const skeletons = container.querySelectorAll('[class*="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render loadingCount skeletons', () => {
      const { container } = render(<ServiceList loading={true} loadingCount={4} />);
      // Each skeleton has child elements, so count only the direct skeleton wrappers
      const skeletons = container.querySelectorAll('.wc-service-list__skeleton');
      expect(skeletons.length).toBe(4);
    });

    it('should render default 6 skeletons', () => {
      const { container } = render(<ServiceList loading={true} />);
      const skeletons = container.querySelectorAll('.wc-service-list__skeleton');
      expect(skeletons.length).toBe(6);
    });

    it('should use Grid in loading state', () => {
      render(<ServiceList loading={true} />);
      expect(screen.getByTestId('grid')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show default empty message when no services', () => {
      render(<ServiceList services={[]} />);
      expect(screen.getByText('No services available')).toBeInTheDocument();
    });

    it('should show custom empty message', () => {
      render(<ServiceList services={[]} emptyMessage="Coming soon!" />);
      expect(screen.getByText('Coming soon!')).toBeInTheDocument();
    });

    it('should show empty state with icon', () => {
      render(<ServiceList services={[]} />);
      expect(screen.getByText('🏢')).toBeInTheDocument();
    });

    it('should show empty when services is undefined', () => {
      render(<ServiceList />);
      expect(screen.getByText('No services available')).toBeInTheDocument();
    });
  });

  describe('Populated State', () => {
    it('should render service cards', () => {
      render(<ServiceList services={mockServices} />);
      expect(screen.getByText('Property Valuation')).toBeInTheDocument();
      expect(screen.getByText('Home Staging')).toBeInTheDocument();
      expect(screen.getByText('Interior Design')).toBeInTheDocument();
    });

    it('should render correct number of cards', () => {
      render(<ServiceList services={mockServices} />);
      expect(screen.getByTestId('service-card-s1')).toBeInTheDocument();
      expect(screen.getByTestId('service-card-s2')).toBeInTheDocument();
      expect(screen.getByTestId('service-card-s3')).toBeInTheDocument();
    });

    it('should use Grid for layout', () => {
      render(<ServiceList services={mockServices} />);
      expect(screen.getByTestId('grid')).toBeInTheDocument();
    });
  });

  describe('Callbacks', () => {
    it('should forward onBook to ServiceCard', () => {
      const onBook = vi.fn();
      render(<ServiceList services={mockServices} onBook={onBook} />);
      fireEvent.click(screen.getAllByText('Book')[0]);
      expect(onBook).toHaveBeenCalledWith(expect.objectContaining({ id: 's1' }));
    });

    it('should forward onLearnMore to ServiceCard', () => {
      const onLearnMore = vi.fn();
      render(<ServiceList services={mockServices} onLearnMore={onLearnMore} />);
      fireEvent.click(screen.getAllByText('Learn More')[0]);
      expect(onLearnMore).toHaveBeenCalledWith(expect.objectContaining({ id: 's1' }));
    });
  });

  describe('Variant', () => {
    it('should use horizontal columns for horizontal variant', () => {
      render(<ServiceList services={mockServices} variant="horizontal" />);
      const grid = screen.getByTestId('grid');
      const columns = JSON.parse(grid.getAttribute('data-columns') || '{}');
      expect(columns.desktop).toBe(2);
    });

    it('should use default columns for vertical variant', () => {
      render(<ServiceList services={mockServices} variant="vertical" />);
      const grid = screen.getByTestId('grid');
      const columns = JSON.parse(grid.getAttribute('data-columns') || '{}');
      expect(columns.desktop).toBe(3);
    });
  });

  describe('Gap', () => {
    it('should pass gap prop to Grid', () => {
      render(<ServiceList services={mockServices} gap="large" />);
      const grid = screen.getByTestId('grid');
      expect(grid.getAttribute('data-gap')).toBe('large');
    });
  });

  describe('Custom className', () => {
    it('should apply className to container', () => {
      const { container } = render(<ServiceList services={mockServices} className="my-list" />);
      expect(container.querySelector('.my-list')).toBeInTheDocument();
    });
  });
});
