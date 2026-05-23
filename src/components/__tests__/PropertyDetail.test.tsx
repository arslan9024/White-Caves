import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock PropertyMap
vi.mock('../PropertyMap', () => ({
  default: ({ location }: { location?: string }) => (
    <div data-testid="property-map">Map: {location}</div>
  ),
}));

// Mock styled-components
vi.mock('../PropertyDetail.styles', () => {
  const c = (tag: string, name: string) => {
    const Comp = ({ children, ...props }: any) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) clean[k] = v;
      }
      return React.createElement(tag, { ...clean, 'data-testid': name }, children);
    };
    Comp.displayName = name;
    return Comp;
  };
  return {
    PropertyDetailContainer: c('div', 'property-detail-container'),
    PropertyHeader: c('div', 'property-header'),
    PropertyTypePrice: c('div', 'property-type-price'),
    ListingType: c('span', 'listing-type'),
    Price: c('span', 'price'),
    PropertyImages: c('div', 'property-images'),
    PropertyDescription: c('div', 'property-description'),
    PropertyInfoGrid: c('div', 'property-info-grid'),
    InfoSection: c('div', 'info-section'),
    PropertyAmenities: c('div', 'property-amenities'),
    AmenitiesGrid: c('div', 'amenities-grid'),
    AmenityTag: c('span', 'amenity-tag'),
    PropertyLocation: c('div', 'property-location'),
  };
});

import PropertyDetail from '../PropertyDetail';

const fullProperty = {
  title: 'Luxury Villa on Palm Jumeirah',
  listingType: 'For Sale',
  price: 15000000,
  images: ['/img1.jpg', '/img2.jpg', '/img3.jpg'],
  description: 'Stunning beachfront villa with panoramic sea views.',
  beds: 5,
  baths: 6,
  sqft: 12000,
  features: {
    floorLevel: 'Ground + 2',
    view: 'Sea View',
    balcony: true,
    parkingSpaces: 4,
    kitchenType: 'Open Plan',
    condition: 'Brand New',
  },
  amenities: ['Pool', 'Gym', 'Beach Access', 'Concierge', 'Spa'],
  specifications: {
    buildYear: 2024,
    totalFloors: 3,
    plotArea: 15000,
    buildUpArea: 12000,
  },
  location: 'Palm Jumeirah',
};

const minimalProperty = {
  title: 'Studio in Business Bay',
  listingType: 'For Rent',
  price: 85000,
  description: 'Compact studio for professionals.',
  beds: 0,
  baths: 1,
  sqft: 450,
  location: 'Business Bay',
};

