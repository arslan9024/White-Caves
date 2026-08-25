import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MultiPartySigningTracker } from './MultiPartySigningTracker';

describe('MultiPartySigningTracker', () => {
  it('renders all signers', () => {
    render(<MultiPartySigningTracker />);
    expect(screen.getByTestId('multi-party-signing-tracker')).toBeTruthy();
    expect(screen.getByText('Seller')).toBeTruthy();
  });
});
