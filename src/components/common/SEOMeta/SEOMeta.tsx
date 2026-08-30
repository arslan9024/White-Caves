import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOMetaProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
  type?: 'website' | 'article' | 'profile';
}

const DEFAULT_TITLE = 'White Caves Real Estate | Luxury Dubai Properties';
const DEFAULT_DESCRIPTION =
  'Discover the most exclusive luxury properties in Dubai with White Caves Real Estate. Explore premium villas, penthouses, and off-plan developments.';
const DEFAULT_IMAGE = 'https://www.whitecaves.com/og-default-image.jpg';
const DEFAULT_URL = 'https://www.whitecaves.com';

export const SEOMeta: React.FC<SEOMetaProps> = ({
  title,
  description,
  canonical,
  image,
  schema,
  type = 'website',
}) => {
  const seoTitle = title ? `${title} | White Caves Real Estate` : DEFAULT_TITLE;
  const seoDescription = description || DEFAULT_DESCRIPTION;
  const seoImage = image || DEFAULT_IMAGE;
  const seoUrl = canonical || DEFAULT_URL;

  // Default Real Estate Agent Schema
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'White Caves Real Estate',
    image: DEFAULT_IMAGE,
    '@id': 'https://www.whitecaves.com',
    url: 'https://www.whitecaves.com',
    telephone: '+971 4 000 0000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'DIFC, Gate Village 5',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      postalCode: '00000',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.2123,
      longitude: 55.281,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  };

  const schemaData = schema ? [defaultSchema, ...(Array.isArray(schema) ? schema : [schema])] : defaultSchema;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Hreflang for UAE */}
      <link rel="alternate" hrefLang="en-AE" href={seoUrl} />
      <link rel="alternate" hrefLang="ar-AE" href={seoUrl.replace('.com', '.com/ar')} />
      <link rel="alternate" hrefLang="x-default" href={seoUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};
