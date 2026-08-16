import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FloatingHeroSearchPill } from './FloatingHeroSearchPill';

describe('FloatingHeroSearchPill Component', () => {
  it('renders floating hero search pill and toggles category tabs', () => {
    render(<FloatingHeroSearchPill />);
    expect(screen.getByTestId('floating-hero-search-pill')).toBeDefined();
    expect(screen.getByRole('button', { name: 'BUY' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'RENT' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'OFF-PLAN' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'COMMERCIAL' })).toBeDefined();

    const rentTab = screen.getByRole('button', { name: 'RENT' });
    fireEvent.click(rentTab);
    expect(screen.getByPlaceholderText(/e\.g\. Palm Jumeirah, Downtown, Emirates Hills/i)).toBeDefined();

    const searchBtn = screen.getByRole('button', { name: /Search/i });
    expect(searchBtn).toBeDefined();
  });
});
