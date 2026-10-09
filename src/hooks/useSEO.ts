import { useEffect } from 'react';
import { Config } from '../config/constants';
import { useDocumentTitle } from './useDocumentTitle';
import { applySEO, type SEOConfig } from '../utils/seo';

export interface UseSEOOptions extends SEOConfig {
  title: string;
}

/**
 * SPA SEO hook: title + runtime meta/canonical/json-ld management.
 */
export function useSEO({ title, ...seo }: UseSEOOptions): void {
  useDocumentTitle(title);

  useEffect(() => {
    const cleanup = applySEO(seo);
    return cleanup;
  }, [
    seo.description,
    seo.canonicalUrl,
    seo.ogType,
    seo.ogImage,
    seo.noIndex,
    JSON.stringify(seo.keywords || []),
    JSON.stringify(seo.jsonLd || null),
  ]);
}

export function getCanonicalUrl(pathname = '/'): string {
  const sanitizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  try {
    const rawBase =
      Config.DOMAIN ||
      (typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'https://www.whitecaves.com');
    const base = /^https?:\/\//i.test(rawBase) ? rawBase : `https://${rawBase}`;
    return new URL(sanitizedPath, base).toString();
  } catch {
    return `https://www.whitecaves.com${sanitizedPath}`;
  }
}

export default useSEO;
