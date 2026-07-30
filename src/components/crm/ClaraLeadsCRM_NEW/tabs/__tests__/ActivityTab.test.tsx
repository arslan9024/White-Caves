import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import ActivityTab from '../ActivityTab';

describe('ActivityTab Component', () => {
  it('renders ActivityTab component without crashing', () => {
    const { container } = render(<ActivityTab />);
    expect(container).toBeDefined();
  });
});
