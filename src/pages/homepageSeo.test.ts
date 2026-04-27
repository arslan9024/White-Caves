import { describe, it, expect } from 'vitest';
import { buildHomepageJsonLd } from './homepageSeo';

const marketStats = {
  totalProperties: 500,
  availableProperties: 320,
  averagePrice: 4_500_000,
  portfolioValue: 2_250_000_000,
  activeAgents: 50,
};

const featuredProperties = [
  {
    id: 'prop-1',
    title: 'Palm Jumeirah Villa',
    description: 'Ultra luxury waterfront villa',
    type: 'villa',
    status: 'available',
    price: 15000000,
    currency: 'AED',
    bedrooms: 5,
    bathrooms: 6,
    sqft: 8000,
    location: 'Palm Jumeirah',
    amenities: ['Pool', 'Private Beach'],
    images: ['https://example.com/villa.jpg'],
    featured: true,
    agentName: 'Sarah Ahmed',
  },
];

const topAgents = [
  {
    id: 'agent-1',
    name: 'Sarah Ahmed',
    email: 'sarah@whitecaves.ae',
    department: 'Luxury Sales',
    dealsCount: 12,
    revenueGenerated: 75000000,
  },
];

const locationTrends = [
  {
    name: 'Palm Jumeirah',
    propertyCount: 120,
    avgPrice: 15000000,
    trendPercent: 12,
    trendDirection: 'up' as const,
  },
];

describe('buildHomepageJsonLd', () => {
  it('returns a multi-schema array for the homepage', () => {
    const result = buildHomepageJsonLd({ marketStats, featuredProperties, topAgents, locationTrends });
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
  });

  it('injects live total property count into schema output', () => {
    const result = buildHomepageJsonLd({ marketStats, featuredProperties, topAgents, locationTrends });
    const agentSchema = result.find((schema) => schema['@type'] === 'RealEstateAgent');
    const pageSchema = result.find((schema) => schema['@type'] === 'CollectionPage');

    expect((agentSchema?.makesOffer as { numberOfItems: number }).numberOfItems).toBe(500);
    expect((pageSchema?.mainEntity as { numberOfItems: number }).numberOfItems).toBe(500);
  });

  it('maps featured properties into ItemList entries with Offer data', () => {
    const result = buildHomepageJsonLd({ marketStats, featuredProperties, topAgents, locationTrends });
    const pageSchema = result.find((schema) => schema['@type'] === 'CollectionPage');
    const itemList = (pageSchema?.mainEntity as { itemListElement: Array<{ item: { name: string; offers: { price: number } } }> }).itemListElement;

    expect(itemList).toHaveLength(1);
    expect(itemList[0].item.name).toBe('Palm Jumeirah Villa');
    expect(itemList[0].item.offers.price).toBe(15000000);
  });

  it('includes live location trend data in Place/about entries', () => {
    const result = buildHomepageJsonLd({ marketStats, featuredProperties, topAgents, locationTrends });
    const pageSchema = result.find((schema) => schema['@type'] === 'CollectionPage');
    const about = pageSchema?.about as Array<{ name: string; additionalProperty: Array<{ name: string; value: number }> }>;

    expect(about[0].name).toBe('Palm Jumeirah');
    expect(about[0].additionalProperty.find((prop) => prop.name === 'propertyCount')?.value).toBe(120);
    expect(about[0].additionalProperty.find((prop) => prop.name === 'trendPercent')?.value).toBe(12);
  });

  it('handles empty agents and trends without failing', () => {
    const result = buildHomepageJsonLd({ marketStats, featuredProperties: [], topAgents: [], locationTrends: [] });
    const agentSchema = result.find((schema) => schema['@type'] === 'RealEstateAgent');
    const pageSchema = result.find((schema) => schema['@type'] === 'CollectionPage');

    expect(agentSchema?.employee).toEqual([]);
    expect((pageSchema?.about as Array<unknown>)).toEqual([]);
    expect(((pageSchema?.mainEntity as { itemListElement: unknown[] }).itemListElement)).toEqual([]);
  });
});
