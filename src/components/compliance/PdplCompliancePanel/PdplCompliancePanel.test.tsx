import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PdplCompliancePanel } from './PdplCompliancePanel';

describe('PdplCompliancePanel Component', () => {
  it('renders UAE PDPL data privacy compliance panel and toggles policy item', () => {
    render(<PdplCompliancePanel />);
    expect(screen.getByTestId('pdpl-compliance-panel')).toBeDefined();
    expect(screen.getByText(/UAE PDPL Data Privacy Compliance/i)).toBeDefined();
    expect(screen.getByText(/Law 45 \/ 2021/i)).toBeDefined();
    expect(screen.getByText(/PDPL Compliance Score/i)).toBeDefined();
    expect(screen.getByText(/Lawful Basis for Data Collection/i)).toBeDefined();

    const breachPolicy = screen.getByText(/Data Breach Notification \(72hr\)/i);
    fireEvent.click(breachPolicy);
    expect(screen.getByText(/5\/6 policies active/i)).toBeDefined();
  });
});
