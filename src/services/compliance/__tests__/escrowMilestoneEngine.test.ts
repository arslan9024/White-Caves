import { describe, it, expect } from 'vitest';
import { verifyDeveloperEscrowDisbursement, DeveloperEscrowProject } from '../escrowMilestoneEngine';

describe('Off-Plan Escrow Account Validator & Construction Milestone Engine', () => {
  it('approves deposits for healthy construction progress matching payment plans', () => {
    const project: DeveloperEscrowProject = {
      projectId: 'PRJ-EMAAR-001',
      projectName: 'Emaar South Fairway',
      masterDeveloper: 'EMAAR',
      escrowAccountNumber: '03400012998811',
      escrowBankName: 'Emirates NBD',
      reraProjectRegistrationNumber: 'RERA-PRJ-2489',
      constructionCompletionPercentage: 45,
      paymentsCollectedPercentage: 50, // 50% <= 45% + 20%
      targetHandoverDate: '2026-12-31',
      isEscrowActive: true
    };

    const res = verifyDeveloperEscrowDisbursement(project);
    expect(res.isValidForDeposit).toBe(true);
    expect(res.isMilestoneCompliant).toBe(true);
    expect(res.constructionLagRiskLevel).toBe('LOW_RISK');
    expect(res.maxPermissibleCollectionPercentage).toBe(65);
  });

  it('prohibits deposit if project escrow account is inactive', () => {
    const project: DeveloperEscrowProject = {
      projectId: 'PRJ-UNVERIFIED',
      projectName: 'Ghost Tower',
      masterDeveloper: 'DAMAC',
      escrowAccountNumber: '',
      escrowBankName: 'Dubai Islamic Bank',
      reraProjectRegistrationNumber: 'RERA-PENDING',
      constructionCompletionPercentage: 10,
      paymentsCollectedPercentage: 20,
      targetHandoverDate: '2027-01-01',
      isEscrowActive: false
    };

    const res = verifyDeveloperEscrowDisbursement(project);
    expect(res.isValidForDeposit).toBe(false);
    expect(res.constructionLagRiskLevel).toBe('CRITICAL_CONSTRUCTION_LAG');
    expect(res.statutoryWarning).toContain('UAE Law No. 8 of 2007');
  });

  it('detects critical construction lag when developer collects excessively ahead of site progress', () => {
    const project: DeveloperEscrowProject = {
      projectId: 'PRJ-LAGGING-002',
      projectName: 'Lagging Heights',
      masterDeveloper: 'SOBHA',
      escrowAccountNumber: '09811223344',
      escrowBankName: 'Mashreq Bank',
      reraProjectRegistrationNumber: 'RERA-PRJ-7711',
      constructionCompletionPercentage: 20, // Only 20% built
      paymentsCollectedPercentage: 60, // 60% > 20% + 20% (40% max allowed)
      targetHandoverDate: '2026-06-30',
      isEscrowActive: true
    };

    const res = verifyDeveloperEscrowDisbursement(project);
    expect(res.isValidForDeposit).toBe(false);
    expect(res.isMilestoneCompliant).toBe(false);
    expect(res.constructionLagRiskLevel).toBe('CRITICAL_CONSTRUCTION_LAG');
    expect(res.statutoryWarning).toContain('exceeding the statutory limit of 40%');
  });
});
