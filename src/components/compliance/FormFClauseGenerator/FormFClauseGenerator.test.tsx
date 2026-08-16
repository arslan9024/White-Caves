import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormFClauseGenerator } from './FormFClauseGenerator';

describe('FormFClauseGenerator Component', () => {
  it('renders Form F MOU clause generator and compiles unified contract', () => {
    render(<FormFClauseGenerator />);
    expect(screen.getByTestId('form-f-clause-generator')).toBeDefined();
    expect(screen.getByText(/Form F \(MOU\) Clause Generator/i)).toBeDefined();
    expect(screen.getByText(/RERA UNIFIED 2026/i)).toBeDefined();
    expect(screen.getByText(/Standard & Contingency Clauses/i)).toBeDefined();

    // Compile contract
    const compileBtn = screen.getByRole('button', { name: /Compile Unified Form F MOU Contract/i });
    fireEvent.click(compileBtn);
    expect(screen.getByText(/Generated Unified Contract Preview/i)).toBeDefined();
    expect(screen.getByText(/Dispatch to DLD Portal/i)).toBeDefined();
  });
});
