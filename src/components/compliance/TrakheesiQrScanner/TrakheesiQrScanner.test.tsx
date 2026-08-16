import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TrakheesiQrScanner } from './TrakheesiQrScanner';

describe('TrakheesiQrScanner Component', () => {
  it('renders Trakheesi QR permit validator and active permit badge', () => {
    render(<TrakheesiQrScanner />);
    expect(screen.getByTestId('trakheesi-qr-scanner')).toBeDefined();
    expect(screen.getByText(/Trakheesi QR & Permit Validator/i)).toBeDefined();
    expect(screen.getByText(/TRK-2026-789421/i)).toBeDefined();
    expect(screen.getByText(/44483/i)).toBeDefined();
  });
});
