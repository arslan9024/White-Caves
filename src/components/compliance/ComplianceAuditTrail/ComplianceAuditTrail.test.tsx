import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ComplianceAuditTrail } from './ComplianceAuditTrail';

describe('ComplianceAuditTrail Component', () => {
  it('renders compliance audit trail and filters events by type', () => {
    render(<ComplianceAuditTrail />);
    expect(screen.getByTestId('compliance-audit-trail')).toBeDefined();
    expect(screen.getByText(/Compliance Audit Trail/i)).toBeDefined();
    expect(screen.getByText(/RERA Form A/i)).toBeDefined();
    expect(screen.getByText(/AML KYC completed/i)).toBeDefined();

    // Filter by warnings
    const warningBtn = screen.getByRole('button', { name: /WARNING/i });
    fireEvent.click(warningBtn);
    expect(screen.getByText(/DLD NOC pending/i)).toBeDefined();
    expect(screen.queryByText(/RERA Form A/i)).toBeNull();
  });
});
