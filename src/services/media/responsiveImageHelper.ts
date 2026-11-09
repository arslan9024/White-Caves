/**
 * Responsive Image Helper (AVIF / WebP with DPR and Breakpoint Mapping)
 * Domain: Mobile Responsiveness & Native PWA Experience (Domain 7)
 */

export interface ResponsiveImageSource {
  srcSet: string;
  type: 'image/avif' | 'image/webp' | 'image/jpeg';
  sizes: string;
}

export function generateResponsiveImageSources(baseUrl: string): {
  avif: ResponsiveImageSource;
  webp: ResponsiveImageSource;
  fallback: string;
} {
  // Strip existing extensions
  const cleanUrl = baseUrl.split('?')[0].replace(/\.(jpg|jpeg|png|webp|avif)$/i, '');

  const sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  const avifSet = [
    `${cleanUrl}-480w.avif 480w`,
    `${cleanUrl}-800w.avif 800w`,
    `${cleanUrl}-1200w.avif 1200w`,
    `${cleanUrl}-1600w.avif 1600w`
  ].join(', ');

  const webpSet = [
    `${cleanUrl}-480w.webp 480w`,
    `${cleanUrl}-800w.webp 800w`,
    `${cleanUrl}-1200w.webp 1200w`,
    `${cleanUrl}-1600w.webp 1600w`
  ].join(', ');

  return {
    avif: {
      srcSet: avifSet,
      type: 'image/avif',
      sizes
    },
    webp: {
      srcSet: webpSet,
      type: 'image/webp',
      sizes
    },
    fallback: `${cleanUrl}-1200w.jpg`
  };
}
