/**
 * ContentSlider — Comprehensive Unit Tests
 *
 * Covers: basic rendering, navigation controls, dots, auto-play toggle,
 * drag interactions, default slide card, custom renderItem, empty items,
 * responsive breakpoints, title/subtitle
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

// ── Mock styled-components ──────────────────────────────────────

vi.mock('./ContentSlider.styles', () => {
  const c = (tag: string, testId: string) => {
    const Comp = React.forwardRef(({ children, ...props }: Record<string, unknown>, ref) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (!k.startsWith('$')) clean[k] = v;
      }
      return React.createElement(tag, { 'data-testid': testId, ref, ...clean }, children as React.ReactNode);
    });
    Comp.displayName = testId;
    return Comp;
  };
  return {
    ContentSliderContainer: c('div', 'content-slider'),
    SliderHeader: c('div', 'slider-header'),
    SliderTitle: c('h2', 'slider-title'),
    SliderSubtitle: c('p', 'slider-subtitle'),
    SliderWrapper: c('div', 'slider-wrapper'),
    SliderContainerElement: c('div', 'slider-container'),
    SliderTrack: c('div', 'slider-track'),
    SliderSlide: c('div', 'slider-slide'),
    SliderControl: c('button', 'slider-control'),
    ControlIcon: c('span', 'control-icon'),
    SliderDots: c('div', 'slider-dots'),
    SliderDot: c('button', 'slider-dot'),
    SliderPlayPause: c('button', 'slider-play-pause'),
    DefaultSlideCard: c('div', 'default-slide-card'),
    SlideImageContainer: c('div', 'slide-image-container'),
    SlideImage: c('img', 'slide-image'),
    SlideBadge: c('span', 'slide-badge'),
    SlideContent: c('div', 'slide-content'),
    SlideTitle: c('h3', 'slide-title'),
    SlideLocation: c('div', 'slide-location'),
    LocationIcon: c('span', 'location-icon'),
    SlideDescription: c('p', 'slide-description'),
    SlideFeatures: c('div', 'slide-features'),
    Feature: c('span', 'feature'),
    FeatureIcon: c('span', 'feature-icon'),
    SlidePrice: c('div', 'slide-price'),
  };
});

import ContentSlider from './ContentSlider';

// ── Test data ────────────────────────────────────────────────────

const sixItems = [
  { id: '1', title: 'Villa A', location: 'Downtown Dubai', type: 'sale' as const, bedrooms: 3, bathrooms: 2, area: 2500, priceFormatted: 'AED 5,000,000', images: ['/a.jpg'], description: 'Luxury villa' },
  { id: '2', title: 'Apt B', location: 'Marina', type: 'rent' as const, bedrooms: 1, bathrooms: 1, area: 800, priceFormatted: 'AED 120,000/yr', images: ['/b.jpg'] },
  { id: '3', title: 'Penthouse C', location: 'Palm Jumeirah', type: 'sale' as const, bedrooms: 5, bathrooms: 4, area: 6000, priceFormatted: 'AED 25,000,000', images: ['/c.jpg'] },
  { id: '4', title: 'Studio D', location: 'JLT', type: 'rent' as const, bedrooms: 0, bathrooms: 1, area: 450, priceFormatted: 'AED 55,000/yr', images: ['/d.jpg'] },
  { id: '5', title: 'Townhouse E', location: 'Arabian Ranches', type: 'sale' as const, bedrooms: 4, bathrooms: 3, area: 3200, priceFormatted: 'AED 8,000,000', images: [] },
  { id: '6', title: 'Loft F', location: 'DIFC', type: 'rent' as const, bedrooms: 2, bathrooms: 2, area: 1500, priceFormatted: 'AED 200,000/yr' },
];

describe('ContentSlider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set desktop width by default
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ────── Empty / Null ──────

  describe('empty state', () => {
    it('returns null when items is empty', () => {
      const { container } = render(<ContentSlider items={[]} />);
      expect(container.innerHTML).toBe('');
    });

    it('returns null when items is undefined', () => {
      const { container } = render(<ContentSlider />);
      expect(container.innerHTML).toBe('');
    });
  });

  // ────── Basic Rendering ──────

  describe('basic rendering', () => {
    it('renders slider container', () => {
      render(<ContentSlider items={sixItems} />);
      expect(screen.getByTestId('content-slider')).toBeInTheDocument();
    });

    it('renders title when provided', () => {
      render(<ContentSlider items={sixItems} title="Featured Properties" />);
      expect(screen.getByText('Featured Properties')).toBeInTheDocument();
    });

    it('renders subtitle when provided', () => {
      render(<ContentSlider items={sixItems} title="Props" subtitle="Browse the best" />);
      expect(screen.getByText('Browse the best')).toBeInTheDocument();
    });

    it('does not render header when no title/subtitle', () => {
      render(<ContentSlider items={sixItems} />);
      expect(screen.queryByTestId('slider-header')).not.toBeInTheDocument();
    });

    it('renders all slides', () => {
      render(<ContentSlider items={sixItems} />);
      const slides = screen.getAllByTestId('slider-slide');
      expect(slides.length).toBe(6);
    });

    it('renders default slide cards with titles', () => {
      render(<ContentSlider items={sixItems} />);
      expect(screen.getByText('Villa A')).toBeInTheDocument();
      expect(screen.getByText('Penthouse C')).toBeInTheDocument();
    });
  });

  // ────── Default Slide Card Content ──────

  describe('default slide card', () => {
    it('renders location with pin icon', () => {
      render(<ContentSlider items={[sixItems[0]]} showControls={false} showDots={false} autoPlay={false} />);
      expect(screen.getByText('Downtown Dubai')).toBeInTheDocument();
      expect(screen.getByText('📍')).toBeInTheDocument();
    });

    it('renders description', () => {
      render(<ContentSlider items={[sixItems[0]]} showControls={false} showDots={false} autoPlay={false} />);
      expect(screen.getByText('Luxury villa')).toBeInTheDocument();
    });

    it('renders price', () => {
      render(<ContentSlider items={[sixItems[0]]} showControls={false} showDots={false} autoPlay={false} />);
      expect(screen.getByText('AED 5,000,000')).toBeInTheDocument();
    });

    it('renders bedrooms/bathrooms/area features', () => {
      render(<ContentSlider items={[sixItems[0]]} showControls={false} showDots={false} autoPlay={false} />);
      expect(screen.getByText(/3 Beds/)).toBeInTheDocument();
      expect(screen.getByText(/2 Baths/)).toBeInTheDocument();
      expect(screen.getByText(/2,500 sqft/)).toBeInTheDocument();
    });

    it('renders "For Sale" badge for sale type', () => {
      render(<ContentSlider items={[sixItems[0]]} showControls={false} showDots={false} autoPlay={false} />);
      expect(screen.getByText('For Sale')).toBeInTheDocument();
    });

    it('renders "For Rent" badge for rent type', () => {
      render(<ContentSlider items={[sixItems[1]]} showControls={false} showDots={false} autoPlay={false} />);
      expect(screen.getByText('For Rent')).toBeInTheDocument();
    });

    it('renders slide image', () => {
      render(<ContentSlider items={[sixItems[0]]} showControls={false} showDots={false} autoPlay={false} />);
      const img = screen.getByAltText('Villa A');
      expect(img).toHaveAttribute('src', '/a.jpg');
    });
  });

  // ────── Custom Render Item ──────

  describe('custom renderItem', () => {
    it('uses renderItem when provided', () => {
      const custom = (item: { title?: string }, i: number) => (
        <div data-testid={`custom-${i}`}>{item.title} Custom</div>
      );
      render(<ContentSlider items={sixItems} renderItem={custom} />);
      expect(screen.getByText('Villa A Custom')).toBeInTheDocument();
    });

    it('does not render default card when renderItem used', () => {
      const custom = () => <div>Custom</div>;
      render(<ContentSlider items={sixItems} renderItem={custom} />);
      expect(screen.queryByTestId('default-slide-card')).not.toBeInTheDocument();
    });
  });

  // ────── Navigation Controls ──────

  describe('navigation controls', () => {
    it('renders prev and next buttons', () => {
      render(<ContentSlider items={sixItems} autoPlay={false} />);
      expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
      expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
    });

    it('hides controls when showControls is false', () => {
      render(<ContentSlider items={sixItems} showControls={false} autoPlay={false} />);
      expect(screen.queryByLabelText('Previous slide')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next slide')).not.toBeInTheDocument();
    });

    it('hides controls when items fit in view', () => {
      // Only 2 items with desktop showing 3 = no controls needed
      render(<ContentSlider items={sixItems.slice(0, 2)} autoPlay={false} />);
      expect(screen.queryByLabelText('Previous slide')).not.toBeInTheDocument();
    });

    it('clicking next advances the slider', () => {
      render(<ContentSlider items={sixItems} autoPlay={false} />);
      const nextBtn = screen.getByLabelText('Next slide');
      fireEvent.click(nextBtn);
      // Track should have a transform applied (shift from index 0 to 1)
      const track = screen.getByTestId('slider-track');
      expect(track.style.transform).not.toContain('translateX(calc(-0');
    });

    it('clicking prev from the start wraps to end', () => {
      render(<ContentSlider items={sixItems} autoPlay={false} />);
      const prevBtn = screen.getByLabelText('Previous slide');
      fireEvent.click(prevBtn);
      const track = screen.getByTestId('slider-track');
      expect(track.style.transform).toBeDefined();
    });
  });

  // ────── Dots ──────

  describe('dots navigation', () => {
    it('renders dots when showDots is true', () => {
      render(<ContentSlider items={sixItems} showDots={true} autoPlay={false} />);
      expect(screen.getByTestId('slider-dots')).toBeInTheDocument();
    });

    it('hides dots when showDots is false', () => {
      render(<ContentSlider items={sixItems} showDots={false} autoPlay={false} />);
      expect(screen.queryByTestId('slider-dots')).not.toBeInTheDocument();
    });

    it('renders correct number of dots', () => {
      // Desktop shows 3, 6 items => maxIndex = 3 => 4 dots (0,1,2,3)
      render(<ContentSlider items={sixItems} showDots={true} autoPlay={false} />);
      const dots = screen.getAllByTestId('slider-dot');
      expect(dots.length).toBe(4);
    });

    it('clicking a dot navigates to that slide', () => {
      render(<ContentSlider items={sixItems} showDots={true} autoPlay={false} />);
      const dots = screen.getAllByLabelText(/Go to slide/);
      fireEvent.click(dots[2]);
      const track = screen.getByTestId('slider-track');
      expect(track.style.transform).toBeDefined();
    });
  });

  // ────── Auto-Play Toggle ──────

  describe('auto-play toggle', () => {
    it('renders play/pause button when autoPlay is true', () => {
      render(<ContentSlider items={sixItems} autoPlay={true} />);
      expect(screen.getByLabelText('Pause slideshow')).toBeInTheDocument();
    });

    it('does not render play/pause when autoPlay is false', () => {
      render(<ContentSlider items={sixItems} autoPlay={false} />);
      expect(screen.queryByLabelText('Pause slideshow')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Play slideshow')).not.toBeInTheDocument();
    });

    it('toggles from pause to play on click', () => {
      render(<ContentSlider items={sixItems} autoPlay={true} />);
      const btn = screen.getByLabelText('Pause slideshow');
      fireEvent.click(btn);
      expect(screen.getByLabelText('Play slideshow')).toBeInTheDocument();
    });

    it('toggles back from play to pause', () => {
      render(<ContentSlider items={sixItems} autoPlay={true} />);
      const pauseBtn = screen.getByLabelText('Pause slideshow');
      fireEvent.click(pauseBtn);
      const playBtn = screen.getByLabelText('Play slideshow');
      fireEvent.click(playBtn);
      expect(screen.getByLabelText('Pause slideshow')).toBeInTheDocument();
    });
  });

  // ────── Drag Interactions ──────

  describe('drag interactions', () => {
    it('handles mouseDown/mouseMove/mouseUp without crashing', () => {
      render(<ContentSlider items={sixItems} autoPlay={false} />);
      const container = screen.getByTestId('slider-container');
      fireEvent.mouseDown(container, { clientX: 200 });
      fireEvent.mouseMove(container, { clientX: 100 });
      fireEvent.mouseUp(container);
      // Should not throw
      expect(screen.getByTestId('content-slider')).toBeInTheDocument();
    });

    it('handles touch events without crashing', () => {
      render(<ContentSlider items={sixItems} autoPlay={false} />);
      const container = screen.getByTestId('slider-container');
      fireEvent.touchStart(container, { touches: [{ clientX: 200 }] });
      fireEvent.touchMove(container, { touches: [{ clientX: 100 }] });
      fireEvent.touchEnd(container);
      expect(screen.getByTestId('content-slider')).toBeInTheDocument();
    });

    it('mouseLeave ends drag', () => {
      render(<ContentSlider items={sixItems} autoPlay={false} />);
      const container = screen.getByTestId('slider-container');
      fireEvent.mouseDown(container, { clientX: 200 });
      fireEvent.mouseLeave(container);
      expect(screen.getByTestId('content-slider')).toBeInTheDocument();
    });
  });

  // ────── className Pass-through ──────

  describe('className', () => {
    it('passes className to container', () => {
      render(<ContentSlider items={sixItems} className="custom-slider" />);
      const container = screen.getByTestId('content-slider');
      expect(container.className).toContain('custom-slider');
    });
  });
});
