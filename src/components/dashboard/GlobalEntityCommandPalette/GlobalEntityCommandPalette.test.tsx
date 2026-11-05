/**
 * White Caves Real Estate LLC - Global Entity Command Palette Tests
 * Architecture: AEGIS Canonical 7-Category Architecture Standard (Tests)
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlobalEntityCommandPalette } from './GlobalEntityCommandPalette';

describe('GlobalEntityCommandPalette Component', () => {
  it('does not render when isOpen is false', () => {
    const handleClose = vi.fn();
    const handleSelect = vi.fn();
    render(
      <GlobalEntityCommandPalette
        isOpen={false}
        onClose={handleClose}
        onSelectEntity={handleSelect}
      />
    );
    expect(screen.queryByTestId('global-command-palette-backdrop')).toBeNull();
  });

  it('renders search input and entity items when isOpen is true', () => {
    const handleClose = vi.fn();
    const handleSelect = vi.fn();
    render(
      <GlobalEntityCommandPalette
        isOpen={true}
        onClose={handleClose}
        onSelectEntity={handleSelect}
      />
    );

    expect(screen.getByTestId('global-command-palette-backdrop')).toBeInTheDocument();
    expect(screen.getByTestId('palette-search-input')).toBeInTheDocument();
    expect(screen.getByTestId('palette-results-list')).toBeInTheDocument();
  });

  it('filters results dynamically when searching', () => {
    const handleClose = vi.fn();
    const handleSelect = vi.fn();
    render(
      <GlobalEntityCommandPalette
        isOpen={true}
        onClose={handleClose}
        onSelectEntity={handleSelect}
      />
    );

    const input = screen.getByTestId('palette-search-input');
    fireEvent.change(input, { target: { value: 'Luxury' } });

    // Should match luxury sales & brokerage
    expect(screen.getByText(/Luxury Sales & Brokerage/i)).toBeInTheDocument();
  });

  it('filters results by category chip click', () => {
    const handleClose = vi.fn();
    const handleSelect = vi.fn();
    render(
      <GlobalEntityCommandPalette
        isOpen={true}
        onClose={handleClose}
        onSelectEntity={handleSelect}
      />
    );

    const deptFilter = screen.getByTestId('category-filter-departments');
    fireEvent.click(deptFilter);

    // Departments should be rendered
    expect(screen.getByText(/Luxury Sales & Brokerage/i)).toBeInTheDocument();
  });

  it('calls onSelectEntity and onClose when an entity is clicked', () => {
    const handleClose = vi.fn();
    const handleSelect = vi.fn();
    render(
      <GlobalEntityCommandPalette
        isOpen={true}
        onClose={handleClose}
        onSelectEntity={handleSelect}
      />
    );

    const firstItem = screen.getAllByTestId(/palette-item-/i)[0];
    fireEvent.click(firstItem);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('closes on backdrop click', () => {
    const handleClose = vi.fn();
    const handleSelect = vi.fn();
    render(
      <GlobalEntityCommandPalette
        isOpen={true}
        onClose={handleClose}
        onSelectEntity={handleSelect}
      />
    );

    const backdrop = screen.getByTestId('global-command-palette-backdrop');
    fireEvent.click(backdrop);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
