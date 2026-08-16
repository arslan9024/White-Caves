import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlobalSearchModal } from './GlobalSearchModal';

describe('GlobalSearchModal Component', () => {
  it('renders global search trigger and filters search results upon query input', () => {
    render(<GlobalSearchModal />);
    const trigger = screen.getByTestId('global-search-trigger');
    expect(trigger).toBeDefined();

    // Open search modal
    fireEvent.click(trigger);
    expect(screen.getByTestId('global-search-modal')).toBeDefined();
    expect(screen.getByPlaceholderText(/Search across properties, clients, RERA contracts/i)).toBeDefined();

    // Type query
    const input = screen.getByPlaceholderText(/Search across properties, clients, RERA contracts/i);
    fireEvent.change(input, { target: { value: 'Palm' } });
    expect(screen.getAllByText(/Villa 14B Palm Jumeirah/i).length).toBeGreaterThan(0);
  });
});
