// src/mocks/dubaiRealEstateMocks.ts
// Production‑ready mock data for Dubai real‑estate listings.
// Strict TypeScript types are used and conversion fields are pre‑computed.

/** Conversion constants (static rates). */
const AED_TO_USD = 0.27; // 1 AED ≈ 0.27 USD
const AED_TO_EUR = 0.25; // 1 AED ≈ 0.25 EUR
const AED_TO_GBP = 0.22; // 1 AED ≈ 0.22 GBP

/** Property status enumeration */
export type PropertyStatus = 'Available' | 'Leased' | 'UnderMaintenance';

/** Interface describing a luxury property listing */
export interface Property {
  /** Unique identifier */
  id: string;
  /** Human‑readable title */
  title: string;
  /** Community / neighbourhood */
  community: string;
  /** Developer name (e.g., DAMAC, Emaar) */
  developer: string;
  /** Price in AED */
  priceAED: number;
  /** Price converted to USD (rounded) */
  priceUSD: number;
  /** Price converted to EUR (rounded) */
  priceEUR: number;
  /** Price converted to GBP (rounded) */
  priceGBP: number;
  /** Number of bedrooms */
  beds: number;
  /** Number of bathrooms */
  baths: number;
  /** Size in square‑feet */
  sqft: number;
  /** Current rental / sale status */
  status: PropertyStatus;
  /** RERA permit number */
  reraPermitNumber: string;
}

/** Helper to compute conversion fields from AED */
function withConversions(base: Omit<Property, 'priceUSD' | 'priceEUR' | 'priceGBP'>): Property {
  const priceUSD = Math.round(base.priceAED * AED_TO_USD);
  const priceEUR = Math.round(base.priceAED * AED_TO_EUR);
  const priceGBP = Math.round(base.priceAED * AED_TO_GBP);
  return { ...base, priceUSD, priceEUR, priceGBP } as Property;
}

/** Five realistic luxury listings centred in DAMAC Hills 2 and Downtown Dubai */
export const mockProperties: Property[] = [
  withConversions({
    id: 'prop-001',
    title: 'Signature Villa – Al Barari',
    community: 'DAMAC Hills 2',
    developer: 'DAMAC',
    priceAED: 12_500_000,
    beds: 5,
    baths: 6,
    sqft: 7_200,
    status: 'Available',
    reraPermitNumber: 'RERA-2024-001',
  }),
  withConversions({
    id: 'prop-002',
    title: 'Park View Penthouse',
    community: 'Downtown Dubai',
    developer: 'Emaar',
    priceAED: 9_800_000,
    beds: 4,
    baths: 4,
    sqft: 5_500,
    status: 'Leased',
    reraPermitNumber: 'RERA-2024-014',
  }),
  withConversions({
    id: 'prop-003',
    title: 'Majestic Townhouse',
    community: 'DAMAC Hills 2',
    developer: 'DAMAC',
    priceAED: 7_250_000,
    beds: 4,
    baths: 5,
    sqft: 4_800,
    status: 'Available',
    reraPermitNumber: 'RERA-2024-027',
  }),
  withConversions({
    id: 'prop-004',
    title: 'Luxury 2‑Bedroom Apartment',
    community: 'Downtown Dubai',
    developer: 'Emaar',
    priceAED: 5_600_000,
    beds: 2,
    baths: 2,
    sqft: 2_300,
    status: 'UnderMaintenance',
    reraPermitNumber: 'RERA-2024-039',
  }),
  withConversions({
    id: 'prop-005',
    title: 'Executive Villa – The Residences',
    community: 'DAMAC Hills 2',
    developer: 'DAMAC',
    priceAED: 10_300_000,
    beds: 6,
    baths: 7,
    sqft: 6_500,
    status: 'Available',
    reraPermitNumber: 'RERA-2024-045',
  }),
];

// Export conversion constants for reuse in other modules (e.g., UI utilities)
export { AED_TO_USD, AED_TO_EUR, AED_TO_GBP };

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  priority: string;
}

export interface RegulatoryContract {
  id: string;
  contractNumber: string;
  type: string;
  status: string;
}

export const mockLeads: Lead[] = [
  {
    id: 'lead-001',
    name: 'Amir Khan',
    email: 'amir@example.com',
    phone: '+971501234567',
    status: 'New',
    source: 'Website',
    priority: 'High',
  },
  {
    id: 'lead-002',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    phone: '+971502345678',
    status: 'Contacted',
    source: 'WhatsApp',
    priority: 'Medium',
  },
  {
    id: 'lead-003',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+971503456789',
    status: 'Closed',
    source: 'Referral',
    priority: 'Low',
  },
];

export const mockRegulatoryContracts: RegulatoryContract[] = [
  { id: 'contract-001', contractNumber: 'Form 6-001', type: 'Form 6', status: 'Active' },
  { id: 'contract-002', contractNumber: 'Form 7-002', type: 'Form 7', status: 'Active' },
  { id: 'contract-003', contractNumber: 'Form 12-003', type: 'Form 12', status: 'Active' },
];
