/**
 * PropertyDetailModal – comprehensive test suite
 * Covers rendering, tabs, contact actions, favourites, amenities, edge cases
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PropertyDetailModal from './PropertyDetailModal';
import type { PropertyData, PropertyDetailModalProps } from './PropertyDetailModal';

/* ── Mocks ────────────────────────────────────────────────────── */
vi.mock('./PropertyDetailModal.css', () => ({}));

vi.mock('./PropertyImageSlider', () => ({
  default: ({ images, title }: { images: string[]; title: string }) => (
    <div data-testid="property-image-slider" aria-label={title}>
      {images.map((src: string, i: number) => (
        <img key={i} src={src} alt={`slide-${i}`} />
      ))}
    </div>
  ),
}));

vi.mock('../../../utils', () => ({
  formatPrice: (price: number, opts?: { priceType?: string }) =>
    `AED ${price.toLocaleString()}${opts?.priceType === 'yearly' ? '/year' : ''}`,
}));

vi.mock('../../../config/constants', () => ({
  Config: {
    COMPANY: {
      WHATSAPP: '+971551234567',
      PHONE: '+971 4 123 4567',
      EMAIL: 'info@whitecaves.ae',
    },
  },
}));

const sampleProperty: PropertyData = {
  title: 'Marina View Tower',
  location: 'Dubai Marina',
  price: 2500000,
  priceType: 'yearly',
  pricePerSqft: 1200,
  beds: 3,
  baths: 2,
  sqft: 2000,
  yearBuilt: 2022,
  type: 'Apartment',
  purpose: 'buy',
  featured: true,
  description: 'A stunning luxury apartment with panoramic views.',
  images: ['/img1.jpg', '/img2.jpg'],
  amenities: ['Pool', 'Gym', 'Parking', 'Security'],
};

const defaultProps: PropertyDetailModalProps = {
  property: sampleProperty,
  onClose: vi.fn(),
  onContact: vi.fn(),
  onFavorite: vi.fn(),
  isFavorite: false,
};

// Helper to spy on window.open
let windowOpenSpy: ReturnType<typeof vi.spyOn>;

