import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PropertyHighlightsPillList } from './PropertyHighlightsPillList';

describe('PropertyHighlightsPillList', () => {
  it('renders amenity pills with icons and labels', () => {
    render(<PropertyHighlightsPillList />);

    expect(screen.getByTestId('property-highlights-pill-list')).toBeDefined();
    expect(screen.getByText('Private Infinity Pool')).toBeDefined();
    expect(screen.getByText('Direct Private Beach Access')).toBeDefined();
  });
});
