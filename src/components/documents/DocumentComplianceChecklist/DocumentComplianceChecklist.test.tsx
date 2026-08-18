import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DocumentComplianceChecklist } from './DocumentComplianceChecklist';
describe('DocumentComplianceChecklist', () => {
  it('renders compliance checklist', () => {
    render(<DocumentComplianceChecklist />);
    expect(screen.getByTestId('document-compliance-checklist')).toBeTruthy();
    expect(screen.getByText('RERA Compliance Checklist')).toBeTruthy();
  });
});
