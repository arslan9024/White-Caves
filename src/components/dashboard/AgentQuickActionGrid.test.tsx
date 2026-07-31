import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import AgentQuickActionGrid from './AgentQuickActionGrid';

describe('AgentQuickActionGrid Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<AgentQuickActionGrid />);
    expect(container).toBeDefined();
  });
});
