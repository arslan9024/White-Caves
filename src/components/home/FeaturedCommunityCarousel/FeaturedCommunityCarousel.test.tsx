import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeaturedCommunityCarousel } from './FeaturedCommunityCarousel';

describe('FeaturedCommunityCarousel Component', () => {
  it('renders featured prime Dubai communities carousel and selects community', () => {
    render(<FeaturedCommunityCarousel />);
    expect(screen.getByTestId('featured-community-carousel')).toBeDefined();
    expect(screen.getByText(/Prime Master Communities/i)).toBeDefined();
    expect(screen.getByText(/DLD Q3 Verified/i)).toBeDefined();
    expect(screen.getByText(/Palm Jumeirah/i)).toBeDefined();
    expect(screen.getByText(/Downtown Dubai/i)).toBeDefined();
    expect(screen.getByText(/Dubai Hills Estate/i)).toBeDefined();
    expect(screen.getByText(/DAMAC Hills 2/i)).toBeDefined();

    const dtCard = screen.getByText(/Downtown Dubai/i);
    fireEvent.click(dtCard);
    expect(screen.getByText(/Urban Luxury & Burj Views/i)).toBeDefined();
  });
});
