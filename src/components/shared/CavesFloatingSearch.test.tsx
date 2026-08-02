import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CavesFloatingSearch } from './CavesFloatingSearch';

describe('CavesFloatingSearch Component', () => {
  it('renders bottom-left floating search pill trigger button', () => {
    render(<CavesFloatingSearch />);
    expect(screen.getByTestId('caves-floating-search')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open Property Search Modal/i })).toBeInTheDocument();
  });

  it('opens property search overlay modal on trigger click', () => {
    render(<CavesFloatingSearch />);
    const triggerBtn = screen.getByRole('button', { name: /Open Property Search Modal/i });
    fireEvent.click(triggerBtn);

    expect(screen.getByText('White Caves Property Search')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Search by community, title, ID/i)
    ).toBeInTheDocument();
  });

  it('filters seeded properties dynamically when typing in search input', () => {
    render(<CavesFloatingSearch />);
    fireEvent.click(screen.getByRole('button', { name: /Open Property Search Modal/i }));

    const searchInput = screen.getByPlaceholderText(/Search by community, title, ID/i);
    fireEvent.change(searchInput, { target: { value: 'wc_dh2_001' } });

    expect(screen.getByText('3BR Luxury Townhouse in Vardon')).toBeInTheDocument();
  });
});
