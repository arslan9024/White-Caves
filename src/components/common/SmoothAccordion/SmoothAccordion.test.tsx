import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SmoothAccordion } from './SmoothAccordion';

describe('SmoothAccordion Component', () => {
  it('renders smooth accordion with statutory DLD and Golden Visa FAQs and handles collapse/expand', () => {
    render(<SmoothAccordion />);
    expect(screen.getByTestId('smooth-accordion')).toBeDefined();
    expect(screen.getByText(/What is the statutory DLD transfer fee/i)).toBeDefined();
    expect(screen.getByText(/10-Year UAE Golden Visa/i)).toBeDefined();

    // Toggle second accordion item
    const goldenVisaHeader = screen.getByText(/10-Year UAE Golden Visa/i);
    fireEvent.click(goldenVisaHeader);
    expect(screen.getByText(/Under UAE Cabinet Resolution No. 65 of 2022/i)).toBeDefined();
  });
});
