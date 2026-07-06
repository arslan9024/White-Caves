/**
 * Image optimization utilities for modern formats (AVIF, WebP)
 * Generates optimized image URLs with format support detection
 */

export interface ImageFormatOptions {
  /** Base image URL (Unsplash, CDN, local path) */
  baseUrl: string;
  /** Image width for optimization */
  width?: number;
  /** Image height for optimization */
  height?: number;
  /** Quality level 1-100 */
  quality?: number;
  /** Whether URL already has query parameters */
  hasParams?: boolean;
}

export interface PictureSourceElement {
  /** AVIF format srcSet URL */
  avifSrc: string;
  /** WebP format srcSet URL */
  webpSrc: string;
  /** Fallback JPEG/PNG URL */
  fallbackSrc: string;
}

/**
 * Generate optimized image URL for Unsplash CDN with specified format
 * Supports: AVIF, WebP, JPEG
 * 
 * @param baseUrl - Original Unsplash or CDN URL
 * @param format - Target format: 'avif' | 'webp' | 'jpeg'
 * @param width - Image width in pixels
 * @returns Optimized URL
 */
export function generateOptimizedImageUrl(
  baseUrl: string,
  format: 'avif' | 'webp' | 'jpeg' = 'webp',
  width: number = 800,
): string {
  if (!baseUrl) return '';
  
  // Skip if URL already has format parameter
  if (baseUrl.includes('fm=')) return baseUrl;
  
  // Build format parameter
  const formatParam = `fm=${format}`;
  const widthParam = `w=${width}`;
  const qualityParam = 'q=75'; // Default quality
  
  // Determine separator
  const separator = baseUrl.includes('?') ? '&' : '?';
  
  return `${baseUrl}${separator}${formatParam}&${widthParam}&${qualityParam}`;
}

/**
 * Generate HTML5 picture element sources for responsive image loading
 * Provides best format per browser capability (AVIF→WebP→JPEG fallback)
 * 
 * @param options - Image configuration
 * @returns Object with srcSet URLs for each format
 */
export function generatePictureSources(
  options: ImageFormatOptions,
): PictureSourceElement {
  const {
    baseUrl,
    width = 800,
    height = 600,
    quality = 75,
    hasParams = false,
  } = options;

  if (!baseUrl) {
    return {
      avifSrc: '',
      webpSrc: '',
      fallbackSrc: '',
    };
  }

  // Skip processing if already optimized
  if (baseUrl.includes('fm=')) {
    return {
      avifSrc: baseUrl,
      webpSrc: baseUrl,
      fallbackSrc: baseUrl,
    };
  }

  const separator = hasParams || baseUrl.includes('?') ? '&' : '?';
  const baseParams = `w=${width}&q=${quality}`;

  return {
    avifSrc: `${baseUrl}${separator}fm=avif&${baseParams}`,
    webpSrc: `${baseUrl}${separator}fm=webp&${baseParams}`,
    fallbackSrc: `${baseUrl}${separator}fm=jpg&${baseParams}`,
  };
}

/**
 * Generate srcSet for responsive images at multiple widths
 * 
 * @param baseUrl - Original image URL
 * @param format - Target format
 * @param widths - Array of widths to generate [480, 800, 1200]
 * @returns srcSet string for use in img srcset attribute
 */
export function generateResponsiveSrcSet(
  baseUrl: string,
  format: 'avif' | 'webp' | 'jpeg',
  widths: number[] = [480, 800, 1200],
): string {
  if (!baseUrl) return '';

  return widths
    .map(w => {
      const url = generateOptimizedImageUrl(baseUrl, format, w);
      return `${url} ${w}w`;
    })
    .join(', ');
}

/**
 * Detect browser support for image formats
 * Returns CSS media query conditions for use in picture elements
 */
export const browserFormatSupport = {
  /** Media query for AVIF support (Chrome 85+, Firefox 93+, Opera 71+) */
  avif: 'image/avif',
  /** Media query for WebP support (Chrome 23+, Edge 18+, Firefox 65+, Opera 11.6+) */
  webp: 'image/webp',
  /** Fallback always supported */
  jpeg: 'image/jpeg',
};

/**
 * Enhance existing image URL with performance attributes
 * Useful for adding lazy-loading + fetchpriority to dynamic images
 * 
 * @param src - Image source URL
 * @param options - Configuration for lazy/priority loading
 * @returns Object with recommended img attributes
 */
export interface OptimizedImageAttributes {
  src: string;
  srcSet?: string;
  loading: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  width?: number;
  height?: number;
  decoding?: 'async' | 'sync' | 'auto';
}

export function getOptimizedImageAttributes(
  src: string,
  {
    priority = false,
    lazy = true,
    width,
    height,
  }: {
    priority?: boolean;
    lazy?: boolean;
    width?: number;
    height?: number;
  },
): OptimizedImageAttributes {
  return {
    src,
    loading: priority || !lazy ? 'eager' : 'lazy',
    fetchPriority: priority ? 'high' : 'auto',
    width,
    height,
    decoding: 'async',
  };
}
