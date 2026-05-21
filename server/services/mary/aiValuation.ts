/**
 * AI Property Valuation Engine
 *
 * Produces an Automated Valuation Model (AVM) for a White Caves property
 * using comparable DLD transaction data + community-level adjustment factors.
 *
 * Methodology (simplified AVM):
 *   1. Pull comparable sales from the in-memory DLD dataset (or future DLD API).
 *   2. Filter comps by: same community, same property type, ±1 bedroom,
 *      transaction date within 6 months.
 *   3. Calculate median price per sqft from comps.
 *   4. Apply adjustment factors:
 *        - Floor premium (high floor: +3%, low floor: -2%)
 *        - View premium (sea/golf: +5%, park: +2%, road: -2%)
 *        - Finishing premium (premium finishes: +5%)
 *        - Age discount (>10 years: -5%)
 *   5. Estimate value = median psf × adjusted psf × BUA.
 *   6. Return estimate ± confidence interval.
 *
 * For live production: replace `SAMPLE_DLD_TRANSACTIONS` with a DLD API call
 * (endpoint: GET api.dubailand.gov.ae/v1/transactions).
 *
 * Used by: POST /api/mary/ai-valuate
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ValuationInput {
  community:     string;   // e.g. "Dubai Marina", "Business Bay"
  propertyType:  'apartment' | 'villa' | 'townhouse' | 'penthouse' | 'studio';
  bedrooms:      number;
  buaSqft:       number;

  // Adjustment inputs (optional)
  floorLevel?:   'low' | 'mid' | 'high' | 'ground';
  viewType?:     'sea' | 'golf' | 'park' | 'pool' | 'community' | 'road';
  finishing?:    'standard' | 'upgraded' | 'premium';
  buildingAge?:  number;   // years
}

export interface DLDTransaction {
  id:            string;
  community:     string;
  propertyType:  string;
  bedrooms:      number;
  buaSqft:       number;
  transactionPrice: number;   // AED
  pricePerSqft:  number;
  transactionDate: string;    // ISO date
}

export interface ValuationResult {
  success:          boolean;
  community:        string;
  estimatedValueAED: number;
  valueLowAED:      number;    // -10% confidence interval
  valueHighAED:     number;    // +10% confidence interval
  pricePerSqftAED:  number;
  comparablesUsed:  number;
  methodology:      string;
  grossYieldPct?:   number;    // if annual rent is provided
  netYieldPct?:     number;
  confidence:       'high' | 'medium' | 'low';
  valuedAt:         string;
  warningNote?:     string;
}

// ─── Sample DLD Transaction Data ─────────────────────────────────────────────
// Illustrative data — replace with DLD API in production.

const SAMPLE_DLD_TRANSACTIONS: DLDTransaction[] = [
  // Dubai Marina — Apartments
  { id: 't001', community: 'Dubai Marina', propertyType: 'apartment', bedrooms: 1, buaSqft: 850,  transactionPrice: 1_100_000, pricePerSqft: 1294, transactionDate: '2025-11-01' },
  { id: 't002', community: 'Dubai Marina', propertyType: 'apartment', bedrooms: 2, buaSqft: 1400, transactionPrice: 1_850_000, pricePerSqft: 1321, transactionDate: '2025-11-15' },
  { id: 't003', community: 'Dubai Marina', propertyType: 'apartment', bedrooms: 1, buaSqft: 900,  transactionPrice: 1_150_000, pricePerSqft: 1278, transactionDate: '2025-12-01' },
  { id: 't004', community: 'Dubai Marina', propertyType: 'apartment', bedrooms: 3, buaSqft: 2000, transactionPrice: 2_900_000, pricePerSqft: 1450, transactionDate: '2025-12-20' },
  // Business Bay — Apartments
  { id: 't005', community: 'Business Bay', propertyType: 'apartment', bedrooms: 1, buaSqft: 780,  transactionPrice: 850_000,   pricePerSqft: 1090, transactionDate: '2025-10-01' },
  { id: 't006', community: 'Business Bay', propertyType: 'apartment', bedrooms: 2, buaSqft: 1250, transactionPrice: 1_480_000, pricePerSqft: 1184, transactionDate: '2025-11-10' },
  { id: 't007', community: 'Business Bay', propertyType: 'apartment', bedrooms: 1, buaSqft: 800,  transactionPrice: 900_000,   pricePerSqft: 1125, transactionDate: '2025-12-05' },
  // Downtown Dubai
  { id: 't008', community: 'Downtown Dubai', propertyType: 'apartment', bedrooms: 1, buaSqft: 900,  transactionPrice: 1_650_000, pricePerSqft: 1833, transactionDate: '2025-11-20' },
  { id: 't009', community: 'Downtown Dubai', propertyType: 'apartment', bedrooms: 2, buaSqft: 1500, transactionPrice: 3_100_000, pricePerSqft: 2067, transactionDate: '2025-12-10' },
  { id: 't010', community: 'Downtown Dubai', propertyType: 'penthouse',  bedrooms: 4, buaSqft: 4000, transactionPrice:14_000_000, pricePerSqft: 3500, transactionDate: '2025-12-15' },
  // Dubai Hills
  { id: 't011', community: 'Dubai Hills',    propertyType: 'villa',     bedrooms: 4, buaSqft: 4500, transactionPrice: 7_500_000, pricePerSqft: 1667, transactionDate: '2025-10-20' },
  { id: 't012', community: 'Dubai Hills',    propertyType: 'townhouse', bedrooms: 3, buaSqft: 2800, transactionPrice: 3_400_000, pricePerSqft: 1214, transactionDate: '2025-11-05' },
  { id: 't013', community: 'Dubai Hills',    propertyType: 'villa',     bedrooms: 5, buaSqft: 6000, transactionPrice:10_200_000, pricePerSqft: 1700, transactionDate: '2025-11-25' },
  // JBR
  { id: 't014', community: 'JBR',            propertyType: 'apartment', bedrooms: 2, buaSqft: 1600, transactionPrice: 2_800_000, pricePerSqft: 1750, transactionDate: '2025-12-01' },
  { id: 't015', community: 'JBR',            propertyType: 'apartment', bedrooms: 1, buaSqft: 950,  transactionPrice: 1_600_000, pricePerSqft: 1684, transactionDate: '2025-12-08' },
  // Palm Jumeirah
  { id: 't016', community: 'Palm Jumeirah',  propertyType: 'villa',     bedrooms: 5, buaSqft: 8000, transactionPrice:22_000_000, pricePerSqft: 2750, transactionDate: '2025-11-01' },
  { id: 't017', community: 'Palm Jumeirah',  propertyType: 'apartment', bedrooms: 2, buaSqft: 1800, transactionPrice: 4_500_000, pricePerSqft: 2500, transactionDate: '2025-12-20' },
];

const SIX_MONTHS_MS = 6 * 30 * 24 * 3600 * 1000;

// ─── Valuation Logic ──────────────────────────────────────────────────────────

function getComparables(input: ValuationInput): DLDTransaction[] {
  const cutoff = new Date(Date.now() - SIX_MONTHS_MS);
  return SAMPLE_DLD_TRANSACTIONS.filter(t =>
    t.community.toLowerCase()    === input.community.toLowerCase() &&
    t.propertyType               === input.propertyType &&
    Math.abs(t.bedrooms - input.bedrooms) <= 1 &&
    new Date(t.transactionDate) >= cutoff
  );
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid    = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[mid]!
    : ((sorted[mid - 1]! + sorted[mid]!) / 2);
}

function adjustmentFactor(input: ValuationInput): number {
  let adj = 1.0;

  // Floor level
  if (input.floorLevel === 'high')   adj += 0.03;
  if (input.floorLevel === 'ground') adj -= 0.02;
  if (input.floorLevel === 'low')    adj -= 0.01;

  // View
  if (input.viewType === 'sea'  || input.viewType === 'golf') adj += 0.05;
  if (input.viewType === 'park' || input.viewType === 'pool') adj += 0.02;
  if (input.viewType === 'road')                              adj -= 0.02;

  // Finishing
  if (input.finishing === 'premium')  adj += 0.05;
  if (input.finishing === 'upgraded') adj += 0.02;

  // Building age
  if (input.buildingAge && input.buildingAge > 10) adj -= 0.05;
  if (input.buildingAge && input.buildingAge > 20) adj -= 0.05; // cumulative

  return Math.max(0.7, Math.min(1.3, adj)); // cap ±30%
}

function confidenceLevel(compCount: number): ValuationResult['confidence'] {
  if (compCount >= 5) return 'high';
  if (compCount >= 2) return 'medium';
  return 'low';
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate an AVM valuation for a property.
 */
