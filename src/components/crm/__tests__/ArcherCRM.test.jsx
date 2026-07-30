import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ArcherCRM from '../ArcherCRM';

describe('ArcherCRM Component', () => {
  it('renders Archer CRM component without crashing', () => {
    const { container } = render(<ArcherCRM />);
    expect(container).toBeDefined();
  });

  it('renders scored leads', () => {
    render(<ArcherCRM />);
    expect(screen.getByText('Ahmad Al Rashidi')).toBeDefined();
  });
});
