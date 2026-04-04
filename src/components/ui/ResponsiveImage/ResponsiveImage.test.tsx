/**
 * ResponsiveImage — Test Suite
 * ============================
 * Comprehensive tests covering rendering, accessibility, lazy loading,
 * error fallback, WebP picture element, quality param, and style props.
 *
 * 16 tests across 6 describe blocks.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

// ─── IntersectionObserver mock ────────────────────────────────
type IntersectionCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;
let observerCallback: IntersectionCallback;
let observerDisconnect: ReturnType<typeof vi.fn>;

const MockIntersectionObserver = vi.fn((cb: IntersectionCallback) => {
  observerCallback = cb;
  observerDisconnect = vi.fn();
  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: observerDisconnect,
  };
});

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});
afterEach(() => {
  vi.restoreAllMocks();
});

// Component under test (after mocking globals)
import { ResponsiveImage } from './ResponsiveImage';

// ─── Helpers ──────────────────────────────────────────────────
/** Simulate the image entering the viewport */
function triggerIntersection() {
  act(() => {
    observerCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
  });
}

/** Simulate image load event on the first <img> found */
function fireImgLoad() {
  const img = document.querySelector('img');
  if (img) fireEvent.load(img);
}

/** Simulate image error event on the first <img> found */
function fireImgError() {
  const img = document.querySelector('img');
  if (img) fireEvent.error(img);
}

// ──────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────

describe('ResponsiveImage', () => {
  describe('Rendering', () => {
    it('renders without crashing with minimal props', () => {
      const { container } = render(
        <ResponsiveImage src="/img/hero.jpg" alt="Hero image" />,
      );
      expect(container.firstChild).toBeTruthy();
    });

    it('renders img element when in viewport (lazy)', () => {
      render(<ResponsiveImage src="/img/hero.jpg" alt="Hero" />);
      // Before intersection — no img
      expect(document.querySelector('img')).toBeNull();

      triggerIntersection();
      expect(document.querySelector('img')).toBeTruthy();
    });

    it('renders img immediately when priority is true', () => {
      render(
        <ResponsiveImage src="/img/hero.jpg" alt="Hero" priority />,
      );
      // Priority = eager load, no IntersectionObserver needed
      const img = document.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('loading')).toBe('eager');
    });
  });

  describe('Accessibility', () => {
    it('passes alt text to the img element', () => {
      render(
        <ResponsiveImage src="/test.jpg" alt="A luxury villa" priority />,
      );
      expect(screen.getByAltText('A luxury villa')).toBeTruthy();
    });

    it('shows alt text in error fallback via aria-label', () => {
      render(
        <ResponsiveImage src="/broken.jpg" alt="Missing photo" priority />,
      );
      fireImgError();
      const fallback = screen.getByRole('img', { name: 'Missing photo' });
      expect(fallback).toBeTruthy();
    });
  });

  describe('Skeleton placeholder', () => {
    it('shows skeleton before image loads (default showSkeleton=true)', () => {
      const { container } = render(
        <ResponsiveImage src="/test.jpg" alt="Test" priority />,
      );
      // Skeleton is rendered as a sibling div before the img, positioned absolutely
      // It uses a shimmer animation. The img exists but is not yet loaded.
      const img = container.querySelector('img');
      expect(img).toBeTruthy();
      // There should be more than just the img — the skeleton div is also rendered
      const containerDiv = container.firstChild as HTMLElement;
      // Container has at least 2 children: skeleton + img (or picture)
      expect(containerDiv.children.length).toBeGreaterThanOrEqual(2);
    });

    it('hides skeleton when showSkeleton=false', () => {
      const { container } = render(
        <ResponsiveImage
          src="/test.jpg"
          alt="Test"
          priority
          showSkeleton={false}
        />,
      );
      const skeleton = container.querySelector('[class*="Skeleton"]');
      expect(skeleton).toBeNull();
    });
  });

  describe('Error fallback', () => {
    it('shows "Image unavailable" when image fails to load', () => {
      render(
        <ResponsiveImage src="/broken.jpg" alt="Broken" priority />,
      );
      fireImgError();
      expect(screen.getByText('Image unavailable')).toBeTruthy();
    });

    it('calls onError callback on image failure', () => {
      const onError = vi.fn();
      render(
        <ResponsiveImage
          src="/broken.jpg"
          alt="Broken"
          priority
          onError={onError}
        />,
      );
      fireImgError();
      // The hook tries fallbackSrc first; with no fallback it errors immediately
      expect(onError).toHaveBeenCalled();
    });

    it('tries fallbackSrc before entering error state', () => {
      render(
        <ResponsiveImage
          src="/broken.jpg"
          alt="FB Test"
          priority
          fallbackSrc="/fallback.jpg"
        />,
      );
      const img = document.querySelector('img') as HTMLImageElement;
      // Simulate first error — hook should swap to fallback
      fireEvent.error(img);
      expect(img.src).toContain('/fallback.jpg');
    });
  });

  describe('Responsive & WebP', () => {
    it('builds srcSet attribute from ImageSource array', () => {
      render(
        <ResponsiveImage
          src="/img/md.jpg"
          alt="Responsive"
          priority
          srcSet={[
            { src: '/img/sm.jpg', width: 320 },
            { src: '/img/lg.jpg', width: 1024 },
          ]}
          sizes="(max-width: 640px) 100vw, 50vw"
        />,
      );
      const img = document.querySelector('img') as HTMLImageElement;
      expect(img.srcset).toBe('/img/sm.jpg 320w, /img/lg.jpg 1024w');
      expect(img.sizes).toBe('(max-width: 640px) 100vw, 50vw');
    });

    it('renders <picture> with <source type="image/webp"> when webpSrcSet given', () => {
      const { container } = render(
        <ResponsiveImage
          src="/img/md.jpg"
          alt="WebP test"
          priority
          webpSrcSet={[
            { src: '/img/sm.webp', width: 320 },
            { src: '/img/lg.webp', width: 1024 },
          ]}
        />,
      );
      const picture = container.querySelector('picture');
      expect(picture).toBeTruthy();
      const source = picture?.querySelector('source[type="image/webp"]');
      expect(source).toBeTruthy();
      expect(source?.getAttribute('srcSet')).toBe(
        '/img/sm.webp 320w, /img/lg.webp 1024w',
      );
    });
  });

  describe('Quality & style props', () => {
    it('appends ?q= parameter to src when quality is set', () => {
      render(
        <ResponsiveImage
          src="/img/hero.jpg"
          alt="Quality test"
          priority
          quality={80}
        />,
      );
      const img = document.querySelector('img') as HTMLImageElement;
      expect(img.src).toContain('q=80');
    });

    it('appends &q= when src already has query params', () => {
      render(
        <ResponsiveImage
          src="/img/hero.jpg?w=800"
          alt="Quality test 2"
          priority
          quality={75}
        />,
      );
      const img = document.querySelector('img') as HTMLImageElement;
      expect(img.src).toContain('&q=75');
    });

    it('forwards className to container', () => {
      const { container } = render(
        <ResponsiveImage
          src="/t.jpg"
          alt="Class test"
          className="my-custom-class"
        />,
      );
      expect(container.querySelector('.my-custom-class')).toBeTruthy();
    });
  });
});
