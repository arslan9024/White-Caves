import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LeadImportCsvWizard } from './LeadImportCsvWizard';
describe('LeadImportCsvWizard', () => {
  it('renders upload step initially', () => {
    render(<LeadImportCsvWizard />);
    expect(screen.getByTestId('lead-import-wizard')).toBeTruthy();
    expect(screen.getByText('Upload Lead CSV File')).toBeTruthy();
  });
});
