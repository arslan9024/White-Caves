/**
 * DLDUnifiedFormStudio.types.ts
 * Types for Automated Unified DLD Form A/B/I/F Contract Generator & Digital Signature Pad
 * Architecture: AEGIS Single Purpose File Law (< 350 lines)
 * Law: AEG-001–009, Context Triad, Statutory DLD Standard Real Estate Contracts
 */

export type DLDFormType = 'FORM_A' | 'FORM_B' | 'FORM_I' | 'FORM_F';

export interface DLDContractData {
  contractId: string;
  formType: DLDFormType;
  propertyTitle: string;
  propertyAddress: string;
  dldPermitNumber: string;
  titleDeedNumber: string;
  listingPriceAED: number;
  commissionPct: number;
  commissionAmountAED: number;
  sellerOrLandlordName: string;
  sellerEmiratesId: string;
  buyerOrTenantName?: string;
  buyerEmiratesId?: string;
  brokerName: string;
  brokerBrn: string;
  agencyOrn: string;
  validityDays: number;
  statutoryClauses: string[];
  signatureDataUrl?: string;
  signedAt?: string;
  status: 'draft' | 'pending_signature' | 'executed' | 'registered_dld';
}

export interface DLDUnifiedFormStudioProps {
  initialFormType?: DLDFormType;
  initialContract?: Partial<DLDContractData>;
  onExecuteContract?: (contract: DLDContractData) => void;
  onExportPdf?: (contract: DLDContractData) => void;
}
