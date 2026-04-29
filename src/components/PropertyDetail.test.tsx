/**
 * PropertyDetail Component Tests
 * Tests: rendering, header, images, description, basic info, features,
 *        specifications, amenities, location/map
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PropertyDetail from './PropertyDetail';

// Mock PropertyMap
vi.mock('./PropertyMap', () => ({
  default: ({ location }: any) => <div data-testid="property-map">{location}</div>,
}));

// Mock styled components
vi.mock('./PropertyDetail.styles', () => ({
  PropertyDetailContainer: ({ children }: any) => <div data-testid="property-detail">{children}</div>,
  PropertyHeader: ({ children }: any) => <div>{children}</div>,
  PropertyTypePrice: ({ children }: any) => <div>{children}</div>,
  ListingType: ({ children }: any) => <span data-testid="listing-type">{children}</span>,
  Price: ({ children }: any) => <span data-testid="price">{children}</span>,
  PropertyImages: ({ children }: any) => <div data-testid="images">{children}</div>,
  PropertyDescription: ({ children }: any) => <div>{children}</div>,
  PropertyInfoGrid: ({ children }: any) => <div>{children}</div>,
  InfoSection: ({ children }: any) => <div>{children}</div>,
  PropertyAmenities: ({ children }: any) => <div>{children}</div>,
  AmenitiesGrid: ({ children }: any) => <div data-testid="amenities-grid">{children}</div>,
  AmenityTag: ({ children }: any) => <span data-testid="amenity-tag">{children}</span>,
  PropertyLocation: ({ children }: any) => <div>{children}</div>,
}));

const fullProperty = {
  title: 'Luxury Villa Palm Jumeirah',
  listingType: 'For Sale',
  price: 15000000,
  images: ['/img1.jpg', '/img2.jpg'],
  description: 'A stunning waterfront villa with panoramic views.',
  beds: 5,
  baths: 6,
  sqft: 8500,
  features: {
    floorLevel: 'Ground + 2',
    view: 'Sea View',
    balcony: true,
    parkingSpaces: 3,
    kitchenType: 'Open',
    condition: 'Brand New',
  },
  specifications: {
    buildYear: 2024,
    totalFloors: 3,
    plotArea: 12000,
    buildUpArea: 8500,
  },
  amenities: ['Swimming Pool', 'Gym', 'Private Beach', 'Garden'],
  location: 'Palm Jumeirah, Dubai',
};

const minimalProperty = {
  title: 'Basic Apartment',
  listingType: 'For Rent',
  price: 150000,
  description: 'A simple apartment.',
  beds: 1,
  baths: 1,
  sqft: 750,
  location: 'Dubai Marina',
};

describe('PropertyDetail', () => {
  // ─── Rendering ────────────────────────────────────────
  describe('rendering', () => {
    it('renders without crashing', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByTestId('property-detail')).toBeInTheDocument();
    });
  });

  // ─── Header ──────────────────────────────────────────
  describe('header', () => {
    it('renders property title', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Luxury Villa Palm Jumeirah')).toBeInTheDocument();
    });

    it('renders listing type', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByTestId('listing-type')).toHaveTextContent('For Sale');
    });

    it('renders formatted price', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByTestId('price')).toHaveTextContent('AED 15,000,000');
    });

    it('handles zero price', () => {
      render(<PropertyDetail property={{ ...minimalProperty, price: 0 }} />);
      expect(screen.getByTestId('price')).toHaveTextContent('AED 0');
    });
  });

  // ─── Images ──────────────────────────────────────────
  describe('images', () => {
    it('renders property images', () => {
      render(<PropertyDetail property={fullProperty} />);
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
    });

    it('sets correct alt text', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByAltText('Property view 1')).toBeInTheDocument();
      expect(screen.getByAltText('Property view 2')).toBeInTheDocument();
    });

    it('renders lazy-loaded images', () => {
      render(<PropertyDetail property={fullProperty} />);
      const img = screen.getByAltText('Property view 1');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('handles no images gracefully', () => {
      render(<PropertyDetail property={minimalProperty} />);
      const container = screen.getByTestId('images');
      expect(container.children).toHaveLength(0);
    });
  });

  // ─── Description ─────────────────────────────────────
  describe('description', () => {
    it('renders description heading', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('renders description text', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText(/stunning waterfront villa/)).toBeInTheDocument();
    });
  });

  // ─── Basic Info ──────────────────────────────────────
  describe('basic info', () => {
    it('renders Basic Information heading', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Basic Information')).toBeInTheDocument();
    });

    it('shows bedroom count', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('shows bathroom count', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('6')).toBeInTheDocument();
    });

    it('shows area in sqft', () => {
      render(<PropertyDetail property={fullProperty} />);
      const items = screen.getAllByText(/8500 sq\.ft/);
      expect(items.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ─── Features ────────────────────────────────────────
  describe('features', () => {
    it('renders Features heading', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Features')).toBeInTheDocument();
    });

    it('shows balcony as Yes', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    it('shows parking spaces', () => {
      render(<PropertyDetail property={fullProperty} />);
      const parkingLabel = screen.getByText('Parking Spaces:').closest('li');
      expect(parkingLabel).toHaveTextContent('3');
    });

    it('shows kitchen type', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Open')).toBeInTheDocument();
    });

    it('shows condition', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Brand New')).toBeInTheDocument();
    });

    it('shows No when balcony is false', () => {
      const prop = { ...fullProperty, features: { ...fullProperty.features, balcony: false } };
      render(<PropertyDetail property={prop} />);
      expect(screen.getByText('No')).toBeInTheDocument();
    });
  });

  // ─── Specifications ──────────────────────────────────
  describe('specifications', () => {
    it('renders Building Specifications heading', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Building Specifications')).toBeInTheDocument();
    });

    it('shows build year', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('shows total floors', () => {
      render(<PropertyDetail property={fullProperty} />);
      // 3 also in parking, match the label
      const specList = screen.getByText('Total Floors:').closest('li');
      expect(specList).toHaveTextContent('3');
    });
  });

  // ─── Amenities ───────────────────────────────────────
  describe('amenities', () => {
    it('renders Amenities heading', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Amenities')).toBeInTheDocument();
    });

    it('renders all amenity tags', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getAllByTestId('amenity-tag')).toHaveLength(4);
    });

    it('shows Swimming Pool amenity', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Swimming Pool')).toBeInTheDocument();
    });

    it('handles no amenities gracefully', () => {
      render(<PropertyDetail property={minimalProperty} />);
      expect(screen.getByTestId('amenities-grid').children).toHaveLength(0);
    });
  });

  // ─── Location ────────────────────────────────────────
  describe('location', () => {
    it('renders Location heading', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByText('Location')).toBeInTheDocument();
    });

    it('renders PropertyMap with location', () => {
      render(<PropertyDetail property={fullProperty} />);
      expect(screen.getByTestId('property-map')).toHaveTextContent('Palm Jumeirah, Dubai');
    });
  });
});
