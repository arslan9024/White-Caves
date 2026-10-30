/**
 * Market Static Data & Type Definitions
 * Canonical Data layer for Dubai Property Market benchmarks & RERA index.
 */

export const VALID_COMPETITOR_PORTALS = ['bayut', 'propertyfinder'] as const;
export type CompetitorPortal = (typeof VALID_COMPETITOR_PORTALS)[number];

export interface AreaBenchmarkRow {
  area: string;
  avgPricePerSqft: number;
  avgAnnualRent: number;
  zone: string;
}

export interface CompetitorPricingRow {
  area: string;
  portal: 'bayut' | 'propertyfinder';
  avgPricePerSqft: number;
  deltaVsWhiteCavesPct: number;
  updatedAt: string;
  source: string;
}

export interface ReraRentalIndexRow {
  area: string;
  propertyType: string;
  bedrooms: string;
  avgRentAed: number;
  allowedIncreaseBelow10Pct: string;
  allowedIncrease10to20Pct: string;
  allowedIncrease20to30Pct: string;
  allowedIncrease30to40Pct: string;
  allowedIncreaseAbove40Pct: string;
}

export const areaBenchmarks: AreaBenchmarkRow[] = [
  { area: 'Palm Jumeirah', avgPricePerSqft: 3800, avgAnnualRent: 260 * 12, zone: 'premium' },
  { area: 'Downtown Dubai', avgPricePerSqft: 3200, avgAnnualRent: 220 * 12, zone: 'premium' },
  { area: 'Emaar Beachfront', avgPricePerSqft: 3500, avgAnnualRent: 240 * 12, zone: 'premium' },
  { area: 'Creek Harbour', avgPricePerSqft: 2900, avgAnnualRent: 195 * 12, zone: 'premium' },
  { area: 'Dubai Marina', avgPricePerSqft: 2600, avgAnnualRent: 175 * 12, zone: 'prime' },
  { area: 'Jumeirah', avgPricePerSqft: 2800, avgAnnualRent: 190 * 12, zone: 'prime' },
  { area: 'Sobha Hartland', avgPricePerSqft: 2400, avgAnnualRent: 160 * 12, zone: 'prime' },
  { area: 'Dubai Hills', avgPricePerSqft: 2100, avgAnnualRent: 135 * 12, zone: 'mid' },
  { area: 'Business Bay', avgPricePerSqft: 2200, avgAnnualRent: 150 * 12, zone: 'mid' },
  { area: 'JLT', avgPricePerSqft: 1500, avgAnnualRent: 100 * 12, zone: 'mid' },
  { area: 'Jumeirah Lake Towers', avgPricePerSqft: 1500, avgAnnualRent: 100 * 12, zone: 'mid' },
  { area: 'Arabian Ranches', avgPricePerSqft: 1800, avgAnnualRent: 110 * 12, zone: 'mid' },
  { area: 'Al Barsha', avgPricePerSqft: 1300, avgAnnualRent: 90 * 12, zone: 'affordable' },
  { area: 'JVC', avgPricePerSqft: 1200, avgAnnualRent: 80 * 12, zone: 'affordable' },
  {
    area: 'Jumeirah Village Circle',
    avgPricePerSqft: 1200,
    avgAnnualRent: 80 * 12,
    zone: 'affordable',
  },
  { area: 'Motor City', avgPricePerSqft: 1050, avgAnnualRent: 72 * 12, zone: 'affordable' },
  { area: 'Sport City', avgPricePerSqft: 1000, avgAnnualRent: 70 * 12, zone: 'affordable' },
  { area: 'Mirdif', avgPricePerSqft: 1100, avgAnnualRent: 75 * 12, zone: 'affordable' },
  { area: 'Bur Dubai', avgPricePerSqft: 950, avgAnnualRent: 65 * 12, zone: 'affordable' },
  { area: 'Deira', avgPricePerSqft: 900, avgAnnualRent: 60 * 12, zone: 'affordable' },
];

// RERA Rental Index (2024 data — static, updated quarterly in production)
export const reraRentalIndex: ReraRentalIndexRow[] = [
  {
    area: 'Downtown Dubai',
    propertyType: 'apartment',
    bedrooms: '1BR',
    avgRentAed: 90000,
    allowedIncreaseBelow10Pct: '0%',
    allowedIncrease10to20Pct: '5%',
    allowedIncrease20to30Pct: '10%',
    allowedIncrease30to40Pct: '15%',
    allowedIncreaseAbove40Pct: '20%',
  },
  {
    area: 'Dubai Marina',
    propertyType: 'apartment',
    bedrooms: '2BR',
    avgRentAed: 110000,
    allowedIncreaseBelow10Pct: '0%',
    allowedIncrease10to20Pct: '5%',
    allowedIncrease20to30Pct: '10%',
    allowedIncrease30to40Pct: '15%',
    allowedIncreaseAbove40Pct: '20%',
  },
  {
    area: 'JVC',
    propertyType: 'apartment',
    bedrooms: '1BR',
    avgRentAed: 48000,
    allowedIncreaseBelow10Pct: '0%',
    allowedIncrease10to20Pct: '5%',
    allowedIncrease20to30Pct: '10%',
    allowedIncrease30to40Pct: '15%',
    allowedIncreaseAbove40Pct: '20%',
  },
];

