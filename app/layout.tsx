/**
 * app/layout.tsx — Root Layout (Next.js 15 App Router)
 *
 * This is the top-level shell for the Next.js migration layer.
 * All routes under app/ inherit this layout.
 * The existing Vite/Express stack continues to serve via its own entry.
 */

import type { Metadata, Viewport } from 'next';
import StoreProvider from './store/StoreProvider';

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: 'White Caves Real Estate — Luxury Dubai Properties',
    template: '%s | White Caves Real Estate',
  },
  description:
    'Discover ultra-exclusive villas, apartments, and investment opportunities in DAMAC Hills 2, Palm Jumeirah, and Downtown Dubai. White Caves Real Estate LLC — Your trusted RERA-licensed broker.',
  keywords: [
    'Dubai real estate',
    'luxury villas Dubai',
    'DAMAC Hills 2',
    'Palm Jumeirah properties',
    'White Caves Real Estate',
    'RERA licensed broker',
    'property investment UAE',
  ],
  authors: [{ name: 'White Caves Real Estate LLC' }],
  creator: 'White Caves Real Estate LLC',
  metadataBase: new URL('https://whitecaves.ae'),
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: 'https://whitecaves.ae',
    siteName: 'White Caves Real Estate',
    title: 'White Caves Real Estate — Luxury Dubai Properties',
    description:
      'Ultra-exclusive property listings across prime Dubai master communities. RERA-licensed brokerage.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'White Caves Real Estate Dubai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'White Caves Real Estate — Luxury Dubai Properties',
    description: 'Ultra-exclusive Dubai real estate. RERA-licensed brokerage.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#EF4444',
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Google Fonts — Inter for premium typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Brand Design Tokens */}
        <style>{`
          :root {
            --color-brand-red:   #EF4444;
            --color-brand-white: #FFFFFF;
            --color-brand-slate: #1E293B;
            --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
          *, *::before, *::after { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: var(--font-sans);
            background: var(--color-brand-white);
            color: var(--color-brand-slate);
            -webkit-font-smoothing: antialiased;
          }
        `}</style>
      </head>
      <body><StoreProvider>{children}</StoreProvider></body>
    </html>
  );
}
