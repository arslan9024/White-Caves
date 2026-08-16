import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReraComplianceChecklist } from './ReraComplianceChecklist';

describe('ReraComplianceChecklist Component', () => {
  it('renders RERA 2024 compliance checklist and toggles check item', () => {
    render(<ReraComplianceChecklist />);
    expect(screen.getByTestId('rera-compliance-checklist')).toBeDefined();
    expect(screen.getByText(/RERA 2024 Compliance Checklist/i)).toBeDefined();
    expect(screen.getByText(/Critical Gates/i)).toBeDefined();
    expect(screen.getByText(/Advisory Met/i)).toBeDefined();
    expect(screen.getByText(/RERA Broker Registration Card \(BRN\)/i)).toBeDefined();

    const nocItem = screen.getByText(/DLD NOC — No Objection Certificate/i);
    fireEvent.click(nocItem);
    expect(screen.getByText(/4\/5/i)).toBeDefined();
  });
});
