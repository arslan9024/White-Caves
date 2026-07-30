import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ApexCRM from '../ApexCRM';

describe('ApexCRM Component', () => {
  it('renders Apex CRM component without crashing', () => {
    const { container } = render(<ApexCRM />);
    expect(container).toBeDefined();
  });

  it('renders agent performance data', () => {
    render(<ApexCRM />);
    expect(screen.getByText('Omar Siddiqui')).toBeDefined();
  });
});
