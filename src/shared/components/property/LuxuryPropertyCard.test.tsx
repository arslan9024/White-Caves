import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import LuxuryPropertyCard from './LuxuryPropertyCard';
import { PropertyType } from '../../../hooks/usePropertyBrowser';

const mockProperty: PropertyType = {
  id: 'prop-123',
  title: 'Luxury Villa with Sea View',
  location: 'Palm Jumeirah',
  type: 'Villa',
  purpose: 'buy',
  beds: 5,
  baths: 6,
  sqft: 8500,
  price: 25000000,
  images: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg'
  ],
  image: 'https://example.com/image1.jpg',
  amenities: ['Private Beach', 'Infinity Pool', 'Smart Home'],
  featured: true,
  yearBuilt: 2024
};

describe('LuxuryPropertyCard', () => {
  it('renders property details correctly', () => {
    const handleFavoriteToggle = vi.fn();
    const handleClick = vi.fn();

    render(
      <BrowserRouter>
        <LuxuryPropertyCard 
          property={mockProperty}
          isFavorite={false}
          onFavoriteToggle={handleFavoriteToggle}
          onClick={handleClick}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Luxury Villa with Sea View')).toBeInTheDocument();
    expect(screen.getByText('Palm Jumeirah')).toBeInTheDocument();
    expect(screen.getByText('AED 25,000,000')).toBeInTheDocument();
    expect(screen.getByText('Villa')).toBeInTheDocument();
    expect(screen.getByText('Featured')).toBeInTheDocument();
    expect(screen.getByText('For Sale')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleFavoriteToggle = vi.fn();
    const handleClick = vi.fn();

    render(
      <BrowserRouter>
        <LuxuryPropertyCard 
          property={mockProperty}
          isFavorite={false}
          onFavoriteToggle={handleFavoriteToggle}
          onClick={handleClick}
        />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /View Luxury Villa with Sea View/i }));
    expect(handleClick).toHaveBeenCalledWith(mockProperty);
  });
});
