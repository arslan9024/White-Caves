import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PropertyVectorBadges } from './PropertyVectorBadges';

describe('PropertyVectorBadges', () => {
  it('renders property specification badges', () => {
    render(
      <PropertyVectorBadges
        beds="5 Beds"
        baths="6 Baths"
        sqft="8,450 SqFt"
        location="Palm Jumeirah"
      />
    );

    expect(screen.getByTestId('property-vector-badges')).toBeDefined();
    expect(screen.getByText('5 Beds')).toBeDefined();
    expect(screen.getByText('6 Baths')).toBeDefined();
    expect(screen.getByText('8,450 SqFt')).toBeDefined();
    expect(screen.getByText('Palm Jumeirah')).toBeDefined();
  });
});
