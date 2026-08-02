import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SearchBar } from './SearchBar';

describe('SearchBar component', () => {
  it('renders input with placeholder and fires onSearch callback', () => {
    const handleSearch = vi.fn();
    render(<SearchBar placeholder="Search DAMAC Hills..." onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText('Search DAMAC Hills...');
    expect(input).toBeDefined();

    fireEvent.change(input, { target: { value: 'Villa' } });
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleSearch).toHaveBeenCalledWith('Villa');
  });
});
