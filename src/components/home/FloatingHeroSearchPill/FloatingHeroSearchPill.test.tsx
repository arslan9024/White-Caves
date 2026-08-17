import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FloatingHeroSearchPill } from './FloatingHeroSearchPill';

describe('FloatingHeroSearchPill Component', () => {
  it('renders floating hero search pill and toggles category tabs', () => {
    render(
      <MemoryRouter>
        <FloatingHeroSearchPill />
      </MemoryRouter>
    );
    expect(screen.getByTestId('floating-hero-search-pill')).toBeDefined();
    expect(screen.getByRole('button', { name: /All Inventory/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Primary Off-Plan/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Secondary Villas/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Commercial/i })).toBeDefined();

    const offPlanTab = screen.getByRole('button', { name: /Primary Off-Plan/i });
    fireEvent.click(offPlanTab);

    const locationInput = screen.getByTestId('hero-location-input');
    fireEvent.change(locationInput, { target: { value: 'DAMAC Hills 2' } });
    expect((locationInput as HTMLInputElement).value).toBe('DAMAC Hills 2');

    const searchBtn = screen.getByTestId('hero-search-submit-btn');
    expect(searchBtn).toBeDefined();
  });
});
