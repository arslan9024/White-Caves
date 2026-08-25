import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PropertyStatusBadge } from './PropertyStatusBadge';

describe('PropertyStatusBadge', () => {
  it('renders available badge and handles different status labels', () => {
    const { rerender } = render(<PropertyStatusBadge status="AVAILABLE" />);
    expect(screen.getByTestId('property-status-badge')).toBeDefined();
    expect(screen.getByText('AVAILABLE FOR SALE')).toBeDefined();

    rerender(<PropertyStatusBadge status="SOLD" />);
    expect(screen.getByText('SOLD & TRANSFERRED')).toBeDefined();
  });
});
