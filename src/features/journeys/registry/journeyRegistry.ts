/**
 * White Caves Flagship Journey Registry
 * 
 * Defines the 10 Core Flagship Journeys across the 10 Journey Families.
 */

import { JourneyDefinition } from '../../../types/journey';

export const FLAGSHIP_JOURNEYS: Record<string, JourneyDefinition> = {
  // 1. Flagship: Prepare Tenancy Contract
  'prepare-tenancy-contract': {
    id: 'prepare-tenancy-contract',
    title: 'Prepare Tenancy Contract',
    category: 'leasing',
    family: 'Leasing Journeys',
    icon: '📄',
    description: 'Guided mission to assemble verified property, landlord, tenant, contract terms, and required documents into an official Dubai tenancy contract.',
    estimatedMinutes: 4,
    defaultData: {
      propertyId: 'prop_damac_sycamore_131',
      propertyName: 'Sycamore 131',
      community: 'DAMAC Hills 2',
      propertyType: '3 Bedroom Townhouse',
      plotArea: '1,882 sqft',
      buaArea: '2,460 sqft',
      propertyVerified: true,

      landlordId: 'landlord_arslan_malik',
      landlordName: 'Arslan Malik',
      landlordEmail: 'arslan.malik@example.com',
      landlordPhone: '+971 50 123 4567',
      landlordEmiratesId: '784-1988-1234567-1',
      landlordVerified: true,

      tenantId: 'tenant_sarah_jenkins',
      tenantName: 'Sarah Jenkins',
      tenantEmail: 'sarah.jenkins@example.com',
      tenantPhone: '+971 52 987 6543',
      tenantPassportNo: 'N8472910',
      tenantEmiratesId: '784-1992-7654321-2',
      tenantVerified: true,

      annualRent: 95000,
      chequesCount: 2,
      securityDepositPct: 5,
      startDate: '2026-09-01',
      endDate: '2027-08-31',
      usageType: 'Residential',

      documents: {
        landlordEmiratesId: true,
        tenantPassport: true,
        tenantEmiratesId: true,
        titleDeed: true,
        tradeLicense: false,
        previousContract: false
      }
    },
    steps: [
      {
        id: 'property',
        title: 'Property Selection',
        shortLabel: 'Property',
        description: 'Identify and verify the subject property unit and linked ownership.',
        type: 'entity-selection',
        milestoneTag: 'Property Verified',
        requiredFields: ['propertyName', 'community'],
        validate: (data) => {
          const issues = [];
          if (!data.propertyName) {
            issues.push({
              id: 'prop-missing-name',
              stepId: 'property',
              field: 'propertyName',
              title: 'Property Not Selected',
              description: 'Please search and link an active property unit.',
              actionLabel: 'Select Property',
              severity: 'error' as const
            });
          }
          return issues;
        }
      },
      {
        id: 'landlord',
        title: 'Landlord Verification',
        shortLabel: 'Landlord',
        description: 'Review and verify the property owner KYC and contact record.',
        type: 'entity-review',
        milestoneTag: 'Landlord Verified',
        requiredFields: ['landlordName', 'landlordEmail', 'landlordPhone', 'landlordEmiratesId'],
        validate: (data) => {
          const issues = [];
          if (!data.landlordEmail) {
            issues.push({
              id: 'landlord-missing-email',
              stepId: 'landlord',
              field: 'landlordEmail',
              title: 'Landlord Email Missing',
              description: 'Landlord email is required to dispatch contract for electronic signature.',
              actionLabel: 'Add Landlord Email',
              severity: 'error' as const
            });
          }
          return issues;
        }
      },
      {
        id: 'tenant',
        title: 'Tenant Verification',
        shortLabel: 'Tenant',
        description: 'Verify the prospective tenant identity, passport, and Emirates ID.',
        type: 'entity-review',
        milestoneTag: 'Tenant Verified',
        requiredFields: ['tenantName', 'tenantEmail', 'tenantPhone', 'tenantEmiratesId'],
        validate: (data) => {
          const issues = [];
          if (!data.tenantEmiratesId && !data.tenantPassportNo) {
            issues.push({
              id: 'tenant-missing-id',
              stepId: 'tenant',
              field: 'tenantEmiratesId',
              title: 'Tenant ID Document Missing',
              description: 'Either Emirates ID or Passport is mandatory under RERA.',
              actionLabel: 'Add Tenant ID',
              severity: 'error' as const
            });
          }
          return issues;
        }
      },
      {
        id: 'terms',
        title: 'Contract Terms',
        shortLabel: 'Terms',
        description: 'Specify rent amount, payment schedule, cheque distribution, and dates.',
        type: 'form',
        milestoneTag: 'Deal Terms Finalized',
        requiredFields: ['annualRent', 'chequesCount', 'startDate', 'endDate'],
        validate: (data) => {
          const issues = [];
          if (!data.annualRent || Number(data.annualRent) <= 0) {
            issues.push({
              id: 'terms-zero-rent',
              stepId: 'terms',
              field: 'annualRent',
              title: 'Annual Rent Required',
              description: 'Annual rent must be greater than AED 0.',
              actionLabel: 'Enter Rent Amount',
              severity: 'error' as const
            });
          }
          if (new Date(data.endDate) <= new Date(data.startDate)) {
            issues.push({
              id: 'terms-invalid-dates',
              stepId: 'terms',
              field: 'endDate',
              title: 'Invalid Tenancy Period',
              description: 'End date must be after the tenancy start date.',
              actionLabel: 'Adjust Dates',
              severity: 'error' as const
            });
          }
          return issues;
        }
      },
      {
        id: 'documents',
        title: 'Required Documents',
        shortLabel: 'Documents',
        description: 'Verify essential compliance documents checklist before document generation.',
        type: 'checklist',
        milestoneTag: 'Documents Complete',
        validate: (data) => {
          const issues = [];
          const docs = data.documents || {};
          if (!docs.landlordEmiratesId) {
            issues.push({
              id: 'doc-missing-landlord-eid',
              stepId: 'documents',
              title: 'Landlord Emirates ID Required',
              description: 'Upload or confirm Landlord Emirates ID copy.',
              actionLabel: 'Verify Landlord EID',
              severity: 'error' as const
            });
          }
          if (!docs.tenantEmiratesId && !docs.tenantPassport) {
            issues.push({
              id: 'doc-missing-tenant-id',
              stepId: 'documents',
              title: 'Tenant ID Document Required',
              description: 'Upload Tenant Passport or Emirates ID copy.',
              actionLabel: 'Verify Tenant ID',
              severity: 'error' as const
            });
          }
          return issues;
        }
      },
      {
        id: 'review',
        title: 'Smart Review',
        shortLabel: 'Review',
        description: 'High-confidence review of all entity parameters and clauses.',
        type: 'smart-review'
      },
      {
        id: 'processing',
        title: 'Generating Contract',
        shortLabel: 'Generate',
        description: 'Executing document generation, clause compilation, and RERA formatting.',
        type: 'processing'
      },
      {
        id: 'result',
        title: 'Tenancy Contract Ready',
        shortLabel: 'Outcome',
        description: 'Contract generated and ready for digital dispatch, signature, and Ejari.',
        type: 'result'
      }
    ]
  },

  // 2. Property Onboarding
  'property-onboarding': {
    id: 'property-onboarding',
    title: 'Property Onboarding',
    category: 'property',
    family: 'Property Journeys',
    icon: '🏠',
    description: 'Capture unit details, deed verification, floor plans, specs, and assign designated listing agent.',
    estimatedMinutes: 5,
    steps: [
      { id: 'basics', title: 'Basic Information', type: 'form', requiredFields: ['title', 'propertyType', 'community'] },
      { id: 'ownership', title: 'Ownership & Deed', type: 'entity-review', requiredFields: ['titleDeedNo', 'ownerId'] },
      { id: 'specs', title: 'Specifications & Amenities', type: 'form' },
      { id: 'media', title: 'Photos & Media', type: 'checklist' },
      { id: 'review', title: 'Review & Publish', type: 'smart-review' },
      { id: 'result', title: 'Property Onboarded', type: 'result' }
    ]
  },

  // 3. Landlord Onboarding
  'landlord-onboarding': {
    id: 'landlord-onboarding',
    title: 'Landlord Onboarding',
    category: 'landlord',
    family: 'Landlord Journeys',
    icon: '👤',
    description: 'Complete landlord KYC, Emirates ID/Passport verification, bank account details for rent remittance, and Form A agreement.',
    estimatedMinutes: 4,
    steps: [
      { id: 'contact', title: 'Contact Details', type: 'form', requiredFields: ['name', 'email', 'phone'] },
      { id: 'kyc', title: 'KYC & ID Verification', type: 'checklist', requiredFields: ['emiratesId'] },
      { id: 'banking', title: 'Bank Account Details', type: 'form', requiredFields: ['iban', 'bankName'] },
      { id: 'review', title: 'Review Profile', type: 'smart-review' },
      { id: 'result', title: 'Landlord Approved', type: 'result' }
    ]
  },

  // 4. Tenant Onboarding
  'tenant-onboarding': {
    id: 'tenant-onboarding',
    title: 'Tenant Onboarding',
    category: 'tenant',
    family: 'Tenant Journeys',
    icon: '👤',
    description: 'Onboard prospective tenant, verify employment/visa, passport, Emirates ID, and pre-screen affordability.',
    estimatedMinutes: 4,
    steps: [
      { id: 'profile', title: 'Tenant Profile', type: 'form', requiredFields: ['name', 'email', 'phone'] },
      { id: 'documents', title: 'Identity & Visa', type: 'checklist' },
      { id: 'preferences', title: 'Leasing Preferences', type: 'form' },
      { id: 'review', title: 'Screening Review', type: 'smart-review' },
      { id: 'result', title: 'Tenant Onboarded', type: 'result' }
    ]
  },

  // 5. Leasing Deal Creation
  'leasing-deal-creation': {
    id: 'leasing-deal-creation',
    title: 'Create Leasing Deal',
    category: 'leasing',
    family: 'Leasing Journeys',
    icon: '🔑',
    description: 'Convert an accepted offer into an active deal pipeline with commission calculation, agency fee, and milestones.',
    estimatedMinutes: 3,
    steps: [
      { id: 'parties', title: 'Property & Parties', type: 'entity-selection' },
      { id: 'financials', title: 'Financial Terms', type: 'form' },
      { id: 'commission', title: 'Agency Commission', type: 'form' },
      { id: 'review', title: 'Confirm Deal', type: 'smart-review' },
      { id: 'result', title: 'Deal Active', type: 'result' }
    ]
  },

  // 6. Contract Signing
  'contract-signing': {
    id: 'contract-signing',
    title: 'Contract Digital Signing',
    category: 'leasing',
    family: 'Leasing Journeys',
    icon: '✍️',
    description: 'Dispatch tenancy agreement to Landlord and Tenant via UAE PASS / DocuSign and track real-time signature audit trail.',
    estimatedMinutes: 2,
    steps: [
      { id: 'contract-select', title: 'Select Contract', type: 'entity-selection' },
      { id: 'signers', title: 'Verify Signatories', type: 'entity-review' },
      { id: 'dispatch', title: 'Dispatch Invitations', type: 'processing' },
      { id: 'result', title: 'Signing Active', type: 'result' }
    ]
  },

  // 7. Payment Collection
  'payment-collection': {
    id: 'payment-collection',
    title: 'Payment & Cheque Collection',
    category: 'leasing',
    family: 'Finance Journeys',
    icon: '💰',
    description: 'Record rent post-dated cheques (PDCs), security deposit receipt, VAT invoice generation, and custodial escrow tracking.',
    estimatedMinutes: 4,
    steps: [
      { id: 'contract-ref', title: 'Contract Reference', type: 'entity-selection' },
      { id: 'deposit', title: 'Security Deposit', type: 'form' },
      { id: 'cheques', title: 'Post-Dated Cheques (PDC)', type: 'checklist' },
      { id: 'receipt', title: 'Generate Receipts & Invoice', type: 'smart-review' },
      { id: 'result', title: 'Payments Recorded', type: 'result' }
    ]
  },

  // 8. Create Ejari
  'create-ejari': {
    id: 'create-ejari',
    title: 'Ejari Registration',
    category: 'compliance',
    family: 'Compliance Journeys',
    icon: '🏛️',
    description: 'Register official tenancy contract with Dubai Land Department (DLD) REST API / Ejari portal and obtain Ejari certificate.',
    estimatedMinutes: 3,
    steps: [
      { id: 'prerequisites', title: 'Ejari Prerequisites Check', type: 'checklist' },
      { id: 'dld-payload', title: 'Review DLD Payload', type: 'smart-review' },
      { id: 'submission', title: 'Submit to DLD', type: 'processing' },
      { id: 'result', title: 'Ejari Registered', type: 'result' }
    ]
  },

  // 9. Property Handover
  'property-handover': {
    id: 'property-handover',
    title: 'Property Handover & Move-In',
    category: 'property-management',
    family: 'Property Management Journeys',
    icon: '🚪',
    description: 'Conduct move-in snagging inspection, record DEWA meter readings, inventory check, and hand over access keys/cards.',
    estimatedMinutes: 5,
    steps: [
      { id: 'handover-details', title: 'Handover Appointment', type: 'form' },
      { id: 'snagging', title: 'Inspection & Meter Readings', type: 'checklist' },
      { id: 'keys', title: 'Key & Access Handover', type: 'checklist' },
      { id: 'signoff', title: 'Tenant Sign-Off', type: 'smart-review' },
      { id: 'result', title: 'Handover Complete', type: 'result' }
    ]
  },

  // 10. Tenancy Renewal
  'tenancy-renewal': {
    id: 'tenancy-renewal',
    title: 'Tenancy Contract Renewal',
    category: 'leasing',
    family: 'Leasing Journeys',
    icon: '🔄',
    description: 'Check RERA Rental Index calculator allowable increase, dispatch 90-day renewal notice, negotiate terms, and renew agreement.',
    estimatedMinutes: 4,
    steps: [
      { id: 'current-lease', title: 'Current Lease Check', type: 'entity-selection' },
      { id: 'rera-index', title: 'RERA Rental Index Evaluation', type: 'form' },
      { id: 'terms-update', title: 'Updated Renewal Terms', type: 'form' },
      { id: 'review', title: 'Review Renewal', type: 'smart-review' },
      { id: 'result', title: 'Renewal Dispatched', type: 'result' }
    ]
  },

  // 11. Secondary Sales Deal
  'secondary-sales-deal': {
    id: 'secondary-sales-deal',
    title: 'Secondary Sales Deal & Form F',
    category: 'sales',
    family: 'Sales Journeys',
    icon: '🤝',
    description: 'Structure secondary resale transaction: Form A (Seller) + Form B (Buyer) matching, Unified Form F generation, escrow security deposit, and DLD Trustee registration.',
    estimatedMinutes: 5,
    steps: [
      { id: 'parties', title: 'Buyer & Seller Verification', type: 'entity-selection' },
      { id: 'property', title: 'Title Deed & NOC Validation', type: 'entity-review' },
      { id: 'financials', title: 'Sale Price & Escrow Terms', type: 'form' },
      { id: 'form-f', title: 'Form F Clause Assembler', type: 'smart-review' },
      { id: 'trustee', title: 'DLD Trustee Submission', type: 'processing' },
      { id: 'result', title: 'Sale Closed & Registered', type: 'result' }
    ]
  },

  // 12. Mortgage Pre-Approval
  'mortgage-preapproval': {
    id: 'mortgage-preapproval',
    title: 'Mortgage Pre-Approval & Affordability',
    category: 'finance',
    family: 'Finance Journeys',
    icon: '💰',
    description: 'Assess buyer financing eligibility against UAE Central Bank Debt-Burden Ratio (DBR) 50% limit, compare ADCB/ENBD lender rates, and issue pre-approval dossier.',
    estimatedMinutes: 4,
    steps: [
      { id: 'buyer-profile', title: 'Income & DBR Evaluation', type: 'form' },
      { id: 'bank-compare', title: 'Lender Product Comparison', type: 'checklist' },
      { id: 'docs-upload', title: 'Salary & Bank Statements', type: 'checklist' },
      { id: 'review', title: 'Affordability Certificate', type: 'smart-review' },
      { id: 'result', title: 'Pre-Approval Issued', type: 'result' }
    ]
  },

  // 13. Golden Visa Application
  'golden-visa-application': {
    id: 'golden-visa-application',
    title: 'UAE 10-Year Golden Visa Verification',
    category: 'wealth',
    family: 'VIP Wealth Journeys',
    icon: '👑',
    description: 'Verify AED 2,000,000+ unencumbered real estate equity, cross-reference DLD title deeds, and assemble official dossier for GDRFA / ICP nomination.',
    estimatedMinutes: 5,
    steps: [
      { id: 'investor-kyc', title: 'Investor Passport & KYC', type: 'entity-review' },
      { id: 'equity-check', title: 'AED 2M Equity Valuation', type: 'form' },
      { id: 'title-deed', title: 'DLD Title Deed Validation', type: 'checklist' },
      { id: 'dossier', title: 'Assemble GDRFA Nomination Pack', type: 'smart-review' },
      { id: 'result', title: 'Golden Visa Ready', type: 'result' }
    ]
  },

  // 14. Off-Plan Project Reservation
  'offplan-reservation': {
    id: 'offplan-reservation',
    title: 'Off-Plan Project Allocation & Oqood',
    category: 'projects',
    family: 'Project Journeys',
    icon: '🏗️',
    description: 'Reserve off-plan inventory directly from master developers (Emaar/DAMAC/Nakheel), configure installment milestone plans, and register initial Oqood title.',
    estimatedMinutes: 4,
    steps: [
      { id: 'project-unit', title: 'Select Developer & Unit', type: 'entity-selection' },
      { id: 'payment-plan', title: 'Installment Milestone Plan', type: 'form' },
      { id: 'eoi-deposit', title: 'EOI Token Deposit Receipt', type: 'form' },
      { id: 'spa-review', title: 'Developer SPA & Oqood Terms', type: 'smart-review' },
      { id: 'result', title: 'Unit Reserved & Oqood Active', type: 'result' }
    ]
  },

  // 15. Property Snagging Inspection
  'property-snagging-inspection': {
    id: 'property-snagging-inspection',
    title: 'Digital Snagging Defect Inspection',
    category: 'property-management',
    family: 'Property Management Journeys',
    icon: '🔍',
    description: 'Perform systematic room-by-room physical snagging audit, classify architectural/MEP defects with photo OCR, and dispatch formal Defect Liability Period (DLP) claim.',
    estimatedMinutes: 6,
    steps: [
      { id: 'unit-schedule', title: 'Inspection Appointment', type: 'entity-selection' },
      { id: 'defect-logging', title: 'Architectural & MEP Punch-List', type: 'form' },
      { id: 'photo-evidence', title: 'Upload Defect Photos', type: 'checklist' },
      { id: 'dlp-report', title: 'Compile Contractor DLP Claim', type: 'smart-review' },
      { id: 'result', title: 'Snagging Report Dispatched', type: 'result' }
    ]
  },

  // 16. VAT Quarterly Filing
  'vat-quarterly-filing': {
    id: 'vat-quarterly-filing',
    title: 'UAE FTA Form 201 VAT Return Filing',
    category: 'finance',
    family: 'Finance Journeys',
    icon: '💳',
    description: 'Audit 5% standard rated real estate supplies, exempt transactions, calculate input tax credits across 42 expense categories, and generate EmaraTax XML.',
    estimatedMinutes: 4,
    steps: [
      { id: 'tax-period', title: 'Select Tax Period & TRN', type: 'form' },
      { id: 'output-tax', title: 'Box 1: Standard Rated Supplies', type: 'form' },
      { id: 'input-tax', title: 'Box 9: Recoverable Input Tax', type: 'form' },
      { id: 'fta-return', title: 'Review Box 12 Net VAT Due', type: 'smart-review' },
      { id: 'result', title: 'FTA Form 201 Ready to File', type: 'result' }
    ]
  },

  // 17. Tenant Move-Out Settlement
  'tenant-moveout-settlement': {
    id: 'tenant-moveout-settlement',
    title: 'Tenant Move-Out & Deposit Settlement',
    category: 'leasing',
    family: 'Leasing Journeys',
    icon: '🚪',
    description: 'Audit final condition against check-in report, calculate legitimate maintenance deductions, clear final DEWA/Empower bills, and refund security deposit.',
    estimatedMinutes: 4,
    steps: [
      { id: 'tenancy-select', title: 'Select Expiring Tenancy', type: 'entity-selection' },
      { id: 'moveout-audit', title: 'Exit Snagging & Meter Readings', type: 'checklist' },
      { id: 'deductions', title: 'Maintenance & Utility Deductions', type: 'form' },
      { id: 'settlement', title: 'Generate Deposit Refund Statement', type: 'smart-review' },
      { id: 'result', title: 'Deposit Settled & Ejari Closed', type: 'result' }
    ]
  },

  // 18. AML & PEP Sanctions Screening
  'aml-pep-sanctions-screening': {
    id: 'aml-pep-sanctions-screening',
    title: 'goAML PEP & Sanctions Compliance Audit',
    category: 'compliance',
    family: 'Compliance Journeys',
    icon: '🛡️',
    description: 'Execute mandatory UAE Financial Intelligence Unit (FIU) screening against UN, UAE Local Terrorist, and global PEP lists with statutory Risk Scorecard.',
    estimatedMinutes: 3,
    steps: [
      { id: 'party-identity', title: 'Client & Beneficial Owner Data', type: 'entity-selection' },
      { id: 'sanctions-scan', title: 'Automated Database Scan', type: 'processing' },
      { id: 'cdd-audit', title: 'Enhanced Due Diligence (EDD)', type: 'checklist' },
      { id: 'risk-score', title: 'Statutory AML Risk Rating', type: 'smart-review' },
      { id: 'result', title: 'AML Clearance Certificate', type: 'result' }
    ]
  },

  // 19. Lead Acquisition & AI Qualification
  'lead-acquisition-qualification': {
    id: 'lead-acquisition-qualification',
    title: 'Lead Ingestion & 100-Point AI Scoring',
    category: 'marketing',
    family: 'Marketing Journeys',
    icon: '🎯',
    description: 'Capture inbound leads across WhatsApp, Bayut, and Property Finder, run deduplication & enrichment, and execute 100-point conversion velocity scoring.',
    estimatedMinutes: 3,
    steps: [
      { id: 'lead-capture', title: 'Lead Ingestion & Contact Details', type: 'form' },
      { id: 'enrichment', title: 'Budget & Community Preferences', type: 'form' },
      { id: 'ai-scoring', title: '100-Point Conversion Model', type: 'processing' },
      { id: 'assignment', title: 'Assign to Sales Podium Agent', type: 'smart-review' },
      { id: 'result', title: 'Lead Qualified & Dispatched', type: 'result' }
    ]
  },

  // 20. Community Facilities Maintenance Ticket
  'community-service-ticket': {
    id: 'community-service-ticket',
    title: 'Community Facilities & Maintenance Ticket',
    category: 'community',
    family: 'Community Journeys',
    icon: '🔧',
    description: 'Log resident service request, categorize urgency level, automatically dispatch approved vendor contractor with 2-hour SLA, and capture completion sign-off.',
    estimatedMinutes: 3,
    steps: [
      { id: 'ticket-details', title: 'Resident & Issue Description', type: 'form' },
      { id: 'sla-triage', title: 'Triage Priority & Category', type: 'form' },
      { id: 'vendor-dispatch', title: 'Assign Certified Contractor', type: 'entity-selection' },
      { id: 'completion-signoff', title: 'Review Work & Cost Approval', type: 'smart-review' },
      { id: 'result', title: 'Ticket Resolved & Closed', type: 'result' }
    ]
  }
};

export const getAllJourneys = (): JourneyDefinition[] => {
  return Object.values(FLAGSHIP_JOURNEYS);
};

export const getJourneyById = (id: string): JourneyDefinition | undefined => {
  return FLAGSHIP_JOURNEYS[id];
};

export const getJourneysByCategory = (category: string): JourneyDefinition[] => {
  return Object.values(FLAGSHIP_JOURNEYS).filter(j => j.category === category);
};
