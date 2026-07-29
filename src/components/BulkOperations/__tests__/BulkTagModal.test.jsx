import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BulkTagModal from '../BulkTagModal';

describe('BulkTagModal Component', () => {
  it('renders null when isOpen is false', () => {
    const { container } = render(<BulkTagModal isOpen={false} propertyCount={3} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders tag input when isOpen is true', () => {
    render(<BulkTagModal isOpen={true} propertyCount={3} />);
    expect(screen.getByPlaceholderText('Add a tag...')).toBeDefined();
  });
});
