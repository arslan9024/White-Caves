import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { DeveloperNocTracker } from './DeveloperNocTracker';

describe('DeveloperNocTracker Component', () => {
  it('renders developer NOC tracker and active NOC application', () => {
    render(<DeveloperNocTracker />);
    expect(screen.getByTestId('developer-noc-tracker')).toBeDefined();
    expect(screen.getByText(/Master Developer NOC Tracker/i)).toBeDefined();
    expect(screen.getByText(/CONVEYANCING ENGINE/i)).toBeDefined();
    expect(screen.getByRole('button', { name: 'EMAAR' })).toBeDefined();
  });
});
