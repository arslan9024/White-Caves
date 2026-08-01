import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FloatingSearchPill } from './FloatingSearchPill';

describe('FloatingSearchPill Component', () => {
  it('renders floating search pill button at top 80px', () => {
    render(<FloatingSearchPill />);
    expect(screen.getByTestId('floating-search-pill')).toBeInTheDocument();
  });

  it('opens search overlay modal on button click', () => {
    render(<FloatingSearchPill />);
    const button = screen.getByRole('button', { name: /Search DAMAC Hills 2/i });
    fireEvent.click(button);
    expect(screen.getByTestId('search-overlay')).toBeInTheDocument();
  });

  it('triggers onSearchSubmit callback when search form is submitted', () => {
    const handleSearch = vi.fn();
    render(<FloatingSearchPill onSearchSubmit={handleSearch} />);
    fireEvent.click(screen.getByRole('button', { name: /Search DAMAC Hills 2/i }));

    const input = screen.getByPlaceholderText(/Search properties, Ejari contracts/i);
    fireEvent.change(input, { target: { value: 'DAMAC Hills 2 Villa V84' } });
    fireEvent.submit(input);

    expect(handleSearch).toHaveBeenCalledWith('DAMAC Hills 2 Villa V84');
  });
});
