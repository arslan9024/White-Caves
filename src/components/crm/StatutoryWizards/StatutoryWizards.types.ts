/**
 * White Caves Real Estate LLC - Statutory Wizards Types
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Types)
 * Single Purpose File Law: < 350 lines
 */

export type StatutoryFlowType =
  | 'FORM_A_SELLER_AGREEMENT'
  | 'FORM_B_BUYER_AGREEMENT'
  | 'FORM_F_SALE_MOU'
  | 'EJARI_TENANCY_ATTESTATION'
  | 'PDC_CHEQUE_REGISTRATION'
  | 'TITLE_DEED_VERIFICATION'
  | 'FTA_VAT_TAX_INVOICE';

export interface StatutoryStepDefinition {
  stepNumber: number;
  title: string;
  description: string;
  authority: 'RERA' | 'DLD' | 'FTA' | 'CENTRAL_BANK' | 'DUBAI_MUNICIPALITY';
  fields: {
    key: string;
    label: string;
    defaultValue: string;
    placeholder: string;
    type?: 'text' | 'number' | 'date' | 'select';
    options?: string[];
  }[];
}

export interface StatutoryFlowDefinition {
  flowType: StatutoryFlowType;
  title: string;
  code: string;
  authorityBadge: string;
  authorityColor: string;
  description: string;
  steps: StatutoryStepDefinition[];
  deliverableResultToken: string;
}

export interface StatutoryWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  flowType: StatutoryFlowType;
  targetId?: string; // dealId or taskId or propertyId
  targetTitle?: string;
  onComplete?: (result: {
    flowType: StatutoryFlowType;
    resultToken: string;
    formData: Record<string, string>;
  }) => void;
}
