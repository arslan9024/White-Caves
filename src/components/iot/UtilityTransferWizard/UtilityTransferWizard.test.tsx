import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { UtilityTransferWizard } from './UtilityTransferWizard';

describe('UtilityTransferWizard Component', () => {
  it('renders utility transfer wizard and step 1 DEWA / Empower fields', () => {
    render(<UtilityTransferWizard />);
    expect(screen.getByTestId('utility-transfer-wizard')).toBeDefined();
    expect(screen.getByText(/DEWA & Empower District Cooling Utility Transfer Wizard/i)).toBeDefined();
    expect(screen.getByText(/GOVERNMENT API LINK/i)).toBeDefined();
    expect(screen.getByDisplayValue('2008491204')).toBeDefined();
    expect(screen.getByDisplayValue('EMP-78401')).toBeDefined();
  });
});
