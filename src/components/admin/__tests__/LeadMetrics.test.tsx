import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import LeadMetrics from '../LeadMetrics';

describe('LeadMetrics Component', () => {
  it('renders lead metrics correctly', () => {
    render(<LeadMetrics />);
    expect(screen.getByTestId('lead-metrics')).toBeDefined();
    expect(screen.getByText('Lead Conversion Metrics')).toBeDefined();
    expect(screen.getByText('1240')).toBeDefined();
  });
});
