import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LeadSourceAttributionChart } from './LeadSourceAttributionChart';
describe('LeadSourceAttributionChart', () => {
  it('renders chart with all sources', () => {
    render(<LeadSourceAttributionChart />);
    expect(screen.getByTestId('lead-source-chart')).toBeTruthy();
    expect(screen.getByText('PropertyFinder')).toBeTruthy();
    expect(screen.getByText('WhatsApp')).toBeTruthy();
  });
});
