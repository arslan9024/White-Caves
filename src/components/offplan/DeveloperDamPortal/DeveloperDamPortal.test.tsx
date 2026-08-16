import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeveloperDamPortal } from './DeveloperDamPortal';

describe('DeveloperDamPortal Component', () => {
  it('renders developer DAM portal and filters marketing collateral by developer', () => {
    render(<DeveloperDamPortal />);
    expect(screen.getByTestId('developer-dam-portal')).toBeDefined();
    expect(screen.getByText(/Developer Digital Asset Management \(DAM\) & Marketing Hub/i)).toBeDefined();
    expect(screen.getByText(/BROCHURE REPOSITORY/i)).toBeDefined();
    expect(screen.getByText(/Ocean Point Master Brochure/i)).toBeDefined();
    expect(screen.getByText(/Damac Islands Private Lagoons Teaser Deck/i)).toBeDefined();

    // Filter by DAMAC
    const damacTab = screen.getByRole('button', { name: 'DAMAC' });
    fireEvent.click(damacTab);
    expect(screen.getByText(/Damac Islands Private Lagoons Teaser Deck/i)).toBeDefined();
    expect(screen.queryByText(/Ocean Point Master Brochure/i)).toBeNull();
  });
});
