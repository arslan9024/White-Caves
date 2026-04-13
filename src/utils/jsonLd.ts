/**
 * JSON-LD Structured Data Generators
 * For Google Rich Results and Property Listing schema
 *
 * Reference: https://schema.org/RealEstateListing
 * Reference: https://schema.org/Organization
 */

// Organization schema for White Caves (site-wide)
export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'White Caves Real Estate',
    url: 'https://whitecaves.ae',
    logo: 'https://whitecaves.ae/images/logo.png',
    description:
      'Dubai\'s premier luxury real estate brokerage. RERA licensed. Specializing in residential and commercial properties across Dubai.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Business Bay',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      addressCountry: 'AE',
    },
    telephone: '+971500000000',
    email: 'info@whitecaves.ae',
    areaServed: {
      '@type': 'City',
      name: 'Dubai',
      containedInPlace: {
        '@type': 'Country',
        name: 'United Arab Emirates',
      },
    },
    sameAs: [
      'https://www.instagram.com/whitecaves',
      'https://www.linkedin.com/company/whitecaves',
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
  };
}

// Property listing schema for individual property pages
export interface PropertyJsonLdInput {
  id: string;
  title: string;
  description: string;
  price: number;
  currency?: string;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  address: {
    street?: string;
    area: string;
    city?: string;
  };
  images: string[];
  status: 'for_sale' | 'for_rent' | 'sold' | 'rented';
  reraPermit?: string;
  datePosted?: string;
  agent?: {
    name: string;
    phone?: string;
    brn?: string;
  };
}

export function getPropertyJsonLd(property: PropertyJsonLdInput) {
  const offer =
    property.status === 'for_rent'
      ? {
          '@type': 'Offer',
          price: property.price,
          priceCurrency: property.currency || 'AED',
          availability: 'https://schema.org/InStock',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: property.price,
            priceCurrency: property.currency || 'AED',
            unitText: 'year',
          },
        }
      : {
          '@type': 'Offer',
          price: property.price,
          priceCurrency: property.currency || 'AED',
          availability:
            property.status === 'sold'
              ? 'https://schema.org/SoldOut'
              : 'https://schema.org/InStock',
        };

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `https://whitecaves.ae/property/${property.id}`,
    image: property.images,
    datePosted: property.datePosted || new Date().toISOString(),
    offers: offer,
    about: {
      '@type': property.propertyType === 'villa' ? 'House' : 'Apartment',
      name: property.title,
      description: property.description,
      numberOfRooms: property.bedrooms,
      numberOfBathroomsTotal: property.bathrooms,
      floorSize: property.squareFeet
        ? {
            '@type': 'QuantitativeValue',
            value: property.squareFeet,
            unitCode: 'FTK', // Square feet
          }
        : undefined,
      address: {
        '@type': 'PostalAddress',
        streetAddress: property.address.street || '',
        addressLocality: property.address.area,
        addressRegion: property.address.city || 'Dubai',
        addressCountry: 'AE',
      },
    },
    // Dubai RERA compliance
    ...(property.reraPermit && {
      identifier: {
        '@type': 'PropertyValue',
        name: 'RERA Trakheesi Permit',
        value: property.reraPermit,
      },
    }),
    // Agent info
    ...(property.agent && {
      broker: {
        '@type': 'RealEstateAgent',
        name: property.agent.name,
        telephone: property.agent.phone,
        ...(property.agent.brn && {
          identifier: {
            '@type': 'PropertyValue',
            name: 'RERA BRN',
            value: property.agent.brn,
          },
        }),
      },
    }),
  };
}

// Breadcrumb schema for navigation
export function getBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://whitecaves.ae${item.url}`,
    })),
  };
}

// FAQ schema for area guides and service pages
export function getFaqJsonLd(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