describe('PropertyDetail', () => {
  // ── Basic Rendering ────────────────────────────────────────
  describe('basic rendering', () => {
    it('renders the property title', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Luxury Villa on Palm Jumeirah')).toBeInTheDocument();
    });

    it('renders the listing type', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('For Sale')).toBeInTheDocument();
    });

    it('renders the formatted price', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('AED 15,000,000')).toBeInTheDocument();
    });

    it('renders the description section', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Stunning beachfront villa with panoramic sea views.')).toBeInTheDocument();
    });
  });

  // ── Property Images ────────────────────────────────────────
  describe('images', () => {
    it('renders all property images', () => {
      render(<PropertyDetail property={fullProperty} />);
      const imgs = screen.getAllByRole('img');
      expect(imgs.length).toBe(3);
    });

    it('sets correct alt text for images', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByAltText('Property view 1')).toBeInTheDocument();
      expect(screen.getByAltText('Property view 2')).toBeInTheDocument();
      expect(screen.getByAltText('Property view 3')).toBeInTheDocument();
    });

    it('uses lazy loading for images', () => {
      render(<PropertyDetail property={fullProperty} />);
      const imgs = screen.getAllByRole('img');
      imgs.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });

    it('handles property with no images', () => {
      render(<PropertyDetail property={minimalProperty} />);
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });
  });

  // ── Basic Information ──────────────────────────────────────
  describe('basic information', () => {
    it('renders bedroom count', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Bedrooms:')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders bathroom count', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Bathrooms:')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
    });

    it('renders area in sqft', () => {
      render(<PropertyDetail property={fullProperty} />);
      // "12000 sq.ft" appears in both Area and Build-up Area
      expect(screen.getAllByText('12000 sq.ft').length).toBeGreaterThanOrEqual(1);
    });

    it('renders floor level', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Floor Level:')).toBeInTheDocument();
      expect(screen.getByText('Ground + 2')).toBeInTheDocument();
    });

    it('renders view type', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('View:')).toBeInTheDocument();
      expect(screen.getByText('Sea View')).toBeInTheDocument();
    });
  });

  // ── Features ───────────────────────────────────────────────
  describe('features', () => {
    it('renders balcony as Yes when true', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Balcony:')).toBeInTheDocument();
      expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    it('renders balcony as No when false/missing', () => {
      render(<PropertyDetail property={minimalProperty} />);
      expect(screen.getByText('Balcony:')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('renders parking spaces', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Parking Spaces:')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('renders kitchen type', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Kitchen Type:')).toBeInTheDocument();
      expect(screen.getByText('Open Plan')).toBeInTheDocument();
    });

    it('renders property condition', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Condition:')).toBeInTheDocument();
      expect(screen.getByText('Brand New')).toBeInTheDocument();
    });
  });

  // ── Building Specifications ────────────────────────────────
  describe('specifications', () => {
    it('renders build year', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Build Year:')).toBeInTheDocument();
      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('renders total floors', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Total Floors:')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders plot area', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Plot Area:')).toBeInTheDocument();
      expect(screen.getByText('15000 sq.ft')).toBeInTheDocument();
    });

    it('renders build-up area', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Build-up Area:')).toBeInTheDocument();
    });
  });

  // ── Amenities ──────────────────────────────────────────────
  describe('amenities', () => {
    it('renders amenities heading', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Amenities')).toBeInTheDocument();
    });

    it('renders all amenity tags', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Pool')).toBeInTheDocument();
      expect(screen.getByText('Gym')).toBeInTheDocument();
      expect(screen.getByText('Beach Access')).toBeInTheDocument();
      expect(screen.getByText('Concierge')).toBeInTheDocument();
      expect(screen.getByText('Spa')).toBeInTheDocument();
    });

    it('handles property with no amenities', () => {
      render(<PropertyDetail property={minimalProperty} />);
      expect(screen.getByText('Amenities')).toBeInTheDocument();
      // No amenity tags rendered
    });
  });

  // ── Location & Map ─────────────────────────────────────────
  describe('location', () => {
    it('renders the location heading', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Location')).toBeInTheDocument();
    });

    it('renders PropertyMap with correct location', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByTestId('property-map')).toBeInTheDocument();
      expect(screen.getByText('Map: Palm Jumeirah')).toBeInTheDocument();
    });
  });

  // ── Section Headings ───────────────────────────────────────
  describe('section headings', () => {
    it('renders all major section headings', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Basic Information')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
      expect(screen.getByText('Building Specifications')).toBeInTheDocument();
      expect(screen.getByText('Amenities')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
    });
  });

  // ── Edge Cases ─────────────────────────────────────────────
  describe('edge cases', () => {
    it('handles zero price correctly', () => {
      render(<PropertyDetail property={{ ...fullProperty, price: 0 }} />);
      expect(screen.getByText('AED 0')).toBeInTheDocument();
    });

    it('handles missing features gracefully', () => {
      render(<PropertyDetail property={minimalProperty} />);
      expect(screen.getByTestId('property-detail-container')).toBeInTheDocument();
    });

    it('handles missing specifications gracefully', () => {
      render(<PropertyDetail property={minimalProperty} />);
      expect(screen.getByText('Building Specifications')).toBeInTheDocument();
    });
  });
});
