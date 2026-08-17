/**
 * HenryDocumentStudio.data.ts — Data, Templates & Configuration Layer
 */

import {
  TenancyContractPayload,
  GovernmentEjariRecord,
  ViewingFormPayload,
  TaxReceiptPayload,
} from '../../../../services/HenryPdfEngineService';
import {
  EmiratesIdExtractedData,
  ARSLAN_MALIK_SAMPLE_EID,
} from '../../../../services/HenryEmiratesIdScannerService';
import {
  DldTitleDeedExtractedData,
  VIRIDIS_504_SAMPLE_TITLE_DEED,
} from '../../../../services/HenryTitleDeedScannerService';
import {
  InternationalPassportExtractedData,
  ARSLAN_MALIK_SAMPLE_PASSPORT,
} from '../../../../services/HenryPassportScannerService';

export interface DocumentTemplateOption {
  id:
    | 'tenancy_contract_esign'
    | 'government_ejari_vault'
    | 'viewing_form_autofill'
    | 'tenant_service_receipt'
    | 'landlord_mgmt_invoice'
    | 'emirates_id_scanner'
    | 'title_deed_scanner'
    | 'passport_scanner'
    | 'tenancy_contract_scanner';
  title: string;
  category:
    | 'Leasing E-Sign'
    | 'Government Vault'
    | 'AI Auto-Fill'
    | 'Tenant Invoices'
    | 'Landlord Invoices'
    | 'AI Optical Scanner';
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
    id: 'tenant_service_receipt',
    title: '4. Tenant Service Charge Receipt & Tax Invoice',
    category: 'Tenant Invoices',
    icon: '🧾',
    description: 'Official tax invoice & receipt for Tenant Service Charges, Admin fees, and Ejari processing (FTA 5% VAT).',
    badge: 'Tenant Voucher',
  },
  {
    id: 'landlord_mgmt_invoice',
    title: '5. Landlord Property Management & Service Invoice',
    category: 'Landlord Invoices',
    icon: '🏢',
    description: 'Tax invoice for Landlord Annual Property Management, Maintenance coordination, and Brokerage fees.',
    badge: 'Landlord Invoice',
  },
  {
    id: 'emirates_id_scanner',
    title: '6. Emirates ID AI Optical Scanner & Auto-Fill',
    category: 'AI Optical Scanner',
    icon: '🪪',
    description: 'Upload UAE Resident ID (Front & Back). Extracts 18 discrete fields, MRZ, and exports variables.',
    badge: 'ICP AI Scanner',
  },
  {
    id: 'title_deed_scanner',
    title: '7. DLD Title Deed AI Optical Scanner & Ingestion',
    category: 'AI Optical Scanner',
    icon: '📜',
    description: 'Upload DLD Title Deed. Extracts 22+ fields (Unit, Areas, Owner, Contract No, Price AED & words).',
    badge: 'DLD AI Scanner',
  },
  {
    id: 'passport_scanner',
    title: '8. International Passport AI Scanner & KYC Hub',
    category: 'AI Optical Scanner',
    icon: '🛂',
    description: 'Upload International Passport. Extracts 16+ fields, 2-line ICAO TD3 MRZ, CNIC & 10-yr validity.',
    badge: 'ICAO TD3 Scanner',
  },
  {
    id: 'tenancy_contract_scanner',
    title: '9. Tenancy Contract AI Scanner & Learner Hub',
    category: 'AI Optical Scanner',
    icon: '🔍',
    description: 'Upload DLD Tenancy Contract. Automated Fill Detection (Filled vs Blank), 92% completeness score, Landlord/Tenant extraction & ML learning.',
    badge: 'Fill Detection AI',
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
  ejariNumber: '0120260721003974',
  contractReference: 'WC-TC-2026-DXB-98442',
  issueDate: '21/07/2026',
  expiryDate: '20/07/2027',
  registeredRentAed: 185000,
  propertyAddress: 'Villa 142, Cluster V, DAMAC Hills 2, Dubai',
  landlordName: 'Tariq Al-Mansoor',
  tenantName: 'Alexander Wright',
  brokerName: 'Arslan Malik Bashir Ahmad',
  brokerBrn: '59821',
  dldBarcodeHash: 'DLD-REST-HASH-0120260721003974-AUTH',
  archivedAt: '2026-08-17 21:00:00 UTC',
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

export const DEMO_TENANT_TAX_RECEIPT: TaxReceiptPayload = {
  receiptNumber: 'INV-WC-TNT-2026-041',
  receiptType: 'tenant_service_charges',
  billedPartyType: 'tenant',
  paidBy: 'Alexander Wright (Tenant)',
  clientTrnOrEid: '784-1990-7654321-2',
  propertyAddress: 'Villa 142, Cluster V, DAMAC Hills 2, Dubai',
  unitNumber: 'Villa 142',
  serviceDescription: 'Tenant Agency Brokerage Commission, Ejari Government Registration & Move-In Service Charges',
  amountAed: 5000,
  vatRatePercent: 5,
  vatAmountAed: 250,
  totalWithVatAed: 5250,
  paidTo: 'WHITE CAVES REAL ESTATE L.L.C',
  whiteCavesTrn: '100488291000003',
  paymentMethod: 'bank_transfer',
  paymentReference: 'ENBD-TNT-SERVICE-98442',
  date: '17/08/2026',
};

export const DEMO_LANDLORD_TAX_INVOICE: TaxReceiptPayload = {
  receiptNumber: 'INV-WC-LL-2026-088',
  receiptType: 'landlord_property_management',
  billedPartyType: 'landlord',
  paidBy: 'Tariq Al-Mansoor (Landlord / Asset Owner)',
  clientTrnOrEid: '784-1982-1234567-1',
  propertyAddress: 'Villa 142, Cluster V, DAMAC Hills 2, Dubai',
  unitNumber: 'Villa 142',
  serviceDescription: 'Annual Comprehensive Property Management Fee, Tenant Sourcing, PDC Supervision & Routine Inspection',
  amountAed: 9250,
  vatRatePercent: 5,
  vatAmountAed: 462.5,
  totalWithVatAed: 9712.5,
  paidTo: 'WHITE CAVES REAL ESTATE L.L.C',
  whiteCavesTrn: '100488291000003',
  paymentMethod: 'uaedds',
  paymentReference: 'DDS-LL-MGMT-2026-088',
  date: '17/08/2026',
};

export const DEFAULT_EID_DATA: EmiratesIdExtractedData = ARSLAN_MALIK_SAMPLE_EID;
export const DEFAULT_TITLE_DEED_DATA: DldTitleDeedExtractedData = VIRIDIS_504_SAMPLE_TITLE_DEED;
export const DEFAULT_PASSPORT_DATA: InternationalPassportExtractedData = ARSLAN_MALIK_SAMPLE_PASSPORT;
