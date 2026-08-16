import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { InstitutionalTeaserDeckBuilder } from './InstitutionalTeaserDeckBuilder';

describe('InstitutionalTeaserDeckBuilder Component', () => {
  it('renders institutional teaser deck builder and compiles confidential deck', () => {
    render(<InstitutionalTeaserDeckBuilder />);
    expect(screen.getByTestId('institutional-teaser-deck-builder')).toBeDefined();
    expect(screen.getByText(/Institutional Investment Teaser/i)).toBeDefined();
    expect(screen.getByText(/SOVEREIGN FUND DECK/i)).toBeDefined();
    expect(screen.getByText(/Portfolio Valuation/i)).toBeDefined();

    // Compile deck
    const compileBtn = screen.getByText(/Compile Blind Institutional Investment Deck/i);
    fireEvent.click(compileBtn);
    expect(screen.getByText(/✓ Blind Institutional Teaser Deck Compiled/i)).toBeDefined();
  });
});
