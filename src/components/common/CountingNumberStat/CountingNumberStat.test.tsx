import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CountingNumberStat } from './CountingNumberStat';

describe('CountingNumberStat Component', () => {
  it('renders counting number stat component and custom label', () => {
    render(<CountingNumberStat targetValue={48500000} prefix="AED " label="Total Revenue YTD" />);
    expect(screen.getByTestId('counting-number-stat')).toBeDefined();
    expect(screen.getByText(/Total Revenue YTD/i)).toBeDefined();
  });
});
