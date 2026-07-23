/**
 * FeaturedPropertiesSection Component Tests
 * ========================================
 * Focus: rendering states + route navigation (card/detail/all-properties)
 */

/* eslint-disable react/display-name, security/detect-object-injection */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { HomepageProperty } from '../../../store/slices/homepageSlice';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock framer-motion — render all motion.* as plain HTML
vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop: string) =>
        React.forwardRef((props: Record<string, unknown>, ref: React.Ref<HTMLElement>) => {
          const safe: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(props)) {
            if (
              !k.startsWith('while') &&
              !k.startsWith('initial') &&
              !k.startsWith('animate') &&
              !k.startsWith('exit') &&
              !k.startsWith('variants') &&
              !k.startsWith('transition') &&
              !k.startsWith('viewport') &&
              k !== 'whileInView' &&
              k !== 'custom'
            ) {
              safe[k] = v;
            }
          }
          return React.createElement(prop, { ...safe, ref });
        }),
    }
  ),
}));

import FeaturedPropertiesSection from './FeaturedPropertiesSection';

const MOCK_PROPERTIES: HomepageProperty[] = [
  {
    id: 'prop-101',
    title: 'Azure Palm Villa',
    description: 'Luxury beachfront villa',
    type: 'villa',
    status: 'available',
    price: 21000000,
    currency: 'AED',
    bedrooms: 5,
    bathrooms: 6,
    sqft: 8200,
    location: 'Palm Jumeirah',
    amenities: ['Pool', 'Gym'],
    images: ['https://example.com/villa.jpg'],
    featured: true,
  },
];

const renderSection = (props?: Partial<React.ComponentProps<typeof FeaturedPropertiesSection>>) =>
  render(
    <MemoryRouter>
      <FeaturedPropertiesSection featuredProperties={MOCK_PROPERTIES} {...props} />
    </MemoryRouter>
  );

describe('FeaturedPropertiesSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('renders section heading', () => {
    renderSection();
    expect(screen.getByText('Featured Properties')).toBeInTheDocument();
  });

  it('renders loading skeleton state', () => {
    renderSection({ isLoading: true });
    const skeletons = document.querySelectorAll('.fp-skeleton-card');
    expect(skeletons.length).toBe(6);
  });

  it('renders empty state when no properties', () => {
    render(
      <MemoryRouter>
        <FeaturedPropertiesSection featuredProperties={[]} isLoading={false} />
      </MemoryRouter>
    );
    expect(screen.getByText('Featured listings coming soon')).toBeInTheDocument();
  });

  it('navigates to property detail when card is clicked', () => {
    renderSection();
    const card = screen.getByRole('button', { name: 'View Azure Palm Villa' });
    fireEvent.click(card);
    expect(mockNavigate).toHaveBeenCalledWith('/property/prop-101');
  });

  it('navigates to property detail when View Details is clicked', () => {
    renderSection();
    fireEvent.click(screen.getByRole('button', { name: 'View Details' }));
    expect(mockNavigate).toHaveBeenCalledWith('/property/prop-101');
  });

  it('navigates to /properties from View All Properties CTA', () => {
    renderSection();
    fireEvent.click(screen.getByRole('button', { name: 'View All Properties' }));
    expect(mockNavigate).toHaveBeenCalledWith('/properties');
  });
});
