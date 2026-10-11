import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { HenryExtractionEvidence } from './HenryExtractionEvidence';

it('presents coverage as evidence, not official accuracy, with missing and conflict states', () => {
  render(<HenryExtractionEvidence diagnostics={{ coverage: 0.5, ocrConfidence: 72, warnings: ['Compare sources'],
    fields: { idNumber: { state: 'conflict', source: 'text', values: ['SYNTHETIC A', 'SYNTHETIC B'] },
      expiryDate: { state: 'missing', source: 'text', values: [] } } }} />);
  expect(screen.getByText(/Visible field coverage: 50%/)).toBeTruthy();
  expect(screen.getByText(/not accuracy or official verification/)).toBeTruthy();
  expect(screen.getByRole('alert').textContent).toBe('Compare sources');
  expect(screen.getByText(/expiryDate: missing/)).toBeTruthy();
  expect(screen.getByText(/idNumber: conflict/)).toBeTruthy();
});
