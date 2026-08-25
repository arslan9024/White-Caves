import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyCardHoverContainer } from './PropertyCardHoverContainer';

describe('PropertyCardHoverContainer', () => {
  it('renders children and handles click event', () => {
    const onClick = vi.fn();
    render(
      <PropertyCardHoverContainer onClick={onClick}>
        <div>Listing Card Content</div>
      </PropertyCardHoverContainer>
    );

    expect(screen.getByTestId('property-card-hover-container')).toBeDefined();
    expect(screen.getByText('Listing Card Content')).toBeDefined();

    fireEvent.click(screen.getByTestId('property-card-hover-container'));
    expect(onClick).toHaveBeenCalled();
  });
});
