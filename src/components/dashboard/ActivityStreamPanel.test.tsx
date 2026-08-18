import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import DashboardActivityFeed from './DashboardActivityFeed';

describe('DashboardActivityFeed Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<DashboardActivityFeed />);
    expect(container).toBeDefined();
  });
});
