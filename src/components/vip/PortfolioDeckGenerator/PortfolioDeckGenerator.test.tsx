import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PortfolioDeckGenerator } from './PortfolioDeckGenerator';

describe('PortfolioDeckGenerator', () => {
  it('renders bespoke portfolio deck generator', () => {
    render(<PortfolioDeckGenerator />);

    expect(screen.getByTestId('portfolio-deck-generator')).toBeDefined();
    expect(screen.getAllByText(/Portfolio Deck/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Family Office/i).length).toBeGreaterThan(0);
  });
});
