import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { LeadAgingHeatmap } from './LeadAgingHeatmap';
describe('LeadAgingHeatmap', () => {
  it('renders heatmap with aging cells', () => {
    render(<LeadAgingHeatmap />);
    expect(screen.getByTestId('lead-aging-heatmap')).toBeTruthy();
    expect(screen.getByText('Lead Aging Heatmap — Days Since Last Contact')).toBeTruthy();
  });
});
