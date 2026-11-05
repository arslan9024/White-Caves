/**
 * REPropertyManager.types.ts
 * 7-Category Architecture: Config & Types Layer
 * Real Estate Properties Inventory Contracts for White Caves Real Estate LLC
 * Single Purpose File Law: < 350 lines
 */

export type REPropertyType =
  | 'VILLA'
  | 'PENTHOUSE'
  | 'TOWNHOUSE'
  | 'APARTMENT'
  | 'MANSION'
  | 'COMMERCIAL';

export type REPropertyPurpose = 'BUY' | 'RENT';

export type REPropertyStatus = 'AVAILABLE' | 'UNDER_OFFER' | 'SOLD' | 'LEASED' | 'OFF_MARKET';

export interface REPropertyNode {
  _id: string;
  repropertyId: string; // e.g. REP-001 to REP-100
  title: string;
  propertyType: REPropertyType;
  purpose: REPropertyPurpose;
  status: REPropertyStatus;
  location: string;
  subLocation: string;
  priceAED: number;
  rentalPeriod?: 'YEARLY' | 'MONTHLY';
  areaSqft: number;
  bedrooms: number;
  bathrooms: number;
  developer: string;
  completionStatus: 'READY' | 'OFF_PLAN';
  handoverYear?: number;
  trakheesiPermit: string;
  dldTitleDeedNumber: string;
  assignedBroker: string;
  supervisorCode: string;
  featured: boolean;
  images: string[];
  description: string;
  features: string[];
  createdAt: string;
}

export interface REPropertyFilterState {
  searchQuery: string;
  selectedPurpose: 'ALL' | 'BUY' | 'RENT';
  selectedType: string;
  selectedLocation: string;
  selectedStatus: string;
}

export interface REPropertyMetrics {
  totalInventoryValue: number;
  totalUnits: number;
  availableCount: number;
  underOfferCount: number;
  leasedCount: number;
  soldCount: number;
}
