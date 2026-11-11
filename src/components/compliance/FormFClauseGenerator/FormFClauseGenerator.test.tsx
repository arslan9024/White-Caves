import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormFClauseGenerator } from './FormFClauseGenerator';

describe('FormFClauseGenerator Component', () => {
  it('renders Form F MOU clause generator and compiles unified contract', () => {
    render(<FormFClauseGenerator />);
    expect(screen.getByTestId('form-f-clause-generator')).toBeDefined();
    expect(screen.getByText(/Form F — MOU Clause Generator/i)).toBeDefined();
    expect(screen.getByText(/Sale Price Agreement/i)).toBeDefined();
    expect(screen.getByText(/Completion Date/i)).toBeDefined();

    // Toggle a clause
    const addClause = screen.getAllByText(/\+ Add/i)[0];
    if (addClause) {
      fireEvent.click(addClause);
      expect(screen.getByText(/✓ Included/i)).toBeDefined();
    }

    // Generate Form F
    const generateBtn = screen.getByRole('button', { name: /Generate Form F MOU/i });
    fireEvent.click(generateBtn);
    expect(screen.getByText(/✅ Form F Generated/i)).toBeDefined();
  });
});
