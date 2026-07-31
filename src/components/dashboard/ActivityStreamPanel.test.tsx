import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import ActivityStreamPanel from './ActivityStreamPanel';

describe('ActivityStreamPanel Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<ActivityStreamPanel />);
    expect(container).toBeDefined();
  });
});
