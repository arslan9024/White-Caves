import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MortgageStressTestSimulator from './MortgageStressTestSimulator';

describe('MortgageStressTestSimulator Component', () => {
  it('renders without crashing and displays the mortgage stress test simulator', () => {
    render(<MortgageStressTestSimulator />);
    expect(screen.getByTestId('mortgage-stress-test-simulator')).toBeInTheDocument();
  });
});
