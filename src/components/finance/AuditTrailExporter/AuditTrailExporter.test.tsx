import { describe, it, expect } from 'vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { AuditTrailExporter } from './AuditTrailExporter';

describe('AuditTrailExporter Component', () => {
  it('renders the audit trail, filters entries, and records the selected export', () => {
    render(<AuditTrailExporter />);
    expect(screen.getByTestId('audit-trail-exporter')).toBeDefined();
    expect(screen.getByText(/Corporate Audit Trail Exporter/i)).toBeDefined();
    expect(screen.getByText(/CSV · Excel XML/i)).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: 'READ' }));
    expect(screen.getByText(/AML screening/i)).toBeDefined();
    expect(screen.queryByText(/Landlord payout batch dispatched/i)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Export CSV/i }));
    expect(screen.getByRole('button', { name: /CSV Downloaded/i })).toBeDefined();
  });
});
