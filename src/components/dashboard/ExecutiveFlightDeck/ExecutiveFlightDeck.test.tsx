import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExecutiveFlightDeck } from './ExecutiveFlightDeck';

describe('ExecutiveFlightDeck Component', () => {
  it('renders managing director executive flight deck and high-level KPIs', () => {
    render(<ExecutiveFlightDeck />);
    expect(screen.getByTestId('executive-flight-deck')).toBeDefined();
    expect(screen.getByText(/Managing Director Executive Flight Deck/i)).toBeDefined();
    expect(screen.getByText(/LEVEL 5 GOD-MODE/i)).toBeDefined();
    expect(screen.getByText('AED 48.5M')).toBeDefined();
    expect(screen.getByText('9,378')).toBeDefined();
  });
});
