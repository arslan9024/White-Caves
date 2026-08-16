import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AmlPepScreeningFilter } from './AmlPepScreeningFilter';

describe('AmlPepScreeningFilter Component', () => {
  it('renders AML PEP watchlist screening engine and active screening profile', () => {
    render(<AmlPepScreeningFilter />);
    expect(screen.getByTestId('aml-pep-screening-filter')).toBeDefined();
    expect(screen.getByText(/AML & PEP Watchlist Screening/i)).toBeDefined();
    expect(screen.getByText(/UAE goAML \/ FIU/i)).toBeDefined();
    expect(screen.getByDisplayValue('Viktor Morozov')).toBeDefined();
  });
});
