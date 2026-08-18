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
