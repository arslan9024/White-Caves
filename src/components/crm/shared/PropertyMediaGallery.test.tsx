/**
 * PropertyMediaGallery – comprehensive test suite
 * Covers gallery rendering, navigation, thumbnails, fullscreen, empty state,
 * plus PropertySpecsGrid and PropertyDetailContainer
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PropertyMediaGallery, { PropertySpecsGrid, PropertyDetailContainer } from './PropertyMediaGallery';

/* ── Mock styled-components (PropertyComponents.styles) ─────── */
vi.mock('./PropertyComponents.styles', () => {
  const el = (name: string, tag = 'div') => {
    const C = ({ children, onClick, className, style, src, alt, role }: any) => {
      if (tag === 'img') {
        return <img data-testid={name} src={src} alt={alt} onClick={onClick} />;
      }
      if (tag === 'button') {
        return <button data-testid={name} onClick={onClick} className={className}>{children}</button>;
      }
      return <div data-testid={name} onClick={onClick} className={className} style={style} role={role}>{children}</div>;
    };
    C.displayName = name;
    return C;
  };
  return {
    PropertyGallery: el('PropertyGallery'),
    GalleryMain: el('GalleryMain'),
    GalleryImage: el('GalleryImage', 'img'),
    GalleryNav: ({ children, onClick, ...rest }: any) => <button data-testid={`GalleryNav-${rest.$position}`} onClick={onClick}>{children}</button>,
    FullscreenBtn: el('FullscreenBtn', 'button'),
    ImageCounter: el('ImageCounter'),
    GalleryThumbnails: el('GalleryThumbnails'),
    Thumbnail: ({ children, onClick, $active, $isMore, ...rest }: any) => (
      <button data-testid={$isMore ? 'ThumbnailMore' : 'Thumbnail'} onClick={onClick} data-active={$active}>{children}</button>
    ),
    FullscreenOverlay: ({ children, onClick, role, ...rest }: any) => <div data-testid="FullscreenOverlay" onClick={onClick} role={role}>{children}</div>,
    CloseFullscreenBtn: el('CloseFullscreenBtn', 'button'),
    FullscreenNav: ({ children, onClick, ...rest }: any) => <button data-testid={`FullscreenNav-${rest.$position}`} onClick={onClick}>{children}</button>,
    // PropertySpecsGrid & PropertyDetailContainer styled-components
    PropertySpecsGrid: el('PropertySpecsGrid'),
    SpecItem: el('SpecItem'),
    SpecContent: el('SpecContent'),
    SpecValue: el('SpecValue'),
    SpecLabel: el('SpecLabel'),
    PropertyDetailContainer: el('PropertyDetailContainer'),
    DetailHeader: el('DetailHeader'),
    HeaderInfo: el('HeaderInfo'),
    PropertyAddress: el('PropertyAddress'),
    HeaderPrice: el('HeaderPrice'),
    PriceLabel: el('PriceLabel'),
    PriceValue: el('PriceValue'),
    CloseBtn: el('CloseBtn', 'button'),
    DetailSection: el('DetailSection'),
    OwnerCard: el('OwnerCard'),
    OwnerAvatar: el('OwnerAvatar'),
    OwnerDetails: el('OwnerDetails'),
    OwnerName: el('OwnerName'),
    OwnerContact: el('OwnerContact'),
    FinancialGrid: el('FinancialGrid'),
    FinancialItem: el('FinancialItem'),
    FinLabel: el('FinLabel'),
    FinValue: el('FinValue'),
    DescriptionSection: el('DescriptionSection'),
  };
});

