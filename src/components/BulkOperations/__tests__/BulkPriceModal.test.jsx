import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BulkPriceModal from '../BulkPriceModal';

describe('BulkPriceModal Component', () => {
  it('renders null when isOpen is false', () => {
    const { container } = render(<BulkPriceModal isOpen={false} propertyCount={3} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders price options when isOpen is true', () => {
    render(<BulkPriceModal isOpen={true} propertyCount={5} />);
    expect(screen.getByText('Set Price')).toBeDefined();
  });
});
