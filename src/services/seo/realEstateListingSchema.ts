/**
 * Schema.org RealEstateListing Structured Data Generator
 * Domain: Performance Marketing, SEO & Predictive Intelligence (Domain 10)
 * Compliant with Google Search RealEstateListing Rich Snippets & Carousel Guidelines
 */

export interface PropertyListingStructuredInput {
  id: string;
  referenceNumber: string;
  name: string;
  description: string;
  url: string;
  priceAed: number;
  currency?: string;
  propertyType: 'Penthouse' | 'Villa' | 'Apartment' | 'House' | 'Commercial';
  numberOfRooms: number;
  numberOfBathroomsTotal: number;
  floorSizeSqft: number;
  imageUrls: string[];
  address: {
    streetAddress: string;
    community: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  trakheesiPermitNumber: string;
}

export function generateRealEstateListingJsonLd(input: PropertyListingStructuredInput): Record<string, unknown> {
  const {
    name,
    description,
    url,
    priceAed,
    currency = 'AED',
    propertyType,
    numberOfRooms,
    numberOfBathroomsTotal,
    floorSizeSqft,
    imageUrls,
    address,
    geo,
    trakheesiPermitNumber
  } = input;

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name,
    description,
    url,
    image: imageUrls,
    offers: {
      '@type': 'Offer',
      price: priceAed,
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString().split('T')[0],
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: priceAed,
        priceCurrency: currency,
        unitCode: 'INH'
      }
    },
    about: {
      '@type': ['Accommodation', propertyType],
      name,
      numberOfRooms,
      numberOfBathroomsTotal,
      floorSize: {
        '@type': 'QuantitativeValue',
        value: floorSizeSqft,
        unitCode: 'FTK' // Square feet UN/CEFACT code
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.streetAddress,
        addressLocality: address.community || address.addressLocality,
        addressRegion: address.addressRegion || 'Dubai',
        addressCountry: address.addressCountry || 'AE'
      },
      ...(geo
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: geo.latitude,
              longitude: geo.longitude
            }
          }
        : {})
    },
    identifier: [
      {
        '@type': 'PropertyValue',
        name: 'RERA Trakheesi Permit',
        value: trakheesiPermitNumber
      },
      {
        '@type': 'PropertyValue',
        name: 'Broker Reference',
        value: input.referenceNumber
      }
    ]
  };
}
