// src/mocks/dubaiRealEstateMocks.ts
// Enterprise Mock Dataset for White Caves Managing Director CRM
// Fully compliant with 32-field Property Inventory & 100-Employee Workforce Matrix

/** Live Foreign Exchange Conversion Constants (AED Anchor Currency) */
export const AED_TO_USD = 0.27; // 1 AED ≈ 0.27 USD
export const AED_TO_EUR = 0.25; // 1 AED ≈ 0.25 EUR
export const AED_TO_GBP = 0.22; // 1 AED ≈ 0.22 GBP

export type PropertyType = 'Villa' | 'Apartment' | 'Townhouse' | 'Penthouse' | 'Off-Plan' | 'Commercial';
export type PropertyStatus = 'Available' | 'Leased' | 'Sold' | 'UnderMaintenance' | 'Reserved';
export type FurnishingStatus = 'Furnished' | 'Unfurnished' | 'Semi-Furnished';
export type ViewType = 'Burj Khalifa' | 'Sea / Palm View' | 'Golf Course' | 'Community' | 'Canal View';

/** 32-Field Comprehensive Property Interface */
export interface Property {
  id: string;
  title: string;
  titleArabic?: string;
  community: string;
  subCommunity?: string;
  buildingName?: string;
  developer: string;
  propertyType: PropertyType;
  offPlanStatus?: 'Pre-Launch' | 'Under Construction' | 'Handover Ready' | 'Ready';
  completionDate?: string;
  priceAED: number;
  priceUSD: number;
  priceEUR: number;
  priceGBP: number;
  rentalFrequency?: 'Yearly' | 'Monthly' | 'Short-Term';
  serviceChargePerSqftAED?: number;
  beds: number;
  baths: number;
  sqft: number;
  plotSizeSqft?: number;
  floorNumber?: number;
  furnishingStatus: FurnishingStatus;
  parkingSpaces: number;
  viewType?: ViewType;
  status: PropertyStatus;
  reraPermitNumber: string;
  titleDeedNumber?: string;
  makaniNumber?: string;
  dewaPremisesNumber?: string;
  madmounQrCodeUrl?: string;
  imageUrl?: string;
  assignedBrokerId?: string;
}

/** 100-Employee Workforce Record Interface */
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: 'Sales' | 'Leasing' | 'Compliance' | 'Marketing' | 'Finance' | 'Technology' | 'Executive' | 'HR';
  roleTitle: string;
  accessLevel: number;
  iban: string;
  bankName: string;
  baseSalaryAED: number;
  ytdCommissionAED: number;
  dealsClosedCount: number;
  payoutStatus: 'Paid' | 'Pending' | 'OnHold';
  rating: number; // 1.0 - 5.0
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  priority: string;
  assignedBroker?: string;
  budgetAED?: number;
  aiConfidenceScore?: number;
}

export interface RegulatoryContract {
  id: string;
  contractNumber: string;
  type: string;
  status: string;
}

export interface LeasingTransaction {
  id: string;
  tenantName: string;
  landlordName: string;
  agentAssigned: string;
  propertyId: string;
  viewingCompleted: boolean;
  intakeSigned: boolean;
  depositReceived: boolean;
  ejariGenerated: boolean;
  keysHandedOver: boolean;
  status: 'In-Progress' | 'Completed' | 'Stalled';
}

function withConversions(base: Omit<Property, 'priceUSD' | 'priceEUR' | 'priceGBP'>): Property {
  return {
    ...base,
    priceUSD: Math.round(base.priceAED * AED_TO_USD),
    priceEUR: Math.round(base.priceAED * AED_TO_EUR),
    priceGBP: Math.round(base.priceAED * AED_TO_GBP),
  };
}

const COMMUNITIES = ['DAMAC Hills 2', 'Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Business Bay', 'Jumeirah Village Circle'];
const DEVELOPERS = ['DAMAC', 'Emaar', 'Nakheel', 'Meraas', 'Sobha'];
const PROPERTY_TYPES: PropertyType[] = ['Villa', 'Apartment', 'Townhouse', 'Penthouse', 'Off-Plan', 'Commercial'];
const STATUSES: PropertyStatus[] = ['Available', 'Leased', 'Sold', 'UnderMaintenance', 'Reserved'];
const FURNISHING: FurnishingStatus[] = ['Furnished', 'Unfurnished', 'Semi-Furnished'];
const VIEWS: ViewType[] = ['Burj Khalifa', 'Sea / Palm View', 'Golf Course', 'Community', 'Canal View'];

