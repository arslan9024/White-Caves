import React, { memo } from 'react';
import type { ResponsiveImageProps, ImageSource } from './ResponsiveImage.types';
import { useImageLoader } from './useImageLoader';
import {
  ImageContainer,
  Skeleton,
  StyledImage,
  ErrorFallback,
} from './ResponsiveImage.styles';

// ─── Helpers ──────────────────────────────────────────────────

/** Build a srcset string from ImageSource entries */
function buildSrcSet(sources: ImageSource[]): string {
  return sources
    .map((s) => `${s.src} ${s.width}w`)
    .join(', ');
}

/** Default placeholder SVG (broken image icon) for error state */
const BrokenImageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────

/**
 * ResponsiveImage — A production-grade image component with:
 * - Responsive srcset/sizes
 * - WebP <picture> support
 * - Lazy loading via IntersectionObserver
 * - Skeleton placeholder
 * - Error fallback
 * - Fade-in transition
 */
export const ResponsiveImage = memo<ResponsiveImageProps>(function ResponsiveImage({
  src,
  alt,
  width,
  height,
  sizes,
  srcSet,
  webpSrcSet,
  fallbackSrc,
  objectFit = 'cover',
  objectPosition,
  aspectRatio,
  borderRadius,
  priority = false,
  className,
  style,
  onLoad,
  onError,
  placeholder,
  showSkeleton = true,
  rootMargin = '200px',
  quality,
}) {
  const {
    loaded,
    errored,
    shouldLoad,
    containerRef,
    handleLoad,
    handleError,
  } = useImageLoader({
    lazy: !priority,
    rootMargin,
    fallbackSrc,
    onLoad,
    onError,
  });

  // Optionally append quality param
  const qualifySrc = (url: string): string => {
    if (!quality || !url) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}q=${quality}`;
  };

  const srcSetString = srcSet ? buildSrcSet(srcSet) : undefined;
  const webpSrcSetString = webpSrcSet ? buildSrcSet(webpSrcSet) : undefined;

  const showSkeletonState = showSkeleton && !loaded && !errored;

  // If in error state, show fallback
  if (errored) {
    return (
      <ImageContainer
        ref={containerRef}
        $aspectRatio={aspectRatio}
        $borderRadius={borderRadius}
        $width={width}
        $height={height}
        className={className}
        style={style}
        role="img"
        aria-label={alt}
      >
        <ErrorFallback>
          <BrokenImageIcon />
          <span>Image unavailable</span>
        </ErrorFallback>
      </ImageContainer>
    );
  }

  return (
    <ImageContainer
      ref={containerRef}
      $aspectRatio={aspectRatio}
      $borderRadius={borderRadius}
      $width={width}
      $height={height}
      className={className}
      style={style}
    >
      {/* Skeleton / Custom Placeholder */}
      {showSkeletonState && (placeholder || <Skeleton $visible />)}

      {/* Only render image when in viewport (or priority) */}
      {shouldLoad && (
        <>
          {webpSrcSetString ? (
            <picture>
              <source
                type="image/webp"
                srcSet={webpSrcSetString}
                sizes={sizes}
              />
              {srcSetString && (
                <source srcSet={srcSetString} sizes={sizes} />
              )}
              <StyledImage
                src={qualifySrc(src)}
                alt={alt}
                width={width}
                height={height}
                loading={priority ? 'eager' : 'lazy'}
                decoding={priority ? 'sync' : 'async'}
                $loaded={loaded}
                $objectFit={objectFit}
                $objectPosition={objectPosition}
                onLoad={handleLoad}
                onError={handleError}
              />
            </picture>
          ) : (
            <StyledImage
              src={qualifySrc(src)}
              srcSet={srcSetString}
              sizes={sizes}
              alt={alt}
              width={width}
              height={height}
              loading={priority ? 'eager' : 'lazy'}
              decoding={priority ? 'sync' : 'async'}
              $loaded={loaded}
              $objectFit={objectFit}
              $objectPosition={objectPosition}
              onLoad={handleLoad}
              onError={handleError}
            />
          )}
        </>
      )}
    </ImageContainer>
  );
});
