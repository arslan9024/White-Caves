import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import TasksTab from '../TasksTab';

vi.mock('../../hooks/useLeadsData', () => ({
  useLeadsData: () => ({
    leads: [],
    stats: { totalValue: 0, qualifiedLeads: 0, avgProbability: 0 },
  }),
}));

describe('TasksTab Component', () => {
  it('renders TasksTab component without crashing', () => {
    const { container } = render(<TasksTab />);
    expect(container).toBeDefined();
  });
});
