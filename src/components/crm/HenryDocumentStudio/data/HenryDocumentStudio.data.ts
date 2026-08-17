/**
 * HenryDocumentStudio.data.ts — Data, Templates & Configuration Layer
 */

import { EjariContractPayload } from '../../../../services/HenryPdfEngineService';

export interface DocumentTemplateOption {
  id: 'ejari_form7' | 'dld_form_a' | 'dld_form_b' | 'legal_notice_form12' | 'contractor_work_order';
  title: string;
  category: 'Leasing' | 'Sales' | 'Legal' | 'Maintenance';
  icon: string;
  description: string;
  badge: string;
}

export const DOCUMENT_TEMPLATES: DocumentTemplateOption[] = [
  {
    id: 'ejari_form7',
    title: 'Ejari Form 7 Unified Tenancy Contract',
    category: 'Leasing',
    icon: '📄',
    description: 'Dubai Land Department standard tenancy lease with PDC repayment schedule table.',
    badge: 'RERA Standard',
  },
  {
    id: 'dld_form_a',
    title: 'DLD Form A — Seller Broker Mandate',
    category: 'Sales',
    icon: '📜',
    description: 'Exclusive marketing agreement with Trakheesi Permit QR code verification.',
    badge: 'Trakheesi Compliant',
  },
  {
    id: 'dld_form_b',
    title: 'DLD Form B — Buyer Representation Agreement',
    category: 'Sales',
    icon: '🤝',
    description: 'Official buyer mandate including viewing log & Form F MOU preview.',
    badge: 'Form B Mandate',
  },
  {
    id: 'legal_notice_form12',
    title: 'Form 12 — 12-Month Eviction Notice',
    category: 'Legal',
    icon: '⚖️',
    description: 'Notary Public compliant 12-month notice pursuant to Dubai Law No. 33 of 2008.',
    badge: 'Legal Notary',
  },
  {
    id: 'contractor_work_order',
    title: 'Contractor Work Order & SOW Invoice',
    category: 'Maintenance',
    icon: '🛠️',
    description: 'Scope of Work specification for DAMAC Hills 2 repair tickets with FTA 5% VAT.',
    badge: 'Facilities Order',
  },
];

export const DEMO_EJARI_PAYLOAD: EjariContractPayload = {
  contractNumber: 'EJARI-2026-DXB-98442',
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
};
