// FILE: src/components/crm/VipPitchBookModal/VipPitchBookModal.types.ts
/**
 * White Caves Real Estate LLC - VIP Pitch Book & Luxury PDF Generator Types
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import type { REPropertyNode } from '../REPropertyManager/REPropertyManager.types';

export interface VipPitchBookData {
  property: REPropertyNode;
  dldTransferFee: number;
  trusteeFee: number;
  totalClosingCosts: number;
  totalFundRequired: number;
  investorYieldPct: number;
  projectedAnnualRent: number;
  qrCodeUrl: string;
  brokerName: string;
  brokerPhone: string;
  brokerEmail: string;
  brokerLicenseRera: string;
  generatedDate: string;
}
