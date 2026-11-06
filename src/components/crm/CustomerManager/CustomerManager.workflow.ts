// FILE: src/components/crm/CustomerManager/CustomerManager.workflow.ts
/**
 * White Caves Real Estate LLC - 18-Step Transaction Workflow Engine
 * Standard: AEGIS Canonical 12-Way Architecture Standard (Workflow - Tier 7)
 * Single Purpose File Law: < 350 lines
 */

import { CustomerItem } from './CustomerManager.types';

export interface WorkflowStepDefinition {
  step: number;
  id: string;
  name: string;
  stage: 'INTAKE' | 'EXPLORATION' | 'NEGOTIATION' | 'COMPLIANCE' | 'CLOSING';
  description: string;
}

export const PIPELINE_18_STEPS: WorkflowStepDefinition[] = [
  {
    step: 1,
    id: 'STEP-01',
    name: 'LEAD_CAPTURE',
    stage: 'INTAKE',
    description: 'Inbound portal or campaign lead captured',
  },
  {
    step: 2,
    id: 'STEP-02',
    name: 'INTAKE_AND_QUALIFICATION',
    stage: 'INTAKE',
    description: 'Budget, timeline & intent qualified',
  },
  {
    step: 3,
    id: 'STEP-03',
    name: 'AGENT_ASSIGNMENT',
    stage: 'INTAKE',
    description: 'Assigned to certified luxury consultant',
  },
  {
    step: 4,
    id: 'STEP-04',
    name: 'PROPERTY_MATCHING',
    stage: 'EXPLORATION',
    description: 'Algorithmic inventory match across communities',
  },
  {
    step: 5,
    id: 'STEP-05',
    name: 'SHORTLIST_PRESENTATION',
    stage: 'EXPLORATION',
    description: 'Curated brochure dispatched via WhatsApp/Email',
  },
  {
    step: 6,
    id: 'STEP-06',
    name: 'VIEWING_SCHEDULED',
    stage: 'EXPLORATION',
    description: 'Confirmed physical tour with tenant/owner',
  },
  {
    step: 7,
    id: 'STEP-07',
    name: 'VIEWING_CONDUCTED',
    stage: 'EXPLORATION',
    description: 'Inspection completed, feedback gathered',
  },
  {
    step: 8,
    id: 'STEP-08',
    name: 'OFFER_SUBMITTED',
    stage: 'NEGOTIATION',
    description: 'Formal written offer submitted to seller/landlord',
  },
  {
    step: 9,
    id: 'STEP-09',
    name: 'NEGOTIATION',
    stage: 'NEGOTIATION',
    description: 'Price, payment schedule & terms aligned',
  },
  {
    step: 10,
    id: 'STEP-10',
    name: 'TERMS_ACCEPTED',
    stage: 'NEGOTIATION',
    description: 'MOU / Term Sheet accepted and countersigned',
  },
  {
    step: 11,
    id: 'STEP-11',
    name: 'KYC_VERIFICATION',
    stage: 'COMPLIANCE',
    description: 'Passport, Emirates ID & AML screening passed',
  },
  {
    step: 12,
    id: 'STEP-12',
    name: 'TITLE_DEED_CHECK',
    stage: 'COMPLIANCE',
    description: 'DLD REST verification of ownership and premise',
  },
  {
    step: 13,
    id: 'STEP-13',
    name: 'CONTRACT_SIGNING',
    stage: 'COMPLIANCE',
    description: 'Unified Tenancy or Form F executed',
  },
  {
    step: 14,
    id: 'STEP-14',
    name: 'PDC_COLLECTION',
    stage: 'CLOSING',
    description: 'Security deposit and sequential rental cheques collected',
  },
  {
    step: 15,
    id: 'STEP-15',
    name: 'EJARI_DLD_REGISTRATION',
    stage: 'CLOSING',
    description: 'Ejari certificate issued / DLD title deed transferred',
  },
  {
    step: 16,
    id: 'STEP-16',
    name: 'KEY_HANDOVER',
    stage: 'CLOSING',
    description: 'Move-in inspection signed and keys handed over',
  },
  {
    step: 17,
    id: 'STEP-17',
    name: 'COMMISSION_COLLECTED',
    stage: 'CLOSING',
    description: 'Agency commission collected & VAT invoice dispatched',
  },
  {
    step: 18,
    id: 'STEP-18',
    name: 'FTA_VAT_FILED',
    stage: 'CLOSING',
    description: '5% UAE VAT filed with Federal Tax Authority',
  },
];

export function execute18StepPipelineTransition(
  currentStep: number,
  targetStep: number
): { success: boolean; nextStep: number; nextStepName: string; reason?: string } {
  if (targetStep < 1 || targetStep > 18) {
    return {
      success: false,
      nextStep: currentStep,
      nextStepName: '',
      reason: 'Invalid step range: must be between 1 and 18.',
    };
  }
  if (targetStep !== currentStep + 1 && targetStep !== currentStep) {
    return {
      success: false,
      nextStep: currentStep,
      nextStepName: '',
      reason: `Cannot skip steps: can only transition from step ${currentStep} to step ${currentStep + 1}.`,
    };
  }

  const def = PIPELINE_18_STEPS.find(s => s.step === targetStep);
  return {
    success: true,
    nextStep: targetStep,
    nextStepName: def ? def.name : '',
  };
}

export function validateCustomerKycRequirements(customer: CustomerItem): {
  compliant: boolean;
  missingFields: string[];
} {
  const missing: string[] = [];
  if (!customer.fullName || customer.fullName.trim().length < 3) missing.push('Full Legal Name');
  if (!customer.email || !customer.email.includes('@')) missing.push('Verified Email');
  if (!customer.phone || customer.phone.length < 7) missing.push('Phone Contact');
  if (!customer.budgetAED || customer.budgetAED <= 0) missing.push('Declared Budget (AED)');

  return {
    compliant: missing.length === 0,
    missingFields: missing,
  };
}
