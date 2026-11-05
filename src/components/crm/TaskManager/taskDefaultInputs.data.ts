/**
 * White Caves Real Estate LLC - Task Default Inputs Data Helper
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Data)
 * Single Purpose File Law: < 350 lines
 */

import type { TaskNode } from './TaskManager.types';

export function getDefaultInputsForTask(task: TaskNode | null): Record<string, string> {
  if (!task) return {};
  const c = task.taskCode.toUpperCase();
  if (c.includes('DOC-001') || c.includes('TITLE')) {
    return {
      plotNumber: 'PLT-58204-DH2',
      ownerName: 'White Caves Real Estate Holdings LLC',
      areaSqm: '482.50',
      municipality: 'DAMAC Hills 2 (Akoya Oxygen)',
    };
  }
  if (c.includes('DOC-002') || c.includes('EID')) {
    return {
      idNumber: '784-1988-1234567-1',
      holderName: 'Rashid Bin Dhaen',
      nationality: 'United Arab Emirates',
      dob: '1988-06-14',
    };
  }
  if (c.includes('DOC-003') || c.includes('PASSPORT')) {
    return {
      passportNumber: 'N9824102',
      holderName: 'David Alexander Vance',
      nationality: 'United Kingdom',
      issuingCountry: 'GBR',
    };
  }
  if (c.includes('DOC-004') || c.includes('CONTRACT') || c.includes('EJARI')) {
    return {
      annualRent: '145000',
      cheques: '4',
      tenantName: 'Dr. Julian Thorne',
      securityDeposit: '7250',
    };
  }
  if (c.includes('FIN-001') || c.includes('ESCROW')) {
    return {
      projectCode: 'PRJ-DLD-2026-904',
      escrowBalanceAED: '48500000',
      constructionMilestone: '74.5',
      escrowBank: 'Emirates NBD Trustee Branch',
    };
  }
  if (c.includes('FIN-002') || c.includes('VAT')) {
    return {
      standardRatedSupplies: '3200000',
      inputTaxRecoverable: '42000',
      trnNumber: '100-4820-9182-0003',
      taxPeriod: '2026-Q3',
    };
  }
  if (c.includes('FIN-003') || c.includes('PDC') || c.includes('CHEQUE')) {
    return {
      chequesCount: '4',
      totalAmountAED: '145000',
      drawerBank: 'First Abu Dhabi Bank (FAB)',
    };
  }
  if (c.includes('CRM-001') || c.includes('WHATSAPP')) {
    return {
      recipientPhone: '+971501234567',
      clientName: 'Rashid Al-Maktoum',
      templateName: 'whitecaves_exclusive_luxury_villa_preview',
    };
  }
  if (c.includes('PORTAL-001') || c.includes('PORTAL') || c.includes('BAYUT')) {
    return {
      trakheesiPermit: 'TRAK-7194029-A',
      listingPriceAED: '4200000',
      propertyLocation: 'Palm Jumeirah Signature Villa',
    };
  }
  if (c.includes('VAL-001') || c.includes('VALUATION')) {
    return {
      location: 'Downtown Dubai / Burj Crown',
      areaSqft: '2850',
      ratePerSqft: '1850',
    };
  }
  if (c.includes('SEC-001') || c.includes('BIOMETRIC')) {
    return {
      userEmail: 'managing.director@whitecaves.ae',
      authMethod: 'FIDO2 WebAuthn Biometric Enclave',
    };
  }
  return {
    referenceNumber: `REF-${task.taskCode}`,
    operationalNotes: `Standard processing under ${task.reportingChain?.supervisorName || 'Supervisory Lead'}`,
    targetSla: task.defaultSla,
  };
}
