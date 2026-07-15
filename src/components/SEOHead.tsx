import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'website' | 'article' | 'RealEstateListing' | 'LocalBusiness' | 'JobPosting' | 'FAQPage';
  jsonLd?: any;
}

export function SEOHead({
  title,
  description,
  url,
  image,
  type = 'website',
  jsonLd,
}: SEOHeadProps) {
  const defaultImage =
    'https://res.cloudinary.com/whitecaves/image/upload/f_webp/og-image-default.jpg';
  const ogImage = image || defaultImage;

  return (
    <Helmet>
      {/* Basic HTML Meta */}
      <title>{title} | White Caves Real Estate</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* W25-014: Hreflang Tags for English and Arabic */}
      <link rel="alternate" hrefLang="en" href={url} />
      {/* Assuming Arabic routes will be prefixed with /ar */}
      <link
        rel="alternate"
        hrefLang="ar"
        href={url.replace('whitecaves.ae/', 'whitecaves.ae/ar/')}
      />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Open Graph Tags (Facebook, LinkedIn, etc.) */}
      <meta property="og:type" content={type === 'article' ? 'article' : 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* W25-013: JSON-LD Structured Data */}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}

      {/* Default LocalBusiness JSON-LD if not explicitly overridden */}
      {!jsonLd && type === 'LocalBusiness' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateAgent',
            name: 'White Caves Real Estate LLC',
            image: defaultImage,
            '@id': 'https://whitecaves.ae',
            url: 'https://whitecaves.ae',
            telephone: '+971-4-123-4567',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Emaar Square, Building 4',
              addressLocality: 'Downtown Dubai',
              addressRegion: 'Dubai',
              postalCode: '00000',
              addressCountry: 'AE',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 25.1972,
              longitude: 55.2744,
            },
          })}
        </script>
      )}
    </Helmet>
  );
}
