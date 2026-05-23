/**
 * ResponsiveImage type definitions
 */

export interface ImageSource {
  /** Image URL */
  src: string;
  /** Width descriptor (e.g., 320, 640, 1024) */
  width: number;
  /** Optional media type (e.g., 'image/webp') */
  type?: string;
}

export interface ResponsiveImageProps {
  /** Primary image source URL */
  src: string;

  /** Alt text for accessibility (required) */
  alt: string;

  /** Intrinsic width (helps prevent CLS) */
  width?: number;

  /** Intrinsic height (helps prevent CLS) */
  height?: number;

  /**
   * Responsive sizes attribute
   * @example "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
   */
  sizes?: string;

  /**
   * srcset entries for responsive loading.
   * If not provided, falls back to src only.
   * @example [{ src: '/img/sm.jpg', width: 320 }, { src: '/img/lg.jpg', width: 1024 }]
   */
  srcSet?: ImageSource[];

  /**
   * Optional WebP srcset entries (rendered via <picture> + <source>)
   * @example [{ src: '/img/sm.webp', width: 320 }, { src: '/img/lg.webp', width: 1024 }]
   */
  webpSrcSet?: ImageSource[];

  /** Fallback image URL on error (defaults to placeholder SVG) */
  fallbackSrc?: string;

  /** CSS object-fit property */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

  /** CSS object-position */
  objectPosition?: string;

  /** Aspect ratio (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;

  /** Border radius (e.g., "8px", "50%") */
  borderRadius?: string;

  /** Whether to eager-load instead of lazy-load */
  priority?: boolean;

  /** CSS class name for the container */
  className?: string;

  /** Inline styles for the container */
  style?: React.CSSProperties;

  /** Callback when image loads successfully */
  onLoad?: () => void;

  /** Callback when image fails to load */
  onError?: (error: Event) => void;

  /** Custom placeholder element (replaces default skeleton) */
  placeholder?: React.ReactNode;

  /** Show skeleton loading animation (default: true) */
  showSkeleton?: boolean;

  /** Intersection observer root margin for lazy loading (default: "200px") */
  rootMargin?: string;

  /**
   * Quality hint for CDN/image processors (1-100)
   * Appended as ?q= param if the image URL supports it
   */
  quality?: number;
}