export function valuateProperty(
  input: ValuationInput,
  annualRentAED?: number,
): ValuationResult {
  const comps      = getComparables(input);
  const valuedAt   = new Date().toISOString();

  let warningNote: string | undefined;
  let medianPsf: number;

  if (comps.length === 0) {
    // Fallback: use all transactions for same property type (any community)
    const fallbackComps = SAMPLE_DLD_TRANSACTIONS.filter(
      t => t.propertyType === input.propertyType &&
           Math.abs(t.bedrooms - input.bedrooms) <= 1
    );
    medianPsf   = median(fallbackComps.map(t => t.pricePerSqft));
    warningNote = `No direct comparable transactions found for "${input.community}" in last 6 months. Used cross-community estimate.`;
    if (medianPsf === 0) medianPsf = 1200; // absolute fallback
  } else {
    medianPsf = median(comps.map(t => t.pricePerSqft));
  }

  const adj              = adjustmentFactor(input);
  const adjustedPsf      = medianPsf * adj;
  const estimatedValue   = Math.round(adjustedPsf * input.buaSqft);
  const valueLow         = Math.round(estimatedValue * 0.90);
  const valueHigh        = Math.round(estimatedValue * 1.10);

  // Yield calculations (if annual rent known)
  let grossYieldPct: number | undefined;
  let netYieldPct:   number | undefined;
  if (annualRentAED && annualRentAED > 0 && estimatedValue > 0) {
    grossYieldPct = parseFloat(((annualRentAED / estimatedValue) * 100).toFixed(2));
    const serviceFeeEstimate = adjustedPsf * 0.015 * input.buaSqft; // ~1.5 psf/yr typical
    netYieldPct   = parseFloat((((annualRentAED - serviceFeeEstimate) / estimatedValue) * 100).toFixed(2));
  }

  return {
    success:            true,
    community:          input.community,
    estimatedValueAED:  estimatedValue,
    valueLowAED:        valueLow,
    valueHighAED:       valueHigh,
    pricePerSqftAED:    Math.round(adjustedPsf),
    comparablesUsed:    comps.length,
    methodology:        `Median comparable analysis (${comps.length} comp${comps.length !== 1 ? 's' : ''}, 6-month window) + adjustment factor ${(adj * 100).toFixed(0)}%`,
    grossYieldPct,
    netYieldPct,
    confidence:         confidenceLevel(comps.length),
    valuedAt,
    warningNote,
  };
}
