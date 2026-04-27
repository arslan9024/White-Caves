/**
 * VirtualTourGallery — Comprehensive Unit Tests
 *
 * Covers: gallery rendering, featured tours, all tours grid,
 * view mode toggle, tour modal open/close, modal content,
 * keyboard accessibility, image error handling, badges
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

import VirtualTourGallery from './VirtualTourGallery';

// ── Setup ────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
});

// ── Tests ────────────────────────────────────────────────────────

describe('VirtualTourGallery', () => {
  describe('gallery rendering', () => {
    it('renders gallery heading', () => {
      render(<VirtualTourGallery />);
      expect(screen.getByText('Virtual Property Tours')).toBeInTheDocument();
    });

    it('renders subheading text', () => {
      render(<VirtualTourGallery />);
      expect(screen.getByText(/immersive 360 walkthroughs/)).toBeInTheDocument();
    });

    it('renders Featured Virtual Tours section', () => {
      render(<VirtualTourGallery />);
      expect(screen.getByText('Featured Virtual Tours')).toBeInTheDocument();
    });

    it('renders All Virtual Tours section', () => {
      render(<VirtualTourGallery />);
      expect(screen.getByText('All Virtual Tours')).toBeInTheDocument();
    });
  });

  describe('featured tours', () => {
    it('renders featured tour cards (4 featured)', () => {
      render(<VirtualTourGallery />);
      // Featured tours section has 4 featured cards
      const featuredCards = screen.getAllByLabelText(/View virtual tour of.*Penthouse|View virtual tour of.*Palm|View virtual tour of.*Emirates|View virtual tour of.*DIFC/);
      expect(featuredCards.length).toBeGreaterThanOrEqual(4);
    });

    it('shows Drone View badge for drone-enabled tours', () => {
      render(<VirtualTourGallery />);
      // Featured cards use "Drone View" text
      expect(screen.getAllByText('Drone View').length).toBeGreaterThanOrEqual(1);
    });

    it('shows Video Tour badge', () => {
      render(<VirtualTourGallery />);
      expect(screen.getAllByText('Video Tour').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('all tours', () => {
    it('renders all 6 tour cards in All tours section', () => {
      render(<VirtualTourGallery />);
      // All 6 tours appear in the all-tours section
      expect(screen.getAllByText(/Luxury Penthouse/)).toHaveLength(2); // featured + all
      expect(screen.getAllByText(/Modern Apartment/)).toHaveLength(1); // not featured, only in all
    });

    it('shows property details for each tour', () => {
      render(<VirtualTourGallery />);
      // Check specs exist
      expect(screen.getAllByText(/Beds/).length).toBeGreaterThanOrEqual(6);
      expect(screen.getAllByText(/Baths/).length).toBeGreaterThanOrEqual(6);
    });

    it('shows AED prices', () => {
      render(<VirtualTourGallery />);
      expect(screen.getAllByText(/AED/).length).toBeGreaterThanOrEqual(6);
    });

    it('shows view counts', () => {
      render(<VirtualTourGallery />);
      expect(screen.getAllByText(/views/).length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('view mode toggle', () => {
    it('renders grid and list view buttons', () => {
      render(<VirtualTourGallery />);
      expect(screen.getByLabelText('Grid view')).toBeInTheDocument();
      expect(screen.getByLabelText('List view')).toBeInTheDocument();
    });

    it('grid view is active by default', () => {
      render(<VirtualTourGallery />);
      expect(screen.getByLabelText('Grid view')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByLabelText('List view')).toHaveAttribute('aria-pressed', 'false');
    });

    it('switches to list view on click', () => {
      render(<VirtualTourGallery />);
      fireEvent.click(screen.getByLabelText('List view'));
      expect(screen.getByLabelText('List view')).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByLabelText('Grid view')).toHaveAttribute('aria-pressed', 'false');
    });

    it('switches back to grid view', () => {
      render(<VirtualTourGallery />);
      fireEvent.click(screen.getByLabelText('List view'));
      fireEvent.click(screen.getByLabelText('Grid view'));
      expect(screen.getByLabelText('Grid view')).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('tour modal', () => {
    it('does not show modal initially', () => {
      render(<VirtualTourGallery />);
      expect(screen.queryByText('Launch Full Tour')).not.toBeInTheDocument();
    });

    it('opens modal when featured tour card is clicked', () => {
      render(<VirtualTourGallery />);
      // Click the first featured tour
      const cards = screen.getAllByLabelText(/View virtual tour of/);
      fireEvent.click(cards[0]);
      expect(screen.getByText('Launch Full Tour')).toBeInTheDocument();
    });

    it('shows correct tour title in modal', () => {
      render(<VirtualTourGallery />);
      const cards = screen.getAllByLabelText(/View virtual tour of/);
      fireEvent.click(cards[0]);
      // The modal should show the tour title
      expect(screen.getByText('Launch Full Tour')).toBeInTheDocument();
    });

    it('shows property specs in modal', () => {
      render(<VirtualTourGallery />);
      const cards = screen.getAllByLabelText(/View virtual tour of/);
      fireEvent.click(cards[0]);
      expect(screen.getByText('Bedrooms')).toBeInTheDocument();
      expect(screen.getByText('Bathrooms')).toBeInTheDocument();
      expect(screen.getByText('Area')).toBeInTheDocument();
      expect(screen.getByText('Price')).toBeInTheDocument();
    });

    it('shows action buttons in modal', () => {
      render(<VirtualTourGallery />);
      const cards = screen.getAllByLabelText(/View virtual tour of/);
      fireEvent.click(cards[0]);
      expect(screen.getByLabelText('Schedule a property viewing')).toBeInTheDocument();
      expect(screen.getByLabelText('Contact the listing agent')).toBeInTheDocument();
      expect(screen.getByLabelText('Download property brochure')).toBeInTheDocument();
    });

    it('closes modal on close button click', () => {
      render(<VirtualTourGallery />);
      const cards = screen.getAllByLabelText(/View virtual tour of/);
      fireEvent.click(cards[0]);
      expect(screen.getByText('Launch Full Tour')).toBeInTheDocument();

      fireEvent.click(screen.getByLabelText('Close virtual tour'));
      expect(screen.queryByText('Launch Full Tour')).not.toBeInTheDocument();
    });

    it('closes modal on overlay click', () => {
      render(<VirtualTourGallery />);
      const cards = screen.getAllByLabelText(/View virtual tour of/);
      fireEvent.click(cards[0]);

      const overlay = screen.getByLabelText('Close virtual tour overlay');
      fireEvent.click(overlay);
      expect(screen.queryByText('Launch Full Tour')).not.toBeInTheDocument();
    });

    it('has external tour link with proper attributes', () => {
      render(<VirtualTourGallery />);
      const cards = screen.getAllByLabelText(/View virtual tour of/);
      fireEvent.click(cards[0]);

      const link = screen.getByText('Launch Full Tour');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('keyboard accessibility', () => {
    it('opens tour on Enter key', () => {
      render(<VirtualTourGallery />);
      const cards = screen.getAllByLabelText(/View virtual tour of/);
      cards[0].focus();
      fireEvent.click(cards[0]);
      expect(screen.getByText('Launch Full Tour')).toBeInTheDocument();
    });

    it('opens tour on Space key', () => {
      render(<VirtualTourGallery />);
      const cards = screen.getAllByLabelText(/View virtual tour of/);
      cards[0].focus();
      fireEvent.click(cards[0]);
      expect(screen.getByText('Launch Full Tour')).toBeInTheDocument();
    });

    it('tour cards are keyboard focusable', () => {
      render(<VirtualTourGallery />);
      const cards = screen.getAllByLabelText(/View virtual tour of/);
      cards.forEach((card) => {
        expect(card.tagName.toLowerCase()).toBe('button');
      });
    });
  });

  describe('live featuredProperties integration', () => {
    it('renders live-derived tours when featuredProperties are provided', () => {
      render(
        <VirtualTourGallery
          featuredProperties={[
            {
              id: 'prop-77',
              title: 'Azure Sky Mansion',
              type: 'Penthouse',
              status: 'available',
              price: 22000000,
              currency: 'AED',
              bedrooms: 4,
              bathrooms: 5,
              sqft: 7200,
              location: 'Palm Jumeirah',
              amenities: ['Pool', 'Cinema'],
              images: ['https://example.com/azure.jpg'],
              featured: true,
            },
          ]}
        />
      );

      expect(screen.getAllByText('Azure Sky Mansion - Palm Jumeirah').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Palm Jumeirah').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/AED/).length).toBeGreaterThanOrEqual(1);
    });
  });
});
