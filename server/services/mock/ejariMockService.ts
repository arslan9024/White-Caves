/**
 * Ejari Mock Service — Synthetic Ejari Contract Activation Payloads
 * ───────────────────────────────────────────────────────────────────
 * Returns RERA-compliant synthetic payloads when DLD_SANDBOX_ENABLED=false
 * or when the live Ejari API is unreachable. Wire through compliance.ts behind
 * the USE_MOCK_DLD environment flag (shared flag with DLD mock).
 *
 * Ejari contract activation reference format: EJR-YYYY-NNNNNNN
 * Ejari certificate number format:            EC-YYYY-NNNNNN
 *
 * Usage:
 *   import { ejariMockService } from './ejariMockService.js';
 *   if (process.env.USE_MOCK_DLD === 'true') {
 *     return ejariMockService.activateContract(payload);
 *   }
 */

/** Ejari contract activation request */
export interface EjariActivationRequest {
  leaseId: string;
  landlordEmiratesId: string;
  tenantEmiratesId: string;
  propertyAddress: string;
  annualRentAED: number;
  leaseStartDate: string; // ISO 8601
  leaseEndDate: string; // ISO 8601
  paymentFrequency: 'monthly' | 'quarterly' | 'biannual' | 'annual';
  numberOfCheques: number;
}

/** Ejari contract activation response */
export interface EjariActivationResponse {
  ejariContractNumber: string;
  activationReference: string;
  certificateNumber: string;
  leaseId: string;
  landlordEmiratesId: string;
  tenantEmiratesId: string;
  propertyAddress: string;
  annualRentAED: number;
  leaseStartDate: string;
  leaseEndDate: string;
  status: 'active' | 'pending' | 'rejected';
  activationDate: string;
  expiryDate: string; // matches leaseEndDate
  reraRentalIndexRate: number; // applicable rental index rate (%)
  _isMock: boolean;
}

/** Ejari status check response */
export interface EjariStatusResponse {
  ejariContractNumber: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  leaseId: string;
  tenantName: string;
  propertyAddress: string;
  annualRentAED: number;
  leaseStartDate: string;
  leaseEndDate: string;
  lastRenewalDate: string | null;
  _isMock: boolean;
}

