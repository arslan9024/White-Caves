import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import DealsTab from '../DealsTab';

vi.mock('../../hooks/useLeadsData', () => ({
  useLeadsData: () => ({
    leads: [],
    stats: { totalValue: 0, qualifiedLeads: 0, avgProbability: 0 },
  }),
}));

describe('DealsTab Component', () => {
  it('renders DealsTab component without crashing', () => {
    const { container } = render(<DealsTab />);
    expect(container).toBeDefined();
  });
});
