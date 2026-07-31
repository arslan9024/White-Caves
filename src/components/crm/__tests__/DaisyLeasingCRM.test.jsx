import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import DaisyLeasingCRM from '../DaisyLeasingCRM';

describe('DaisyLeasingCRM Component', () => {
  it('renders DaisyLeasingCRM without crashing', () => {
    const { container } = render(<DaisyLeasingCRM />);
    expect(container).toBeDefined();
  });

  it('renders active lease data', () => {
    render(<DaisyLeasingCRM />);
    expect(screen.getByText('Ahmed Al Rashid')).toBeDefined();
  });
});
