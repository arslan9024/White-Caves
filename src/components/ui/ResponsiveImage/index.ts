/**
 * ResponsiveImage - Production-grade image component for White Caves CRM
 *
 * Features:
 * - Responsive srcset/sizes for optimal loading
 * - Lazy loading with IntersectionObserver
 * - Skeleton placeholder during load
 * - Graceful error fallback
 * - WebP format support with <picture>
 * - Fade-in transition on load
 * - Aspect ratio preservation
 * - Accessibility (alt text enforced)
 *
 * @example
 * <ResponsiveImage
 *   src="/images/property.jpg"
 *   alt="Modern villa in DAMAC Hills 2"
 *   width={640}
 *   height={480}
 *   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
 * />
 */
export { ResponsiveImage } from './ResponsiveImage';
export type { ResponsiveImageProps } from './ResponsiveImage.types';
