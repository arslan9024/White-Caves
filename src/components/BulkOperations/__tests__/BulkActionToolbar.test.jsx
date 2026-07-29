import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import BulkActionToolbar from '../BulkActionToolbar';

describe('BulkActionToolbar Component', () => {
  it('renders null when selectedCount is 0', () => {
    const { container } = render(<BulkActionToolbar selectedCount={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders selection count and action buttons when items are selected', () => {
    render(<BulkActionToolbar selectedCount={5} />);
    expect(screen.getByText('5 selected')).toBeDefined();
    expect(screen.getByText('Status')).toBeDefined();
  });
});
