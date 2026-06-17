/**
 * DLD Mock Service — Dubai Land Department Synthetic Payloads
 * ─────────────────────────────────────────────────────────────
 * Returns RERA-compliant synthetic payloads when DLD_SANDBOX_ENABLED=false
 * or when the live DLD API is unreachable. Wire through compliance.ts behind
 * the USE_MOCK_DLD environment flag.
 *
 * Oqood registration number format: OQD-YYYY-NNNNNNN
 * Title deed number format:         TD-YYYY-NNNNNNN
 * DLD transaction reference format: DLD-YYYY-NNNNNNNN
 *
 * Usage:
 *   import { dldMockService } from './dldMockService.js';
 *   if (process.env.USE_MOCK_DLD === 'true') {
 *     return dldMockService.registerOqood(payload);
 *   }
 */

/** Oqood off-plan registration request payload */
export interface OqoodRegistrationRequest {
  developerId: string;
  projectId: string;
  buyerEmiratesId: string;
  unitNumber: string;
  salePriceAED: number;
  spaDate: string; // ISO 8601
  paymentPlanType: 'installment' | 'full_payment' | 'bank_mortgage';
}

/** Oqood off-plan registration response */
export interface OqoodRegistrationResponse {
  oqoodNumber: string;
  registrationDate: string;
  developerId: string;
  projectId: string;
  unitNumber: string;
  salePriceAED: number;
  buyerEmiratesId: string;
  paymentPlanType: string;
  status: 'registered' | 'pending_payment' | 'rejected';
  expiryDate: string; // 60 days from registration for payment
  _isMock: boolean;
}

/** Title deed transfer response */
export interface TitleDeedTransferResponse {
  titleDeedNumber: string;
  transferDate: string;
  previousOwnerName: string;
  newOwnerName: string;
  propertyId: string;
  salePriceAED: number;
  transferFeeAED: number; // 4% of sale price
  adminFeeAED: number; // AED 580
  trusteeFeeAED: number; // AED 4,000–10,000
  status: 'transferred' | 'pending' | 'rejected';
  registryCode: string;
  _isMock: boolean;
}

/** DLD property transaction lookup response */
export interface DLDTransactionResponse {
  transactionReference: string;
  propertyId: string;
  transactionType: 'sale' | 'lease' | 'mortgage' | 'gift';
  salePriceAED: number;
  area: string;
  community: string;
  building: string;
  unitNumber: string;
  bedrooms: number;
  buaSqft: number;
  transactionDate: string;
  sellerName: string;
  buyerName: string;
  _isMock: boolean;
}

/**
 * Generates a zero-padded random integer string of the given length.
 */
function randomNumericString(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

/**
 * Returns a date string N days from now in ISO 8601 format.
 */
function futureDateISO(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
}

// ─────────────────────────────────────────────────────────────────────────────
// DLD Mock Service
// ─────────────────────────────────────────────────────────────────────────────

export const dldMockService = {
  /**
   * Mock Oqood off-plan registration.
   * Returns a synthetic registration response within the RERA-mandated 60-day window.
   */
  registerOqood(payload: OqoodRegistrationRequest): OqoodRegistrationResponse {
    const year = new Date().getFullYear();
    const oqoodNumber = `OQD-${year}-${randomNumericString(7)}`;

    return {
      oqoodNumber,
      registrationDate: new Date().toISOString(),
      developerId: payload.developerId,
      projectId: payload.projectId,
      unitNumber: payload.unitNumber,
      salePriceAED: payload.salePriceAED,
      buyerEmiratesId: payload.buyerEmiratesId,
      paymentPlanType: payload.paymentPlanType,
      status: 'registered',
      expiryDate: futureDateISO(60), // RERA: buyer must pay within 60 days
      _isMock: true,
    };
  },

  /**
   * Mock title deed transfer.
   * Calculates realistic DLD transfer fees (4% + AED 580 admin + AED 4,000 trustee).
   */
  transferTitleDeed(params: {
    propertyId: string;
    salePriceAED: number;
    previousOwnerName: string;
    newOwnerName: string;
  }): TitleDeedTransferResponse {
    const year = new Date().getFullYear();
    const titleDeedNumber = `TD-${year}-${randomNumericString(7)}`;
    const transferFeeAED = Math.round(params.salePriceAED * 0.04); // 4%
    const adminFeeAED = 580;
    const trusteeFeeAED = 4000;

    return {
      titleDeedNumber,
      transferDate: new Date().toISOString(),
      previousOwnerName: params.previousOwnerName,
      newOwnerName: params.newOwnerName,
      propertyId: params.propertyId,
      salePriceAED: params.salePriceAED,
      transferFeeAED,
      adminFeeAED,
      trusteeFeeAED,
      status: 'transferred',
      registryCode: `DXB-REG-${randomNumericString(6)}`,
      _isMock: true,
    };
  },

  /**
   * Mock DLD transaction lookup.
   * Returns a synthetic transaction record for a given property ID.
   */
  getTransaction(propertyId: string): DLDTransactionResponse {
    const year = new Date().getFullYear();
    const transactionReference = `DLD-${year}-${randomNumericString(8)}`;

    return {
      transactionReference,
      propertyId,
      transactionType: 'sale',
      salePriceAED: 2_500_000,
      area: 'Dubai Marina',
      community: 'Marina Walk',
      building: 'Horizon Tower',
      unitNumber: `${Math.floor(Math.random() * 30) + 1}0${Math.floor(Math.random() * 9) + 1}`,
      bedrooms: 2,
      buaSqft: 1250,
      transactionDate: futureDateISO(-30),
      sellerName: 'Mock Seller LLC',
      buyerName: 'Mock Buyer Holdings',
      _isMock: true,
    };
  },

  /**
   * Returns mock DLD API health status.
   * Used by compliance route to surface mock mode to the frontend.
   */
  getHealthStatus(): { status: 'mock'; message: string; useMock: boolean } {
    return {
      status: 'mock',
      message:
        'DLD Sandbox is disabled. Mock payloads are active. Set DLD_SANDBOX_ENABLED=true to use live API.',
      useMock: true,
    };
  },
};

export type { OqoodRegistrationRequest, OqoodRegistrationResponse };
