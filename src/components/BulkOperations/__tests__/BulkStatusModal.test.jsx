import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BulkStatusModal from '../BulkStatusModal';

describe('BulkStatusModal Component', () => {
  it('renders null when isOpen is false', () => {
    const { container } = render(<BulkStatusModal isOpen={false} propertyCount={3} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders status options when isOpen is true', () => {
    render(<BulkStatusModal isOpen={true} propertyCount={3} />);
    expect(screen.getByText('Available')).toBeDefined();
    expect(screen.getByText('Occupied')).toBeDefined();
  });
});
