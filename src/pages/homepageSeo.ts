import { Config } from '../config/constants';
import type {
  HomepageProperty,
  MarketStats,
  TopAgent,
  LocationTrend,
} from '../store/slices/homepageSlice';

interface HomepageSeoInput {
  marketStats: MarketStats;
  featuredProperties: HomepageProperty[];
  topAgents?: TopAgent[];
  locationTrends?: LocationTrend[];
}

function getAvailability(status: string): string {
  return status === 'available'
    ? 'https://schema.org/InStock'
    : 'https://schema.org/LimitedAvailability';
}

function mapPropertyType(type: string): string {
  const normalized = type.toLowerCase();

  if (normalized.includes('villa')) return 'SingleFamilyResidence';
  if (normalized.includes('townhouse')) return 'House';
  if (normalized.includes('penthouse')) return 'Apartment';
  if (normalized.includes('apartment')) return 'Apartment';
  if (normalized.includes('studio')) return 'Apartment';

  return 'Residence';
}

export function buildHomepageJsonLd({
  marketStats,
  featuredProperties,
  topAgents = [],
  locationTrends = [],
}: HomepageSeoInput): Array<Record<string, unknown>> {
  const homepageUrl = `${Config.DOMAIN}/`;
  const propertiesUrl = `${Config.DOMAIN}/properties`;

  const itemListElement = featuredProperties.slice(0, 6).map((property, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': mapPropertyType(property.type),
      name: property.title,
      description: property.description || `${property.type} in ${property.location}`,
      url: `${Config.DOMAIN}/properties/${property.id}`,
      image: property.images?.[0],
      address: {
        '@type': 'PostalAddress',
        addressLocality: property.location,
        addressCountry: 'AE',
      },
      floorSize: {
        '@type': 'QuantitativeValue',
        value: property.sqft,
        unitCode: 'FTK',
      },
      numberOfRooms: property.bedrooms,
      numberOfBathroomsTotal: property.bathrooms,
      amenityFeature: property.amenities?.map(amenity => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity,
        value: true,
      })),
      offers: {
        '@type': 'Offer',
        price: property.price,
        priceCurrency: property.currency || 'AED',
        availability: getAvailability(property.status),
        url: `${Config.DOMAIN}/properties/${property.id}`,
      },
    },
  }));

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      '@id': `${homepageUrl}#real-estate-agent`,
      name: Config.COMPANY.NAME,
      url: Config.DOMAIN,
      telephone: Config.COMPANY.PHONE,
      email: Config.COMPANY.EMAIL,
      openingHours: ['Mo-Fr 09:00-18:00', 'Sa 10:00-16:00'],
      areaServed: {
        '@type': 'City',
        name: 'Dubai',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: Config.COMPANY.ADDRESS,
        addressLocality: 'Dubai',
        addressCountry: 'AE',
      },
      knowsAbout: locationTrends.map(trend => trend.name),
      makesOffer: {
        '@type': 'OfferCatalog',
        name: 'Dubai Luxury Properties',
        numberOfItems: marketStats.totalProperties,
      },
      employee: topAgents.slice(0, 4).map(agent => ({
        '@type': 'RealEstateAgent',
        name: agent.name,
        email: agent.email,
        worksFor: {
          '@id': `${homepageUrl}#real-estate-agent`,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${homepageUrl}#website`,
      url: homepageUrl,
      name: `${Config.COMPANY.SHORT_NAME} Dubai Luxury Real Estate`,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${propertiesUrl}?location={location}&type={type}`,
        'query-input': ['required name=location', 'optional name=type'],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${homepageUrl}#homepage`,
      url: homepageUrl,
      name: 'Dubai Luxury Real Estate | White Caves',
      description:
        'Explore premium villas, penthouses, and investment-ready properties in Dubai with White Caves Real Estate.',
      isPartOf: {
        '@id': `${homepageUrl}#website`,
      },
      mainEntity: {
        '@type': 'ItemList',
        name: 'Featured Dubai Luxury Properties',
        url: propertiesUrl,
        numberOfItems: marketStats.totalProperties,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        itemListElement,
      },
      about: locationTrends.map(trend => ({
        '@type': 'Place',
        name: trend.name,
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'propertyCount',
            value: trend.propertyCount,
          },
          {
            '@type': 'PropertyValue',
            name: 'averagePriceAED',
            value: trend.avgPrice,
          },
          {
            '@type': 'PropertyValue',
            name: 'trendPercent',
            value: trend.trendPercent,
          },
        ],
      })),
    },
  ];
}

export default buildHomepageJsonLd;
