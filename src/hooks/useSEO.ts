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
  return new URL(sanitizedPath, Config.DOMAIN).toString();
}

export default useSEO;
