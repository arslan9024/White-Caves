import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NdaDigitalSigningModal } from './NdaDigitalSigningModal';

describe('NdaDigitalSigningModal', () => {
  it('renders NDA signing modal with terms and signature pad', () => {
    render(<NdaDigitalSigningModal />);

    expect(screen.getByTestId('nda-digital-signing-modal')).toBeDefined();
    expect(screen.getByText(/Confidential NDA/i)).toBeDefined();
    expect(screen.getByText(/Full Legal Name/i)).toBeDefined();
    expect(screen.getByText(/Passport \/ Emirates ID/i)).toBeDefined();
  });
});
