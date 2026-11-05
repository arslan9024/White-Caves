/**
 * taskExecutors.test.ts
 * 7-Category Architecture: Test Layer
 * Comprehensive Verification of 13 Feature-as-a-Task Functional Executors
 * Single Purpose File Law: < 350 lines
 */

import { describe, it, expect } from 'vitest';
import {
  executeTitleDeedTask,
  executeEmiratesIdTask,
  executePassportTask,
  executeTenancyContractTask,
  executeEscrowAuditTask,
  executeVatReturnTask,
  executePdcTrackingTask,
  executeEjariGenerationTask,
  executeReraBrokerCardTask,
  executeWhatsAppBroadcastTask,
  executePortalSyndicationTask,
  executePropertyValuationTask,
  executeBiometricSecurityTask,
} from './taskExecutors.workflow';
import { executeTaskFunctionalRunWorkflow } from './TaskManager.workflow';
import { OPERATIONAL_TOOL_TASKS } from './TaskManager.tools.data';
import { buildCanonical200Tasks } from './TaskManager.data';

describe('Feature-as-a-Task Functional Executors Suite (Law T1 & T7)', () => {
  it('verifies that buildCanonical200Tasks generates 600+ tasks covering all 6 parts & operational tools', () => {
    const tasks = buildCanonical200Tasks();
    expect(tasks.length).toBeGreaterThanOrEqual(600);

    const titleTask = tasks.find(t => t.taskCode === 'T-DOC-001');
    expect(titleTask).toBeDefined();
    expect(titleTask?.statutoryAuthority).toContain('Dubai Land Department');

    const vatTask = tasks.find(t => t.taskCode === 'T-FIN-002');
    expect(vatTask).toBeDefined();
    expect(vatTask?.category).toBe('FINANCE');

    // Part 3 checks (201-300)
    expect(tasks.find(t => t.taskCode === 'TSK-201')).toBeDefined();
    expect(tasks.find(t => t.taskCode === 'TSK-300')).toBeDefined();

    // Part 4 checks (301-400)
    expect(tasks.find(t => t.taskCode === 'TSK-301')).toBeDefined();
    expect(tasks.find(t => t.taskCode === 'TSK-400')).toBeDefined();

    // Part 5 checks (401-500)
    expect(tasks.find(t => t.taskCode === 'TSK-401')).toBeDefined();
    expect(tasks.find(t => t.taskCode === 'TSK-500')).toBeDefined();

    // Part 6 checks (501-600)
    expect(tasks.find(t => t.taskCode === 'TSK-511')).toBeDefined();
    expect(tasks.find(t => t.taskCode === 'TSK-600')).toBeDefined();
  });

  it('executes T-DOC-001: Title Deed scan with square footage and clean title audit', () => {
    const res = executeTitleDeedTask({
      plotNumber: 'PLT-9981-DOWNTOWN',
      ownerName: 'Al-Hashemi Holdings LLC',
      areaSqm: '500',
    });

    expect(res.outputs.documentType).toContain('Title Deed');
    expect(res.outputs.plotNumber).toBe('PLT-9981-DOWNTOWN');
    expect(res.outputs.cleanTitleVerified).toBe(true);
    expect(res.outputs.areaSqft).toBe(5382);
    expect(res.auditNotes.length).toBeGreaterThanOrEqual(3);
  });

  it('executes T-DOC-002: Emirates ID scan with checksum validation', () => {
    const res = executeEmiratesIdTask({
      idNumber: '784-1990-1234567-1',
      holderName: 'Fatima Al-Zahra',
    });

    expect(res.outputs.idNumber).toBe('784-1990-1234567-1');
    expect(res.outputs.cardHolderNameEn).toBe('Fatima Al-Zahra');
    expect(res.outputs.icpValidationStatus).toBe('VALID_ACTIVE');
    expect(res.outputs.cardChipVerified).toBe(true);
  });

  it('executes T-DOC-003: Passport MRZ verification and GDRFA clearance', () => {
    const res = executePassportTask({
      passportNumber: 'GBR849201',
      holderName: 'Eleanor Vance',
    });

    expect(res.outputs.passportNumber).toBe('GBR849201');
    expect(res.outputs.mrzChecksumVerified).toBe(true);
    expect(res.outputs.gdrfaClearance).toBe('APPROVED_INVESTOR');
  });

  it('executes T-DOC-004: Tenancy contract clause extraction and RERA index check', () => {
    const res = executeTenancyContractTask({
      annualRent: '200000',
      cheques: '4',
      tenantName: 'Omar Farooq',
    });

    expect(res.outputs.annualRentAED).toBe(200000);
    expect(res.outputs.perChequeAED).toBe(50000);
    expect(res.outputs.numberOfCheques).toBe(4);
    expect(res.outputs.reraIndexBracket).toBe('RENT_ALIGNED_WITH_OFFICIAL_INDEX');
  });

  it('executes T-FIN-001: Escrow account milestone and liquidity verification', () => {
    const res = executeEscrowAuditTask({
      escrowBalanceAED: '50000000',
      constructionMilestone: '80',
    });

    expect(res.outputs.certifiedMilestonePercent).toBe('80%');
    expect(res.outputs.milestoneDisbursementAuthorized).toBe(true);
    expect(res.outputs.statutoryRetentionAED).toBe(2500000);
  });

  it('executes T-FIN-002: FTA 5% Corporate VAT return computation', () => {
    const res = executeVatReturnTask({
      standardRatedSupplies: '1000000',
      inputTaxRecoverable: '10000',
    });

    expect(res.outputs.standardRatedSuppliesAED).toBe(1000000);
    expect(res.outputs.outputVatDueAED).toBe(50000);
    expect(res.outputs.recoverableInputTaxAED).toBe(10000);
    expect(res.outputs.netVatPayableAED).toBe(40000);
  });

  it('executes T-FIN-003: Central Bank UAE PDC batch tracking', () => {
    const res = executePdcTrackingTask({
      chequesCount: '6',
      totalAmountAED: '180000',
    });

    expect(res.outputs.totalChequesEnrolled).toBe(6);
    expect(res.outputs.averageChequeAmountAED).toBe(30000);
    expect(res.outputs.bounceRiskRating).toContain('LOW');
  });

  it('executes T-REG-001: Ejari electronic lease certificate registration', () => {
    const res = executeEjariGenerationTask({
      annualRent: '120000',
      premisesNumber: 'DAMAC-HILLS-VILLA-44',
    });

    expect(res.outputs.ejariCertificateNumber).toMatch(/^EJ-\d+/);
    expect(res.outputs.attestationStatus).toContain('OFFICIALLY_REGISTERED');
    expect(res.outputs.annualRentAED).toBe(120000);
  });

  it('executes T-REG-002: RERA broker card electronic validation', () => {
    const res = executeReraBrokerCardTask({
      brokerCardNumber: 'BRN-10029',
      agentName: 'Sami Mansoor',
    });

    expect(res.outputs.cardStatus).toBe('ACTIVE_CERTIFIED');
    expect(res.outputs.cpdRequirementMet).toBe(true);
  });

  it('executes T-CRM-001: Omnichannel WhatsApp client follow-up dispatch', () => {
    const res = executeWhatsAppBroadcastTask({
      recipientPhone: '+971509988776',
      clientName: 'Sheikh Hamdan',
    });

    expect(res.outputs.deliveryStatus).toBe('SENT_DELIVERED');
    expect(res.outputs.recipientPhone).toBe('+971509988776');
  });

  it('executes T-PORTAL-001: Bayut & Dubizzle portal syndication with Trakheesi permit', () => {
    const res = executePortalSyndicationTask({
      trakheesiPermit: 'TRAK-881920',
      listingPriceAED: '3500000',
    });

    expect(res.outputs.syndicationStatus).toBe('LIVE_INDEXED_ON_ALL_PORTALS');
    expect(res.outputs.targetPortals).toContain('Bayut.com');
  });

  it('executes T-VAL-001: AI Automated Valuation Model (AVM)', () => {
    const res = executePropertyValuationTask({
      areaSqft: '2000',
      ratePerSqft: '1500',
    });

    expect(res.outputs.fairMarketValueAED).toBe(3000000);
    expect(res.outputs.confidenceScore).toContain('94.8%');
  });

  it('executes T-SEC-001: FIDO2 WebAuthn & UAE Pass biometric audit', () => {
    const res = executeBiometricSecurityTask({
      userEmail: 'cto@whitecaves.ae',
    });

    expect(res.outputs.assuranceLevel).toContain('HIGH_GOVERNMENT_ASSURANCE');
    expect(res.outputs.authenticatedSubject).toBe('cto@whitecaves.ae');
  });

  it('verifies end-to-end task execution workflow across all 13 operational tools', () => {
    for (const toolTask of OPERATIONAL_TOOL_TASKS) {
      const result = executeTaskFunctionalRunWorkflow(toolTask);
      expect(result.success).toBe(true);
      expect(result.status).toBe('COMPLETED');
      expect(result.verificationPassed).toBe(true);
      expect(result.auditNotes.length).toBeGreaterThan(0);
      expect(result.awardedXp).toBeGreaterThan(0);
    }
  });
});