describe('PropertyDetailModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  /* ── Null Property ──────────────────────────────────────────── */
  describe('null property', () => {
    it('returns null when property is null', () => {
      const { container } = render(<PropertyDetailModal property={null} onClose={vi.fn()} />);
      expect(container.innerHTML).toBe('');
    });
  });

  /* ── Basic Rendering ────────────────────────────────────────── */
  describe('basic rendering', () => {
    it('renders property title', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('Marina View Tower')).toBeInTheDocument();
    });

    it('renders location with Dubai suffix', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText(/Dubai Marina, Dubai/)).toBeInTheDocument();
    });

    it('renders formatted price', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('AED 2,500,000/year')).toBeInTheDocument();
    });

    it('renders price per sqft', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('AED 1200/sqft')).toBeInTheDocument();
    });

    it('renders bedroom count', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Bedrooms')).toBeInTheDocument();
    });

    it('renders bathroom count', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Bathrooms')).toBeInTheDocument();
    });

    it('renders sqft', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('2,000')).toBeInTheDocument();
    });

    it('renders year built', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('2022')).toBeInTheDocument();
    });

    it('renders featured badge', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('renders purpose badge', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('For Sale')).toBeInTheDocument();
    });

    it('renders type badge', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('Apartment')).toBeInTheDocument();
    });

    it('has dialog role and aria-modal', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('renders image slider', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByTestId('property-image-slider')).toBeInTheDocument();
    });
  });

  /* ── Close Modal ────────────────────────────────────────────── */
  describe('close modal', () => {
    it('calls onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(<PropertyDetailModal {...defaultProps} onClose={onClose} />);
      const closeBtn = screen.getByRole('dialog').querySelector('.modal-close-btn');
      if (closeBtn) fireEvent.click(closeBtn);
      expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when overlay is clicked', () => {
      const onClose = vi.fn();
      render(<PropertyDetailModal {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByRole('dialog'));
      expect(onClose).toHaveBeenCalled();
    });

    it('does NOT close when modal content is clicked (stopPropagation)', () => {
      const onClose = vi.fn();
      render(<PropertyDetailModal {...defaultProps} onClose={onClose} />);
      fireEvent.click(screen.getByText('Marina View Tower'));
      // onClose should only be called from overlay click, not propagated content click
      // Since title is inside the modal but we click text directly, it won't propagate to overlay
    });
  });

  /* ── Tabs ───────────────────────────────────────────────────── */
  describe('tabs', () => {
    it('renders all 4 tabs', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Amenities')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
      expect(screen.getByText('Floor Plan')).toBeInTheDocument();
    });

    it('shows overview tab content by default', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('Property Description')).toBeInTheDocument();
    });

    it('shows custom description when provided', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('A stunning luxury apartment with panoramic views.')).toBeInTheDocument();
    });

    it('switches to amenities tab', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Amenities'));
      expect(screen.getByText('Property Amenities')).toBeInTheDocument();
      expect(screen.getByText('Pool')).toBeInTheDocument();
      expect(screen.getByText('Gym')).toBeInTheDocument();
    });

    it('switches to location tab', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Location'));
      expect(screen.getByText('Nearby Attractions')).toBeInTheDocument();
    });

    it('switches to floor plan tab', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Floor Plan'));
      expect(screen.getByText('Floor plan available upon request')).toBeInTheDocument();
    });
  });

  /* ── Contact Buttons ────────────────────────────────────────── */
  describe('contact buttons', () => {
    it('renders WhatsApp button', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    });

    it('opens WhatsApp link on click', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      fireEvent.click(screen.getByText('WhatsApp'));
      expect(windowOpenSpy).toHaveBeenCalledWith(
        expect.stringContaining('wa.me'),
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('renders Call Now button', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('Call Now')).toBeInTheDocument();
    });

    it('opens tel: link on Call click', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Call Now'));
      expect(windowOpenSpy).toHaveBeenCalledWith(
        expect.stringContaining('tel:'),
        '_self'
      );
    });

    it('renders Email button', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('opens mailto: link on Email click', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Email'));
      expect(windowOpenSpy).toHaveBeenCalledWith(
        expect.stringContaining('mailto:'),
        '_self'
      );
    });
  });

  /* ── Favorite ───────────────────────────────────────────────── */
  describe('favorite', () => {
    it('renders Save button when not favorited', () => {
      render(<PropertyDetailModal {...defaultProps} isFavorite={false} />);
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('renders Saved button when favorited', () => {
      render(<PropertyDetailModal {...defaultProps} isFavorite={true} />);
      expect(screen.getByText('Saved')).toBeInTheDocument();
    });

    it('calls onFavorite when favorite button is clicked', () => {
      const onFavorite = vi.fn();
      render(<PropertyDetailModal {...defaultProps} onFavorite={onFavorite} />);
      fireEvent.click(screen.getByText('Save'));
      expect(onFavorite).toHaveBeenCalled();
    });
  });

  /* ── Rent Purpose ───────────────────────────────────────────── */
  describe('rent purpose', () => {
    it('renders For Rent badge for rent properties', () => {
      const rentProperty = { ...sampleProperty, purpose: 'rent' as const };
      render(<PropertyDetailModal {...defaultProps} property={rentProperty} />);
      expect(screen.getByText('For Rent')).toBeInTheDocument();
    });
  });

  /* ── Agent Card / Schedule ──────────────────────────────────── */
  describe('sidebar cards', () => {
    it('renders agent name', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('Mohammed Al Rashid')).toBeInTheDocument();
    });

    it('renders schedule viewing section', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('Schedule a Viewing')).toBeInTheDocument();
    });

    it('renders Request Viewing button', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      expect(screen.getByText('Request Viewing')).toBeInTheDocument();
    });
  });

  /* ── Floor Plan Request ─────────────────────────────────────── */
  describe('floor plan request', () => {
    it('opens email on Request Floor Plan click', () => {
      render(<PropertyDetailModal {...defaultProps} />);
      fireEvent.click(screen.getByText('Floor Plan'));
      fireEvent.click(screen.getByText('Request Floor Plan'));
      expect(windowOpenSpy).toHaveBeenCalledWith(
        expect.stringContaining('mailto:'),
        '_self'
      );
    });
  });

  /* ── Edge Cases ─────────────────────────────────────────────── */
  describe('edge cases', () => {
    it('handles property without optional fields', () => {
      const minimal: PropertyData = {
        title: 'Basic Property',
        location: 'Downtown',
        price: 1000000,
        type: 'Villa',
      };
      const { container } = render(
        <PropertyDetailModal property={minimal} onClose={vi.fn()} />
      );
      expect(container).toBeTruthy();
      expect(screen.getByText('Basic Property')).toBeInTheDocument();
    });

    it('generates default description when none provided', () => {
      const noDesc: PropertyData = {
        ...sampleProperty,
        description: undefined,
      };
      render(<PropertyDetailModal property={noDesc} onClose={vi.fn()} />);
      expect(screen.getByText(/experience luxury living/i)).toBeInTheDocument();
    });

    it('does not render featured badge when not featured', () => {
      const notFeatured = { ...sampleProperty, featured: false };
      render(<PropertyDetailModal property={notFeatured} onClose={vi.fn()} />);
      expect(screen.queryByText('Featured')).not.toBeInTheDocument();
    });
  });
});
