import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BulkFurnishingModal from '../BulkFurnishingModal';

describe('BulkFurnishingModal Component', () => {
  it('renders null when isOpen is false', () => {
    const { container } = render(<BulkFurnishingModal isOpen={false} propertyCount={3} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders furnishing options when isOpen is true', () => {
    render(<BulkFurnishingModal isOpen={true} propertyCount={3} />);
    expect(screen.getByText('Unfurnished')).toBeDefined();
  });
});
