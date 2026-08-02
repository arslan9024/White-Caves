/**
 * app/robots.ts — Search Engine Robots.txt Generator (Next.js 15 App Router)
 *
 * Configures crawler access for Googlebot, Bingbot, etc.
 * Disallows /crm/ and /api/ paths from public search index.
 */

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://whitecaves.ae';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/crm/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
