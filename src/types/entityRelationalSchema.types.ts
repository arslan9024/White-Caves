/**
 * entityRelationalSchema.types.ts
 * White Caves Real Estate LLC - Unified Relational Entity Schema
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Types Layer)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Data Isolation & Bhakti Protocol Anchors
 */

export type ClientRole = 'LANDLORD' | 'TENANT' | 'BUYER' | 'SELLER';

export type DealStage = 'DRAFTING' | 'SIGNATURE_PENDING' | 'CLEARANCE_RUN' | 'COMPLETED';

export type ChequeStatus = 'HOLDING' | 'DEPOSITED' | 'CLEARED' | 'BOUNCED';

export type TaxInvoiceStatus = 'ISSUED' | 'PAID' | 'CANCELLED';

export interface ClientLoyaltyVoucher {
  voucherCode: string;
  cashbackAED: number;
  unlockedAt: string;
  expiresAt: string;
  redeemed: boolean;
  qualifyingDealNumber: string;
  description: string;
}

export interface ClientProfileEntity {
  id: string;
  customerCode: string; // e.g. "CUST-001"
  fullName: string;
  email: string;
  phone: string;
  role: ClientRole;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  loyaltyVouchers?: ClientLoyaltyVoucher[];
  createdAt: string;
  updatedAt: string;
}

export interface PropertyRelationalEntity {
  id: string;
  uid: string; // Municipal Unique ID (e.g. "PROP-MUNI-001")
  title: string;
  clusterName: string; // e.g. "Frond N Beachfront", "Sector E"
  unitDoorNotation: string; // e.g. "Villa 14", "Penthouse 4501"
  dewaPremiseNumber: string; // Unique DEWA 9-digit premise number
  trakheesiPermit?: string;
  dldTitleDeedNumber?: string;
  propertyType: string;
  status: 'AVAILABLE' | 'UNDER_OFFER' | 'LEASED' | 'SOLD';
  priceAED: number;
  bedrooms: number;
  areaSqft: number;
  location: string;
}

export interface LeaseLedgerEntity {
  id: string;
  ejariNumber: string; // e.g. "0120260908123456"
  contractNumber: string;
  annualRentAED: number;
  securityDepositAED: number;
  startDate: string;
  endDate: string;
  dewaPremiseNumber: string;
  renewalAlertDays: 90 | 60 | 30;
  status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  dealId: string;
  createdAt: string;
}

export interface ChequeEntity {
  id: string;
  chequeNumber: string;
  bankName: string;
  iban: string;
  amountAED: number;
  maturityDate: string;
  status: ChequeStatus;
  bounceReason?: string;
  dealId: string;
  createdAt: string;
}

export interface TaxInvoiceEntity {
  id: string;
  invoiceNumber: string; // e.g. "WC-INV-2026-001"
  trn: string; // UAE FTA Tax Registration Number (15-digit)
  taxableAmountAED: number;
  vatRatePct: number; // Mandatory 5.0%
  vatAmountAED: number; // 5% FTA VAT
  corporateTaxReserveAED: number; // 9% Corporate Tax Reserve Buffer
  totalAmountAED: number;
  status: TaxInvoiceStatus;
  dealId: string;
  createdAt: string;
}

export interface DealPipelineEntity {
  id: string;
  dealNumber: string; // e.g. "WC-D-2026-001"
  title: string;
  stage: DealStage;
  dealType: 'LEASE' | 'SALE';
  valueAED: number;
  commissionAED: number;
  vatAED: number;
  agentCommissionAED: number;
  rewardTierSplit: number; // 0.50 to 0.70 per Bhakti Commission Slab
  propertyId: string;
  clientId: string;
  agentId?: string;
  leases?: LeaseLedgerEntity[];
  cheques?: ChequeEntity[];
  taxInvoices?: TaxInvoiceEntity[];
  createdAt: string;
  updatedAt: string;
}

// ─── UML SECTION 2: STRICT DOMAIN ENTITIES ──────────────────────────────────

export type PropertyCluster =
  | 'DAMAC_HILLS_2'
  | 'DOWNTOWN_DUBAI'
  | 'PALM_JUMEIRAH'
  | 'DUBAI_MARINA'
  | 'BUSINESS_BAY'
  | 'EMIRATES_HILLS';

export type VacancyStatus = 'VACANT' | 'OCCUPIED' | 'PENDING_LEGAL';

export interface UserStaffEntity {
  id: string;
  name: string;
  email: string;
  role: string;
  floorAssignment: number;
  assignedTasks?: TaskNodeRecordEntity[];
}

export interface TenantKYCEntity {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  isVerified: boolean;
  encryptedEmiratesId?: string;
  encryptedPassport?: string;
  contracts?: TenancyContractEntity[];
}

export interface LandlordKYCEntity {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  isVerified: boolean;
  encryptedTaxId?: string;
  properties?: PropertyRelationalEntity[];
}

export interface TenancyContractEntity {
  id: string;
  contractNumber: string;
  leaseStart: string;
  leaseEnd: string;
  annualRentAED: number;
  commissionAmount: number;
  status: 'DRAFT' | 'ATTESTED_EJARI' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  tenantId: string;
  propertyId: string;
  financialLogs?: FinancialReceiptLogEntity[];
}

export interface FinancialReceiptLogEntity {
  id: string;
  receiptNumber: string;
  amountAED: number;
  vatAmountAED: number;
  zohoBooksSynced: boolean;
  contractId: string;
}

export interface TaskNodeRecordEntity {
  id: string;
  taskCode: string;
  title: string;
  category: string;
  priority: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'BLOCKED';
  action: string;
  results: string;
  meritXP: number;
  statutoryAuthority?: string;
  userId?: string;
  propertyId?: string;
  contractId?: string;
}
