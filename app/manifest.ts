/**
 * app/manifest.ts — Web App Manifest Generator (Next.js 15 App Router)
 *
 * Configures PWA (Progressive Web App) metadata, theme colors, and icons.
 */

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'White Caves Real Estate LLC — Dubai',
    short_name: 'White Caves',
    description: 'Ultra-exclusive luxury real estate brokerage in Dubai. RERA licensed.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F172A',
    theme_color: '#EF4444',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
