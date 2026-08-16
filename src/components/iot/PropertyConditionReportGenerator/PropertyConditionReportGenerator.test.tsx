import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyConditionReportGenerator } from './PropertyConditionReportGenerator';

describe('PropertyConditionReportGenerator Component', () => {
  it('renders property condition report generator and compiles report', () => {
    render(<PropertyConditionReportGenerator />);
    expect(screen.getByTestId('property-condition-report-generator')).toBeDefined();
    expect(screen.getByText(/Landlord Property Condition Report \(PCR\) Generator/i)).toBeDefined();
    expect(screen.getByText(/RERA HANDOVER DOC/i)).toBeDefined();
    expect(screen.getByText(/Room-by-Room Handover Audit Matrix/i)).toBeDefined();

    const compileBtn = screen.getByRole('button', { name: /Compile & Sign Condition Report/i });
    fireEvent.click(compileBtn);
    expect(screen.getByText(/Formal PCR Signed & PDF Exported/i)).toBeDefined();
  });
});
