/**
 * SEOHead — Reusable per-page meta tag component
 * Uses react-helmet-async for server-side compatible SEO
 *
 * Usage:
 *   <SEOHead
 *     title="Luxury Properties in Dubai Marina"
 *     description="Browse 500+ luxury apartments and villas in Dubai Marina..."
 *     canonical="/properties?area=dubai-marina"
 *     ogImage="/images/dubai-marina-hero.jpg"
 *   />
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOHeadProps {
  /** Page title — will be appended with " | White Caves Real Estate" */
  title: string;
  /** Meta description — 155 chars recommended for SERP */
  description: string;
  /** Canonical URL path (e.g., "/properties" — domain auto-prepended) */
  canonical?: string;
  /** Open Graph image URL */
  ogImage?: string;
  /** Override default og:type (default: "website") */
  ogType?: 'website' | 'article' | 'product';
  /** Additional keywords for meta keywords tag */
  keywords?: string[];
  /** Disable indexing (for admin/dashboard pages) */
  noIndex?: boolean;
  /** JSON-LD structured data object */
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = 'White Caves Real Estate';
const SITE_URL = 'https://whitecaves.ae';
const DEFAULT_OG_IMAGE = '/images/og-default.jpg';
const DEFAULT_KEYWORDS = [
  'Dubai real estate',
  'luxury properties Dubai',
  'apartments for sale Dubai',
  'villas for sale Dubai',
  'Dubai property investment',
  'RERA licensed broker',
  'Dubai Marina properties',
  'Palm Jumeirah villas',
];

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  keywords = [],
  noIndex = false,
  jsonLd,
}) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const fullCanonical = canonical ? `${SITE_URL}${canonical}` : undefined;
  const fullOgImage = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : `${SITE_URL}${ogImage}`
    : `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  const allKeywords = [...DEFAULT_KEYWORDS, ...keywords].join(', ');

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      <meta property="og:locale" content="en_AE" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Dubai / UAE Specific */}
      <meta name="geo.region" content="AE-DU" />
      <meta name="geo.placename" content="Dubai" />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
