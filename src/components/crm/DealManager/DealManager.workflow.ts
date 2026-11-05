/**
 * White Caves Real Estate LLC - Deal Manager Workflows
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Workflow)
 * Single Purpose File Law: < 350 lines
 */

import { DealItem, DealType } from './DealManager.types';

export interface DealGatesValidationResult {
  passed: boolean;
  score: number; // 0 to 100
  gates: {
    titleDeedGate: boolean;
    kycGate: boolean;
    offerGate: boolean;
    pdcScheduleGate: boolean;
    ejariFormFGate: boolean;
  };
  missingRequirements: string[];
}

export function executeValidateDealGates(deal: DealItem): DealGatesValidationResult {
  const missingRequirements: string[] = [];

  // Gate 1: Title Deed
  const hasTitleDeed = deal.documents.some(d => d.type === 'TITLE_DEED' && d.verified);
  if (!hasTitleDeed) missingRequirements.push('Verified Title Deed is required');

  // Gate 2: KYC
  const hasKyc = deal.documents.some(
    d =>
      (d.type === 'EMIRATES_ID' || d.type === 'PASSPORT' || d.type === 'TRADE_LICENSE') &&
      d.verified
  );
  if (!hasKyc) missingRequirements.push('Valid Client KYC (Emirates ID/Passport) is required');

  // Gate 3: Offer
  const hasOffer = deal.status !== 'INQUIRY' && deal.status !== 'VIEWING';
  if (!hasOffer) missingRequirements.push('Written offer agreement is required');

  // Gate 4: PDC / Payment
  const hasPdcOrPayment =
    deal.dealType === 'SALES' || (deal.pdcSchedule && deal.pdcSchedule.length > 0);
  if (!hasPdcOrPayment)
    missingRequirements.push('Post-dated cheque schedule is required for lease');

  // Gate 5: Statutory Ejari or Form F
  const hasStatutoryRegistration = deal.documents.some(
    d => (d.type === 'EJARI_CONTRACT' || d.type === 'MOU_FORM_F') && d.verified
  );
  if (!hasStatutoryRegistration && (deal.status === 'EJARI_DLD' || deal.status === 'COMPLETED')) {
    missingRequirements.push('Registered Ejari contract or Form F is required');
  }

  const gates = {
    titleDeedGate: hasTitleDeed,
    kycGate: hasKyc,
    offerGate: hasOffer,
    pdcScheduleGate: hasPdcOrPayment,
    ejariFormFGate: hasStatutoryRegistration,
  };

  const passedCount = Object.values(gates).filter(Boolean).length;
  const score = Math.round((passedCount / 5) * 100);

  return {
    passed: missingRequirements.length === 0,
    score,
    gates,
    missingRequirements,
  };
}

export function calculateDealCommission(
  valueAED: number,
  dealType: DealType,
  customRate?: number
): { commissionAED: number; ratePercent: number; vatAED: number } {
  const rate = customRate !== undefined ? customRate : dealType === 'SALES' ? 2 : 5;
  const grossCommission = (valueAED * rate) / 100;
  const vat = grossCommission * 0.05; // 5% UAE VAT

  return {
    commissionAED: grossCommission,
    ratePercent: rate,
    vatAED: vat,
  };
}
