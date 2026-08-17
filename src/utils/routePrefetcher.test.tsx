import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  registerRoutePrefetch,
  prefetchRoute,
  resetPrefetchRegistry,
} from './routePrefetcher';
import { PrefetchLink } from '../components/common/PrefetchLink';

describe('routePrefetcher Engine', () => {
  beforeEach(() => {
    resetPrefetchRegistry();
  });

  it('registers and executes loader on prefetchRoute', async () => {
    const mockLoader = vi.fn().mockResolvedValue({ default: () => null });
    registerRoutePrefetch('/crm', mockLoader);

    const success = await prefetchRoute('/crm');
    expect(success).toBe(true);
    expect(mockLoader).toHaveBeenCalledTimes(1);

    // Subsequent prefetch should be cached and not re-execute loader
    const secondCall = await prefetchRoute('/crm');
    expect(secondCall).toBe(true);
    expect(mockLoader).toHaveBeenCalledTimes(1);
  });

  it('returns false for unregistered routes', async () => {
    const success = await prefetchRoute('/unknown-route');
    expect(success).toBe(false);
  });

  it('PrefetchLink triggers prefetch on mouse enter and focus', async () => {
    const mockLoader = vi.fn().mockResolvedValue({ default: () => null });
    registerRoutePrefetch('/properties', mockLoader);

    render(
      <MemoryRouter>
        <PrefetchLink to="/properties">Explore Properties</PrefetchLink>
      </MemoryRouter>
    );

    const link = screen.getByText('Explore Properties');

    // Trigger hover
    fireEvent.mouseEnter(link);
    expect(mockLoader).toHaveBeenCalledTimes(1);

    // Trigger focus
    fireEvent.focus(link);
    expect(mockLoader).toHaveBeenCalledTimes(1); // Cached
  });
});