/** Ejari renewal response */
export interface EjariRenewalResponse {
  renewalReference: string;
  newEjariContractNumber: string;
  previousContractNumber: string;
  leaseId: string;
  newLeaseStartDate: string;
  newLeaseEndDate: string;
  newAnnualRentAED: number;
  rentIncreasePercentage: number;
  reraPermittedIncreasePercentage: number; // max % per RERA rental index
  status: 'renewed' | 'pending' | 'rejected';
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
 * Returns a random RERA rental index rate for a Dubai area.
 * Based on approximate 2025/2026 RERA index benchmarks.
 */
function mockReraRentalIndexRate(propertyAddress: string): number {
  const addressLower = propertyAddress.toLowerCase();
  if (addressLower.includes('palm jumeirah')) return 5.2;
  if (addressLower.includes('downtown') || addressLower.includes('difc')) return 4.8;
  if (addressLower.includes('marina') || addressLower.includes('jlt')) return 4.5;
  if (addressLower.includes('business bay')) return 4.3;
  if (addressLower.includes('jvc') || addressLower.includes('discovery gardens')) return 5.0;
  return 4.0; // generic fallback
}

// ─────────────────────────────────────────────────────────────────────────────
// Ejari Mock Service
// ─────────────────────────────────────────────────────────────────────────────

export const ejariMockService = {
  /**
   * Mock Ejari contract activation.
   * Returns a synthetic activation response with RERA-compliant reference numbers.
   */
  activateContract(payload: EjariActivationRequest): EjariActivationResponse {
    const year = new Date().getFullYear();
    const activationReference = `EJR-${year}-${randomNumericString(7)}`;
    const certificateNumber = `EC-${year}-${randomNumericString(6)}`;
    // Ejari contract numbers follow a numeric sequence; use a realistic mock range
    const ejariContractNumber = `${year}${randomNumericString(8)}`;

    return {
      ejariContractNumber,
      activationReference,
      certificateNumber,
      leaseId: payload.leaseId,
      landlordEmiratesId: payload.landlordEmiratesId,
      tenantEmiratesId: payload.tenantEmiratesId,
      propertyAddress: payload.propertyAddress,
      annualRentAED: payload.annualRentAED,
      leaseStartDate: payload.leaseStartDate,
      leaseEndDate: payload.leaseEndDate,
      status: 'active',
      activationDate: new Date().toISOString(),
      expiryDate: payload.leaseEndDate,
      reraRentalIndexRate: mockReraRentalIndexRate(payload.propertyAddress),
      _isMock: true,
    };
  },

  /**
   * Mock Ejari status check for a given lease or contract number.
   */
  getStatus(params: {
    leaseId?: string;
    ejariContractNumber?: string;
  }): EjariStatusResponse {
    const year = new Date().getFullYear();
    const contractNumber =
      params.ejariContractNumber ?? `${year}${randomNumericString(8)}`;
    const leaseStartDate = new Date();
    leaseStartDate.setMonth(leaseStartDate.getMonth() - 6);
    const leaseEndDate = new Date();
    leaseEndDate.setMonth(leaseEndDate.getMonth() + 6);

    return {
      ejariContractNumber: contractNumber,
      status: 'active',
      leaseId: params.leaseId ?? `lease-mock-${randomNumericString(6)}`,
      tenantName: 'Mock Tenant',
      propertyAddress: '4201 Marina Walk, Dubai Marina',
      annualRentAED: 95_000,
      leaseStartDate: leaseStartDate.toISOString(),
      leaseEndDate: leaseEndDate.toISOString(),
      lastRenewalDate: null,
      _isMock: true,
    };
  },

  /**
   * Mock Ejari lease renewal.
   * Validates that the proposed rent increase does not exceed the RERA permitted %.
   * Returns a rejection if the increase exceeds the index; otherwise renews.
   */
  renewContract(params: {
    leaseId: string;
    existingContractNumber: string;
    newAnnualRentAED: number;
    existingAnnualRentAED: number;
    newLeaseStartDate: string;
    newLeaseEndDate: string;
    propertyAddress: string;
  }): EjariRenewalResponse {
    const year = new Date().getFullYear();
    const renewalReference = `EJR-RNW-${year}-${randomNumericString(7)}`;
    const newContractNumber = `${year}${randomNumericString(8)}`;
    const reraPermittedIncrease = mockReraRentalIndexRate(params.propertyAddress);
    const actualIncreasePct =
      ((params.newAnnualRentAED - params.existingAnnualRentAED) /
        params.existingAnnualRentAED) *
      100;

    const status = actualIncreasePct <= reraPermittedIncrease ? 'renewed' : 'rejected';

    return {
      renewalReference,
      newEjariContractNumber: status === 'renewed' ? newContractNumber : '',
      previousContractNumber: params.existingContractNumber,
      leaseId: params.leaseId,
      newLeaseStartDate: params.newLeaseStartDate,
      newLeaseEndDate: params.newLeaseEndDate,
      newAnnualRentAED: params.newAnnualRentAED,
      rentIncreasePercentage: Math.round(actualIncreasePct * 100) / 100,
      reraPermittedIncreasePercentage: reraPermittedIncrease,
      status,
      _isMock: true,
    };
  },

  /**
   * Returns mock Ejari API health status.
   * Used by compliance route to surface mock mode to the frontend.
   */
  getHealthStatus(): { status: 'mock'; message: string; useMock: boolean } {
    return {
      status: 'mock',
      message:
        'Ejari API is in mock mode. Synthetic payloads are active. Set DLD_SANDBOX_ENABLED=true to use live Ejari API.',
      useMock: true,
    };
  },
};
