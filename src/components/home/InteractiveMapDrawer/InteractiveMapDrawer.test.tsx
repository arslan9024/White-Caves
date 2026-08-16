import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InteractiveMapDrawer } from './InteractiveMapDrawer';

describe('InteractiveMapDrawer Component', () => {
  it('renders interactive map drawer and opens property quick view on marker click', () => {
    render(<InteractiveMapDrawer />);
    expect(screen.getByTestId('interactive-map-drawer')).toBeDefined();
    expect(screen.getByText(/Monochrome Leaflet Map — Dubai Luxury Ledger/i)).toBeDefined();
    expect(screen.getByText(/📍 AED 120M/i)).toBeDefined();
    expect(screen.getByText(/📍 AED 45M/i)).toBeDefined();
    expect(screen.getByText(/Property Quick View/i)).toBeDefined();

    // Click Downtown Penthouse marker
    const dtMarker = screen.getByText(/📍 AED 45M/i);
    fireEvent.click(dtMarker);
    expect(screen.getByText(/Downtown Penthouse/i)).toBeDefined();

    // Close drawer
    const closeBtn = screen.getByRole('button', { name: '✕' });
    fireEvent.click(closeBtn);
  });
});
