import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { PdcMicrScanner } from './PdcMicrScanner';

describe('PdcMicrScanner Component', () => {
  it('renders PDC cheque vault and MICR OCR scanner upload area', () => {
    render(<PdcMicrScanner />);
    expect(screen.getByTestId('pdc-micr-scanner')).toBeDefined();
    expect(screen.getByText(/PDC Cheque Vault & MICR Line OCR Scanner/i)).toBeDefined();
    expect(screen.getByText(/Bank Clearance Active/i)).toBeDefined();
    expect(screen.getByText(/Scan or Upload Emirates NBD \/ FAB PDC Cheque/i)).toBeDefined();
    expect(screen.getByText(/Automated MICR routing code extraction & 7-day deposit alert/i)).toBeDefined();
  });
});
