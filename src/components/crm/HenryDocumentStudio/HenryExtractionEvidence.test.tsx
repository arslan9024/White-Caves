import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { HenryExtractionEvidence } from './HenryExtractionEvidence';
import { readDocumentFields } from '../../../services/henryDocumentParsing';

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

it('highlights actual labelled source ranges and honestly omits derived or reviewed locators', () => {
  const { diagnostics } = readDocumentFields('Other TEST\nName: TEST\nArea: 100', { name: ['Name'], area: ['Area'] });
  diagnostics.fields.derived = { state: 'derived', source: 'conversion', values: ['1076'] };
  diagnostics.fields.reviewed = { state: 'extracted', source: 'review', values: ['EDITED'] };
  const { container, rerender } = render(<HenryExtractionEvidence diagnostics={diagnostics} />);
  fireEvent.click(screen.getByRole('button', { name: /name: extracted/ }));
  expect(container.querySelector('mark')?.textContent).toBe('TEST');
  expect(screen.getByLabelText('Source text evidence').textContent).toBe(diagnostics.sourceText);
  fireEvent.click(screen.getByRole('button', { name: /derived: derived/ }));
  expect(container.querySelector('mark')).toBeNull();
  expect(screen.getByRole('status').textContent).toMatch(/No exact source-text locator/);
  fireEvent.click(screen.getByRole('button', { name: /reviewed: extracted/ }));
  expect(container.querySelector('mark')).toBeNull();
  rerender(<HenryExtractionEvidence diagnostics={{ ...diagnostics }} />);
  expect(screen.queryByRole('status')).toBeNull();
  expect(screen.getByText(/Original image\/page coordinates are unavailable/)).toBeTruthy();
});
