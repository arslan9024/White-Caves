/**
 * PropertyFinder XML Feed Generator & Trakheesi Permit Validator
 * Wave 25 (W25-001) - White Caves Real Estate LLC
 */

export interface TrakheesiPermit {
  permitNumber: string;
  issueDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'REVOKED';
  listingType: 'SALE' | 'RENT' | 'OFF_PLAN';
}

export interface SyndicationProperty {
  id: string;
  reference: string;
  title: string;
  titleAr?: string;
  description: string;
  propertyType: 'APARTMENT' | 'VILLA' | 'TOWNHOUSE' | 'PENTHOUSE' | 'OFFICE' | 'RETAIL';
  offeringType: 'SALE' | 'RENT';
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqFt: number;
  location: {
    city: string;
    community: string;
    subCommunity?: string;
    building?: string;
  };
  permit?: TrakheesiPermit;
  images: string[];
  features?: string[];
  updatedAt: string;
}

export interface SyndicationResult {
  xml: string;
  totalListings: number;
  eligibleListings: number;
  blockedListings: Array<{ id: string; reference: string; reason: string }>;
}

export function validateTrakheesiPermit(permit?: TrakheesiPermit): { isValid: boolean; reason?: string } {
  if (!permit || !permit.permitNumber) {
    return { isValid: false, reason: 'Missing Trakheesi permit number' };
  }

  if (permit.status !== 'ACTIVE') {
    return { isValid: false, reason: `Permit status is ${permit.status}` };
  }

  const now = new Date();
  const expiry = new Date(permit.expiryDate);

  if (isNaN(expiry.getTime()) || expiry < now) {
    return { isValid: false, reason: `Permit expired on ${permit.expiryDate}` };
  }

  return { isValid: true };
}

export function generatePropertyFinderXml(properties: SyndicationProperty[]): SyndicationResult {
  const blockedListings: Array<{ id: string; reference: string; reason: string }> = [];
  const eligibleProperties: SyndicationProperty[] = [];

  for (const prop of properties) {
    const validation = validateTrakheesiPermit(prop.permit);
    if (!validation.isValid) {
      blockedListings.push({
        id: prop.id,
        reference: prop.reference,
        reason: validation.reason || 'Invalid permit',
      });
    } else {
      eligibleProperties.push(prop);
    }
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<propertyfinder last_update="${new Date().toISOString()}">\n`;

  for (const prop of eligibleProperties) {
    xml += `  <property>\n`;
    xml += `    <reference_number>${escapeXml(prop.reference)}</reference_number>\n`;
    xml += `    <permit_number>${escapeXml(prop.permit?.permitNumber || '')}</permit_number>\n`;
    xml += `    <offering_type>${prop.offeringType === 'SALE' ? 'CS' : 'CR'}</offering_type>\n`;
    xml += `    <property_type>${prop.propertyType.toLowerCase()}</property_type>\n`;
    xml += `    <price>${prop.price}</price>\n`;
    xml += `    <bedrooms>${prop.bedrooms}</bedrooms>\n`;
    xml += `    <bathrooms>${prop.bathrooms}</bathrooms>\n`;
    xml += `    <size>${prop.sizeSqFt}</size>\n`;
    xml += `    <city>${escapeXml(prop.location.city)}</city>\n`;
    xml += `    <community>${escapeXml(prop.location.community)}</community>\n`;
    if (prop.location.subCommunity) {
      xml += `    <sub_community>${escapeXml(prop.location.subCommunity)}</sub_community>\n`;
    }
    if (prop.location.building) {
      xml += `    <building>${escapeXml(prop.location.building)}</building>\n`;
    }
    xml += `    <title_en><![CDATA[${prop.title}]]></title_en>\n`;
    if (prop.titleAr) {
      xml += `    <title_ar><![CDATA[${prop.titleAr}]]></title_ar>\n`;
    }
    xml += `    <description_en><![CDATA[${prop.description}]]></description_en>\n`;

    if (prop.images && prop.images.length > 0) {
      xml += `    <photo>\n`;
      prop.images.forEach((url) => {
        xml += `      <url>${escapeXml(url)}</url>\n`;
      });
      xml += `    </photo>\n`;
    }

    if (prop.features && prop.features.length > 0) {
      xml += `    <amenities>\n`;
      prop.features.forEach((feature) => {
        xml += `      <amenity>${escapeXml(feature)}</amenity>\n`;
      });
      xml += `    </amenities>\n`;
    }

    xml += `  </property>\n`;
  }

  xml += `</propertyfinder>`;

  return {
    xml,
    totalListings: properties.length,
    eligibleListings: eligibleProperties.length,
    blockedListings,
  };
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