describe('PropertyMediaGallery', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const images = [
    'https://example.com/img1.jpg',
    'https://example.com/img2.jpg',
    'https://example.com/img3.jpg',
  ];

  /* ── Empty state ────────────────────────────────────────────── */
  describe('empty state', () => {
    it('renders empty message when no images', () => {
      render(<PropertyMediaGallery images={[]} />);
      expect(screen.getByText('No images available')).toBeInTheDocument();
    });

    it('renders empty message with undefined images', () => {
      render(<PropertyMediaGallery />);
      expect(screen.getByText('No images available')).toBeInTheDocument();
    });
  });

  /* ── Basic rendering ────────────────────────────────────────── */
  describe('rendering', () => {
    it('renders gallery with images', () => {
      render(<PropertyMediaGallery images={images} title="Test Villa" />);
      const img = screen.getByTestId('GalleryImage');
      expect(img).toHaveAttribute('src', images[0]);
    });

    it('renders image counter', () => {
      render(<PropertyMediaGallery images={images} />);
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('renders navigation buttons for multiple images', () => {
      render(<PropertyMediaGallery images={images} />);
      expect(screen.getByTestId('GalleryNav-prev')).toBeInTheDocument();
      expect(screen.getByTestId('GalleryNav-next')).toBeInTheDocument();
    });

    it('does not render nav buttons for single image', () => {
      render(<PropertyMediaGallery images={[images[0]]} />);
      expect(screen.queryByTestId('GalleryNav-prev')).not.toBeInTheDocument();
    });
  });

  /* ── Navigation ─────────────────────────────────────────────── */
  describe('navigation', () => {
    it('moves to next image', () => {
      render(<PropertyMediaGallery images={images} />);
      fireEvent.click(screen.getByTestId('GalleryNav-next'));
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('moves to previous image', () => {
      render(<PropertyMediaGallery images={images} />);
      fireEvent.click(screen.getByTestId('GalleryNav-next'));
      fireEvent.click(screen.getByTestId('GalleryNav-prev'));
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('wraps to last image when pressing prev on first', () => {
      render(<PropertyMediaGallery images={images} />);
      fireEvent.click(screen.getByTestId('GalleryNav-prev'));
      expect(screen.getByText('3 / 3')).toBeInTheDocument();
    });

    it('wraps to first image when pressing next on last', () => {
      render(<PropertyMediaGallery images={images} />);
      fireEvent.click(screen.getByTestId('GalleryNav-next'));
      fireEvent.click(screen.getByTestId('GalleryNav-next'));
      fireEvent.click(screen.getByTestId('GalleryNav-next'));
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });
  });

  /* ── Thumbnails ─────────────────────────────────────────────── */
  describe('thumbnails', () => {
    it('renders thumbnails for multiple images', () => {
      render(<PropertyMediaGallery images={images} showThumbnails />);
      const thumbs = screen.getAllByTestId('Thumbnail');
      expect(thumbs.length).toBe(3);
    });

    it('hides thumbnails when showThumbnails=false', () => {
      render(<PropertyMediaGallery images={images} showThumbnails={false} />);
      expect(screen.queryByTestId('Thumbnail')).not.toBeInTheDocument();
    });

    it('shows +N indicator when more than maxThumbnails', () => {
      const manyImages = Array.from({ length: 8 }, (_, i) => `https://example.com/img${i}.jpg`);
      render(<PropertyMediaGallery images={manyImages} maxThumbnails={5} />);
      expect(screen.getByText('+3')).toBeInTheDocument();
    });

    it('clicking thumbnail changes current image', () => {
      render(<PropertyMediaGallery images={images} />);
      const thumbs = screen.getAllByTestId('Thumbnail');
      fireEvent.click(thumbs[2]);
      expect(screen.getByText('3 / 3')).toBeInTheDocument();
    });
  });

  /* ── Fullscreen ─────────────────────────────────────────────── */
  describe('fullscreen', () => {
    it('opens fullscreen overlay on button click', () => {
      render(<PropertyMediaGallery images={images} title="Test" />);
      fireEvent.click(screen.getByTestId('FullscreenBtn'));
      expect(screen.getByTestId('FullscreenOverlay')).toBeInTheDocument();
    });

    it('closes fullscreen on overlay click', () => {
      render(<PropertyMediaGallery images={images} />);
      fireEvent.click(screen.getByTestId('FullscreenBtn'));
      fireEvent.click(screen.getByTestId('FullscreenOverlay'));
      expect(screen.queryByTestId('FullscreenOverlay')).not.toBeInTheDocument();
    });

    it('renders fullscreen navigation arrows', () => {
      render(<PropertyMediaGallery images={images} />);
      fireEvent.click(screen.getByTestId('FullscreenBtn'));
      expect(screen.getByTestId('FullscreenNav-prev')).toBeInTheDocument();
      expect(screen.getByTestId('FullscreenNav-next')).toBeInTheDocument();
    });

    it('close button closes fullscreen', () => {
      render(<PropertyMediaGallery images={images} />);
      fireEvent.click(screen.getByTestId('FullscreenBtn'));
      fireEvent.click(screen.getByTestId('CloseFullscreenBtn'));
      expect(screen.queryByTestId('FullscreenOverlay')).not.toBeInTheDocument();
    });
  });

  /* ── Object image support ───────────────────────────────────── */
  describe('object images', () => {
    it('handles MediaImage objects with url property', () => {
      const objImages = [{ url: 'https://example.com/obj1.jpg' }, { url: 'https://example.com/obj2.jpg' }];
      render(<PropertyMediaGallery images={objImages} />);
      const img = screen.getByTestId('GalleryImage');
      expect(img).toHaveAttribute('src', 'https://example.com/obj1.jpg');
    });
  });
});

/* ── PropertySpecsGrid ────────────────────────────────────────── */
describe('PropertySpecsGrid', () => {
  it('returns null when no property', () => {
    const { container } = render(<PropertySpecsGrid property={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders spec items for provided values', () => {
    const property = {
      bedrooms: 3,
      bathrooms: 2,
      area: 1500,
      type: 'Villa',
      location: 'Dubai Marina',
    };
    render(<PropertySpecsGrid property={property} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Bedrooms')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Bathrooms')).toBeInTheDocument();
    expect(screen.getByText('1,500 sqft')).toBeInTheDocument();
    expect(screen.getByText('Villa')).toBeInTheDocument();
    expect(screen.getByText('Dubai Marina')).toBeInTheDocument();
  });

  it('omits specs with no value', () => {
    const property = { bedrooms: 2, type: 'Apartment' };
    render(<PropertySpecsGrid property={property} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.queryByText('Bathrooms')).not.toBeInTheDocument();
  });
});

/* ── PropertyDetailContainer ──────────────────────────────────── */
describe('PropertyDetailContainer', () => {
  const fullProperty = {
    title: 'Luxury Penthouse',
    location: 'Downtown Dubai',
    purpose: 'For Sale',
    price: 5000000,
    bedrooms: 4,
    bathrooms: 3,
    area: 3500,
    type: 'Penthouse',
    commission: 2,
    serviceCharge: 25000,
    description: 'Stunning views of Burj Khalifa.',
    images: ['https://example.com/p1.jpg', 'https://example.com/p2.jpg'],
    owner: {
      name: 'John Smith',
      phone: '+971501234567',
      email: 'john@example.com',
    },
  };

  it('returns null when no property', () => {
    const { container } = render(<PropertyDetailContainer property={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders property title', () => {
    render(<PropertyDetailContainer property={fullProperty} />);
    expect(screen.getByText('Luxury Penthouse')).toBeInTheDocument();
  });

  it('renders price', () => {
    render(<PropertyDetailContainer property={fullProperty} />);
    const priceElements = screen.getAllByText('AED 5,000,000');
    expect(priceElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders owner info when showOwnerInfo=true', () => {
    render(<PropertyDetailContainer property={fullProperty} showOwnerInfo />);
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('+971501234567')).toBeInTheDocument();
  });

  it('renders financial details when showFinancials=true', () => {
    render(<PropertyDetailContainer property={fullProperty} showFinancials />);
    expect(screen.getByText('2%')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<PropertyDetailContainer property={fullProperty} />);
    expect(screen.getByText('Stunning views of Burj Khalifa.')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<PropertyDetailContainer property={fullProperty} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('CloseBtn'));
    expect(onClose).toHaveBeenCalled();
  });
});
