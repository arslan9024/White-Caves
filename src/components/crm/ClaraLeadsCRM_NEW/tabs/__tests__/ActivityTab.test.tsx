import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import ActivityTab from '../ActivityTab';

vi.mock('../../hooks/useLeadsData', () => ({
  useLeadsData: () => ({
    leads: [],
    stats: { totalValue: 0, qualifiedLeads: 0, avgProbability: 0 },
  }),
}));

describe('ActivityTab Component', () => {
  it('renders ActivityTab component without crashing', () => {
    const { container } = render(<ActivityTab />);
    expect(container).toBeDefined();
  });
});
