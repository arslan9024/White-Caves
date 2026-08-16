import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PricePerSqftSparkline } from './PricePerSqftSparkline';

describe('PricePerSqftSparkline Component', () => {
  it('renders price per sqft sparkline and switches community tabs', () => {
    render(<PricePerSqftSparkline />);
    expect(screen.getByTestId('price-per-sqft-sparkline')).toBeDefined();
    expect(screen.getByText(/Price\/Sqft Trend/i)).toBeDefined();
    expect(screen.getByText('Downtown')).toBeDefined();
    expect(screen.getByText(/AED 2,210\/sqft/i)).toBeDefined();

    // Select Palm
    const palmChip = screen.getByText('Palm');
    fireEvent.click(palmChip);
    expect(screen.getByText(/AED 2,650\/sqft/i)).toBeDefined();
  });
});
