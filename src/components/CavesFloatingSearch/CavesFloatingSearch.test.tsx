import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CavesFloatingSearch } from './CavesFloatingSearch';

describe('CavesFloatingSearch Component', () => {
  it('renders floating search pill and opens overlay modal on click', () => {
    render(
      <MemoryRouter>
        <CavesFloatingSearch />
      </MemoryRouter>
    );

    const searchPill = screen.getByTestId('caves-floating-search-pill');
    expect(searchPill).toBeDefined();

    fireEvent.click(searchPill);
    expect(screen.getByTestId('caves-search-modal-overlay')).toBeDefined();
    expect(screen.getByTestId('caves-search-input')).toBeDefined();

    const searchInput = screen.getByTestId('caves-search-input');
    fireEvent.change(searchInput, { target: { value: 'Nadia' } });
    expect((searchInput as HTMLInputElement).value).toBe('Nadia');
  });
});
