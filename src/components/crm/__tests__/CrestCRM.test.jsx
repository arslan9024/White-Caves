import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import CrestCRM from '../CrestCRM';

describe('CrestCRM Component', () => {
  it('renders CrestCRM component without crashing', () => {
    const { container } = render(<CrestCRM />);
    expect(container).toBeDefined();
  });

  it('renders property valuation data', () => {
    render(<CrestCRM />);
    expect(screen.getByText('Palm Jumeirah Villa G-12')).toBeDefined();
  });
});
