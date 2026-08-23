import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PrefetchLink } from './PrefetchLink';
import * as routePrefetcher from '../../utils/routePrefetcher';

describe('PrefetchLink', () => {
  it('renders link text and prefetches on hover', () => {
    const prefetchSpy = vi.spyOn(routePrefetcher, 'prefetchRoute').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <PrefetchLink to="/properties">View Properties</PrefetchLink>
      </MemoryRouter>
    );

    const link = screen.getByText('View Properties');
    expect(link).toBeInTheDocument();

    fireEvent.mouseEnter(link);
    expect(prefetchSpy).toHaveBeenCalledWith('/properties');

    prefetchSpy.mockRestore();
  });

  it('prefetches on focus and mount when prefetchOnMount is true', () => {
    const prefetchSpy = vi.spyOn(routePrefetcher, 'prefetchRoute').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <PrefetchLink to="/services" prefetchOnMount>
          Our Services
        </PrefetchLink>
      </MemoryRouter>
    );

    expect(prefetchSpy).toHaveBeenCalledWith('/services');

    const link = screen.getByText('Our Services');
    fireEvent.focus(link);
    expect(prefetchSpy).toHaveBeenCalledWith('/services');

    prefetchSpy.mockRestore();
  });
});
