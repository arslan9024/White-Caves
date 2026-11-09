/**
 * RelationshipEntities.data.ts
 * White Caves Real Estate LLC - All System Entities Seed Data
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Data Layer)
 * Single Purpose File Law: < 350 lines
 */

import type { EntityNode } from './RelationshipManager.types';

export const CANONICAL_ALL_ENTITIES: EntityNode[] = [
  // 0. White Caves Parent Organization & Corporate Foundation
  {
    id: 'org-001',
    name: 'White Caves Real Estate LLC',
    type: 'COMPANY',
    badge: 'Parent Corporate Entity',
    description: 'Licensed Real Estate Brokerage licensed by Dubai Land Department (DLD) and DET.',
    color: '#EF4444',
    status: 'ACTIVE',
    deepRoute: '/dashboard/overview',
    details: {
      dedLicense: 'CN-1094821',
      ornNumber: 'ORN-28491',
      taxRegistrationNumber: 'TRN-100458920100003',
      goAmlId: 'FIU-AE-ORG-9182',
      registeredAddress: 'Level 24, Boulevard Plaza Tower 1, Downtown Dubai, UAE',
      isRootEntity: true,
      tradeLicenseActivities: [
        'Real Estate Buying & Selling Brokerage (Code: 7010.01)',
        'Leasing Property Brokerage Agents (Code: 7020.01)',
      ].join(' | '),
    },
  },
  {
    id: 'bank-001',
    name: 'ADCB Escrow Trust Account',
    type: 'BANK_ACCOUNT',
    badge: 'DLD Approved Escrow',
    description: 'Statutory project and rental escrow deposit vault with Abu Dhabi Commercial Bank.',
    color: '#059669',
    status: 'ACTIVE',
    details: {
      bankName: 'Abu Dhabi Commercial Bank (ADCB)',
      iban: 'AE070331234567890123456',
      currency: 'AED',
      accountType: 'ESCROW_TRUST',
    },
  },
  {
    id: 'branch-001',
    name: 'Downtown Dubai HQ Branch',
    type: 'BRANCH',
    badge: 'Flagship Corporate Office',
    description: 'Executive headquarters and luxury client presentation lounge.',
    color: '#6366F1',
    status: 'ACTIVE',
    details: {
      location: 'Downtown Dubai',
      capacityDesks: 48,
      status: 'OPERATIONAL',
    },
  },

  // 1. Users & Staff
  {
    id: 'user-001',
    name: 'Arslan Malik (EMP-001)',
    type: 'USER',
    badge: 'Managing Director (L5)',
    description: 'Sovereign platform executive holding full system execution authority.',
    color: '#EF4444',
    status: 'ACTIVE',
    deepRoute: '/dashboard/employees/EMP-001',
    details: {
      email: 'arslanmalikgoraha@gmail.com',
      role: 'MANAGING_DIRECTOR',
      floorAssignment: 5,
      twoFactor: true,
    },
  },
  {
    id: 'user-002',
    name: 'Layla Al-Maktoum (EMP-002)',
    type: 'USER',
    badge: 'Sales Director (L4)',
    description: 'Executive Sales Director overseeing high-value luxury transactions.',
    color: '#F59E0B',
    status: 'ACTIVE',
    deepRoute: '/dashboard/employees/EMP-002',
    details: {
      email: 'layla@whitecaves.ae',
      role: 'SALES_DIRECTOR',
      floorAssignment: 4,
    },
  },

  // 2. Landlords (Property Owners)
  {
    id: 'landlord-001',
    name: 'Sheikh Mansoor Al-Nahyan (LL-001)',
    type: 'LANDLORD',
    badge: 'KYC Verified Landlord',
    description: 'Owner of luxury freehold assets in DAMAC Hills 2 and Palm Jumeirah.',
    color: '#8B5CF6',
    status: 'VERIFIED',
    details: {
      isVerified: true,
      taxId: 'TRN-100458920100003',
      propertiesOwned: 4,
    },
  },

  // 3. Tenants (Lessees)
  {
    id: 'tenant-001',
    name: 'Hassan Al-Nuaimi (TEN-001)',
    type: 'TENANT',
    badge: 'Verified Lessee',
    description: 'Primary tenant on registered annual lease in DAMAC Hills 2.',
    color: '#10B981',
    status: 'VERIFIED',
    details: {
      isVerified: true,
      emiratesId: '784-1990-1234567-1',
      passportNo: 'A8912301',
      activeContracts: 1,
    },
  },

  // 4. Properties
  {
    id: 'prop-001',
    name: 'DAMAC Hills 2 Luxury Villa (REP-001)',
    type: 'PROPERTY',
    badge: 'Cluster: DAMAC_HILLS_2',
    description: 'Prestige 4-Bedroom Luxury Villa, masked from public view.',
    color: '#3B82F6',
    status: 'VACANT',
    deepRoute: '/dashboard/REproperties/REP-001',
    details: {
      uid: 'PROP-DH2-001',
      cluster: 'DAMAC_HILLS_2',
      vacancyStatus: 'VACANT',
      annualRentAED: 180000,
      isMasked: true,
    },
  },
  {
    id: 'prop-002',
    name: 'Palm Jumeirah VIP Beachfront Villa (REP-002)',
    type: 'PROPERTY',
    badge: 'Cluster: PALM_JUMEIRAH',
    description: 'Frond M Ultra-Luxury Villa on prime private beach.',
    color: '#3B82F6',
    status: 'OCCUPIED',
    deepRoute: '/dashboard/REproperties/REP-002',
    details: {
      uid: 'PROP-PJ-002',
      cluster: 'PALM_JUMEIRAH',
      vacancyStatus: 'OCCUPIED',
      priceAED: 45000000,
      isMasked: true,
    },
  },

  // 5. Tenancy Contracts
  {
    id: 'contract-001',
    name: 'Tenancy Contract TC-2026-001',
    type: 'CONTRACT',
    badge: 'Ejari Attested',
    description: 'DLD registered residential lease agreement with cascade receipts.',
    color: '#06B6D4',
    status: 'ACTIVE',
    details: {
      contractNumber: 'TC-2026-001',
      leaseStart: '2026-11-01',
      leaseEnd: '2027-10-31',
      annualRentAED: 180000,
      commissionAmount: 9000,
    },
  },

  // 6. Deals
  {
    id: 'deal-001',
    name: 'Deal Pipeline WC-D-2026-001',
    type: 'DEAL',
    badge: 'Stage: COMPLETED',
    description: 'Closed leasing transaction with commission booked and XP credited.',
    color: '#C084FC',
    status: 'COMPLETED',
    deepRoute: '/dashboard/deals/DEAL-001',
    details: {
      valueAED: 180000,
      commissionAED: 9000,
      vatAED: 450,
      rewardTierSplit: 0.65,
    },
  },

  // 7. Tasks
  {
    id: 'task-wc-kyc-001',
    name: 'WC-KYC-001: Scan Emirates ID / Passport',
    type: 'TASK',
    badge: 'OCR Extraction',
    description: 'Local OCR processor capturing metadata arrays for tenant onboarding.',
    color: '#10B981',
    status: 'COMPLETED',
    deepRoute: '/dashboard/tasks/WC-KYC-001',
    details: {
      taskCode: 'WC-KYC-001',
      category: 'REGULATORY',
      priority: 'CRITICAL',
      meritXP: 68,
    },
  },
  {
    id: 'task-wc-inv-101',
    name: 'WC-INV-101: Update Property Vacancy Status',
    type: 'TASK',
    badge: 'Inventory Automation',
    description: 'Fluctuates vacancy state and updates live inventory rows instantly.',
    color: '#10B981',
    status: 'IN_PROGRESS',
    deepRoute: '/dashboard/tasks/WC-INV-101',
    details: {
      taskCode: 'WC-INV-101',
      category: 'OPERATIONS',
      priority: 'HIGH',
      meritXP: 34,
    },
  },

  // 8. Documents
  {
    id: 'doc-001',
    name: 'DLD Title Deed Attestation (DOC-001)',
    type: 'DOCUMENT',
    badge: 'Official DLD PDF',
    description: 'Verified digital copy of municipal title deed with QR validation.',
    color: '#38BDF8',
    status: 'VERIFIED',
    deepRoute: '/dashboard/documents/DOC-001',
    details: {
      certificateNumber: 'TD-908124',
      issuingAuthority: 'Dubai Land Department',
    },
  },

  // 9. Invoices
  {
    id: 'inv-001',
    name: 'Tax Invoice WC-INV-2026-001',
    type: 'INVOICE',
    badge: '5% VAT Reconciled',
    description: 'FTA compliant VAT invoice pushed to Zoho Books ledger.',
    color: '#EC4899',
    status: 'ISSUED',
    details: {
      trn: '100458920100003',
      taxableAmountAED: 9000,
      vatAmountAED: 450,
      totalAmountAED: 9450,
    },
  },

  // 10. Cheques
  {
    id: 'chq-001',
    name: 'PDC Cheque #000142 (Emirates NBD)',
    type: 'CHEQUE',
    badge: 'Holding in Escrow',
    description: 'Quarterly rental cheque scheduled for auto-clearing via UAEFTS.',
    color: '#F43F5E',
    status: 'HOLDING',
    details: {
      bankName: 'Emirates NBD',
      amountAED: 45000,
      maturityDate: '2026-11-01',
    },
  },
];

export const ENTITY_TYPE_OPTIONS: Array<{ id: string; label: string }> = [
  { id: 'ALL', label: 'All Entities' },
  { id: 'COMPANY', label: 'Company / Org' },
  { id: 'BANK_ACCOUNT', label: 'Bank & Escrow' },
  { id: 'BRANCH', label: 'Branches' },
  { id: 'USER', label: 'Users' },
  { id: 'LANDLORD', label: 'Landlords' },
  { id: 'TENANT', label: 'Tenants' },
  { id: 'PROPERTY', label: 'Properties' },
  { id: 'CONTRACT', label: 'Contracts' },
  { id: 'DEAL', label: 'Deals' },
  { id: 'TASK', label: 'Tasks' },
  { id: 'DOCUMENT', label: 'Documents' },
  { id: 'INVOICE', label: 'Invoices' },
  { id: 'CHEQUE', label: 'Cheques' },
];