/** Mock Portfolio of 100 Dubai Real Estate Listings */
export const mockProperties: Property[] = Array.from({ length: 100 }, (_, i) => {
  const priceAED = Math.floor(Math.random() * 12000000) + 1200000;
  const propType = PROPERTY_TYPES[i % PROPERTY_TYPES.length];
  return withConversions({
    id: `prop-${String(i + 1).padStart(3, '0')}`,
    title: `Luxury ${propType} in ${COMMUNITIES[i % COMMUNITIES.length]}`,
    titleArabic: `عقار فاخر في دبي`,
    community: COMMUNITIES[i % COMMUNITIES.length],
    subCommunity: `Cluster ${String.fromCharCode(65 + (i % 6))}`,
    buildingName: propType === 'Apartment' || propType === 'Penthouse' ? `Tower ${i + 1}` : undefined,
    developer: DEVELOPERS[i % DEVELOPERS.length],
    propertyType: propType,
    offPlanStatus: propType === 'Off-Plan' ? 'Under Construction' : 'Ready',
    completionDate: propType === 'Off-Plan' ? '2026-12' : undefined,
    priceAED,
    rentalFrequency: 'Yearly',
    serviceChargePerSqftAED: 14.5,
    beds: (i % 5) + 1,
    baths: (i % 4) + 1,
    sqft: Math.floor(Math.random() * 4500) + 950,
    plotSizeSqft: propType === 'Villa' ? Math.floor(Math.random() * 6000) + 3000 : undefined,
    floorNumber: propType === 'Apartment' ? (i % 30) + 1 : undefined,
    furnishingStatus: FURNISHING[i % FURNISHING.length],
    parkingSpaces: (i % 3) + 1,
    viewType: VIEWS[i % VIEWS.length],
    status: STATUSES[i % STATUSES.length],
    reraPermitNumber: `TRAK-2026-${String(i + 101).padStart(4, '0')}`,
    titleDeedNumber: `TD-DLD-902418-${i + 1}`,
    makaniNumber: `100249871${i % 10}`,
    dewaPremisesNumber: `90281736${i % 10}`,
    madmounQrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=DLD-MADMOUN-${i + 1}`,
    imageUrl: `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80`,
    assignedBrokerId: `emp-0${(i % 30) + 1}`,
  });
});

/** Mock 100-Employee Workforce Matrix */
export const mockEmployees: Employee[] = Array.from({ length: 100 }, (_, i) => {
  const isSales = i < 30;
  const isLeasing = i >= 30 && i < 60;
  const isCompliance = i >= 60 && i < 70;
  const isMarketing = i >= 70 && i < 80;
  const isFinance = i >= 80 && i < 88;
  const isTech = i >= 88 && i < 94;
  const isExec = i >= 94 && i < 98;
  
  let dept: Employee['department'] = 'Sales';
  let role = 'Sales Broker';
  let access = 2;

  if (isLeasing) { dept = 'Leasing'; role = 'Leasing Broker'; access = 2; }
  else if (isCompliance) { dept = 'Compliance'; role = 'Compliance Officer'; access = 3; }
  else if (isMarketing) { dept = 'Marketing'; role = 'Marketing Specialist'; access = 3; }
  else if (isFinance) { dept = 'Finance'; role = 'Finance Accountant'; access = 4; }
  else if (isTech) { dept = 'Technology'; role = 'Full-Stack AI Engineer'; access = 3; }
  else if (isExec) { dept = 'Executive'; role = 'Executive Director'; access = 4; }
  else if (i >= 98) { dept = 'HR'; role = 'HR Manager'; access = 3; }

  if (i === 0) {
    dept = 'Executive';
    role = 'Managing Director (Founder)';
    access = 5;
  }

  const baseSalary = dept === 'Executive' ? 45000 : dept === 'Technology' ? 22000 : 12000;
  const deals = Math.floor(Math.random() * 22) + 2;

  return {
    id: `emp-${String(i + 1).padStart(3, '0')}`,
    name: i === 0 ? 'Arslan Malik' : `Employee ${i + 1}`,
    email: i === 0 ? 'arslanmalikgoraha@gmail.com' : `employee${i + 1}@whitecaves.ae`,
    phone: `+971 50 ${Math.floor(Math.random() * 8999999) + 1000000}`,
    department: dept,
    roleTitle: role,
    accessLevel: access,
    iban: `AE64 0330 0000 ${Math.floor(Math.random() * 8999999999) + 1000000000}`,
    bankName: i % 2 === 0 ? 'Emirates NBD' : 'First Abu Dhabi Bank (FAB)',
    baseSalaryAED: baseSalary,
    ytdCommissionAED: deals * 14500,
    dealsClosedCount: deals,
    payoutStatus: i % 5 === 0 ? 'Pending' : 'Paid',
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
  };
});

/** Mock 100 Leads for Sales Kanban */
export const mockLeads: Lead[] = Array.from({ length: 100 }, (_, i) => ({
  id: `lead-${String(i + 1).padStart(3, '0')}`,
  name: `Client ${i + 1}`,
  email: `client${i + 1}@domain.ae`,
  phone: `+971 55 ${Math.floor(Math.random() * 8999999) + 1000000}`,
  status: ['New', 'Contacted', 'ViewingScheduled', 'Negotiating', 'Closed'][i % 5],
  source: ['Property Finder', 'Bayut', 'WhatsApp', 'Direct'][i % 4],
  priority: i % 3 === 0 ? 'High' : 'Medium',
  assignedBroker: `emp-${String((i % 30) + 1).padStart(3, '0')}`,
  budgetAED: Math.floor(Math.random() * 8000000) + 1500000,
  aiConfidenceScore: Math.floor(Math.random() * 30) + 70,
}));

export const mockRegulatoryContracts: RegulatoryContract[] = [
  { id: 'c-001', contractNumber: 'RERA-F6-90241', type: 'Form F (Sale)', status: 'Approved' },
  { id: 'c-002', contractNumber: 'EJARI-2026-88', type: 'Tenancy Ejari', status: 'Registered' },
];

export const mockLeasingTransactions: LeasingTransaction[] = [
  {
    id: 'tx-001',
    tenantName: 'Sarah Connor',
    landlordName: 'Emaar Properties',
    agentAssigned: 'emp-031',
    propertyId: 'prop-001',
    viewingCompleted: true,
    intakeSigned: true,
    depositReceived: true,
    ejariGenerated: true,
    keysHandedOver: true,
    status: 'Completed',
  },
];
