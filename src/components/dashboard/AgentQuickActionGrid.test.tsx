import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import DashboardModuleGrid from './DashboardModuleGrid';

describe('DashboardModuleGrid Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<DashboardModuleGrid modulesByZone={[]} />);
    expect(container).toBeDefined();
  });
});
