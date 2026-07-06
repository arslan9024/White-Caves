/**
 * JSON-LD Schema Builders for Wave 10 SEO Enhancement
 * Generates structured data for Google, Bing, and other search engines
 */

export interface PropertySchema {
  name: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  price: {
    amount: number;
    currency: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  floorSize?: {
    value: number;
    unitCode: string;
  };
  image?: string[] | string;
  url?: string;
  pricingType?: 'SalePrice' | 'RentalPrice';
  availability?: 'PreOrder' | 'InStock' | 'OutOfStock' | 'Discontinued';
}

export interface AgentSchema {
  name: string;
  title?: string;
  image?: string;
  telephone?: string;
  email?: string;
  url?: string;
}

/**
 * Build JSON-LD schema for a real estate property listing
 * Schema.org type: Apartment | House | SingleFamilyResidence
 * 
 * @param property - Property details
 * @param agentInfo - Real estate agent information
 * @returns JSON-LD object ready for embedding
 */
export function buildPropertySchema(
  property: PropertySchema,
  agentInfo?: AgentSchema,
): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': property.bedrooms ? 'Apartment' : 'House',
    name: property.name,
    description: property.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address.streetAddress,
      addressLocality: property.address.addressLocality,
      addressRegion: property.address.addressRegion,
      postalCode: property.address.postalCode,
      addressCountry: property.address.addressCountry,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: property.price.currency,
      price: property.price.amount.toString(),
      availability: property.availability || 'InStock',
      pricingType: property.pricingType || 'SalePrice',
    },
  };

  // Add optional property details
  if (property.bedrooms !== undefined) {
    schema.numberOfBedrooms = property.bedrooms;
  }

  if (property.bathrooms !== undefined) {
    schema.numberOfBathrooms = property.bathrooms;
  }

  if (property.floorSize) {
    schema.floorSize = {
      '@type': 'QuantitativeValue',
      value: property.floorSize.value,
      unitCode: property.floorSize.unitCode, // SQM, SQF
    };
  }

  // Add images (can be string or array)
  if (property.image) {
    schema.image = Array.isArray(property.image) ? property.image : [property.image];
  }

  // Add URL
  if (property.url) {
    schema.url = property.url;
  }

  // Add real estate agent
  if (agentInfo) {
    schema.realEstateAgent = buildAgentSchema(agentInfo);
  }

  return schema;
}

/**
 * Build JSON-LD schema for a real estate agent
 * Schema.org type: Person
 * 
 * @param agent - Agent information
 * @returns JSON-LD object ready for embedding
 */
export function buildAgentSchema(agent: AgentSchema): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@type': 'Person',
    name: agent.name,
  };

  if (agent.title) schema.jobTitle = agent.title;
  if (agent.image) schema.image = agent.image;
  if (agent.telephone) schema.telephone = agent.telephone;
  if (agent.email) schema.email = agent.email;
  if (agent.url) schema.url = agent.url;

  return schema;
}

/**
 * Build JSON-LD schema for White Caves organization
 * Schema.org type: LocalBusiness | RealEstateAgent
 * 
 * @returns JSON-LD object ready for embedding
 */
export function buildOrganizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'White Caves Real Estate',
    description: 'Dubai\'s Premier Luxury Property Platform',
    url: 'https://whitecaves.com',
    logo: 'https://whitecaves.com/logo.png',
    image: 'https://whitecaves.com/og-image.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Dubai, UAE',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      addressCountry: 'AE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@whitecaves.com',
      telephone: '+971-X-XXX-XXXX',
    },
    sameAs: [
      'https://www.facebook.com/whitecaves',
      'https://twitter.com/whitecaves',
      'https://instagram.com/whitecaves',
      'https://www.linkedin.com/company/white-caves',
    ],
  };
}

/**
 * Build JSON-LD schema for breadcrumb navigation
 * Schema.org type: BreadcrumbList
 * 
 * @param items - Breadcrumb items [{name, url}, ...]
 * @returns JSON-LD object ready for embedding
 */
export function buildBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Build JSON-LD schema for a search results page
 * Schema.org type: CollectionPage
 * 
 * @param searchQuery - What the user searched for
 * @param resultCount - Total number of results
 * @returns JSON-LD object ready for embedding
 */
export function buildSearchResultsSchema(
  searchQuery: string,
  resultCount: number,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    mainEntity: {
      '@type': 'ItemList',
      name: `Search results for "${searchQuery}"`,
      numberOfItems: resultCount,
    },
  };
}

/**
 * Build JSON-LD schema for FAQ section
 * Schema.org type: FAQPage
 * 
 * @param faqs - Array of {question, answer} objects
 * @returns JSON-LD object ready for embedding
 */
export function buildFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Build multi-schema JSON-LD for a property detail page
 * Combines Organization + BreadcrumbList + Property
 * 
 * @param property - Property details
 * @param agentInfo - Agent info
 * @param breadcrumbs - Breadcrumb items
 * @returns Array of JSON-LD objects
 */
export function buildPropertyDetailPageSchemas(
  property: PropertySchema,
  agentInfo?: AgentSchema,
  breadcrumbs?: Array<{ name: string; url: string }>,
): Array<Record<string, unknown>> {
  const schemas: Array<Record<string, unknown>> = [];

  // Add organization schema for rich snippet footer
  schemas.push(buildOrganizationSchema());

  // Add breadcrumb navigation
  if (breadcrumbs?.length) {
    schemas.push(buildBreadcrumbSchema(breadcrumbs));
  }

  // Add main property listing
  schemas.push(buildPropertySchema(property, agentInfo));

  return schemas;
}
