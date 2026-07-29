import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BulkDeleteModal from '../BulkDeleteModal';

describe('BulkDeleteModal Component', () => {
  it('renders null when isOpen is false', () => {
    const { container } = render(<BulkDeleteModal isOpen={false} propertyCount={3} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders delete modal header when isOpen is true', () => {
    render(<BulkDeleteModal isOpen={true} propertyCount={3} />);
    expect(screen.getByText('Delete Properties')).toBeDefined();
  });
});
