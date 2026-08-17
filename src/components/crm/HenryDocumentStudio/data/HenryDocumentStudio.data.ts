/**
 * HenryDocumentStudio.data.ts — Data, Templates & Configuration Layer
 */

import {
  TenancyContractPayload,
  GovernmentEjariRecord,
  ViewingFormPayload,
  TaxReceiptPayload,
} from '../../../../services/HenryPdfEngineService';

export interface DocumentTemplateOption {
  id: 'tenancy_contract_esign' | 'government_ejari_vault' | 'viewing_form_autofill' | 'tax_receipt_vat';
  title: string;
  category: 'Leasing E-Sign' | 'Government Vault' | 'AI Auto-Fill' | 'Finance Receipts';
  icon: string;
  description: string;
  badge: string;
}

export const DOCUMENT_TEMPLATES: DocumentTemplateOption[] = [
  {
    id: 'tenancy_contract_esign',
    title: '1. Tenancy Contract (E-Signature)',
    category: 'Leasing E-Sign',
    icon: '✍️',
    description: 'Unified tenancy lease filled with client & property data. Generates shareable e-sign link.',
    badge: 'E-Sign Link Ready',
  },
  {
    id: 'government_ejari_vault',
    title: '2. Government Ejari Certificate Vault',
    category: 'Government Vault',
    icon: '🏛️',
    description: 'Official DLD registered certificate (registered by agent) permanently archived in Henry Vault.',
    badge: 'Official Record',
  },
  {
    id: 'viewing_form_autofill',
    title: '3. Form B Viewing Register (AI Auto-Fill)',
    category: 'AI Auto-Fill',
    icon: '⚡',
    description: '1-Click auto-fill populates viewing register from CRM Lead profile and unit specs.',
    badge: 'AI Auto-Fill',
  },
  {
    id: 'tax_receipt_vat',
    title: '4. Broker Commission Tax Invoice (5% VAT)',
    category: 'Finance Receipts',
    icon: '💵',
    description: 'Official tax invoice with White Caves TRN, 5% VAT calculations, and security deposit vouchers.',
    badge: 'FTA Compliant',
  },
];

export const DEMO_TENANCY_PAYLOAD: TenancyContractPayload = {
  contractNumber: 'WC-TC-2026-DXB-98442',
  propertyTitle: 'Luxury 4-Bedroom Villa with Private Pool',
  unitNumber: 'Villa 142, Cluster V',
  community: 'DAMAC Hills 2 — Akoya Oxygen, Dubai',
  annualRentAed: 185000,
  securityDepositAed: 9250,
  leaseStartDate: '01/09/2026',
  leaseEndDate: '31/08/2027',
  landlord: {
    name: 'Tariq Al-Mansoor',
    emiratesIdOrPassport: '784-1982-1234567-1',
    phone: '+971 50 123 4567',
    email: 'tariq.mansoor@dubailandlord.ae',
  },
  tenant: {
    name: 'Alexander Wright',
    emiratesIdOrPassport: '784-1990-7654321-2',
    phone: '+971 52 987 6543',
    email: 'alex.wright@expatech.io',
  },
  broker: {
    name: 'Arslan Malik Bashir Ahmad',
    brnNumber: '59821',
    agencyOrn: '44483',
    detLicense: '1388443',
  },
  pdcSchedule: [
    { chequeNumber: '000412', dueDate: '01/09/2026', amountAed: 46250, bankName: 'Emirates NBD', status: 'deposited' },
    { chequeNumber: '000413', dueDate: '01/12/2026', amountAed: 46250, bankName: 'Emirates NBD', status: 'pending' },
    { chequeNumber: '000414', dueDate: '01/03/2027', amountAed: 46250, bankName: 'Emirates NBD', status: 'pending' },
    { chequeNumber: '000415', dueDate: '01/06/2027', amountAed: 46250, bankName: 'Emirates NBD', status: 'pending' },
  ],
  specialClauses: [
    'Tenant shall maintain the private garden and pool service contract at their own expense.',
    'Landlord is strictly responsible for HVAC major chiller maintenance exceeding AED 500.',
    '90 days written notice required for renewal or termination via registered email.',
  ],
  esignToken: 'token_sec_dxb_98442_sign',
  esignStatus: 'link_generated',
};

export const DEMO_EJARI_RECORD: GovernmentEjariRecord = {
  ejariNumber: '0120250814005322',
  contractReference: 'WC-TC-2026-DXB-98442',
  issueDate: '14/08/2025',
  expiryDate: '13/08/2026',
  registeredRentAed: 185000,
  propertyAddress: 'Villa 142, Cluster V, DAMAC Hills 2, Dubai',
  landlordName: 'Tariq Al-Mansoor',
  tenantName: 'Alexander Wright',
  brokerName: 'Arslan Malik Bashir Ahmad',
  brokerBrn: '59821',
  dldBarcodeHash: 'DLD-REST-HASH-0120250814005322-AUTH',
  archivedAt: '2026-08-17 19:45:00 UTC',
};

export const DEMO_VIEWING_PAYLOAD: ViewingFormPayload = {
  formId: 'VIEW-REG-8821',
  clientName: 'Alexander Wright',
  clientPhone: '+971 52 987 6543',
  clientPassportOrEid: '784-1990-7654321-2',
  propertyTitle: 'Luxury 4-Bedroom Villa with Private Pool',
  propertyAddress: 'Villa 142, Cluster V, DAMAC Hills 2, Dubai',
  viewingDate: '17/08/2026',
  viewingTime: '17:30 PM',
  agentName: 'Arslan Malik Bashir Ahmad',
  agentBrn: '59821',
  feedbackNotes: 'Client inspected master suite and pool area. Highly interested in signing Form B mandate.',
};

export const DEMO_TAX_RECEIPT: TaxReceiptPayload = {
  receiptNumber: 'INV-WC-2026-0098',
  receiptType: 'agency_commission',
  amountAed: 9250,
  vatRatePercent: 5,
  vatAmountAed: 462.5,
  totalWithVatAed: 9712.5,
  paidBy: 'Alexander Wright',
  paidTo: 'White Caves Real Estate LLC',
  whiteCavesTrn: '100488291000003',
  paymentMethod: 'bank_transfer',
  paymentReference: 'ENBD-TXN-9844201',
  date: '17/08/2026',
};
