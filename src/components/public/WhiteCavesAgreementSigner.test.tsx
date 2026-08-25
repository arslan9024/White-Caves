import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WhiteCavesAgreementSigner } from './WhiteCavesAgreementSigner';

// Mock react-signature-canvas for jsdom test environment
vi.mock('react-signature-canvas', () => ({
  default: React.forwardRef((props, ref) => {
    return <div data-testid="mock-sig-canvas" />;
  }),
}));

describe('WhiteCavesAgreementSigner', () => {
  it('renders contract signer form with category options', () => {
    render(<WhiteCavesAgreementSigner />);

    expect(screen.getByText(/White Caves Real Estate Services Agreement Signer/i)).toBeDefined();
    expect(screen.getByText(/Dubai RERA Legal Contract Engine/i)).toBeDefined();
  });
});
