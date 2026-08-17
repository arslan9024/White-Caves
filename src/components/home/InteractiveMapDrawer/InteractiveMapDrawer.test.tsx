import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InteractiveMapDrawer } from './InteractiveMapDrawer';

describe('InteractiveMapDrawer Component', () => {
  it('renders interactive map drawer and opens property quick view on marker click', () => {
    render(<InteractiveMapDrawer />);
    expect(screen.getByTestId('interactive-map-drawer')).toBeDefined();
    expect(screen.getByText(/Monochrome Leaflet Map — Dubai Luxury Ledger/i)).toBeDefined();
    expect(screen.getByTestId('map-pin-PIN-1')).toBeDefined();
    expect(screen.getByTestId('map-pin-PIN-2')).toBeDefined();
    expect(screen.getByTestId('map-slide-drawer')).toBeDefined();

    // Click Downtown Penthouse marker
    const dtMarker = screen.getByTestId('map-pin-PIN-2');
    fireEvent.click(dtMarker);
    expect(screen.getByText(/Downtown Dubai Sky Penthouse/i)).toBeDefined();

    // Close drawer
    const closeBtn = screen.getByTestId('map-drawer-close-btn');
    fireEvent.click(closeBtn);
  });
});
