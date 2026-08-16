import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SovereignFooter } from './SovereignFooter';

describe('SovereignFooter Component', () => {
  it('renders sovereign footer with RERA registration and navigation columns', () => {
    render(<SovereignFooter />);
    expect(screen.getByTestId('sovereign-footer')).toBeDefined();
    expect(screen.getAllByText(/White Caves Real Estate LLC/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/RERA ORN/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Luxury Villas/i)).toBeDefined();
    expect(screen.getByText(/Escrow Law No. 8\/2007/i)).toBeDefined();
  });
});
