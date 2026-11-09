/**
 * Property Finder & Bayut XML Feed Syndication Engine
 * Domain: Performance Marketing & Automated XML Feeds (Domain 10, Item #96)
 * Standards: Official Property Finder XML v2.0 & Bayut XML Feed Specifications
 */

export interface SyndicationProperty {
  referenceNumber: string;
  permitNumber: string; // Mandatory RERA Trakheesi Permit
  offeringType: 'RR' | 'CR' | 'RS' | 'CS'; // Residential Rent, Commercial Rent, Residential Sale, Commercial Sale
  propertyType: 'AP' | 'VH' | 'PH' | 'TH' | 'OF'; // Apartment, Villa, Penthouse, Townhouse, Office
  price: number;
  rentalFrequency?: 'yearly' | 'monthly';
  city: 'Dubai';
  community: string;
  subCommunity?: string;
  propertyTitleEn: string;
  descriptionEn: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqft: number;
  photos: string[];
  agentEmail: string;
  agentPhone: string;
}

export function generatePropertyFinderXmlFeed(properties: SyndicationProperty[]): string {
  const propertyNodes = properties.map(p => `
    <property>
      <reference_number><![CDATA[${p.referenceNumber}]]></reference_number>
      <permit_number><![CDATA[${p.permitNumber}]]></permit_number>
      <offering_type><![CDATA[${p.offeringType}]]></offering_type>
      <property_type><![CDATA[${p.propertyType}]]></property_type>
      <price_on_application>0</price_on_application>
      <price>${p.price}</price>
      ${p.rentalFrequency ? `<rental_period>${p.rentalFrequency}</rental_period>` : ''}
      <city><![CDATA[${p.city}]]></city>
      <community><![CDATA[${p.community}]]></community>
      ${p.subCommunity ? `<sub_community><![CDATA[${p.subCommunity}]]></sub_community>` : ''}
      <title_en><![CDATA[${p.propertyTitleEn}]]></title_en>
      <description_en><![CDATA[${p.descriptionEn}]]></description_en>
      <bedroom>${p.bedrooms}</bedroom>
      <bathroom>${p.bathrooms}</bathroom>
      <size>${p.sizeSqft}</size>
      <agent>
        <email><![CDATA[${p.agentEmail}]]></email>
        <phone><![CDATA[${p.agentPhone}]]></phone>
      </agent>
      <photo>
        ${p.photos.map(url => `<url><![CDATA[${url}]]></url>`).join('\n        ')}
      </photo>
    </property>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<list>
${propertyNodes}
</list>`;
}
