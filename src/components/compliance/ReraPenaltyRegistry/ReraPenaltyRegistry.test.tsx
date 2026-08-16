import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReraPenaltyRegistry } from './ReraPenaltyRegistry';

describe('ReraPenaltyRegistry Component', () => {
  it('renders RERA penalty and fine registry with statutory references', () => {
    render(<ReraPenaltyRegistry />);
    expect(screen.getByTestId('rera-penalty-registry')).toBeDefined();
    expect(screen.getByText(/RERA Penalty & Fine Registry 2024/i)).toBeDefined();
    expect(screen.getByText(/Law 85\/2006 Reference/i)).toBeDefined();
    expect(screen.getByText(/Unlicensed Brokerage Activity/i)).toBeDefined();
    expect(screen.getByText(/AED 50,000/i)).toBeDefined();
    expect(screen.getByText(/AML Reporting Failure \(STR\)/i)).toBeDefined();
    expect(screen.getByText(/AED 200,000/i)).toBeDefined();
  });
});
