import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import TasksTab from '../TasksTab';

describe('TasksTab Component', () => {
  it('renders TasksTab component without crashing', () => {
    const { container } = render(<TasksTab />);
    expect(container).toBeDefined();
  });
});
