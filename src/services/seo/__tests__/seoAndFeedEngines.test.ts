import { describe, it, expect } from 'vitest';
import { generateRealEstateListingJsonLd } from '../realEstateListingSchema';
import { generatePropertyFinderXmlFeed, SyndicationProperty } from '../xmlFeedSyndicationEngine';

describe('SEO & Feed Syndication: RealEstateListing JSON-LD and Portal XML Feeds', () => {
  it('generates compliant Schema.org RealEstateListing JSON-LD with RERA Trakheesi permits', () => {
    const jsonLd = generateRealEstateListingJsonLd({
      id: 'prop-901',
      referenceNumber: 'WC-PALM-401',
      name: 'Skyline Penthouse at One Palm Jumeirah',
      description: 'Ultra-luxury 4BR penthouse offering 360-degree panoramic Arabian Gulf views.',
      url: 'https://whitecaves.com/properties/wc-palm-401',
      priceAed: 35_000_000,
      propertyType: 'Penthouse',
      numberOfRooms: 4,
      numberOfBathroomsTotal: 5,
      floorSizeSqft: 7500,
      imageUrls: ['https://assets.whitecaves.com/penthouses/one-palm.jpg'],
      address: {
        streetAddress: 'One Palm Residences, Crescent Road',
        community: 'Palm Jumeirah',
        addressLocality: 'Dubai',
        addressRegion: 'Dubai',
        addressCountry: 'AE'
      },
      geo: {
        latitude: 25.1124,
        longitude: 55.1389
      },
      trakheesiPermitNumber: 'TRK-789012'
    });

    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('RealEstateListing');
    expect((jsonLd['offers'] as Record<string, unknown>).price).toBe(35_000_000);
    expect(((jsonLd['about'] as Record<string, unknown>).floorSize as Record<string, unknown>).value).toBe(7500);
    expect(((jsonLd['about'] as Record<string, unknown>).geo as Record<string, unknown>).latitude).toBe(25.1124);
  });

  it('generates valid Property Finder XML Feed syntax containing mandatory CDATA tags', () => {
    const testProps: SyndicationProperty[] = [
      {
        referenceNumber: 'WC-DH2-101',
        permitNumber: 'TRK-112233',
        offeringType: 'RS',
        propertyType: 'VH',
        price: 3_200_000,
        city: 'Dubai',
        community: 'DAMAC Hills 2',
        propertyTitleEn: 'Luxury 4BR Villa in DAMAC Hills 2',
        descriptionEn: 'Brand new luxury villa with private landscaped garden and community pool.',
        bedrooms: 4,
        bathrooms: 4,
        sizeSqft: 2800,
        photos: ['https://assets.whitecaves.com/villas/dh2-main.jpg'],
        agentEmail: 'vip@whitecaves.com',
        agentPhone: '+971501234567'
      }
    ];

    const xml = generatePropertyFinderXmlFeed(testProps);
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<reference_number><![CDATA[WC-DH2-101]]></reference_number>');
    expect(xml).toContain('<permit_number><![CDATA[TRK-112233]]></permit_number>');
    expect(xml).toContain('<price>3200000</price>');
    expect(xml).toContain('<community><![CDATA[DAMAC Hills 2]]></community>');
  });
});
